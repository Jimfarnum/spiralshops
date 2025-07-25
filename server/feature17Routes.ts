import type { Express } from "express";
import { db } from "./db";
import { 
  pickupWindows, 
  userPickups, 
  messages, 
  mallMaps, 
  retailerProfiles, 
  largeRetailerSettings,
  insertPickupWindowSchema,
  insertUserPickupSchema,
  insertMessageSchema,
  insertMallMapSchema,
  insertRetailerProfileSchema,
  insertLargeRetailerSettingSchema
} from "@shared/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { z } from "zod";

export function registerFeature17Routes(app: Express) {
  
  // =============================================
  // 1. LOCAL PICKUP SCHEDULING
  // =============================================
  
  // Get available pickup windows for a retailer
  app.get("/api/pickups/windows/:retailerId", async (req, res) => {
    try {
      const retailerId = parseInt(req.params.retailerId);
      if (isNaN(retailerId)) {
        return res.status(400).json({ error: "Invalid retailer ID" });
      }

      const dayOfWeek = req.query.dayOfWeek ? parseInt(req.query.dayOfWeek as string) : new Date().getDay();
      
      const windows = await db
        .select()
        .from(pickupWindows)
        .where(
          and(
            eq(pickupWindows.retailerId, retailerId),
            eq(pickupWindows.dayOfWeek, dayOfWeek),
            eq(pickupWindows.isActive, true)
          )
        )
        .orderBy(pickupWindows.startTime);

      res.json({ success: true, windows });
    } catch (error) {
      console.error("Error fetching pickup windows:", error);
      res.status(500).json({ error: "Failed to fetch pickup windows" });
    }
  });

  // Schedule a pickup
  app.post("/api/pickups/schedule", async (req, res) => {
    try {
      const validatedData = insertUserPickupSchema.parse(req.body);
      
      // Check if window has capacity
      const window = await db
        .select()
        .from(pickupWindows)
        .where(eq(pickupWindows.id, validatedData.windowId))
        .limit(1);
      
      if (!window.length || window[0].booked >= window[0].capacity) {
        return res.status(400).json({ error: "Pickup window is full or unavailable" });
      }

      // Create pickup booking
      const [pickup] = await db
        .insert(userPickups)
        .values(validatedData)
        .returning();

      // Update booked count
      await db
        .update(pickupWindows)
        .set({ booked: window[0].booked + 1 })
        .where(eq(pickupWindows.id, validatedData.windowId));

      res.json({ success: true, pickup });
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid pickup data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to schedule pickup" });
    }
  });

  // Create pickup windows (for retailers)
  app.post("/api/pickups/windows", async (req, res) => {
    try {
      const validatedData = insertPickupWindowSchema.parse(req.body);
      
      const [window] = await db
        .insert(pickupWindows)
        .values(validatedData)
        .returning();

      res.json({ success: true, window });
    } catch (error) {
      console.error("Error creating pickup window:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid window data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create pickup window" });
    }
  });

  // =============================================
  // 2. RETAILER MESSAGING SYSTEM
  // =============================================

  // Send a message
  app.post("/api/messages/send", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      
      const [message] = await db
        .insert(messages)
        .values(validatedData)
        .returning();

      res.json({ success: true, message });
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid message data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Get message history between user and retailer
  app.get("/api/messages/:senderId/:receiverId", async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
      
      const messageHistory = await db
        .select()
        .from(messages)
        .where(
          and(
            eq(messages.senderId, senderId),
            eq(messages.receiverId, receiverId)
          )
        )
        .orderBy(desc(messages.timestamp))
        .limit(50);

      res.json({ success: true, messages: messageHistory });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Get all conversations for a user/retailer
  app.get("/api/messages/conversations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get unique conversations
      const conversations = await db
        .selectDistinct({
          partnerId: messages.senderId,
          partnerType: messages.senderType,
          lastMessage: messages.message,
          lastTimestamp: messages.timestamp,
          isRead: messages.isRead
        })
        .from(messages)
        .where(eq(messages.receiverId, userId))
        .orderBy(desc(messages.timestamp));

      res.json({ success: true, conversations });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Mark messages as read
  app.put("/api/messages/mark-read", async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      
      await db
        .update(messages)
        .set({ isRead: true })
        .where(
          and(
            eq(messages.senderId, senderId),
            eq(messages.receiverId, receiverId)
          )
        );

      res.json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  // =============================================
  // 3. MALL MAP SYSTEM
  // =============================================

  // Get mall map data
  app.get("/api/mall-map/:mallId", async (req, res) => {
    try {
      const mallId = parseInt(req.params.mallId);
      if (isNaN(mallId)) {
        return res.status(400).json({ error: "Invalid mall ID" });
      }

      const [mallMap] = await db
        .select()
        .from(mallMaps)
        .where(eq(mallMaps.mallId, mallId))
        .limit(1);

      if (!mallMap) {
        return res.status(404).json({ error: "Mall map not found" });
      }

      res.json({ success: true, mallMap });
    } catch (error) {
      console.error("Error fetching mall map:", error);
      res.status(500).json({ error: "Failed to fetch mall map" });
    }
  });

  // Create or update mall map
  app.post("/api/mall-map", async (req, res) => {
    try {
      const validatedData = insertMallMapSchema.parse(req.body);
      
      const [mallMap] = await db
        .insert(mallMaps)
        .values(validatedData)
        .onConflictDoUpdate({
          target: mallMaps.mallId,
          set: {
            svgUrl: validatedData.svgUrl,
            jsonPathData: validatedData.jsonPathData,
            mapMetadata: validatedData.mapMetadata,
            storeLocations: validatedData.storeLocations,
            updatedAt: new Date()
          }
        })
        .returning();

      res.json({ success: true, mallMap });
    } catch (error) {
      console.error("Error creating/updating mall map:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid mall map data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create/update mall map" });
    }
  });

  // =============================================
  // 4. RETAILER PROFILES
  // =============================================

  // Get retailer profile
  app.get("/api/retailer/profile/:retailerId", async (req, res) => {
    try {
      const retailerId = parseInt(req.params.retailerId);
      if (isNaN(retailerId)) {
        return res.status(400).json({ error: "Invalid retailer ID" });
      }

      const [profile] = await db
        .select()
        .from(retailerProfiles)
        .where(eq(retailerProfiles.retailerId, retailerId))
        .limit(1);

      if (!profile) {
        return res.status(404).json({ error: "Retailer profile not found" });
      }

      res.json({ success: true, profile });
    } catch (error) {
      console.error("Error fetching retailer profile:", error);
      res.status(500).json({ error: "Failed to fetch retailer profile" });
    }
  });

  // Create or update retailer profile
  app.post("/api/retailer/profile/update", async (req, res) => {
    try {
      const validatedData = insertRetailerProfileSchema.parse(req.body);
      
      const [profile] = await db
        .insert(retailerProfiles)
        .values(validatedData)
        .onConflictDoUpdate({
          target: retailerProfiles.retailerId,
          set: {
            aboutText: validatedData.aboutText,
            logoUrl: validatedData.logoUrl,
            website: validatedData.website,
            operatingHours: validatedData.operatingHours,
            contactInfo: validatedData.contactInfo,
            socialLinks: validatedData.socialLinks,
            specialties: validatedData.specialties,
            paymentMethods: validatedData.paymentMethods,
            updatedAt: new Date()
          }
        })
        .returning();

      res.json({ success: true, profile });
    } catch (error) {
      console.error("Error updating retailer profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update retailer profile" });
    }
  });

  // =============================================
  // 5. LARGE RETAILER OPT-IN
  // =============================================

  // Get large retailer opt-in status
  app.get("/api/large-retailer/status/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const [setting] = await db
        .select()
        .from(largeRetailerSettings)
        .where(eq(largeRetailerSettings.userId, userId))
        .limit(1);

      const optedIn = setting?.optedIn || false;
      res.json({ success: true, optedIn, preferences: setting?.preferences || {} });
    } catch (error) {
      console.error("Error fetching large retailer status:", error);
      res.status(500).json({ error: "Failed to fetch large retailer status" });
    }
  });

  // Toggle large retailer opt-in
  app.post("/api/large-retailer/opt-in", async (req, res) => {
    try {
      const { userId, optedIn, preferences = {} } = req.body;
      
      if (!userId || typeof optedIn !== 'boolean') {
        return res.status(400).json({ error: "userId and optedIn boolean are required" });
      }

      const [setting] = await db
        .insert(largeRetailerSettings)
        .values({ userId, optedIn, preferences })
        .onConflictDoUpdate({
          target: largeRetailerSettings.userId,
          set: {
            optedIn,
            preferences,
            updatedAt: new Date()
          }
        })
        .returning();

      res.json({ success: true, setting });
    } catch (error) {
      console.error("Error toggling large retailer opt-in:", error);
      res.status(500).json({ error: "Failed to toggle large retailer opt-in" });
    }
  });
}