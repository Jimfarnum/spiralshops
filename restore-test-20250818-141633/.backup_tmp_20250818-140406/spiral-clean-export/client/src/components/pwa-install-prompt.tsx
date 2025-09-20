import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasDeclined, setHasDeclined] = useLocalStorage('spiral-pwa-declined', false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show the install prompt if user hasn't declined before
      if (!hasDeclined) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      console.log('SPIRAL PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [hasDeclined]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      setHasDeclined(true);
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setHasDeclined(true);
  };

  // Check if already installed (standalone mode)
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;

  if (!showPrompt || !deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 max-w-sm mx-auto">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] rounded-lg flex items-center justify-center">
          <Smartphone className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-[var(--spiral-navy)] mb-1">
            Install SPIRAL App
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Add SPIRAL to your home screen for quick access and offline features.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white text-sm h-8 px-3"
            >
              <Download className="h-3 w-3 mr-1" />
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="text-sm h-8 px-3 border-gray-300"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}