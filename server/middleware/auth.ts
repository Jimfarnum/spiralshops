import type { Request, Response, NextFunction } from 'express';
import type { Role, UserAuth } from '../types/common.js';

// Replace this stub with your real JWT/session verification
export function mockAuth(req: Request, res: Response, next: NextFunction){
  // SECURITY: Only allow mock auth in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Authentication required. Mock auth disabled in production.' });
  }
  
  // If already set by real middleware, respect it:
  if ((req as any).user) return next();
  // TEMP: allow retailerId/mallId via query for testing in dev only
  const role = (req.query.role as string) as Role | undefined;
  const retailerId = req.query.retailerId as string | undefined;
  const mallId = req.query.mallId as string | undefined;
  (req as any).user = { userId:'demo-user', role: role || 'shopper', retailerId, mallId } satisfies UserAuth;
  next();
}

export function requireRole(...roles: Role[]){
  return (req: any, res: any, next: any) => {
    const u = req.user as UserAuth|undefined;
    if (!u) return res.status(401).json({ error:'unauthorized' });
    if (!roles.includes(u.role)) return res.status(403).json({ error:'forbidden' });
    next();
  };
}