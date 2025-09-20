// SPIRAL Platform - Progressive Discount Tiers
// Based on annual payment volume for card fee reductions

export function getDiscountTier(annualVolumeUSD) {
  // Progressive discount tiers based on annual volume
  // Returns basis points (hundredths of a percent) discount on card fees
  
  if (annualVolumeUSD >= 50_000_000) {
    return { tier: 'Enterprise', discountBps: 275 }; // 2.75% savings
  }
  
  if (annualVolumeUSD >= 10_000_000) {
    return { tier: 'Corporate', discountBps: 200 }; // 2.00% savings
  }
  
  if (annualVolumeUSD >= 2_500_000) {
    return { tier: 'Professional', discountBps: 150 }; // 1.50% savings
  }
  
  if (annualVolumeUSD >= 500_000) {
    return { tier: 'Business', discountBps: 100 }; // 1.00% savings
  }
  
  if (annualVolumeUSD >= 100_000) {
    return { tier: 'Growth', discountBps: 60 }; // 0.60% savings
  }
  
  if (annualVolumeUSD >= 25_000) {
    return { tier: 'Starter', discountBps: 30 }; // 0.30% savings
  }
  
  return { tier: 'Basic', discountBps: 0 }; // No discount for low volume
}

// Get logistics discount percentages based on shipping volume
export function getLogisticsDiscountTier(parcelsPerMonth) {
  if (parcelsPerMonth >= 100_000) {
    return { tier: 'Ultra High Volume', discountPct: 35 }; // 35% off shipping
  }
  
  if (parcelsPerMonth >= 50_000) {
    return { tier: 'Very High Volume', discountPct: 30 }; // 30% off shipping
  }
  
  if (parcelsPerMonth >= 25_000) {
    return { tier: 'High Volume', discountPct: 25 }; // 25% off shipping
  }
  
  if (parcelsPerMonth >= 10_000) {
    return { tier: 'Medium Volume', discountPct: 20 }; // 20% off shipping
  }
  
  if (parcelsPerMonth >= 5_000) {
    return { tier: 'Low-Medium Volume', discountPct: 15 }; // 15% off shipping
  }
  
  if (parcelsPerMonth >= 1_000) {
    return { tier: 'Low Volume', discountPct: 10 }; // 10% off shipping
  }
  
  return { tier: 'Starter', discountPct: 5 }; // 5% off shipping for everyone
}

// Calculate SPIRAL Points earned from discounts and savings
export function calculateSpiralPointsFromSavings(totalSavings) {
  // 1 SPIRAL Point for every $0.05 in savings (20 points per dollar saved)
  return Math.floor(totalSavings * 20);
}