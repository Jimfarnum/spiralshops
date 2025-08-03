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

router.get("/plan-status/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // If no Stripe key configured, return mock data
    if (!stripe) {
      const mockPlan = mockPlanData[customerId] || "Free";
      return res.json({ 
        plan: mockPlan, 
        mock: true,
        features: getPlanFeatures(mockPlan)
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
    console.error("❌ SPIRAL Plan Status Error:", error.message);
    res.status(500).json({ 
      plan: "Free", 
      error: error.message,
      features: getPlanFeatures("Free")
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

export default router;