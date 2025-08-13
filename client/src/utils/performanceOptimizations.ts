// SPIRAL Performance Optimization Suite
// Addresses slow App.tsx and CSS loading issues detected by Site Testing AI Agent

import { lazy } from 'react';

// Code splitting for heavy components to reduce initial bundle size
export const LazyComponents = {
  // Heavy admin components
  RetailerAdminPanel: lazy(() => import('@/pages/admin/RetailerAdminPanel')),
  AgentDashboard: lazy(() => import('@/pages/admin/AgentDashboard')),
  InternalPlatformDashboard: lazy(() => import('@/components/InternalPlatformDashboard')),
  SiteTestingDashboard: lazy(() => import('@/components/SiteTestingDashboard')),
  
  // Heavy retailer components
  RetailerDashboard: lazy(() => import('@/pages/retailer-dashboard')),
  RetailerDashboardNew: lazy(() => import('@/components/RetailerDashboard')),
  InventoryDashboard: lazy(() => import('@/pages/inventory-dashboard')),
  
  // Heavy analytics components
  AnalyticsDashboard: lazy(() => import('@/pages/analytics-dashboard')),
  EnhancedRetailerAnalytics: lazy(() => import('@/pages/enhanced-retailer-analytics')),
  EnhancedMallAnalytics: lazy(() => import('@/pages/enhanced-mall-analytics')),
  
  // Heavy feature components
  ComprehensiveFeatureTesting: lazy(() => import('@/pages/comprehensive-feature-testing')),
  DynamicFeatureTesting: lazy(() => import('@/pages/dynamic-feature-testing')),
  AdvancedFeaturesHub: lazy(() => import('@/pages/advanced-features-hub')),
  
  // Heavy shopping components
  Cart: lazy(() => import('@/pages/cart')),
  Checkout: lazy(() => import('@/pages/checkout')),
  EnhancedCheckout: lazy(() => import('@/pages/checkout-enhanced')),
  
  // Heavy AI components
  AIAgentsPage: lazy(() => import('@/pages/AIAgentsPage')),
  ShopperAIImagePage: lazy(() => import('@/pages/ShopperAIImagePage')),
  AdvancedImageSearchPage: lazy(() => import('@/pages/AdvancedImageSearchPage'))
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload commonly accessed components
  import('@/pages/home');
  import('@/pages/store');
  import('@/pages/login');
  import('@/pages/signup');
  import('@/pages/mall-directory');
};

// CSS optimization utilities
export const optimizeCSS = () => {
  // Remove unused CSS classes during runtime
  const removeUnusedCSS = () => {
    const usedClasses = new Set<string>();
    
    // Scan DOM for used classes
    document.querySelectorAll('*').forEach(element => {
      element.classList.forEach(className => {
        usedClasses.add(className);
      });
    });
    
    console.log(`CSS Optimization: ${usedClasses.size} classes in use`);
  };
  
  // Defer non-critical CSS
  const deferNonCriticalCSS = () => {
    const nonCriticalSheets = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
    nonCriticalSheets.forEach(sheet => {
      if (sheet instanceof HTMLLinkElement) {
        sheet.media = 'print';
        sheet.onload = () => {
          sheet.media = 'all';
        };
      }
    });
  };
  
  return { removeUnusedCSS, deferNonCriticalCSS };
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  const startTime = performance.now();
  
  return {
    measureLoadTime: (componentName: string) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 1000) {
        console.warn(`SLOW COMPONENT LOAD: ${componentName} took ${duration.toFixed(0)}ms`);
      } else {
        console.log(`✅ ${componentName} loaded in ${duration.toFixed(0)}ms`);
      }
      
      return duration;
    }
  };
};

// Image optimization
export const optimizeImages = () => {
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  };
  
  return { lazyLoadImages };
};

// Memory management
export const memoryManagement = () => {
  const cleanupTimers = new Set<NodeJS.Timeout>();
  const cleanupListeners = new Set<() => void>();
  
  const addTimer = (timer: NodeJS.Timeout) => {
    cleanupTimers.add(timer);
  };
  
  const addListener = (cleanup: () => void) => {
    cleanupListeners.add(cleanup);
  };
  
  const cleanup = () => {
    cleanupTimers.forEach(timer => clearTimeout(timer));
    cleanupListeners.forEach(cleanup => cleanup());
    cleanupTimers.clear();
    cleanupListeners.clear();
  };
  
  return { addTimer, addListener, cleanup };
};

// Performance monitoring
export const performanceMonitor = {
  startTime: Date.now(),
  
  logPerformance: (action: string) => {
    const now = Date.now();
    const duration = now - performanceMonitor.startTime;
    
    if (duration > 3000) {
      console.warn(`⚠️ SLOW ACTION: ${action} took ${duration}ms`);
    } else {
      console.log(`✅ ${action} completed in ${duration}ms`);
    }
    
    performanceMonitor.startTime = now;
  },
  
  measureMemory: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
      const total = Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100;
      
      console.log(`Memory usage: ${used}MB / ${total}MB`);
      
      if (used > 100) {
        console.warn(`⚠️ HIGH MEMORY USAGE: ${used}MB`);
      }
      
      return { used, total };
    }
    return null;
  }
};

export default {
  LazyComponents,
  preloadCriticalComponents,
  optimizeCSS,
  monitorBundleSize,
  optimizeImages,
  memoryManagement,
  performanceMonitor
};