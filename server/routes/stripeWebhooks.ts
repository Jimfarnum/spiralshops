import { Router } from "express";
import { stripe, WEBHOOK_SECRET } from "../config/stripe.js";

/**
 * IMPORTANT: This route MUST be mounted with express.raw({ type: "application/json" })
 * BEFORE any app-wide JSON body parsers. The raw Buffer is required for Stripe signature verification.
 */
const router = Router();

router.post("/", async (req, res) => {
  try {
    if (!stripe || !WEBHOOK_SECRET) return res.status(503).end();

    const sig = req.header("Stripe-Signature") || "";
    // With express.raw, req.body is a Buffer
    const rawBody = req.body as Buffer;

    const event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);

    switch (event.type) {
      case "checkout.session.completed": {
        // (We don't mutate plan here; subscription.updated will finalize the plan)
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // We delegate to a tiny handler to keep this route slim
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { handleSubscriptionEvent } = await import("../services/subscriptionHandler.js");
        await handleSubscriptionEvent(event);
        break;
      }
      default:
        // ignore others
        break;
    }

    return res.json({ received: true });
  } catch (e: any) {
    console.error("[webhook] error:", e?.message || e);
    return res.status(400).send(`Webhook Error: ${e?.message || "unknown"}`);
  }
});

export default router;