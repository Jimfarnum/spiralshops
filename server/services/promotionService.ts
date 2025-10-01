import { getSeasonalPromotion } from './spiralsService.js';
import { cfind } from '../utils/cloudantCore.js';

export interface Promotion {
  id?: string;
  type: string;
  name?: string;
  multiplier: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Get all currently active promotions from multiple sources
 * @returns Promise<Promotion[]> - Array of active promotions
 */
export async function getActivePromotions(): Promise<Promotion[]> {
  const activePromotions: Promotion[] = [];

  try {
    // Check seasonal promotion first (in-memory)
    const seasonal = getSeasonalPromotion();
    if (seasonal && seasonal.active) {
      activePromotions.push({
        id: 'seasonal-current',
        type: seasonal.type,
        name: 'Seasonal Promotion',
        multiplier: seasonal.multiplier,
        active: seasonal.active
      });
    }

    // Get promotions from database
    const res = await cfind({
      selector: { type: 'promotion', active: true },
      fields: ['_id', 'type', 'name', 'multiplier', 'startsAt', 'endsAt', 'active'],
      limit: 100
    }).catch(() => ({ docs: [] }));

    const dbPromos = (res as any).docs || [];
    const now = new Date();

    // Filter and add database promotions that are currently active
    const currentlyActiveDbPromos = dbPromos.filter((promo: any) => {
      if (!promo.startsAt || !promo.endsAt) return promo.active;
      
      const startsAt = new Date(promo.startsAt);
      const endsAt = new Date(promo.endsAt);
      return promo.active && now >= startsAt && now <= endsAt;
    });

    // Convert to our interface format
    for (const promo of currentlyActiveDbPromos) {
      activePromotions.push({
        id: promo._id,
        type: promo.type || 'unknown',
        name: promo.name || 'Unnamed Promotion',
        multiplier: Number(promo.multiplier) || 1,
        active: promo.active,
        startDate: promo.startsAt,
        endDate: promo.endsAt
      });
    }

  } catch (error) {
    console.warn('Error fetching active promotions:', error);
  }

  return activePromotions;
}

/**
 * Get the highest multiplier from all active promotions
 * @returns Promise<number> - Highest active multiplier
 */
export async function getHighestActiveMultiplier(): Promise<number> {
  const promotions = await getActivePromotions();
  
  if (promotions.length === 0) return 1;
  
  return Math.max(...promotions.map(p => p.multiplier));
}

/**
 * Check if a specific promotion type is currently active
 * @param type - Promotion type to check
 * @returns Promise<boolean> - True if promotion type is active
 */
export async function isPromotionTypeActive(type: string): Promise<boolean> {
  const promotions = await getActivePromotions();
  return promotions.some(p => p.type === type && p.active);
}