import type { Request, Response, NextFunction } from "express";
import { ensureRetailer, getRetailerById } from "../services/retailers.js";

/**
 * Demo retailer context:
 * - Use header X-Retailer-Id or query retailerId
 * - In production, replace with real auth/JWT and tenant resolution
 */
export async function retailerContext(req: Request, res: Response, next: NextFunction) {
  const retailerId = (req.header("X-Retailer-Id") || req.query.retailerId || "").toString().trim();
  if (!retailerId) {
    // allow unauth paths; gates will enforce when needed
    return next();
  }
  const retailer = (await getRetailerById(retailerId)) ?? (await ensureRetailer(retailerId));
  (req as any).retailer = retailer;
  next();
}