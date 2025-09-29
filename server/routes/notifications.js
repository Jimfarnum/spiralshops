import express from "express";
import webpush from "web-push";

const router = express.Router();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@spiralshops.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  );
}

const subscriptions = new Map();

router.post("/subscribe", async (req, res) => {
  try {
    const subscription = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid subscription object" 
      });
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return res.status(500).json({ 
        success: false, 
        error: "Push notifications not configured. Please set VAPID keys." 
      });
    }

    const subscriptionId = subscription.endpoint;
    subscriptions.set(subscriptionId, subscription);

    console.log("✅ Push notification subscription registered:", subscriptionId.substring(0, 50) + "...");

    res.status(201).json({ 
      success: true, 
      message: "Subscription registered successfully" 
    });
  } catch (error) {
    console.error("❌ Push subscription error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to register subscription" 
    });
  }
});

router.post("/unsubscribe", async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ 
        success: false, 
        error: "Endpoint required" 
      });
    }

    subscriptions.delete(endpoint);

    res.json({ 
      success: true, 
      message: "Unsubscribed successfully" 
    });
  } catch (error) {
    console.error("❌ Unsubscribe error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to unsubscribe" 
    });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { title, body, icon, url } = req.body;

    if (!title || !body) {
      return res.status(400).json({ 
        success: false, 
        error: "Title and body required" 
      });
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return res.status(500).json({ 
        success: false, 
        error: "Push notifications not configured" 
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || "/images/logo-192.png",
      url: url || "/"
    });

    const results = [];
    for (const [endpoint, subscription] of subscriptions) {
      try {
        await webpush.sendNotification(subscription, payload);
        results.push({ endpoint, success: true });
      } catch (error) {
        console.error(`❌ Failed to send to ${endpoint.substring(0, 50)}...`, error.message);
        if (error.statusCode === 410) {
          subscriptions.delete(endpoint);
        }
        results.push({ endpoint, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Sent ${successCount}/${results.length} push notifications`);

    res.json({ 
      success: true, 
      sent: successCount,
      total: results.length,
      results 
    });
  } catch (error) {
    console.error("❌ Send notification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send notifications" 
    });
  }
});

router.get("/status", (req, res) => {
  res.json({
    configured: !!(vapidPublicKey && vapidPrivateKey),
    subscriptions: subscriptions.size,
    vapidPublicKey: vapidPublicKey ? vapidPublicKey.substring(0, 20) + "..." : "NOT SET"
  });
});

export default router;
