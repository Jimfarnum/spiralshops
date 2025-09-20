import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  mall?: string;
  image?: string;
  category?: string;
  store?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number, mall?: string) => void;
  updateQuantity: (id: number, quantity: number, mall?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (id: number, mall?: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          cartItem => cartItem.id === item.id && cartItem.mall === item.mall
        );
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += 1;
          return { items: updatedItems };
        } else {
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }
      }),
      
      removeItem: (id, mall) => set((state) => ({
        items: state.items.filter(item => 
          !(item.id === id && item.mall === mall)
        )
      })),
      
      updateQuantity: (id, quantity, mall) => set((state) => {
        if (quantity <= 0) {
          return { 
            items: state.items.filter(item => 
              !(item.id === id && item.mall === mall)
            )
          };
        }
        
        const updatedItems = state.items.map(item =>
          item.id === id && item.mall === mall
            ? { ...item, quantity }
            : item
        );
        return { items: updatedItems };
      }),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: (id, mall) => {
        const state = get();
        const item = state.items.find(item => item.id === id && item.mall === mall);
        return item ? item.quantity : 0;
      }
    }),
    {
      name: 'spiral-cart-storage',
    }
  )
);