// Social Media Pixel Tracking Utilities for SPIRAL Platform
// Supports Facebook/Meta, Instagram, X (Twitter), TikTok, and Truth Social

declare global {
  interface Window {
    fbq: any;
    twq: any;
    ttq: any;
    truthSocialConfig: any;
    gtag: any;
  }
}

export interface SocialEventData {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price: number;
  }>;
  content_type?: string;
  currency?: string;
  value?: number;
  num_items?: number;
  search_string?: string;
  user_data?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export class SocialPixelManager {
  // Facebook/Meta Pixel Events
  static trackFacebookEvent(eventName: string, parameters?: SocialEventData): void {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', eventName, parameters);
        console.log(`Facebook pixel tracked: ${eventName}`, parameters);
      } catch (error) {
        console.warn('Facebook pixel tracking failed:', error);
      }
    }
  }

  // X (Twitter) Pixel Events
  static trackTwitterEvent(eventName: string, parameters?: SocialEventData): void {
    if (typeof window !== 'undefined' && window.twq) {
      try {
        window.twq('event', eventName, parameters);
        console.log(`Twitter pixel tracked: ${eventName}`, parameters);
      } catch (error) {
        console.warn('Twitter pixel tracking failed:', error);
      }
    }
  }

  // TikTok Pixel Events
  static trackTikTokEvent(eventName: string, parameters?: SocialEventData): void {
    if (typeof window !== 'undefined' && window.ttq) {
      try {
        window.ttq.track(eventName, parameters);
        console.log(`TikTok pixel tracked: ${eventName}`, parameters);
      } catch (error) {
        console.warn('TikTok pixel tracking failed:', error);
      }
    }
  }

  // Truth Social Custom Tracking
  static trackTruthSocialEvent(action: string, data?: any): void {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', action, {
          'custom_parameter_1': 'truth_social',
          'custom_parameter_2': data || 'interaction',
          'custom_parameter_3': window.location.pathname
        });
        console.log(`Truth Social tracked: ${action}`, data);
      } catch (error) {
        console.warn('Truth Social tracking failed:', error);
      }
    }
  }

  // Universal Event Tracking (All Platforms)
  static trackUniversalEvent(eventName: string, parameters?: SocialEventData): void {
    // Map common events to platform-specific events
    const eventMapping = {
      'page_view': {
        facebook: 'PageView',
        twitter: 'PageView',
        tiktok: 'ViewContent',
        truthsocial: 'page_view'
      },
      'product_view': {
        facebook: 'ViewContent',
        twitter: 'ViewContent', 
        tiktok: 'ViewContent',
        truthsocial: 'product_view'
      },
      'add_to_cart': {
        facebook: 'AddToCart',
        twitter: 'AddToCart',
        tiktok: 'AddToCart',
        truthsocial: 'add_to_cart'
      },
      'purchase': {
        facebook: 'Purchase',
        twitter: 'Purchase',
        tiktok: 'CompletePayment',
        truthsocial: 'purchase'
      },
      'search': {
        facebook: 'Search',
        twitter: 'Search',
        tiktok: 'Search',
        truthsocial: 'search'
      }
    } as const;

    const events = eventMapping[eventName as keyof typeof eventMapping];
    if (events) {
      this.trackFacebookEvent(events.facebook, parameters);
      this.trackTwitterEvent(events.twitter, parameters);
      this.trackTikTokEvent(events.tiktok, parameters);
      this.trackTruthSocialEvent(events.truthsocial, parameters);
    }
  }

  // E-commerce Specific Tracking
  static trackProductView(productId: string, productName: string, category: string, price: number): void {
    const eventData: SocialEventData = {
      content_name: productName,
      content_category: category,
      content_ids: [productId],
      content_type: 'product',
      value: price,
      currency: 'USD'
    };

    this.trackUniversalEvent('product_view', eventData);
  }

  static trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1): void {
    const eventData: SocialEventData = {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: price * quantity,
      currency: 'USD',
      num_items: quantity,
      contents: [{
        id: productId,
        quantity: quantity,
        item_price: price
      }]
    };

    this.trackUniversalEvent('add_to_cart', eventData);
  }

  static trackPurchase(orderId: string, value: number, items: Array<{id: string, quantity: number, price: number}>): void {
    const eventData: SocialEventData = {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      value: value,
      currency: 'USD',
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }))
    };

    this.trackUniversalEvent('purchase', eventData);
  }

  static trackSearch(searchTerm: string): void {
    const eventData: SocialEventData = {
      search_string: searchTerm,
      content_type: 'product'
    };

    this.trackUniversalEvent('search', eventData);
  }

  // Retailer-Specific Events
  static trackRetailerSignup(retailerData: { name: string, category: string }): void {
    const eventData: SocialEventData = {
      content_name: 'Retailer Signup',
      content_category: retailerData.category,
      value: 100, // Estimated retailer lifetime value
      currency: 'USD'
    };

    this.trackFacebookEvent('Lead', eventData);
    this.trackTwitterEvent('SignUp', eventData);
    this.trackTikTokEvent('CompleteRegistration', eventData);
    this.trackTruthSocialEvent('retailer_signup', retailerData);
  }

  // Social Sharing Events
  static trackSocialShare(platform: string, contentType: string, contentId?: string): void {
    const eventData: SocialEventData = {
      content_name: `Share to ${platform}`,
      content_type: contentType,
      content_ids: contentId ? [contentId] : undefined
    };

    this.trackFacebookEvent('Share', eventData);
    this.trackTwitterEvent('Share', eventData);
    this.trackTikTokEvent('Share', eventData);
    this.trackTruthSocialEvent('social_share', { platform, contentType, contentId });
  }
}

// React Hook for Social Pixel Tracking
import { useEffect } from 'react';

export function useSocialPixelTracking(eventName: string, parameters?: SocialEventData, dependencies: any[] = []) {
  useEffect(() => {
    SocialPixelManager.trackUniversalEvent(eventName, parameters);
  }, dependencies);
}

// Page View Tracking Hook
export function usePageViewTracking() {
  useEffect(() => {
    SocialPixelManager.trackUniversalEvent('page_view');
  }, []);
}