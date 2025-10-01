import express from "express";
import { getCloudant } from "../lib/cloudant.js";

const router = express.Router();
const cloudant = getCloudant();

// --- KPI Document Types ---
// Shopper KPI doc: shopper_kpi::<userId>
// Retailer KPI doc: retailer_kpi::<retailerId>
// Mall KPI doc: mall_kpi::<mallId>
// City KPI doc: city_kpi::<cityName>

interface ShopperKPI {
  _id?: string;
  type: "shopper_kpi";
  userId: string;
  appSessions: number;
  invitesSent: number;
  invitesCompleted: number;
  inStoreScans: number;
  onlinePurchases: number;
  spiralsEarned: number;
  spiralsRedeemed: number;
  itemsPurchased: number;
  updatedAt: string;
}

interface RetailerKPI {
  _id?: string;
  type: "retailer_kpi";
  retailerId: string;
  spiralSales: number; // $ amount
  transactions: number;
  spiralsRedemptions: number;
  invitesConversionRate: number;
  campaignsJoined: number;
  engagementGrowth: number;
  updatedAt: string;
}

interface MallKPI {
  _id?: string;
  type: "mall_kpi";
  mallId: string;
  spiralSales: number;
  spiralsEarned: number;
  spiralsRedeemed: number;
  eventParticipation: number;
  retailerParticipationPct: number;
  shopperFootTraffic: number;
  updatedAt: string;
}

interface CityKPI {
  _id?: string;
  type: "city_kpi";
  city: string;
  spiralSales: number;
  activeShoppers: number;
  retailersOnboarded: number;
  spiralsCirculation: number;
  redemptionRate: number;
  mallParticipation: number;
  updatedAt: string;
}

// --- Utility function ---
async function upsertKPI(docId: string, body: any) {
  try {
    console.log(`📊 [SPIRAL KPI] Upserting KPI document: ${docId}`);
    
    // Try to get existing document
    const existing = await cloudant.find("spiral_kpi_metrics", {
      selector: { _id: docId },
      limit: 1
    });
    
    let finalDoc = { ...body, _id: docId, updatedAt: new Date().toISOString() };
    
    // If document exists, preserve the revision
    if (existing.result?.docs?.length > 0) {
      finalDoc._rev = existing.result.docs[0]._rev;
      console.log(`📊 [SPIRAL KPI] Updating existing KPI: ${docId}`);
    } else {
      console.log(`📊 [SPIRAL KPI] Creating new KPI: ${docId}`);
    }
    
    const result = await cloudant.insert("spiral_kpi_metrics", finalDoc);
    console.log(`✅ [SPIRAL KPI] Successfully upserted ${docId}`);
    
    return { ok: true, id: docId, result };
  } catch (err: any) {
    console.error(`❌ [SPIRAL KPI] Failed to upsert ${docId}:`, err);
    return { ok: false, error: err.message };
  }
}

// --- KPI Update Endpoints ---

// Shopper KPI update
router.post("/kpi/shopper/:userId", async (req, res) => {
  const { userId } = req.params;
  const data: ShopperKPI = { 
    ...req.body, 
    type: "shopper_kpi", 
    userId,
    // Ensure numeric fields are numbers
    appSessions: Number(req.body.appSessions || 0),
    invitesSent: Number(req.body.invitesSent || 0),
    invitesCompleted: Number(req.body.invitesCompleted || 0),
    inStoreScans: Number(req.body.inStoreScans || 0),
    onlinePurchases: Number(req.body.onlinePurchases || 0),
    spiralsEarned: Number(req.body.spiralsEarned || 0),
    spiralsRedeemed: Number(req.body.spiralsRedeemed || 0),
    itemsPurchased: Number(req.body.itemsPurchased || 0)
  };
  
  const result = await upsertKPI(`shopper_kpi::${userId}`, data);
  res.json(result);
});

// Retailer KPI update
router.post("/kpi/retailer/:retailerId", async (req, res) => {
  const { retailerId } = req.params;
  const data: RetailerKPI = { 
    ...req.body, 
    type: "retailer_kpi", 
    retailerId,
    // Ensure numeric fields are numbers
    spiralSales: Number(req.body.spiralSales || 0),
    transactions: Number(req.body.transactions || 0),
    spiralsRedemptions: Number(req.body.spiralsRedemptions || 0),
    invitesConversionRate: Number(req.body.invitesConversionRate || 0),
    campaignsJoined: Number(req.body.campaignsJoined || 0),
    engagementGrowth: Number(req.body.engagementGrowth || 0)
  };
  
  const result = await upsertKPI(`retailer_kpi::${retailerId}`, data);
  res.json(result);
});

