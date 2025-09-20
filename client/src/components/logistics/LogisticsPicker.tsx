import React, { useState } from "react";

const DELIVERY_METHODS = [
  { id: "ship_direct", label: "Ship to my address", icon: "🚚" },
  { id: "split_shipping", label: "Split by retailer", icon: "📦" },
  { id: "pickup_mall", label: "Pick up at mall", icon: "🏬" },
  { id: "pickup_retailer", label: "Pick up at retailer", icon: "🏪" },
];

interface LogisticsPickerProps {
  onSelect: (method: string) => void;
}

export default function LogisticsPicker({ onSelect }: LogisticsPickerProps) {
  const [selectedMethod, setSelectedMethod] = useState("ship_direct");

  return (
    <div className="bg-white rounded-xl shadow p-3 space-y-3" data-testid="logistics-picker">
      <div className="font-medium text-lg">Delivery Options</div>
      
      <div className="space-y-2">
        {DELIVERY_METHODS.map(option => (
          <label 
            key={option.id} 
            className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors hover:bg-gray-50"
            style={{
              borderColor: selectedMethod === option.id ? '#007B8A' : '#e5e7eb',
              backgroundColor: selectedMethod === option.id ? '#f0f9ff' : 'transparent'
            }}
            data-testid={`logistics-option-${option.id}`}
          >
            <input 
              type="radio" 
              name="logistics" 
              value={option.id} 
              checked={selectedMethod === option.id} 
              onChange={() => setSelectedMethod(option.id)}
              className="w-4 h-4 text-[#007B8A] border-gray-300 focus:ring-[#007B8A]"
            />
            
            <span className="text-xl mr-2">{option.icon}</span>
            <span className="flex-1 font-medium">{option.label}</span>
            
            {/* Show special benefits for pickup options */}
            {(option.id === "pickup_mall" || option.id === "pickup_retailer") && (
              <span className="text-xs bg-[#FFD700] text-[#007B8A] px-2 py-1 rounded-full font-medium">
                Special Offers!
              </span>
            )}
          </label>
        ))}
      </div>
      
      <button 
        className="tap w-full rounded-xl bg-[#007B8A] text-white font-medium hover:bg-[#005a66] transition-colors"
        onClick={() => onSelect(selectedMethod)}
        data-testid="button-continue-logistics"
      >
        Continue with {DELIVERY_METHODS.find(m => m.id === selectedMethod)?.label}
      </button>
      
      {/* Pickup special preview */}
      {(selectedMethod === "pickup_mall" || selectedMethod === "pickup_retailer") && (
        <div className="text-sm text-center p-2 bg-[#FFF9E6] rounded-lg border border-[#FFD700]" data-testid="pickup-special-preview">
          💫 You'll receive exclusive pickup specials after checkout!
        </div>
      )}
    </div>
  );
}