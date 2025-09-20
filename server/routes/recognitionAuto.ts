import express, { Request, Response } from "express";
import cron from "node-cron";
import { getCloudant } from "../lib/cloudant.js";

const router = express.Router();
const db = getCloudant();

/** ---------- Helpers ---------- **/
type Retailer = any;

function computeEngagement(r: Retailer) {
  const m = r.metrics || {};
  const previews = m.previews || 0;           // campaign previews
  const downloads = m.downloads || 0;         // campaign pack downloads
  const posts = m.posts || 0;                 // posts published
  const shares = m.shares || 0;               // social shares/UGC
  const qrScans = m.qrScans || 0;             // flyer / store QR scans
  const spiralsRedeemed = m.spiralsRedeemed || 0; // loyalty redemptions
  
  // Weighted score (tuneable; kept simple & explainable)
  const score = previews*5 + downloads*10 + posts*20 + shares*15 + qrScans*2 + Math.min(spiralsRedeemed*0.1, 300);
  return Math.round(score);
}

function nextBadgeTargets(r: Retailer, peers: Retailer[]) {
  const score = r.engagement ?? 0;
  const last30Redeems = r.metrics?.last30Redeems ?? r.metrics?.spiralsRedeemed ?? 0;
  const years = r.yearsInBusiness || 0;

  // percentile in tier for "Top Performer"
  const peerScores = peers.map(p => p.engagement ?? 0).sort((a,b)=>a-b);
  const rank = peerScores.filter(s => s <= score).length;
  const percentile = Math.round(100 * rank / Math.max(peerScores.length,1));

  return {
    RisingStar: { 
      current: score, 
      target: 100, 
      met: score >= 100, 
      tip: "Post 2 short videos + enable QR at checkout." 
    },
    LoyaltyLeader: { 
      current: last30Redeems, 
      target: 500, 
      met: last30Redeems >= 500, 
      tip: "Promote 'double SPIRALs in-store' at POS & receipts." 
    },
    CommunityAnchor: { 
      current: years, 
      target: 10, 
      met: years >= 10 && score >= 300, 
      extra: `Also need engagement ≥ 300 (now ${score})`, 
      tip: "Run 1 monthly community event with QR check-ins." 
    },
    TopPerformerTier: { 
      current: percentile, 
      target: 90, 
      met: percentile >= 90, 
      tip: "Boost shares—ask customers to post & tag for SPIRALs." 
    }
  };
}

function awardBadges(r: Retailer, peers: Retailer[]) {
  const badges: string[] = r.badges || [];
  const t = nextBadgeTargets(r, peers);

  if (t.RisingStar.met && !badges.includes("Rising Star")) badges.push("Rising Star");
  if (t.LoyaltyLeader.met && !badges.includes("Loyalty Leader")) badges.push("Loyalty Leader");
  if (t.CommunityAnchor.met && !badges.includes("Community Anchor")) badges.push("Community Anchor");
  if (t.TopPerformerTier.met && !badges.includes("Top Performer (Tier)")) badges.push("Top Performer (Tier)");

  return Array.from(new Set(badges));
}

async function peersForTier(tier: string) {
  const result = await db.find("retailer_profiles", { 
    selector: { type: "retailerProfile", tier },
    limit: 1000 
  });
  return result.result?.docs || [];
}

async function recalcOne(retailerId: string) {
  try {
    // For demo purposes, use sample data if retailer not found
    let r: any;
    try {
      r = await db.get(retailerId);
    } catch {
      // Use sample data for demo
      r = {
        _id: retailerId,
        type: "retailerProfile",
        businessName: "Demo Store",
        tier: "Standard",
        metrics: {
          previews: 25,
          downloads: 8,
          posts: 12,
          shares: 6,
          qrScans: 45,
          spiralsRedeemed: 150,
          last30Redeems: 320
        },
        yearsInBusiness: 5,
        badges: ["Customer Favorite"]
      };
    }

    if (!r || r.type !== "retailerProfile") {
      throw new Error("Not a retailerProfile");
    }

    const score = computeEngagement(r);
    r.engagement = score;
    const peers = await peersForTier(r.tier || "Standard");
    r.badges = awardBadges(r, peers);
    r.lastAwardedAt = new Date().toISOString();
    
    await db.insert("retailer_profiles", r);

    // SOAP-G log
    await db.insert("soapg_logs", {
      type: "soapg_log",
      subsystem: "recognition",
      action: "recalc_one",
      retailerId,
      awarded: r.badges,
      engagement: r.engagement,
      ts: new Date().toISOString()
    });

    return { engagement: r.engagement, badges: r.badges };
  } catch (error) {
    console.error("Error in recalcOne:", error);
    throw error;
  }
}

