import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SpiralTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  source: string;
  description: string;
  date: Date;
  orderId?: string;
}

interface LoyaltyState {
  spiralBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  transactions: SpiralTransaction[];
  
  // Actions
  addTransaction: (transaction: Omit<SpiralTransaction, 'id' | 'date'>) => void;
  calculateSpiralsEarned: (amount: number, source: 'online_purchase' | 'in_person_purchase', multipliers?: { pickup?: boolean, invite?: boolean, event?: boolean }) => number;
  getRedemptionValue: (spirals: number) => number;
  clearTransactions: () => void;
}

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      spiralBalance: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      transactions: [],

      addTransaction: (transaction) => {
        const newTransaction: SpiralTransaction = {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date(),
        };

        set((state) => {
          const newTransactions = [newTransaction, ...state.transactions];
          let newBalance = state.spiralBalance;
          let newTotalEarned = state.totalEarned;
          let newTotalRedeemed = state.totalRedeemed;

          if (transaction.type === 'earned') {
            newBalance += transaction.amount;
            newTotalEarned += transaction.amount;
          } else if (transaction.type === 'redeemed') {
            newBalance -= transaction.amount;
            newTotalRedeemed += transaction.amount;
          }

          return {
            transactions: newTransactions,
            spiralBalance: Math.max(0, newBalance),
            totalEarned: newTotalEarned,
            totalRedeemed: newTotalRedeemed,
          };
        });
      },

      calculateSpiralsEarned: (amount: number, source: 'online_purchase' | 'in_person_purchase', multipliers?: { pickup?: boolean, invite?: boolean, event?: boolean }) => {
        // Base: 1 SPIRAL per $1 spent
        let spirals = Math.floor(amount);
        
        // Apply multipliers
        if (multipliers?.pickup) spirals *= 2; // 2x for pickup
        if (multipliers?.invite) spirals *= 3; // 3x for invite  
        if (multipliers?.event) spirals *= 5; // 5x for events
        
        return spirals;
      },

      getRedemptionValue: (spirals: number) => {
        // 100 SPIRALs = $1 credit (1% cash-back equivalent)
        return spirals / 100;
      },

      clearTransactions: () => {
        set({
          spiralBalance: 0,
          totalEarned: 0,
          totalRedeemed: 0,
          transactions: [],
        });
      },
    }),
    {
      name: 'spiral-loyalty-storage',
    }
  )
);