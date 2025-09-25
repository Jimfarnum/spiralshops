// Simplified security configuration for deployment bundle
export function applySecurity(app) {
  // Trust proxy for proper HTTPS handling
  app.set("trust proxy", true);
  
  // Basic security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-SPIRAL-Environment', process.env.NODE_ENV || 'development');
    
    // ✅ Enhanced CORS headers for production-ready API access
    const allowedOrigins = process.env.CORS_ALLOWLIST?.split(',') || ['*'];
    const origin = req.headers.origin;
    
    // Set CORS origin with production flexibility
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    
    // Comprehensive method and header support
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Token, X-SPIRAL-ADMIN, X-API-Key, X-Client-Version');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    
    // 🌐 Production API accessibility headers
    res.setHeader('X-API-Version', '1.0');
    res.setHeader('X-SPIRAL-API', 'public');
    res.setHeader('X-API-Rate-Limit', '1000'); // Indicate rate limits to clients
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  });
}