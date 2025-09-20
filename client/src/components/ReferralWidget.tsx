import React, { useEffect, useState } from "react";

export default function ReferralWidget() {
  const [codes,setCodes] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);
  async function refresh(){ const r = await fetch("/api/referrals/mine"); if(r.ok) setCodes(await r.json()); }
  useEffect(()=>{ refresh().catch(()=>{}); },[]);
  async function createCode(){
    setLoading(true);
    const r = await fetch("/api/referrals/create", { method:"POST" });
    setLoading(false);
    if(r.ok){ await refresh(); }
  }
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">Invite to Shop</h4>
        <button onClick={createCode} disabled={loading} className={`px-3 py-1 rounded-md ${loading?"bg-gray-300":"bg-black text-white"}`}>{loading?"Creating…":"Generate Code"}</button>
      </div>
      <ul className="text-sm space-y-1">
        {codes.map((c:any)=>(
          <li key={c.code} className="flex items-center justify-between">
            <span className="font-mono">{c.code}</span>
            <span className="text-xs text-gray-500">{c.status}</span>
          </li>
        ))}
        {!codes.length && <li className="text-xs text-gray-500">No codes yet.</li>}
      </ul>
    </div>
  );
}