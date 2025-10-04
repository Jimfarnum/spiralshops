import express from "express";
const router = express.Router();

// ✅ AI Agents route
router.get("/agents", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Agents endpoint active",
    agents: []
  });
});

// ✅ AI Health route
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI system healthy"
  });
});

export default router;
