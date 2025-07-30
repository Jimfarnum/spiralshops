import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: string;
  currency?: string;
  brand?: string;
  category?: string;
}

export function SEOHead({
  title = 'SPIRAL - Everything Local. Just for You.',
  description = 'Discover local businesses, earn SPIRAL rewards, and support your community. Shop local stores, find unique products, and connect with businesses near you.',
  keywords = 'local shopping, local businesses, community commerce, SPIRAL rewards, local stores, shopping mall, gift cards, loyalty program',
  image = '/spiral-logo.png',
  url = 'https://spiralshops.com',
  type = 'website',
  price,
  currency = 'USD',
  brand = 'SPIRAL',
  category
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic SEO meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'SPIRAL Local Commerce Platform');
    updateMeta('robots', 'index, follow');
    updateMeta('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', type, true);
    updateMeta('og:url', url, true);
    updateMeta('og:image', image, true);
    updateMeta('og:site_name', 'SPIRAL', true);
    updateMeta('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@SPIRALshops');
    updateMeta('twitter:creator', '@SPIRALshops');

    // Product-specific meta tags
    if (type === 'product' && price) {
      updateMeta('product:price:amount', price, true);
      updateMeta('product:price:currency', currency, true);
      updateMeta('product:brand', brand, true);
      if (category) {
        updateMeta('product:category', category, true);
      }
    }

    // JSON-LD structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : 'WebSite',
      name: title,
      description: description,
      url: url,
      image: image,
      brand: {
        '@type': 'Brand',
        name: brand
      },
      ...(type === 'website' && {
        potentialAction: {
          '@type': 'SearchAction',
          target: `${url}/products?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }),
      ...(type === 'product' && price && {
        offers: {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          availability: 'https://schema.org/InStock'
        }
      })
    };

    // Update or create JSON-LD script
    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(structuredData);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

  }, [title, description, keywords, image, url, type, price, currency, brand, category]);

  return null;
}

// SEO component for product pages
export function ProductSEO({
  productName,
  productDescription,
  price,
  category,
  imageUrl,
  productId
}: {
  productName: string;
  productDescription: string;
  price: string;
  category: string;
  imageUrl: string;
  productId: string;
}) {
  return (
    <SEOHead
      title={`${productName} - ${category} | SPIRAL`}
      description={`${productDescription} Available on SPIRAL. Shop local, earn rewards, support your community.`}
      keywords={`${productName}, ${category}, local shopping, SPIRAL rewards, buy local`}
      image={imageUrl}
      url={`https://spiralshops.com/product/${productId}`}
      type="product"
      price={price}
      category={category}
    />
  );
}

// SEO component for store pages
export function StoreSEO({
  storeName,
  storeDescription,
  location,
  category,
  storeId
}: {
  storeName: string;
  storeDescription: string;
  location: string;
  category: string;
  storeId: string;
}) {
  return (
    <SEOHead
      title={`${storeName} - ${category} in ${location} | SPIRAL`}
      description={`${storeDescription} Located in ${location}. Shop local products, earn SPIRAL rewards, and support your community.`}
      keywords={`${storeName}, ${category}, ${location}, local business, SPIRAL partner, community shopping`}
      url={`https://spiralshops.com/store/${storeId}`}
      type="website"
    />
  );
}

// SEO component for mall pages
export function MallSEO({
  mallName,
  mallDescription,
  location,
  storeCount,
  mallId
}: {
  mallName: string;
  mallDescription: string;
  location: string;
  storeCount: number;
  mallId: string;
}) {
  return (
    <SEOHead
      title={`${mallName} - Shopping Mall in ${location} | SPIRAL`}
      description={`${mallDescription} Features ${storeCount} local stores. Discover unique products, earn SPIRAL rewards, and support local businesses.`}
      keywords={`${mallName}, shopping mall, ${location}, local stores, SPIRAL rewards, community shopping`}
      url={`https://spiralshops.com/mall/${mallId}`}
      type="website"
    />
  );
}