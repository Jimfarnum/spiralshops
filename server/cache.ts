// High-performance caching system for competitive Amazon-level response times
const store = new Map<string, { v: any; exp: number }>();
let hitCount = 0;
let missCount = 0;

export function getCache(key: string): any {
  const hit = store.get(key);
  if (!hit) {
    missCount++;
    return null;
  }
  if (hit.exp < Date.now()) {
    store.delete(key);
    missCount++;
    return null;
  }
  hitCount++;
  return hit.v;
}

export function setCache(key: string, value: any, ttlSeconds: number = 30): void {
  store.set(key, { v: value, exp: Date.now() + ttlSeconds * 1000 });
  
  // Auto-cleanup old entries to prevent memory overflow
  if (store.size > 5000) {
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (v.exp < now) {
        store.delete(k);
      }
    }
  }
}

export function getCacheStats() {
  return {
    hitCount,
    missCount,
    hitRate: hitCount / (hitCount + missCount) || 0,
    cacheSize: store.size
  };
}

// Optimized cache functions for specific data types
export function getCachedStores(): any {
  return getCache('stores:all');
}

export function setCachedStores(stores: any): void {
  setCache('stores:all', stores, 300); // 5 minutes
}

export function getCachedRecommendations(userId?: string, context?: string): any {
  const key = `recommendations:${userId || 'guest'}:${context || 'homepage'}`;
  return getCache(key);
}

export function setCachedRecommendations(recommendations: any, userId?: string, context?: string): void {
  const key = `recommendations:${userId || 'guest'}:${context || 'homepage'}`;
  setCache(key, recommendations, 120); // 2 minutes
}

export function flushCache(): void {
  store.clear();
  hitCount = 0;
  missCount = 0;
}