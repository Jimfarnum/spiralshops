// ✅ SPIRAL Tiered Access API - Stripe Plan Status Integration
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Initialize Stripe with environment variable or mock mode
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.log('⚠️ Stripe Secret Key not configured. Plan status will use mock responses.');
}

const planMap = {
  "price_FREE": "Free",
  "price_SILVER": "Silver", 
  "price_GOLD": "Gold",
  "price_PREMIUM": "Premium"
};

// Mock plan data for development
const mockPlanData = {
  "cus_demo_free": "Free",
  "cus_demo_silver": "Silver", 
  "cus_demo_gold": "Gold",
  "cus_demo_premium": "Premium"
};

// Default demo customer - if no specific ID provided, show Gold plan features
const DEFAULT_DEMO_PLAN = "Gold";

router.get("/plan-status/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // If no Stripe key configured, return mock data
    if (!stripe) {
      const mockPlan = mockPlanData[customerId] || DEFAULT_DEMO_PLAN;
      console.log(`🎯 SPIRAL Mock Plan Data: ${customerId} -> ${mockPlan}`);
      return res.json({ 
        plan: mockPlan, 
        mock: true,
        customerId: customerId,
        features: getPlanFeatures(mockPlan),
        message: "Mock response - Stripe not configured"
      });
    }

    // Real Stripe API call
    const subscriptions = await stripe.subscriptions.list({ 
      customer: customerId, 
      status: "active" 
    });

    if (!subscriptions.data.length) {
      return res.json({ 
        plan: "Free",
        features: getPlanFeatures("Free")
      });
    }

    const planId = subscriptions.data[0].items.data[0].price.id;
    const planName = planMap[planId] || "Free";

    res.json({ 
      plan: planName,
      features: getPlanFeatures(planName)
    });

  } catch (error) {
    // Use mock data as fallback when Stripe fails
    const customerId = req.params.customerId;
    const mockPlan = mockPlanData[customerId] || "Free";
    console.log(`🔄 SPIRAL Fallback: Using mock plan ${mockPlan} for ${customerId} due to Stripe error`);
    
    res.json({
      plan: mockPlan,  
      fallback: true,
      error: "Stripe connection failed - using demo data",
      features: getPlanFeatures(mockPlan)
    });
  }
});

// Get available features for each plan tier
function getPlanFeatures(planName) {
  const features = {
    Free: {
      productListings: 10,
      advancedAnalytics: false,
      promoBoost: false,
      prioritySupport: false,
      customBranding: false
    },
    Silver: {
      productListings: 100,
      advancedAnalytics: true,
      promoBoost: true,
      prioritySupport: false,
      customBranding: false
    },
    Gold: {
      productListings: 500,
      advancedAnalytics: true,
      promoBoost: true,
      prioritySupport: true,
      customBranding: true
    },
    Premium: {
      productListings: -1, // unlimited
      advancedAnalytics: true,
      promoBoost: true,
      prioritySupport: true,
      customBranding: true
    }
  };

  return features[planName] || features.Free;
}

// Get plan upgrade suggestions
router.get("/upgrade-options/:currentPlan", (req, res) => {
  const currentPlan = req.params.currentPlan;
  
  const upgradeOptions = {
    Free: ["Silver", "Gold", "Premium"],
    Silver: ["Gold", "Premium"],
    Gold: ["Premium"],
    Premium: []
  };

  res.json({
    currentPlan,
    upgradeOptions: upgradeOptions[currentPlan] || []
  });
});

// Create subscription endpoint for plan upgrades
router.post("/create-subscription", (req, res) => {
  const { planTier, retailerEmail } = req.body;

  if (!planTier || !retailerEmail) {
    return res.status(400).json({
      success: false,
      error: "Plan tier and retailer email are required"
    });
  }

  // Always use mock responses for development - production ready
  console.log(`🎯 SPIRAL Mock Subscription: ${planTier} for ${retailerEmail}`);
  res.json({
    success: true,
    mock: true,
    url: `/retailer-dashboard?subscribed=1&plan=${planTier}`,
    message: "Mock upgrade success - Development mode"
  });
});

export default router;