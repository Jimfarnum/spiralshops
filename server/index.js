// Load environment variables from .env file
import { config } from 'dotenv';
config();

import express from "express";
import { registerRoutes } from "./routes.ts";
import { setupVite, serveStatic, log } from "./vite.ts";
import { rateLimiter } from "./middleware/rateLimiter.js";
import wishlistRoutes from "./api/wishlist.ts";
import intelligentWishlistRoutes from "./api/intelligent-wishlist.ts";
import aiOpsStatusRoutes from "./api/ai-ops-status.js";
import businessCategoriesRoutes from "./api/business-categories.js";
import aiRetailerOnboardingRoutes from "./api/ai-retailer-onboarding.js";
import inventoryCategoriesRoutes from "./api/inventory-categories.js";
import aiOpsDashboardRoutes from "./api/ai-ops-dashboard.js";
import statusRoutes from "./routes/status.js";
import performanceFixes from "./performance-fixes.ts";
import { registerOptimizedStoreRoutes } from "./optimized-store-routes.ts";

const app = express();

// Apply performance monitoring and error handling FIRST
performanceFixes.addPerformanceMiddleware(app);
performanceFixes.addErrorHandling(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add rate limiting to all API routes
app.use('/api', rateLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register wishlist routes
  app.use("/api", wishlistRoutes);
  
  // Register intelligent wishlist routes
  app.use("/api", intelligentWishlistRoutes);
  
  // Register AI Ops status routes
  app.use("/api", aiOpsStatusRoutes);
  
  // Register business categories routes
  app.use("/api", businessCategoriesRoutes);
  
  // Register AI retailer onboarding routes
  app.use("/api", aiRetailerOnboardingRoutes);
  
  // Register inventory categories routes
  app.use("/api", inventoryCategoriesRoutes);
  
  // Register AI Ops dashboard routes
  app.use("/api", aiOpsDashboardRoutes);
  
  // Register comprehensive status routes
  app.use(statusRoutes);
  
  // Register Beta Testing routes
  const betaTestingRoutes = await import('./routes/betaTesting.js');
  app.use("/api/beta", betaTestingRoutes.default);
  
  // Register Stripe Testing routes
  const stripeTestRoutes = await import('./routes/stripeTest.js');
  app.use("/api/stripe-test", stripeTestRoutes.default);
  
  // Register Cloudant Status routes
  const cloudantStatusRoutes = await import('./routes/cloudant-status.js');
  app.use("/api", cloudantStatusRoutes.default);
  
  // Register optimized store routes BEFORE main routes for performance
  registerOptimizedStoreRoutes(app);
  
  const server = await registerRoutes(app);

  // Initialize AI Ops GPT System
  try {
    const { default: aiOps } = await import('./ai-ops.js');
    console.log("✅ SPIRAL AI Ops GPT system initialized successfully");
  } catch (error) {
    console.log("⚠️ AI Ops initialization error:", error.message);
  }

  // Initialize AI Dashboard Agents
  try {
    const aiDashboardAgentsRouter = await import('./routes/ai-dashboard-agents.js');
    app.use('/api', aiDashboardAgentsRouter.default);
    console.log('✅ AI Dashboard Agents registered: MallManager, Retailer, Shopper');
  } catch (error) {
    console.log("⚠️ AI Dashboard Agents initialization error:", error.message);
  }

  // Initialize SOAP G Central Brain System
  try {
    const soapGRouter = await import('./routes/soap-g-central-brain.js');
    app.use('/api', soapGRouter.default);
    console.log('🧠 SOAP G Central Brain routes mounted at /api');
    console.log('✅ Mall Manager AI, Retailer AI, Shopper Engagement AI');
    console.log('✅ Social Media AI, Marketing & Partnerships AI, Admin AI');
  } catch (error) {
    console.log("⚠️ SOAP G Central Brain initialization error:", error.message);
  }

  // Initialize Invite to Shop routes
  try {
    const inviteToShopRouter = await import('./routes/inviteToShop.js');
    app.use('/api/invite-to-shop', inviteToShopRouter.default);
    console.log('✅ Invite to Shop AI-enhanced workflow routes loaded successfully');
  } catch (error) {
    console.log("⚠️ Invite to Shop routes initialization error:", error.message);
  }

  // Initialize QR Code routes
  try {
    const qrInviteRouter = await import('./routes/qrInviteRoutes.js');
    app.use('/api/qr', qrInviteRouter.default);
    console.log('✅ QR Code generation and analytics routes loaded successfully');
  } catch (error) {
    console.log("⚠️ QR routes initialization error:", error.message);
  }

  // Initialize QR Campaign Templates routes
  try {
    const qrCampaignTemplatesRouter = await import('./routes/qrCampaignTemplates.js');
    app.use('/api/qr', qrCampaignTemplatesRouter.default);
    console.log('✅ QR Campaign Templates routes loaded successfully');
  } catch (error) {
    console.log("⚠️ QR Campaign Templates routes initialization error:", error.message);
  }

  // Initialize Internal Platform Monitor
  try {
    const internalMonitorRouter = await import('./routes/internal-platform-monitor.js');
    app.use('/api/internal-monitor', internalMonitorRouter.default);
    console.log('🤖 Internal Platform AI Agent routes loaded successfully');
    console.log('✅ Continuous monitoring: UI/UX, bottlenecks, crash points, onboarding');
  } catch (error) {
    console.log("⚠️ Internal Platform Monitor initialization error:", error.message);
  }

  // Initialize Site Testing Agent
  try {
    const siteTestingRouter = await import('./routes/site-testing-agent.js');
    app.use('/api/site-testing', siteTestingRouter.default);
    console.log('🧪 Site Testing AI Agent routes loaded successfully');
    console.log('✅ Real-time user journey testing: Homepage, Products, Stores, Signup flows');
  } catch (error) {
    console.log("⚠️ Site Testing Agent initialization error:", error.message);
  }

  // Initialize Continuous Optimization Agent
  try {
    const continuousOptimizationRouter = await import('./routes/continuous-optimization-agent.js');
    app.use('/api/continuous-optimization', continuousOptimizationRouter.default);
    console.log('🔄 Continuous Optimization AI Agent routes loaded successfully');
    console.log('✅ Automated performance monitoring, testing, and optimization');
  } catch (error) {
    console.log("⚠️ Continuous Optimization Agent initialization error:", error.message);
  }

  // Initialize Admin Command Center
  try {
    const adminCommandCenterRouter = await import('./routes/adminCommandCenter.js');
    app.use('/api/admin-command-center', adminCommandCenterRouter.default);
    console.log('🎛️ Admin Command Center initialized with enhanced KPI collection');
  } catch (error) {
    console.log("⚠️ Admin Command Center initialization error:", error.message);
  }

  // Enhanced TechWatch Agent routes registration
  try {
    const techWatchRouter = await import('./routes/techwatch.js');
    app.use('/api/techwatch', techWatchRouter.default);
    console.log('✅ Enhanced TechWatch agent routes loaded successfully');
  } catch (error) {
    console.log('⚠️ TechWatch routes initialization error:', error.message);
  }

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT environment variable (Replit injects this) or fallback to 5000
  // This serves both the API and the client.
  const PORT = process.env.PORT || 5000;
  server.listen({
    port: PORT,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Server listening on ${PORT}`);
  });
})();