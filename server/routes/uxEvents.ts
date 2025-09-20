import { Router } from "express";
import z from "zod";

const router = Router();
const Body = z.object({
  event: z.string(),
  userId: z.string().optional(),
  role: z.enum(["shopper","retailer","mall","guest"]).default("guest"),
  meta: z.record(z.any()).optional()
});

router.post("/", (req, res) => {
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  // For now: log to stdout; swap with analytics pipeline
  console.log(JSON.stringify({ t:"ux", ...parsed.data, at: new Date().toISOString() }));
  res.json({ ok:true });
});

export default router;