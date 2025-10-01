type Tier = { tier: number; volumeMin: number; volumeMax?: number; discountBps?: number; notes?: string };

const TIERS: Tier[] = [
  { tier: 1, volumeMin: 0,          volumeMax: 50_000_000,  discountBps: 0,  notes: 'Co-marketing eligible' },
  { tier: 2, volumeMin: 50_000_000, volumeMax: 500_000_000, discountBps: 15, notes: 'Card-linked offers' },
  { tier: 3, volumeMin: 500_000_000,                          discountBps: 30, notes: 'Preferred rates + co-op budget' },
];

export function getDiscountTier(volumeAnnualUSD: number) {
  const t = TIERS.find(t => volumeAnnualUSD >= t.volumeMin && (t.volumeMax === undefined || volumeAnnualUSD < t.volumeMax))!;
  return { tier: t.tier, discountBps: t.discountBps, notes: t.notes };
}

export function getAllTiers(): Tier[] {
  return TIERS.map(tier => ({ ...tier }));
}

export function calculateDiscountAmount(baseAmount: number, volumeAnnualUSD: number): number {
  const tierInfo = getDiscountTier(volumeAnnualUSD);
  const discountPercent = (tierInfo.discountBps || 0) / 10000; // Convert basis points to decimal
  return baseAmount * discountPercent;
}

export function getTierBenefits(tier: number): string[] {
  const benefits: Record<number, string[]> = {
    1: ['Co-marketing opportunities', 'Standard support', 'Basic analytics'],
    2: ['All Tier 1 benefits', 'Card-linked offers', '15bps volume discount', 'Priority support'],
    3: ['All Tier 2 benefits', '30bps volume discount', 'Preferred payment rates', 'Co-op marketing budget', 'Dedicated account manager']
  };
  
  return benefits[tier] || [];
}