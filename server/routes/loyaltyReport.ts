import { Router } from "express";
import LoyaltyEvent from "../models/LoyaltyEvent.js";
const router = Router();

// Retailer view: aggregate events by type for last 30 days
router.get("/retailer/:retailerId/summary", async (req, res) => {
  const { retailerId } = req.params;
  const since = new Date(Date.now() - 30*24*60*60*1000);
  const agg = await LoyaltyEvent.aggregate([
    { $match: { retailerId, createdAt: { $gte: since } } },
    { $group: { _id: "$type", total: { $sum: "$spirals" }, events: { $sum: 1 } } }
  ]);
  res.json({ retailerId, since, summary: agg });
});

// User view: last 90 days
router.get("/user/:userId/history", async (req, res) => {
  const { userId } = req.params;
  const since = new Date(Date.now() - 90*24*60*60*1000);
  const rows = await LoyaltyEvent.find({ userId, createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(200);
  res.json({ userId, since, events: rows });
});

export default router;