import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Lazy load images
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });

    // Preconnect to important domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.spiralshops.com',
      'https://cdn.spiralshops.com'
    ];

    preconnectDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Add DNS prefetch for external resources
    const dnsPrefetchDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://connect.facebook.net',
      'https://static.ads-twitter.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Highlight active navigation links
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a, header a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });

  }, []);

  return null;
}