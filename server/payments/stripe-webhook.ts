import Stripe from "stripe";
import type express from "express";
import { upsertShopper } from "../lib/shoppers.js";
import { createOrderOnce } from "../lib/orders.js";
import { awardSpirals } from "../lib/spirals.js";

/**
 * Feature-configurable earn formula:
 * Default: 1 SPIRAL per 5 cents => 20 SPIRALS per $1
 * Override via env SPIRALS_EARN_DIVISOR (cents per SPIRAL).
 */
const EARN_DIVISOR = Number(process.env.SPIRALS_EARN_DIVISOR || 5); // cents/SPIRAL

export async function mountStripeWebhooks(app: express.Express) {
  if (!process.env.STRIPE_SECRET_KEY) console.warn("[webhooks] STRIPE_SECRET_KEY not set");
  if (!process.env.STRIPE_WEBHOOK_SECRET) console.warn("[webhooks] STRIPE_WEBHOOK_SECRET not set");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-07-30.basil" });
  const RAW = (await import("express")).raw({ type: "application/json" });

  const handler: express.RequestHandler = async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"] as string;
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");

      switch (event.type) {
        case "payment_intent.succeeded": {
          const pi = event.data.object as Stripe.PaymentIntent;
          const amount = (pi.amount_received ?? pi.amount ?? 0) | 0; // cents
          const currency = (pi.currency || "usd").toLowerCase();
          const shopperId = (pi.metadata?.shopperId || pi.metadata?.shopper_id || "unknown");

          if (shopperId !== "unknown") {
            // Write order once (idempotent)
            const created = await createOrderOnce({
              type: "order", shopperId, amountReceived: amount, currency, paymentIntentId: String(pi.id)
            });
            if (created) {
              // Earn SPIRALS (floor for safety)
              const points = Math.floor(amount / EARN_DIVISOR);
              await awardSpirals(shopperId, points, "purchase", String(pi.id));
            }
          }
          break;
        }

        // Subscriptions / billing examples (kept for parity with your current handler)
        case "invoice.payment_succeeded": {
          // const inv = event.data.object as Stripe.Invoice;
          break;
        }
        case "customer.subscription.created": {
          // const sub = event.data.object as Stripe.Subscription;
          break;
        }

        // Optional: if you use Checkout Sessions and want the shopperId from session.metadata
        case "checkout.session.completed": {
          const sess = event.data.object as Stripe.Checkout.Session;
          const shopperId = (sess.metadata?.shopperId || sess.client_reference_id || "unknown");
          const amount = (sess.amount_total ?? 0) | 0;
          const currency = (sess.currency || "usd").toLowerCase();
          if (shopperId !== "unknown" && amount > 0) {
            const pi = sess.payment_intent as string | Stripe.PaymentIntent | null;
            const piId = typeof pi === "string" ? pi : (pi?.id ?? "session");
            const created = await createOrderOnce({
              type: "order", shopperId, amountReceived: amount, currency, paymentIntentId: String(piId)
            });
            if (created) {
              const points = Math.floor(amount / EARN_DIVISOR);
              await awardSpirals(shopperId, points, "purchase", String(piId));
            }
          }
          break;
        }

        default: break;
      }

      res.json({ ok: true, event: event.type });
    } catch (e:any) {
      console.error("stripe_webhook_error", e?.message || e);
      res.status(400).send(`Webhook Error: ${e?.message || "unknown"}`);
    }
  };

  // IMPORTANT: mount RAW webhook routes BEFORE any global express.json()
  app.post("/api/webhooks/stripe", RAW, handler);   // primary
  app.post("/api/pay/webhook", RAW, handler);       // alias (optional)
}