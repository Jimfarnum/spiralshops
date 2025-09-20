import { useEffect } from 'react';
import { useLocationStore } from '@/lib/locationStore';
import { useCartStore } from '@/lib/cartStore';

// Component to sync mall context between location and cart stores
export default function MallContextSync() {
  const { mallContext } = useLocationStore();
  const { setMallContext } = useCartStore();

  useEffect(() => {
    setMallContext(mallContext.mallId, mallContext.mallName);
  }, [mallContext.mallId, mallContext.mallName, setMallContext]);

  return null; // This is a sync component, no UI needed
}