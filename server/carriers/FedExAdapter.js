export class FedExAdapter {
  name = 'FedEx';
  
  async quote(p) {
    // FedEx doesn't typically handle economy shipping for small packages
    if (p.speed === 'economy' && p.weightOz < 16) {
      return null; // Not applicable
    }
    
    // TODO: Replace with FedEx API call
    const base = p.weightOz * 0.12; // Higher base rate than USPS
    
    // Speed multipliers for FedEx services
    const speedMultipliers = {
      economy: 1.2,     // FedEx Ground
      standard: 1.8,    // FedEx Express Saver
      expedited: 3.5    // FedEx 2Day/Overnight
    };
    
    // Mode adjustments
    const modeAdjustment = p.mode === 'inbound' ? 0.95 : 1.0;
    
    // Dimensional weight (FedEx uses 139 divisor)
    let dimensionalWeight = 0;
    if (p.dimensionsIn) {
      const { l, w, h } = p.dimensionsIn;
      dimensionalWeight = (l * w * h) / 139;
    }
    
    const billableWeight = Math.max(p.weightOz, dimensionalWeight * 16);
    
    // Calculate cost with FedEx premium
    const speedCost = base * speedMultipliers[p.speed];
    const weightCost = billableWeight > p.weightOz ? (billableWeight - p.weightOz) * 0.08 : 0;
    const premiumSurcharge = 2.50; // FedEx premium
    const finalCost = (speedCost + weightCost + premiumSurcharge) * modeAdjustment;
    
    // Service mapping
    const serviceMap = {
      economy: { service: 'FedEx Ground', estDays: 4 },
      standard: { service: 'FedEx Express Saver', estDays: 3 },
      expedited: { service: 'FedEx 2Day', estDays: 2 }
    };
    
    const serviceInfo = serviceMap[p.speed];
    
    return {
      carrier: this.name,
      service: serviceInfo.service,
      cost: Math.round(finalCost * 100) / 100,
      estDays: serviceInfo.estDays,
      lastMile: false // FedEx typically uses their own network
    };
  }
}