// ======================================================
// Share API Routes - Social Media Integration
// ======================================================

import express from "express";

const router = express.Router();

// ======================================================
// Compose Share Text
// ======================================================
router.post("/compose", (req, res) => {
  const { productUrl, productName } = req.body;
  
  const templates = [
    `Just found an amazing ${productName || 'product'} on SPIRAL! 🛍️ Supporting local retailers has never been easier. Check it out: ${productUrl || 'https://spiralshops.com'} #SpiralShops #ShopLocal`,
    `Love this ${productName || 'find'} from a local retailer on SPIRAL! 🏪 ${productUrl || 'https://spiralshops.com'} #LocalBusiness #SpiralShops`,
    `Discovered something great on SPIRAL - the platform connecting shoppers with real local stores! ${productUrl || 'https://spiralshops.com'} #SpiralShops #SupportLocal`,
    `Check out what I found on SPIRAL! Real products from real local stores. ${productUrl || 'https://spiralshops.com'} #ShopLocal #SpiralShops`,
  ];
  
  const composed = templates[Math.floor(Math.random() * templates.length)];
  
  res.json({
    ok: true,
    composed,
    platform: "x",
    hashtags: ["#SpiralShops", "#ShopLocal", "#LocalBusiness"]
  });
});

export default router;