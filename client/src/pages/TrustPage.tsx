import React, { useEffect, useState } from "react";
export default function TrustPage(){
  const [d,setD] = useState<any>(null);
  useEffect(()=>{ fetch("/api/trust/public").then(r=>r.json()).then(setD).catch(()=>{}); },[]);
  if(!d) return <div className="p-6">Loading…</div>;
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">SPIRAL Public Trust Dashboard</h1>
      <p className="text-sm text-gray-600 mb-3">Updated {new Date(d.updatedAt).toLocaleString()}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card label="Uptime (90d)" value={`${d.uptime90d}%`} />
        <Card label="API p50" value={`${d.apiP50ms} ms`} />
        <Card label="Order success (30d)" value={`${d.orderSuccessRate30d}%`} />
        <Card label="Pickup on-time (30d)" value={`${d.pickupOnTimeRate30d}%`} />
        <Card label="SPIRALS issued (30d)" value={d.spiralsIssued30d.toLocaleString()} />
        <Card label="SPIRALS redeemed (30d)" value={d.spiralsRedeemed30d.toLocaleString()} />
      </div>
    </div>
  );
}
function Card({label,value}:{label:string,value:string}){
  return <div className="border rounded-xl p-4"><div className="text-xs text-gray-500">{label}</div><div className="text-xl font-semibold">{value}</div></div>;
}