import React, { useMemo, useState } from "react";

type CartLine = { 
  sku: string; 
  name: string; 
  price: number; 
  qty: number; 
  retailerId: string; 
};

interface CartSummaryProps {
  lines: CartLine[];
  spiralsBalance: number;
  onCheckout: (payload: { lines: CartLine[]; applySpirals: number }) => void;
}

export default function CartSummary({ lines, spiralsBalance, onCheckout }: CartSummaryProps) {
  const [applySpirals, setApplySpirals] = useState(0);
  
  const grouped = useMemo(() => 
    lines.reduce((m, l) => {
      if (!m[l.retailerId]) m[l.retailerId] = [];
      m[l.retailerId].push(l);
      return m;
    }, {} as Record<string, CartLine[]>), [lines]
  );
  
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const spiralsValue = applySpirals / 100; // 100 pts = $1
  const afterSpirals = Math.max(0, subtotal - spiralsValue);
  const platformFee = +(afterSpirals * 0.05).toFixed(2); // 5%
  const total = +(afterSpirals + platformFee).toFixed(2);
  const spiralsEarned = Math.round(afterSpirals * 100);

  return (
    <section className="cart-summary" data-testid="cart-summary">
      <div className="space-y-2">
        {Object.entries(grouped).map(([rid, items]) => (
          <details key={rid} className="bg-white rounded-xl shadow p-3" data-testid={`retailer-group-${rid}`}>
            <summary className="font-medium cursor-pointer hover:text-[#007B8A]">
              Retailer • {rid} <span className="text-sm opacity-70">({items.length} items)</span>
            </summary>
            <ul className="mt-2 space-y-1">
              {items.map((l, i) => (
                <li key={i} className="flex justify-between text-sm" data-testid={`item-${l.sku}`}>
                  <span className="mr-2">{l.name} × {l.qty}</span>
                  <span>${(l.price * l.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-3" data-testid="spirals-section">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">SPIRALs Balance</span>
          <span className="text-sm" data-testid="spirals-balance">
            {spiralsBalance.toLocaleString()} pts
          </span>
        </div>
        
        <input 
          type="range" 
          min={0} 
          max={spiralsBalance} 
          step={100}
          value={applySpirals} 
          onChange={e => setApplySpirals(parseInt(e.target.value))} 
          className="w-full mt-2 accent-[#007B8A]"
          data-testid="spirals-slider" 
        />
        
        <div className="text-sm mt-1" data-testid="spirals-applying">
          Applying <b>{applySpirals.toLocaleString()}</b> pts (−${(applySpirals / 100).toFixed(2)})
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-3 text-sm space-y-1" data-testid="order-total">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <b data-testid="subtotal">${subtotal.toFixed(2)}</b>
        </div>
        <div className="flex justify-between">
          <span>SPIRALs Redeemed</span>
          <b data-testid="spirals-redeemed">−${spiralsValue.toFixed(2)}</b>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee (5%)</span>
          <b data-testid="platform-fee">${platformFee.toFixed(2)}</b>
        </div>
        <div className="flex justify-between text-base pt-1 border-t">
          <span>Total Due</span>
          <b data-testid="total-due">${total.toFixed(2)}</b>
        </div>
        <div className="flex justify-between text-xs pt-1 opacity-80">
          <span>SPIRALs Earned This Order</span>
          <b data-testid="spirals-earned">{spiralsEarned.toLocaleString()} pts</b>
        </div>
      </div>

      <button 
        className="w-full tap rounded-xl bg-[#007B8A] text-white font-medium hover:bg-[#005a66] transition-colors"
        onClick={() => onCheckout({ lines, applySpirals })}
        data-testid="button-checkout"
      >
        Place Order (Simulated)
      </button>
      
      <p className="text-xs text-center opacity-70" data-testid="beta-disclaimer">
        * Simulation only — no actual charges. SPIRALs are platform credits.
      </p>
    </section>
  );
}