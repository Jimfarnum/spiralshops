import type { Request, Response, NextFunction } from "express";

export function requestTimer() {
  return function(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();
    res.on("finish", () => {
      const ns = Number(process.hrtime.bigint() - start);
      const ms = Math.round(ns / 1e6);
      // minimal console metric; replace with real sink (Sentry/OTEL)
      console.log(JSON.stringify({ t:"req", m:req.method, p:req.path, s:res.statusCode, ms }));
    });
    next();
  }
}