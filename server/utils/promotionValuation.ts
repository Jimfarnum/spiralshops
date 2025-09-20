/**
 * SPIRALS Promotion Valuation Engine
 * 
 * Analyzes promotion requests and calculates:
 * - Business impact score (0-100)
 * - Platform cost estimation
 * - Risk assessment
 * - Optimization recommendations
 */

interface PromotionRequestData {
  desiredMultiplier: number;
  desiredStartsAt: Date;
  desiredEndsAt: Date;
  expectedGMV: number;
  sponsorCoveragePct: number;
  targetCategories?: string[];
  targetStoreIds?: string[];
  targetMallIds?: string[];
}

interface ValuationResult {
  score: number;
  risk: 'low' | 'medium' | 'high';
  effectiveCostPct: number;
  recommendedMultiplier: number;
  recommendedDurationDays: number;
  notes: string;
}

function daysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function evaluatePromotionRequest(request: PromotionRequestData): ValuationResult {
  // Normalize input values
  const multiplier = Math.min(10, Math.max(2, Number(request.desiredMultiplier || 5)));
  const gmv = Math.max(0, Number(request.expectedGMV || 0));
  const sponsorCoverage = Math.min(100, Math.max(0, Number(request.sponsorCoveragePct || 0)));
  const duration = daysBetween(request.desiredStartsAt, request.desiredEndsAt);

  // Count targeting specificity
  const targetingScore = 
    (request.targetStoreIds?.length || 0) +
    (request.targetMallIds?.length || 0) +
    (request.targetCategories?.length || 0);

  // Calculate platform cost estimation
  // Base SPIRALS rate: 1%, promotion multiplier increases this
  const grossRewardPct = multiplier; // e.g., 5x multiplier = ~5% rewards
  const redemptionRate = 0.7; // Assume 70% of earned SPIRALS get redeemed
  const sponsorShare = sponsorCoverage / 100;
  const effectiveCostPct = Math.max(0, (grossRewardPct * redemptionRate) * (1 - sponsorShare));

  // Score calculation (0-100 scale)
  let score = 50; // Base score

  // GMV Impact (0-35 points)
  if (gmv >= 100000) score += 15; // $100K+ GMV
  if (gmv >= 250000) score += 10; // $250K+ GMV  
  if (gmv >= 500000) score += 10; // $500K+ GMV

  // Sponsor Coverage (0-20 points)
  if (sponsorCoverage >= 25) score += 10; // Partner covers 25%+ of costs
  if (sponsorCoverage >= 50) score += 10; // Partner covers 50%+ of costs

  // Duration Discipline (±15 points)
  if (duration <= 7) score += 10; // Short campaigns create urgency
  else if (duration <= 14) score += 5; // Moderate length acceptable
  else if (duration > 21) score -= 10; // Long campaigns drain resources

  // Targeting Specificity (0-10 points)
  if (targetingScore >= 1) score += 5; // Some targeting vs blanket promotion
  if (targetingScore >= 3) score += 5; // Highly targeted campaigns

  // Risk Penalties
  if (multiplier >= 7) score -= 5; // High multipliers are costly
  if (duration > 21) score -= 10; // Extended campaigns increase risk
  if (effectiveCostPct > 3.0) score -= 15; // Very high platform costs

  // Final score bounds
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Risk Assessment
  let risk: 'low' | 'medium' | 'high';
  if (effectiveCostPct > 2.5 || multiplier >= 8 || duration > 28) {
    risk = 'high';
  } else if (effectiveCostPct > 1.2 || multiplier >= 6 || duration > 14) {
    risk = 'medium';
  } else {
    risk = 'low';
  }

  // Optimization Recommendations
  const recommendedMultiplier = Math.min(multiplier, 5); // Cap at 5x for sustainability
  const recommendedDurationDays = Math.min(duration, 14); // Cap at 2 weeks

  // Generate notes
  const notes = [
    `Estimated platform cost: ${effectiveCostPct.toFixed(2)}% of promotional GMV after sponsor contribution.`,
    duration > 14 ? 'Recommend shorter duration (≤14 days) for urgency and cost control.' : 'Duration is appropriate.',
    multiplier > 5 ? 'Consider capping multiplier at 5x for long-term sustainability.' : 'Multiplier level is acceptable.',
    sponsorCoverage >= 25 ? 'Good sponsor cost coverage helps platform economics.' : 'Higher sponsor coverage would improve viability.',
    targetingScore >= 2 ? 'Well-targeted promotion reduces waste.' : 'Consider adding targeting criteria to improve efficiency.',
  ].join(' ');

  return {
    score,
    risk,
    effectiveCostPct: Number(effectiveCostPct.toFixed(2)),
    recommendedMultiplier,
    recommendedDurationDays,
    notes
  };
}

export function calculatePromotionImpact(promotion: any, projectedGMV: number): {
  estimatedRewards: number;
  platformCost: number;
  customerBenefit: number;
} {
  const multiplier = Number(promotion.multiplier || 5);
  const baseRewardRate = 0.01; // 1% base SPIRALS rate
  
  const totalRewards = projectedGMV * baseRewardRate * multiplier;
  const redemptionRate = 0.7;
  const platformCost = totalRewards * redemptionRate;
  const customerBenefit = totalRewards;

  return {
    estimatedRewards: Math.round(totalRewards),
    platformCost: Math.round(platformCost),
    customerBenefit: Math.round(customerBenefit)
  };
}