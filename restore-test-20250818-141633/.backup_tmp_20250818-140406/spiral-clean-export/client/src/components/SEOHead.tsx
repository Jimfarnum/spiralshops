import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEOHead({ 
  title = "Shop Local & Earn Rewards | SPIRAL",
  description = "Discover local stores, earn SPIRAL rewards, and support your community. Connect with amazing local businesses while earning loyalty points.",
  keywords = "local shopping, rewards program, community commerce, local businesses, SPIRAL points, loyalty program",
  image = "/spiral-logo.png",
  url = "https://spiralshops.com"
}: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    document.title = title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'SPIRAL' }
    ];
    
    ogTags.forEach(tag => {
      let existingTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!existingTag) {
        existingTag = document.createElement('meta');
        existingTag.setAttribute('property', tag.property);
        document.head.appendChild(existingTag);
      }
      existingTag.setAttribute('content', tag.content);
    });
    
    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];
    
    twitterTags.forEach(tag => {
      let existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!existingTag) {
        existingTag = document.createElement('meta');
        existingTag.setAttribute('name', tag.name);
        document.head.appendChild(existingTag);
      }
      existingTag.setAttribute('content', tag.content);
    });
    
    // Structured data for LocalBusiness
    let schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SPIRAL",
      "url": "https://spiralshops.com",
      "logo": "https://spiralshops.com/spiral-logo.png",
      "description": description,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-SPIRAL",
        "contactType": "Customer Support",
        "email": "support@spiralshops.com"
      },
      "sameAs": [
        "https://facebook.com/spiralshops",
        "https://twitter.com/spiralshops",
        "https://instagram.com/spiralshops"
      ]
    };
    
    schemaScript.textContent = JSON.stringify(structuredData);
    
  }, [title, description, keywords, image, url]);

  return null;
}