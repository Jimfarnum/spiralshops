import { Router } from "express";
import { PRICES, stripe } from "../config/stripe.js";
import { setStripeCustomer } from "../services/retailers.js";

const router = Router();

/**
 * Create Stripe Checkout for a subscription plan.
 * Expects JSON: { plan: "silver"|"gold", retailerId, email }
 * Returns: { url }
 */
router.post("/subscribe", async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: "Stripe not configured" });
    const { plan, retailerId, email } = req.body || {};
    if (!["silver","gold"].includes(plan)) return res.status(400).json({ error: "Invalid plan" });
    if (!retailerId || !email) return res.status(400).json({ error: "retailerId and email required" });

    const priceId = plan === "silver" ? PRICES.silver : PRICES.gold;
    if (!priceId) return res.status(500).json({ error: `Missing Stripe price for ${plan}` });

    // Create or reuse Stripe Customer (idempotent by email)
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0] ?? (await stripe.customers.create({ email, metadata: { retailerId } }));

    // Link customer to retailer
    await setStripeCustomer(retailerId, customer.id);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.PUBLIC_URL || "http://localhost:5173"}/plans?status=success`,
      cancel_url: `${process.env.PUBLIC_URL || "http://localhost:5173"}/plans?status=cancel`,
      metadata: { retailerId, plan },
      subscription_data: {
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
      },
    });

    return res.json({ url: session.url });
  } catch (e:any) {
    console.error("[billing subscribe] error", e);
    res.status(500).json({ error: "Subscribe failed", detail: e.message });
  }
});

/**
 * Create a Stripe Billing Portal session for retailer.
 * Expects JSON: { retailerId, email }
 * Returns { url }
 */
router.post("/portal", async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: "Stripe not configured" });
    const { retailerId, email } = req.body || {};
    if (!retailerId || !email) return res.status(400).json({ error: "retailerId and email required" });

    // Resolve/create customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0] ?? (await stripe.customers.create({ email, metadata: { retailerId } }));

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.PUBLIC_URL || "http://localhost:5173"}/plans`,
    });
    return res.json({ url: session.url });
  } catch (e:any) {
    console.error("[billing portal] error", e);
    res.status(500).json({ error: "Portal failed", detail: e.message });
  }
});

/**
 * Get available billing plans
 * GET /api/billing/plans
 */
router.get("/plans", (_req, res) => {
  res.json({
    ok: true,
    plans: [
      { id: "free", name: "Free", price: 0, features: ["Basic listing", "5 products"] },
      { id: "silver", name: "Silver", price: 29.99, features: ["Up to 100 products", "Analytics", "Priority support"] },
      { id: "gold", name: "Gold", price: 99.99, features: ["Unlimited products", "Advanced analytics", "AI insights", "Premium support"] }
    ]
  });
});

export default router;