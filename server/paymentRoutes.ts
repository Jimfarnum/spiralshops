import type { Express } from "express";
import Stripe from "stripe";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export function registerPaymentRoutes(app: Express) {
  // 🏪 STRIPE CONNECT: Create Express Account for Retailers
  app.post("/api/stripe/create-connect-account", async (req, res) => {
    try {
      const { retailerId, email, businessName, businessType = "individual" } = req.body;

      if (!email || !businessName) {
        return res.status(400).json({
          success: false,
          error: "Email and business name are required"
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

    } catch (error: any) {
      console.error("❌ Stripe Connect Account Creation Error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // 🔄 STRIPE CONNECT: Get Account Status
  app.get("/api/stripe/account-status/:accountId", async (req, res) => {
    try {
      const { accountId } = req.params;
      
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

    } catch (error: any) {
      console.error("❌ Stripe Account Status Error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // 💰 MARKETPLACE PAYMENT: Create payment intent with connected account
  app.post("/api/create-marketplace-payment", async (req, res) => {
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
      }, {
        stripeAccount: connectedAccountId, // Process on behalf of connected account
      });

      res.json({ 
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        applicationFee: applicationFeeAmount / 100,
        retailerAmount: (amount * 100 - applicationFeeAmount) / 100
      });

    } catch (error: any) {
      console.error('Marketplace payment intent creation error:', error);
      res.status(500).json({ 
        success: false,
        error: "Error creating marketplace payment: " + error.message 
      });
    }
  });

  // Create payment intent for one-time payments (existing functionality enhanced)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd", metadata = {}, connectedAccountId, applicationFeePercent } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Valid amount is required" 
        });
      }

      const paymentIntentData: any = {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          ...metadata,
          platform: "SPIRAL",
          timestamp: new Date().toISOString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      // If this is a marketplace payment to a connected retailer
      if (connectedAccountId && applicationFeePercent) {
        const applicationFeeAmount = Math.round(amount * 100 * (applicationFeePercent / 100));
        paymentIntentData.application_fee_amount = applicationFeeAmount;
        paymentIntentData.transfer_data = {
          destination: connectedAccountId,
        };
        paymentIntentData.metadata.marketplace_payment = "true";
        paymentIntentData.metadata.connected_account = connectedAccountId;
      }

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

      res.json({ 
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ 
        success: false,
        error: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Process completed payment and create order
  app.post("/api/process-payment", async (req, res) => {
    try {
      const { paymentIntentId, orderData, spiralPoints = 0 } = req.body;

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          error: "Payment not completed"
        });
      }

      // Create order record
      const order = {
        id: Date.now(),
        paymentIntentId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'completed',
        items: orderData.items || [],
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        spiralPointsEarned: Math.floor((paymentIntent.amount / 100) * 0.05), // 5% back
        spiralPointsUsed: spiralPoints,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Award SPIRAL points for purchase (auth check would be added when user system is integrated)
      const pointsToAward = order.spiralPointsEarned;
      console.log(`Awarding ${pointsToAward} SPIRAL points for order ${order.id}`);

      res.json({
        success: true,
        order,
        message: "Payment processed successfully"
      });

    } catch (error: any) {
      console.error('Payment processing error:', error);
      res.status(500).json({
        success: false,
        error: "Error processing payment: " + error.message
      });
    }
  });

  // Create subscription for recurring payments
  // DISABLED - Using new tiered access system instead
  /*
  app.post("/api/create-subscription", async (req, res) => {
    try {
      // Authentication check would be added when user system is integrated
      const { priceId, email, name } = req.body;

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          platform: "SPIRAL"
        }
      });
      const customerId = customer.id;

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      res.json({
        success: true,
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });

    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(500).json({
        success: false,
        error: "Error creating subscription: " + error.message
      });
    }
  });
  */

  // Handle Stripe webhooks
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET || '');
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          break;
        
        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          console.log('Invoice payment succeeded:', invoice.id);
          break;
        
        case 'customer.subscription.created':
          const subscription = event.data.object;
          console.log('Subscription created:', subscription.id);
          break;
        
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });

    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        error: "Webhook processing error"
      });
    }
  });

  // Get payment methods for a customer
  app.get("/api/payment-methods", async (req, res) => {
    try {
      // Authentication and customer lookup would be added when user system is integrated
      res.json({
        success: true,
        paymentMethods: []
      });
    } catch (error: any) {
      console.error('Payment methods error:', error);
      res.status(500).json({
        success: false,
        error: "Error retrieving payment methods"
      });
    }
  });

  // Create setup intent for saving payment methods
  app.post("/api/create-setup-intent", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          platform: "SPIRAL"
        }
      });

      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
      });

      res.json({
        success: true,
        clientSecret: setupIntent.client_secret
      });

    } catch (error: any) {
      console.error('Setup intent error:', error);
      res.status(500).json({
        success: false,
        error: "Error creating setup intent"
      });
    }
  });

  console.log('✅ Stripe payment routes registered successfully');
}