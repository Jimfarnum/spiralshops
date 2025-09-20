export function getDiscountTier(volumeAnnualUSD) {
  if (volumeAnnualUSD >= 100000000) {
    return {
      tier: 3,
      name: 'Enterprise Plus',
      discountPercentage: 35,
      minimumVolume: 100000000,
      benefits: ['35% platform fee discount', 'Priority support', 'Dedicated account manager']
    };
  } else if (volumeAnnualUSD >= 10000000) {
    return {
      tier: 2,
      name: 'Enterprise',
      discountPercentage: 20,
      minimumVolume: 10000000,
      benefits: ['20% platform fee discount', 'Enhanced analytics', 'Priority onboarding']
    };
  } else if (volumeAnnualUSD >= 1000000) {
    return {
      tier: 1,
      name: 'Professional',
      discountPercentage: 10,
      minimumVolume: 1000000,
      benefits: ['10% platform fee discount', 'Advanced reporting', 'Email support']
    };
  } else {
    return {
      tier: 0,
      name: 'Standard',
      discountPercentage: 0,
      minimumVolume: 0,
      benefits: ['Standard features', 'Community support']
    };
  }
}