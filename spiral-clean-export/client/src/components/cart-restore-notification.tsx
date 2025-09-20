import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';

const CartRestoreNotification = () => {
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const { toast } = useToast();
  const [hasShownNotification, setHasShownNotification] = useState(false);

  useEffect(() => {
    // Check if there are items in the cart on app load
    // We use a timeout to ensure the store has been hydrated from localStorage
    const timer = setTimeout(() => {
      const itemCount = getTotalItems();
      
      // Only show notification if:
      // 1. There are items in the cart
      // 2. We haven't shown the notification yet in this session
      // 3. This is likely a page refresh (indicated by persisted cart data)
      if (itemCount > 0 && !hasShownNotification) {
        // Check if localStorage has the cart data (indicating this is a returning user)
        const persistedData = localStorage.getItem('spiral-cart-storage');
        if (persistedData) {
          toast({
            title: "Cart restored",
            description: `Welcome back! You have ${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart.`,
            duration: 4000,
          });
          setHasShownNotification(true);
        }
      }
    }, 300); // Slightly longer timeout to ensure Zustand persistence has loaded

    return () => clearTimeout(timer);
  }, [getTotalItems, hasShownNotification, toast]);

  return null; // This component doesn't render anything
};

export default CartRestoreNotification;