// Optimized Google Analytics Component - Fixes 2.6s loading bottleneck
import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  trackingId?: string;
}

const OptimizedGoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  trackingId = 'GA_SPIRAL_TRACKING_ID' 
}) => {
  useEffect(() => {
    // Lazy load Google Analytics to prevent blocking
    const loadGA = async () => {
      try {
        // Check if GA is already loaded
        if (window.gtag) {
          console.log('✅ Google Analytics already initialized');
          return;
        }

        // Create script element with async loading
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        script.async = true;
        script.defer = true;
        
        // Add to head
        document.head.appendChild(script);
        
        // Initialize gtag after script loads
        script.onload = () => {
          window.dataLayer = window.dataLayer || [];
          function gtag(...args: any[]) {
            window.dataLayer.push(args);
          }
          window.gtag = gtag;
          
          gtag('js', new Date());
          gtag('config', trackingId, {
            page_title: document.title,
            page_location: window.location.href
          });
          
          console.log('✅ Google Analytics initialized for SPIRAL platform');
        };

        script.onerror = () => {
          console.warn('⚠️ Google Analytics failed to load');
        };
        
      } catch (error) {
        console.warn('⚠️ Google Analytics initialization error:', error);
      }
    };

    // Delay loading until page is interactive
    if (document.readyState === 'complete') {
      setTimeout(loadGA, 100);
    } else {
      window.addEventListener('load', () => setTimeout(loadGA, 100));
    }
  }, [trackingId]);

  return null; // No visual component
};

// Type declarations for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default OptimizedGoogleAnalytics;