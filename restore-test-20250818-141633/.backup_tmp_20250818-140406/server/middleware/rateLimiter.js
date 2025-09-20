const WINDOW_MS = 60 * 1000;
const LIMIT = parseInt(process.env.RATE_LIMIT_RPM || '60', 10);
const BUCKET = new Map();

export function rateLimiter(req, res, next) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const rec = BUCKET.get(ip) || { count: 0, start: now };
    if (now - rec.start > WINDOW_MS) { rec.count = 0; rec.start = now; }
    rec.count += 1; BUCKET.set(ip, rec);
    if (rec.count > LIMIT) {
      res.status(429).json({ ok: false, error: 'Rate limit exceeded. Try again in a minute.' });
      return;
    }
    next();
  } catch (err) {
    console.error('rateLimiter error', err);
    res.status(500).json({ ok: false, error: 'Rate limiter internal error' });
  }
}