// 🧠 SPIRAL AI Ops GPT v1.0
// Oversees agents, tests platform functions, applies fixes, and reports autonomously.

class AIOpsGPT {
  constructor() {
    this.agents = {};
    this.logs = [];
    this.testInterval = 60 * 60 * 1000; // Run tests hourly
    this.isRunning = false;
  }

  registerAgent(name, agentFunction) {
    this.agents[name] = agentFunction;
    console.log(`✅ AI Ops Agent registered: ${name}`);
  }

  async runTests() {
    if (this.isRunning) return; // Prevent overlapping test runs
    this.isRunning = true;
    
    console.log("🧠 Running AI Ops system test loop...");
    const testResults = [];
    
    for (const [name, agentFn] of Object.entries(this.agents)) {
      try {
        const result = await agentFn();
        const logEntry = {
          agent: name,
          timestamp: new Date().toISOString(),
          status: result.status,
          detail: result.detail,
          duration: result.duration || 0
        };
        this.logs.push(logEntry);
        testResults.push(logEntry);
        console.log(`✅ ${name} passed: ${result.detail}`);
      } catch (err) {
        const logEntry = {
          agent: name,
          timestamp: new Date().toISOString(),
          status: "ERROR",
          detail: err.message,
          error: err.stack
        };
        this.logs.push(logEntry);
        testResults.push(logEntry);
        console.error(`❌ ${name} failed: ${err.message}`);
      }
    }
    
    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
    
    this.isRunning = false;
    return testResults;
  }

  start() {
    console.log("🚀 Starting SPIRAL AI Ops GPT System...");
    // Wait 5 seconds for server to be fully ready before first test
    setTimeout(() => this.runTests(), 5000);
    setInterval(() => this.runTests(), this.testInterval);
  }

  getStatus() {
    return {
      totalAgents: Object.keys(this.agents).length,
      agentNames: Object.keys(this.agents),
      recentResults: this.logs.slice(-10),
      lastTestRun: this.logs.length > 0 ? this.logs[this.logs.length - 1].timestamp : null
    };
  }

  stop() {
    console.log("🛑 Stopping AI Ops system...");
    clearInterval(this.testInterval);
  }

  getLogs() {
    return this.logs;
  }

  getAgentStatus() {
    const agentNames = Object.keys(this.agents);
    const recentLogs = this.logs.slice(-agentNames.length);
    return {
      totalAgents: agentNames.length,
      agentNames,
      recentResults: recentLogs,
      lastTestRun: this.logs.length > 0 ? this.logs[this.logs.length - 1].timestamp : null
    };
  }
}

const spiralAI = new AIOpsGPT();

// 👤 Shopper UX Agent — Simulates Shopper Flow (Browse → Cart → Checkout)
spiralAI.registerAgent("ShopperUXAgent", async () => {
  const startTime = Date.now();
  try {
    // Test product browsing
    const browseResponse = await fetch("http://localhost:5000/api/products");
    if (!browseResponse.ok) throw new Error(`Product browsing failed: ${browseResponse.status}`);
    const products = await browseResponse.json();
    if (!products.products || products.products.length === 0) {
      throw new Error("No products found in browse response");
    }

    // Test featured products
    const featuredResponse = await fetch("http://localhost:5000/api/products/featured");
    if (!featuredResponse.ok) throw new Error(`Featured products failed: ${featuredResponse.status}`);
    const featured = await featuredResponse.json();
    if (!featured.success || !featured.products) {
      throw new Error("Featured products response invalid");
    }

    // Test AI recommendations
    const recommendResponse = await fetch("http://localhost:5000/api/recommend");
    if (!recommendResponse.ok) throw new Error(`AI recommendations failed: ${recommendResponse.status}`);
    const recommendations = await recommendResponse.json();
    if (!Array.isArray(recommendations)) {
      throw new Error("AI recommendations response invalid");
    }

    // Test store search
    const storesResponse = await fetch("http://localhost:5000/api/stores");
    if (!storesResponse.ok) throw new Error(`Store search failed: ${storesResponse.status}`);
    const stores = await storesResponse.json();
    if (!Array.isArray(stores)) {
      throw new Error("Store search response invalid");
    }

    const duration = Date.now() - startTime;
    return {
      status: "OK",
      detail: `Shopper UX flow completed: ${products.products.length} products, ${featured.products.length} featured, ${recommendations.length} recommendations, ${stores.length} stores`,
      duration
    };
  } catch (err) {
    throw new Error(`Shopper UX flow error: ${err.message}`);
  }
});

