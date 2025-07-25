import { Express } from "express";
import { db } from "./db";
import { userFollows, retailers } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export function registerFollowRoutes(app: Express) {
  // Follow a retailer
  app.post("/api/follow", async (req, res) => {
    try {
      const { userId, retailerId } = req.body;
      
      if (!userId || !retailerId) {
        return res.status(400).json({ error: "userId and retailerId are required" });
      }

      // Check if already following
      const existingFollow = await db
        .select()
        .from(userFollows)
        .where(and(
          eq(userFollows.userId, userId),
          eq(userFollows.retailerId, retailerId)
        ))
        .limit(1);

      if (existingFollow.length > 0) {
        return res.status(200).json({ 
          success: true, 
          message: "Already following this retailer",
          follow: existingFollow[0]
        });
      }

      // Create new follow relationship
      const [newFollow] = await db
        .insert(userFollows)
        .values({
          userId: parseInt(userId),
          retailerId: parseInt(retailerId)
        })
        .returning();

      res.status(200).json({
        success: true,
        message: "Successfully followed retailer",
        follow: newFollow
      });
    } catch (error) {
      console.error("Error following retailer:", error);
      res.status(500).json({ error: "Failed to follow retailer" });
    }
  });

  // Unfollow a retailer
  app.delete("/api/unfollow", async (req, res) => {
    try {
      const { userId, retailerId } = req.body;
      
      if (!userId || !retailerId) {
        return res.status(400).json({ error: "userId and retailerId are required" });
      }

      const result = await db
        .delete(userFollows)
        .where(and(
          eq(userFollows.userId, parseInt(userId)),
          eq(userFollows.retailerId, parseInt(retailerId))
        ))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ error: "Follow relationship not found" });
      }

      res.status(200).json({
        success: true,
        message: "Successfully unfollowed retailer"
      });
    } catch (error) {
      console.error("Error unfollowing retailer:", error);
      res.status(500).json({ error: "Failed to unfollow retailer" });
    }
  });

  // Get followed retailers for a user
  app.get("/api/following/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const followedRetailers = await db
        .select({
          id: userFollows.id,
          followedAt: userFollows.followedAt,
          retailer: {
            id: retailers.id,
            businessName: retailers.businessName,
            email: retailers.email,
            category: retailers.category,
            description: retailers.description,
            address: retailers.address,
            zipCode: retailers.zipCode,
            approved: retailers.approved
          }
        })
        .from(userFollows)
        .innerJoin(retailers, eq(userFollows.retailerId, retailers.id))
        .where(eq(userFollows.userId, parseInt(userId)));

      res.status(200).json({
        success: true,
        follows: followedRetailers
      });
    } catch (error) {
      console.error("Error fetching followed retailers:", error);
      res.status(500).json({ error: "Failed to fetch followed retailers" });
    }
  });

  // Check if user is following a specific retailer
  app.get("/api/is-following/:userId/:retailerId", async (req, res) => {
    try {
      const { userId, retailerId } = req.params;
      
      const follow = await db
        .select()
        .from(userFollows)
        .where(and(
          eq(userFollows.userId, parseInt(userId)),
          eq(userFollows.retailerId, parseInt(retailerId))
        ))
        .limit(1);

      res.status(200).json({
        success: true,
        isFollowing: follow.length > 0,
        followedAt: follow.length > 0 ? follow[0].followedAt : null
      });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ error: "Failed to check follow status" });
    }
  });

  // Get followers count for a retailer
  app.get("/api/retailer-followers/:retailerId", async (req, res) => {
    try {
      const { retailerId } = req.params;
      
      const followers = await db
        .select()
        .from(userFollows)
        .where(eq(userFollows.retailerId, parseInt(retailerId)));

      res.status(200).json({
        success: true,
        followerCount: followers.length,
        followers: followers
      });
    } catch (error) {
      console.error("Error fetching retailer followers:", error);
      res.status(500).json({ error: "Failed to fetch retailer followers" });
    }
  });
}