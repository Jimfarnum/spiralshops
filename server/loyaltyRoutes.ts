import type { Express } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import { userLoyalty, loyaltyTransactions, users } from "@shared/schema";
import { nanoid } from "nanoid";

interface LoyaltyDashboardData {
  userId: string;
  totalEarned: number;
  currentBalance: number;
  pendingPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referralCode: string;
  referralCount: number;
  nextTierPoints: number;
  progressToNextTier: number;
}

interface LoyaltyTransactionResponse {
  id: string;
  date: string;
  description: string;
  earned: number;
  redeemed: number;
  balance: number;
  type: 'earned' | 'redeemed';
  orderId?: string;
  status: 'completed' | 'pending' | 'processing';
}

const calculateTier = (totalEarned: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
  if (totalEarned >= 5000) return 'Platinum';
  if (totalEarned >= 2500) return 'Gold';
  if (totalEarned >= 1000) return 'Silver';
  return 'Bronze';
};

const getNextTierPoints = (tier: string): number => {
  switch (tier) {
    case 'Bronze': return 1000;
    case 'Silver': return 2500;
    case 'Gold': return 5000;
    case 'Platinum': return 5000; // Max tier
    default: return 1000;
  }
};

const calculateProgress = (totalEarned: number, tier: string): number => {
  const tierThresholds = {
    'Bronze': { current: 0, next: 1000 },
    'Silver': { current: 1000, next: 2500 },
    'Gold': { current: 2500, next: 5000 },
    'Platinum': { current: 5000, next: 5000 }
  };
  
  const thresholds = tierThresholds[tier as keyof typeof tierThresholds];
  if (tier === 'Platinum') return 100;
  
  const progress = ((totalEarned - thresholds.current) / (thresholds.next - thresholds.current)) * 100;
  return Math.max(0, Math.min(100, progress));
};

