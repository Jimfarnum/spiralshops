import type { Express } from "express";
import { eq, desc, and, sum, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  retailerLoyaltySettings, 
  retailerLoyaltyHistory, 
  mallPerkCampaigns, 
  userMallPerks, 
  stores, 
  malls, 
  orders 
} from "@shared/schema";

interface RetailerLoyaltyStats {
  storeId: number;
  storeName: string;
  currentBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  currentTier: string;
  nextTierThreshold: number;
  pointsToNextTier: number;
  pointsPerDollar: number;
  recentTransactions: Array<{
    id: number;
    pointsEarned: number;
    pointsRedeemed: number;
    transactionType: string;
    description: string;
    createdAt: string;
  }>;
}

interface MallPerkProgress {
  campaignId: number;
  mallId: number;
  mallName: string;
  title: string;
  description: string;
  perkType: string;
  bonusPoints: number;
  requiredStores: number;
  progress: number;
  storesVisited: string[];
  totalSpent: number;
  isCompleted: boolean;
  canClaim: boolean;
}

// Mock data for demonstration
const mockRetailerLoyaltyData: RetailerLoyaltyStats[] = [
  {
    storeId: 1,
    storeName: 'Local Coffee Roasters',
    currentBalance: 45,
    totalEarned: 127,
    totalRedeemed: 82,
    currentTier: 'silver',
    nextTierThreshold: 500,
    pointsToNextTier: 373,
    pointsPerDollar: 0.20, // 1 SPIRAL per $5
    recentTransactions: [
      {
        id: 1,
        pointsEarned: 15,
        pointsRedeemed: 0,
        transactionType: 'earned',
        description: 'Purchase: Dark Roast Coffee Beans & Ceramic Mug Set',
        createdAt: '2025-01-20T10:30:00Z'
      },
      {
        id: 2,
        pointsEarned: 0,
        pointsRedeemed: 25,
        transactionType: 'redeemed',
        description: 'Redeemed: 25 SPIRALs for $5 off purchase',
        createdAt: '2025-01-15T14:22:00Z'
      },
      {
        id: 3,
        pointsEarned: 12,
        pointsRedeemed: 0,
        transactionType: 'earned',
        description: 'Purchase: Premium Coffee Subscription',
        createdAt: '2025-01-10T09:15:00Z'
      }
    ]
  },
  {
    storeId: 2,
    storeName: 'Farmers Market Co-op',
    currentBalance: 28,
    totalEarned: 89,
    totalRedeemed: 61,
    currentTier: 'bronze',
    nextTierThreshold: 100,
    pointsToNextTier: 11,
    pointsPerDollar: 0.15, // 1 SPIRAL per $6.67
    recentTransactions: [
      {
        id: 4,
        pointsEarned: 8,
        pointsRedeemed: 0,
        transactionType: 'earned',
        description: 'Purchase: Organic Honey & Fresh Produce',
        createdAt: '2025-01-20T10:30:00Z'
      },
      {
        id: 5,
        pointsEarned: 2,
        pointsRedeemed: 0,
        transactionType: 'bonus',
        description: 'Mall Bonus: Shopping at 2+ stores in Skyway Mall',
        createdAt: '2025-01-20T10:35:00Z'
      }
    ]
  },
  {
    storeId: 3,
    storeName: 'Twin Cities Boutique',
    currentBalance: 67,
    totalEarned: 203,
    totalRedeemed: 136,
    currentTier: 'gold',
    nextTierThreshold: 1000,
    pointsToNextTier: 797,
    pointsPerDollar: 0.25, // 1 SPIRAL per $4
    recentTransactions: [
      {
        id: 6,
        pointsEarned: 22,
        pointsRedeemed: 0,
        transactionType: 'earned',
        description: 'Purchase: Winter Clothing Collection',
        createdAt: '2025-01-18T16:45:00Z'
      }
    ]
  }
];

