// Simple JavaScript server for SPIRAL platform
// Load environment variables from .env file
import { config } from 'dotenv';
config();

import express from "express";
import { createServer } from "http";
import path from "path";
import { mountClara } from "./clara.js";
import { mountMetrics } from "./metrics.js";
import { tenantMiddleware } from "./tenant.js";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Multi-tenant middleware
app.use(tenantMiddleware);

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
  // ❌ DISABLED: Conflicting with server/index.ts
  // app.get('/api/products', (req, res) => {
    res.json({
      products: [
        { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, category: "Electronics" },
        { id: 2, name: "Smart Fitness Watch", price: 299.99, category: "Electronics" },
        { id: 3, name: "Organic Coffee Beans", price: 24.99, category: "Food & Beverage" }
      ]
    });
  });

  // Enhanced Clara AI Agent & Knowledge Base System
  try {
    const { initializeAgentRegistry } = await import('./lib/agents.js');
    const agentRegistry = initializeAgentRegistry(null);
    
    // Clara chat endpoint (enhanced)
    app.post('/api/clara', (req, res) => {
      try {
        const { input, userType = "unknown", agentPreference = null } = req.body;
        if (!input) {
          return res.status(400).json({ success: false, error: "Input is required" });
        }
        const response = agentRegistry.handle(input, userType, agentPreference);
        res.json({ 
          success: true, 
          data: response, 
          meta: { 
            timestamp: new Date().toISOString(),
            knowledge_base_enhanced: true,
            confidence: response.confidence || 0.5
          }
        });
      } catch (error) {
        console.error('Clara AI error:', error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    });

    // Clara enhanced status endpoint  
    app.get('/api/clara/status', (req, res) => {
      try {
        const status = agentRegistry.getStatus();
        res.json({ success: true, data: status });
      } catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    });

    console.log('✅ Enhanced Clara AI Agent routes loaded successfully');
    console.log('✅ Clara now has sophisticated knowledge base access');
    
  } catch (error) {
    console.error('⚠️ Clara AI Agent not available:', error.message);
  }

  // Knowledge Base Management Routes
  try {
    const knowledgeBaseRoutes = await import('./routes/knowledge-base.js');
    app.use('/api/kb', knowledgeBaseRoutes.default);
    console.log('✅ Knowledge Base Management API routes loaded successfully');
  } catch (error) {
    console.error('⚠️ Knowledge Base routes not available:', error.message);
  }

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

  // IBM Cloud + Watson Retailer Onboarding System
  try {
    const { DB, ensureDb } = await import('./lib/cloudant.js');
    const { processRetailerSubmission } = await import('./lib/retailerAI.js');
    
    // Initialize Cloudant database
    await ensureDb();

    // Submit retailer (public)
    app.post("/api/retailer/submit", async (req, res) => {
      try {
        const now = new Date().toISOString();
        const aiResult = await processRetailerSubmission(req.body);

        const doc = {
          _id: `retailer:${(req.body?.retailer?.name || "unknown").toLowerCase().replace(/\s+/g, "-")}:${Date.now()}`,
          type: "retailer_submission",
          createdAt: now,
          updatedAt: now,
          status: aiResult.status,
          retailer: req.body.retailer,
          input: req.body.input,
          ai: {
            suggestedCategory: aiResult.category || null,
            confidence: aiResult.ai?.confidence ?? null,
            complianceFlags: [],
            verification: aiResult.ai?.verification || { onlinePresenceFound: false, signals: [] },
            decision: aiResult.ai?.decision || "needs_review"
          },
          admin: { reviewer: null, action: null, notes: null }
        };

        await DB.client.postDocument({ db: DB.name, document: doc });
        res.json({ ok: true, status: doc.status, suggestedCategory: doc.ai.suggestedCategory, id: doc._id });
      } catch (e) {
        console.error("Retailer submission error:", e);
        res.status(500).json({ ok: false, error: "Submission failed" });
      }
    });

    // Admin: list pending
    app.get("/api/admin/reviews", async (req, res) => {
      try {
        const status = req.query.status || "pending";
        const result = await DB.client.postFind({
          db: DB.name,
          selector: { type: "retailer_submission", status }
        });
        res.json({ ok: true, items: result.result.docs });
      } catch (e) {
        console.error("Admin reviews list error:", e);
        res.status(500).json({ ok: false, error: "List failed" });
      }
    });

    // Admin: approve
    app.post("/api/admin/review/:id/approve", async (req, res) => {
      try {
        const { id } = req.params;
        const { category, notes } = req.body;

        const { result: found } = await DB.client.getDocument({ db: DB.name, docId: id });
        found.status = "approved";
        found.admin = { reviewer: "admin@spiral.com", action: "approve", notes: notes || null };
        found.ai = found.ai || {};
        if (category) found.ai.suggestedCategory = category;
        found.updatedAt = new Date().toISOString();

        await DB.client.putDocument({ db: DB.name, docId: id, document: found });
        res.json({ ok: true, status: "approved" });
      } catch (e) {
        console.error("Approve error:", e);
        res.status(500).json({ ok: false, error: "Approve failed" });
      }
    });

    // Admin: deny
    app.post("/api/admin/review/:id/deny", async (req, res) => {
      try {
        const { id } = req.params;
        const { reason } = req.body;

        const { result: found } = await DB.client.getDocument({ db: DB.name, docId: id });
        found.status = "rejected";
        found.admin = { reviewer: "admin@spiral.com", action: "deny", notes: reason || "Denied" };
        found.updatedAt = new Date().toISOString();

        await DB.client.putDocument({ db: DB.name, docId: id, document: found });
        res.json({ ok: true, status: "rejected" });
      } catch (e) {
        console.error("Deny error:", e);
        res.status(500).json({ ok: false, error: "Deny failed" });
      }
    });

    // Admin: reclassify
    app.post("/api/admin/review/:id/reclassify", async (req, res) => {
      try {
        const { id } = req.params;
        const { category, notes } = req.body;

        const { result: found } = await DB.client.getDocument({ db: DB.name, docId: id });
        found.status = "approved"; // approve while changing category
        found.admin = { reviewer: "admin@spiral.com", action: "reclassify", notes: notes || null };
        found.ai = found.ai || {};
        found.ai.suggestedCategory = category || "Specialty & Unique Finds";
        found.updatedAt = new Date().toISOString();

        await DB.client.putDocument({ db: DB.name, docId: id, document: found });
        res.json({ ok: true, status: "approved", category: found.ai.suggestedCategory });
      } catch (e) {
        console.error("Reclassify error:", e);
        res.status(500).json({ ok: false, error: "Reclassify failed" });
      }
    });

    console.log("✅ IBM Cloud + Watson Retailer AI System loaded successfully");
  } catch (error) {
    console.log("⚠️ Retailer AI system not available:", error.message);
  }

  // Launch readiness routes
  try {
    const { default: launchReadinessRoutes } = await import('./routes/launchReadinessRoutes.js');
    app.use(launchReadinessRoutes);
  } catch (error) {
    console.log('⚠️ Launch readiness routes not available');
  }

  // Initialize scheduled testing system
  try {
    const { ScheduledFunctionalityTester } = await import('./scheduledTesting.js');
    const scheduledTester = new ScheduledFunctionalityTester();
    
    // Add scheduled test API routes
    app.get('/api/scheduled-tests/status', async (req, res) => {
      try {
        const history = await scheduledTester.getTestHistory(1);
        const latestTest = history[0];
        
        if (!latestTest) {
          return res.json({
            success: true,
            data: {
              status: 'NO_DATA',
              message: 'No recent test data available',
              schedule: {
                comprehensive: 'Daily at 2:00 AM',
                healthCheck: 'Every hour',
                miniCheck: 'Every 15 minutes'
              }
            }
          });
        }

        const testAge = Date.now() - new Date(latestTest.timestamp).getTime();
        const hoursOld = Math.round(testAge / (1000 * 60 * 60));
        
        res.json({
          success: true,
          data: {
            latestTest: {
              timestamp: latestTest.timestamp,
              functionality: latestTest.overallFunctionality,
              status: latestTest.status,
              hoursOld
            },
            schedule: {
              comprehensive: 'Daily at 2:00 AM',
              healthCheck: 'Every hour', 
              miniCheck: 'Every 15 minutes'
            },
            thresholds: {
              alertBelow: '85%',
              healthyAbove: '90%'
            }
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to get test status',
          message: error.message
        });
      }
    });

    app.get('/api/scheduled-tests/history', async (req, res) => {
      try {
        const days = parseInt(req.query.days) || 7;
        const history = await scheduledTester.getTestHistory(days);
        
        res.json({
          success: true,
          data: {
            history,
            summary: {
              totalTests: history.length,
              averageFunctionality: history.length > 0 ? 
                Math.round(history.reduce((sum, test) => sum + test.overallFunctionality, 0) / history.length) : 0,
              healthyTests: history.filter(test => test.status === 'HEALTHY').length,
              alertTests: history.filter(test => test.status === 'ALERT').length
            }
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to retrieve test history',
          message: error.message
        });
      }
    });

    app.post('/api/scheduled-tests/run', async (req, res) => {
      try {
        const testResults = await scheduledTester.runComprehensiveTest();
        
        res.json({
          success: true,
          data: testResults,
          message: `Manual test completed: ${testResults.overallFunctionality}% functionality`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to run manual test',
          message: error.message
        });
      }
    });
    
    console.log("✅ SPIRAL Scheduled Testing System loaded");
  } catch (error) {
    console.log("⚠️ Scheduled testing not available:", error.message);
  }

  // Domain and SSL redirect handling
  app.use((req, res, next) => {
    const hostname = req.get('host') || '';
    
    // Handle spiralshops.com SSL certificate issue
    if (hostname.includes('spiralshops.com')) {
      console.log(`🔄 Redirecting ${hostname} to spiralmalls.com for SSL certificate fix`);
      return res.redirect(301, `https://spiralmalls.com${req.originalUrl}`);
    }
    
    // Force HTTPS in production
    if (req.header('x-forwarded-proto') !== 'https' && 
        process.env.NODE_ENV === 'production' && 
        !hostname.includes('localhost') && 
        !hostname.includes('repl')) {
      return res.redirect(301, `https://${hostname}${req.originalUrl}`);
    }
    
    next();
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
    './routes/continuous-optimization-agent.js',
    './routes/sitemap.js',
    './adminTechwatchFunnelsRoute.js'
  ];

  for (const routePath of jsRoutes) {
    try {
      const routeModule = await import(routePath);
      const routeName = routePath.split('/').pop().replace('.js', '');
      
      // Special handling for sitemap routes (no /api prefix)
      if (routeName === 'sitemap') {
        app.use('/', routeModule.default);
        console.log(`✅ ${routeName} routes loaded (SEO)`);
      } else {
        app.use('/api', routeModule.default);
        console.log(`✅ ${routeName} routes loaded`);
      }
    } catch (error) {
      console.log(`⚠️ ${routePath} not available in JavaScript mode`);
    }
  }

  // SEO routes (must be before static file serving)
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = 'https://spiralshops.com';
      const currentDate = new Date().toISOString();
      
      const staticPages = [
        { url: '', priority: '1.0', changefreq: 'daily' },
        { url: '/products', priority: '0.9', changefreq: 'daily' },
        { url: '/stores', priority: '0.9', changefreq: 'daily' },
        { url: '/malls', priority: '0.8', changefreq: 'weekly' },
        { url: '/retailer-onboarding', priority: '0.8', changefreq: 'monthly' },
        { url: '/spirals', priority: '0.7', changefreq: 'weekly' },
        { url: '/about', priority: '0.6', changefreq: 'monthly' },
        { url: '/community', priority: '0.6', changefreq: 'weekly' },
        { url: '/local-first', priority: '0.6', changefreq: 'monthly' },
        { url: '/loyalty-program', priority: '0.7', changefreq: 'weekly' },
        { url: '/near-me', priority: '0.8', changefreq: 'daily' },
        { url: '/visual-search', priority: '0.7', changefreq: 'weekly' },
        { url: '/ai-agents', priority: '0.6', changefreq: 'weekly' }
      ];

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      staticPages.forEach(page => {
        sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Sitemap generation error:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  app.get('/robots.txt', (req, res) => {
    const robotsTxt = `# SPIRAL Robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://spiralshops.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /spiral-admin-login
Disallow: /retailer-login

# Block cart and checkout for privacy
Disallow: /cart
Disallow: /checkout
Disallow: /account

# Allow all product and store pages
Allow: /products
Allow: /stores
Allow: /product/*
Allow: /store/*
Allow: /mall/*`;

    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // AI Team Metrics API
  const agentScores = [];
  const agentEvents = [];

  // Helper functions for scoring
  function calculateCognitionScore(rubric) {
    const { accuracy = 0, grounding = 0, reasoning = 0, actionable = 0, consistency = 0, safety = 0 } = rubric;
    const weights = { accuracy: 30, grounding: 30, reasoning: 25, actionable: 20, consistency: 15, safety: 10 };
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const raw = accuracy * weights.accuracy + grounding * weights.grounding + reasoning * weights.reasoning +
               actionable * weights.actionable + consistency * weights.consistency + safety * weights.safety;
    return Math.round((raw / total) * 100);
  }

  function calculateEfficiencyScore(measurements, rubric) {
    const { latencyMs = 1000, error = false, escalated = false, tokensIn = 0, tokensOut = 0, cpuMs = 0, memMB = 0, retries = 0 } = measurements;
    const { reliability = 0.8, resourceDiscipline = 0.8, readiness = 0.8 } = rubric;
    
    // Latency score (600ms ideal, 5000ms cutoff)
    const latencyScore = latencyMs <= 600 ? 1 : (latencyMs >= 5000 ? 0 : 1 - (latencyMs - 600) / (5000 - 600));
    
    // Success score
    const successScore = (error || escalated) ? 0 : 1;
    
    // Resource score (example budgets)
    const tokenBudget = 8000;
    const cpuBudget = 500;
    const memBudget = 1024;
    const tokenUse = (tokensIn + tokensOut) / tokenBudget;
    const cpuUse = cpuMs / cpuBudget;
    const memUse = memMB / memBudget;
    const penalty = Math.max(0, (tokenUse - 1) * 0.5) + Math.max(0, (cpuUse - 1) * 0.3) + Math.max(0, (memUse - 1) * 0.2);
    const resourceScore = Math.max(0, 1 - penalty);
    
    // Reliability score
    let reliabilityScore = 1;
    if (error) reliabilityScore -= 0.5;
    if (retries > 0) reliabilityScore -= Math.min(0.3, retries * 0.1);
    if (escalated) reliabilityScore -= 0.3;
    reliabilityScore = Math.max(0, reliabilityScore);
    
    const weights = { latency: 25, success: 25, resource: 20, reliability: 20, readiness: 10 };
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const raw = latencyScore * weights.latency + successScore * weights.success + resourceScore * weights.resource +
               reliabilityScore * weights.reliability + readiness * weights.readiness;
    
    return Math.round((raw / total) * 100);
  }

  function calculateTeamworkScore(rubric) {
    const { handoff = 0, selection = 0, dedup = 0, conflictResolution = 0, outcomeAlignment = 0 } = rubric;
    const weights = { handoff: 35, selection: 25, dedup: 15, conflict: 15, alignment: 10 };
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const raw = handoff * weights.handoff + selection * weights.selection + dedup * weights.dedup +
               conflictResolution * weights.conflict + outcomeAlignment * weights.alignment;
    return Math.round((raw / total) * 100);
  }

  // POST /api/metrics/score
  app.post('/api/metrics/score', (req, res) => {
    try {
      const { agent, taskId, role, measurements, rubric } = req.body;
      
      // Calculate TER score
      const cognitionScore = calculateCognitionScore(rubric);
      const efficiencyScore = calculateEfficiencyScore(measurements, rubric);
      const teamworkScore = calculateTeamworkScore(rubric);
      const TER = Math.round(0.4 * cognitionScore + 0.35 * efficiencyScore + 0.25 * teamworkScore);
      
      const score = {
        taskId,
        agent,
        cognition: cognitionScore,
        efficiency: efficiencyScore,
        teamwork: teamworkScore,
        TER,
        stamp: new Date().toISOString()
      };
      
      agentScores.push(score);
      res.json(score);
    } catch (error) {
      res.status(400).json({ error: 'Scoring error: ' + error.message });
    }
  });

  // GET /api/metrics/leaderboard
  app.get('/api/metrics/leaderboard', (req, res) => {
    const byAgent = {};
    
    for (const score of agentScores) {
      if (!byAgent[score.agent]) {
        byAgent[score.agent] = { sum: 0, n: 0, scores: [] };
      }
      byAgent[score.agent].sum += score.TER;
      byAgent[score.agent].n += 1;
      byAgent[score.agent].scores.push(score.TER);
    }
    
    const leaderboard = Object.entries(byAgent)
      .map(([agent, { sum, n, scores }]) => ({
        agent,
        TER: Math.round(sum / Math.max(1, n)),
        totalTasks: n,
        lastScore: scores[scores.length - 1] || 0
      }))
      .sort((a, b) => b.TER - a.TER)
      .slice(0, 20);
    
    res.json({ leaderboard });
  });

  // GET /api/metrics/dashboard
  app.get('/api/metrics/dashboard', (req, res) => {
    if (agentScores.length === 0) {
      return res.json({
        totalTasks: 0,
        averageTER: 0,
        topAgent: null,
        healthStatus: "No data"
      });
    }
    
    const totalTasks = agentScores.length;
    const averageTER = Math.round(agentScores.reduce((sum, s) => sum + s.TER, 0) / totalTasks);
    const topAgent = agentScores.reduce((best, current) => 
      current.TER > best.TER ? current : best
    );
    const healthStatus = averageTER >= 85 ? "Excellent" : averageTER >= 70 ? "Good" : "Needs Attention";
    
    res.json({
      totalTasks,
      averageTER,
      topAgent: topAgent.agent,
      topAgentTER: topAgent.TER,
      healthStatus
    });
  });

  console.log('✅ AI Team Metrics API endpoints loaded successfully');

  // Mount Clara AI Agent Router
  mountClara(app);
  console.log('✅ Clara AI Agent Router mounted successfully');

  // Mount AI Metrics System
  mountMetrics(app);
  console.log('✅ AI Metrics and TER system mounted successfully');

  // Health check endpoint for deployment verification (MUST be before catch-all)
  app.get('/healthz', (req, res) => {
    res
      .type("application/json")
      .status(200)
      .json({ 
        ok: true,
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'SPIRAL API'
      });
  });

  // Static file serving for production
  app.use(express.static(path.join(process.cwd(), 'dist', 'public')));
  app.use("/avatars", express.static("public/avatars", { fallthrough: true, maxAge: "30d" }));
  
  // Catch-all handler for SPA (EXCLUDE API routes)
  app.get(/^(?!\/api\/|\/healthz|\/avatars\/).+/, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'public', 'index.html'));
  });

  // Error handling
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
})();