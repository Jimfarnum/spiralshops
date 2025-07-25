import type { Express } from "express";
import { nanoid } from "nanoid";
import { z } from "zod";

interface InviteStorage {
  generateReferralCode(userId: string): Promise<string>;
  trackReferral(referralCode: string, referredUserId: string): Promise<void>;
  getLeaderboard(limit?: number, location?: string): Promise<any[]>;
  getReferralStats(userId: string): Promise<any>;
  rewardReferral(referralId: string, rewardType: string, spiralAmount: number): Promise<void>;
  updateLeaderboard(userId: string): Promise<void>;
}

class MemoryInviteStorage implements InviteStorage {
  private referrals: Map<string, any> = new Map();
  private leaderboard: Map<string, any> = new Map();
  private rewards: Map<string, any> = new Map();

  async generateReferralCode(userId: string): Promise<string> {
    const code = `${userId}-${nanoid(6)}`.toUpperCase();
    
    // Check if user already has a referral code
    const existingCode = Array.from(this.referrals.values())
      .find(r => r.referrerId === userId && !r.referredUserId)?.referralCode;
    
    if (existingCode) return existingCode;

    const referral = {
      id: nanoid(),
      referrerId: userId,
      referredUserId: null,
      referralCode: code,
      status: "pending",
      spiralsEarned: 0,
      firstPurchaseBonus: false,
      createdAt: new Date(),
      completedAt: null
    };

    this.referrals.set(referral.id, referral);
    return code;
  }

  async trackReferral(referralCode: string, referredUserId: string): Promise<void> {
    const referral = Array.from(this.referrals.values())
      .find(r => r.referralCode === referralCode);

    if (!referral) {
      throw new Error("Invalid referral code");
    }

    if (referral.referredUserId) {
      throw new Error("Referral code already used");
    }

    if (referral.referrerId === referredUserId) {
      throw new Error("Cannot refer yourself");
    }

    // Update referral
    referral.referredUserId = referredUserId;
    referral.status = "completed";
    referral.spiralsEarned = 10; // Base signup bonus
    referral.completedAt = new Date();

    // Award reward
    await this.rewardReferral(referral.id, "signup", 10);
    await this.updateLeaderboard(referral.referrerId);
  }

  async getLeaderboard(limit: number = 10, location?: string): Promise<any[]> {
    const leaderboardData = Array.from(this.leaderboard.values())
      .filter(entry => entry.isPublic)
      .sort((a, b) => b.totalSpiralEarned - a.totalSpiralEarned)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        currentRank: index + 1,
        userName: `User${entry.userId.slice(-4)}`, // Mock user name
        badges: this.calculateBadges(entry, index + 1)
      }));

    return leaderboardData;
  }

  async getReferralStats(userId: string): Promise<any> {
    const userReferrals = Array.from(this.referrals.values())
      .filter(r => r.referrerId === userId);

    const leaderboardEntry = this.leaderboard.get(userId) || {
      totalInvites: 0,
      successfulInvites: 0,
      totalSpiralEarned: 0,
      currentRank: null,
      badges: []
    };

    return {
      totalInvites: userReferrals.length,
      successfulInvites: userReferrals.filter(r => r.status === "completed").length,
      pendingInvites: userReferrals.filter(r => r.status === "pending").length,
      totalSpiralEarned: leaderboardEntry.totalSpiralEarned,
      currentRank: leaderboardEntry.currentRank,
      badges: leaderboardEntry.badges,
      recentReferrals: userReferrals
        .filter(r => r.status === "completed")
        .slice(-5)
        .map(r => ({
          id: r.id,
          spiralsEarned: r.spiralsEarned,
          completedAt: r.completedAt
        }))
    };
  }

  async rewardReferral(referralId: string, rewardType: string, spiralAmount: number): Promise<void> {
    const reward = {
      id: nanoid(),
      userId: "",
      referralId,
      rewardType,
      spiralAmount,
      description: `Earned ${spiralAmount} SPIRALs for ${rewardType}`,
      createdAt: new Date()
    };

    const referral = this.referrals.get(referralId);
    if (referral) {
      reward.userId = referral.referrerId;
    }

    this.rewards.set(reward.id, reward);
  }

  async updateLeaderboard(userId: string): Promise<void> {
    const userReferrals = Array.from(this.referrals.values())
      .filter(r => r.referrerId === userId);

    const totalInvites = userReferrals.length;
    const successfulInvites = userReferrals.filter(r => r.status === "completed").length;
    const totalSpiralEarned = userReferrals.reduce((sum, r) => sum + r.spiralsEarned, 0);

    const entry = {
      id: nanoid(),
      userId,
      totalInvites,
      successfulInvites,
      totalSpiralEarned,
      currentRank: null,
      badges: [],
      isPublic: true,
      updatedAt: new Date()
    };

    this.leaderboard.set(userId, entry);
  }

  private calculateBadges(entry: any, rank: number): string[] {
    const badges = [];
    
    if (rank === 1) badges.push("👑 Top Referrer");
    if (rank <= 3) badges.push("🥇 Top 3");
    if (rank <= 10) badges.push("🎯 Top 10");
    if (entry.totalSpiralEarned >= 1000) badges.push("💎 SPIRAL Champion");
    if (entry.successfulInvites >= 50) badges.push("🌟 Super Inviter");
    if (entry.successfulInvites >= 10) badges.push("🚀 Rising Star");

    return badges;
  }
}

