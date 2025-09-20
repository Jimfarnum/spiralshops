import express from "express";
import { getCloudant } from "../lib/cloudant.js";

const router = express.Router();

// Cloudant connection with fallback
const cloudant = getCloudant();
let db: any = null;

// In-memory fallback storage for development
let auditHistoryFallback: any[] = [];

if (cloudant && cloudant.use) {
  try {
    db = cloudant.use("spiral_audit_history");
    console.log("[SOAP-G] Audit history database connected");
  } catch (err) {
    console.warn("[SOAP-G] Cloudant audit history database not available, using fallback storage");
  }
}

// Save today's audit snapshot
router.post("/audit/save", async (req, res) => {
  try {
    const snapshot = {
      _id: `audit_${new Date().toISOString().split("T")[0]}_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: req.body.status || "green",
      latencyMs: req.body.latencyMs || 0,
      routesTested: req.body.routesTested || 0,
      routesPassed: req.body.routesPassed || 0,
      routesFailed: req.body.routesFailed || 0,
      launchSafe: req.body.launchSafe || false,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(snapshot);
        console.log("[SOAP-G] Audit snapshot saved to Cloudant", snapshot);
      } catch (err) {
        console.warn("[SOAP-G] Cloudant save failed, using fallback", err);
        auditHistoryFallback.push(snapshot);
      }
    } else {
      auditHistoryFallback.push(snapshot);
      // Keep only last 30 days in fallback
      if (auditHistoryFallback.length > 30) {
        auditHistoryFallback = auditHistoryFallback.slice(-30);
      }
      console.log("[SOAP-G] Audit snapshot saved to fallback storage", snapshot);
    }

    res.json({ ok: true, snapshot });
  } catch (err: any) {
    console.error("[SOAP-G] Audit save error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Retrieve audit history (default 7 days, up to 30)
router.get("/audit/history", async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days as string) || 7, 30);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    let history: any[] = [];

    if (db) {
      try {
        const result = await db.find({
          selector: { date: { $gte: since } },
          sort: [{ date: "desc" }],
          limit: days
        });
        history = result.docs || [];
      } catch (err) {
        console.warn("[SOAP-G] Cloudant query failed, using fallback");
        history = auditHistoryFallback.filter(item => item.date >= since)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, days);
      }
    } else {
      history = auditHistoryFallback.filter(item => item.date >= since)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, days);
    }

    console.log(`[SOAP-G] Retrieved ${history.length} audit history records for ${days} days`);

    res.json({ 
      ok: true, 
      days, 
      count: history.length,
      history: history.reverse() // Show oldest first for chart display
    });
  } catch (err: any) {
    console.error("[SOAP-G] Audit history error:", err.message);
    res.status(500).json({ ok: false, error: err.message, history: [] });
  }
});

// Get audit summary statistics
router.get("/audit/summary", async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days as string) || 30, 30);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    let history: any[] = [];

    if (db) {
      try {
        const result = await db.find({
          selector: { date: { $gte: since } },
          sort: [{ date: "desc" }]
        });
        history = result.docs || [];
      } catch (err) {
        history = auditHistoryFallback.filter(item => item.date >= since);
      }
    } else {
      history = auditHistoryFallback.filter(item => item.date >= since);
    }

    const summary = {
      totalAudits: history.length,
      averageLatency: history.length > 0 ? Math.round(history.reduce((sum, item) => sum + (item.latencyMs || 0), 0) / history.length) : 0,
      successRate: history.length > 0 ? Math.round((history.filter(item => item.launchSafe).length / history.length) * 100) : 0,
      lastAuditDate: history[0]?.date || null,
      lastAuditStatus: history[0]?.status || "unknown"
    };

    res.json({ ok: true, days, summary });
  } catch (err: any) {
    console.error("[SOAP-G] Audit summary error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;