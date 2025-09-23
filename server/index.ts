import express from "express";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import fs from "fs";
import axios from "axios";
import { applySecurity } from "./security.js";
import { tenantMiddleware } from "./tenant.js";
import { SpiralApi } from "./spiralApi.js";

// 🔧 OpenAI for AI image generation with caching
import OpenAI from "openai";
// Use existing cache system instead
// import { memoize } from "./cache.js";
import { mountClara } from "./clara.js";
import { mountMetrics } from "./metrics.js";
import { cfg, loadMallTheme } from "./config.js";
import { validateAndHealMultipleImages } from "./utils/imageHealing.js";

// SPIRAL Core API routes
import shopperRoutes from "./routes/shopper.js";
import mallsRoutes from "./routes/malls.js";
import ordersRoutes from "./routes/orders.js";
import onboardingRoutes from "./routes/onboarding.js";
import legalRoutes from "./routes/legal.js";
import adminPromotionsRoutes from "./routes/adminPromotions.js";
import retailerRoutes from "./routes/retailer.js";
import seasonalPromotionsRoutes from "./routes/seasonalPromotions.js";
import spiralsRouter from "./routes/spirals.js";
import productsRoute from "./routes/products.js";

// Enhanced PostgreSQL-backed routes
import enhancedMallsRoutes from "./routes/enhancedMalls.js";
import enhancedRetailersRoutes from "./routes/enhancedRetailers.js";
import enhancedComplianceRoutes from "./routes/enhancedCompliance.js";

// Security monitoring routes
import securityHealthRoutes from "./routes/securityHealth.js";

// EJ AI Agent - PhD Level GTM Strategist
import ejAgentRouter from "./routes/ejAgent.js";

// Stripe Billing System imports
import billing from "./routes/billing.js";
import webhookRouter from "./routes/stripeWebhooks.js";
import demoGated from "./routes/demoGated.js";
import { retailerContext } from "./middleware/retailerContext.js";

// Beta API routes
import betaApiRouter from "./routes/betaApi.js";
import shareApiRouter from "./routes/shareApi.js";

// 🔒 Security middleware for AI endpoints
import { adminRefreshLimiter, requireAdminAuth, costProtection, aiOperationLogger } from './middleware/security.js';

// Vite development server setup
import { createServer } from "http";
import { setupVite } from "./vite.js";

const app = express();

// 🔧 Initialize OpenAI client for AI image generation  
// Deploy trigger: 2025-09-23T22:00:00Z - FIXED vercel.json routing + domain config
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🗂️ Setup static images directory and serving
const staticImagesDir = path.join(process.cwd(), "static/images");
if (!fs.existsSync(staticImagesDir)) {
  fs.mkdirSync(staticImagesDir, { recursive: true });
  console.log(`📁 Created static images directory: ${staticImagesDir}`);
}
app.use("/images", express.static(staticImagesDir));
console.log("🖼️ Static images directory mounted at /images");

