import React, { useEffect, useState } from "react";

export default function TrustBadge() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch("/api/trust/public").then(r=>r.json()).then(setData).catch(()=>{}); }, []);
  if (!data) return null;
  return (
    <a href="/trust" className="block w-full bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
      <div className="text-sm">
        <strong>SPIRAL Buyer Guarantee</strong> · Uptime {data.uptime90d}% · API p50 {data.apiP50ms}ms · On-time pickup {data.pickupOnTimeRate30d}%
      </div>
    </a>
  );
}