// Performance Optimization Hook - UI/UX Performance Enhancement
import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
}

export const usePerformanceOptimization = (componentName: string) => {
  const startTime = useRef(Date.now());
  const renderStartTime = useRef(Date.now());
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0
  });

  // Debounced function creator
  const useDebounce = useCallback((func: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return useCallback((...args: any[]) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => func(...args), delay);
    }, [func, delay]);
  }, []);

  // Throttled function creator
  const useThrottle = useCallback((func: Function, delay: number) => {
    const lastExecuted = useRef(0);
    
    return useCallback((...args: any[]) => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        func(...args);
        lastExecuted.current = now;
      }
    }, [func, delay]);
  }, []);

  // Measure component performance
  const measurePerformance = useCallback(() => {
    const now = Date.now();
    metricsRef.current = {
      loadTime: now - startTime.current,
      renderTime: now - renderStartTime.current,
      interactionTime: 0
    };

    // Log slow components (>100ms)
    if (metricsRef.current.renderTime > 100) {
      console.warn(`⚠️ Slow component render: ${componentName} took ${metricsRef.current.renderTime}ms`);
    }

    return metricsRef.current;
  }, [componentName]);

  // Optimized scroll handler
  const optimizedScroll = useThrottle((callback: Function) => {
    callback();
  }, 16); // 60fps

  // Optimized resize handler
  const optimizedResize = useDebounce((callback: Function) => {
    callback();
  }, 250);

  // Intersection Observer for lazy loading
  const createIntersectionObserver = useCallback((
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ) => {
    const defaultOptions = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    return new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, defaultOptions);
  }, []);

  // Memory leak prevention
  useEffect(() => {
    return () => {
      // Cleanup function to prevent memory leaks
      if (metricsRef.current.renderTime > 1000) {
        console.warn(`🚨 Memory leak potential: ${componentName} had ${metricsRef.current.renderTime}ms render time`);
      }
    };
  }, [componentName]);

  // Performance monitoring
  useEffect(() => {
    renderStartTime.current = Date.now();
    
    // Measure initial render
    const timeoutId = setTimeout(() => {
      measurePerformance();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [measurePerformance]);

  return {
    measurePerformance,
    optimizedScroll,
    optimizedResize,
    createIntersectionObserver,
    useDebounce,
    useThrottle,
    metrics: metricsRef.current
  };
};

// React Query optimization settings
export const optimizedQueryConfig = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  },
  mutations: {
    retry: 1
  }
};

// Image optimization helper
export const optimizeImageLoad = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}) => {
  const { width = 800, height = 400, quality = 75 } = options;
  
  // Create optimized image URL (placeholder for actual CDN integration)
  return `${src}?w=${width}&h=${height}&q=${quality}&auto=format,compress`;
};

export default usePerformanceOptimization;