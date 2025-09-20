import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "Your connection has been restored.",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Some features may not work without internet.",
        variant: "destructive",
        duration: 5000,
      });
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 flex items-center gap-3 max-w-sm mx-auto">
      <WifiOff className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-sm">You're offline</p>
        <p className="text-xs opacity-90">Check your internet connection</p>
      </div>
    </div>
  );
}