import express from 'express';
import Stripe from 'stripe';
const router = express.Router();

// Check for Stripe key and validate format - Initialize only if key is valid
let stripe = null;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const MOCK_MODE = !STRIPE_KEY || !STRIPE_KEY.startsWith('sk_') || STRIPE_KEY.length < 20;

if (!MOCK_MODE) {
  try {
    stripe = new Stripe(STRIPE_KEY, {
      apiVersion: "2025-07-30.basil",
    });
    console.log('✅ Stripe Connect initialized successfully');
  } catch (error) {
    console.error('❌ Stripe initialization failed:', error.message);
    console.log('🔄 Falling back to mock mode');
  }
} else {
  console.warn('⚠️ Stripe Secret Key not configured. Stripe Connect features will use mock responses.');
}

// 🏪 STRIPE CONNECT: Create Express Account for Retailers
router.post("/stripe/create-connect-account", async (req, res) => {
  try {
    const { retailerId, email, businessName, businessType = "individual" } = req.body;

    if (!email || !businessName) {
      return res.status(400).json({
        success: false,
        error: "Email and business name are required"
      });
    }

    // If Stripe is not available, return mock response
    if (MOCK_MODE || !stripe) {
      const mockAccountId = `acct_mock_${Date.now()}`;
      const YOUR_DOMAIN = process.env.NODE_ENV === 'production' 
        ? "https://spiralshops.com" 
        : `${req.protocol}://${req.get('host')}`;

      return res.json({
        success: true,
        stripeAccountId: mockAccountId,
        onboardingUrl: `${YOUR_DOMAIN}/retailer-stripe-setup?mock=true&account=${mockAccountId}`,
        message: "Mock Stripe Express account created (demo mode)",
        mock: true
      });
    }

    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email,
      business_type: businessType,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: businessName,
        product_description: "Retail sales through SPIRAL marketplace",
        mcc: "5999", // Miscellaneous retail stores
      },
      metadata: { 
        retailerId: retailerId?.toString() || "",
        platform: "SPIRAL",
        createdAt: new Date().toISOString()
      }
    });

    const YOUR_DOMAIN = process.env.NODE_ENV === 'production' 
      ? "https://spiralshops.com" 
      : `${req.protocol}://${req.get('host')}`;

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${YOUR_DOMAIN}/retailer-onboarding?step=stripe`,
      return_url: `${YOUR_DOMAIN}/retailer-dashboard?stripe_setup=complete`,
      type: "account_onboarding",
    });

    res.json({
      success: true,
      stripeAccountId: account.id,
      onboardingUrl: accountLink.url,
      message: "Stripe Express account created successfully"
    });

  } catch (error) {
    console.error("❌ Stripe Connect Account Creation Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 🔄 STRIPE CONNECT: Get Account Status
router.get("/stripe/account-status/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // If Stripe is not available or mock account, return mock status
    if (MOCK_MODE || !stripe || accountId.includes('mock')) {
      return res.json({
        success: true,
        account: {
          id: accountId,
          charges_enabled: true,
          payouts_enabled: true,
          details_submitted: true,
          requirements: {
            currently_due: [],
            eventually_due: [],
            past_due: [],
            pending_verification: []
          },
          business_profile: {
            name: "Demo Business",
            product_description: "Demo retail sales"
          },
          capabilities: {
            card_payments: "active",
            transfers: "active"
          }
        },
        mock: true
      });
    }
    
    const account = await stripe.accounts.retrieve(accountId);
    
    res.json({
      success: true,
      account: {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        requirements: account.requirements,
        business_profile: account.business_profile,
        capabilities: account.capabilities
      }
    });

  } catch (error) {
    console.error("❌ Stripe Account Status Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 💰 MARKETPLACE PAYMENT: Create payment intent with connected account
router.post("/create-marketplace-payment", async (req, res) => {
  try {
    const { 
      amount, 
      currency = "usd", 
      connectedAccountId, 
      applicationFeePercent = 3, // Default 3% platform fee
      metadata = {},
      customerId 
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid amount is required" 
      });
    }

    if (!connectedAccountId) {
      return res.status(400).json({ 
        success: false, 
        error: "Connected account ID is required for marketplace payments" 
      });
    }

    const applicationFeeAmount = Math.round(amount * 100 * (applicationFeePercent / 100));

    // If Stripe is not available, return mock response
    if (MOCK_MODE || !stripe) {
      const mockPaymentIntentId = `pi_mock_${Date.now()}`;
      return res.json({ 
        success: true,
        clientSecret: `${mockPaymentIntentId}_secret_mock`,
        paymentIntentId: mockPaymentIntentId,
        applicationFee: applicationFeeAmount / 100,
        retailerAmount: (amount * 100 - applicationFeeAmount) / 100,
        mock: true
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: connectedAccountId,
      },
      metadata: {
        ...metadata,
        platform: "SPIRAL",
        marketplace_payment: "true",
        connected_account: connectedAccountId,
        application_fee_percent: applicationFeePercent.toString(),
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ 
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      applicationFee: applicationFeeAmount / 100,
      retailerAmount: (amount * 100 - applicationFeeAmount) / 100
    });

  } catch (error) {
    console.error('Marketplace payment intent creation error:', error);
    res.status(500).json({ 
      success: false,
      error: "Error creating marketplace payment: " + error.message 
    });
  }
});

// 🔄 REFRESH ACCOUNT LINK: Create new account link for continued onboarding
router.post("/stripe/refresh-account-link", async (req, res) => {
  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        error: "Account ID is required"
      });
    }

    const YOUR_DOMAIN = process.env.NODE_ENV === 'production' 
      ? "https://spiralshops.com" 
      : `${req.protocol}://${req.get('host')}`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${YOUR_DOMAIN}/retailer-stripe-setup?refresh=true`,
      return_url: `${YOUR_DOMAIN}/retailer-dashboard?stripe_setup=complete`,
      type: "account_onboarding",
    });

    res.json({
      success: true,
      onboardingUrl: accountLink.url,
      message: "Account link refreshed successfully"
    });

  } catch (error) {
    console.error("❌ Stripe Account Link Refresh Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 📊 GET ACCOUNT BALANCE: Retrieve account balance and available funds
router.get("/stripe/account-balance/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    
    res.json({
      success: true,
      balance: {
        available: balance.available,
        pending: balance.pending,
        instant_available: balance.instant_available
      }
    });

  } catch (error) {
    console.error("❌ Stripe Account Balance Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 💸 CREATE PAYOUT: Manual payout to connected account
router.post("/stripe/create-payout", async (req, res) => {
  try {
    const { accountId, amount, currency = "usd" } = req.body;

    if (!accountId || !amount) {
      return res.status(400).json({
        success: false,
        error: "Account ID and amount are required"
      });
    }

    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        platform: "SPIRAL",
        manual_payout: "true",
        timestamp: new Date().toISOString()
      }
    }, {
      stripeAccount: accountId,
    });

    res.json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount / 100,
        currency: payout.currency,
        status: payout.status,
        arrival_date: payout.arrival_date
      }
    });

  } catch (error) {
    console.error("❌ Stripe Payout Creation Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;