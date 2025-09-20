import { Router } from "express";
import { db } from "../db.js"; // Correct import path
import { promotions } from "../../shared/schema.js";
import { Promotion } from "../services/promotionService.js";
import { eq } from "drizzle-orm";

const router = Router();

// Admin authentication middleware
function requireAdmin(req: any, res: any, next: any) {
  const adminKey = req.header('x-admin-key') || req.header('authorization')?.replace('Bearer ', '');
  const validAdminKey = process.env.ADMIN_KEY || process.env.SPIRAL_ADMIN_KEY || process.env.ADMIN_TOKEN;
  
  if (!adminKey || !validAdminKey || adminKey !== validAdminKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - SPIRAL Admin access required'
    });
  }
  next();
}

// Create a new promotion
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { type, multiplier, startDate, endDate } = req.body;

    if (!type || !multiplier || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const code = `PROMO_${Date.now()}`;
    const newPromo = {
      code,
      name: `${type} Promotion`,
      multiplier: multiplier.toString(),
      partners: [],
      categories: [],
      storeIds: [],
      mallIds: [],
      startsAt: new Date(startDate),
      endsAt: new Date(endDate),
      active: true
    };

    const [createdPromo] = await db.insert(promotions).values(newPromo).returning();
    res.status(201).json({ message: "Promotion created", promo: createdPromo });
  } catch (err) {
    console.error("Create promotion error:", err);
    res.status(500).json({ error: "Failed to create promotion" });
  }
});

// List all promotions
router.get("/", requireAdmin, async (_req, res) => {
  try {
    const promos = await db.query.promotions.findMany();
    res.json(promos);
  } catch (err) {
    console.error("List promotions error:", err);
    res.status(500).json({ error: "Failed to fetch promotions" });
  }
});

// Update promotion status (activate/deactivate)
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const promo = await db.query.promotions.findFirst({
      where: eq(promotions.code, id)
    });

    if (!promo) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    const [updatedPromo] = await db.update(promotions)
      .set({ 
        active: active ?? !promo.active,
        updatedAt: new Date()
      })
      .where(eq(promotions.code, id))
      .returning();

    res.json({ 
      message: `Promotion ${updatedPromo.active ? 'activated' : 'deactivated'}`,
      promo: updatedPromo 
    });
  } catch (err) {
    console.error("Update promotion error:", err);
    res.status(500).json({ error: "Failed to update promotion" });
  }
});

export default router;