// Mall KPI update
router.post("/kpi/mall/:mallId", async (req, res) => {
  const { mallId } = req.params;
  const data: MallKPI = { 
    ...req.body, 
    type: "mall_kpi", 
    mallId,
    // Ensure numeric fields are numbers
    spiralSales: Number(req.body.spiralSales || 0),
    spiralsEarned: Number(req.body.spiralsEarned || 0),
    spiralsRedeemed: Number(req.body.spiralsRedeemed || 0),
    eventParticipation: Number(req.body.eventParticipation || 0),
    retailerParticipationPct: Number(req.body.retailerParticipationPct || 0),
    shopperFootTraffic: Number(req.body.shopperFootTraffic || 0)
  };
  
  const result = await upsertKPI(`mall_kpi::${mallId}`, data);
  res.json(result);
});

// City KPI update
router.post("/kpi/city/:city", async (req, res) => {
  const { city } = req.params;
  const data: CityKPI = { 
    ...req.body, 
    type: "city_kpi", 
    city,
    // Ensure numeric fields are numbers
    spiralSales: Number(req.body.spiralSales || 0),
    activeShoppers: Number(req.body.activeShoppers || 0),
    retailersOnboarded: Number(req.body.retailersOnboarded || 0),
    spiralsCirculation: Number(req.body.spiralsCirculation || 0),
    redemptionRate: Number(req.body.redemptionRate || 0),
    mallParticipation: Number(req.body.mallParticipation || 0)
  };
  
  const result = await upsertKPI(`city_kpi::${city}`, data);
  res.json(result);
});

// --- KPI Reporting Endpoints ---

router.get("/kpi/report/retailer/:retailerId", async (req, res) => {
  const { retailerId } = req.params;
  const docId = `retailer_kpi::${retailerId}`;
  
  try {
    console.log(`📊 [SPIRAL KPI] Fetching retailer KPI: ${retailerId}`);
    
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: { _id: docId },
      limit: 1
    });
    
    if (result.result?.docs?.length > 0) {
      const doc = result.result.docs[0];
      console.log(`✅ [SPIRAL KPI] Retrieved retailer KPI for ${retailerId}`);
      res.json({ ok: true, kpi: doc });
    } else {
      console.log(`⚠️ [SPIRAL KPI] Retailer KPI not found: ${retailerId}`);
      res.status(404).json({ ok: false, error: "Retailer KPI not found" });
    }
  } catch (error) {
    console.error(`❌ [SPIRAL KPI] Failed to fetch retailer KPI ${retailerId}:`, error);
    res.status(500).json({ ok: false, error: "Failed to fetch retailer KPI" });
  }
});

router.get("/kpi/report/mall/:mallId", async (req, res) => {
  const { mallId } = req.params;
  const docId = `mall_kpi::${mallId}`;
  
  try {
    console.log(`📊 [SPIRAL KPI] Fetching mall KPI: ${mallId}`);
    
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: { _id: docId },
      limit: 1
    });
    
    if (result.result?.docs?.length > 0) {
      const doc = result.result.docs[0];
      console.log(`✅ [SPIRAL KPI] Retrieved mall KPI for ${mallId}`);
      res.json({ ok: true, kpi: doc });
    } else {
      console.log(`⚠️ [SPIRAL KPI] Mall KPI not found: ${mallId}`);
      res.status(404).json({ ok: false, error: "Mall KPI not found" });
    }
  } catch (error) {
    console.error(`❌ [SPIRAL KPI] Failed to fetch mall KPI ${mallId}:`, error);
    res.status(500).json({ ok: false, error: "Failed to fetch mall KPI" });
  }
});

router.get("/kpi/report/city/:city", async (req, res) => {
  const { city } = req.params;
  const docId = `city_kpi::${city}`;
  
  try {
    console.log(`📊 [SPIRAL KPI] Fetching city KPI: ${city}`);
    
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: { _id: docId },
      limit: 1
    });
    
    if (result.result?.docs?.length > 0) {
      const doc = result.result.docs[0];
      console.log(`✅ [SPIRAL KPI] Retrieved city KPI for ${city}`);
      res.json({ ok: true, kpi: doc });
    } else {
      console.log(`⚠️ [SPIRAL KPI] City KPI not found: ${city}`);
      res.status(404).json({ ok: false, error: "City KPI not found" });
    }
  } catch (error) {
    console.error(`❌ [SPIRAL KPI] Failed to fetch city KPI ${city}:`, error);
    res.status(500).json({ ok: false, error: "Failed to fetch city KPI" });
  }
});

