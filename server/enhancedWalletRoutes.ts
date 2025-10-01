import type { Express } from "express";
import { z } from "zod";

// Enhanced SPIRAL Wallet with gift card balance and comprehensive features
export function registerEnhancedWalletRoutes(app: Express) {
  // Get comprehensive wallet information
  app.get("/api/wallet/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock comprehensive wallet data
      const walletData = {
        userId,
        spiralBalance: 1250,
        giftCardBalance: 75.50,
        totalEarned: 3420,
        totalRedeemed: 2170,
        pendingRewards: 45,
        loyaltyTier: "Gold",
        nextTierRequirement: 500,
        recentTransactions: [
          {
            id: "txn_001",
            type: "earn",
            amount: 50,
            source: "purchase",
            description: "Shopping at Local Coffee Shop",
            date: new Date().toISOString(),
            storeName: "Local Coffee Shop"
          },
          {
            id: "txn_002",
            type: "redeem",
            amount: -25,
            source: "gift_card",
            description: "Gift card purchase",
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            storeName: "SPIRAL Store"
          }
        ],
        giftCards: [
          {
            id: "gc_001",
            balance: 50.00,
            originalAmount: 50.00,
            storeName: "Target Store",
            expiresAt: "2025-12-31",
            code: "TARG-5890-XKLS"
          },
          {
            id: "gc_002", 
            balance: 25.50,
            originalAmount: 100.00,
            storeName: "All Stores",
            expiresAt: "2026-06-30",
            code: "SPRL-9834-MJHT"
          }
        ],
        benefits: {
          freeShipping: true,
          earlyAccess: true,
          bonusMultiplier: 1.5,
          birthdayBonus: 100
        }
      };

      res.json(walletData);
      
    } catch (error) {
      console.error("Wallet retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve wallet information" });
    }
  });

  // Add funds to wallet (gift card redemption)
  app.post("/api/wallet/add-gift-card", async (req, res) => {
    try {
      const { userId, giftCardCode, amount } = req.body;
      
      if (!userId || !giftCardCode || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Mock gift card validation and addition
      const result = {
        success: true,
        message: "Gift card added successfully",
        newBalance: amount,
        transaction: {
          id: `txn_${Date.now()}`,
          type: "gift_card_add",
          amount: amount,
          source: "gift_card_redemption",
          giftCardCode,
          timestamp: new Date().toISOString()
        }
      };

      res.json(result);
      
    } catch (error) {
      console.error("Gift card addition error:", error);
      res.status(500).json({ error: "Failed to add gift card" });
    }
  });

  // Purchase with wallet funds
  app.post("/api/wallet/purchase", async (req, res) => {
    try {
      const { userId, amount, spiralAmount = 0, giftCardAmount = 0, description } = req.body;
      
      if (!userId || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Mock wallet purchase processing
      const purchaseResult = {
        success: true,
        transactionId: `purchase_${Date.now()}`,
        totalAmount: amount,
        spiralUsed: spiralAmount,
        giftCardUsed: giftCardAmount,
        spiralsEarned: Math.floor(amount * 0.05), // 5% back in SPIRALs
        remainingBalance: {
          spiral: 1250 - spiralAmount + Math.floor(amount * 0.05),
          giftCard: 75.50 - giftCardAmount
        },
        transaction: {
          id: `txn_${Date.now()}`,
          type: "purchase",
          amount: -amount,
          description,
          timestamp: new Date().toISOString(),
          paymentMethods: [
            spiralAmount > 0 && { type: "spiral", amount: spiralAmount },
            giftCardAmount > 0 && { type: "gift_card", amount: giftCardAmount }
          ].filter(Boolean)
        }
      };

      res.json(purchaseResult);
      
    } catch (error) {
      console.error("Wallet purchase error:", error);
      res.status(500).json({ error: "Purchase failed" });
    }
  });

  // Transfer SPIRALs to another user
  app.post("/api/wallet/transfer", async (req, res) => {
    try {
      const { fromUserId, toUserId, amount, message } = req.body;
      
      if (!fromUserId || !toUserId || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Mock SPIRAL transfer
      const transferResult = {
        success: true,
        transferId: `transfer_${Date.now()}`,
        fromUser: fromUserId,
        toUser: toUserId,
        amount,
        message,
        fee: Math.ceil(amount * 0.02), // 2% transfer fee
        timestamp: new Date().toISOString(),
        confirmationCode: `SPRL-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };

      res.json(transferResult);
      
    } catch (error) {
      console.error("SPIRAL transfer error:", error);
      res.status(500).json({ error: "Transfer failed" });
    }
  });

  // Get wallet transaction history with filtering
  app.get("/api/wallet/:userId/transactions", async (req, res) => {
    try {
      const { userId } = req.params;
      const { type, startDate, endDate, limit = 20 } = req.query;
      
      // Mock transaction history with filtering
      const allTransactions = [
        {
          id: "txn_001",
          type: "earn",
          amount: 50,
          source: "purchase",
          description: "Shopping at Local Coffee Shop",
          date: new Date().toISOString(),
          storeName: "Local Coffee Shop",
          category: "Food & Beverage"
        },
        {
          id: "txn_002",
          type: "redeem",
          amount: -25,
          source: "gift_card",
          description: "Gift card purchase",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          storeName: "SPIRAL Store",
          category: "Gift Cards"
        },
        {
          id: "txn_003",
          type: "earn",
          amount: 75,
          source: "referral",
          description: "Friend signup bonus",
          date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          category: "Referrals"
        },
        {
          id: "txn_004",
          type: "earn",
          amount: 15,
          source: "social_share",
          description: "Shared store on social media",
          date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          storeName: "Best Buy Electronics",
          category: "Social"
        }
      ];

      // Apply filters
      let filteredTransactions = allTransactions;
      
      if (type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === type);
      }
      
      if (startDate) {
        filteredTransactions = filteredTransactions.filter(t => 
          new Date(t.date) >= new Date(startDate as string)
        );
      }
      
      if (endDate) {
        filteredTransactions = filteredTransactions.filter(t => 
          new Date(t.date) <= new Date(endDate as string)
        );
      }

      res.json({
        transactions: filteredTransactions.slice(0, parseInt(limit as string)),
        totalCount: filteredTransactions.length,
        summary: {
          totalEarned: filteredTransactions
            .filter(t => t.type === 'earn')
            .reduce((sum, t) => sum + t.amount, 0),
          totalRedeemed: Math.abs(filteredTransactions
            .filter(t => t.type === 'redeem')
            .reduce((sum, t) => sum + t.amount, 0))
        }
      });
      
    } catch (error) {
      console.error("Transaction history error:", error);
      res.status(500).json({ error: "Failed to retrieve transaction history" });
    }
  });

  // Get loyalty tier information and benefits
  app.get("/api/wallet/:userId/loyalty-tier", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const loyaltyInfo = {
        currentTier: "Gold",
        currentPoints: 1250,
        tiers: [
          {
            name: "Bronze",
            requiredPoints: 0,
            benefits: ["5% SPIRAL earning", "Standard support"],
            color: "#CD7F32"
          },
          {
            name: "Silver", 
            requiredPoints: 500,
            benefits: ["7% SPIRAL earning", "Priority support", "Free shipping on $50+"],
            color: "#C0C0C0"
          },
          {
            name: "Gold",
            requiredPoints: 1000,
            benefits: ["10% SPIRAL earning", "Premium support", "Free shipping", "Early sale access"],
            color: "#FFD700"
          },
          {
            name: "Platinum",
            requiredPoints: 2500,
            benefits: ["15% SPIRAL earning", "VIP support", "Free shipping", "Early access", "Birthday bonuses"],
            color: "#E5E4E2"
          }
        ],
        nextTier: {
          name: "Platinum",
          pointsNeeded: 1250,
          progressPercentage: 50
        },
        tierBenefits: {
          earningMultiplier: 1.5,
          freeShipping: true,
          prioritySupport: true,
          earlyAccess: true
        }
      };

      res.json(loyaltyInfo);
      
    } catch (error) {
      console.error("Loyalty tier error:", error);
      res.status(500).json({ error: "Failed to retrieve loyalty information" });
    }
  });
}