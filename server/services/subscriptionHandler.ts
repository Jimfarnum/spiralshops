import type Stripe from "stripe";
import { stripe } from "../config/stripe.js";
import { setRetailerPlan } from "./retailers.js";

type Plan = "free" | "silver" | "gold";

/** Map Stripe price ids to internal plan names (keep in env for flexibility) */
function planFromPriceId(priceId?: string): Plan {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRICE_SILVER) return "silver";
  if (priceId === process.env.STRIPE_PRICE_GOLD) return "gold";
  return "free";
}

export async function handleSubscriptionEvent(event: Stripe.Event) {
  if (!stripe) return;

  // Sub object present for created/updated/deleted
  const sub = event.data.object as Stripe.Subscription;

  const custId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!custId) return;

  const customer = await stripe.customers.retrieve(custId) as Stripe.Customer & { metadata?: Record<string, string> };
  const retailerId = customer?.metadata?.retailerId;
  if (!retailerId) return;

  let plan: Plan = "free";
  const item = sub.items?.data?.[0];
  const priceId = item?.price?.id;
  plan = planFromPriceId(priceId);

  // If customer.subscription.deleted → set free
  if (event.type === "customer.subscription.deleted") {
    plan = "free";
  }

  await setRetailerPlan(retailerId, plan, custId);
  console.log(`[subscriptionHandler] ${retailerId} -> ${plan} via ${event.type}`);
}