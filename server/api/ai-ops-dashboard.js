// AI Ops Dashboard backend logic for SPIRAL
import express from 'express';

const router = express.Router();

let aiLogs = []; // Temporary in-memory logs (persist later via DB if needed)

export const agents = {
  ShopperUXAgent: async () => {
    try {
      // Test shopper flow with real API calls
      const productsRes = await fetch('http://localhost:5000/api/products');
      const featuredRes = await fetch('http://localhost:5000/api/products/featured');
      const recommendRes = await fetch('http://localhost:5000/api/recommend');
      const storesRes = await fetch('http://localhost:5000/api/stores');
      
      if (!productsRes.ok || !featuredRes.ok || !recommendRes.ok || !storesRes.ok) {
        throw new Error('One or more shopper APIs failed');
      }
      
      const products = await productsRes.json();
      const featured = await featuredRes.json();
      const recommendations = await recommendRes.json();
      const stores = await storesRes.json();
      
      // Handle both legacy and standard response formats
      const recommendationCount = recommendations.data ? recommendations.data.recommendations?.length || recommendations.data.total || 0 : recommendations.length || 0;
      const storeCount = stores.data ? stores.data.retailers?.length || stores.data.total || 0 : stores.length || 0;
      
      return { 
        status: "OK", 
        detail: `Shopper UX flow completed: ${products.products?.length || 0} products, ${featured.products?.length || 0} featured, ${recommendationCount} recommendations, ${storeCount} stores`
      };
    } catch (error) {
      return { status: "FAIL", detail: `Shopper flow error: ${error.message}` };
    }
  },
  
  DevOpsAgent: async () => {
    try {
      const coreRoutes = [
        { path: "/api/check", name: "Health Check" },
        { path: "/api/products", name: "Products API" },
        { path: "/api/stores", name: "Stores API" },
        { path: "/api/mall-events", name: "Mall Events API" },
        { path: "/api/promotions", name: "Promotions API" },
        { path: "/api/location-search-continental-us", name: "Continental US Search" }
      ];

      const results = [];
      for (const route of coreRoutes) {
        const res = await fetch(`http://localhost:5000${route.path}`);
        if (!res.ok) throw new Error(`${route.name} returned ${res.status}`);
        results.push(`${route.name}: OK`);
      }

      return { 
        status: "OK", 
        detail: `All ${results.length} core APIs operational: ${results.join(", ")}`
      };
    } catch (error) {
      return { status: "FAIL", detail: `DevOps check failed: ${error.message}` };
    }
  },
  
  AnalyticsAgent: async () => {
    try {
      // Test analytics endpoints
      const allStoresRes = await fetch('http://localhost:5000/api/location-search-continental-us?scope=all');
      const zipRes = await fetch('http://localhost:5000/api/location-search-continental-us?zip=55444');
      const categoryRes = await fetch('http://localhost:5000/api/location-search-continental-us?state=CA&category=Electronics');
      
      if (!allStoresRes.ok || !zipRes.ok || !categoryRes.ok) {
        throw new Error('Analytics API calls failed');
      }
      
      const allStores = await allStoresRes.json();
      const zipStores = await zipRes.json();
      const categoryStores = await categoryRes.json();
      
      return { 
        status: "OK", 
        detail: `Analytics verified: ${allStores.stores?.length || 0} total stores, ${zipStores.stores?.length || 0} zip matches, ${categoryStores.stores?.length || 0} CA electronics`
      };
    } catch (error) {
      return { status: "FAIL", detail: `Analytics error: ${error.message}` };
    }
  },
  
  RetailerPlatformAgent: async () => {
    try {
      const retailerRoutes = [
        { path: "/api/ai-retailer-onboarding/categories", name: "Business Categories" },
        { path: "/api/inventory/categories", name: "Inventory Categories" }
      ];

      const results = [];
      for (const route of retailerRoutes) {
        const res = await fetch(`http://localhost:5000${route.path}`);
        if (!res.ok) throw new Error(`${route.name} returned ${res.status}`);
        const data = await res.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
          throw new Error(`${route.name} returned empty data`);
        }
        results.push(`${route.name}: OK`);
      }

      return { 
        status: "OK", 
        detail: `Retailer platform operational: ${results.join(", ")}`
      };
    } catch (error) {
      return { status: "FAIL", detail: `Retailer platform error: ${error.message}` };
    }
  }
};

export async function runAllTests() {
  const results = [];
  for (const [name, fn] of Object.entries(agents)) {
    try {
      const startTime = Date.now();
      const result = await fn();
      const duration = Date.now() - startTime;
      
      const log = {
        agent: name,
        timestamp: new Date().toISOString(),
        status: result.status,
        detail: result.detail,
        duration
      };
      results.push(log);
      aiLogs.push(log);
    } catch (e) {
      const failLog = {
        agent: name,
        timestamp: new Date().toISOString(),
        status: "FAIL",
        detail: e.message,
        duration: 0
      };
      results.push(failLog);
      aiLogs.push(failLog);
    }
  }
  
  // Keep only last 100 logs to prevent memory issues
  if (aiLogs.length > 100) {
    aiLogs = aiLogs.slice(-100);
  }
  
  return results;
}

export function getLogs() {
  return aiLogs;
}

// API Routes - Using SPIRAL Standard Response Format
router.get('/ai-ops/dashboard/status', (req, res) => {
  const startTime = Date.now();
  try {
    const recentLogs = aiLogs.slice(-10);
    const successRate = recentLogs.length > 0 ? 
      (recentLogs.filter(log => log.status === 'OK').length / recentLogs.length * 100) : 0;
    
    res.json({
      success: true,
      data: {
        totalAgents: Object.keys(agents).length,
        agentNames: Object.keys(agents),
        recentLogs,
        successRate: Math.round(successRate),
        lastTestRun: aiLogs.length > 0 ? aiLogs[aiLogs.length - 1].timestamp : null
      },
      duration: `${Date.now() - startTime}ms`,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      error: error.message
    });
  }
});

router.get('/ai-ops/dashboard/logs', (req, res) => {
  const startTime = Date.now();
  try {
    res.json({
      success: true,
      data: {
        logs: aiLogs,
        totalLogs: aiLogs.length
      },
      duration: `${Date.now() - startTime}ms`,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      error: error.message
    });
  }
});

router.post('/ai-ops/dashboard/run-tests', async (req, res) => {
  const startTime = Date.now();
  try {
    console.log("🔄 Running dashboard AI Ops test cycle...");
    const results = await runAllTests();
    res.json({
      success: true,
      data: {
        message: "AI Ops test cycle completed",
        results,
        totalTests: results.length
      },
      duration: `${Date.now() - startTime}ms`,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      error: error.message
    });
  }
});

export default router;