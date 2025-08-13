const store = new Map<string, { v: any; exp: number }>();

export function getCache(key: string): any {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.exp < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.v;
}

export function setCache(key: string, value: any, ttlSeconds: number = 30): void {
  store.set(key, { v: value, exp: Date.now() + ttlSeconds * 1000 });
}