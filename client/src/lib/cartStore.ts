import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  store?: string;
  mallId?: string;
  mallName?: string;
}

interface CartStore {
  items: CartItem[];
  mallContext: {
    mallId: string | null;
    mallName: string | null;
  };
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  clearMallCart: () => void;
  setMallContext: (mallId: string | null, mallName: string | null) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getMallItems: () => CartItem[];
  getActiveItems: () => CartItem[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      mallContext: {
        mallId: null,
        mallName: null,
      },
      
      addItem: (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [...items, { ...product, quantity }]
          });
        }
      },
      
      removeItem: (id: number) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },
      
      updateQuantity: (id: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      clearMallCart: () => {
        const { mallContext } = get();
        if (mallContext.mallId) {
          set({
            items: get().items.filter(item => item.mallId !== mallContext.mallId)
          });
        }
      },
      
      setMallContext: (mallId: string | null, mallName: string | null) => {
        set({
          mallContext: { mallId, mallName }
        });
      },
      
      getMallItems: () => {
        const { mallContext, items } = get();
        if (!mallContext.mallId) return [];
        return items.filter(item => item.mallId === mallContext.mallId);
      },
      
      getActiveItems: () => {
        const { mallContext, items } = get();
        if (mallContext.mallId) {
          return items.filter(item => item.mallId === mallContext.mallId);
        }
        return items;
      },
      
      getTotalItems: () => {
        return get().getActiveItems().reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().getActiveItems().reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'spiral-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);