// 🧰 DevOps Agent — Tests API Health and Route Status
spiralAI.registerAgent("DevOpsAgent", async () => {
  const startTime = Date.now();
  try {
    const coreRoutes = [
      { path: "/api/check", name: "Health Check" },
      { path: "/api/products", name: "Products API" },
      { path: "/api/stores", name: "Stores API" },
      { path: "/api/mall-events", name: "Mall Events API" },
      { path: "/api/promotions", name: "Promotions API" },
      { path: "/api/location-search-continental-us?scope=all", name: "Continental US Search" }
    ];

    const results = [];
    for (const route of coreRoutes) {
      try {
        const res = await fetch(`http://localhost:5000${route.path}`);
        if (!res.ok) throw new Error(`${route.name} returned ${res.status}`);
        results.push(`${route.name}: OK`);
      } catch (err) {
        throw new Error(`${route.name} failed: ${err.message}`);
      }
    }

    const duration = Date.now() - startTime;
    return {
      status: "OK",
      detail: `All ${coreRoutes.length} core APIs operational: ${results.join(", ")}`,
      duration
    };
  } catch (err) {
    throw new Error(`DevOps check error: ${err.message}`);
  }
});

// 🔍 Platform Analytics Agent — Tests Analytics and Performance
spiralAI.registerAgent("AnalyticsAgent", async () => {
  const startTime = Date.now();
  try {
    // Test Continental US database
    const continentalResponse = await fetch("http://localhost:5000/api/location-search-continental-us?scope=all");
    if (!continentalResponse.ok) throw new Error(`Continental search failed: ${continentalResponse.status}`);
    const continental = await continentalResponse.json();
    if (!continental.success || !continental.stores) {
      throw new Error("Continental US search response invalid");
    }

    // Test zip code filtering
    const zipResponse = await fetch("http://localhost:5000/api/location-search-continental-us?zipCode=55444");
    if (!zipResponse.ok) throw new Error(`Zip code search failed: ${zipResponse.status}`);
    const zipResults = await zipResponse.json();
    if (!zipResults.success || !zipResults.stores) {
      throw new Error("Zip code search response invalid");
    }

    // Test state filtering
    const stateResponse = await fetch("http://localhost:5000/api/location-search-continental-us?state=CA&category=Electronics");
    if (!stateResponse.ok) throw new Error(`State filtering failed: ${stateResponse.status}`);
    const stateResults = await stateResponse.json();
    if (!stateResults.success || !stateResults.stores) {
      throw new Error("State filtering response invalid");
    }

    const duration = Date.now() - startTime;
    return {
      status: "OK",
      detail: `Analytics verified: ${continental.totalCount} total stores, ${zipResults.stores.length} zip matches, ${stateResults.stores.length} CA electronics`,
      duration
    };
  } catch (err) {
    throw new Error(`Analytics check error: ${err.message}`);
  }
});

// 🏪 Retailer Platform Agent — Tests Retailer Features
spiralAI.registerAgent("RetailerPlatformAgent", async () => {
  const startTime = Date.now();
  try {
    // Test retailer onboarding routes
    const onboardingRoutes = [
      { path: "/api/ai-retailer-onboarding/categories", name: "Business Categories" },
      { path: "/api/inventory/categories", name: "Inventory Categories" }
    ];

    const results = [];
    for (const route of onboardingRoutes) {
      try {
        const res = await fetch(`http://localhost:5000${route.path}`);
        if (!res.ok) throw new Error(`${route.name} returned ${res.status}`);
        const data = await res.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
          throw new Error(`${route.name} returned empty data`);
        }
        results.push(`${route.name}: OK`);
      } catch (err) {
        throw new Error(`${route.name} failed: ${err.message}`);
      }
    }

    const duration = Date.now() - startTime;
    return {
      status: "OK",
      detail: `Retailer platform operational: ${results.join(", ")}`,
      duration
    };
  } catch (err) {
    throw new Error(`Retailer platform error: ${err.message}`);
  }
});

// 🟢 Start AI Ops System
spiralAI.start();

// 📝 Global access functions
global.getAIOpsLogs = () => {
  console.table(spiralAI.getLogs());
  return spiralAI.getLogs();
};

global.getAIOpsStatus = () => {
  const status = spiralAI.getAgentStatus();
  console.log("📊 AI Ops Status:", status);
  return status;
};

global.runAIOpsTests = async () => {
  console.log("🔄 Running manual AI Ops test cycle...");
  return await spiralAI.runTests();
};

// 📝 Optional Log Access (as per your instructions)
globalThis.getAIOpsLogs = () => console.table(spiralAI.getLogs());

export default spiralAI;