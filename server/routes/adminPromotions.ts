// server/routes/adminPromotions.ts
import { Router } from "express";
import { db } from "../db";
import { promotions, type Promotion } from "../../shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * Create a new promotion
 * POST /api/admin/promotions/create
 * Body: { name, multiplier, startDate, endDate }
 */
router.post("/create", async (req, res) => {
  try {
    const { name, multiplier, startDate, endDate } = req.body;

    if (!name || !multiplier || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const promoData = {
      code: `PROMO-${Date.now()}`,
      name,
      multiplier: multiplier.toString(),
      partners: [],
      categories: [],
      storeIds: [],
      mallIds: [],
      startsAt: new Date(startDate),
      endsAt: new Date(endDate),
      active: false
    };

    const [promo] = await db.insert(promotions).values(promoData).returning();
    res.json({ success: true, promo });
  } catch (err) {
    console.error('Error creating promotion:', err);
    res.status(500).json({ error: "Failed to create promotion" });
  }
});

/**
 * Get all promotions
 * GET /api/admin/promotions/promotions
 */
router.get("/promotions", async (req, res) => {
  try {
    const allPromotions = await db.select().from(promotions);
    res.json({ success: true, promotions: allPromotions });
  } catch (err) {
    console.error('Error getting promotions:', err);
    res.status(500).json({ error: "Failed to get promotions" });
  }
});

/**
 * Approve a promotion
 * PATCH /api/admin/promotions/:code/approve
 */
router.patch("/:code/approve", async (req, res) => {
  try {
    const { code } = req.params;
    
    const [updatedPromo] = await db
      .update(promotions)
      .set({ 
        active: true,
        updatedAt: new Date()
      } as Partial<Promotion>)
      .where(eq(promotions.code, code))
      .returning();

    if (!updatedPromo) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    res.json({ success: true, promo: updatedPromo });
  } catch (err) {
    console.error('Error approving promotion:', err);
    res.status(500).json({ error: "Failed to approve promotion" });
  }
});

/**
 * Simulate promo impact
 * POST /api/admin/promotions/simulate
 * Body: { amountSpent: number, multiplier: number }
 */
router.post("/simulate", async (req, res) => {
  try {
    const { amountSpent, multiplier } = req.body;

    if (!amountSpent || !multiplier) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const baseEarned = amountSpent; // 1 SPIRAL = $1
    const promoEarned = amountSpent * multiplier;
    const extra = promoEarned - baseEarned;

    res.json({
      amountSpent,
      baseEarned,
      multiplier,
      promoEarned,
      extra,
      message: `Shoppers would earn ${extra} additional SPIRALS for every $${amountSpent} spent.`,
    });
  } catch (err) {
    console.error('Error simulating promotion:', err);
    res.status(500).json({ error: "Failed to simulate promo impact" });
  }
});

export default router;