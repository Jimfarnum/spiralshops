import helmet from "helmet";
import compression from "compression";
import type { Express } from "express";

export function applySecurityExtras(app: Express) {
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "'unsafe-inline'"], // tighten when CSP nonces in place
        "connect-src": ["'self'", "https:"]
      }
    }
  }) as any);
  app.use(compression());
}