export function registerLoyaltyRoutes(app: Express) {
  // Get user loyalty dashboard data
  app.get('/api/loyalty/dashboard', async (req, res) => {
    try {
      // Mock authentication - replace with real auth
      const userId = 1; // This would come from session/token
      
      // Get or create user loyalty record
      let [loyaltyRecord] = await db
        .select()
        .from(userLoyalty)
        .where(eq(userLoyalty.userId, userId));

      if (!loyaltyRecord) {
        // Create new loyalty record for user
        const referralCode = `SPIRAL-${nanoid(8).toUpperCase()}`;
        [loyaltyRecord] = await db
          .insert(userLoyalty)
          .values({
            userId,
            referralCode,
            totalEarned: 2150, // Mock data for demo
            currentBalance: 1875,
            pendingPoints: 125,
            tier: 'Gold',
            referralCount: 8,
          })
          .returning();
      }

      // Calculate tier and progress
      const tier = calculateTier(loyaltyRecord.totalEarned);
      const nextTierPoints = getNextTierPoints(tier);
      const progressToNextTier = calculateProgress(loyaltyRecord.totalEarned, tier);

      const dashboardData: LoyaltyDashboardData = {
        userId: loyaltyRecord.userId.toString(),
        totalEarned: loyaltyRecord.totalEarned,
        currentBalance: loyaltyRecord.currentBalance,
        pendingPoints: loyaltyRecord.pendingPoints,
        tier: loyaltyRecord.tier as 'Bronze' | 'Silver' | 'Gold' | 'Platinum',
        referralCode: loyaltyRecord.referralCode,
        referralCount: loyaltyRecord.referralCount,
        nextTierPoints,
        progressToNextTier,
      };

      res.json(dashboardData);
    } catch (error) {
      console.error('Error fetching loyalty dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch loyalty data' });
    }
  });

  // Get user loyalty transactions
  app.get('/api/loyalty/transactions', async (req, res) => {
    try {
      const userId = 1; // Mock authentication
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const type = req.query.type as string; // 'earned', 'redeemed', or undefined for all

      let query = db
        .select()
        .from(loyaltyTransactions)
        .where(eq(loyaltyTransactions.userId, userId))
        .orderBy(desc(loyaltyTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      if (type && (type === 'earned' || type === 'redeemed')) {
        query = db
          .select()
          .from(loyaltyTransactions)
          .where(and(
            eq(loyaltyTransactions.userId, userId),
            eq(loyaltyTransactions.type, type)
          ))
          .orderBy(desc(loyaltyTransactions.createdAt))
          .limit(limit)
          .offset(offset);
      }

      const transactions = await query;

      // If no transactions exist, create some mock data for demo
      if (transactions.length === 0) {
        const mockTransactions = [
          {
            userId,
            orderId: 'ORD-2025-001',
            type: 'earned',
            points: 15,
            description: 'Purchase at Local Coffee Roasters',
            status: 'completed'
          },
          {
            userId,
            type: 'earned',
            points: 50,
            description: 'Referral Bonus - Sarah M. first purchase',
            status: 'completed'
          },
          {
            userId,
            type: 'redeemed',
            points: -25,
            description: 'Redeemed for shipping discount',
            status: 'completed'
          },
          {
            userId,
            orderId: 'ORD-2025-002',
            type: 'earned',
            points: 35,
            description: 'Purchase at Downtown Bookstore (Pending)',
            status: 'pending'
          },
          {
            userId,
            type: 'earned',
            points: 5,
            description: 'Social Media Share Bonus',
            status: 'completed'
          }
        ];

        // Insert mock transactions
        for (const mockTx of mockTransactions) {
          await db.insert(loyaltyTransactions).values(mockTx);
        }

        // Fetch the newly created transactions
        const newTransactions = await db
          .select()
          .from(loyaltyTransactions)
          .where(eq(loyaltyTransactions.userId, userId))
          .orderBy(desc(loyaltyTransactions.createdAt))
          .limit(limit)
          .offset(offset);

        const formattedTransactions: LoyaltyTransactionResponse[] = newTransactions.map((tx, index) => {
          // Calculate running balance (mock calculation for demo)
          const baseBalance = 1875;
          const balance = baseBalance - (index * 10);

          return {
            id: tx.id.toString(),
            date: tx.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            description: tx.description,
            earned: tx.type === 'earned' ? tx.points : 0,
            redeemed: tx.type === 'redeemed' ? Math.abs(tx.points) : 0,
            balance,
            type: tx.type as 'earned' | 'redeemed',
            orderId: tx.orderId || undefined,
            status: tx.status as 'completed' | 'pending' | 'processing',
          };
        });

        return res.json(formattedTransactions);
      }

      // Format existing transactions
      const formattedTransactions: LoyaltyTransactionResponse[] = transactions.map((tx, index) => {
        const baseBalance = 1875;
        const balance = baseBalance - (index * 10);

        return {
          id: tx.id.toString(),
          date: tx.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          description: tx.description,
          earned: tx.type === 'earned' ? tx.points : 0,
          redeemed: tx.type === 'redeemed' ? Math.abs(tx.points) : 0,
          balance,
          type: tx.type as 'earned' | 'redeemed',
          orderId: tx.orderId || undefined,
          status: tx.status as 'completed' | 'pending' | 'processing',
        };
      });

      res.json(formattedTransactions);
    } catch (error) {
      console.error('Error fetching loyalty transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
  });

  // Award points for purchase
  app.post('/api/loyalty/award-points', async (req, res) => {
    try {
      const { userId, points, description, orderId, source } = req.body;

      // Create transaction record
      await db.insert(loyaltyTransactions).values({
        userId,
        orderId,
        type: 'earned',
        points,
        description,
        status: 'pending' // Will be updated to 'completed' when order is delivered
      });

      // Update user loyalty balance
      const [loyaltyRecord] = await db
        .select()
        .from(userLoyalty)
        .where(eq(userLoyalty.userId, userId));

      if (loyaltyRecord) {
        const newTotalEarned = loyaltyRecord.totalEarned + points;
        const newTier = calculateTier(newTotalEarned);
        
        await db
          .update(userLoyalty)
          .set({
            totalEarned: newTotalEarned,
            pendingPoints: loyaltyRecord.pendingPoints + points,
            tier: newTier,
            updatedAt: new Date(),
          })
          .where(eq(userLoyalty.userId, userId));
      }

      res.json({ success: true, pointsAwarded: points });
    } catch (error) {
      console.error('Error awarding loyalty points:', error);
      res.status(500).json({ error: 'Failed to award points' });
    }
  });

  // Redeem points
  app.post('/api/loyalty/redeem-points', async (req, res) => {
    try {
      const { userId, points, description } = req.body;

      // Check if user has enough points
      const [loyaltyRecord] = await db
        .select()
        .from(userLoyalty)
        .where(eq(userLoyalty.userId, userId));

      if (!loyaltyRecord || loyaltyRecord.currentBalance < points) {
        return res.status(400).json({ error: 'Insufficient points' });
      }

      // Create redemption transaction
      await db.insert(loyaltyTransactions).values({
        userId,
        type: 'redeemed',
        points: -points,
        description,
        status: 'completed'
      });

      // Update user balance
      await db
        .update(userLoyalty)
        .set({
          currentBalance: loyaltyRecord.currentBalance - points,
          updatedAt: new Date(),
        })
        .where(eq(userLoyalty.userId, userId));

      res.json({ success: true, pointsRedeemed: points });
    } catch (error) {
      console.error('Error redeeming loyalty points:', error);
      res.status(500).json({ error: 'Failed to redeem points' });
    }
  });

  // Confirm delivery and move pending points to available balance
  app.post('/api/loyalty/confirm-delivery', async (req, res) => {
    try {
      const { orderId } = req.body;

      // Find pending transactions for this order
      const pendingTransactions = await db
        .select()
        .from(loyaltyTransactions)
        .where(and(
          eq(loyaltyTransactions.orderId, orderId),
          eq(loyaltyTransactions.status, 'pending')
        ));

      for (const transaction of pendingTransactions) {
        // Update transaction status to completed
        await db
          .update(loyaltyTransactions)
          .set({ status: 'completed', updatedAt: new Date() })
          .where(eq(loyaltyTransactions.id, transaction.id));

        // Move points from pending to available balance
        const [loyaltyRecord] = await db
          .select()
          .from(userLoyalty)
          .where(eq(userLoyalty.userId, transaction.userId));

        if (loyaltyRecord) {
          await db
            .update(userLoyalty)
            .set({
              currentBalance: loyaltyRecord.currentBalance + transaction.points,
              pendingPoints: Math.max(0, loyaltyRecord.pendingPoints - transaction.points),
              updatedAt: new Date(),
            })
            .where(eq(userLoyalty.userId, transaction.userId));
        }
      }

      res.json({ success: true, message: 'Points transferred to available balance' });
    } catch (error) {
      console.error('Error confirming delivery:', error);
      res.status(500).json({ error: 'Failed to confirm delivery' });
    }
  });
}