import { Router } from "express";
import { db } from "./db";
import { 
  retailerFollowSystem, 
  retailerFollowStats, 
  followNotificationPreferences,
  stores,
  users,
  type InsertRetailerFollowSystem,
  type InsertRetailerFollowStats,
  type InsertFollowNotificationPreferences
} from "@shared/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";

const router = Router();

// Get user's followed stores/retailers
router.get("/api/follows/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query; // Optional filter by follow type
    
    let query = db
      .select({
        id: retailerFollowSystem.id,
        followType: retailerFollowSystem.followType,
        followId: retailerFollowSystem.followId,
        followedAt: retailerFollowSystem.followedAt,
        notificationsEnabled: retailerFollowSystem.notificationsEnabled,
        tags: retailerFollowSystem.tags,
        // Join store information when following stores
        storeName: stores.name,
        storeDescription: stores.description,
        storeCategory: stores.category,
        storeRating: stores.rating,
        storeImageUrl: stores.imageUrl,
      })
      .from(retailerFollowSystem)
      .leftJoin(stores, eq(retailerFollowSystem.followId, stores.id))
      .where(eq(retailerFollowSystem.userId, parseInt(userId)));

    if (type) {
      query = query.where(and(
        eq(retailerFollowSystem.userId, parseInt(userId)),
        eq(retailerFollowSystem.followType, type as string)
      ));
    }

    const follows = await query.orderBy(desc(retailerFollowSystem.followedAt));
    
    res.json(follows);
  } catch (error) {
    console.error("Error fetching user follows:", error);
    res.status(500).json({ error: "Failed to fetch follows" });
  }
});

// Check if user follows a specific store/retailer
router.get("/api/follows/check/:userId/:followType/:followId", async (req, res) => {
  try {
    const { userId, followType, followId } = req.params;
    
    const follow = await db
      .select()
      .from(retailerFollowSystem)
      .where(and(
        eq(retailerFollowSystem.userId, parseInt(userId)),
        eq(retailerFollowSystem.followType, followType),
        eq(retailerFollowSystem.followId, parseInt(followId))
      ))
      .limit(1);

    res.json({ 
      isFollowing: follow.length > 0,
      followData: follow[0] || null
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ error: "Failed to check follow status" });
  }
});

// Follow a store/retailer
router.post("/api/follows", async (req, res) => {
  try {
    const { userId, followType, followId, notificationsEnabled = true, tags = [] } = req.body;

    // Check if already following
    const existing = await db
      .select()
      .from(userFollows)
      .where(and(
        eq(userFollows.userId, userId),
        eq(userFollows.followType, followType),
        eq(userFollows.followId, followId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ error: "Already following this entity" });
    }

    // Create new follow
    const newFollow: InsertRetailerFollowSystem = {
      userId,
      followType,
      followId,
      notificationsEnabled,
      tags
    };

    const [follow] = await db.insert(userFollows).values(newFollow).returning();

    // Update follow stats if following a store
    if (followType === 'store') {
      await updateFollowStats(followId);
    }

    res.status(201).json(follow);
  } catch (error) {
    console.error("Error creating follow:", error);
    res.status(500).json({ error: "Failed to follow" });
  }
});

// Unfollow a store/retailer
router.delete("/api/follows/:userId/:followType/:followId", async (req, res) => {
  try {
    const { userId, followType, followId } = req.params;

    const deleted = await db
      .delete(retailerFollowSystem)
      .where(and(
        eq(retailerFollowSystem.userId, parseInt(userId)),
        eq(retailerFollowSystem.followType, followType),
        eq(retailerFollowSystem.followId, parseInt(followId))
      ))
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({ error: "Follow relationship not found" });
    }

    // Update follow stats if unfollowing a store
    if (followType === 'store') {
      await updateFollowStats(parseInt(followId));
    }

    res.json({ message: "Successfully unfollowed" });
  } catch (error) {
    console.error("Error unfollowing:", error);
    res.status(500).json({ error: "Failed to unfollow" });
  }
});

// Update follow preferences (notifications, tags)
router.patch("/api/follows/:followId", async (req, res) => {
  try {
    const { followId } = req.params;
    const { notificationsEnabled, tags } = req.body;

    const updated = await db
      .update(retailerFollowSystem)
      .set({
        notificationsEnabled,
        tags,
      })
      .where(eq(retailerFollowSystem.id, parseInt(followId)))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "Follow not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating follow:", error);
    res.status(500).json({ error: "Failed to update follow" });
  }
});

