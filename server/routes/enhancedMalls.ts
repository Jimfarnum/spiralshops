// ======================================================
// Enhanced Malls Router - PostgreSQL Backed
// ======================================================

import express from "express";
import { db } from "../db";
import { malls, retailers, stores } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = express.Router();

// Validation schemas
const createMallSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  hours: z.string()
});

// ======================
// Get All Malls
// ======================
router.get("/", async (req, res) => {
  try {
    const allMalls = await db
      .select({
        id: malls.id,
        name: malls.name,
        description: malls.description,
        address: malls.address,
        city: malls.city,
        state: malls.state,
        storeCount: malls.storeCount,
        isActive: malls.isActive
      })
      .from(malls)
      .where(eq(malls.isActive, true))
      .orderBy(malls.name);

    res.json({ ok: true, malls: allMalls });
  } catch (err) {
    console.error("Error fetching malls:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch malls" });
  }
});

// ======================
// Get Mall Details
// ======================
router.get("/:mallId", async (req, res) => {
  try {
    const { mallId } = req.params;
    
    // Get mall details
    const [mall] = await db
      .select()
      .from(malls)
      .where(eq(malls.id, parseInt(mallId)));

    if (!mall) {
      return res.status(404).json({ ok: false, error: "Mall not found" });
    }

    res.json({ ok: true, mall });
  } catch (err) {
    console.error("Error fetching mall details:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch mall details" });
  }
});

// ======================
// Get Mall Stores
// ======================
router.get("/:mallId/stores", async (req, res) => {
  try {
    const { mallId } = req.params;
    
    // Get all retailers as stores (simplified for now)
    const storesList = await db
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
      .where(eq(retailers.approved, true));

    res.json({ ok: true, mallId, stores: storesList });
  } catch (err) {
    console.error("Error fetching mall stores:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch mall stores" });
  }
});

// ======================
// Get Mall Events
// ======================
router.get("/:mallId/events", async (req, res) => {
  try {
    const { mallId } = req.params;
    
    // Return sample events for now
    const events = [
      {
        id: 1,
        title: "Grand Opening Sale",
        description: "Special discounts and promotions",
        eventDate: new Date(),
        location: "Main Plaza"
      }
    ];

    res.json({ ok: true, mallId, events });
  } catch (err) {
    console.error("Error fetching mall events:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch mall events" });
  }
});

// ======================
// Create Mall Event
// ======================
router.post("/:mallId/events", async (req, res) => {
  try {
    const { mallId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ ok: false, error: "Title is required" });
    }

    // Return mock event for now
    const event = {
      id: Date.now(),
      mallId: parseInt(mallId),
      title,
      description: description || "",
      eventDate: new Date(),
      status: "created"
    };

    res.json({ ok: true, event });
  } catch (err) {
    console.error("Error creating mall event:", err);
    res.status(500).json({ ok: false, error: "Failed to create mall event" });
  }
});

// ======================
// Get Mall Dashboard
// ======================
router.get("/:mallId/dashboard", async (req, res) => {
  try {
    const { mallId } = req.params;
    
    // Get mall info
    const [mall] = await db
      .select()
      .from(malls)
      .where(eq(malls.id, parseInt(mallId)));

    if (!mall) {
      return res.status(404).json({ ok: false, error: "Mall not found" });
    }

    // Get store count
    const stores = await db
      .select()
      .from(mallStores)
      .where(eq(mallStores.mallId, parseInt(mallId)));

    // Get upcoming events
    const events = await db
      .select()
      .from(mallEvents)
      .where(eq(mallEvents.mallId, parseInt(mallId)))
      .orderBy(mallEvents.eventDate)
      .limit(5);

    const dashboard = {
      mall: {
        id: mall.id,
        name: mall.name,
        address: mall.address,
        storeCount: stores.length
      },
      stats: {
        totalStores: stores.length,
        upcomingEvents: events.length,
        isActive: mall.isActive
      },
      recentEvents: events,
      stores: stores.length
    };

    res.json({ ok: true, dashboard });
  } catch (err) {
    console.error("Error fetching mall dashboard:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch mall dashboard" });
  }
});

export default router;