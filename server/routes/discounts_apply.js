import { z } from "zod";
import { getDiscountTier } from "../discounts.js";

// Simple, deterministic logistics discount table (matches our framework)
function logisticsDiscountPct(parcelsPerMonth) {
  if (parcelsPerMonth >= 100_000) return 0.35;
  if (parcelsPerMonth >= 10_000) return 0.20;
  return 0.10;
}

const bodySchema = z.object({
  subtotal: z.number().nonnegative(),           // items total before shipping/fees
  shippingBase: z.number().nonnegative(),       // pre-discount shipping quote
  annualVolumeUSD: z.number().nonnegative(),    // network-wide card volume
  parcelsPerMonth: z.number().nonnegative(),    // network-wide parcel volume
  paymentNetwork: z.string().optional(),        // 'Visa' | 'Discover' | 'Mastercard' | 'Amex' (informational)
  coupon: z.object({
    type: z.enum(["percent","amount"]),
    value: z.number().nonnegative()
  }).optional()
});

export function applyDiscountsHandler(req, res) {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { subtotal, shippingBase, annualVolumeUSD, parcelsPerMonth, paymentNetwork, coupon } = parsed.data;

  // 1) Card fee reduction via progressive tiers (bps = hundredths of a percent)
  const tier = getDiscountTier(annualVolumeUSD);           // { tier, discountBps }
  const cardBps = tier.discountBps || 0;
  const cardFeeSavings = subtotal * (cardBps / 10_000);    // purely savings, not baseline fee calc

  // 2) Logistics shipping discount via parcels/month progressive % off shippingBase
  const logPct = logisticsDiscountPct(parcelsPerMonth);    // e.g., 0.10, 0.20, 0.35
  const shippingAfterDiscount = Math.max(0, shippingBase * (1 - logPct));

  // 3) Optional coupon on subtotal
  let subtotalAfterCoupon = subtotal;
  if (coupon) {
    if (coupon.type === "percent") {
      subtotalAfterCoupon = Math.max(0, subtotal * (1 - coupon.value / 100));
    } else {
      subtotalAfterCoupon = Math.max(0, subtotal - coupon.value);
    }
  }

  // Total (not modeling baseline card fees; just apply savings to subtotal for clarity)
  const effectiveSubtotal = Math.max(0, subtotalAfterCoupon - cardFeeSavings);
  const total = effectiveSubtotal + shippingAfterDiscount;

  res.json({
    inputs: { subtotal, shippingBase, annualVolumeUSD, parcelsPerMonth, paymentNetwork, coupon },
    tiers: { cardDiscountBps: cardBps, logisticsDiscountPct: logPct },
    calculations: {
      cardFeeSavings: Number(cardFeeSavings.toFixed(2)),
      shippingAfterDiscount: Number(shippingAfterDiscount.toFixed(2)),
      subtotalAfterCoupon: Number(subtotalAfterCoupon.toFixed(2)),
      effectiveSubtotal: Number(effectiveSubtotal.toFixed(2))
    },
    total: Number(total.toFixed(2))
  });
}