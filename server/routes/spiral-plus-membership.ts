// SPIRAL+ Membership Program (Prime Competitor)
import express from 'express';
import { storage } from '../storage';

const router = express.Router();

// SPIRAL+ Membership Tiers (competing with Amazon Prime)
const membershipTiers = {
  free: {
    name: 'SPIRAL Free',
    price: 0,
    benefits: [
      'Basic product search',
      'Standard delivery (5-7 days)',
      'Email customer support',
      'Basic SPIRAL rewards (5 cents = 1 point)'
    ],
    spiralMultiplier: 1,
    freeShippingThreshold: 75
  },
  plus: {
    name: 'SPIRAL+',
    price: 79, // Annual
    monthlyPrice: 8.99,
    benefits: [
      'FREE 2-day shipping on all orders',
      'Priority customer support (live chat)',
      'Enhanced SPIRAL rewards (2x points)',
      'Early access to sales and new products',
      'Exclusive member-only deals',
      'Free returns and exchanges',
      'Price matching guarantee'
    ],
    spiralMultiplier: 2,
    freeShippingThreshold: 0
  },
  premium: {
    name: 'SPIRAL Premium',
    price: 149, // Annual
    monthlyPrice: 14.99,
    benefits: [
      'FREE same-day delivery in major cities',
      '24/7 premium support (phone + chat)',
      'Triple SPIRAL rewards (3x points)',
      'Personal shopping assistant',
      'Exclusive premium products access',
      'Free installation and setup services',
      'Concierge services for special requests',
      'Annual $25 SPIRAL credit'
    ],
    spiralMultiplier: 3,
    freeShippingThreshold: 0
  }
};

// Get user membership status
router.get('/api/membership/status', async (req, res) => {
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

    // Mock membership data (in real app, get from database)
    const membership = {
      userId,
      tier: 'plus', // free, plus, premium
      status: 'active',
      joinDate: '2024-08-15',
      renewalDate: '2025-08-15',
      benefits: membershipTiers.plus.benefits,
      spiralBalance: 2847,
      yearlySpend: 342.67,
      savingsThisYear: 89.23
    };

    res.json({
      success: true,
      membership,
      availableTiers: membershipTiers,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load membership status',
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Upgrade membership
router.post('/api/membership/upgrade', async (req, res) => {
  const startTime = Date.now();
  try {
    const { tier, paymentPlan = 'annual' } = req.body; // annual or monthly
    const userId = req.user?.id || req.body.userId;
    
    if (!userId || !tier) {
      return res.status(400).json({
        success: false,
        error: 'Missing membership tier or user ID',
        duration: `${Date.now() - startTime}ms`
      });
    }

    if (!membershipTiers[tier]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid membership tier',
        duration: `${Date.now() - startTime}ms`
      });
    }

    const selectedTier = membershipTiers[tier];
    const price = paymentPlan === 'monthly' ? selectedTier.monthlyPrice : selectedTier.price;

    const upgrade = {
      userId,
      previousTier: 'free',
      newTier: tier,
      paymentPlan,
      price,
      benefits: selectedTier.benefits,
      activationDate: new Date().toISOString(),
      nextBilling: new Date(Date.now() + (paymentPlan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
      welcomeBonus: tier === 'plus' ? 500 : tier === 'premium' ? 1000 : 0 // SPIRAL points
    };

    res.json({
      success: true,
      upgrade,
      message: `Welcome to ${selectedTier.name}! Your membership is now active.`,
      immediatePerks: [
        tier === 'plus' || tier === 'premium' ? 'Free 2-day shipping activated' : '',
        `${selectedTier.spiralMultiplier}x SPIRAL rewards now active`,
        `Welcome bonus: ${upgrade.welcomeBonus} SPIRAL points added`,
        'All membership benefits are immediately available'
      ].filter(Boolean),
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Membership upgrade error:', error);
    res.status(500).json({
      success: false,
      error: 'Upgrade failed. Please try again.',
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Get membership benefits summary
router.get('/api/membership/benefits', async (req, res) => {
  const startTime = Date.now();
  try {
    res.json({
      success: true,
      tiers: membershipTiers,
      comparison: {
        shippingComparison: {
          free: 'Standard shipping (5-7 days) - FREE over $75',
          plus: 'FREE 2-day shipping on all orders',
          premium: 'FREE same-day delivery + 2-day shipping'
        },
        supportComparison: {
          free: 'Email support (24-48 hour response)',
          plus: 'Live chat support (1-2 hour response)',
          premium: '24/7 phone + chat (immediate response)'
        },
        rewardsComparison: {
          free: '1x SPIRAL points (5 cents = 1 point)',
          plus: '2x SPIRAL points (2.5 cents = 1 point)',
          premium: '3x SPIRAL points (1.67 cents = 1 point)'
        }
      },
      competitiveAdvantage: {
        vs_amazon_prime: 'SPIRAL+ includes local business support and community rewards',
        vs_walmart_plus: 'Premium tier includes concierge services and personal shopping',
        vs_target_circle: 'Immediate rewards redemption vs delayed credit system'
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load benefits',
      duration: `${Date.now() - startTime}ms`
    });
  }
});

export default router;