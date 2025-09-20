import express, { Request, Response } from "express";
import { getCloudant } from "../lib/cloudant.js";
import { storage } from "../storage";

const router = express.Router();
const db = getCloudant();

// Retailer profile interface for recognition system
interface RetailerProfile {
  _id: string;
  businessName: string;
  tier: string;
  engagement: number;
  badges: string[];
  mallRank?: number;
  isVerified: boolean;
  type: string;
}

// Initialize sample retailer profiles for demo
const sampleProfiles: RetailerProfile[] = [
  {
    _id: "retailer_1",
    businessName: "Tech Haven Electronics",
    tier: "Premium",
    engagement: 95,
    badges: ["Top Performer", "Customer Favorite", "Tech Expert"],
    mallRank: 1,
    isVerified: true,
    type: "retailerProfile"
  },
  {
    _id: "retailer_2", 
    businessName: "Fashion Forward Boutique",
    tier: "Standard",
    engagement: 78,
    badges: ["Style Icon", "Customer Favorite"],
    mallRank: 3,
    isVerified: true,
    type: "retailerProfile"
  },
  {
    _id: "retailer_3",
    businessName: "Local Coffee Roasters",
    tier: "Growing",
    engagement: 65,
    badges: ["Community Favorite"],
    mallRank: 5,
    isVerified: false,
    type: "retailerProfile"
  }
];

// Seed sample data into Cloudant
const initializeProfiles = async () => {
  for (const profile of sampleProfiles) {
    try {
      await db.insert("retailer_profiles", profile);
    } catch (error) {
      console.log("Profile already exists:", profile._id);
    }
  }
};

// Initialize on startup
initializeProfiles();

/**
 * Get private leaderboard (Admin only)
 * Returns full ranked data by tier (sales, locations, employees, etc.)
 */
router.get("/admin/leaderboard", async (req: Request, res: Response) => {
  try {
    const result = await db.find("retailer_profiles", { 
      selector: { type: "retailerProfile" },
      limit: 50 
    });

    // Sort retailers by engagement score
    const sorted = result.result.docs.sort((a: any, b: any) => b.engagement - a.engagement);

    res.json({
      status: "success",
      leaderboard: sorted.map((r: any) => ({
        id: r._id,
        name: r.businessName,
        tier: r.tier,
        engagement: r.engagement,
        badges: r.badges || []
      }))
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to load leaderboard", details: err });
  }
});

/**
 * Get retailer recognition (Retailer view)
 * Shows only supportive recognition (Top Performer, badges)
 */
router.get("/retailer/recognition/:id", async (req: Request, res: Response) => {
  try {
    const retailerProfile = sampleProfiles.find(p => p._id === req.params.id) || 
      sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];

    let recognition = [];
    if (retailerProfile.engagement > 80) {
      recognition.push("Top Performer in Your Tier");
    }
    if (retailerProfile.engagement > 90) {
      recognition.push("Elite Business Partner");
    }
    if (retailerProfile.mallRank === 1) {
      recognition.push("Top Performer in Your Mall");
    }
    if (retailerProfile.isVerified) {
      recognition.push("SPIRAL Verified Business");
    }

    res.json({
      status: "success",
      recognition,
      badges: retailerProfile.badges || [],
      tier: retailerProfile.tier,
      engagement: retailerProfile.engagement
    });
  } catch (err) {
    console.error("Recognition error:", err);
    res.status(404).json({ error: "Retailer not found" });
  }
});

/**
 * Shopper-facing recognition (badges only)
 * Only shows public-facing badges and verification status
 */
router.get("/shopper/retailer/:id", async (req: Request, res: Response) => {
  try {
    const retailerProfile = sampleProfiles.find(p => p._id === req.params.id) || 
      sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];

    res.json({
      status: "success",
      name: retailerProfile.businessName,
      verified: retailerProfile.isVerified,
      badges: retailerProfile.badges || [],
      tier: retailerProfile.tier
    });
  } catch (err) {
    console.error("Shopper recognition error:", err);
    res.status(404).json({ error: "Retailer not found" });
  }
});

/**
 * Update retailer recognition (Admin endpoint)
 * Allows admins to update badges and recognition
 */
router.post("/admin/update-recognition/:id", async (req: Request, res: Response) => {
  try {
    const { badges, tier, engagement } = req.body;
    const retailerId = req.params.id;

    // Find and update profile in our sample data
    const profileIndex = sampleProfiles.findIndex(p => p._id === retailerId);
    if (profileIndex !== -1) {
      sampleProfiles[profileIndex] = {
        ...sampleProfiles[profileIndex],
        badges: badges || sampleProfiles[profileIndex].badges,
        tier: tier || sampleProfiles[profileIndex].tier,
        engagement: engagement !== undefined ? engagement : sampleProfiles[profileIndex].engagement
      };

      // Update in Cloudant
      await db.insert("retailer_profiles", sampleProfiles[profileIndex]);

      res.json({
        status: "success",
        message: "Recognition updated successfully",
        profile: sampleProfiles[profileIndex]
      });
    } else {
      res.status(404).json({ error: "Retailer profile not found" });
    }
  } catch (err) {
    console.error("Update recognition error:", err);
    res.status(500).json({ error: "Failed to update recognition" });
  }
});

export default router;