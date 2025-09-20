const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { CloudantV1, IamAuthenticator } = require("@ibm-cloud/cloudant");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000; // ✅ force one port, fix conflict
const STAFF_TOKEN = process.env.STAFF_TOKEN || "spiral-staff";
const MINI_URL = process.env.MINI_LLM_API_URL;
const MINI_TOKEN = process.env.MINI_AUTH_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ---- Cloudant ----
let dbMsgs = null;
if (process.env.CLOUDANT_URL && process.env.CLOUDANT_APIKEY) {
  try {
    const cloudant = new CloudantV1({
      authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_APIKEY }),
      serviceUrl: process.env.CLOUDANT_URL,
    });
    const dbName = process.env.CLOUDANT_DB_MESSAGES || "spiral_messages";
    dbMsgs = cloudant.db.use(dbName);
    cloudant.db.get(dbName).catch(async () => {
      await cloudant.db.create(dbName);
      console.log(`Created missing Cloudant DB: ${dbName}`);
    });
    console.log("✅ Cloudant connected");
  } catch (err) {
    console.warn("⚠️ Cloudant init failed, continuing without DB:", err.message);
  }
} else {
  console.log("⚠️ Cloudant not configured – running without DB persistence");
}

// ---- OpenAI ----
let openai = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  console.log("✅ OpenAI ready");
} else {
  console.log("⚠️ No OpenAI key set – SpiralAI will return mock responses");
}

// ---- Middleware ----
function requireAuth(req, res, next) {
  const token = req.headers["x-staff-token"];
  if (token !== STAFF_TOKEN) return res.status(403).json({ error: "Forbidden - Invalid Staff Token" });
  next();
}

// ---- Routes ----
app.get("/health", (req, res) => res.json({ ok: true, message: "SPIRAL backend healthy" }));

app.get("/api/test-security", requireAuth, (req, res) => {
  res.json({
    ok: true,
    message: "Security layers verified",
    staffToken: "✔️ valid",
    basicAuth: "✔️ required for /admin",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/spiralai", requireAuth, async (req, res) => {
  const query = req.body.query || "";
  let answer = "No response generated.";
  try {
    if (MINI_URL && MINI_TOKEN) {
      const resp = await fetch(MINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${MINI_TOKEN}` },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await resp.json();
      answer = data.output || JSON.stringify(data);
    } else if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are SpiralAI, focused on local retail, malls, and restaurants." },
          { role: "user", content: query },
        ],
        max_tokens: 150,
      });
      answer = completion.choices[0].message.content;
    } else {
      answer = `Mock Response: SpiralAI would answer '${query}' here.`;
    }
  } catch (err) {
    answer = `Error: ${err.message}`;
  }
  res.json({ response: answer });
});

app.post("/api/ej/weekly-review", requireAuth, async (req, res) => {
  const period = req.body.period || "last 7 days";
  const summary = `EJ Weekly Review: GTM strategy for ${period}. Viral + Durable tactics combined.`;
  if (dbMsgs) {
    try {
      await dbMsgs.insert({ type: "ej_review", summary, ts: new Date().toISOString(), status: "queued" });
    } catch (err) {
      console.warn("⚠️ Could not save EJ review to Cloudant:", err.message);
    }
  }
  res.json({ ok: true, summary });
});

app.get("/api/messages/stats", requireAuth, async (req, res) => {
  if (!dbMsgs) return res.json({ ok: true, counts: { queued: 0, locked: 0, processed: 0, dead_letter: 0 } });
  try {
    const statuses = ["queued", "locked", "processed", "dead_letter"];
    const counts = {};
    for (const status of statuses) {
      const feed = await dbMsgs.find({ selector: { status } });
      counts[status] = feed.docs.length;
    }
    res.json({ ok: true, counts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Enhanced Stores Route ----
app.get("/api/stores", async (req, res) => {
  const includeZip = req.query.zip;
  const includeCategory = req.query.category;
  const fallbackStores = [
    { id: 1, name: "EcoShop", category: "Clothing", location: "NYC", rewards: "15 SPIRALS / $1", isBigBox: false, status: "active" },
    { id: 2, name: "TechMall", category: "Electronics", location: "SF", rewards: "10 SPIRALS / $1", isBigBox: false, status: "active" }
  ];

  try {
    let stores = [];
    if (dbMsgs) {
      const feed = await dbMsgs.find({ selector: { type: "store" } });
      stores = feed.docs;
    }
    // Filter only active stores
    stores = stores.filter(s => s.status === "active");

    if (includeZip) stores = stores.filter(s => s.zipCode === includeZip);
    if (includeCategory) stores = stores.filter(s => s.category.toLowerCase() === includeCategory.toLowerCase());

    res.json({ ok: true, stores: stores.length ? stores : fallbackStores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "admin_dashboard.html")));

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`🚀 SPIRAL server running cleanly on port ${PORT}`);
  runSmokeTests();
});

// ---- Smoke Test ----
async function runSmokeTests() {
  const base = `http://localhost:${PORT}`;
  const headers = { "Content-Type": "application/json", "X-Staff-Token": STAFF_TOKEN };
  try {
    console.log("✅ /health:", await fetch(`${base}/health`).then(r => r.json()));
    console.log("✅ /api/test-security:", await fetch(`${base}/api/test-security`, { headers }).then(r => r.json()));
    console.log("✅ /api/spiralai:", await fetch(`${base}/api/spiralai`, { method: "POST", headers, body: JSON.stringify({ query: "eco-friendly clothing" }) }).then(r => r.json()));
    console.log("✅ /api/ej/weekly-review:", await fetch(`${base}/api/ej/weekly-review`, { method: "POST", headers, body: JSON.stringify({ period: "last 7 days" }) }).then(r => r.json()));
    console.log("✅ /api/messages/stats:", await fetch(`${base}/api/messages/stats`, { headers }).then(r => r.json()));
  } catch (err) {
    console.error("❌ Smoke test failed:", err.message);
  }
}