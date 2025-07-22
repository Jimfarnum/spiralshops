import { Express } from "express";
import { db } from "./db";
import { 
  wishlistTrackers, 
  userNotificationPreferences, 
  notificationHistory,
  users,
  insertWishlistTrackerSchema,
  insertUserNotificationPreferencesSchema,
  insertNotificationHistorySchema 
} from "@shared/schema";
import { eq, and, sql, lt, gte } from "drizzle-orm";
import { z } from "zod";

// Mock email service (replace with real service like SendGrid in production)
const sendEmailAlert = async (userEmail: string, productName: string, alertType: string, productPrice?: string) => {
  console.log(`📧 EMAIL ALERT SENT to ${userEmail}:`);
  console.log(`Subject: ${alertType === 'back_in_stock' ? '🔄 Back in Stock' : '💰 Price Drop'} - ${productName}`);
  console.log(`Content: ${alertType === 'back_in_stock' ? 
    `Great news! "${productName}" is back in stock. Order now before it sells out again!` :
    `Price drop alert! "${productName}" is now available for ${productPrice}. Save money today!`
  }`);
  return { success: true, messageId: `mock_${Date.now()}` };
};

// Mock SMS service (replace with Twilio in production)
const sendSMSAlert = async (phoneNumber: string, productName: string, alertType: string) => {
  console.log(`📱 SMS ALERT SENT to ${phoneNumber}:`);
  console.log(`${alertType === 'back_in_stock' ? '🔄 SPIRAL: Back in Stock' : '💰 SPIRAL: Price Drop'} - ${productName}. Check your wishlist now!`);
  return { success: true, messageId: `sms_mock_${Date.now()}` };
};

