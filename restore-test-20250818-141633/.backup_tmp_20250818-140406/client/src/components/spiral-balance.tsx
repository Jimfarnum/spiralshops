import React from 'react';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { useAuthStore } from '@/lib/authStore';
import { Star } from 'lucide-react';

const SpiralBalance = () => {
  const { spiralBalance } = useLoyaltyStore();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-[var(--spiral-sage)]/10 to-[var(--spiral-coral)]/10 rounded-lg px-4 py-2 border border-[var(--spiral-coral)]/20">
      <Star className="h-4 w-4 text-[var(--spiral-coral)]" />
      <span className="text-sm font-semibold text-[var(--spiral-navy)]">
        {spiralBalance} SPIRALs
      </span>
    </div>
  );
};

export default SpiralBalance;