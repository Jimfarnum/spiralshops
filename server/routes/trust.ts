import { Router } from "express";
import { getTrustSnapshot } from "../utils/trust.js";
const router = Router();
router.get("/public", (_req, res) => res.json(getTrustSnapshot()));
export default router;