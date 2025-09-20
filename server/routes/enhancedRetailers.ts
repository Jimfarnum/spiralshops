// ======================================================
// Enhanced Retailers Router - PostgreSQL Backed
// ======================================================

import express from "express";
import { db } from "../db";
import { retailers, stores } from "../../shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

const router = express.Router();

// Validation schemas
const createRetailerSchema = z.object({
  businessName: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  category: z.string(),
  zipCode: z.string()
});

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
  variants: z.any().optional(),
  images: z.any().optional()
});

// ======================
// Get All Retailers
// ======================
router.get("/", async (req, res) => {
  try {
    const allRetailers = await db
      .select({
        id: retailers.id,
        businessName: retailers.businessName,
        email: retailers.email,
        phone: retailers.phone,
        address: retailers.address,
        category: retailers.category,
        approved: retailers.approved
      })
      .from(retailers)
      .orderBy(retailers.businessName);

    res.json({ ok: true, retailers: allRetailers });
  } catch (err) {
    console.error("Error fetching retailers:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch retailers" });
  }
});

// ======================
// Get Retailer Details
// ======================
router.get("/:retailerId", async (req, res) => {
  try {
    const { retailerId } = req.params;
    
    const [retailer] = await db
      .select()
      .from(retailers)
      .where(eq(retailers.id, parseInt(retailerId)));

    if (!retailer) {
      return res.status(404).json({ ok: false, error: "Retailer not found" });
    }

    res.json({ ok: true, retailer });
  } catch (err) {
    console.error("Error fetching retailer:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch retailer" });
  }
});

// ======================
// Get Retailer Products
// ======================
router.get("/:retailerId/products", async (req, res) => {
  try {
    const { retailerId } = req.params;
    
    const products = await db
      .select()
      .from(inventory)
      .where(eq(inventory.retailerId, parseInt(retailerId)))
      .orderBy(desc(inventory.createdAt));

    res.json({ ok: true, retailerId, products });
  } catch (err) {
    console.error("Error fetching retailer products:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch retailer products" });
  }
});

// ======================
// Add Product to Inventory
// ======================
router.post("/:retailerId/products", async (req, res) => {
  try {
    const { retailerId } = req.params;
    const validatedData = createProductSchema.parse(req.body);
    
    const [product] = await db
      .insert(inventory)
      .values({
        retailerId: parseInt(retailerId),
        ...validatedData
      })
      .returning();

    res.json({ ok: true, product });
  } catch (err) {
    console.error("Error adding product:", err);
    
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid product data", 
        details: err.errors 
      });
    }
    
    res.status(500).json({ ok: false, error: "Failed to add product" });
  }
});

// ======================
// Get Retailer Promotions
// ======================
router.get("/:retailerId/promotions", async (req, res) => {
  try {
    const { retailerId } = req.params;
    
    const promotions = await db
      .select()
      .from(retailerPromotions)
      .where(eq(retailerPromotions.retailerId, parseInt(retailerId)))
      .orderBy(desc(retailerPromotions.createdAt));

    res.json({ ok: true, retailerId, promotions });
  } catch (err) {
    console.error("Error fetching retailer promotions:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch retailer promotions" });
  }
});

// ======================
// Create Retailer Promotion
// ======================
router.post("/:retailerId/promotions", async (req, res) => {
  try {
    const { retailerId } = req.params;
    const { promoType, value, startDate, endDate } = req.body;

    if (!promoType || !value) {
      return res.status(400).json({ ok: false, error: "Promo type and value are required" });
    }

    const [promotion] = await db
      .insert(retailerPromotions)
      .values({
        retailerId: parseInt(retailerId),
        promoType,
        value,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active'
      })
      .returning();

    res.json({ ok: true, promotion });
  } catch (err) {
    console.error("Error creating retailer promotion:", err);
    res.status(500).json({ ok: false, error: "Failed to create retailer promotion" });
  }
});

// ======================
// Get Retailer Dashboard
// ======================
router.get("/:retailerId/dashboard", async (req, res) => {
  try {
    const { retailerId } = req.params;
    
    // Get retailer info
    const [retailer] = await db
      .select()
      .from(retailers)
      .where(eq(retailers.id, parseInt(retailerId)));

    if (!retailer) {
      return res.status(404).json({ ok: false, error: "Retailer not found" });
    }

    // Get product count
    const products = await db
      .select()
      .from(inventory)
      .where(eq(inventory.retailerId, parseInt(retailerId)));

    // Get active promotions
    const promotions = await db
      .select()
      .from(retailerPromotions)
      .where(
        and(
          eq(retailerPromotions.retailerId, parseInt(retailerId)),
          eq(retailerPromotions.status, 'active')
        )
      );

    // Get mall associations
    const mallAssociations = await db
      .select()
      .from(mallStores)
      .where(eq(mallStores.retailerId, parseInt(retailerId)));

    const dashboard = {
      retailer: {
        id: retailer.id,
        businessName: retailer.businessName,
        email: retailer.email,
        approved: retailer.approved
      },
      stats: {
        totalProducts: products.length,
        activePromotions: promotions.length,
        mallPartnerships: mallAssociations.length,
        status: retailer.approved ? 'approved' : 'pending'
      },
      recentProducts: products.slice(0, 5),
      activePromotions: promotions
    };

    res.json({ ok: true, dashboard });
  } catch (err) {
    console.error("Error fetching retailer dashboard:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch retailer dashboard" });
  }
});

export default router;