async function recalcAll() {
  try {
    const result = await db.find("retailer_profiles", { 
      selector: { type: "retailerProfile" }, 
      limit: 100000 
    });
    const retailers: Retailer[] = result.result?.docs || [];
    
    // Precompute engagement
    retailers.forEach(r => r.engagement = computeEngagement(r));
    
    // Group peers by tier
    const byTier: Record<string, Retailer[]> = {};
    for (const r of retailers) {
      const t = r.tier || "Standard";
      (byTier[t] ||= []).push(r);
    }
    
    // Award badges
    for (const r of retailers) {
      const peers = byTier[r.tier || "Standard"] || [];
      r.badges = awardBadges(r, peers);
      r.lastAwardedAt = new Date().toISOString();
    }
    
    // Bulk update (simplified for demo)
    for (const retailer of retailers) {
      await db.insert("retailer_profiles", retailer);
    }

    await db.insert("soapg_logs", {
      type: "soapg_log",
      subsystem: "recognition",
      action: "recalc_all",
      total: retailers.length,
      ts: new Date().toISOString()
    });

    return { updated: retailers.length };
  } catch (error) {
    console.error("Error in recalcAll:", error);
    throw error;
  }
}

/** ---------- Routes ---------- **/

// Admin: recompute all (manual trigger)
router.post("/recompute-all", async (_req: Request, res: Response) => {
  try {
    const out = await recalcAll();
    res.json({ ok: true, ...out });
  } catch (e: any) {
    console.error("Recompute all error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Admin/Retailer: recompute one
router.post("/recompute/:retailerId", async (req: Request, res: Response) => {
  try {
    const out = await recalcOne(req.params.retailerId);
    res.json({ ok: true, ...out });
  } catch (e: any) {
    console.error("Recompute one error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Retailer: progress to next badges
router.get("/progress/:retailerId", async (req: Request, res: Response) => {
  try {
    let r: any;
    try {
      r = await db.get(req.params.retailerId);
    } catch {
      // Demo retailer data
      r = {
        _id: req.params.retailerId,
        type: "retailerProfile",
        businessName: "Demo Store",
        tier: "Standard", 
        engagement: 75,
        metrics: {
          previews: 25,
          downloads: 8,
          posts: 12,
          shares: 6,
          qrScans: 45,
          spiralsRedeemed: 150,
          last30Redeems: 320
        },
        yearsInBusiness: 5,
        badges: ["Customer Favorite"]
      };
    }

    const peers = await peersForTier(r.tier || "Standard");
    const progress = nextBadgeTargets(r, peers);
    
    res.json({ 
      ok: true, 
      engagement: r.engagement ?? 0, 
      badges: r.badges || [], 
      progress 
    });
  } catch (e: any) {
    console.error("Progress error:", e);
    res.status(404).json({ ok: false, error: e.message });
  }
});

// SOAP-G logs endpoint for admin visibility
router.get("/logs", async (req: Request, res: Response) => {
  try {
    const result = await db.find("soapg_logs", {
      selector: { type: "soapg_log", subsystem: "recognition" },
      limit: 50
    });
    
    res.json({
      ok: true,
      logs: result.result?.docs || []
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Nightly 2:05 AM award & progress refresh
cron.schedule("5 2 * * *", async () => {
  console.log("🕐 Running nightly recognition auto-award process...");
  try { 
    const result = await recalcAll(); 
    console.log(`✅ Nightly recognition update completed: ${result.updated} retailers processed`);
  } catch (error) { 
    console.error("❌ Nightly recognition update failed:", error);
  }
});

console.log("✅ SPIRAL Recognition Auto-Award system initialized with nightly CRON job");

export default router;