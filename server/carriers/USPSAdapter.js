export class USPSAdapter {
  name = 'USPS';
  
  async quote(p) {
    // TODO: Replace with USPS API call
    const base = p.weightOz * 0.08; // Base rate per ounce
    
    // Speed multipliers
    const speedMultipliers = {
      economy: 1.0,     // Ground Advantage
      standard: 1.4,    // Priority Mail
      expedited: 2.8    // Priority Express
    };
    
    // Mode adjustments
    const modeAdjustment = p.mode === 'inbound' ? 0.9 : 1.0; // Slight discount for returns
    
    // Dimensional weight calculation (if dimensions provided)
    let dimensionalWeight = 0;
    if (p.dimensionsIn) {
      const { l, w, h } = p.dimensionsIn;
      dimensionalWeight = (l * w * h) / 194; // USPS dimensional divisor
    }
    
    // Use greater of actual weight or dimensional weight
    const billableWeight = Math.max(p.weightOz, dimensionalWeight * 16); // Convert lbs to oz
    
    // Calculate final cost
    const speedCost = base * speedMultipliers[p.speed];
    const weightCost = billableWeight > p.weightOz ? (billableWeight - p.weightOz) * 0.05 : 0;
    const finalCost = (speedCost + weightCost) * modeAdjustment;
    
    // Service mapping and delivery estimates
    const serviceMap = {
      economy: { service: 'USPS Ground Advantage', estDays: 3 },
      standard: { service: 'USPS Priority Mail', estDays: 2 },
      expedited: { service: 'USPS Priority Express', estDays: 1 }
    };
    
    const serviceInfo = serviceMap[p.speed];
    
    return {
      carrier: this.name,
      service: serviceInfo.service,
      cost: Math.round(finalCost * 100) / 100, // Round to cents
      estDays: serviceInfo.estDays,
      lastMile: true // USPS always handles last mile
    };
  }
}