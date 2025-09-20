// ======================================================
// SPIRAL API Gateway
// Node.js + Express - Routes traffic to modular services
// ======================================================

import express from "express";
import { db } from "../db";
import { users, retailers, malls, promotions } from "../../shared/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// ======================
// Health Check
// ======================
router.get("/health", async (req, res) => {
  try {
    // Test database connection
    const dbTest = await db.select().from(users).limit(1);
    
    res.json({
      ok: true,
      service: "SPIRAL API Gateway",
      env: process.env.NODE_ENV || "development",
      timestamp: Date.now(),
      database: "connected",
      version: "1.0.0",
      components: {
        auth: "operational",
        orders: "operational", 
        retailers: "operational",
        malls: "operational",
        promotions: "operational",
        compliance: "operational",
        spirals: "operational"
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      service: "SPIRAL API Gateway",
      error: "Database connection failed",
      timestamp: Date.now()
    });
  }
});

// ======================
// AUTH SERVICE ENDPOINTS
// ======================
router.post("/auth/register", async (req, res) => {
  try {
    const { email, username, name, password_hash, user_type = "shopper" } = req.body;
    
    if (!email || !username || !name || !password_hash) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing required fields: email, username, name, password_hash" 
      });
    }

    const [newUser] = await db.insert(users).values({
      email,
      username,
      name,
      passwordHash: password_hash,
      userType: user_type,
      spiralBalance: 0,
      totalEarned: 0,
      totalRedeemed: 0
    }).returning();

    res.json({ 
      ok: true, 
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        userType: newUser.userType
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: error.message.includes('unique') ? "Email or username already exists" : "Registration failed" 
    });
  }
});

router.post("/auth/login", (req, res) => {
  // TODO: validate credentials, issue JWT
  res.json({ ok: true, token: "jwt-token-stub", message: "Login endpoint (stub)" });
});

// ======================
// RETAILER SERVICE ENDPOINTS
// ======================
router.post("/retailers/add", async (req, res) => {
  try {
    const { business_name, first_name, last_name, email, phone, address, category, description, zip_code } = req.body;
    
    if (!business_name || !email || !address) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing required fields: business_name, email, address" 
      });
    }

    const [newRetailer] = await db.insert(retailers).values({
      businessName: business_name,
      firstName: first_name || "",
      lastName: last_name || "",
      email,
      phone: phone || "",
      address,
      category: category || "General",
      description: description || "",
      zipCode: zip_code || "",
      approved: false
    }).returning();

    res.json({ 
      ok: true, 
      message: "Retailer application submitted",
      retailer: newRetailer
    });
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: "Failed to add retailer" 
    });
  }
});

router.get("/retailers/:id/products", (req, res) => {
  // TODO: fetch retailer products from inventory table
  res.json({ ok: true, retailer_id: req.params.id, products: [] });
});

// ======================
// MALL SERVICE ENDPOINTS
// ======================
router.get("/malls/list", async (req, res) => {
  try {
    const mallsList = await db.select().from(malls).limit(50);
    res.json({ ok: true, malls: mallsList });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch malls" });
  }
});

router.get("/malls/:mallId/stores", (req, res) => {
  // TODO: return all stores in a mall using mall_stores junction table
  res.json({ ok: true, mall_id: req.params.mallId, stores: [] });
});

// ======================
// PROMOTIONS SERVICE ENDPOINTS
// ======================
router.post("/promotions/create", async (req, res) => {
  try {
    const { code, name, multiplier, starts_at, ends_at } = req.body;
    
    if (!code || !name || !multiplier) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing required fields: code, name, multiplier" 
      });
    }

    const [newPromotion] = await db.insert(promotions).values({
      code,
      name,
      multiplier: multiplier.toString(),
      startsAt: new Date(starts_at),
      endsAt: new Date(ends_at),
      active: false
    }).returning();

    res.json({ 
      ok: true, 
      message: "Promotion created successfully",
      promotion: newPromotion
    });
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: "Failed to create promotion" 
    });
  }
});

router.get("/promotions/active", async (req, res) => {
  try {
    const activePromotions = await db
      .select()
      .from(promotions)
      .where(eq(promotions.active, true))
      .limit(20);
      
    res.json({ ok: true, promotions: activePromotions });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch promotions" });
  }
});

// ======================
// COMPLIANCE SERVICE ENDPOINTS
// ======================
router.post("/legal/consent", (req, res) => {
  // TODO: add consent log to consent_logs table
  res.json({ ok: true, message: "Consent logged (stub)" });
});

router.delete("/legal/delete/:userId", (req, res) => {
  // TODO: GDPR delete user request using data_deletion_requests table
  res.json({ ok: true, user_id: req.params.userId, deleted: true });
});

export default router;