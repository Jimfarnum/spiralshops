import express from "express";
import dotenv from "dotenv";
import { cloudant, initCloudant } from "./cloudant.js";
import { EventSchema } from "./schemas.js";
import { aboutText } from "./content/about.js";
import { claraAdminInsights, claraMallInsights, claraShopperInsights } from "./agents/clara.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// About section endpoint
app.get("/about", (_req, res) => res.send(aboutText));

// Ingest events
app.post("/event", async (req, res) => {
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });
  await cloudant.postDocument({ db: process.env.CLOUDANT_DB!, document: parsed.data });
  res.json({ ok: true });
});

// Fetch latest insights for a store
app.get("/admin/insights/:storeId", async (req, res) => {
  const storeId = req.params.storeId;
  const result = await cloudant.postFind({
    db: process.env.CLOUDANT_DB_INSIGHTS!,
    selector: { storeId },
    sort: [{ ts: "desc" }],
    limit: 1
  });
  res.json(result.result?.docs?.[0] ?? { message: "No insights yet" });
});

// Generate fresh retailer insights using Clara
app.post("/admin/generate-insights/:storeId", async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const { funnel, topQueries } = req.body;
    
    const insights = await claraAdminInsights({
      storeId,
      funnel: funnel || { searches: 0, carts: 0, checkouts: 0 },
      topQueries: topQueries || []
    });
    
    // Store the fresh insights
    const insightDoc = {
      storeId,
      ts: new Date().toISOString(),
      period: "weekly",
      insights,
      generatedBy: "clara-promptwright",
      source: "api_request"
    };
    
    await cloudant.postDocument({
      db: process.env.CLOUDANT_DB_INSIGHTS!,
      document: insightDoc
    });
    
    res.json({ success: true, insights, timestamp: insightDoc.ts });
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ success: false, error: "Failed to generate insights" });
  }
});

// Mall insights endpoints
app.get("/admin/mall-insights/:mallId", async (req, res) => {
  const mallId = req.params.mallId;
  const result = await cloudant.postFind({
    db: process.env.CLOUDANT_DB_INSIGHTS!,
    selector: { mallId },
    sort: [{ ts: "desc" }],
    limit: 1
  });
  res.json(result.result?.docs?.[0] ?? { message: "No mall insights yet" });
});

app.post("/admin/generate-mall-insights/:mallId", async (req, res) => {
  try {
    const mallId = req.params.mallId;
    const { traffic, topCategories, tenantPerformance } = req.body;
    
    const insights = await claraMallInsights({
      mallId,
      traffic: traffic || { weeklyVisitors: 0, averageSession: 0 },
      topCategories: topCategories || [],
      tenantPerformance: tenantPerformance || { high: [], low: [] }
    });
    
    const insightDoc = {
      mallId,
      ts: new Date().toISOString(),
      period: "weekly",
      insights,
      generatedBy: "clara-promptwright",
      source: "api_request"
    };
    
    await cloudant.postDocument({
      db: process.env.CLOUDANT_DB_INSIGHTS!,
      document: insightDoc
    });
    
    res.json({ success: true, insights, timestamp: insightDoc.ts });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to generate mall insights" });
  }
});

// Shopper insights endpoints
app.get("/admin/shopper-insights/:shopperId", async (req, res) => {
  const shopperId = req.params.shopperId;
  const result = await cloudant.postFind({
    db: process.env.CLOUDANT_DB_INSIGHTS!,
    selector: { shopperId },
    sort: [{ ts: "desc" }],
    limit: 1
  });
  res.json(result.result?.docs?.[0] ?? { message: "No shopper insights yet" });
});

app.post("/admin/generate-shopper-insights/:shopperId", async (req, res) => {
  try {
    const shopperId = req.params.shopperId;
    const { behavior, preferences, nearbyStores } = req.body;
    
    const insights = await claraShopperInsights({
      shopperId,
      behavior: behavior || { searchFrequency: 0, cartAbandonmentRate: 0 },
      preferences: preferences || [],
      nearbyStores: nearbyStores || []
    });
    
    const insightDoc = {
      shopperId,
      ts: new Date().toISOString(),
      period: "weekly",
      insights,
      generatedBy: "clara-promptwright",
      source: "api_request"
    };
    
    await cloudant.postDocument({
      db: process.env.CLOUDANT_DB_INSIGHTS!,
      document: insightDoc
    });
    
    res.json({ success: true, insights, timestamp: insightDoc.ts });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to generate shopper insights" });
  }
});

const PORT = process.env.PORT || 3000;
initCloudant().then(() => {
  app.listen(PORT, () => console.log(`Admin LLM API on :${PORT}`));
});