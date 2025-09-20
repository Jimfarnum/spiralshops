// server/routes/cloudant-status.js
import express from "express";
import { CloudantV1 } from "@ibm-cloud/cloudant";
import { IamAuthenticator } from "ibm-cloud-sdk-core";

const router = express.Router();

// Fallback to correct IBM Cloud credentials when env vars aren't working in Replit
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

router.get("/cloudant-status", async (_req, res) => {
  const started = Date.now();
  try {
    // light ping: server info + verify DB exists
    const info = await client.getServerInformation();
    const dbs = await client.getAllDbs();
    let connected = Array.isArray(dbs.result) && dbs.result.includes(DB);
    
    // If database doesn't exist, try to create it automatically
    if (!connected) {
      try {
        await client.putDatabase({ db: DB });
        // Verify creation by checking databases again
        const updatedDbs = await client.getAllDbs();
        connected = Array.isArray(updatedDbs.result) && updatedDbs.result.includes(DB);
      } catch (createError) {
        // Database creation might fail due to permissions or already exists
        console.log(`Database auto-creation: ${createError.message}`);
      }
    }

    res.json({
      ok: true,
      connected,
      data: {
        db: DB,
        couchdb: info.result?.couchdb ?? null,
        version: info.result?.version ?? null,
        host: new URL(CLOUDANT_URL).host, // mask full URL
        available_databases: dbs.result?.length || 0,
        databases_list: connected ? "Database exists" : "Database not found"
      },
      timing_ms: Date.now() - started,
      now: new Date().toISOString(),
    });
  } catch (e) {
    res.status(200).json({
      ok: true,
      connected: false,
      error: String(e?.message || e),
      timing_ms: Date.now() - started,
      now: new Date().toISOString(),
    });
  }
});

// Route to create the production database if it doesn't exist
router.post("/cloudant-create-db", async (_req, res) => {
  const started = Date.now();
  try {
    // Check if database exists first
    const dbs = await client.getAllDbs();
    const exists = Array.isArray(dbs.result) && dbs.result.includes(DB);
    
    if (exists) {
      return res.json({
        ok: true,
        created: false,
        message: `Database '${DB}' already exists`,
        timing_ms: Date.now() - started,
        now: new Date().toISOString(),
      });
    }
    
    // Create the database
    await client.putDatabase({ db: DB });
    
    res.json({
      ok: true,
      created: true,
      message: `Database '${DB}' created successfully`,
      timing_ms: Date.now() - started,
      now: new Date().toISOString(),
    });
    
  } catch (e) {
    res.status(500).json({
      ok: false,
      created: false,
      error: String(e?.message || e),
      timing_ms: Date.now() - started,
      now: new Date().toISOString(),
    });
  }
});

export default router;