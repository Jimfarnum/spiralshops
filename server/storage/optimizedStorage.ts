/**
 * Memory-Optimized Storage System for SPIRAL
 * Implements efficient caching and memory management
 */

import { LRUCache } from 'lru-cache';
import { spiralMemoryManager } from '../utils/memoryManager.js';

interface CacheConfig {
  maxSize: number;
  maxAge: number;
  updateAgeOnGet: boolean;
  dispose?: (value: any, key: string) => void;
}

class OptimizedStorage {
  private cache: LRUCache<string, any>;
  private persistentData: Map<string, any>;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  constructor(config?: Partial<CacheConfig>) {
    const defaultConfig: CacheConfig = {
      maxSize: 1000,
      maxAge: 1000 * 60 * 15, // 15 minutes
      updateAgeOnGet: true,
      dispose: (value, key) => {
        console.log(`🗑️ Cache item disposed: ${key}`);
      }
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.cache = new LRUCache({
      max: finalConfig.maxSize,
      ttl: finalConfig.maxAge,
      updateAgeOnGet: finalConfig.updateAgeOnGet,
      dispose: finalConfig.dispose
    });

    this.persistentData = new Map();
    console.log('💾 Optimized Storage initialized');
  }

  // Cache operations
  set(key: string, value: any, persistent: boolean = false): boolean {
    try {
      // Check memory pressure before caching large objects
      const pressure = spiralMemoryManager.checkMemoryPressure();
      
      if (pressure.status === 'high' && this.isLargeObject(value)) {
        console.warn(`⚠️ Skipping cache for large object due to memory pressure: ${key}`);
        if (persistent) {
          this.persistentData.set(key, value);
        }
        return false;
      }

      if (persistent) {
        this.persistentData.set(key, value);
      }
      
      this.cache.set(key, value);
      return true;
    } catch (error: any) {
      console.error(`❌ Storage set error for key ${key}:`, error.message);
      return false;
    }
  }

  get(key: string): any {
    try {
      // Try cache first
      let value = this.cache.get(key);
      
      if (value !== undefined) {
        this.cacheHits++;
        return value;
      }

      // Try persistent storage
      value = this.persistentData.get(key);
      if (value !== undefined) {
        // Re-cache if memory allows
        const pressure = spiralMemoryManager.checkMemoryPressure();
        if (pressure.status !== 'high') {
          this.cache.set(key, value);
        }
        this.cacheMisses++;
        return value;
      }

      this.cacheMisses++;
      return undefined;
    } catch (error: any) {
      console.error(`❌ Storage get error for key ${key}:`, error.message);
      return undefined;
    }
  }

  delete(key: string): boolean {
    try {
      const cacheDeleted = this.cache.delete(key);
      const persistentDeleted = this.persistentData.delete(key);
      return cacheDeleted || persistentDeleted;
    } catch (error: any) {
      console.error(`❌ Storage delete error for key ${key}:`, error.message);
      return false;
    }
  }

  has(key: string): boolean {
    return this.cache.has(key) || this.persistentData.has(key);
  }

  // Memory management
  private isLargeObject(obj: any): boolean {
    try {
      const jsonString = JSON.stringify(obj);
      return jsonString.length > 50000; // > 50KB
    } catch {
      return true; // Assume large if can't serialize
    }
  }

  cleanup(): void {
    console.log('🧹 Storage cleanup initiated...');
    
    const beforeSize = this.cache.size;
    this.cache.clear();
    
    // Keep only recent persistent data
    const cutoff = Date.now() - (1000 * 60 * 60); // 1 hour
    for (const [key, value] of this.persistentData.entries()) {
      if (value.timestamp && value.timestamp < cutoff) {
        this.persistentData.delete(key);
      }
    }
    
    console.log(`🧹 Storage cleanup complete. Cleared ${beforeSize} cache items`);
  }

  getStats() {
    return {
      cache: {
        size: this.cache.size,
        maxSize: this.cache.max,
        hits: this.cacheHits,
        misses: this.cacheMisses,
        hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
      },
      persistent: {
        size: this.persistentData.size
      },
      memory: spiralMemoryManager.getCurrentMemoryUsage()
    };
  }

  // Bulk operations for efficiency
  setMany(entries: Array<[string, any]>, persistent: boolean = false): number {
    let successCount = 0;
    
    for (const [key, value] of entries) {
      if (this.set(key, value, persistent)) {
        successCount++;
      }
    }
    
    return successCount;
  }

  getMany(keys: string[]): Map<string, any> {
    const results = new Map();
    
    for (const key of keys) {
      const value = this.get(key);
      if (value !== undefined) {
        results.set(key, value);
      }
    }
    
    return results;
  }
}

// Create optimized storage instances for different use cases
export const productStorage = new OptimizedStorage({
  maxSize: 500,
  maxAge: 1000 * 60 * 30, // 30 minutes for products
});

export const userStorage = new OptimizedStorage({
  maxSize: 200,
  maxAge: 1000 * 60 * 60, // 1 hour for user data
});

export const generalStorage = new OptimizedStorage({
  maxSize: 300,
  maxAge: 1000 * 60 * 15, // 15 minutes for general data
});

export { OptimizedStorage };