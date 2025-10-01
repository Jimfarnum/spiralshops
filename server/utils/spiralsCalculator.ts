import { getActivePromotions } from "../services/promotionService.js";

export async function calculateSpiralsEarned(
  baseAmount: number,
  context: { pickup?: boolean; invite?: boolean }
): Promise<number> {
  let multiplier = 1;

  // Default multipliers
  if (context.pickup) multiplier *= 2;
  if (context.invite) multiplier *= 3;

  // Admin promotions
  const promos = await getActivePromotions();
  for (const promo of promos) {
    if (promo.type === "seasonal" && promo.active) {
      multiplier *= promo.multiplier;
    }
  }

  const earned = Math.floor(baseAmount * multiplier);
  return earned;
}