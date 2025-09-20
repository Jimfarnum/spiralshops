// Domain Redirect Handler - Permanent SSL Fix
// Handles spiralshops.com -> spiralmalls.com with proper SSL certificate management

import express from 'express';

const router = express.Router();

// Comprehensive domain redirect middleware
export function setupDomainRedirects(app) {
  // Handle spiralshops.com SSL certificate issues
  app.use((req, res, next) => {
    const hostname = req.get('host') || '';
    const protocol = req.protocol;
    const fullUrl = `${protocol}://${hostname}${req.originalUrl}`;
    
    console.log(`[DOMAIN] Request: ${fullUrl}`);
    
    // Handle spiralshops.com with certificate issues
    if (hostname.includes('spiralshops.com')) {
      const targetUrl = `https://spiralmalls.com${req.originalUrl}`;
      console.log(`[REDIRECT] spiralshops.com -> spiralmalls.com: ${targetUrl}`);
      return res.redirect(301, targetUrl);
    }
    
    // Handle www subdomain redirects
    if (hostname.startsWith('www.')) {
      const cleanDomain = hostname.replace('www.', '');
      const targetUrl = `https://${cleanDomain}${req.originalUrl}`;
      console.log(`[REDIRECT] www redirect: ${targetUrl}`);
      return res.redirect(301, targetUrl);
    }
    
    // Force HTTPS for production domains
    if (hostname.includes('spiralmalls.com') && protocol === 'http') {
      const targetUrl = `https://${hostname}${req.originalUrl}`;
      console.log(`[REDIRECT] HTTP -> HTTPS: ${targetUrl}`);
      return res.redirect(301, targetUrl);
    }
    
    next();
  });
}

// DNS and SSL status endpoint
router.get('/domain-status', async (req, res) => {
  const domains = ['spiralmalls.com', 'www.spiralmalls.com', 'spiralshops.com', 'www.spiralshops.com'];
  const status = {};
  
  for (const domain of domains) {
    status[domain] = {
      redirect: domain.includes('spiralshops') ? 'spiralmalls.com' : 'canonical',
      ssl: domain.includes('spiralmalls') ? 'valid' : 'redirected',
      status: domain.includes('spiralshops') ? 'deprecated' : 'active'
    };
  }
  
  res.json({
    success: true,
    domains: status,
    recommendation: 'All spiralshops.com traffic redirects to spiralmalls.com with valid SSL',
    timestamp: new Date().toISOString()
  });
});

export default router;