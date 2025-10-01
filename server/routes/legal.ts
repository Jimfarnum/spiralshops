import { Router } from "express";
import fs from "fs";
import path from "path";
import { z } from "zod";
import LegalConsent from "../models/LegalConsent.js";
import { mdToHtml } from "../utils/md.js";
import { LEGAL_VERSIONS, LEGAL_EFFECTIVE_DATE } from "../config/legal.js";

const router = Router();
const legalDir = path.resolve(process.cwd(), "legal");

function readMD(name: string) {
  const p = path.join(legalDir, name);
  return fs.readFileSync(p, "utf8");
}

router.get("/versions", (_req, res) => {
  res.json({ effectiveDate: LEGAL_EFFECTIVE_DATE, versions: LEGAL_VERSIONS });
});

router.get("/terms.html", (_req, res) => {
  const html = mdToHtml(readMD("terms_2025-08-26.md"));
  res.type("html").send(html);
});
router.get("/privacy.html", (_req, res) => {
  const html = mdToHtml(readMD("privacy_2025-08-26.md"));
  res.type("html").send(html);
});
router.get("/refunds.html", (_req, res) => {
  const html = mdToHtml(readMD("refunds_2025-08-26.md"));
  res.type("html").send(html);
});
router.get("/guarantee.html", (_req, res) => {
  const html = mdToHtml(readMD("guarantee_2025-08-26.md"));
  res.type("html").send(html);
});

// raw md (optional)
router.get("/terms.md", (_req, res) => res.type("text/markdown").send(readMD("terms_2025-08-26.md")));
router.get("/privacy.md", (_req, res) => res.type("text/markdown").send(readMD("privacy_2025-08-26.md")));
router.get("/refunds.md", (_req, res) => res.type("text/markdown").send(readMD("refunds_2025-08-26.md")));
router.get("/guarantee.md", (_req, res) => res.type("text/markdown").send(readMD("guarantee_2025-08-26.md")));

// record consent
const ConsentBody = z.object({
  userId: z.string().min(1),
  role: z.enum(["shopper","retailer","mall","admin"]),
  termsVersion: z.string().min(1),
  privacyVersion: z.string().min(1),
  refundsVersion: z.string().min(1),
  guaranteeVersion: z.string().min(1),
  acceptedFrom: z.enum(["web","ios","android"]).default("web")
});

router.post("/consent", async (req, res) => {
  const parsed = ConsentBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
  const ua = req.headers["user-agent"] || "";
  const doc = await LegalConsent.create({
    ...parsed.data,
    ipAddress: ip,
    userAgent: ua,
    consentedAt: new Date()
  });
  res.json({ ok: true, id: doc._id });
});

// helper: check current consent (use as middleware where needed)
export function requireCurrentConsent() {
  return async function(req: any, res: any, next: any) {
    try {
      const userId = req.user?._id || req.user?.id; // adapt to your auth
      const role = req.user?.role || "shopper";
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const latest = await LegalConsent.findOne({ userId }).sort({ consentedAt: -1 });
      const v = LEGAL_VERSIONS;
      const ok = latest &&
                 latest.termsVersion === v.termsVersion &&
                 latest.privacyVersion === v.privacyVersion &&
                 latest.refundsVersion === v.refundsVersion &&
                 latest.guaranteeVersion === v.guaranteeVersion;

      if (!ok) {
        return res.status(428).json({
          error: "ConsentRequired",
          message: "Please review and accept the latest legal terms.",
          versions: v
        });
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

// Check consent status endpoint
// SPIRAL Core API consent endpoint
router.post('/consent/cloudant', async (req, res) => {
  try {
    const { userId, termsVersion, privacyVersion, refundsVersion, guaranteeVersion } = req.body;
    if (!userId || !termsVersion || !privacyVersion) {
      return res.status(400).json({ error: 'versions_required' });
    }
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Use the Cloudant service for consistency with SPIRAL Core API
    const { recordConsent } = await import('../services/legalService.js');
    const result = await recordConsent({ userId, termsVersion, privacyVersion, refundsVersion, guaranteeVersion, ipAddress: String(ipAddress||'') });
    res.json(result);
  } catch (error) {
    console.error('Error recording consent:', error);
    res.status(500).json({ error: 'Failed to record consent' });
  }
});

router.post('/consent/check', async (req, res) => {
  try {
    const { userId, role, currentVersions } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For now, assume consent check returns false (requires consent)
    // In a real implementation, this would check against database records
    const hasConsent = false;
    
    console.log(`📋 Consent check for ${role} user ${userId}: ${hasConsent ? 'Valid' : 'Required'}`);

    res.json({ 
      success: true,
      hasConsent,
      userId,
      role,
      checkedVersions: currentVersions,
      checkedAt: new Date()
    });
  } catch (error) {
    console.error('Error checking consent:', error);
    res.status(500).json({ error: 'Failed to check consent status' });
  }
});

export default router;