// Lazy Load Wrapper Component - Optimizes component loading performance
import React, { Suspense, lazy } from 'react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded h-32"></div>,
  minHeight = "auto"
}) => {
  return (
    <Suspense fallback={fallback}>
      <div style={{ minHeight }}>
        {children}
      </div>
    </Suspense>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <LazyLoadWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyLoadWrapper>
  );
};

// Optimized loading skeleton
export const LoadingSkeleton: React.FC<{ height?: string; width?: string }> = ({
  height = "h-32",
  width = "w-full"
}) => (
  <div className={`animate-pulse bg-gray-200 rounded ${height} ${width}`}>
    <div className="flex space-x-4 p-4">
      <div className="rounded-full bg-gray-300 h-12 w-12"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default LazyLoadWrapper;