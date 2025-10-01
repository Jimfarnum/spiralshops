// ======================================================
// Beta API Routes - For Investor Demos & Testing
// ======================================================

import express from "express";
import { betaConfig } from "../config/beta.js";

const router = express.Router();

// In-memory demo data (resets on server restart)
let betaData = {
  orders: 147,
  salesTotal: 12450,
  spiralsEarned: 89320,
  spiralsRedeemed: 23400,
  platformFees: 622,
  inviteAccepted: 34,
  sharesOnX: 89,
  activeRetailers: 28,
  pickupRate: 35,
  sessions: [],
  invites: [],
  shares: []
};

// ======================================================
// Beta Dashboard Data
// ======================================================
router.get("/dashboard", (req, res) => {
  res.json({
    ok: true,
    data: betaData,
    mode: "beta",
    timestamp: Date.now()
  });
});

// ======================================================
// Beta Dashboard Reset
// ======================================================
router.post("/dashboard/reset", (req, res) => {
  // Reset to initial demo values
  betaData = {
    orders: 0,
    salesTotal: 0,
    spiralsEarned: 0,
    spiralsRedeemed: 0,
    platformFees: 0,
    inviteAccepted: 0,
    sharesOnX: 0,
    activeRetailers: 8, // Keep some retailers active
    pickupRate: 0,
    sessions: [],
    invites: [],
    shares: []
  };
  
  res.json({
    ok: true,
    message: "Beta dashboard reset successfully",
    data: betaData
  });
});

// ======================================================
// Simulated Checkout
// ======================================================
router.post("/checkout", (req, res) => {
  const { lines, logistics, applySpirals } = req.body;
  
  if (!lines || !Array.isArray(lines)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid checkout data"
    });
  }
  
  const subtotal = lines.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const spiralsValue = (applySpirals || 0) / 100;
  const afterSpirals = Math.max(0, subtotal - spiralsValue);
  const platformFee = +(afterSpirals * 0.05).toFixed(2);
  const total = +(afterSpirals + platformFee).toFixed(2);
  const spiralsEarned = Math.round(afterSpirals * 100);
  
  // Update beta data
  betaData.orders += 1;
  betaData.salesTotal += total;
  betaData.platformFees += platformFee;
  betaData.spiralsEarned += spiralsEarned;
  betaData.spiralsRedeemed += (applySpirals || 0);
  
  // Update pickup rate if pickup method selected
  if (logistics === "pickup_mall" || logistics === "pickup_retailer") {
    betaData.pickupRate = Math.min(100, betaData.pickupRate + 2);
  }
  
  // Generate pickup special if applicable
  let pickupSpecial = null;
  if (logistics === "pickup_mall" || logistics === "pickup_retailer") {
    const specials = [
      "Free coffee with pickup!",
      "10% off next in-store purchase",
      "Buy 2, get 1 free on select items",
      "Free gift wrapping available",
      "Exclusive early access to new arrivals"
    ];
    pickupSpecial = specials[Math.floor(Math.random() * specials.length)];
  }
  
  res.json({
    ok: true,
    orderId: `BETA-${Date.now()}`,
    summary: {
      subtotal,
      spiralsRedeemed: applySpirals || 0,
      platformFee,
      total,
      spiralsEarned
    },
    logistics,
    pickupSpecial,
    message: "Order simulation completed successfully"
  });
});

// ======================================================
// Simulated Charge
// ======================================================
router.post("/charge/simulate", (req, res) => {
  const { items, applySpirals } = req.body;
  
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid charge data"
    });
  }
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const spiralsValue = (applySpirals || 0) / 100;
  const afterSpirals = Math.max(0, subtotal - spiralsValue);
  const platformFee = +(afterSpirals * 0.05).toFixed(2);
  const total = +(afterSpirals + platformFee).toFixed(2);
  
  res.json({
    ok: true,
    simulation: true,
    charge: {
      amount: total,
      currency: "usd",
      status: "succeeded"
    },
    totals: {
      subtotal,
      spiralsValue,
      platformFee,
      total
    }
  });
});

