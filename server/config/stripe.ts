import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY || "";
if (!secret) {
  console.warn("[stripe] STRIPE_SECRET_KEY is missing. Billing routes will be limited.");
}

// Use a current API version. If Stripe updates later, bump here centrally.
export const stripe = secret ? new Stripe(secret, { apiVersion: "2023-10-16" }) : (null as any);

// Expected env: STRIPE_PRICE_SILVER, STRIPE_PRICE_GOLD, STRIPE_WEBHOOK_SECRET
export const PRICES = {
  silver: process.env.STRIPE_PRICE_SILVER || "",
  gold: process.env.STRIPE_PRICE_GOLD || "",
};

export const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// SSRF Protection: Validate webhook secret configuration
if (WEBHOOK_SECRET && WEBHOOK_SECRET.length < 32) {
  console.error("[stripe] WEBHOOK_SECRET appears too short. Ensure proper webhook endpoint secret is configured.");
}

// Security validation for price IDs to prevent injection
export function validatePriceId(priceId: string): boolean {
  // Stripe price IDs follow pattern: price_xxxxxxxxxxxxxxxxxxxxx (starts with 'price_')
  return /^price_[a-zA-Z0-9]{24,}$/.test(priceId);
}