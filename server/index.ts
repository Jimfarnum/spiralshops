// Load environment variables from .env file
import { config } from 'dotenv';
config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { rateLimiter } from "./middleware/rateLimiter.js";
import wishlistRoutes from "./api/wishlist";
import intelligentWishlistRoutes from "./api/intelligent-wishlist";
import aiOpsStatusRoutes from "./api/ai-ops-status.js";
import businessCategoriesRoutes from "./api/business-categories.js";
import aiRetailerOnboardingRoutes from "./api/ai-retailer-onboarding.js";
import inventoryCategoriesRoutes from "./api/inventory-categories.js";
import aiOpsDashboardRoutes from "./api/ai-ops-dashboard.js";
import statusRoutes from "./routes/status.js";

const app = express();
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
  const cloudantStatusRoutes = await import('./routes/cloudant-status.js');
  app.use("/api", cloudantStatusRoutes.default);
  
  const server = await registerRoutes(app);

  // Initialize AI Ops GPT System
  try {
    const { default: aiOps } = await import('./ai-ops.js');
    console.log("✅ SPIRAL AI Ops GPT system initialized successfully");
  } catch (error: any) {
    console.log("⚠️ AI Ops initialization error:", error.message);
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

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