// ======================================================
// Share Compose
// ======================================================
router.post("/share/compose", (req, res) => {
  const { productUrl, productName } = req.body;
  
  const templates = [
    `Just found an amazing ${productName || 'product'} on SPIRAL! 🛍️ Supporting local retailers has never been easier. Check it out: ${productUrl || 'https://spiralshops.com'} #SpiralShops #ShopLocal`,
    `Love this ${productName || 'find'} from a local retailer on SPIRAL! 🏪 ${productUrl || 'https://spiralshops.com'} #LocalBusiness #SpiralShops`,
    `Discovered something great on SPIRAL - the platform connecting shoppers with real local stores! ${productUrl || 'https://spiralshops.com'} #SpiralShops #SupportLocal`,
  ];
  
  const composed = templates[Math.floor(Math.random() * templates.length)];
  
  // Track share for analytics
  betaData.sharesOnX += 1;
  
  res.json({
    ok: true,
    composed,
    platform: "x"
  });
});

// ======================================================
// Invite System
// ======================================================
router.post("/invite", (req, res) => {
  const { inviterId, context } = req.body;
  
  if (!inviterId) {
    return res.status(400).json({
      ok: false,
      error: "inviterId required"
    });
  }
  
  const inviteCode = `SPIRAL${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  const invite = {
    code: inviteCode,
    inviterId,
    context: context || "general",
    timestamp: Date.now(),
    status: "sent"
  };
  
  betaData.invites.push(invite);
  
  // Simulate some acceptance rate
  if (Math.random() > 0.7) { // 30% acceptance rate simulation
    betaData.inviteAccepted += 1;
  }
  
  res.json({
    ok: true,
    inviteCode,
    message: "Invite sent (simulated)",
    bonusSpirals: 50
  });
});

// ======================================================
// Accept Invite
// ======================================================
router.post("/invite/accept", (req, res) => {
  const { inviteCode, newUserId } = req.body;
  
  if (!inviteCode) {
    return res.status(400).json({
      ok: false,
      error: "inviteCode required"
    });
  }
  
  // Find invite
  const invite = betaData.invites.find(inv => inv.code === inviteCode);
  
  if (!invite) {
    return res.status(404).json({
      ok: false,
      error: "Invalid invite code"
    });
  }
  
  // Update analytics
  betaData.inviteAccepted += 1;
  
  res.json({
    ok: true,
    message: "Invite accepted successfully",
    bonusSpirals: {
      inviter: 50,
      invitee: 25
    }
  });
});

// ======================================================
// Demo SPIRALs Balance (for beta testing)
// ======================================================
router.get("/spirals/balance", (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({
      ok: false,
      error: "userId query parameter required"
    });
  }
  
  // Demo balance data
  res.json({
    ok: true,
    userId,
    balance: 1250,
    lifetimeEarned: 5000,
    lifetimeRedeemed: 3750,
    recentTransactions: [
      { type: "earn", amount: 100, date: "2025-09-15", source: "Purchase at Local Cafe" },
      { type: "redeem", amount: 50, date: "2025-09-14", source: "Applied to checkout" },
      { type: "earn", amount: 75, date: "2025-09-13", source: "Pickup bonus" }
    ]
  });
});

// ======================================================
// Demo SPIRALs Earn (for beta testing)  
// ======================================================
router.post("/spirals/earn", (req, res) => {
  const { userId, amount, source } = req.body;
  
  if (!userId || !amount) {
    return res.status(400).json({
      ok: false,
      error: "userId and amount required"
    });
  }
  
  res.json({
    ok: true,
    userId,
    earned: amount,
    source: source || "demo",
    newBalance: 1250 + amount,
    message: "SPIRALs earned successfully"
  });
});

// ======================================================
// Demo SPIRALs Redeem (for beta testing)
// ======================================================
router.post("/spirals/redeem", (req, res) => {
  const { userId, amount, purpose } = req.body;
  
  if (!userId || !amount) {
    return res.status(400).json({
      ok: false,
      error: "userId and amount required"
    });
  }
  
  if (amount > 1250) {
    return res.status(400).json({
      ok: false,
      error: "Insufficient SPIRALs balance"
    });
  }
  
  res.json({
    ok: true,
    userId,
    redeemed: amount,
    purpose: purpose || "checkout",
    newBalance: 1250 - amount,
    valueInDollars: (amount / 100).toFixed(2),
    message: "SPIRALs redeemed successfully"
  });
});

// ======================================================
// Beta Stats (for internal monitoring)
// ======================================================
router.get("/stats", (req, res) => {
  res.json({
    ok: true,
    mode: "beta",
    uptime: process.uptime(),
    data: betaData,
    config: {
      simulateCharges: betaConfig.simulateCharges,
      stripeMode: betaConfig.stripeMode,
      features: betaConfig.features
    }
  });
});

export default router;