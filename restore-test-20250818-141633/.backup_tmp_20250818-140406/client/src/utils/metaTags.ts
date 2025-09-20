// SEO Meta Tags Configuration for SPIRAL Platform
// This utility manages page-specific meta tags for optimal SEO and social sharing

export interface MetaTagsConfig {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  keywords?: string;
}

export const META_TAGS: Record<string, MetaTagsConfig> = {
  // Homepage
  '/': {
    title: 'SPIRAL – The Local Shopping Platform',
    description: 'Shop real local stores across the U.S. from one platform. Support brick-and-mortar businesses with SPIRAL.',
    ogTitle: 'SPIRAL – The Local Shopping Platform',
    ogDescription: 'Connecting shoppers with real local retailers across the U.S. via a powerful online + in-store platform.',
    ogUrl: 'https://spiralshops.com',
    ogImage: 'https://spiralshops.com/images/social-preview.jpg',
    twitterTitle: 'SPIRAL – The Local Shopping Platform',
    twitterDescription: 'Shop real stores locally and online. SPIRAL makes local shopping smarter.',
    twitterImage: 'https://spiralshops.com/images/social-preview.jpg',
    keywords: 'local shopping, spiralshops, spiral, online shopping, shop local, brick and mortar, U.S. retailers'
  },

  // Products Page
  '/products': {
    title: 'Shop Products | SPIRAL',
    description: 'Browse thousands of products from local stores you know and trust on SPIRAL.',
    ogTitle: 'Shop Products | SPIRAL',
    ogDescription: 'Browse thousands of products from local stores you know and trust on SPIRAL.',
    ogUrl: 'https://spiralshops.com/products',
    ogImage: 'https://spiralshops.com/images/social-preview.jpg',
    twitterTitle: 'Shop Products | SPIRAL',
    twitterDescription: 'Browse thousands of products from local stores you know and trust.',
    twitterImage: 'https://spiralshops.com/images/social-preview.jpg',
    keywords: 'products, local products, shop online, local retailers, spiral products'
  },

  // Stores Directory
  '/stores': {
    title: 'Local Stores Directory | SPIRAL',
    description: 'Find and explore local stores near you. Connect with real brick-and-mortar retailers across the U.S.',
    ogTitle: 'Local Stores Directory | SPIRAL',
    ogDescription: 'Find and explore local stores near you. Connect with real brick-and-mortar retailers across the U.S.',
    ogUrl: 'https://spiralshops.com/stores',
    ogImage: 'https://spiralshops.com/images/social-preview.jpg',
    twitterTitle: 'Local Stores Directory | SPIRAL',
    twitterDescription: 'Find and explore local stores near you.',
    twitterImage: 'https://spiralshops.com/images/social-preview.jpg',
    keywords: 'local stores, store directory, brick and mortar, local retailers, find stores'
  },

  // Retailer Dashboard
  '/retailer-dashboard': {
    title: 'Retailer Dashboard | SPIRAL',
    description: 'Manage your store inventory, track sales, and grow your business with SPIRAL\'s comprehensive retailer tools.',
    ogTitle: 'Retailer Dashboard | SPIRAL',
    ogDescription: 'Manage your store inventory, track sales, and grow your business with SPIRAL\'s comprehensive retailer tools.',
    ogUrl: 'https://spiralshops.com/retailer-dashboard',
    ogImage: 'https://spiralshops.com/images/social-preview.jpg',
    twitterTitle: 'Retailer Dashboard | SPIRAL',
    twitterDescription: 'Manage your store inventory and grow your business.',
    twitterImage: 'https://spiralshops.com/images/social-preview.jpg',
    keywords: 'retailer dashboard, inventory management, business tools, retail analytics'
  },

  // AI Retailer Signup
  '/ai-retailer-signup': {
    title: 'Join SPIRAL - Retailer Onboarding | SPIRAL',
    description: 'Get your store online in minutes with our AI-powered retailer onboarding. Join thousands of local retailers on SPIRAL.',
    ogTitle: 'Join SPIRAL - Retailer Onboarding | SPIRAL',
    ogDescription: 'Get your store online in minutes with our AI-powered retailer onboarding.',
    ogUrl: 'https://spiralshops.com/ai-retailer-signup',
    ogImage: 'https://spiralshops.com/assets/spiral-onboarding-og.jpg',
    twitterTitle: 'Join SPIRAL - Retailer Onboarding',
    twitterDescription: 'Get your store online in minutes with AI-powered onboarding.',
    twitterImage: 'https://spiralshops.com/assets/spiral-onboarding-og.jpg',
    keywords: 'retailer signup, AI onboarding, join spiral, retail platform, online store'
  },

  // Mall Directory
  '/mall-directory': {
    title: 'Mall Directory | SPIRAL',
    description: 'Explore shopping centers and malls across the U.S. Find stores, events, and special offers in your area.',
    ogTitle: 'Mall Directory | SPIRAL',
    ogDescription: 'Explore shopping centers and malls across the U.S. Find stores, events, and special offers.',
    ogUrl: 'https://spiralshops.com/mall-directory',
    ogImage: 'https://spiralshops.com/assets/spiral-malls-og.jpg',
    twitterTitle: 'Mall Directory | SPIRAL',
    twitterDescription: 'Explore shopping centers and malls across the U.S.',
    twitterImage: 'https://spiralshops.com/assets/spiral-malls-og.jpg',
    keywords: 'mall directory, shopping centers, malls, local shopping, retail centers'
  },

  // SPIRAL Loyalty Program
  '/spirals': {
    title: 'SPIRAL Loyalty Program | Earn Rewards',
    description: 'Earn SPIRAL points with every purchase. Redeem for exclusive rewards and discounts at participating local stores.',
    ogTitle: 'SPIRAL Loyalty Program | Earn Rewards',
    ogDescription: 'Earn SPIRAL points with every purchase. Redeem for exclusive rewards and discounts.',
    ogUrl: 'https://spiralshops.com/spirals',
    ogImage: 'https://spiralshops.com/assets/spiral-loyalty-og.jpg',
    twitterTitle: 'SPIRAL Loyalty Program',
    twitterDescription: 'Earn points and redeem for exclusive rewards.',
    twitterImage: 'https://spiralshops.com/assets/spiral-loyalty-og.jpg',
    keywords: 'loyalty program, rewards, points, spiral points, discounts, local shopping rewards'
  }
};

// Function to update document meta tags dynamically
export function updateMetaTags(path: string): void {
  const config = META_TAGS[path];
  if (!config) return;

  // Update title
  document.title = config.title;

  // Update meta tags
  updateMetaTag('description', config.description);
  if (config.keywords) {
    updateMetaTag('keywords', config.keywords);
  }

  // Update Open Graph tags
  updateMetaProperty('og:title', config.ogTitle);
  updateMetaProperty('og:description', config.ogDescription);
  updateMetaProperty('og:url', config.ogUrl);
  updateMetaProperty('og:image', config.ogImage);

  // Update Twitter tags
  updateMetaTag('twitter:title', config.twitterTitle);
  updateMetaTag('twitter:description', config.twitterDescription);
  updateMetaTag('twitter:image', config.twitterImage);
}

function updateMetaTag(name: string, content: string): void {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string): void {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Hook for React Router integration
export function useMetaTags(path: string): void {
  React.useEffect(() => {
    updateMetaTags(path);
  }, [path]);
}

import React from 'react';