export function registerWishlistAlertRoutes(app: Express) {
  
  // Get user's notification preferences
  app.get("/api/wishlist-alerts/preferences", async (req, res) => {
    try {
      // Mock user ID for demo - would come from auth middleware
      const userId = 1;
      
      let preferences = await db
        .select()
        .from(userNotificationPreferences)
        .where(eq(userNotificationPreferences.userId, userId))
        .limit(1);

      if (preferences.length === 0) {
        // Create default preferences
        const defaultPrefs = {
          userId,
          emailEnabled: true,
          smsEnabled: false,
          browserEnabled: true,
          alertFrequency: "immediate"
        };
        
        const [newPrefs] = await db
          .insert(userNotificationPreferences)
          .values(defaultPrefs)
          .returning();
        
        preferences = [newPrefs];
      }

      res.json(preferences[0]);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Update user's notification preferences
  app.post("/api/wishlist-alerts/preferences", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      
      const validatedData = insertUserNotificationPreferencesSchema.parse({
        ...req.body,
        userId
      });

      const [updatedPrefs] = await db
        .insert(userNotificationPreferences)
        .values(validatedData)
        .onConflictDoUpdate({
          target: userNotificationPreferences.userId,
          set: {
            emailEnabled: validatedData.emailEnabled,
            smsEnabled: validatedData.smsEnabled,
            browserEnabled: validatedData.browserEnabled,
            alertFrequency: validatedData.alertFrequency,
            updatedAt: new Date(),
          },
        })
        .returning();

      res.json(updatedPrefs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid preferences data", errors: error.errors });
      }
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Add product to wishlist tracking
  app.post("/api/wishlist-alerts/track", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const { productId, originalPrice, alertType } = req.body;

      if (!productId || !originalPrice || !alertType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const trackerData = {
        userId,
        productId: parseInt(productId),
        originalPrice: originalPrice.toString(),
        alertType,
        isActive: true
      };

      const validatedData = insertWishlistTrackerSchema.parse(trackerData);

      const [tracker] = await db
        .insert(wishlistTrackers)
        .values(validatedData)
        .onConflictDoNothing()
        .returning();

      res.json(tracker || { message: "Already tracking this product" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tracker data", errors: error.errors });
      }
      console.error("Error creating wishlist tracker:", error);
      res.status(500).json({ message: "Failed to create tracker" });
    }
  });

  // Remove product from wishlist tracking
  app.delete("/api/wishlist-alerts/track/:productId", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const { productId } = req.params;

      await db
        .update(wishlistTrackers)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(
            eq(wishlistTrackers.userId, userId),
            eq(wishlistTrackers.productId, parseInt(productId))
          )
        );

      res.json({ message: "Tracking disabled for product" });
    } catch (error) {
      console.error("Error removing wishlist tracker:", error);
      res.status(500).json({ message: "Failed to remove tracker" });
    }
  });

  // Get user's active wishlist trackers
  app.get("/api/wishlist-alerts/trackers", async (req, res) => {
    try {
      const userId = 1; // Mock user ID

      const trackers = await db
        .select()
        .from(wishlistTrackers)
        .where(
          and(
            eq(wishlistTrackers.userId, userId),
            eq(wishlistTrackers.isActive, true)
          )
        )
        .orderBy(sql`${wishlistTrackers.createdAt} DESC`);

      res.json(trackers);
    } catch (error) {
      console.error("Error fetching wishlist trackers:", error);
      res.status(500).json({ message: "Failed to fetch trackers" });
    }
  });

  // Manual trigger for testing alerts (simulates inventory/price changes)
  app.post("/api/wishlist-alerts/trigger-test", async (req, res) => {
    try {
      const { productId, alertType } = req.body;

      if (!productId || !alertType) {
        return res.status(400).json({ message: "Missing productId or alertType" });
      }

      // Find active trackers for this product
      const activeTrackers = await db
        .select({
          tracker: wishlistTrackers,
          user: users
        })
        .from(wishlistTrackers)
        .innerJoin(users, eq(wishlistTrackers.userId, users.id))
        .where(
          and(
            eq(wishlistTrackers.productId, parseInt(productId)),
            eq(wishlistTrackers.isActive, true),
            sql`(${wishlistTrackers.alertType} = ${alertType} OR ${wishlistTrackers.alertType} = 'both')`
          )
        );

      if (activeTrackers.length === 0) {
        return res.json({ message: "No active trackers found for this product" });
      }

      const alertResults = [];
      
      for (const { tracker, user } of activeTrackers) {
        // Check if we've alerted recently (prevent spam)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (tracker.lastAlertedAt && tracker.lastAlertedAt > dayAgo) {
          continue; // Skip if alerted within last 24 hours
        }

        // Get user preferences
        const [prefs] = await db
          .select()
          .from(userNotificationPreferences)
          .where(eq(userNotificationPreferences.userId, user.id))
          .limit(1);

        const preferences = prefs || {
          emailEnabled: true,
          smsEnabled: false,
          browserEnabled: true
        };

        // Mock product data (in real app, fetch from products/retailerProducts)
        const productName = `Test Product ${productId}`;
        const productPrice = "$29.99";
        
        // Send notifications based on preferences
        if (preferences.emailEnabled && user.email) {
          try {
            await sendEmailAlert(user.email, productName, alertType, productPrice);
            
            // Log notification history
            await db.insert(notificationHistory).values({
              userId: user.id,
              productId: parseInt(productId),
              notificationType: alertType,
              deliveryMethod: 'email',
              status: 'sent',
              metadata: JSON.stringify({ email: user.email, productName })
            });
            
            alertResults.push(`Email sent to ${user.email}`);
          } catch (error) {
            console.error("Email send failed:", error);
          }
        }

        if (preferences.smsEnabled) {
          try {
            await sendSMSAlert("+1234567890", productName, alertType); // Mock phone
            
            await db.insert(notificationHistory).values({
              userId: user.id,
              productId: parseInt(productId),
              notificationType: alertType,
              deliveryMethod: 'sms',
              status: 'sent',
              metadata: JSON.stringify({ phone: "+1234567890", productName })
            });
            
            alertResults.push(`SMS sent to user ${user.id}`);
          } catch (error) {
            console.error("SMS send failed:", error);
          }
        }

        // Update last alerted timestamp
        await db
          .update(wishlistTrackers)
          .set({ lastAlertedAt: new Date(), updatedAt: new Date() })
          .where(eq(wishlistTrackers.id, tracker.id));
      }

      res.json({
        message: `Test alert triggered for product ${productId}`,
        results: alertResults,
        trackersFound: activeTrackers.length
      });
    } catch (error) {
      console.error("Error triggering test alert:", error);
      res.status(500).json({ message: "Failed to trigger test alert" });
    }
  });

  // Get notification history for user
  app.get("/api/wishlist-alerts/history", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const { limit = 20 } = req.query;

      const history = await db
        .select()
        .from(notificationHistory)
        .where(eq(notificationHistory.userId, userId))
        .orderBy(sql`${notificationHistory.sentAt} DESC`)
        .limit(parseInt(limit as string));

      res.json(history);
    } catch (error) {
      console.error("Error fetching notification history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Admin endpoint to view all pending alerts
  app.get("/api/admin/wishlist-alerts", async (req, res) => {
    try {
      const pendingAlerts = await db
        .select({
          tracker: wishlistTrackers,
          user: users
        })
        .from(wishlistTrackers)
        .innerJoin(users, eq(wishlistTrackers.userId, users.id))
        .where(eq(wishlistTrackers.isActive, true))
        .orderBy(sql`${wishlistTrackers.createdAt} DESC`);

      const alertStats = await db
        .select({
          total: sql<number>`count(*)`,
          stockAlerts: sql<number>`count(*) filter (where alert_type = 'stock' or alert_type = 'both')`,
          priceAlerts: sql<number>`count(*) filter (where alert_type = 'price' or alert_type = 'both')`
        })
        .from(wishlistTrackers)
        .where(eq(wishlistTrackers.isActive, true));

      res.json({
        pendingAlerts,
        stats: alertStats[0]
      });
    } catch (error) {
      console.error("Error fetching admin alert data:", error);
      res.status(500).json({ message: "Failed to fetch admin data" });
    }
  });

  // Admin endpoint to manually send alert to all users tracking a product
  app.post("/api/admin/wishlist-alerts/broadcast", async (req, res) => {
    try {
      const { productId, alertType, message } = req.body;

      if (!productId || !alertType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const results = await db
        .select({
          tracker: wishlistTrackers,
          user: users
        })
        .from(wishlistTrackers)
        .innerJoin(users, eq(wishlistTrackers.userId, users.id))
        .where(
          and(
            eq(wishlistTrackers.productId, parseInt(productId)),
            eq(wishlistTrackers.isActive, true)
          )
        );

      let sentCount = 0;
      for (const { user } of results) {
        if (user.email) {
          await sendEmailAlert(user.email, `Product ${productId}`, alertType);
          sentCount++;
        }
      }

      res.json({
        message: `Broadcast sent to ${sentCount} users`,
        productId,
        alertType
      });
    } catch (error) {
      console.error("Error broadcasting alert:", error);
      res.status(500).json({ message: "Failed to broadcast alert" });
    }
  });
}