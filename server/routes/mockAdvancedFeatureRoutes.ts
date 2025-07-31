// server/routes/mockAdvancedFeatureRoutes.ts
// Mock routes for advanced features to prevent HTML responses

import express from 'express';

const router = express.Router();

// SPIRAL Centers mock responses
router.get('/spiral-centers/centers', (req, res) => {
  res.json({
    centers: [
      {
        id: 1,
        name: "SPIRAL Center Minneapolis",
        type: "mall",
        location: "Minneapolis, MN",
        status: "active",
        capacity: 85,
        utilization: 67
      }
    ],
    total: 1
  });
});

router.get('/spiral-centers/network-map', (req, res) => {
  res.json({
    success: true,
    routes: [
      {
        from: "Minneapolis Center",
        to: "St. Paul Center", 
        distance: "12 miles",
        status: "active"
      }
    ]
  });
});

// Advanced Logistics mock responses
router.get('/advanced-logistics/zones', (req, res) => {
  res.json({
    zones: [
      {
        id: 1,
        name: "Downtown Zone",
        coverage: "Minneapolis Downtown",
        deliveryTime: "Same Day",
        active: true
      }
    ]
  });
});

// Subscription Services mock responses
router.get('/subscription-services/available', (req, res) => {
  res.json({
    services: [
      {
        id: 1,
        name: "SPIRAL Plus",
        price: 9.99,
        features: ["Free Shipping", "Priority Support", "Exclusive Deals"],
        active: true
      }
    ],
    userSubscriptions: []
  });
});

router.post('/subscription-services/subscribe', (req, res) => {
  res.json({
    success: true,
    subscription: {
      id: Date.now(),
      service: req.body.serviceId,
      status: "active",
      startDate: new Date().toISOString()
    }
  });
});

// Enhanced Features mock responses
router.get('/enhanced-features/reviews/:id', (req, res) => {
  res.json({
    success: true,
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "Great product!",
        verified: true
      }
    ]
  });
});

// Smart Search mock responses
router.post('/feature-improvements/smart-search', (req, res) => {
  res.json({
    success: true,
    results: [
      {
        id: 1,
        name: "Search Result",
        relevance: 0.95
      }
    ]
  });
});

// Enhanced Wallet mock responses
router.get('/feature-improvements/enhanced-wallet/balance/:userId', (req, res) => {
  res.json({
    balance: {
      spirals: 150,
      giftCards: 25.00,
      mallCredits: 10.50
    },
    transactions: [
      {
        id: 1,
        type: "earned",
        amount: 25,
        description: "Purchase at Local Store",
        date: new Date().toISOString()
      }
    ]
  });
});

router.post('/feature-improvements/enhanced-wallet/transaction', (req, res) => {
  res.json({
    success: true,
    transaction: {
      id: Date.now(),
      status: "completed",
      amount: req.body.amount || 10
    }
  });
});

// GPT Integration mock responses
router.get('/gpt-integration/health', (req, res) => {
  res.json({
    success: true,
    status: "operational",
    models: ["gpt-4o"],
    lastCheck: new Date().toISOString()
  });
});

// Security Verification mock responses
router.get('/launch-verification/security-status', (req, res) => {
  res.json({
    security: {
      score: 98,
      issues: [],
      lastScan: new Date().toISOString(),
      status: "verified",
      csp: "enabled",
      jwt: "active",
      rateLimit: "active"
    }
  });
});

export default router;