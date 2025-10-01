// SPIRAL Platform Analytics Integration

export interface SPIRALEvent {
  action: string;
  category: 'shopping' | 'social' | 'loyalty' | 'navigation' | 'retailer';
  value?: number;
  label?: string;
  spiralData?: {
    userId?: string;
    spiralPoints?: number;
    storeId?: string;
    productId?: string;
  };
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    twq?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, data?: any) => void;
      page: () => void;
    };
  }
}

export class SPIRALAnalytics {
  private static instance: SPIRALAnalytics;
  private initialized = false;

  static getInstance(): SPIRALAnalytics {
    if (!SPIRALAnalytics.instance) {
      SPIRALAnalytics.instance = new SPIRALAnalytics();
    }
    return SPIRALAnalytics.instance;
  }

  initialize() {
    if (this.initialized) return;
    
    console.log('🔧 Initializing SPIRAL Analytics...');
    
    // Track page views automatically
    this.trackPageView();
    
    this.initialized = true;
    console.log('✅ SPIRAL Analytics initialized');
  }

  trackEvent(event: SPIRALEvent) {
    const { action, category, value, label, spiralData } = event;
    
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        custom_parameter_1: spiralData?.userId || '',
        custom_parameter_2: spiralData?.spiralPoints?.toString() || '',
        custom_parameter_3: spiralData?.storeId || '',
        custom_parameter_4: spiralData?.productId || ''
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'CustomEvent', {
        action,
        category,
        value,
        spiral_user_id: spiralData?.userId,
        spiral_points: spiralData?.spiralPoints
      });
    }

    // Twitter Pixel
    if (window.twq) {
      window.twq('track', 'CustomEvent', {
        action,
        category,
        value
      });
    }

    // TikTok Pixel
    if (window.ttq) {
      window.ttq.track('CustomEvent', {
        action,
        category,
        value
      });
    }

    console.log(`📊 SPIRAL Event: ${category}/${action}`, event);
  }

  trackPageView(path?: string) {
    const currentPath = path || window.location.pathname;
    const pageTitle = document.title;
    
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: currentPath
      });
    }

    // Facebook Pixel (with proper initialization check)
    if (window.fbq && typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'PageView');
      } catch (error) {
        // Silently handle uninitialized pixel
      }
    }

    // TikTok Pixel
    if (window.ttq) {
      window.ttq.page();
    }

    console.log(`📄 SPIRAL Page View: ${currentPath}`);
  }

  trackPurchase(value: number, currency = 'USD', orderId?: string) {
    this.trackEvent({
      action: 'purchase',
      category: 'shopping',
      value,
      label: `Order ${orderId}`,
      spiralData: {
        spiralPoints: Math.floor(value * 0.05) // 5% back in SPIRAL points
      }
    });

    // Enhanced e-commerce tracking
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        value,
        currency
      });
    }

    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value,
        currency
      });
    }
  }

  trackSPIRALEarned(points: number, source: string) {
    this.trackEvent({
      action: 'spiral_earned',
      category: 'loyalty',
      value: points,
      label: source,
      spiralData: {
        spiralPoints: points
      }
    });
  }

  trackStoreView(storeId: string, storeName: string) {
    this.trackEvent({
      action: 'store_view',
      category: 'shopping',
      label: storeName,
      spiralData: {
        storeId
      }
    });
  }

  trackSocialShare(platform: string, content: string) {
    this.trackEvent({
      action: 'social_share',
      category: 'social',
      label: `${platform}: ${content}`
    });
  }
}

// Export singleton instance
export const spiralAnalytics = SPIRALAnalytics.getInstance();