/**
 * Memory Optimization Middleware for SPIRAL
 * Handles memory management at the request level
 */

import { Request, Response, NextFunction } from 'express';

interface MemoryStats {
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
}

class RequestMemoryTracker {
  private static memoryLog: Array<{
    timestamp: Date;
    endpoint: string;
    memoryBefore: MemoryStats;
    memoryAfter: MemoryStats;
    duration: number;
  }> = [];

  private static readonly MAX_LOG_SIZE = 100;
  private static readonly MEMORY_WARNING_THRESHOLD = 1024 * 1024 * 1024; // 1GB

  static getMemoryStats(): MemoryStats {
    const usage = process.memoryUsage();
    return {
      rss: usage.rss,
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers
    };
  }

  static logMemoryUsage(endpoint: string, memoryBefore: MemoryStats, memoryAfter: MemoryStats, duration: number) {
    const logEntry = {
      timestamp: new Date(),
      endpoint,
      memoryBefore,
      memoryAfter,
      duration
    };

    this.memoryLog.push(logEntry);

    // Keep log size manageable
    if (this.memoryLog.length > this.MAX_LOG_SIZE) {
      this.memoryLog.shift();
    }

    // Check for memory warnings
    if (memoryAfter.heapUsed > this.MEMORY_WARNING_THRESHOLD) {
      console.warn(`⚠️ High memory usage detected: ${Math.round(memoryAfter.heapUsed / 1024 / 1024)}MB after ${endpoint}`);
      
      // Trigger garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('🧹 Triggered garbage collection');
      }
    }
  }

  static getMemoryReport() {
    const currentStats = this.getMemoryStats();
    const recentEntries = this.memoryLog.slice(-10);
    
    return {
      current: {
        rss: Math.round(currentStats.rss / 1024 / 1024) + 'MB',
        heapUsed: Math.round(currentStats.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(currentStats.heapTotal / 1024 / 1024) + 'MB',
        external: Math.round(currentStats.external / 1024 / 1024) + 'MB'
      },
      recentRequests: recentEntries.map(entry => ({
        endpoint: entry.endpoint,
        timestamp: entry.timestamp.toISOString(),
        memoryDelta: Math.round((entry.memoryAfter.heapUsed - entry.memoryBefore.heapUsed) / 1024 / 1024) + 'MB',
        duration: entry.duration + 'ms'
      }))
    };
  }
}

// Memory tracking middleware
export const memoryTrackingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const memoryBefore = RequestMemoryTracker.getMemoryStats();
  
  // Track memory after response
  const originalSend = res.send;
  res.send = function(body) {
    const endTime = Date.now();
    const memoryAfter = RequestMemoryTracker.getMemoryStats();
    const duration = endTime - startTime;
    
    RequestMemoryTracker.logMemoryUsage(
      `${req.method} ${req.path}`,
      memoryBefore,
      memoryAfter,
      duration
    );
    
    return originalSend.call(this, body);
  };
  
  next();
};

// Memory cleanup middleware for long-running requests
export const memoryCleanupMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Clean up after large responses
  res.on('finish', () => {
    const currentUsage = process.memoryUsage();
    const heapUsedMB = Math.round(currentUsage.heapUsed / 1024 / 1024);
    
    // Trigger cleanup for high memory usage
    if (heapUsedMB > 800 && global.gc) {
      setTimeout(() => {
        if (global.gc) {
          global.gc();
          console.log(`🧹 Post-request cleanup: ${req.path} (was ${heapUsedMB}MB)`);
        }
      }, 100);
    }
  });
  
  next();
};

// Request timeout middleware to prevent memory leaks
export const requestTimeoutMiddleware = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        console.warn(`⏰ Request timeout: ${req.method} ${req.path}`);
        res.status(408).json({ 
          success: false, 
          error: 'Request timeout',
          message: 'Request took too long to process'
        });
      }
    }, timeoutMs);
    
    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));
    
    next();
  };
};

// Memory report endpoint
export const getMemoryReport = (req: Request, res: Response) => {
  try {
    const report = RequestMemoryTracker.getMemoryReport();
    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate memory report',
      message: error.message
    });
  }
};

export { RequestMemoryTracker };