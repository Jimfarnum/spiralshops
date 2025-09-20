/**
 * SPIRAL Memory Management System
 * Handles memory optimization, garbage collection, and storage efficiency
 */

interface MemoryConfig {
  maxHeapSize: number;
  gcInterval: number;
  cacheSize: number;
  cleanup: {
    enabled: boolean;
    interval: number;
    threshold: number;
  };
}

class SpiralMemoryManager {
  private config: MemoryConfig;
  private cleanupInterval?: NodeJS.Timeout;
  private lastCleanup: number = 0;
  private memoryAlerts: boolean = false;

  constructor() {
    this.config = {
      maxHeapSize: 4096, // 4GB max heap
      gcInterval: 30000, // 30 seconds
      cacheSize: 100, // Max cache entries
      cleanup: {
        enabled: true,
        interval: 60000, // 1 minute
        threshold: 1024 * 1024 * 1024 // 1GB threshold
      }
    };

    this.initialize();
  }

  private initialize() {
    // Set Node.js memory limits
    if (!process.env.NODE_OPTIONS?.includes('--max-old-space-size')) {
      process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --max-old-space-size=${this.config.maxHeapSize}`.trim();
    }

    // Start automatic cleanup if enabled
    if (this.config.cleanup.enabled) {
      this.startAutomaticCleanup();
    }

    console.log('🧠 SPIRAL Memory Manager initialized');
  }

  getCurrentMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024),
      arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024)
    };
  }

  forceGarbageCollection(): boolean {
    try {
      if (global.gc) {
        global.gc();
        console.log('🧹 Manual garbage collection triggered');
        return true;
      } else {
        console.warn('⚠️ Garbage collection not available (run with --expose-gc)');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Garbage collection failed:', error.message);
      return false;
    }
  }

  checkMemoryPressure(): { status: 'low' | 'medium' | 'high'; shouldCleanup: boolean } {
    const usage = this.getCurrentMemoryUsage();
    const heapUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;

    if (usage.heapUsed > 2048) { // Over 2GB
      return { status: 'high', shouldCleanup: true };
    } else if (usage.heapUsed > 1024) { // Over 1GB
      return { status: 'medium', shouldCleanup: heapUsagePercent > 80 };
    } else {
      return { status: 'low', shouldCleanup: false };
    }
  }

  performEmergencyCleanup(): boolean {
    console.log('🚨 Emergency memory cleanup initiated...');
    
    try {
      // Clear any global caches
      if (global.spiralCache) {
        global.spiralCache = {};
      }

      // Force garbage collection
      const gcSuccess = this.forceGarbageCollection();
      
      // Wait a bit for GC to complete
      setTimeout(() => {
        const newUsage = this.getCurrentMemoryUsage();
        console.log(`🧹 Emergency cleanup complete. Memory: ${newUsage.heapUsed}MB`);
      }, 100);

      this.lastCleanup = Date.now();
      return gcSuccess;
    } catch (error: any) {
      console.error('❌ Emergency cleanup failed:', error.message);
      return false;
    }
  }

  private startAutomaticCleanup() {
    this.cleanupInterval = setInterval(() => {
      const pressure = this.checkMemoryPressure();
      
      if (pressure.shouldCleanup) {
        console.log(`🔧 Automatic cleanup triggered (${pressure.status} pressure)`);
        this.performEmergencyCleanup();
      }
    }, this.config.cleanup.interval);

    console.log('🔄 Automatic memory cleanup started');
  }

  getMemoryReport() {
    const usage = this.getCurrentMemoryUsage();
    const pressure = this.checkMemoryPressure();
    
    return {
      current: usage,
      pressure: pressure.status,
      lastCleanup: this.lastCleanup ? new Date(this.lastCleanup).toISOString() : 'Never',
      config: this.config,
      recommendations: this.getMemoryRecommendations(usage, pressure)
    };
  }

  private getMemoryRecommendations(usage: any, pressure: any): string[] {
    const recommendations: string[] = [];

    if (usage.heapUsed > 1024) {
      recommendations.push('Consider reducing data caching');
    }

    if (pressure.status === 'high') {
      recommendations.push('Immediate cleanup recommended');
      recommendations.push('Review large object allocations');
    }

    if (usage.arrayBuffers > 100) {
      recommendations.push('Check for buffer memory leaks');
    }

    return recommendations;
  }

  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      console.log('🛑 Memory manager shutdown');
    }
  }
}

// Create global instance
const spiralMemoryManager = new SpiralMemoryManager();

// Export for use in other modules
export { spiralMemoryManager, SpiralMemoryManager };

// Handle process events
process.on('exit', () => {
  spiralMemoryManager.shutdown();
});

process.on('SIGINT', () => {
  spiralMemoryManager.shutdown();
  process.exit(0);
});

// Extend global for memory manager access
declare global {
  var spiralMemoryManager: SpiralMemoryManager;
  var spiralCache: any;
}

global.spiralMemoryManager = spiralMemoryManager;