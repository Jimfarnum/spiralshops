export type TrustSnapshot = {
  uptime90d: number;               // %
  apiP50ms: number;                // ms
  orderSuccessRate30d: number;     // %
  pickupOnTimeRate30d: number;     // %
  spiralsIssued30d: number;
  spiralsRedeemed30d: number;
  updatedAt: string;
};

// TODO: replace with real aggregations (DB/monitoring)
export function getTrustSnapshot(): TrustSnapshot {
  return {
    uptime90d: 99.95,
    apiP50ms: 42,
    orderSuccessRate30d: 98.7,
    pickupOnTimeRate30d: 96.4,
    spiralsIssued30d: 125432,
    spiralsRedeemed30d: 84211,
    updatedAt: new Date().toISOString()
  };
}