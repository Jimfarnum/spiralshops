import { Router } from "express";
import { FLAGS } from "../config/flags.js";
const router = Router();
router.get("/", (_req, res) => res.json(FLAGS));
export default router;