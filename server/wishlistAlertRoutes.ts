import type { Express } from "express";
import { storage } from "./storage";
import { notificationEngine } from "./notificationEngine";
import { z } from "zod";

export function registerWishlistAlertRoutes(app: Express) {
  
  // Create or update wishlist alert
  app.post("/api/wishlist/alerts", async (req, res) => {
    try {
      const alertSchema = z.object({
        productId: z.number(),
        productName: z.string(),
        currentPrice: z.number().optional(),
        targetPrice: z.number().optional(),
        alertType: z.enum(['stock', 'price', 'promo']),
        notificationMethods: z.array(z.enum(['email', 'sms', 'push'])).default(['email'])
      });

      const validatedData = alertSchema.parse(req.body);
      const userId = 1; // Mock user ID

      // In a real implementation, this would save to the database
      // For demo purposes, we simulate saving the alert
      const alertId = Math.floor(Math.random() * 1000) + 1;

      console.log(`✅ Wishlist alert created:`, {
        id: alertId,
        userId,
        ...validatedData
      });

      res.json({
        id: alertId,
        userId,
        ...validatedData,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error creating wishlist alert:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  // Get user's active wishlist alerts
  app.get("/api/wishlist/alerts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // In a real implementation, this would query the database
      // For demo purposes, return mock alerts
      const mockAlerts = [
        {
          id: 1,
          userId,
          productId: 101,
          productName: "Artisan Coffee Blend - Local Roasters",
          currentPrice: 3499, // $34.99
          targetPrice: 2500, // Alert when under $25.00
          alertType: 'price',
          notificationMethods: ['email', 'push'],
          isActive: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          userId,
          productId: 102,
          productName: "Handmade Ceramic Vase - Garden Studio",
          currentPrice: 4599, // $45.99
          targetPrice: null,
          alertType: 'stock',
          notificationMethods: ['email', 'sms'],
          isActive: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          userId,
          productId: 103,
          productName: "Organic Honey Set - Valley Bee Farm",
          currentPrice: 1899, // $18.99
          targetPrice: 1500, // Alert when under $15.00
          alertType: 'price',
          notificationMethods: ['email'],
          isActive: false,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      res.json(mockAlerts);
    } catch (error) {
      console.error("Error fetching wishlist alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Update alert preferences
  app.put("/api/wishlist/alerts/:alertId", async (req, res) => {
    try {
      const alertId = parseInt(req.params.alertId);
      
      if (isNaN(alertId)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }

      const updateSchema = z.object({
        targetPrice: z.number().optional(),
        notificationMethods: z.array(z.enum(['email', 'sms', 'push'])).optional(),
        isActive: z.boolean().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      // In a real implementation, this would update the database
      console.log(`📝 Alert ${alertId} updated:`, validatedData);

      res.json({
        id: alertId,
        ...validatedData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating wishlist alert:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // Delete wishlist alert
  app.delete("/api/wishlist/alerts/:alertId", async (req, res) => {
    try {
      const alertId = parseInt(req.params.alertId);
      
      if (isNaN(alertId)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }

      // In a real implementation, this would delete from database
      console.log(`🗑️ Alert ${alertId} deleted`);

      res.json({ message: "Alert deleted successfully" });
    } catch (error) {
      console.error("Error deleting wishlist alert:", error);
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // Send notification (manual trigger)
  app.post("/api/notifications/send", async (req, res) => {
    try {
      const notificationSchema = z.object({
        userId: z.number(),
        productId: z.number(),
        alertType: z.enum(['stock', 'price', 'promo']),
        notificationMethods: z.array(z.enum(['email', 'sms', 'push'])).default(['email'])
      });

      const validatedData = notificationSchema.parse(req.body);

      // Trigger test notification
      const success = await notificationEngine.triggerTestAlert(
        validatedData.productId,
        validatedData.alertType,
        validatedData.userId
      );

      if (success) {
        res.json({ 
          message: "Notification sent successfully",
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({ message: "Failed to send notification" });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  // Get notification history
  app.get("/api/notifications/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const history = notificationEngine.getNotificationHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching notification history:", error);
      res.status(500).json({ message: "Failed to fetch notification history" });
    }
  });

  // Update notification preferences
  app.post("/api/notifications/preferences", async (req, res) => {
    try {
      const preferencesSchema = z.object({
        userId: z.number().default(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        pushToken: z.string().optional(),
        enableEmail: z.boolean().default(true),
        enableSms: z.boolean().default(false),
        enablePush: z.boolean().default(true),
        globalOptOut: z.boolean().default(false)
      });

      const validatedData = preferencesSchema.parse(req.body);

      // In a real implementation, this would update the database
      console.log(`⚙️ Notification preferences updated for user ${validatedData.userId}:`, validatedData);

      res.json({
        ...validatedData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid preferences data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Get notification preferences
  app.get("/api/notifications/preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // In a real implementation, this would query the database
      // For demo purposes, return mock preferences
      const mockPreferences = {
        id: 1,
        userId,
        email: "user@example.com",
        phone: "+15551234567",
        pushToken: "fcm_token_12345",
        enableEmail: true,
        enableSms: false,
        enablePush: true,
        globalOptOut: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json(mockPreferences);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Trigger automated check for product changes (scheduled job endpoint)
  app.post("/api/notifications/check-changes", async (req, res) => {
    try {
      console.log("🔄 Starting automated product change check...");
      await notificationEngine.checkProductChanges();
      
      res.json({
        message: "Product change check completed",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error during product change check:", error);
      res.status(500).json({ message: "Failed to check product changes" });
    }
  });

  // Test alert endpoint for demo purposes
  app.post("/api/wishlist/alerts/test", async (req, res) => {
    try {
      const testSchema = z.object({
        productId: z.number(),
        alertType: z.enum(['stock', 'price', 'promo']),
        userId: z.number().default(1)
      });

      const { productId, alertType, userId } = testSchema.parse(req.body);

      const success = await notificationEngine.triggerTestAlert(productId, alertType, userId);

      res.json({
        success,
        message: success ? "Test alert sent successfully" : "Test alert failed",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error sending test alert:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid test data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send test alert" });
    }
  });
}