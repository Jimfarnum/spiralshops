// SPIRAL Performance Optimization Utilities

export function optimizeImages() {
  // Add lazy loading to all images
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
  
  // Add fallback for images that fail to load
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.setAttribute('src', '/images/placeholder.jpg');
    });
  });
}

export function preloadCriticalResources() {
  const criticalResources = [
    '/spiral-logo.png',
    '/images/hero-bg.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else {
      link.as = 'image';
    }
    link.href = resource;
    document.head.appendChild(link);
  });
}

export function highlightActiveNavigation() {
  const currentPath = window.location.pathname;
  
  // Remove existing active classes
  document.querySelectorAll('.active-link').forEach(link => {
    link.classList.remove('active-link');
  });
  
  // Add active class to current page links
  document.querySelectorAll('nav a, header a').forEach(link => {
    const href = link.getAttribute('href') || link.getAttribute('to');
    if (href === currentPath) {
      link.classList.add('active-link');
    }
  });
}

export function initializeSPIRALPerformance() {
  // Run all performance optimizations
  optimizeImages();
  preloadCriticalResources();
  highlightActiveNavigation();
  
  // Monitor page performance
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        console.log('🚀 SPIRAL Performance Metrics:', {
          loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
          domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
          firstPaint: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0),
          firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0)
        });
      }, 0);
    });
  }
  
  console.log('✅ SPIRAL Performance optimization initialized');
}