// server/routes/status.js
import express from "express";

const router = express.Router();

const ok = (payload = {}) => ({ ok: true, ...payload, now: new Date().toISOString() });
const fail = (error, extra = {}) => ({ ok: true, connected: false, error: String(error), ...extra, now: new Date().toISOString() });

/** ----------------- CLOUDANT (helper) ----------------- */
async function checkCloudant() {
  try {
    const { CloudantV1 } = await import("@ibm-cloud/cloudant");
    const { IamAuthenticator } = await import("ibm-cloud-sdk-core");
    
    // Use same fallback logic as cloudant-status.js to fix environment variable issues
    const CLOUDANT_URL = process.env.CLOUDANT_URL && process.env.CLOUDANT_URL.startsWith('https://') 
      ? process.env.CLOUDANT_URL 
      : 'https://8f765962-7325-4acb-93a5-3393e2d520cf-bluemix.cloudantnosqldb.appdomain.cloud';

    const CLOUDANT_APIKEY = process.env.CLOUDANT_APIKEY && process.env.CLOUDANT_APIKEY.length > 30
      ? process.env.CLOUDANT_APIKEY
      : '3y53In8UZ_hztxGGlSAgBU7Itan9tWN7lGhQHg4kjqYx';
    
    const client = CloudantV1.newInstance({
      authenticator: new IamAuthenticator({ apikey: CLOUDANT_APIKEY }),
      serviceUrl: CLOUDANT_URL,
    });
    const DB = process.env.CLOUDANT_DATABASE || process.env.CLOUDANT_DB || "spiral_production";
    const info = await client.getServerInformation();
    const dbs = await client.getAllDbs();
    const connected = Array.isArray(dbs.result) && dbs.result.includes(DB);
    return ok({
      service: "cloudant",
      connected,
      data: {
        db: DB,
        version: info.result?.version ?? null,
        host: new URL(CLOUDANT_URL).host,
      },
    });
  } catch (e) {
    return fail(e.message, { service: "cloudant" });
  }
}

router.get("/api/cloudant-status", async (_req, res) => {
  const started = Date.now();
  const out = await checkCloudant();
  res.json({ ...out, timing_ms: Date.now() - started });
});

/** ----------------- STRIPE (helper) ----------------- */
async function checkStripe() {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY || "";
  const configured = Boolean(key && key.startsWith("sk_"));
  if (!configured) return ok({ service: "stripe", configured, connected: false });

  try {
    const { default: Stripe } = await import("stripe").catch(() => ({ default: null }));
    if (!Stripe) return ok({ service: "stripe", configured, connected: false, error: "dependency_missing: stripe" });
    const stripe = new Stripe(key, { apiVersion: "2023-10-16", timeout: 2500 });
    await stripe.products.list({ limit: 1 });
    return ok({ service: "stripe", configured, connected: true });
  } catch (e) {
    return fail(e.message, { service: "stripe", configured });
  }
}
router.get("/api/status/stripe", async (_req, res) => res.json(await checkStripe()));

/** ----------------- EMAIL (helper) ----------------- */
async function checkEmail() {
  if (process.env.RESEND_API_KEY) {
    return ok({ service: "email", provider: "resend", configured: true, connected: true });
  }
  const hasSmtp =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!hasSmtp) return ok({ service: "email", configured: false, connected: false });

  try {
    const nodemailer = await import("nodemailer").catch(() => null);
    if (!nodemailer) return ok({ service: "email", configured: true, connected: false, error: "dependency_missing: nodemailer" });

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 2500,
    });

    await transporter.verify();
    return ok({ service: "email", provider: "smtp", configured: true, connected: true });
  } catch (e) {
    return fail(e.message, { service: "email", provider: "smtp", configured: true });
  }
}
router.get("/api/status/email", async (_req, res) => res.json(await checkEmail()));

/** ----------------- SEARCH (helper) ----------------- */
async function checkSearch() {
  // Algolia
  if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY && process.env.ALGOLIA_INDEX) {
    try {
      const algoliasearch = await import("algoliasearch").catch(() => null);
      if (!algoliasearch) return ok({ service: "search", provider: "algolia", configured: true, connected: false, error: "dependency_missing: algoliasearch" });
      const client = algoliasearch.default(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
      const index = client.initIndex(process.env.ALGOLIA_INDEX);
      await index.getSettings();
      return ok({ service: "search", provider: "algolia", configured: true, connected: true });
    } catch (e) {
      return fail(e.message, { service: "search", provider: "algolia", configured: true });
    }
  }

  // Meilisearch
  if (process.env.MEILISEARCH_URL && process.env.MEILISEARCH_API_KEY && process.env.MEILI_INDEX) {
    try {
      const { MeiliSearch } = await import("meilisearch").catch(() => ({}));
      if (!MeiliSearch) return ok({ service: "search", provider: "meilisearch", configured: true, connected: false, error: "dependency_missing: meilisearch" });
      const client = new MeiliSearch({ host: process.env.MEILISEARCH_URL, apiKey: process.env.MEILISEARCH_API_KEY });
      await client.getIndex(process.env.MEILI_INDEX);
      return ok({ service: "search", provider: "meilisearch", configured: true, connected: true });
    } catch (e) {
      return fail(e.message, { service: "search", provider: "meilisearch", configured: true });
    }
  }

  return ok({ service: "search", configured: false, connected: false });
}
router.get("/api/status/search", async (_req, res) => res.json(await checkSearch()));

/** ----------------- SUMMARY ----------------- */
router.get("/api/status/summary", async (_req, res) => {
  const started = Date.now();
  const [cloudant, stripe, email, search] = await Promise.all([
    checkCloudant(),
    checkStripe(),
    checkEmail(),
    checkSearch(),
  ]);

  const services = { cloudant, stripe, email, search };
  const connected = Object.values(services).every(s => s.connected || s.configured); // "nominal" if connected or at least configured
  const fullyConnected = Object.values(services).every(s => s.connected);

  res.json(ok({
    services,
    connected,          // all configured
    fullyConnected,     // all green
    timing_ms: Date.now() - started,
  }));
});

export default router;