// ======== SPIRAL Hybrid Server Diag ========
const fs = require("fs");
const path = require("path");
const { monitorEventLoopDelay } = require("perf_hooks");
const { Pool } = require("pg");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const BUILD_ID = process.env.BUILD_ID || new Date().toISOString();

// PostgreSQL connection (adjust to your env vars)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- Heartbeat (proves server is alive + new code deployed) ---
setInterval(() => {
  console.log(`[HEARTBEAT] ${new Date().toISOString()} build=${BUILD_ID} memMB=${(process.memoryUsage().rss/1048576).toFixed(1)}`);
}, 5000);

// --- Event loop lag check ---
const loopLag = monitorEventLoopDelay({ resolution: 10 });
loopLag.enable();
setInterval(() => {
  const lag95 = (loopLag.percentile(95) / 1e6).toFixed(1);
  if (lag95 > 200) console.warn(`[WARN] Event loop lag high: p95=${lag95}ms`);
  loopLag.reset();
}, 4000);

// --- Request timing ---
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  const tag = `${req.method} ${req.originalUrl}`;
  const timer = setTimeout(() => console.warn(`[SLOW] ${tag} still running after 5s`), 5000);

  res.on("finish", () => {
    clearTimeout(timer);
    const durMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`[REQ] ${tag} -> ${res.statusCode} in ${durMs.toFixed(1)}ms`);
  });
  next();
});

// --- Health check endpoint ---
app.get("/__health", async (req, res) => {
  try {
    // DB check
    const dbResult = await pool.query("SELECT NOW() as db_time");
    // JSON file check
    const jsonPath = path.join(__dirname, "..", "data", "spiral_sample_products.json");
    const productData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    res.json({
      ok: true,
      build: BUILD_ID,
      db_time: dbResult.rows[0].db_time,
      product_sample: productData[0] || null,
      ts: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Diag counter ---
let loopCounter = 0;
app.get("/__diag", (req, res) => {
  loopCounter++;
  res.json({
    ok: true,
    build: BUILD_ID,
    loopCounter,
    rssMB: (process.memoryUsage().rss / 1048576).toFixed(1),
    uptimeSec: process.uptime().toFixed(1)
  });
});

// --- Start server ---
if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`[BOOT] SPIRAL diag server listening on :${PORT} build=${BUILD_ID}`);
    console.log(`[TIP] Hit /__health to verify DB + JSON, /__diag to test loop counter.`);
  });
}

module.exports = app;