// --- Image Normalizer Middleware ---
function absolutize(image: string, req: any) {
  if (!image || typeof image !== "string")
    return `https://via.placeholder.com/300?text=No+Image`;
  if (/^https?:\/\//.test(image)) return image;
  const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  const p = image.startsWith("/") ? image : "/" + image;
  return base + p;
}

function normalize(payload: any, req: any) {
  const arr = Array.isArray(payload)
    ? payload
    : payload && Array.isArray(payload.items)
    ? payload.items
    : null;
  if (!arr) return payload;
  return arr.map((p) => ({ ...p, image: absolutize(p.image, req) }));
}

// Apply to products and discover endpoints
app.use(["/api/products", "/api/discover"], (req, res, next) => {
  const original = res.json.bind(res);
  res.json = (body: any) => {
    try {
      return original(normalize(body, req));
    } catch {
      return original(body);
    }
  };
  next();
});

// Object Storage serving for public images
import { ObjectStorageService } from "./objectStorage.js";
app.get("/public-objects/:filePath(*)", async (req, res) => {
  const filePath = req.params.filePath;
  const objectStorageService = new ObjectStorageService();
  try {
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    objectStorageService.downloadObject(file, res);
  } catch (error) {
    console.error("Error searching for public object:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 🔧 Optimized download image helper with enhanced verification
async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    console.log(`📥 Downloading image to: ${filePath}`);
    const response = await axios.get(url, { 
      responseType: "arraybuffer",
      timeout: 15000,
      maxRedirects: 5
    });
    
    // Ensure directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    // Write file with binary buffer handling for better reliability
    fs.writeFileSync(filePath, Buffer.from(response.data), "binary");
    console.log(`💾 Saved image at ${filePath}`);
    
    // Enhanced verification: check file exists AND has content
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        console.log(`✅ Successfully cached AI image: ${path.basename(filePath)} (${stats.size} bytes)`);
        return true;
      } else {
        console.error(`⚠️ File saved but has 0 bytes: ${filePath}`);
        return false;
      }
    } else {
      console.error(`⚠️ File verification failed for ${filePath}`);
      return false;
    }
  } catch (err) {
    console.error("❌ Image download/save failed:", err.message);
    return false;
  }
}

// CRITICAL on Vercel/IBM to avoid https redirect loops
app.set("trust proxy", true);

// Optional: force HTTPS (safe w/ trust proxy) - skip for localhost in development
app.use((req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  if (isDev && isLocalhost) return next(); // Allow HTTP for local development
  
  const xfProto = req.headers["x-forwarded-proto"];
  if (req.secure || xfProto === "https") return next();
  return res.redirect(308, `https://${req.headers.host}${req.originalUrl}`);
});

// Optional: canonical host (set CANONICAL_HOST env or remove this block)
const CANON = process.env.CANONICAL_HOST; // e.g., "spiralshops.com"
app.use((req, res, next) => {
  if (!CANON) return next();
  const host = (req.headers.host || "").toLowerCase();
  if (host !== CANON) return res.redirect(308, `https://${CANON}${req.originalUrl}`);
  next();
});

// Security/infra
applySecurity(app);
app.use(morgan("tiny"));
app.use(compression());

// CRITICAL: Mount Stripe webhook BEFORE JSON parsers for signature verification
// This prevents JSON parsing from consuming the raw body needed for signature verification
app.use("/api/billing/webhook", express.raw({ type: "application/json" }), webhookRouter);
console.log("✅ Stripe webhook endpoint mounted at /api/billing/webhook (BEFORE JSON parsers)");

// Global parsers (mounted AFTER webhook to avoid interfering with signature verification)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// Retailer context middleware (for billing system)
app.use(retailerContext);

// Tenant context
app.use(tenantMiddleware);

// Health (JSON only)
app.get("/healthz", (_req, res) =>
  res.type("application/json").status(200).json({
    ok: true, service: "spiral-mall-integration", env: cfg.env, mode: "beta", ts: Date.now()
  })
);

// APIs (JSON) — BEFORE static
app.get("/api/health", (req: any, res) =>
  res.type("application/json").json({ ok: true, mall: req.mallId || cfg.mallId, ts: Date.now() })
);

app.get("/api/theme", (req: any, res) =>
  res.type("application/json").json(loadMallTheme(req.mallId || cfg.mallId!))
);

// SPIRAL Core API endpoints
app.use("/api/shopper", shopperRoutes);
app.use("/api/malls", mallsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/legal", legalRoutes);
app.use("/api/admin/promotions", adminPromotionsRoutes);
app.use("/api/retailer", retailerRoutes);
app.use("/api/seasonal", seasonalPromotionsRoutes);
app.use("/api/spirals", spiralsRouter);
app.use("/api/products", productsRoute);
console.log("✅ SPIRALS loyalty system router mounted at /api/spirals");

// Enhanced PostgreSQL-backed API endpoints
app.use("/api/v2/malls", enhancedMallsRoutes);
app.use("/api/v2/retailers", enhancedRetailersRoutes);
app.use("/api/v2/compliance", enhancedComplianceRoutes);
console.log("✅ Enhanced PostgreSQL routes mounted at /api/v2/*");

// 🔒 Security Health & Monitoring
app.use("/api/security", securityHealthRoutes);
console.log("✅ Security Health & Monitoring mounted at /api/security");

// EJ AI Agent - PhD Level GTM Strategist
app.use("/api/ej", ejAgentRouter);
console.log("✅ EJ AI Agent (PhD GTM Strategist) mounted at /api/ej");

// Stripe Billing System routes (webhook already mounted before JSON parsers)
app.use("/api/billing", billing);
app.use("/api/gated", demoGated);
console.log("✅ Stripe Billing System (Free/Silver/Gold) mounted at /api/billing");

// Beta API System
app.use("/api/beta", betaApiRouter);
console.log("✅ Beta API System mounted at /api/beta");

// Share API System  
app.use("/api/share", shareApiRouter);
console.log("✅ Share API System mounted at /api/share");

// 🔒 SECURE AI Image Generation System
import generateImagesRouter from "./routes/generateImages.js";
app.use("/api/images", generateImagesRouter);
console.log("✅ SECURE AI Image Generation System mounted at /api/images");

// Product Images Download/Upload System
app.get("/api/download/product-images-template", (req, res) => {
  const csvPath = path.join(__dirname, "../SPIRAL_Product_Images_Template.csv");
  res.download(csvPath, "SPIRAL_Product_Images_Template.csv");
});

app.get("/api/download/image-instructions", (req, res) => {
  const mdPath = path.join(__dirname, "../IMAGE_UPLOAD_INSTRUCTIONS.md");
  res.download(mdPath, "SPIRAL_Image_Upload_Instructions.md");
});

console.log("✅ Product Images Download System mounted at /api/download");

// 🔧 Remove duplicate /api/products/featured route - using canonical router implementation

// ✅ Add normalization function at top of server
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x400.png?text=No+Image";

// Helper function to normalize image paths
function normalizePath(imagePath: string | undefined | null): string {
  if (!imagePath || imagePath.trim() === '') return '/images/default-product.png';
  
  const cleanPath = imagePath.trim();
  
  // If it's already a proper /images/ path, return it
  if (cleanPath.startsWith('/images/')) return cleanPath;
  
  // Convert static/images/ or /static/images/ to /images/
  if (cleanPath.includes('static/images/')) {
    return cleanPath.replace(/.*static\/images\//, '/images/');
  }
  
  // If it's just a filename, prepend /images/
  if (!cleanPath.startsWith('/')) {
    return `/images/${cleanPath}`;
  }
  
  // If it starts with /images but no slash, fix it
  if (cleanPath.startsWith('images/')) {
    return `/${cleanPath}`;
  }
  
  return cleanPath;
}

function normalizeProducts(products: any[]) {
  if (!Array.isArray(products)) return products;
  return products.map(p => {
    // Coalesce image/imageUrl/images[0] and normalize the path
    const imageSource = p.image || p.imageUrl || (p.images?.[0] ?? '');
    const normalizedImage = normalizePath(imageSource);
    
    return {
      ...p,
      image: normalizedImage, // Always use 'image' field
      imageUrl: normalizedImage // Set both for compatibility
    };
  });
}

// 🔧 SPIRAL AI Image Pre-Generator - Runs at startup to cache all product images
async function preGenerateImages() {
  console.log("🔄 Starting AI pre-generation for products...");
  
  try {
    // Get all products from SpiralApi
    const productsResponse = await SpiralApi.products("", {});
    const products = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];
    
    console.log(`🎨 Pre-generating images for ${products.length} products...`);
    
    for (const product of products) {
      // 🔒 Security: Sanitize product ID to prevent path traversal
      const sanitizedId = String(product.id).replace(/[^A-Za-z0-9_-]/g, '');
      if (!sanitizedId) {
        console.warn(`⚠️ Skipping product with invalid ID: ${product.id}`);
        continue;
      }
      
      const fileName = `beta-${sanitizedId}.png`;
      const filePath = path.join(staticImagesDir, fileName);
      
      // 🔒 Security: Verify file path is within allowed directory
      if (!filePath.startsWith(staticImagesDir)) {
        console.warn(`⚠️ Security: Blocked path traversal attempt for ${product.name}`);
        continue;
      }

      // Check if already cached
      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
        console.log(`⚡ Cache hit for ${product.name}`);
        continue;
      }

      try {
        console.log(`🎨 Generating AI image for: ${product.name}`);
        
        const result = await openaiClient.images.generate({
          model: "dall-e-2",
          prompt: `Professional product photo of ${product.name}, clean white background, high quality, commercial photography style`,
          size: "512x512",
          n: 1,
        });

        const imageUrl = result.data[0].url;
        const downloadSuccess = await downloadImage(imageUrl, filePath);

        if (downloadSuccess && fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
          console.log(`✅ Pre-generated AI image for ${product.name}`);
        } else {
          throw new Error("File did not save correctly");
        }
      } catch (err) {
        console.error(`⚠️ Could not generate image for ${product.name}:`, err.message);
        // Continue to next product - placeholders will be handled in API
      }
    }
    
    console.log("🎯 Pre-generation complete!");
  } catch (err) {
    console.error("❌ Pre-generation failed:", err.message);
  }
}

// 🔧 Enhanced AI image generation with timeout and parallel processing (kept for compatibility)
async function attachAIImages(products: any[]) {
  // Now just attaches cached images or placeholders - no generation
  for (const product of products) {
    // 🔒 Security: Sanitize product ID to prevent path traversal
    const sanitizedId = String(product.id).replace(/[^A-Za-z0-9_-]/g, '');
    if (!sanitizedId) {
      product.image = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(product.name)}`;
      continue;
    }
    
    const fileName = `beta-${sanitizedId}.png`;
    const filePath = path.join(staticImagesDir, fileName);
    
    // 🔒 Security: Verify file path is within allowed directory
    if (!filePath.startsWith(staticImagesDir)) {
      product.image = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(product.name)}`;
      continue;
    }
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
      // Serve all cached images via /images/ static route
      product.image = `/images/${fileName}`;
    } else {
      product.image = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(product.name)}`;
    }
  }
  
  return products;
}

// 🔧 AI Image Cache Monitoring Endpoint - Enhanced Status & Statistics  
app.get("/api/memory-status", async (req: any, res) => {
  try {
    const files = fs.readdirSync(staticImagesDir);
    const cachedImageFiles = files.filter(f => f.endsWith('.png'));
    
    // Get detailed file info
    const imageDetails = cachedImageFiles.map(fileName => {
      const filePath = path.join(staticImagesDir, fileName);
      const stats = fs.statSync(filePath);
      return {
        fileName,
        size: stats.size,
        created: stats.birthtime.toISOString(),
        productId: fileName.replace('beta-', '').replace('.png', '')
      };
    });
    
    const totalCacheSize = imageDetails.reduce((sum, img) => sum + img.size, 0);
    
    // 🆕 Enhanced monitoring: Get product image status like Beta code
    let productImageStatus = [];
    try {
      const productsResponse = await SpiralApi.products(req.mallId, {});
      const products = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];
      
      productImageStatus = products.map((product: any) => {
        const sanitizedId = String(product.id).replace(/[^A-Za-z0-9_-]/g, '');
        const fileName = `beta-${sanitizedId}.png`;
        const filePath = path.join(staticImagesDir, fileName);
        const hasCache = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
        
        return {
          productId: product.id,
          name: product.name,
          hasCache,
          imageUrl: hasCache ? `/images/${fileName}` : null,
          cacheFileName: hasCache ? fileName : null
        };
      });
    } catch (err) {
      console.error("❌ Could not fetch product status:", err.message);
    }
    
    res.json({
      status: "operational", 
      cacheDirectory: staticImagesDir,
      cachedImages: cachedImageFiles.length,
      totalCacheSize: `${(totalCacheSize / 1024 / 1024).toFixed(2)} MB`,
      imageDetails,
      productImageStatus, // 🆕 Enhanced: Shows which products have cached images
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ Memory status check failed:", err.message);
    res.status(500).json({ 
      error: "Failed to check cache status",
      cacheDirectory: staticImagesDir,
      timestamp: new Date().toISOString()
    });
  }
});

// 🔒 SECURE Force Refresh Endpoint - Regenerates ALL Product Images with Object Storage
app.post("/api/beta-refresh-images", 
  requireAdminAuth,
  adminRefreshLimiter,
  costProtection,
  aiOperationLogger('beta-refresh-images'),
  async (req: any, res) => {
  
  console.log("🔒 SECURE force refresh triggered by admin: regenerating all SPIRAL product images with object storage...");
  
  try {
    // Initialize object storage service for secure image storage
    const { ObjectStorageService } = await import('./objectStorage.js');
    const objectStorageService = new ObjectStorageService();
    
    // Get all products from SpiralApi (not hardcoded like Beta code)
    const productsResponse = await SpiralApi.products(req.mallId, {});
    const products = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];
    
    const results = [];
    let successCount = 0;
    
    for (const product of products) {
      // 🔒 Security: Sanitize product ID to prevent path traversal
      const sanitizedId = String(product.id).replace(/[^A-Za-z0-9_-]/g, '');
      if (!sanitizedId) {
        console.warn(`⚠️ Skipping product with invalid ID: ${product.id}`);
        results.push({
          productId: product.id,
          name: product.name,
          status: "skipped",
          reason: "Invalid product ID"
        });
        continue;
      }

      try {
        console.log(`🔄 SECURE force refreshing AI image for: ${product.name}`);
        
        // 🔧 Generate image with secure OpenAI API
        const result = await openaiClient.images.generate({
          model: "dall-e-2",
          prompt: `Professional product photo of ${product.name}, clean white background, high quality, commercial photography style`,
          size: "512x512",
          n: 1,
        });

        const imageUrl = result.data[0].url;
        
        // 🔒 SECURE: Download and store in object storage instead of local filesystem
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.statusText}`);
        }
        
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);
        const fileName = `beta-${sanitizedId}.png`;
        
        // Store securely in object storage
        const storedPath = await objectStorageService.uploadFileToPublic(fileName, imageBuffer, 'image/png');
        
        console.log(`✅ SECURE force refreshed AI image for ${product.name}: ${storedPath}`);
        successCount++;
        results.push({
          productId: product.id,
          name: product.name,
          status: "refreshed",
          imageUrl: storedPath, // Object storage path
          fileName: fileName,
          secureStorage: true
        });

      } catch (err) {
        console.error(`⚠️ SECURE refresh failed for ${product.name}:`, err.message);
        results.push({
          productId: product.id,
          name: product.name,
          status: "failed",
          error: err.message
        });
      }
      
      // Rate limiting: delay between requests to avoid overwhelming OpenAI API
      if (products.indexOf(product) < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    const failureCount = results.filter(r => r.status === "failed").length;
    
    console.log(`🎯 SECURE force refresh complete! ${successCount} succeeded, ${failureCount} failed`);
    
    res.json({ 
      status: "ok", 
      message: `SECURE force refresh complete: ${successCount} succeeded, ${failureCount} failed`,
      totalProducts: products.length,
      successCount,
      failureCount,
      results,
      securityEnabled: true,
      objectStorageEnabled: true,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ Force refresh failed:", err.message);
    res.status(500).json({
      status: "error",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ✅ Products API with pre-cached images (instant response)
app.get("/api/products", async (req: any, res) => {
  try {
    const productsResponse = await SpiralApi.products(req.mallId, req.query as any);
    let products = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];

    // 🚀 Attach pre-cached images (instant, no generation delay)
    products = await attachAIImages(products);

    const response = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
    }));

    res.json(response);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Health/test route with product count
app.get("/api/test", async (req: any, res) => {
  try {
    const productsResponse = await SpiralApi.products(req.mallId, req.query as any);
    const products = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];
    res.json({ 
      status: "ok", 
      products: products.length,
      ai_images: "enabled",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({ 
      status: "error", 
      products: 0,
      ai_images: "enabled",
      error: err.message
    });
  }
});

// ✅ Test product route for image verification  
app.get("/api/test-product", (req, res) => {
  res.json({
    id: 999,
    name: "Test Product",
    price: 0,
    image: "https://spiralshops-cdn.com/images/test-image.png"
  });
});

// ✅ Discover endpoint (flat array, same shape as products)
app.get("/api/discover", async (req: any, res) => {
  try {
    const productsResponse = await SpiralApi.products(req.mallId, req.query as any);
    let products = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];

    // 🚀 Attach pre-cached images (instant, no generation delay)
    products = await attachAIImages(products);

    // Return flat array format (same as products endpoint)
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching discover products:", err);
    res.status(500).json({ error: "Failed to fetch discover products" });
  }
});

// ✅ Plans endpoint (Stripe Price IDs from env)
app.get("/api/plans", (req, res) => {
  res.json([
    { name: "Silver", id: process.env.STRIPE_PRICE_SILVER || "price_missing_silver" },
    { name: "Gold", id: process.env.STRIPE_PRICE_GOLD || "price_missing_gold" },
  ]);
});

// 🔧 REMOVED: Duplicate /api/products/featured route - using canonical implementation in server/routes/products.ts

app.get("/api/stores", async (req: any, res, next) => {
  try { res.type("application/json").json(await SpiralApi.stores(req.mallId, req.query as any)); }
  catch (e) { next(e); }
});

app.get("/api/search", async (req: any, res, next) => {
  try {
    const q = String(req.query.q || "");
    res.type("application/json").json(await SpiralApi.search(req.mallId, q));
  } catch (e) { next(e); }
});

/**
 * --- SPIRAL Phase 2 Test Routes ---
 * These endpoints feed mock/demo JSON for frontend validation
 */

// Entities (stores + malls)
app.get("/test/entities", (req, res) => {
  res.json({
    ok: true,
    entities: [
      { type: "store", name: "North Loop Coffee", category: "Cafe", zipCode: "55401" },
      { type: "mall", name: "Mall of America", location: "Bloomington, MN" }
    ]
  });
});

// Rewards (shopper rewards dashboard)
app.get("/test/rewards", (req, res) => {
  const txs = [
    { id: "tx1", earned: 200, txnType: "earn", store: "North Loop Coffee", ts: "2025-09-01T10:00:00Z" },
    { id: "tx2", redeemed: 100, txnType: "redeem", store: "Mill City Boutique", ts: "2025-09-05T14:30:00Z" }
  ];

  res.json({
    ok: true,
    rewards: {
      balance: 1500,
      lifetimeEarned: 2000,
      lifetimeRedeemed: 500,
      recent: txs
    }
  });
});

// Mall events
app.get("/test/events", (req, res) => {
  res.json({
    ok: true,
    events: [
      { mall: "Mall of America", title: "Makers Market", date: "2025-10-05", description: "Pop-up artisans." },
      { mall: "Ridgedale Center", title: "Fall Fashion Night", date: "2025-10-18", description: "Runway + discounts." }
    ]
  });
});

// Combined dashboard (entities + rewards + events)
app.get("/test/dashboard", (req, res) => {
  res.json({
    ok: true,
    dashboard: {
      entities: [
        { type: "store", name: "North Loop Coffee", category: "Cafe", zipCode: "55401" },
        { type: "mall", name: "Mall of America", location: "Bloomington, MN" }
      ],
      rewards: {
        balance: 1500,
        lifetimeEarned: 2000,
        lifetimeRedeemed: 500,
        recent: [
          { id: "tx1", earned: 200, txnType: "earn", store: "North Loop Coffee", ts: "2025-09-01T10:00:00Z" },
          { id: "tx2", redeemed: 100, txnType: "redeem", store: "Mill City Boutique", ts: "2025-09-05T14:30:00Z" }
        ]
      },
      events: [
        { mall: "Mall of America", title: "Makers Market", date: "2025-10-05", description: "Pop-up artisans." },
        { mall: "Ridgedale Center", title: "Fall Fashion Night", date: "2025-10-18", description: "Runway + discounts." }
      ]
    }
  });
});

// Clara + Metrics (JSON) — BEFORE static & SPA
mountClara(app);
mountMetrics(app);

// Static AFTER APIs
app.use("/static", express.static("dist", { fallthrough: false, immutable: true, maxAge: "30d" }));
app.use("/avatars", express.static("public/avatars", { fallthrough: true, maxAge: "30d" }));

// Fallback route for legacy /static/images paths -> redirect to /images
app.use("/static/images", (req, res) => {
  res.redirect(308, req.originalUrl.replace('/static/images', '/images'));
});

// SPA fallback is handled by Vite middleware in setupVite() - no need for custom fallback

// Error handler — JSON for API paths
app.use((err: any, req: express.Request, res: express.Response, _next: any) => {
  const wantsJson = req.path.startsWith("/api") || req.path === "/healthz";
  const status = Number(err?.status || 500);
  const payload = { ok: false, error: String(err?.message || err || "Internal Error") };
  if (wantsJson) return res.status(status).type("application/json").json(payload);
  res.status(status).send(payload.error);
});

// Setup Vite development server for SPA routing
async function startServer() {
  const httpServer = createServer(app);
  
  if (process.env.NODE_ENV === 'development') {
    // Mount Vite middleware for dev server + SPA fallback
    await setupVite(app, httpServer);
    console.log("✅ Vite development middleware mounted");
  } else {
    // In production, serve static files and SPA fallback would be handled differently
    console.log("✅ Production mode - static serving");
  }
  
  httpServer.listen(cfg.port, () => console.log(`🚀 Server running on port ${cfg.port}`));
}

// 🚀 SPIRAL AI Pre-Generator Startup: Pre-generate images BEFORE serving requests
(async () => {
  try {
    // Pre-generate all product images at startup
    await preGenerateImages();
    
    // Then start the server
    await startServer();
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
