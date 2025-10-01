const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { CloudantV1, IamAuthenticator } = require("@ibm-cloud/cloudant");
// OpenAI will be dynamically imported when needed (ESM/CJS compatibility)

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const STAFF_TOKEN = process.env.STAFF_TOKEN || "spiral-staff";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ---- Cloudant ----
let cloudantClient = null;
let dbName = null;
if (process.env.CLOUDANT_URL && process.env.CLOUDANT_APIKEY) {
  try {
    // Sanitize and validate CLOUDANT_URL
    const rawUrl = (process.env.CLOUDANT_URL || '').trim();
    const serviceUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    
    cloudantClient = new CloudantV1({
      authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_APIKEY }),
      serviceUrl: serviceUrl,
    });
    dbName = process.env.CLOUDANT_DB_MESSAGES || "spiral_messages";
    
    // Async initialization with proper error handling
    (async () => {
      try {
        await cloudantClient.getDatabaseInformation({ db: dbName });
        console.log("✅ Cloudant ready");
      } catch (e) {
        if (e.status === 404) {
          await cloudantClient.putDatabase({ db: dbName });
          console.log(`✅ Cloudant ready (created DB: ${dbName})`);
        } else {
          throw e;
        }
      }
    })().catch(err => {
      console.warn("⚠️ Cloudant init failed:", err.message);
      cloudantClient = null;
    });
  } catch (err) {
    console.warn("⚠️ Cloudant setup failed:", err.message);
    cloudantClient = null;
  }
} else {
  console.log("⚠️ Cloudant not configured – running without persistence");
}

// ---- Middleware ----
function requireAuth(req, res, next) {
  const token = req.headers["x-staff-token"];
  if (token !== STAFF_TOKEN) return res.status(403).json({ error: "Forbidden" });
  next();
}

// ---- Health ----
app.get("/health", (req, res) => res.json({ ok: true, message: "SPIRAL backend healthy" }));

// ---- Entities (Stores + Malls) ----
app.get("/api/entities", requireAuth, async (req, res) => {
  if (!cloudantClient) return res.json({ ok: true, entities: [] });
  try {
    const result = await cloudantClient.postFind({ db: dbName, selector: { type: { "$in": ["store", "mall"] } } });
    let entities = result.result.docs.filter(e => e.status !== "hidden");

    const { category, zip } = req.query;
    if (category) entities = entities.filter(e => (e.category || "").toLowerCase() === category.toLowerCase());
    if (zip) entities = entities.filter(e => e.zipCode === zip);

    res.json({ ok: true, entities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Rewards ----
app.get("/api/rewards/:shopperId", requireAuth, async (req, res) => {
  if (!cloudantClient) return res.json({ ok: true, rewards: null });
  const { shopperId } = req.params;
  try {
    const result = await cloudantClient.postFind({ db: dbName, selector: { type: "reward_txn", shopperId } });
    const txns = result.result.docs.sort((a, b) => new Date(b.ts) - new Date(a.ts));
    const balance = txns.reduce((sum, t) => sum + (t.earned || 0) - (t.redeemed || 0), 0);
    const lifetimeEarned = txns.reduce((sum, t) => sum + (t.earned || 0), 0);
    const lifetimeRedeemed = txns.reduce((sum, t) => sum + (t.redeemed || 0), 0);
    res.json({
      ok: true,
      rewards: {
        shopperId,
        balance,
        lifetimeEarned,
        lifetimeRedeemed,
        recent: txns.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Admin Dashboard ----
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin_dashboard.html"));
});

/**
 * --- SPIRAL Phase 2 Test Routes ---
 * These endpoints feed mock/demo JSON for frontend validation
 */

// Entities (stores + malls)
app.get("/test/entities", (req, res) => {
  res.json({
    ok: true,
    entities: [
      { type: "store", name: "North Loop Coffee", category: "Cafe", zipCode: "55401" },
      { type: "mall", name: "Mall of America", location: "Bloomington, MN" }
    ]
  });
});

// Rewards (shopper rewards dashboard)
app.get("/test/rewards", (req, res) => {
  const txs = [
    { id: "tx1", earned: 200, txnType: "earn", store: "North Loop Coffee", ts: "2025-09-01T10:00:00Z" },
    { id: "tx2", redeemed: 100, txnType: "redeem", store: "Mill City Boutique", ts: "2025-09-05T14:30:00Z" }
  ];

  res.json({
    ok: true,
    rewards: {
      balance: 1500,
      lifetimeEarned: 2000,
      lifetimeRedeemed: 500,
      recent: txs
    }
  });
});

// Mall events
app.get("/test/events", (req, res) => {
  res.json({
    ok: true,
    events: [
      { mall: "Mall of America", title: "Makers Market", date: "2025-10-05", description: "Pop-up artisans." },
      { mall: "Ridgedale Center", title: "Fall Fashion Night", date: "2025-10-18", description: "Runway + discounts." }
    ]
  });
});

// Combined dashboard (entities + rewards + events)
app.get("/test/dashboard", (req, res) => {
  res.json({
    ok: true,
    dashboard: {
      entities: [
        { type: "store", name: "North Loop Coffee", category: "Cafe", zipCode: "55401" },
        { type: "mall", name: "Mall of America", location: "Bloomington, MN" }
      ],
      rewards: {
        balance: 1500,
        lifetimeEarned: 2000,
        lifetimeRedeemed: 500,
        recent: [
          { id: "tx1", earned: 200, txnType: "earn", store: "North Loop Coffee", ts: "2025-09-01T10:00:00Z" },
          { id: "tx2", redeemed: 100, txnType: "redeem", store: "Mill City Boutique", ts: "2025-09-05T14:30:00Z" }
        ]
      },
      events: [
        { mall: "Mall of America", title: "Makers Market", date: "2025-10-05", description: "Pop-up artisans." },
        { mall: "Ridgedale Center", title: "Fall Fashion Night", date: "2025-10-18", description: "Runway + discounts." }
      ]
    }
  });
});

// ---- Start ----
const server = app.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log(`🚀 SPIRAL backend running on ${addr.address}:${addr.port}`);
});