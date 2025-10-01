// Advanced SEO utilities for SPIRAL platform
export interface ProductSchemaData {
  name: string;
  description: string;
  price: string;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand: string;
  category: string;
  image: string;
  sku?: string;
  retailer: {
    name: string;
    address?: string;
  };
}

export interface StoreSchemaData {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string[];
  latitude?: number;
  longitude?: number;
}

// Generate Product structured data
export function generateProductSchema(data: ProductSchemaData) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "image": data.image,
    "brand": {
      "@type": "Brand",
      "name": data.brand
    },
    "category": data.category,
    "sku": data.sku,
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": data.currency,
      "availability": `https://schema.org/${data.availability}`,
      "seller": {
        "@type": "LocalBusiness",
        "name": data.retailer.name,
        "address": data.retailer.address
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
}

// Generate LocalBusiness structured data  
export function generateStoreSchema(data: StoreSchemaData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": data.name,
    "description": data.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.address.street,
      "addressLocality": data.address.city,
      "addressRegion": data.address.state,
      "postalCode": data.address.postalCode,
      "addressCountry": data.address.country
    },
    "telephone": data.phone,
    "email": data.email,
    "url": data.website,
    "openingHoursSpecification": data.openingHours?.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "21:00"
    })),
    "geo": data.latitude && data.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": data.latitude,
      "longitude": data.longitude
    } : undefined,
    "priceRange": "$-$$$$",
    "paymentAccepted": ["Cash", "Credit Card", "Apple Pay", "Google Pay"],
    "currenciesAccepted": "USD"
  };
}

// Generate FAQ structured data
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Inject structured data into page
export function injectStructuredData(data: any, id: string) {
  // Remove existing script with same ID
  const existing = document.querySelector(`script[data-schema-id="${id}"]`);
  if (existing) {
    existing.remove();
  }

  // Create new script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema-id', id);
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// SEO performance optimizations
export function optimizeImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading lazy to non-critical images
    if (!img.getAttribute('loading')) {
      const rect = img.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight;
      if (!isAboveFold) {
        img.setAttribute('loading', 'lazy');
      }
    }
    
    // Add alt text if missing
    if (!img.alt && img.src) {
      const filename = img.src.split('/').pop()?.split('.')[0] || '';
      img.alt = filename.replace(/[-_]/g, ' ');
    }
  });
}

// Critical CSS injection for above-the-fold content
export function injectCriticalCSS() {
  const criticalCSS = `
    .hero-section { display: block; }
    .navigation { display: flex; }
    .loading-spinner { animation: spin 1s linear infinite; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
}

// Preload critical resources
export function preloadCriticalResources() {
  const criticalResources = [
    '/spiral-logo.png',
    '/images/hero-banner.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];

  criticalResources.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = href.endsWith('.css') ? 'style' : 'image';
    document.head.appendChild(link);
  });
}