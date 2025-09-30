import express from "express";
import webpush from "web-push";
import { pool } from "../db.js";

const router = express.Router();

// Configure VAPID details
webpush.setVapidDetails(
  "mailto:admin@spiralshops.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

// Check status
router.get("/status", (req, res) => {
  res.json({ status: "ok", message: "Push notification system active" });
});

// Subscribe endpoint
router.post("/subscribe", async (req, res) => {
  const subscription = req.body;
  try {
    await pool.query(
      "INSERT INTO push_subscriptions (subscription) VALUES ($1) ON CONFLICT DO NOTHING",
      [subscription]
    );
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

// Send endpoint
router.post("/send", async (req, res) => {
  const { title, body, url } = req.body;
  try {
    const { rows } = await pool.query("SELECT subscription FROM push_subscriptions");
    const payload = JSON.stringify({ title, body, url });

    const results = await Promise.allSettled(
      rows.map(row =>
        webpush.sendNotification(row.subscription, payload).catch(err => {
          console.error("Push failed:", err);
        })
      )
    );

    res.json({ message: "Notifications sent", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

export default router;
