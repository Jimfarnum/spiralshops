import express from "express";
import webpush from "web-push";
import { db } from "../db.js";
import { pushSubscriptions } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const router = express.Router();

webpush.setVapidDetails(
  "mailto:admin@spiralshops.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

router.post("/subscribe", async (req, res) => {
  try {
    const sub = req.body;
    
    if (!sub || !sub.endpoint) {
      return res.status(400).json({ message: "Invalid subscription" });
    }

    await db.insert(pushSubscriptions).values({
      endpoint: sub.endpoint,
      keys: sub.keys,
      expirationTime: sub.expirationTime || null
    }).onConflictDoNothing();

    res.status(201).json({ message: "Subscribed!" });
  } catch (error) {
    console.error("❌ Subscribe error:", error);
    res.status(500).json({ message: "Failed to subscribe" });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { title, body, url } = req.body;
    const payload = JSON.stringify({ title, body, url });

    const subscriptions = await db.select().from(pushSubscriptions);

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: sub.keys
        }, payload)
      )
    );

    const failedEndpoints = results
      .map((result, index) => (result.status === "rejected" ? subscriptions[index].endpoint : null))
      .filter(Boolean);

    if (failedEndpoints.length > 0) {
      await db.delete(pushSubscriptions).where(sql`endpoint = ANY(${failedEndpoints})`);
    }

    res.json({ sent: results.length, results });
  } catch (error) {
    console.error("❌ Send error:", error);
    res.status(500).json({ message: "Failed to send notifications" });
  }
});

router.get("/status", async (req, res) => {
  try {
    const count = await db.select({ count: sql`count(*)` }).from(pushSubscriptions);
    res.json({
      configured: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
      subscriptions: Number(count[0]?.count || 0),
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY ? process.env.VAPID_PUBLIC_KEY.substring(0, 20) + "..." : "NOT SET"
    });
  } catch (error) {
    console.error("❌ Status error:", error);
    res.status(500).json({ message: "Failed to get status" });
  }
});

export default router;
