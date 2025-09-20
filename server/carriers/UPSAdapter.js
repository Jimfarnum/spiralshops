export class UPSAdapter {
  name = 'UPS';
  
  async quote(p) {
    // TODO: Replace with UPS API call
    const base = p.weightOz * 0.10; // Mid-range pricing
    
    // Speed multipliers for UPS services
    const speedMultipliers = {
      economy: 1.1,     // UPS Ground
      standard: 1.6,    // UPS 3 Day Select
      expedited: 3.2    // UPS 2nd Day Air / Next Day
    };
    
    // Mode adjustments
    const modeAdjustment = p.mode === 'inbound' ? 0.92 : 1.0;
    
    // UPS dimensional weight (139 divisor like FedEx)
    let dimensionalWeight = 0;
    if (p.dimensionsIn) {
      const { l, w, h } = p.dimensionsIn;
      dimensionalWeight = (l * w * h) / 139;
    }
    
    const billableWeight = Math.max(p.weightOz, dimensionalWeight * 16);
    
    // Calculate cost
    const speedCost = base * speedMultipliers[p.speed];
    const weightCost = billableWeight > p.weightOz ? (billableWeight - p.weightOz) * 0.07 : 0;
    const fuelSurcharge = speedCost * 0.08; // 8% fuel surcharge
    const finalCost = (speedCost + weightCost + fuelSurcharge) * modeAdjustment;
    
    // Service mapping
    const serviceMap = {
      economy: { service: 'UPS Ground', estDays: 4 },
      standard: { service: 'UPS 3 Day Select', estDays: 3 },
      expedited: { service: 'UPS 2nd Day Air', estDays: 2 }
    };
    
    const serviceInfo = serviceMap[p.speed];
    
    return {
      carrier: this.name,
      service: serviceInfo.service,
      cost: Math.round(finalCost * 100) / 100,
      estDays: serviceInfo.estDays,
      lastMile: false // UPS uses their own network
    };
  }
}