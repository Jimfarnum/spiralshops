import express from 'express';
import { evaluatePromotionRequest, calculatePromotionImpact } from '../utils/promotionValuation';

const router = express.Router();

// Demo endpoint to test promotion valuation without database
router.post('/demo/evaluate', async (req, res) => {
  try {
    const sampleRequest = {
      desiredMultiplier: req.body.multiplier || 5,
      desiredStartsAt: new Date(req.body.startsAt || '2025-09-01'),
      desiredEndsAt: new Date(req.body.endsAt || '2025-09-15'),
      expectedGMV: req.body.expectedGMV || 50000,
      sponsorCoveragePct: req.body.sponsorCoveragePct || 25,
      targetCategories: req.body.categories || ['Electronics'],
      targetStoreIds: req.body.storeIds || [],
      targetMallIds: req.body.mallIds || []
    };

    const valuation = evaluatePromotionRequest(sampleRequest);
    const impact = calculatePromotionImpact(
      { multiplier: sampleRequest.desiredMultiplier },
      sampleRequest.expectedGMV
    );

    res.json({
      success: true,
      message: 'SPIRALS Promotion Valuation System Demo',
      request: sampleRequest,
      valuation,
      projectedImpact: impact,
      systemStatus: {
        aiEngine: 'Active',
        riskAssessment: 'Functional',
        costCalculation: 'Operational',
        recommendationEngine: 'Online'
      }
    });

  } catch (error) {
    console.error('Error in promotion demo:', error);
    res.status(500).json({
      success: false,
      error: 'Demo evaluation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demo analytics endpoint
router.get('/demo/analytics', async (req, res) => {
  try {
    const demoAnalytics = {
      totalRequests: 147,
      pendingRequests: 23,
      approvedRequests: 89,
      rejectedRequests: 35,
      averageScore: 67.8,
      activePromotions: 12,
      totalProjectedGMV: 2400000,
      averageMultiplier: 4.7,
      riskDistribution: {
        high: 8,
        medium: 43,
        low: 96
      },
      topPerformingCategories: [
        { category: 'Electronics', requests: 34, avgScore: 72.1 },
        { category: 'Fashion', requests: 28, avgScore: 65.8 },
        { category: 'Home & Garden', requests: 22, avgScore: 71.3 },
        { category: 'Sports', requests: 18, avgScore: 68.9 }
      ],
      recentActivity: [
        { date: '2025-08-25', type: 'approval', partner: 'Mall of America', multiplier: 5 },
        { date: '2025-08-24', type: 'request', partner: 'Best Buy', multiplier: 6 },
        { date: '2025-08-23', type: 'rejection', partner: 'Generic Store', reason: 'Low sponsor coverage' },
        { date: '2025-08-22', type: 'approval', partner: 'Target', multiplier: 4 }
      ]
    };

    res.json({
      success: true,
      message: 'SPIRALS Promotion Analytics Demo',
      analytics: demoAnalytics,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analytics demo:', error);
    res.status(500).json({
      success: false,
      error: 'Analytics demo failed'
    });
  }
});

// System status endpoint
router.get('/demo/status', async (req, res) => {
  try {
    res.json({
      success: true,
      status: 'SPIRALS Promotion Valuation System - OPERATIONAL',
      version: '1.0.0',
      features: {
        promotionValuation: {
          status: 'Active',
          description: 'AI-powered evaluation of promotion requests',
          capabilities: [
            'Business impact scoring (0-100)',
            'Risk assessment (low/medium/high)',
            'Platform cost estimation',
            'Duration and multiplier optimization',
            'Targeting efficiency analysis'
          ]
        },
        partnerRequests: {
          status: 'Ready',
          description: 'Partner promotion request submission',
          supportedTypes: ['mall', 'retailer', 'card_issuer', 'other']
        },
        adminApproval: {
          status: 'Ready',
          description: 'SPIRAL admin review and approval workflow',
          features: ['Request review', 'Valuation override', 'Promotion creation']
        },
        realTimeAnalytics: {
          status: 'Active',
          description: 'Live dashboard and reporting system'
        }
      },
      integrations: {
        spiralLoyalty: 'Connected',
        paymentProcessing: 'Connected',
        aiValuation: 'Active',
        riskAssessment: 'Operational'
      },
      lastHealthCheck: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in status demo:', error);
    res.status(500).json({
      success: false,
      error: 'Status check failed'
    });
  }
});

export default router;