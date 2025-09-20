import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FulfillmentGroupSummary {
  fulfillmentMethod: 'ship-to-me' | 'in-store-pickup' | 'ship-to-mall';
  storeId?: number;
  storeName?: string;
  mallId?: string;
  mallName?: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  estimatedDelivery: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  store?: string;
  storeId?: number;
  mallId?: string;
  mallName?: string;
  fulfillmentMethod?: 'ship-to-me' | 'in-store-pickup' | 'ship-to-mall';
  estimatedDelivery?: string;
  shippingCost?: number;
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
  updateFulfillmentMethod: (id: number, method: 'ship-to-me' | 'in-store-pickup' | 'ship-to-mall') => void;
  clearCart: () => void;
  clearMallCart: () => void;
  setMallContext: (mallId: string | null, mallName: string | null) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalShippingCost: () => number;
  getMallItems: () => CartItem[];
  getActiveItems: () => CartItem[];
  getFulfillmentGroups: () => FulfillmentGroupSummary[];
  getItemsByStore: () => { [storeId: string]: CartItem[] };
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
      },

      updateFulfillmentMethod: (id: number, method: 'ship-to-me' | 'in-store-pickup' | 'ship-to-mall') => {
        const estimatedDelivery = method === 'in-store-pickup' 
          ? 'Ready today for pickup'
          : method === 'ship-to-mall' 
          ? 'Ships to SPIRAL Center in 2-3 days'
          : 'Ships in 2-5 business days';
          
        const shippingCost = method === 'ship-to-me' ? 4.99 : 0;

        set({
          items: get().items.map(item =>
            item.id === id
              ? { ...item, fulfillmentMethod: method, estimatedDelivery, shippingCost }
              : item
          )
        });
      },

      getTotalShippingCost: () => {
        return get().getActiveItems().reduce((total, item) => total + (item.shippingCost || 0), 0);
      },

      getFulfillmentGroups: (): FulfillmentGroupSummary[] => {
        const items = get().getActiveItems();
        const groups: { [key: string]: FulfillmentGroupSummary } = {};

        items.forEach(item => {
          const fulfillmentMethod = item.fulfillmentMethod || 'ship-to-me';
          const key = `${fulfillmentMethod}-${item.storeId || 'unknown'}-${item.mallId || 'none'}`;
          
          if (!groups[key]) {
            groups[key] = {
              fulfillmentMethod,
              storeId: item.storeId,
              storeName: item.store,
              mallId: item.mallId,
              mallName: item.mallName,
              items: [],
              subtotal: 0,
              shippingCost: 0,
              estimatedDelivery: item.estimatedDelivery || 'Ships in 2-5 business days'
            };
          }
          
          groups[key].items.push(item);
          groups[key].subtotal += item.price * item.quantity;
          groups[key].shippingCost += item.shippingCost || 0;
        });

        return Object.values(groups);
      },

      getItemsByStore: () => {
        const items = get().getActiveItems();
        const storeGroups: { [storeId: string]: CartItem[] } = {};

        items.forEach(item => {
          const storeId = item.storeId?.toString() || 'unknown';
          if (!storeGroups[storeId]) {
            storeGroups[storeId] = [];
          }
          storeGroups[storeId].push(item);
        });

        return storeGroups;
      }
    }),
    {
      name: 'spiral-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);