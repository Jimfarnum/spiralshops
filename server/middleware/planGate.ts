import type { Request, Response, NextFunction } from "express";

type Plan = "free" | "silver" | "gold";
const order: Plan[] = ["free","silver","gold"];
function meets(plan: Plan, required: Plan) {
  return order.indexOf(plan) >= order.indexOf(required);
}

/** Require retailer + minimum plan; expects retailerContext to have run */
export function requirePlan(min: Plan) {
  return (req: Request, res: Response, next: NextFunction) => {
    const retailer = (req as any).retailer;
    if (!retailer) return res.status(401).json({ error: "Retailer context required" });
    if (!meets(retailer.plan, min)) {
      return res.status(403).json({ error: `Requires ${min} plan`, currentPlan: retailer.plan });
    }
    next();
  };
}