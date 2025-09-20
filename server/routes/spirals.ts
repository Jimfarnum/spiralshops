// ======================================================
// SPIRALS Router - PostgreSQL Backed
// ======================================================

import express from "express";
import { db } from "../db";
import { spiralTransactions, users } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = express.Router();

// Validation schemas
const earnSpiralSchema = z.object({
  user_id: z.coerce.number().int().positive(),
  order_id: z.string().optional(),
  amount: z.coerce.number().int().positive(),
  source: z.string().default("purchase"),
  description: z.string().default("SPIRALS earned")
});

const redeemSpiralSchema = z.object({
  user_id: z.coerce.number().int().positive(),
  order_id: z.string().optional(),
  amount: z.coerce.number().int().positive()
});

// ======================
// Earn SPIRALS
// ======================
router.post("/earn", async (req, res) => {
  try {
    // Validate input data
    const validatedData = earnSpiralSchema.parse(req.body);
    const { user_id, order_id, amount, source, description } = validatedData;

    // Use database transaction for atomic operation
    const result = await db.transaction(async (tx) => {
      // Get current user balance
      const [user] = await tx
        .select({ 
          spiralBalance: users.spiralBalance,
          totalEarned: users.totalEarned
        })
        .from(users)
        .where(eq(users.id, user_id));

      if (!user) {
        throw new Error("User not found");
      }

      // Insert earning transaction
      const [transaction] = await tx
        .insert(spiralTransactions)
        .values({
          userId: user_id,
          type: "earn",
          amount,
          source,
          description,
          orderId: order_id || null,
          storeId: null
        })
        .returning();

      // Update user balance and total earned
      await tx
        .update(users)
        .set({ 
          spiralBalance: (user.spiralBalance || 0) + amount,
          totalEarned: (user.totalEarned || 0) + amount
        })
        .where(eq(users.id, user_id));

      const newBalance = (user.spiralBalance || 0) + amount;
      return { transaction, balance: newBalance };
    });

    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("Error earning SPIRALS:", err);
    
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid input data", 
        details: err.errors 
      });
    }
    
    res.status(500).json({ ok: false, error: "Failed to earn SPIRALS" });
  }
});

// ======================
// Redeem SPIRALS
// ======================
router.post("/redeem", async (req, res) => {
  try {
    // Validate input data
    const validatedData = redeemSpiralSchema.parse(req.body);
    const { user_id, order_id, amount } = validatedData;

    // Use database transaction for atomic operation
    const result = await db.transaction(async (tx) => {
      // Get current user balance and totalRedeemed
      const [user] = await tx
        .select({ 
          spiralBalance: users.spiralBalance,
          totalRedeemed: users.totalRedeemed
        })
        .from(users)
        .where(eq(users.id, user_id));

      if (!user) {
        throw new Error("User not found");
      }

      const currentBalance = user.spiralBalance || 0;
      if (currentBalance < amount) {
        throw new Error("Insufficient SPIRALS");
      }

      // Insert redemption transaction
      const [transaction] = await tx
        .insert(spiralTransactions)
        .values({
          userId: user_id,
          type: "redeem",
          amount,
          source: "redemption",
          description: "SPIRALS redeemed",
          orderId: order_id || null,
          storeId: null
        })
        .returning();

      // Update user balance and total redeemed (FIXED: add to existing totalRedeemed, not balance)
      await tx
        .update(users)
        .set({ 
          spiralBalance: currentBalance - amount,
          totalRedeemed: (user.totalRedeemed || 0) + amount
        })
        .where(eq(users.id, user_id));

      const newBalance = currentBalance - amount;
      return { transaction, balance: newBalance };
    });

    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("Error redeeming SPIRALS:", err);
    
    // Handle validation errors
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: "Invalid input data", 
        details: err.errors 
      });
    }
    
    // Handle business logic errors
    if (err.message === "User not found") {
      return res.status(404).json({ ok: false, error: "User not found" });
    }
    
    if (err.message === "Insufficient SPIRALS") {
      return res.status(400).json({ ok: false, error: "Insufficient SPIRALS" });
    }
    
    res.status(500).json({ ok: false, error: "Failed to redeem SPIRALS" });
  }
});

// ======================
// Get SPIRALS Balance
// ======================
router.get("/balance/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [user] = await db
      .select({ 
        balance: users.spiralBalance,
        totalEarned: users.totalEarned,
        totalRedeemed: users.totalRedeemed
      })
      .from(users)
      .where(eq(users.id, parseInt(userId)));

    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    res.json({ 
      ok: true, 
      user_id: userId, 
      balance: user.balance,
      total_earned: user.totalEarned,
      total_redeemed: user.totalRedeemed
    });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch balance" });
  }
});

// ======================
// Get SPIRALS History
// ======================
// ======================
// Get SPIRALS Balance
// ======================
router.get("/balance", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        ok: false,
        error: "userId query parameter required"
      });
    }

    const user_id = parseInt(userId as string);
    if (isNaN(user_id)) {
      return res.status(400).json({
        ok: false,
        error: "userId must be a valid number"
      });
    }

    // Get user balance
    const [user] = await db
      .select({ 
        spiralBalance: users.spiralBalance,
        totalEarned: users.totalEarned
      })
      .from(users)
      .where(eq(users.id, user_id));

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "User not found"
      });
    }

    res.json({
      ok: true,
      userId: user_id,
      spirals: user.spiralBalance || 0,
      totalEarned: user.totalEarned || 0
    });

  } catch (error: any) {
    console.error("[spirals balance] error:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch balance",
      detail: error.message
    });
  }
});

router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await db
      .select()
      .from(spiralTransactions)
      .where(eq(spiralTransactions.userId, parseInt(userId)))
      .orderBy(desc(spiralTransactions.createdAt))
      .limit(50);

    res.json({ ok: true, user_id: userId, history });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch history" });
  }
});

export default router;