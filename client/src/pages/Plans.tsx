import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Plans() {
  const [retailerId, setRetailerId] = useState("demo-retailer-1");
  const [email, setEmail] = useState("owner@example.com");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function subscribe(plan: "silver"|"gold") {
    setBusy(true); setMsg("");
    const r = await fetch(`${API}/api/billing/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Retailer-Id": retailerId },
      body: JSON.stringify({ plan, retailerId, email })
    });
    const data = await r.json();
    setBusy(false);
    if (data.url) window.location.href = data.url;
    else setMsg(data.error || "Subscribe failed");
  }

  async function portal() {
    setBusy(true); setMsg("");
    const r = await fetch(`${API}/api/billing/portal`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Retailer-Id": retailerId },
      body: JSON.stringify({ retailerId, email })
    });
    const data = await r.json();
    setBusy(false);
    if (data.url) window.location.href = data.url;
    else setMsg(data.error || "Portal failed");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose Your Plan</h1>
      <div className="mb-4 grid gap-2">
        <label className="text-sm">Retailer ID</label>
        <input value={retailerId} onChange={e=>setRetailerId(e.target.value)} className="border p-2 rounded"/>
        <label className="text-sm">Owner Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 rounded"/>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <h2 className="font-semibold text-lg">Free (Starter)</h2>
          <p className="text-sm text-gray-600">No monthly fee. Core checkout & basic tools.</p>
          <p className="mt-2 font-mono">$0 / mo</p>
          <button disabled className="bg-gray-300 text-gray-600 px-4 py-2 rounded mt-3">Current</button>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold text-lg">Silver (Growth)</h2>
          <p className="text-sm text-gray-600">Unlimited SKUs, abandoned cart, local SEO.</p>
          <p className="mt-2 font-mono">$49 / mo</p>
          <button onClick={()=>subscribe("silver")} disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700 disabled:opacity-50">Upgrade to Silver</button>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold text-lg">Gold (Scale)</h2>
          <p className="text-sm text-gray-600">Priority placement, advanced analytics, T+1 payouts.</p>
          <p className="mt-2 font-mono">$149 / mo</p>
          <button onClick={()=>subscribe("gold")} disabled={busy} className="bg-purple-600 text-white px-4 py-2 rounded mt-3 hover:bg-purple-700 disabled:opacity-50">Upgrade to Gold</button>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={portal} disabled={busy} className="bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50">Manage Billing (Stripe Portal)</button>
      </div>
      {msg && <p className="mt-3 text-red-700">{msg}</p>}
    </div>
  );
}