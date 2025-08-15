// Load environment variables from .env file
import { config } from 'dotenv';
config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { rateLimiter } from "./middleware/rateLimiter.js";
import wishlistRoutes from "./api/wishlist";
import intelligentWishlistRoutes from "./api/intelligent-wishlist";
// @ts-ignore - JS modules without type declarations
import aiOpsStatusRoutes from "./api/ai-ops-status.js";
// @ts-ignore
import businessCategoriesRoutes from "./api/business-categories.js";
// @ts-ignore
import aiRetailerOnboardingRoutes from "./api/ai-retailer-onboarding.js";
// @ts-ignore
import inventoryCategoriesRoutes from "./api/inventory-categories.js";
// @ts-ignore
import aiOpsDashboardRoutes from "./api/ai-ops-dashboard.js";
// @ts-ignore
import statusRoutes from "./routes/status.js";
import performanceFixes from "./performance-fixes";
import { registerOptimizedStoreRoutes } from "./optimized-store-routes";

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
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

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
  // @ts-ignore
  const cloudantStatusRoutes = await import('./routes/cloudant-status.js');
  app.use("/api", cloudantStatusRoutes.default);
  
  // Register optimized store routes BEFORE main routes for performance
  registerOptimizedStoreRoutes(app);
  
  const server = await registerRoutes(app);

  // Initialize AI Ops GPT System
  try {
    // @ts-ignore
    const { default: aiOps } = await import('./ai-ops.js');
    console.log("✅ SPIRAL AI Ops GPT system initialized successfully");
  } catch (error: any) {
    console.log("⚠️ AI Ops initialization error:", error.message);
  }

  // Initialize AI Dashboard Agents
  try {
    // @ts-ignore
    const aiDashboardAgentsRouter = await import('./routes/ai-dashboard-agents.js');
    app.use('/api', aiDashboardAgentsRouter.default);
    console.log('✅ AI Dashboard Agents registered: MallManager, Retailer, Shopper');
  } catch (error: any) {
    console.log("⚠️ AI Dashboard Agents initialization error:", error.message);
  }

  // Initialize SOAP G Central Brain System
  try {
    // @ts-ignore
    const soapGRouter = await import('./routes/soap-g-central-brain.js');
    app.use('/api', soapGRouter.default);
    console.log('🧠 SOAP G Central Brain routes mounted at /api');
    console.log('✅ Mall Manager AI, Retailer AI, Shopper Engagement AI');
    console.log('✅ Social Media AI, Marketing & Partnerships AI, Admin AI');
  } catch (error: any) {
    console.log("⚠️ SOAP G Central Brain initialization error:", error.message);
  }

  // Initialize Invite to Shop routes
  try {
    // @ts-ignore
    const inviteToShopRouter = await import('./routes/inviteToShop.js');
    app.use('/api/invite-to-shop', inviteToShopRouter.default);
    console.log('✅ Invite to Shop AI-enhanced workflow routes loaded successfully');
  } catch (error: any) {
    console.log("⚠️ Invite to Shop routes initialization error:", error.message);
  }

  // Initialize QR Code routes
  try {
    // @ts-ignore
    const qrInviteRouter = await import('./routes/qrInviteRoutes.js');
    app.use('/api/qr', qrInviteRouter.default);
    console.log('✅ QR Code generation and analytics routes loaded successfully');
  } catch (error: any) {
    console.log("⚠️ QR routes initialization error:", error.message);
  }

  // Initialize QR Campaign Templates routes
  try {
    // @ts-ignore
    const qrCampaignTemplatesRouter = await import('./routes/qrCampaignTemplates.js');
    app.use('/api/qr', qrCampaignTemplatesRouter.default);
    console.log('✅ QR Campaign Templates routes loaded successfully');
  } catch (error: any) {
    console.log("⚠️ QR Campaign Templates routes initialization error:", error.message);
  }

  // Initialize Internal Platform Monitor
  try {
    // @ts-ignore
    const internalMonitorRouter = await import('./routes/internal-platform-monitor.js');
    app.use('/api/internal-monitor', internalMonitorRouter.default);
    console.log('🤖 Internal Platform AI Agent routes loaded successfully');
    console.log('✅ Continuous monitoring: UI/UX, bottlenecks, crash points, onboarding');
  } catch (error: any) {
    console.log("⚠️ Internal Platform Monitor initialization error:", error.message);
  }

  // Initialize Site Testing Agent
  try {
    // @ts-ignore
    const siteTestingRouter = await import('./routes/site-testing-agent.js');
    app.use('/api/site-testing', siteTestingRouter.default);
    console.log('🧪 Site Testing AI Agent routes loaded successfully');
    console.log('✅ Real-time user journey testing: Homepage, Products, Stores, Signup flows');
  } catch (error: any) {
    console.log("⚠️ Site Testing Agent initialization error:", error.message);
  }

  // Initialize Continuous Optimization Agent
  try {
    // @ts-ignore
    const continuousOptimizationRouter = await import('./routes/continuous-optimization-agent.js');
    app.use('/api/continuous-optimization', continuousOptimizationRouter.default);
    console.log('🔄 Continuous Optimization AI Agent routes loaded successfully');
    console.log('✅ Automated performance monitoring, testing, and optimization');
  } catch (error: any) {
    console.log("⚠️ Continuous Optimization Agent initialization error:", error.message);
  }

  // Initialize Admin Command Center
  try {
    const adminCommandCenterRouter = require('./routes/adminCommandCenter.js');
    app.use('/api/admin-command-center', adminCommandCenterRouter);
    console.log('🎛️ Admin Command Center initialized with enhanced KPI collection');
  } catch (error: any) {
    console.log("⚠️ Admin Command Center initialization error:", error.message);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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
