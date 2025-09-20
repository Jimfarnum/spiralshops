import { Request, Response, NextFunction } from 'express';

const buckets = new Map<string, { count: number; reset: number }>();

export function createRateLimit(maxPerWindow: number = 60, windowMs: number = 60000) {
  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for']?.toString()?.split(',')[0]?.trim() || 
               req.socket.remoteAddress || 
               'unknown';
    const bucketKey = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();
    const b = buckets.get(bucketKey);

    if (!b || b.reset <= now) {
      buckets.set(bucketKey, { count: 1, reset: now + windowMs });
      res.setHeader('X-RateLimit-Limit', String(maxPerWindow));
      res.setHeader('X-RateLimit-Remaining', String(maxPerWindow - 1));
      return next();
    }

    if (b.count >= maxPerWindow) {
      const retry = Math.max(0, Math.ceil((b.reset - now) / 1000));
      res.setHeader('Retry-After', String(retry));
      return res.status(429).json({ 
        error: 'rate_limited', 
        retry_after_seconds: retry 
      });
    }

    b.count++;
    res.setHeader('X-RateLimit-Limit', String(maxPerWindow));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxPerWindow - b.count)));
    next();
  };
}