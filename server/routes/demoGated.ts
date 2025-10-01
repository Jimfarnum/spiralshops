import { Router } from "express";
import { requirePlan } from "../middleware/planGate.js";

const router = Router();

// Silver-gated feature (e.g., abandoned cart)
router.get("/abandonment-stats", requirePlan("silver"), (req, res) => {
  res.json({ ok: true, note: "Silver+ access", data: { rate: 0.27, recoverable: 12 }});
});

// Gold-gated feature (e.g., priority placement admin)
router.post("/priority-placement", requirePlan("gold"), (req, res) => {
  res.json({ ok: true, note: "Gold-only placement slot reserved" });
});

export default router;