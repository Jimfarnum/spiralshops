// Simple memoization cache for deployment bundle
const cache = new Map();

export function memoize(ttlSeconds = 30) {
  return (req, res, next) => {
    const key = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
    const cached = cache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      return res.type("application/json").json(cached.data);
    }
    
    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, {
        data,
        expires: Date.now() + (ttlSeconds * 1000)
      });
      
      // Cleanup old entries
      if (cache.size > 1000) {
        const now = Date.now();
        for (const [k, v] of cache.entries()) {
          if (v.expires < now) cache.delete(k);
        }
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
}