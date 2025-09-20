// SPIRAL Security Middleware - Comprehensive SSL and Domain Management
import { detectEnvironment, getSSLConfig, validateDomain, DOMAIN_CONFIG } from '../config/domains.js';

export function configureSecurityHeaders(app) {
  // Domain validation and redirection middleware
  app.use((req, res, next) => {
    const hostname = req.get('host') || req.hostname;
    const environment = detectEnvironment(hostname);
    const sslConfig = getSSLConfig(environment);
    
    // Force HTTPS in production and staging
    if (sslConfig.requireSSL && req.header('x-forwarded-proto') !== 'https' && !req.secure) {
      return res.redirect(301, `https://${hostname}${req.url}`);
    }
    
    // Canonical domain redirect for production
    if (environment === 'production' && hostname !== DOMAIN_CONFIG.production.primary) {
      const canonicalUrl = `https://${DOMAIN_CONFIG.production.primary}${req.url}`;
      return res.redirect(301, canonicalUrl);
    }
    
    next();
  });

  // Environment-specific security headers
  app.use((req, res, next) => {
    const hostname = req.get('host') || req.hostname;
    const environment = detectEnvironment(hostname);
    const sslConfig = getSSLConfig(environment);
    
    // Content Security Policy - adapted for environment
    let cspPolicy = "default-src 'self'; ";
    cspPolicy += "style-src 'self' 'unsafe-inline' fonts.googleapis.com; ";
    cspPolicy += "font-src 'self' fonts.gstatic.com; ";
    cspPolicy += "img-src 'self' data: blob: https:; ";
    
    // Development allows more permissive script sources
    if (environment === 'development') {
      cspPolicy += "script-src 'self' 'unsafe-inline' 'unsafe-eval'; ";
      cspPolicy += "connect-src 'self' ws: wss: http: https:; ";
    } else {
      cspPolicy += "script-src 'self' 'unsafe-inline' https://js.stripe.com; ";
      cspPolicy += "connect-src 'self' https://api.stripe.com wss: ws:; ";
    }
    
    cspPolicy += "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; ";
    cspPolicy += "object-src 'none'; base-uri 'self'; form-action 'self';";
    
    res.setHeader('Content-Security-Policy', cspPolicy);
    
    // HSTS only for HTTPS environments
    if (sslConfig.hsts) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    
    // Standard security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Environment indicator (for debugging)
    if (environment === 'development' || environment === 'staging') {
      res.setHeader('X-SPIRAL-Environment', environment);
    }
    
    next();
  });
  
  // Configure helmet once it's installed
  try {
    const helmet = require('helmet');
    app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "*.googleapis.com", "*.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["'self'", "ws:", "wss:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
    }));
  } catch (error) {
    console.log('⚠️ Helmet not available, using basic security headers');
  }

  // CORS configuration for secure cross-origin requests
  app.use((req, res, next) => {
    const allowedOrigins = [
      // Development origins
      ...(process.env.NODE_ENV === 'development' ? [
        'http://localhost:3000',
        'http://localhost:5000'
      ] : []),
      // Production/staging origins
      'https://*.replit.app',
      'https://*.repl.co',
      'https://www.spiralshops.com',
      'https://spiralshops.com'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    })) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Token, X-Investor-Token');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}