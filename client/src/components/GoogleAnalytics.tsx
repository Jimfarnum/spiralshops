import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ 
  measurementId = "G-SPIRAL123456" // Replace with actual GA4 measurement ID
}: GoogleAnalyticsProps) {
  useEffect(() => {
    // Only load GA in production or when measurement ID is provided
    if (process.env.NODE_ENV === 'development' && !measurementId.startsWith('G-')) {
      console.log('🔍 Google Analytics: Using placeholder ID for development');
      return;
    }

    // Load Google Analytics script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gaScript);

    // Initialize GA
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    
    gtag('js', new Date());
    gtag('config', measurementId, {
      // Enhanced measurement for SPIRAL platform
      custom_map: {
        'custom_parameter_1': 'spiral_action',
        'custom_parameter_2': 'spiral_value'
      }
    });

    // Track SPIRAL-specific events
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href
    });

    // Export gtag to window for other components to use
    (window as any).gtag = gtag;

    console.log('✅ Google Analytics initialized for SPIRAL platform');

  }, [measurementId]);

  return null;
}