import express from "express";
import Stripe from "stripe";
import { getCloudant } from "../lib/cloudant.js";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { 
  apiVersion: "2023-10-16" 
});

// Cloudant connection with fallback
const cloudant = getCloudant();
let db: any = null;

if (cloudant && cloudant.use) {
  try {
    db = cloudant.use("spiral_platform");
  } catch (err) {
    console.warn("[Stripe Onboarding] Cloudant database not available, using fallback storage");
  }
}

// Create Stripe Connect Account Link (for onboarding)
router.post("/onboard/:retailerId", async (req, res) => {
  try {
    const { retailerId } = req.params;
    const { email, businessName, businessType } = req.body;

    // Development mode fallback when Stripe API is not accessible
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const baseUrl = isDevelopment 
      ? 'http://localhost:5000'
      : process.env.APP_URL || 'https://spiralshops.com';

    if (isDevelopment) {
      // Development simulation mode
      const simulatedAccountId = `acct_dev_${retailerId}_${Date.now()}`;
      
      // Save simulated account to retailer profile
      const retailerUpdate = {
        id: retailerId,
        stripeAccountId: simulatedAccountId,
        stripeStatus: "pending",
        updatedAt: new Date().toISOString()
      };

      // Save to database or fallback storage
      if (db) {
        try {
          await db.insert(retailerUpdate, retailerId);
        } catch (err) {
          console.warn("[Stripe Onboarding] Database save failed, using fallback");
          retailerDataFallback[retailerId] = retailerUpdate;
        }
      } else {
        retailerDataFallback[retailerId] = retailerUpdate;
      }

      console.log(`[Stripe Onboarding] Development mode - simulated account for retailer ${retailerId}: ${simulatedAccountId}`);

      // Return simulated development onboarding URL
      res.json({ 
        ok: true, 
        url: `${baseUrl}/api/stripe/dev-complete/${retailerId}?mode=simulation`,
        accountId: simulatedAccountId,
        message: "Development mode: Stripe Connect simulation ready",
        development: true
      });
      
    } else {
      // Production mode - actual Stripe API
      const account = await stripe.accounts.create({
        type: "express",
        business_type: "company",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        business_profile: {
          name: businessName || "SPIRAL Retailer",
          product_description: "Retail products and services",
          support_email: email
        },
        metadata: { 
          retailerId,
          platform: "SPIRAL",
          revenue_share: "5%"
        }
      });

      // Save account ID to retailer profile
      const retailerUpdate = {
        id: retailerId,
        stripeAccountId: account.id,
        stripeStatus: "pending",
        updatedAt: new Date().toISOString()
      };

      // Save to database or fallback storage
      if (db) {
        try {
          await db.insert(retailerUpdate, retailerId);
        } catch (err) {
          console.warn("[Stripe Onboarding] Database save failed, using fallback");
        }
      }

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${baseUrl}/retailer-onboarding-new?retry=true&step=stripe`,
        return_url: `${baseUrl}/retailer-onboarding-new?success=true&step=complete`,
        type: "account_onboarding"
      });

      console.log(`[Stripe Onboarding] Created account for retailer ${retailerId}: ${account.id}`);

      res.json({ 
        ok: true, 
        url: accountLink.url,
        accountId: account.id,
        message: "Stripe Connect onboarding link generated" 
      });
    }

  } catch (err: any) {
    console.error("[Stripe Onboarding] Error:", err.message);
    res.status(500).json({ 
      ok: false, 
      error: err.message,
      code: err.code || 'STRIPE_ERROR'
    });
  }
});

// In-memory fallback for retailer data (development mode)
let retailerDataFallback: Record<string, any> = {};

// Check Stripe account status
router.get("/status/:retailerId", async (req, res) => {
  try {
    const { retailerId } = req.params;
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Try to get retailer from database first
    let retailer = null;
    if (db) {
      try {
        retailer = await db.get(retailerId);
      } catch (err) {
        console.warn("[Stripe Status] Database read failed, checking fallback");
      }
    }

    // Check fallback storage if database failed
    if (!retailer && retailerDataFallback[retailerId]) {
      retailer = retailerDataFallback[retailerId];
    }

    if (!retailer || !retailer.stripeAccountId) {
      return res.json({ 
        ok: false, 
        status: "not_connected",
        message: "Stripe account not found" 
      });
    }

    // Development mode - simulate status based on account ID pattern
    if (isDevelopment && retailer.stripeAccountId?.includes('acct_dev_')) {
      const isCompleted = retailer.stripeAccountId.includes('_completed');
      const status = isCompleted ? "active" : "pending";
      const isActive = isCompleted;

      console.log(`[Stripe Status] Development mode - Retailer ${retailerId} status: ${status}`);

      res.json({ 
        ok: true, 
        status,
        verified: isActive,
        accountId: retailer.stripeAccountId,
        development: true,
        message: isActive ? "Stripe Connect setup complete (simulated)" : "Stripe Connect setup pending (simulated)"
      });
      
    } else {
      // Production mode - actual Stripe API check
      const account = await stripe.accounts.retrieve(retailer.stripeAccountId);
      const isActive = account.payouts_enabled && account.charges_enabled;
      const status = isActive ? "active" : "pending";

      // Update retailer status in database
      if (db) {
        try {
          const updatedRetailer = { 
            ...retailer, 
            stripeStatus: status,
            stripeVerified: isActive,
            updatedAt: new Date().toISOString()
          };
          await db.insert(updatedRetailer, retailerId);
        } catch (err) {
          console.warn("[Stripe Status] Database update failed");
        }
      }

      console.log(`[Stripe Status] Retailer ${retailerId} status: ${status}`);

      res.json({ 
        ok: true, 
        status,
        verified: isActive,
        accountId: account.id,
        details: {
          payouts_enabled: account.payouts_enabled,
          charges_enabled: account.charges_enabled,
          details_submitted: account.details_submitted
        }
      });
    }

  } catch (err: any) {
    console.error("[Stripe Status] Error:", err.message);
    res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

// Verify Stripe webhook (for production use)
router.post("/webhook", express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(400).send('Webhook secret not configured');
    }

    const event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);

    // Handle account update events
    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account;
      const retailerId = account.metadata?.retailerId;

      if (retailerId && db) {
        try {
          const retailer = await db.get(retailerId);
          const isActive = account.payouts_enabled && account.charges_enabled;
          
          const updatedRetailer = {
            ...retailer,
            stripeStatus: isActive ? "active" : "pending",
            stripeVerified: isActive,
            updatedAt: new Date().toISOString()
          };

          await db.insert(updatedRetailer, retailerId);
          console.log(`[Stripe Webhook] Updated retailer ${retailerId} status: ${isActive ? 'active' : 'pending'}`);
        } catch (err) {
          console.error("[Stripe Webhook] Database update failed:", err);
        }
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("[Stripe Webhook] Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Development mode Stripe completion simulator
router.get("/dev-complete/:retailerId", async (req, res) => {
  try {
    const { retailerId } = req.params;
    const mode = req.query.mode;
    
    if (mode === 'simulation') {
      // Simulate successful Stripe Connect completion
      const simulatedAccountId = `acct_dev_${retailerId}_completed`;
      
      const retailerUpdate = {
        id: retailerId,
        stripeAccountId: simulatedAccountId,
        stripeStatus: "active", 
        stripeVerified: true,
        updatedAt: new Date().toISOString()
      };

      // Save to database or fallback storage
      if (db) {
        try {
          await db.insert(retailerUpdate, retailerId);
        } catch (err) {
          console.warn("[Stripe Dev Complete] Database save failed, using fallback");
          retailerDataFallback[retailerId] = retailerUpdate;
        }
      } else {
        retailerDataFallback[retailerId] = retailerUpdate;
      }

      console.log(`[Stripe Dev Complete] Simulated successful completion for retailer ${retailerId}`);
      
      // Redirect to success page with completion confirmation
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.APP_URL || 'https://spiralshops.com'
        : 'http://localhost:5000';
        
      res.redirect(`${baseUrl}/retailer-onboarding-new?success=true&step=complete&dev=true`);
    } else {
      res.status(400).json({ error: "Invalid simulation mode" });
    }
  } catch (err: any) {
    console.error("[Stripe Dev Complete] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Simulate Stripe webhook for development testing
router.post("/webhook/dev-simulate", async (req, res) => {
  try {
    const { retailerId, accountId, status } = req.body;
    
    const retailerUpdate = {
      id: retailerId,
      stripeAccountId: accountId,
      stripeStatus: status || "active",
      stripeVerified: status === "active",
      updatedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await db.insert(retailerUpdate, retailerId);
      } catch (err) {
        console.warn("[Stripe Webhook Sim] Database save failed");
      }
    }

    console.log(`[Stripe Webhook Sim] Updated retailer ${retailerId} status to ${status}`);
    res.json({ ok: true, message: "Webhook simulation completed" });
    
  } catch (err: any) {
    console.error("[Stripe Webhook Sim] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;