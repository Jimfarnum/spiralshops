import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Monitor page load performance
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigationTiming = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
        const renderTime = navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart;
        
        // Memory usage (if available)
        const memoryUsage = (window.performance as any)?.memory?.usedJSHeapSize;

        setMetrics({
          loadTime,
          renderTime,
          memoryUsage
        });

        // Log performance metrics for development
        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 SPIRAL Performance Metrics:', {
            loadTime: `${(loadTime / 1000).toFixed(2)}s`,
            renderTime: `${(renderTime / 1000).toFixed(2)}s`,
            memoryUsage: memoryUsage ? `${(memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A'
          });
        }
      }
    };

    // Measure on component mount
    setTimeout(measurePerformance, 100);

    // Measure on page load if not already loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  // Web Vitals monitoring
  useEffect(() => {
    const reportWebVitals = (metric: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 ${metric.name}: ${metric.value.toFixed(2)}`);
      }
      // In production, send to analytics service
    };

    // Import web-vitals dynamically for performance
    import('web-vitals').then((webVitals) => {
      webVitals.getCLS(reportWebVitals);
      webVitals.getFID(reportWebVitals);
      webVitals.getFCP(reportWebVitals);
      webVitals.getLCP(reportWebVitals);
      webVitals.getTTFB(reportWebVitals);
    }).catch(() => {
      // web-vitals not available, skip monitoring
    });
  }, []);

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-semibold mb-2">⚡ Performance</div>
      {metrics && (
        <div className="space-y-1">
          <div>Load: {(metrics.loadTime / 1000).toFixed(2)}s</div>
          <div>Render: {(metrics.renderTime / 1000).toFixed(2)}s</div>
          {metrics.memoryUsage && (
            <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
          )}
        </div>
      )}
    </div>
  );
}