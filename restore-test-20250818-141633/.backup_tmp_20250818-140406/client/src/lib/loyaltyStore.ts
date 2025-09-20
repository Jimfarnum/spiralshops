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
  calculateSpiralsEarned: (amount: number, source: 'online_purchase' | 'in_person_purchase') => number;
  getDoubleValue: (spirals: number) => number;
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

      calculateSpiralsEarned: (amount: number, source: 'online_purchase' | 'in_person_purchase') => {
        // 5 SPIRALs for every $100 spent online
        // 10 SPIRALs for every $100 spent in person
        const rate = source === 'online_purchase' ? 5 : 10;
        return Math.floor((amount / 100) * rate);
      },

      getDoubleValue: (spirals: number) => {
        // SPIRALs earned online are worth double when redeemed in person
        return spirals * 2;
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