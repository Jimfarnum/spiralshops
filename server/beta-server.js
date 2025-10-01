// 🔧 SPIRAL Beta Server Replacement
// Fixes: Image URLs, Discover response, and Adds Plans endpoint

import OpenAI from "openai";
import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Enable JSON parsing
app.use(express.json());

// Base URL for serving absolute image paths
const BASE_URL =
  process.env.BASE_URL ||
  "https://27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev";

// Ensure static cache directory exists
const staticDir = path.resolve("static/images");
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}
app.use("/images", express.static(staticDir));

// Beta product list with real data
let products = [
  { id: 101, name: "Beta Denim Jacket", price: 49.99, image: "https://via.placeholder.com/300" },
  { id: 102, name: "Beta Hiking Boots", price: 99.99, image: "https://via.placeholder.com/300" },
  { id: 103, name: "Beta Coffee Mug", price: 14.99, image: "https://via.placeholder.com/300" },
  { id: 104, name: "Designer Handbag", price: 149.99, image: "https://via.placeholder.com/300" },
  { id: 105, name: "Artisan Chocolate", price: 12.99, image: "https://via.placeholder.com/300" },
];

// Helper: download AI image and save
async function downloadImage(url, filePath) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer", timeout: 8000 });
    fs.writeFileSync(filePath, Buffer.from(response.data), "binary");
    console.log(`💾 Saved image at ${filePath}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to save ${filePath}:`, err.message);
    return false;
  }
}

// Core: generate or backfill product images
async function ensureImages(refreshAll = false) {
  console.log(refreshAll ? "♻️ Force refreshing ALL product images..." : "🔄 Ensuring product images...");
  
  for (const product of products) {
    const fileName = `beta-${product.id}.png`;
    const filePath = path.join(staticDir, fileName);

    if (!refreshAll && fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
      // Already cached
      product.image = `${BASE_URL}/public-objects/${fileName}`;
      console.log(`⚡ Cache hit: ${product.name}`);
      continue;
    }

    try {
      // 🔧 Fixed: Use dall-e-2 instead of gpt-image-1
      const result = await client.images.generate({
        model: "dall-e-2",
        prompt: `Professional product photo of ${product.name}, clean white background, high quality, commercial photography style`,
        size: "512x512",
        n: 1,
      });

      const imageUrl = result.data[0].url;
      const downloadSuccess = await downloadImage(imageUrl, filePath);

      if (downloadSuccess && fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
        product.image = `${BASE_URL}/public-objects/${fileName}`;
        console.log(`✅ Image ready for ${product.name} → ${product.image}`);
      } else {
        throw new Error("File did not save correctly");
      }
    } catch (err) {
      console.error(`⚠️ Could not generate image for ${product.name}:`, err.message);
      product.image = "https://via.placeholder.com/300?text=" + encodeURIComponent(product.name);
    }
  }
  console.log("🎯 Image generation complete!");
}

// ----------------------
// API Endpoints
// ----------------------

// Health check
app.get("/", (req, res) => {
  res.json({ 
    status: "operational", 
    message: "SPIRAL Beta Server is running",
    products: products.length,
    timestamp: new Date().toISOString()
  });
});

// Products feed (absolute image URLs)
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Featured products (same as products for now)
app.get("/api/products/featured", (req, res) => {
  res.json(products);
});

// Discover feed (flat array, same shape as products)
app.get("/api/discover", (req, res) => {
  res.json(products);
});

// Plans feed (Stripe Price IDs from env)
app.get("/api/plans", (req, res) => {
  res.json([
    { name: "Silver", id: process.env.STRIPE_PRICE_SILVER || "price_missing_silver" },
    { name: "Gold", id: process.env.STRIPE_PRICE_GOLD || "price_missing_gold" },
  ]);
});

// Monitoring endpoint: check cache + product images
app.get("/api/beta-memory-status", (req, res) => {
  try {
    const files = fs.readdirSync(staticDir).filter(f => f.startsWith('beta-'));
    res.json({
      status: "operational",
      cachedImages: files.length,
      totalFiles: files,
      productImages: products.map((p) => ({ 
        id: p.id,
        name: p.name, 
        image: p.image,
        hasCachedFile: files.includes(`beta-${p.id}.png`)
      })),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to check cache status",
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced memory status (compatible with existing system)
app.get("/api/memory-status", (req, res) => {
  try {
    const files = fs.readdirSync(staticDir);
    const betaFiles = files.filter(f => f.startsWith('beta-'));
    const totalSize = files.reduce((size, file) => {
      const filePath = path.join(staticDir, file);
      return size + fs.statSync(filePath).size;
    }, 0);

    res.json({
      status: "operational",
      cacheDirectory: staticDir,
      cachedImages: betaFiles.length,
      totalCacheSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      productImageStatus: products.map(p => ({
        productId: p.id,
        name: p.name,
        hasCache: betaFiles.includes(`beta-${p.id}.png`),
        imageUrl: p.image,
        cacheFileName: `beta-${p.id}.png`
      })),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to check memory status",
      timestamp: new Date().toISOString()
    });
  }
});

// Force-refresh endpoint: regenerate all images
app.post("/api/beta-refresh-images", async (req, res) => {
  try {
    await ensureImages(true);
    res.json({ 
      status: "ok", 
      message: "Force refresh complete", 
      products: products.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Force refresh failed",
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Stores endpoint (basic compatibility)
app.get("/api/stores", (req, res) => {
  res.json([
    { id: 1, name: "Beta Store", location: "Downtown", category: "Fashion" }
  ]);
});

// Basic placeholder generator for compatibility
app.get("/api/placeholder/:width/:height", (req, res) => {
  const { width, height } = req.params;
  const placeholderUrl = `https://via.placeholder.com/${width}x${height}?text=SPIRAL+Placeholder`;
  res.redirect(placeholderUrl);
});

// ----------------------
// Startup
// ----------------------
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log("🚀 Starting SPIRAL Beta Server...");
    await ensureImages(false);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🎯 SPIRAL Beta Server running at ${BASE_URL} on port ${PORT}`);
      console.log(`📊 ${products.length} products available with AI images`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();