router.get("/kpi/report/shopper/:userId", async (req, res) => {
  const { userId } = req.params;
  const docId = `shopper_kpi::${userId}`;
  
  try {
    console.log(`📊 [SPIRAL KPI] Fetching shopper KPI: ${userId}`);
    
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: { _id: docId },
      limit: 1
    });
    
    if (result.result?.docs?.length > 0) {
      const doc = result.result.docs[0];
      console.log(`✅ [SPIRAL KPI] Retrieved shopper KPI for ${userId}`);
      res.json({ ok: true, kpi: doc });
    } else {
      console.log(`⚠️ [SPIRAL KPI] Shopper KPI not found: ${userId}`);
      res.status(404).json({ ok: false, error: "Shopper KPI not found" });
    }
  } catch (error) {
    console.error(`❌ [SPIRAL KPI] Failed to fetch shopper KPI ${userId}:`, error);
    res.status(500).json({ ok: false, error: "Failed to fetch shopper KPI" });
  }
});

// --- Aggregated Reporting Endpoints ---

// Get all KPIs by type
router.get("/kpi/summary/:type", async (req, res) => {
  const { type } = req.params;
  
  if (!["shopper_kpi", "retailer_kpi", "mall_kpi", "city_kpi"].includes(type)) {
    return res.status(400).json({ ok: false, error: "Invalid KPI type" });
  }
  
  try {
    console.log(`📊 [SPIRAL KPI] Fetching summary for type: ${type}`);
    
    const result = await cloudant.find("spiral_kpi_metrics", {
      selector: { type: type },
      limit: 100
    });
    
    const kpis = result.result?.docs || [];
    console.log(`✅ [SPIRAL KPI] Retrieved ${kpis.length} ${type} records`);
    
    res.json({ 
      ok: true, 
      type,
      count: kpis.length,
      kpis: kpis.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    });
  } catch (error) {
    console.error(`❌ [SPIRAL KPI] Failed to fetch summary for ${type}:`, error);
    res.status(500).json({ ok: false, error: "Failed to fetch KPI summary" });
  }
});

// Get platform-wide KPI overview
router.get("/kpi/platform/overview", async (req, res) => {
  try {
    console.log(`📊 [SPIRAL KPI] Generating platform overview`);
    
    const [shoppers, retailers, malls, cities] = await Promise.all([
      cloudant.find("spiral_kpi_metrics", { selector: { type: "shopper_kpi" }, limit: 1000 }),
      cloudant.find("spiral_kpi_metrics", { selector: { type: "retailer_kpi" }, limit: 1000 }),
      cloudant.find("spiral_kpi_metrics", { selector: { type: "mall_kpi" }, limit: 1000 }),
      cloudant.find("spiral_kpi_metrics", { selector: { type: "city_kpi" }, limit: 1000 })
    ]);
    
    const overview = {
      totalShoppers: shoppers.result?.docs?.length || 0,
      totalRetailers: retailers.result?.docs?.length || 0,
      totalMalls: malls.result?.docs?.length || 0,
      totalCities: cities.result?.docs?.length || 0,
      lastUpdated: new Date().toISOString()
    };
    
    console.log(`✅ [SPIRAL KPI] Platform overview generated:`, overview);
    res.json({ ok: true, overview });
  } catch (error) {
    console.error(`❌ [SPIRAL KPI] Failed to generate platform overview:`, error);
    res.status(500).json({ ok: false, error: "Failed to generate platform overview" });
  }
});

console.log("📊 SPIRAL KPI Framework initialized");
console.log("🚀 Available endpoints:");
console.log("   POST /api/kpi/shopper/:userId - Update shopper KPIs");
console.log("   POST /api/kpi/retailer/:retailerId - Update retailer KPIs");
console.log("   POST /api/kpi/mall/:mallId - Update mall KPIs");
console.log("   POST /api/kpi/city/:city - Update city KPIs");
console.log("   GET /api/kpi/report/[type]/:id - Get specific KPI report");
console.log("   GET /api/kpi/summary/:type - Get KPI summary by type");
console.log("   GET /api/kpi/platform/overview - Get platform-wide overview");

export default router;