// Get most followed stores (popular stores)
router.get("/api/follows/popular-stores", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularStores = await db
      .select({
        storeId: retailerFollowStats.storeId,
        totalFollowers: retailerFollowStats.totalFollowers,
        followersThisWeek: retailerFollowStats.followersThisWeek,
        followersThisMonth: retailerFollowStats.followersThisMonth,
        storeName: stores.name,
        storeDescription: stores.description,
        storeCategory: stores.category,
        storeRating: stores.rating,
        storeImageUrl: stores.imageUrl,
      })
      .from(retailerFollowStats)
      .innerJoin(stores, eq(retailerFollowStats.storeId, stores.id))
      .orderBy(desc(retailerFollowStats.totalFollowers))
      .limit(parseInt(limit as string));

    res.json(popularStores);
  } catch (error) {
    console.error("Error fetching popular stores:", error);
    res.status(500).json({ error: "Failed to fetch popular stores" });
  }
});

// Get user's follow preferences
router.get("/api/follows/preferences/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const preferences = await db
      .select()
      .from(followNotificationPreferences)
      .where(eq(followNotificationPreferences.userId, parseInt(userId)))
      .limit(1);

    if (preferences.length === 0) {
      // Create default preferences if none exist
      const defaultPrefs: InsertFollowNotificationPreferences = {
        userId: parseInt(userId),
        newProductNotifications: true,
        saleNotifications: true,
        eventNotifications: true,
        weeklyDigest: false,
      };

      const [newPrefs] = await db
        .insert(followNotificationPreferences)
        .values(defaultPrefs)
        .returning();

      return res.json(newPrefs);
    }

    res.json(preferences[0]);
  } catch (error) {
    console.error("Error fetching follow preferences:", error);
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
});

// Update user's follow preferences
router.patch("/api/follows/preferences/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newProductNotifications, saleNotifications, eventNotifications, weeklyDigest } = req.body;

    const updated = await db
      .update(followNotificationPreferences)
      .set({
        newProductNotifications,
        saleNotifications,
        eventNotifications,
        weeklyDigest,
        updatedAt: new Date(),
      })
      .where(eq(followNotificationPreferences.userId, parseInt(userId)))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "User preferences not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating follow preferences:", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

// Get follow statistics for a store (for store owners)
router.get("/api/follows/stats/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;

    const stats = await db
      .select()
      .from(retailerFollowStats)
      .where(eq(retailerFollowStats.storeId, parseInt(storeId)))
      .limit(1);

    if (stats.length === 0) {
      // Initialize stats if they don't exist
      const initialStats: InsertRetailerFollowStats = {
        storeId: parseInt(storeId),
        totalFollowers: 0,
        followersThisWeek: 0,
        followersThisMonth: 0,
      };

      const [newStats] = await db
        .insert(retailerFollowStats)
        .values(initialStats)
        .returning();

      return res.json(newStats);
    }

    res.json(stats[0]);
  } catch (error) {
    console.error("Error fetching follow stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Helper function to update follow statistics
async function updateFollowStats(storeId: number) {
  try {
    // Count total followers
    const totalFollowersResult = await db
      .select({ count: count() })
      .from(retailerFollowSystem)
      .where(and(
        eq(retailerFollowSystem.followType, 'store'),
        eq(retailerFollowSystem.followId, storeId)
      ));

    const totalFollowers = totalFollowersResult[0]?.count || 0;

    // Count followers from this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyFollowersResult = await db
      .select({ count: count() })
      .from(retailerFollowSystem)
      .where(and(
        eq(retailerFollowSystem.followType, 'store'),
        eq(retailerFollowSystem.followId, storeId),
        sql`${retailerFollowSystem.followedAt} >= ${oneWeekAgo}`
      ));

    const followersThisWeek = weeklyFollowersResult[0]?.count || 0;

    // Count followers from this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const monthlyFollowersResult = await db
      .select({ count: count() })
      .from(retailerFollowSystem)
      .where(and(
        eq(retailerFollowSystem.followType, 'store'),
        eq(retailerFollowSystem.followId, storeId),
        sql`${retailerFollowSystem.followedAt} >= ${oneMonthAgo}`
      ));

    const followersThisMonth = monthlyFollowersResult[0]?.count || 0;

    // Update or insert stats
    await db
      .insert(retailerFollowStats)
      .values({
        storeId,
        totalFollowers: parseInt(totalFollowers.toString()),
        followersThisWeek: parseInt(followersThisWeek.toString()),
        followersThisMonth: parseInt(followersThisMonth.toString()),
      })
      .onConflictDoUpdate({
        target: retailerFollowStats.storeId,
        set: {
          totalFollowers: parseInt(totalFollowers.toString()),
          followersThisWeek: parseInt(followersThisWeek.toString()),
          followersThisMonth: parseInt(followersThisMonth.toString()),
          lastUpdated: new Date(),
        },
      });

  } catch (error) {
    console.error("Error updating follow stats:", error);
  }
}

export default router;