// Target-Style Loyalty Program Integration (Target Circle competitor)
import express from 'express';
import { storage } from '../storage';
import { getCache, setCache } from '../cache';

const router = express.Router();

// SPIRAL Circle Loyalty Program (Target Circle competitor)
router.get('/api/loyalty/circle', async (req, res) => {
  const startTime = Date.now();
  try {
    const userId = req.user?.id || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        duration: `${Date.now() - startTime}ms`
      });
    }

    const cacheKey = `loyalty_circle_${userId}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({
        ...cached,
        cached: true,
        duration: `${Date.now() - startTime}ms`
      });
    }

    const loyaltyData = {
      userId,
      program: 'SPIRAL Circle',
      tier: 'Gold', // Bronze, Silver, Gold, Platinum
      points: {
        available: 2847,
        pending: 156,
        lifetimeEarned: 15623,
        expiringNext30Days: 0
      },
      membership: {
        joinDate: '2024-03-15',
        tierSince: '2024-08-01',
        nextTierRequirement: 500, // points needed for Platinum
        benefits: [
          '5% back on every purchase',
          'Free returns and exchanges',
          'Early access to sales',
          'Birthday month special offers',
          'Exclusive member events'
        ]
      },
      personalizedOffers: [
        {
          id: 'offer_1',
          title: '25% off Coffee & Tea',
          description: 'Valid on all coffee and tea products',
          discount: 25,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          minimumPurchase: 20,
          categories: ['Food & Beverage'],
          type: 'percentage'
        },
        {
          id: 'offer_2',
          title: '$10 off Electronics',
          description: 'Save $10 on electronics purchases over $75',
          discount: 10,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          minimumPurchase: 75,
          categories: ['Electronics'],
          type: 'fixed_amount'
        },
        {
          id: 'offer_3',
          title: 'Free Shipping Weekend',
          description: 'Free shipping on all orders this weekend',
          discount: 0,
          validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          minimumPurchase: 0,
          categories: ['All'],
          type: 'free_shipping'
        }
      ],
      recentActivity: [
        {
          date: '2025-08-30',
          type: 'purchase',
          description: 'Earned 125 points from Electronics purchase',
          points: 125
        },
        {
          date: '2025-08-28',
          type: 'bonus',
          description: 'Double points promotion bonus',
          points: 67
        },
        {
          date: '2025-08-25',
          type: 'redemption',
          description: 'Redeemed 500 points for $25 credit',
          points: -500
        }
      ],
      achievements: [
        { name: 'Local Champion', description: 'Supported 10+ local businesses', earned: true },
        { name: 'Coffee Enthusiast', description: 'Purchased from 5+ coffee shops', earned: true },
        { name: 'Review Hero', description: 'Written 25+ helpful reviews', earned: false, progress: 18 }
      ]
    };

    // Cache loyalty data for 5 minutes
    setCache(cacheKey, loyaltyData, 300);

    res.json({
      success: true,
      loyalty: loyaltyData,
      cached: false,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Loyalty program error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load loyalty data',
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Redeem SPIRAL Points
router.post('/api/loyalty/redeem', async (req, res) => {
  const startTime = Date.now();
  try {
    const { userId, points, rewardType, orderId } = req.body;
    
    if (!userId || !points || !rewardType) {
      return res.status(400).json({
        success: false,
        error: 'User ID, points, and reward type are required',
        duration: `${Date.now() - startTime}ms`
      });
    }

    // Mock redemption processing
    const redemption = {
      redemptionId: `red_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      pointsRedeemed: points,
      rewardType,
      orderId: orderId || null,
      status: 'confirmed',
      value: points / 20, // 20 points = $1
      appliedAt: new Date().toISOString(),
      expiresAt: rewardType === 'credit' ? 
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : // 90 days for credit
        null,
      description: rewardType === 'credit' ? `$${(points / 20).toFixed(2)} account credit` :
                   rewardType === 'discount' ? `${points / 10}% off next purchase` :
                   'Free shipping on next order'
    };

    res.json({
      success: true,
      redemption,
      message: `Successfully redeemed ${points} SPIRAL points!`,
      newBalance: Math.max(0, 2847 - points), // Mock current balance minus redeemed
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Points redemption error:', error);
    res.status(500).json({
      success: false,
      error: 'Redemption failed',
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Loyalty Analytics Dashboard
router.get('/api/loyalty/analytics', async (req, res) => {
  const startTime = Date.now();
  try {
    const analytics = {
      program: 'SPIRAL Circle',
      totalMembers: 45728,
      activeMembers: 34156,
      engagement: {
        pointsEarnedToday: 125648,
        pointsRedeemedToday: 89234,
        averagePointsPerMember: 1847,
        redemptionRate: '68.4%'
      },
      tierDistribution: {
        bronze: { count: 18934, percentage: 41.4 },
        silver: { count: 15672, percentage: 34.3 },
        gold: { count: 8934, percentage: 19.5 },
        platinum: { count: 2188, percentage: 4.8 }
      },
      topRewards: [
        { type: 'account_credit', redemptions: 5234, totalValue: 26170 },
        { type: 'free_shipping', redemptions: 8945, totalValue: 62615 },
        { type: 'percentage_discount', redemptions: 3456, totalValue: 45789 }
      ],
      memberBehavior: {
        averageOrderValue: 67.89,
        repeatPurchaseRate: '72.3%',
        categoryPreferences: ['Electronics', 'Food & Beverage', 'Fashion'],
        preferredFulfillment: ['Store Pickup', 'Ship to Home', 'Curbside']
      }
    };

    res.json({
      success: true,
      analytics,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Loyalty analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load analytics',
      duration: `${Date.now() - startTime}ms`
    });
  }
});

export default router;