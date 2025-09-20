import express from "express";
import { db } from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await db.query.inventory.findMany();
    const formatted = products.map((p: any) => ({
      ...p,
      imageUrl: p.images?.[0] || "/images/default-product.png", // fallback only if missing
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

export default router;