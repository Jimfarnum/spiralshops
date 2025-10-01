import React, { useEffect, useState } from "react";

export default function SpiralsExplainer({ triggerText="What are SPIRALS?" }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<"A"|"B">("A");
  useEffect(() => { fetch("/api/flags").then(r=>r.json()).then(f=>setVariant(f?.ab?.spiralsExplainer||"A")); }, []);
  return (
    <>
      <button type="button" className="underline text-sm" onClick={()=>setOpen(true)}>{triggerText}</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={()=>setOpen(false)}>
          <div className="bg-white rounded-xl p-5 max-w-md w-full" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">SPIRALS Rewards</h3>
            {variant === "A" ? (
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Earn <strong>1 SPIRAL</strong> per <strong>$1</strong> spent.</li>
                <li>100 SPIRALS = $1 credit (≈1% back).</li>
                <li><strong>2×</strong> SPIRALS for mall pickup.</li>
                <li><strong>3×</strong> for "Invite to Shop".</li>
                <li>Seasonal promos run <strong>only by SPIRAL</strong>.</li>
              </ul>
            ) : (
              <p className="text-sm">Every purchase earns SPIRALS. Redeem at checkout. Pick up in-mall for 2× and invite a friend for 3×.</p>
            )}
            <div className="mt-4 flex justify-end">
              <button className="px-3 py-2 bg-black text-white rounded-md" onClick={()=>setOpen(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}