const mockMallPerks: MallPerkProgress[] = [
  {
    campaignId: 1,
    mallId: 1,
    mallName: 'Skyway Mall',
    title: 'Mall Explorer Bonus',
    description: 'Shop at 3 different stores in one visit and earn bonus SPIRALs',
    perkType: 'bonus_points',
    bonusPoints: 25,
    requiredStores: 3,
    progress: 2,
    storesVisited: ['Local Coffee Roasters', 'Farmers Market Co-op'],
    totalSpent: 162.44,
    isCompleted: false,
    canClaim: false
  },
  {
    campaignId: 2,
    mallId: 1,
    mallName: 'Skyway Mall',
    title: 'Weekend Warrior',
    description: 'Spend $200+ at mall stores during weekend and get 15% bonus on all SPIRAL earnings',
    perkType: 'bonus_points',
    bonusPoints: 30,
    requiredStores: 2,
    progress: 3,
    storesVisited: ['Local Coffee Roasters', 'Farmers Market Co-op', 'Twin Cities Boutique'],
    totalSpent: 365.88,
    isCompleted: true,
    canClaim: true
  },
  {
    campaignId: 3,
    mallId: 2,
    mallName: 'Grand Avenue Shopping',
    title: 'Local Loyalty Multiplier',
    description: 'Visit 4 local businesses in one day for 2x SPIRAL multiplier',
    perkType: 'bonus_points',
    bonusPoints: 40,
    requiredStores: 4,
    progress: 1,
    storesVisited: ['Artisan Bakery'],
    totalSpent: 45.99,
    isCompleted: false,
    canClaim: false
  }
];

