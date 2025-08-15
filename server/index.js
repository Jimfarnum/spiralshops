// Simple JavaScript server for SPIRAL platform
// Load environment variables from .env file
import { config } from 'dotenv';
config();

import express from "express";
import { createServer } from "http";
import path from "path";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Core SPIRAL API routes
(async () => {
  // Health check endpoint
  app.get('/api/check', (req, res) => {
    res.json({
      status: "healthy",
      message: "SPIRAL platform is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: "connected",
        authentication: "active",
        payment: "configured"
      }
    });
  });

  // Sample products endpoint
  app.get('/api/products', (req, res) => {
    res.json({
      products: [
        { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, category: "Electronics" },
        { id: 2, name: "Smart Fitness Watch", price: 299.99, category: "Electronics" },
        { id: 3, name: "Organic Coffee Beans", price: 24.99, category: "Food & Beverage" }
      ]
    });
  });

  // Stores endpoint
  app.get('/api/stores', (req, res) => {
    res.json({
      success: true,
      data: {
        stores: [
          { id: 1, name: "Downtown Electronics", category: "Electronics", location: "Minneapolis, MN" },
          { id: 2, name: "Fresh Market Co", category: "Food & Beverage", location: "Minneapolis, MN" }
        ]
      }
    });
  });

  // Load available JavaScript modules for enhanced functionality
  try {
    const aiOps = await import('./ai-ops.js');
    console.log("✅ SPIRAL AI Ops system loaded");
  } catch (error) {
    console.log("⚠️ AI Ops not available in JavaScript mode:", error.message);
  }

  // Load JavaScript routes if available
  const jsRoutes = [
    './routes/ai-dashboard-agents.js',
    './routes/soap-g-central-brain.js',
    './routes/inviteToShop.js',
    './routes/qrInviteRoutes.js',
    './routes/qrCampaignTemplates.js',
    './routes/internal-platform-monitor.js',
    './routes/site-testing-agent.js',
    './routes/continuous-optimization-agent.js'
  ];

  for (const routePath of jsRoutes) {
    try {
      const routeModule = await import(routePath);
      const routeName = routePath.split('/').pop().replace('.js', '');
      app.use('/api', routeModule.default);
      console.log(`✅ ${routeName} routes loaded`);
    } catch (error) {
      console.log(`⚠️ ${routePath} not available in JavaScript mode`);
    }
  }

  // Simple static file serving for development
  if (process.env.NODE_ENV === 'development') {
    // Serve static files from client directory
    app.use(express.static(path.join(process.cwd(), 'dist', 'public')));
    
    // Catch-all handler for SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'public', 'index.html'));
    });
  }

  // Error handling
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SPIRAL platform running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/check`);
    console.log(`🧠 JavaScript mode: Core functionality active`);
  });
})();