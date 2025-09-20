export async function quoteShipping(input: {
  destinationZip: string;
  weightOz: number;
  dimensionsIn?: { l:number; w:number; h:number };
  speed: 'economy'|'standard'|'expedited';
  mode: 'outbound'|'inbound';
}) {
  // Placeholder rate card. Replace with carrier APIs + negotiated tiers.
  const base = input.weightOz * 0.05;
  const speedFactor = input.speed === 'economy' ? 1 : input.speed === 'standard' ? 1.4 : 2.1;
  const lastMile = 1.25; // simulate last-mile uplift
  const inboundAdj = input.mode === 'inbound' ? 0.9 : 1.0; // inbound inventory discount
  const cost = Math.max(3.5, base * speedFactor * lastMile * inboundAdj);

  return {
    destinationZip: input.destinationZip,
    speed: input.speed,
    mode: input.mode,
    carrierChosen: cost < 8 ? 'USPS (last-mile)' : 'Hybrid (FedEx + USPS)',
    cost: Number(cost.toFixed(2))
  };
}

export interface TrackingInfo {
  trackingNumber: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  location?: string;
  estimatedDelivery?: string;
  updates: Array<{
    timestamp: string;
    status: string;
    location: string;
  }>;
}

export async function trackShipment(trackingNumber: string): Promise<TrackingInfo> {
  // Placeholder tracking. Replace with carrier APIs.
  return {
    trackingNumber,
    status: 'in_transit',
    location: 'Distribution Center - Chicago, IL',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    updates: [
      {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'Picked up',
        location: 'Origin Facility'
      },
      {
        timestamp: new Date().toISOString(),
        status: 'In transit',
        location: 'Distribution Center - Chicago, IL'
      }
    ]
  };
}