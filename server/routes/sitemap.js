import express from 'express';
const router = express.Router();

// Generate XML sitemap dynamically
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://spiralshops.com';
    const currentDate = new Date().toISOString();
    
    // Static pages with priority and change frequency
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/stores', priority: '0.9', changefreq: 'daily' },
      { url: '/malls', priority: '0.8', changefreq: 'weekly' },
      { url: '/retailer-onboarding', priority: '0.8', changefreq: 'monthly' },
      { url: '/spirals', priority: '0.7', changefreq: 'weekly' },
      { url: '/about', priority: '0.6', changefreq: 'monthly' },
      { url: '/community', priority: '0.6', changefreq: 'weekly' },
      { url: '/local-first', priority: '0.6', changefreq: 'monthly' },
      { url: '/loyalty-program', priority: '0.7', changefreq: 'weekly' },
      { url: '/near-me', priority: '0.8', changefreq: 'daily' },
      { url: '/visual-search', priority: '0.7', changefreq: 'weekly' },
      { url: '/ai-agents', priority: '0.6', changefreq: 'weekly' },
      { url: '/social-feed', priority: '0.6', changefreq: 'daily' },
      { url: '/social-rewards', priority: '0.6', changefreq: 'weekly' },
      { url: '/legal/terms', priority: '0.3', changefreq: 'yearly' },
      { url: '/legal/privacy', priority: '0.3', changefreq: 'yearly' },
      { url: '/legal/refunds', priority: '0.3', changefreq: 'yearly' },
      { url: '/legal/guarantee', priority: '0.3', changefreq: 'yearly' }
    ];

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add dynamic product pages (sample - in production, fetch from database)
    const sampleProducts = [
      { id: 1, name: 'wireless-bluetooth-headphones', lastmod: currentDate },
      { id: 2, name: 'organic-coffee-beans', lastmod: currentDate },
      { id: 3, name: 'handcrafted-pottery-mug', lastmod: currentDate },
      { id: 4, name: 'vintage-denim-jacket', lastmod: currentDate },
      { id: 5, name: 'artisan-soap-set', lastmod: currentDate }
    ];

    sampleProducts.forEach(product => {
      sitemap += `
  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/images/products/${product.name}.jpg</image:loc>
      <image:title>${product.name.replace(/-/g, ' ')}</image:title>
    </image:image>
  </url>`;
    });

    // Add dynamic store pages (sample - in production, fetch from database)
    const sampleStores = [
      { id: 1, name: 'downtown-electronics', city: 'minneapolis', lastmod: currentDate },
      { id: 2, name: 'artisan-coffee-co', city: 'denver', lastmod: currentDate },
      { id: 3, name: 'vintage-finds', city: 'portland', lastmod: currentDate },
      { id: 4, name: 'local-bookstore', city: 'austin', lastmod: currentDate },
      { id: 5, name: 'craft-brewery', city: 'milwaukee', lastmod: currentDate }
    ];

    sampleStores.forEach(store => {
      sitemap += `
  <url>
    <loc>${baseUrl}/store/${store.id}</loc>
    <lastmod>${store.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${baseUrl}/images/stores/${store.name}.jpg</image:loc>
      <image:title>${store.name.replace(/-/g, ' ')} in ${store.city}</image:title>
    </image:image>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `# SPIRAL Robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://spiralshops.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /spiral-admin-login
Disallow: /retailer-login

# Block cart and checkout for privacy
Disallow: /cart
Disallow: /checkout
Disallow: /account

# Allow all product and store pages
Allow: /products
Allow: /stores
Allow: /product/*
Allow: /store/*
Allow: /mall/*

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: twitterbot
Allow: /

User-agent: linkedinbot
Allow: /`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

export default router;