const inviteStorage = new MemoryInviteStorage();

export function registerInviteRoutes(app: Express) {
  // Generate referral code for user
  app.post('/api/invite/generate', async (req, res) => {
    try {
      const schema = z.object({
        userId: z.string().min(1)
      });

      const { userId } = schema.parse(req.body);
      const referralCode = await inviteStorage.generateReferralCode(userId);
      
      res.json({ 
        referralCode,
        shareUrl: `https://spiralshops.com/invite/${referralCode}`,
        message: "Share this link with friends to earn SPIRALs!"
      });
    } catch (error) {
      console.error('Error generating referral code:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to generate referral code" 
      });
    }
  });

  // Track referral when someone signs up
  app.post('/api/invite/track', async (req, res) => {
    try {
      const schema = z.object({
        referralCode: z.string().min(1),
        referredUserId: z.string().min(1)
      });

      const { referralCode, referredUserId } = schema.parse(req.body);
      await inviteStorage.trackReferral(referralCode, referredUserId);
      
      res.json({ 
        success: true,
        message: "Referral tracked successfully! Referrer earned 10 SPIRALs.",
        spiralsEarned: 10
      });
    } catch (error) {
      console.error('Error tracking referral:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to track referral" 
      });
    }
  });

  // Get invite leaderboard
  app.get('/api/leaderboard/top', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const location = req.query.location as string;
      
      const leaderboard = await inviteStorage.getLeaderboard(limit, location);
      
      res.json({
        leaderboard,
        total: leaderboard.length,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get leaderboard by location
  app.get('/api/leaderboard/by-location', async (req, res) => {
    try {
      const { city, state, mallId } = req.query;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const location = city && state ? `${city}, ${state}` : undefined;
      const leaderboard = await inviteStorage.getLeaderboard(limit, location);
      
      res.json({
        leaderboard,
        location: location || "All Locations",
        mallId: mallId || null,
        total: leaderboard.length
      });
    } catch (error) {
      console.error('Error fetching location leaderboard:', error);
      res.status(500).json({ message: "Failed to fetch location leaderboard" });
    }
  });

  // Get user referral stats
  app.get('/api/invite/stats/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const stats = await inviteStorage.getReferralStats(userId);
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  // Reward first purchase bonus
  app.post('/api/invite/first-purchase', async (req, res) => {
    try {
      const schema = z.object({
        referredUserId: z.string().min(1),
        orderId: z.string().min(1),
        orderAmount: z.number().min(0)
      });

      const { referredUserId, orderId, orderAmount } = schema.parse(req.body);
      
      // Find the referral for this user
      const referrals = Array.from((inviteStorage as any).referrals.values());
      const referral = referrals.find(r => 
        r.referredUserId === referredUserId && 
        r.status === "completed" && 
        !r.firstPurchaseBonus
      );

      if (referral) {
        const bonusAmount = Math.min(50, Math.floor(orderAmount * 0.1)); // 10% of order, max 50 SPIRALs
        referral.firstPurchaseBonus = true;
        referral.spiralsEarned += bonusAmount;

        await inviteStorage.rewardReferral(referral.id, "first_purchase", bonusAmount);
        await inviteStorage.updateLeaderboard(referral.referrerId);

        res.json({
          success: true,
          bonusAmount,
          message: `Referrer earned ${bonusAmount} bonus SPIRALs for first purchase!`
        });
      } else {
        res.json({
          success: false,
          message: "No eligible referral found for first purchase bonus"
        });
      }
    } catch (error) {
      console.error('Error processing first purchase bonus:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to process first purchase bonus" 
      });
    }
  });

  // Share referral link (for analytics)
  app.post('/api/invite/share', async (req, res) => {
    try {
      const schema = z.object({
        userId: z.string().min(1),
        platform: z.string().min(1), // facebook, twitter, instagram, email, sms
        referralCode: z.string().min(1)
      });

      const { userId, platform, referralCode } = schema.parse(req.body);
      
      // Award 2 SPIRALs for sharing
      const shareReward = {
        id: nanoid(),
        userId,
        referralId: referralCode,
        rewardType: "share",
        spiralAmount: 2,
        description: `Earned 2 SPIRALs for sharing on ${platform}`,
        createdAt: new Date()
      };

      res.json({
        success: true,
        spiralsEarned: 2,
        platform,
        message: `Earned 2 SPIRALs for sharing on ${platform}!`
      });
    } catch (error) {
      console.error('Error tracking share:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to track share" 
      });
    }
  });
}