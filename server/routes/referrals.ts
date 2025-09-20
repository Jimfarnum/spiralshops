import { Router } from "express";
import z from "zod";
import { randomUUID } from "crypto";
import ReferralCode from "../models/ReferralCode.js";
import LoyaltyEvent from "../models/LoyaltyEvent.js";

const router = Router();
const mustAuth = (req:any,res:any,next:any)=> req.user? next() : res.status(401).json({error:"Unauthorized"});

// Create a code for current user
router.post("/create", mustAuth, async (req:any,res) => {
  const code = "SPRL-" + randomUUID().split("-")[0].toUpperCase();
  const doc = await ReferralCode.create({
    code, ownerUserId: req.user._id, role: req.user.role || "shopper", rewardSpirals: 50
  });
  res.json({ ok:true, code: doc.code });
});

// Redeem a code
const RedeemBody = z.object({ code: z.string().min(6) });
router.post("/redeem", mustAuth, async (req:any,res) => {
  const p = RedeemBody.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });
  const ref = await ReferralCode.findOne({ code: p.data.code, status:"active" });
  if (!ref) return res.status(404).json({ error: "Invalid or used code" });
  ref.status = "redeemed"; ref.redeemedByUserId = req.user._id; ref.redeemedAt = new Date();
  await ref.save();
  // Reward both parties (configurable)
  await LoyaltyEvent.create([
    { userId: ref.ownerUserId, type:"invite", spirals: ref.rewardSpirals, meta:{ code: ref.code } },
    { userId: req.user._id,    type:"invite", spirals: ref.rewardSpirals, meta:{ code: ref.code } }
  ]);
  res.json({ ok:true });
});

// My codes
router.get("/mine", mustAuth, async (req:any,res) => {
  const rows = await ReferralCode.find({ ownerUserId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(rows);
});

export default router;