export function registerRetailerLoyaltyRoutes(app: Express) {
  // Get retailer loyalty overview for user
  app.get('/api/loyalty/retailers', async (req, res) => {
    try {
      // Mock authentication - replace with real auth
      const userId = 1;

      // In production, this would fetch real data from database
      res.json({
        success: true,
        retailers: mockRetailerLoyaltyData,
        totalBalance: mockRetailerLoyaltyData.reduce((sum, store) => sum + store.currentBalance, 0),
        totalEarned: mockRetailerLoyaltyData.reduce((sum, store) => sum + store.totalEarned, 0)
      });
    } catch (error) {
      console.error('Error fetching retailer loyalty data:', error);
      res.status(500).json({ error: 'Failed to fetch retailer loyalty data' });
    }
  });

  // Get detailed loyalty stats for specific retailer
  app.get('/api/loyalty/retailer/:storeId', async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const userId = 1; // Mock authentication

      const retailerData = mockRetailerLoyaltyData.find(r => r.storeId === storeId);
      if (!retailerData) {
        return res.status(404).json({ error: 'Retailer loyalty data not found' });
      }

      res.json({
        success: true,
        retailer: retailerData
      });
    } catch (error) {
      console.error('Error fetching retailer loyalty details:', error);
      res.status(500).json({ error: 'Failed to fetch retailer loyalty details' });
    }
  });

  // Get mall perk campaigns and user progress
  app.get('/api/loyalty/mall-perks', async (req, res) => {
    try {
      const userId = 1; // Mock authentication

      res.json({
        success: true,
        perks: mockMallPerks,
        activePerks: mockMallPerks.filter(p => !p.isCompleted),
        completedPerks: mockMallPerks.filter(p => p.isCompleted),
        claimableRewards: mockMallPerks.filter(p => p.canClaim).length
      });
    } catch (error) {
      console.error('Error fetching mall perks:', error);
      res.status(500).json({ error: 'Failed to fetch mall perks' });
    }
  });

  // Get mall-specific perk campaigns
  app.get('/api/loyalty/mall/:mallId/perks', async (req, res) => {
    try {
      const mallId = parseInt(req.params.mallId);
      const userId = 1; // Mock authentication

      const mallPerks = mockMallPerks.filter(p => p.mallId === mallId);

      res.json({
        success: true,
        mallId,
        perks: mallPerks,
        activePerks: mallPerks.filter(p => !p.isCompleted),
        availableRewards: mallPerks.filter(p => p.canClaim)
      });
    } catch (error) {
      console.error('Error fetching mall-specific perks:', error);
      res.status(500).json({ error: 'Failed to fetch mall perks' });
    }
  });

  // Calculate loyalty points for purchase (called during checkout)
  app.post('/api/loyalty/calculate', async (req, res) => {
    try {
      const { storeId, purchaseAmount, mallId } = req.body;
      const userId = 1; // Mock authentication

      // Get store loyalty settings (mock data)
      const storeSettings = mockRetailerLoyaltyData.find(r => r.storeId === storeId);
      if (!storeSettings) {
        return res.status(404).json({ error: 'Store loyalty settings not found' });
      }

      // Calculate base points
      const basePoints = Math.floor(purchaseAmount * storeSettings.pointsPerDollar);
      
      // Check for mall bonuses
      let mallBonus = 0;
      let bonusDescription = '';
      
      if (mallId) {
        const activeMallPerks = mockMallPerks.filter(p => p.mallId === mallId && !p.isCompleted);
        
        // Apply first eligible mall bonus
        for (const perk of activeMallPerks) {
          if (perk.progress >= perk.requiredStores - 1) { // About to complete
            mallBonus = perk.bonusPoints;
            bonusDescription = `Mall Bonus: ${perk.title}`;
            break;
          }
        }
      }

      const totalPoints = basePoints + mallBonus;

      res.json({
        success: true,
        calculation: {
          storeId,
          storeName: storeSettings.storeName,
          purchaseAmount,
          basePoints,
          mallBonus,
          totalPoints,
          pointsPerDollar: storeSettings.pointsPerDollar,
          bonusDescription
        }
      });
    } catch (error) {
      console.error('Error calculating loyalty points:', error);
      res.status(500).json({ error: 'Failed to calculate loyalty points' });
    }
  });

  // Award loyalty points after successful purchase
  app.post('/api/loyalty/award', async (req, res) => {
    try {
      const { orderId, storeId, purchaseAmount, pointsEarned, mallId } = req.body;
      const userId = 1; // Mock authentication

      // In production, this would create database records
      // For now, return success with transaction details
      
      res.json({
        success: true,
        transaction: {
          id: Date.now(), // Mock transaction ID
          userId,
          storeId,
          orderId,
          pointsEarned,
          transactionType: 'earned',
          description: `Purchase points earned from order #${orderId}`,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error awarding loyalty points:', error);
      res.status(500).json({ error: 'Failed to award loyalty points' });
    }
  });

  // Claim mall perk reward
  app.post('/api/loyalty/claim-perk/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const userId = 1; // Mock authentication

      const perk = mockMallPerks.find(p => p.campaignId === campaignId);
      if (!perk) {
        return res.status(404).json({ error: 'Perk campaign not found' });
      }

      if (!perk.canClaim) {
        return res.status(400).json({ error: 'Perk not eligible for claim' });
      }

      // Mark as claimed (in production, update database)
      perk.canClaim = false;

      res.json({
        success: true,
        reward: {
          campaignId,
          title: perk.title,
          bonusPoints: perk.bonusPoints,
          claimedAt: new Date().toISOString(),
          message: `Congratulations! You've earned ${perk.bonusPoints} bonus SPIRALs from ${perk.title}!`
        }
      });
    } catch (error) {
      console.error('Error claiming perk reward:', error);
      res.status(500).json({ error: 'Failed to claim perk reward' });
    }
  });

  // Get loyalty settings for store (for retailers)
  app.get('/api/loyalty/settings/:storeId', async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);

      // Mock loyalty settings
      const settings = {
        storeId,
        pointsPerDollar: 0.20,
        minimumPurchase: 0.00,
        bonusMultiplier: 1.00,
        tierThresholds: {
          bronze: 0,
          silver: 100,
          gold: 500,
          platinum: 1000
        },
        isActive: true
      };

      res.json({
        success: true,
        settings
      });
    } catch (error) {
      console.error('Error fetching loyalty settings:', error);
      res.status(500).json({ error: 'Failed to fetch loyalty settings' });
    }
  });

  // Update loyalty settings for store (for retailers)
  app.post('/api/loyalty/settings/:storeId', async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const { pointsPerDollar, minimumPurchase, bonusMultiplier, tierThresholds } = req.body;

      // In production, this would update the database
      
      res.json({
        success: true,
        message: 'Loyalty settings updated successfully',
        settings: {
          storeId,
          pointsPerDollar,
          minimumPurchase,
          bonusMultiplier,
          tierThresholds,
          updatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating loyalty settings:', error);
      res.status(500).json({ error: 'Failed to update loyalty settings' });
    }
  });
}