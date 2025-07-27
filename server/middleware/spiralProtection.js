// SPIRAL Unified Protection System
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

// SPIRAL Admin Configuration
const SPIRAL_ADMIN_CONFIG = {
  // Change these credentials for production
  adminPassphrase: 'SPIRAL_ADMIN_2025',
  adminCode: 'SP1RAL_S3CUR3',
  sessionSecret: process.env.SESSION_SECRET || 'spiral-admin-secret-key-2025',
  tokenExpiry: '24h'
};

// Protected route patterns - ONLY admin routes, not public platform
const PROTECTED_ROUTES = [
  '/api/admin',
  '/api/analytics/internal',
  '/api/system',
  '/api/debug'
];

// Sensitive API endpoints that require enhanced protection
const SENSITIVE_APIS = [
  '/api/users',
  '/api/orders',
  '/api/reviews',
  '/api/gift-cards',
  '/api/spiral-wallet',
  '/api/payment',
  '/api/subscription'
];

/**
 * Rate limiting for different endpoint types
 */
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true, // Fix for Replit environment
    skip: (req) => {
      // Skip rate limiting for admin users
      return req.isAdmin === true;
    }
  });
};

// Rate limiters
export const generalApiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many API requests, please try again later'
);

export const sensitiveApiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20, // 20 requests per window
  'Too many sensitive API requests, please try again later'
);

export const adminApiLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  10, // 10 requests per window
  'Too many admin API requests, please try again later'
);

/**
 * SPIRAL Admin Authentication Middleware
 */
export const spiralAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.cookies?.spiralAdminToken ||
                req.session?.spiralAdminToken;

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. SPIRAL Admin authentication required.',
      loginRequired: true 
    });
  }

  try {
    const decoded = jwt.verify(token, SPIRAL_ADMIN_CONFIG.sessionSecret);
    
    if (decoded.role !== 'spiral_admin') {
      return res.status(403).json({ 
        error: 'Insufficient privileges. SPIRAL Admin access required.' 
      });
    }

    req.admin = decoded;
    req.isAdmin = true;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid or expired admin token. Please re-authenticate.',
      loginRequired: true 
    });
  }
};

/**
 * Route Protection Middleware
 */
export const protectSensitiveRoutes = (req, res, next) => {
  const path = req.path;
  
  // Check if route requires admin protection
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route));
  
  if (isProtectedRoute) {
    return spiralAdminAuth(req, res, next);
  }

  // Check if it's a sensitive API requiring enhanced protection
  const isSensitiveApi = SENSITIVE_APIS.some(api => path.startsWith(api));
  
  if (isSensitiveApi) {
    // Apply rate limiting
    return sensitiveApiLimiter(req, res, next);
  }

  next();
};

/**
 * Admin Login Handler
 */
export const handleAdminLogin = async (req, res) => {
  try {
    const { passphrase, code, method } = req.body;

    let isValidAuth = false;

    if (method === 'passphrase' && passphrase === SPIRAL_ADMIN_CONFIG.adminPassphrase) {
      isValidAuth = true;
    } else if (method === 'code' && code === SPIRAL_ADMIN_CONFIG.adminCode) {
      isValidAuth = true;
    }

    if (!isValidAuth) {
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.status(401).json({ 
        error: 'Invalid authentication credentials' 
      });
    }

    // Generate admin token
    const adminToken = jwt.sign(
      { 
        role: 'spiral_admin',
        loginTime: new Date().toISOString(),
        method: method
      },
      SPIRAL_ADMIN_CONFIG.sessionSecret,
      { expiresIn: SPIRAL_ADMIN_CONFIG.tokenExpiry }
    );

    // Set secure cookie
    res.cookie('spiralAdminToken', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Store in session as backup
    req.session.spiralAdminToken = adminToken;

    res.json({ 
      success: true,
      message: 'SPIRAL Admin authentication successful',
      token: adminToken,
      expiresIn: SPIRAL_ADMIN_CONFIG.tokenExpiry
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Authentication system error' });
  }
};

/**
 * Admin Logout Handler
 */
export const handleAdminLogout = (req, res) => {
  // Clear cookie
  res.clearCookie('spiralAdminToken');
  
  // Clear session
  if (req.session) {
    delete req.session.spiralAdminToken;
  }

  res.json({ 
    success: true,
    message: 'SPIRAL Admin logged out successfully' 
  });
};

/**
 * Verify Admin Status
 */
export const verifyAdminStatus = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.cookies?.spiralAdminToken ||
                req.session?.spiralAdminToken;

  if (!token) {
    return res.json({ isAdmin: false, authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, SPIRAL_ADMIN_CONFIG.sessionSecret);
    
    if (decoded.role === 'spiral_admin') {
      return res.json({ 
        isAdmin: true, 
        authenticated: true,
        loginTime: decoded.loginTime,
        method: decoded.method
      });
    }
  } catch (error) {
    // Token invalid or expired
  }

  res.json({ isAdmin: false, authenticated: false });
};

/**
 * API Request Logging Middleware
 */
export const apiRequestLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(body) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log sensitive API access
    const isSensitive = SENSITIVE_APIS.some(api => req.path.startsWith(api));
    const isProtected = PROTECTED_ROUTES.some(route => req.path.startsWith(route));
    
    if (isSensitive || isProtected) {
      console.log(`[SPIRAL SECURITY] ${req.method} ${req.path} | Status: ${res.statusCode} | Duration: ${duration}ms | IP: ${req.ip} | Admin: ${req.isAdmin || false}`);
    }

    originalSend.call(this, body);
  };

  next();
};

/**
 * Input Sanitization Middleware
 */
export const sanitizeInput = (req, res, next) => {
  // Basic XSS protection
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  };

  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * CORS Protection for Admin Routes
 */
export const adminCorsProtection = (req, res, next) => {
  // Only allow admin routes from same origin in production
  if (process.env.NODE_ENV === 'production') {
    const origin = req.get('Origin');
    const host = req.get('Host');
    
    if (origin && !origin.includes(host)) {
      return res.status(403).json({ 
        error: 'Cross-origin admin requests not allowed' 
      });
    }
  }

  next();
};

export default {
  spiralAdminAuth,
  protectSensitiveRoutes,
  handleAdminLogin,
  handleAdminLogout,
  verifyAdminStatus,
  apiRequestLogger,
  sanitizeInput,
  adminCorsProtection,
  generalApiLimiter,
  sensitiveApiLimiter,
  adminApiLimiter
};