// SPIRAL Platform Performance & Crash Prevention System
// Addresses critical bottlenecks identified in production testing

import { Express, Request, Response, NextFunction } from 'express';

// Performance monitoring middleware
export function addPerformanceMiddleware(app: Express) {
  // Response time tracking
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // Log slow requests (>1000ms = critical, >500ms = warning)
      if (duration > 1000) {
        console.warn(`🚨 SLOW REQUEST: ${req.method} ${req.path} took ${duration}ms`);
      } else if (duration > 500) {
        console.warn(`⚠️ SLOW REQUEST: ${req.method} ${req.path} took ${duration}ms`);
      }
    });
    
    next();
  });

  // Memory monitoring
  setInterval(() => {
    const usage = process.memoryUsage();
    const memoryInMB = Math.round(usage.heapUsed / 1024 / 1024);
    
    if (memoryInMB > 500) {
      console.warn(`🚨 HIGH MEMORY USAGE: ${memoryInMB}MB`);
    }
  }, 30000); // Check every 30 seconds
}

// Error handling for crash prevention
export function addErrorHandling(app: Express) {
  // Global error handler
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🚨 CRITICAL ERROR CAUGHT:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // Prevent crash by sending error response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Uncaught exception handler
  process.on('uncaughtException', (error) => {
    console.error('🚨 UNCAUGHT EXCEPTION:', error);
    // Log but don't exit in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  // Unhandled promise rejection handler
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 UNHANDLED PROMISE REJECTION:', reason);
    // Log but don't exit in development
  });
}

// Response caching for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function getCachedResponse(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCachedResponse(key: string, data: any, ttlMs: number = 60000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs
  });
}

// Clear cache every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > value.ttl) {
      cache.delete(key);
    }
  }
}, 300000);

export default {
  addPerformanceMiddleware,
  addErrorHandling,
  getCachedResponse,
  setCachedResponse
};