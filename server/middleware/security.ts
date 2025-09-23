// =============================================================================
// SECURITY MIDDLEWARE - Authentication & Rate Limiting for AI Endpoints
// =============================================================================

import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configuration for different endpoint types
export const aiEndpointLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Maximum 5 AI generation requests per hour per IP
  message: {
    error: 'Too many AI generation requests',
    message: 'Maximum 5 requests per hour allowed for AI image generation',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const previewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 preview requests per 15 minutes per IP
  message: {
    error: 'Too many preview requests',
    message: 'Maximum 10 preview requests per 15 minutes allowed',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminRefreshLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Maximum 3 refresh requests per day per IP
  message: {
    error: 'Too many refresh requests',
    message: 'Maximum 3 refresh requests per day allowed',
    retryAfter: 86400
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin authentication middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const adminToken = req.headers['x-admin-token'] || 
                    req.headers['authorization']?.replace('Bearer ', '');
  
  const expectedToken = process.env.ADMIN_PASS || 
                       process.env.STAFF_TOKEN || 
                       process.env.ADMIN_SECRET;
  
  // Ensure admin token is configured
  if (!expectedToken) {
    console.error('❌ ADMIN_PASS, STAFF_TOKEN, or ADMIN_SECRET not configured');
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'Admin authentication not properly configured' 
    });
  }
  
  // Validate admin token
  if (!adminToken || adminToken !== expectedToken) {
    console.warn(`🚨 Unauthorized AI endpoint access attempt from IP: ${req.ip}`);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Admin authentication required for AI operations' 
    });
  }
  
  console.log(`✅ Admin authenticated for AI operation from IP: ${req.ip}`);
  next();
}

// Cost protection middleware - tracks and limits OpenAI spending
let dailyRequestCount = 0;
let lastResetDate = new Date().toDateString();

export function costProtection(req: Request, res: Response, next: NextFunction) {
  const currentDate = new Date().toDateString();
  
  // Reset daily counter if new day
  if (currentDate !== lastResetDate) {
    dailyRequestCount = 0;
    lastResetDate = currentDate;
  }
  
  // Check daily limit (conservative limit to prevent cost overruns)
  const DAILY_LIMIT = parseInt(process.env.AI_DAILY_LIMIT || '50');
  
  if (dailyRequestCount >= DAILY_LIMIT) {
    console.warn(`💰 Daily AI request limit (${DAILY_LIMIT}) exceeded from IP: ${req.ip}`);
    return res.status(429).json({
      error: 'Daily AI limit exceeded',
      message: `Daily limit of ${DAILY_LIMIT} AI requests has been reached`,
      retryAfter: 86400
    });
  }
  
  // Increment counter and proceed
  dailyRequestCount++;
  console.log(`💰 AI request ${dailyRequestCount}/${DAILY_LIMIT} for today`);
  next();
}

// Logging middleware for AI operations
export function aiOperationLogger(operation: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    console.log(`🎨 Starting ${operation} operation from IP: ${req.ip}`);
    
    // Log when response finishes
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const status = res.statusCode;
      console.log(`🎨 ${operation} completed: ${status} (${duration}ms)`);
    });
    
    next();
  };
}