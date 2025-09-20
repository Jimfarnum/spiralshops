import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface BreadcrumbItem {
  name: string;
  item: string;
  position: number;
}

export default function BreadcrumbSchema() {
  const [location] = useLocation();

  useEffect(() => {
    const pathSegments = location.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        name: 'Home',
        item: 'https://spiralshops.com',
        position: 1
      }
    ];

    // Build breadcrumb trail based on current path
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Convert common paths to user-friendly names
      const pathNames: Record<string, string> = {
        'products': 'Products',
        'stores': 'Stores', 
        'malls': 'Malls',
        'retailer-dashboard': 'Retailer Dashboard',
        'retailer-onboarding': 'Join as Retailer',
        'spirals': 'Loyalty Program',
        'about': 'About',
        'cart': 'Shopping Cart',
        'checkout': 'Checkout',
        'account': 'My Account',
        'wishlist': 'Wishlist',
        'near-me': 'Near Me',
        'visual-search': 'Visual Search',
        'ai-agents': 'AI Assistants'
      };

      if (pathNames[segment]) {
        name = pathNames[segment];
      }

      breadcrumbs.push({
        name,
        item: `https://spiralshops.com${currentPath}`,
        position: index + 2
      });
    });

    // Create or update breadcrumb structured data
    let breadcrumbScript = document.querySelector('script[data-type="breadcrumb"]');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.setAttribute('type', 'application/ld+json');
      breadcrumbScript.setAttribute('data-type', 'breadcrumb');
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map(crumb => ({
        "@type": "ListItem",
        "position": crumb.position,
        "name": crumb.name,
        "item": crumb.item
      }))
    };

    breadcrumbScript.textContent = JSON.stringify(breadcrumbData);

  }, [location]);

  return null;
}