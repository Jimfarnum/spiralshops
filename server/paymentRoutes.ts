import { Router } from "express";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const router = Router();

// Create payment intent for one-time payments
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd", orderId, customerId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId || "",
        platform: "SPIRAL",
      },
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({ 
      error: "Failed to create payment intent",
      message: error.message 
    });
  }
});

// Create subscription for recurring payments
router.post("/create-subscription", async (req, res) => {
  try {
    const { customerId, priceId, orderId } = req.body;

    if (!customerId || !priceId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        orderId: orderId || "",
        platform: "SPIRAL",
      },
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Subscription creation error:", error);
    res.status(500).json({ 
      error: "Failed to create subscription",
      message: error.message 
    });
  }
});

// Create customer for Apple Pay / Google Pay
router.post("/create-customer", async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata: {
        platform: "SPIRAL",
      },
    });

    res.json({ customerId: customer.id });
  } catch (error: any) {
    console.error("Customer creation error:", error);
    res.status(500).json({ 
      error: "Failed to create customer",
      message: error.message 
    });
  }
});

// Get payment methods for customer
router.get("/payment-methods/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    res.json({ paymentMethods: paymentMethods.data });
  } catch (error: any) {
    console.error("Payment methods retrieval error:", error);
    res.status(500).json({ 
      error: "Failed to retrieve payment methods",
      message: error.message 
    });
  }
});

// Webhook endpoint for payment status updates
router.post("/webhook", async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  
  try {
    // In production, you should verify the webhook signature
    const event = req.body;

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Update order status, award SPIRAL points, etc.
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle failed payment
        break;
      case 'invoice.payment_succeeded':
        console.log('Subscription payment succeeded:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Refund payment
router.post("/refund", async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if specified
      reason: reason || 'requested_by_customer',
      metadata: {
        platform: "SPIRAL",
      },
    });

    res.json({ 
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount / 100
    });
  } catch (error: any) {
    console.error("Refund error:", error);
    res.status(500).json({ 
      error: "Failed to process refund",
      message: error.message 
    });
  }
});

export default router;