// Social Achievements API
import express from 'express';

const router = express.Router();

// In-memory storage for social achievements (in production, use database)
let socialAchievements = new Map();
let socialStats = new Map();

// Default achievements configuration
const defaultAchievements = [
  {
    id: 'first_share',
    title: 'Social Butterfly',
    description: 'Share your first SPIRAL experience',
    category: 'sharing',
    rarity: 'common',
    requirements: { type: 'shares', count: 1 },
    rewards: { spirals: 25, perks: ['Early Access Notifications'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'weekly_warrior',
    title: 'Weekly Warrior',
    description: 'Share 7 times in one week',
    category: 'engagement',
    rarity: 'rare',
    requirements: { type: 'weekly_shares', count: 7, timeframe: 'week' },
    rewards: { spirals: 100, perks: ['Weekly Bonus Multiplier'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'influence_master',
    title: 'Influence Master',
    description: 'Get 100 likes/reactions on shared content',
    category: 'engagement',
    rarity: 'epic',
    requirements: { type: 'social_engagement', count: 100 },
    rewards: { spirals: 250, perks: ['Influencer Status', 'Exclusive Events'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'community_champion',
    title: 'Community Champion',
    description: 'Invite 10 friends who make purchases',
    category: 'community',
    rarity: 'epic',
    requirements: { type: 'successful_referrals', count: 10 },
    rewards: { spirals: 500, perks: ['VIP Support', 'Referral Bonus x2'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'content_creator',
    title: 'Content Creator',
    description: 'Share original photos of SPIRAL purchases',
    category: 'sharing',
    rarity: 'rare',
    requirements: { type: 'photo_shares', count: 5 },
    rewards: { spirals: 150, perks: ['Creator Tools Access'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'spiral_legend',
    title: 'SPIRAL Legend',
    description: 'Earn 10,000 SPIRALs through social sharing',
    category: 'milestone',
    rarity: 'legendary',
    requirements: { type: 'spirals_earned', count: 10000 },
    rewards: { spirals: 2000, perks: ['Legend Status', 'Personal Shopper', 'Exclusive Merch'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Share daily for 30 consecutive days',
    category: 'engagement',
    rarity: 'epic',
    requirements: { type: 'daily_streak', count: 30, timeframe: 'days' },
    rewards: { spirals: 750, perks: ['Streak Multiplier', 'Daily Rewards x2'] },
    unlocked: false,
    progress: 0
  },
  {
    id: 'viral_sensation',
    title: 'Viral Sensation',
    description: 'Get one post shared 50+ times',
    category: 'engagement',
    rarity: 'legendary',
    requirements: { type: 'viral_shares', count: 50 },
    rewards: { spirals: 1000, perks: ['Viral Bonus', 'Featured Content'] },
    unlocked: false,
    progress: 0
  }
];

// Initialize user achievements
const initializeUserAchievements = (userId) => {
  if (!socialAchievements.has(userId)) {
    socialAchievements.set(userId, [...defaultAchievements]);
  }
  if (!socialStats.has(userId)) {
    socialStats.set(userId, {
      totalShares: 0,
      totalEarned: 0,
      weeklyShares: 0,
      streakDays: 0,
      lastShareDate: null,
      platforms: {
        facebook: { shares: 0, earned: 0 },
        twitter: { shares: 0, earned: 0 },
        instagram: { shares: 0, earned: 0 },
        tiktok: { shares: 0, earned: 0 }
      }
    });
  }
};

// Calculate platform rewards
const calculatePlatformReward = (platform) => {
  const baseRewards = {
    'Facebook': 5,
    'X (Twitter)': 3,
    'Instagram': 7,
    'TikTok': 10
  };
  
  const multipliers = {
    'Facebook': 1.2,
    'X (Twitter)': 1.1,
    'Instagram': 1.5,
    'TikTok': 2.0
  };
  
  return Math.floor((baseRewards[platform] || 3) * (multipliers[platform] || 1.0));
};

// Check and update achievements
const checkAchievements = (userId, updateType, value = 1) => {
  const userAchievements = socialAchievements.get(userId);
  const userStats = socialStats.get(userId);
  const unlockedAchievements = [];

  userAchievements.forEach(achievement => {
    if (achievement.unlocked) return;

    let shouldProgress = false;
    let progressIncrease = 0;

    switch (achievement.requirements.type) {
      case 'shares':
        if (updateType === 'share') {
          shouldProgress = true;
          progressIncrease = 1;
        }
        break;
      case 'weekly_shares':
        achievement.progress = userStats.weeklyShares;
        shouldProgress = true;
        break;
      case 'social_engagement':
        if (updateType === 'engagement') {
          shouldProgress = true;
          progressIncrease = value;
        }
        break;
      case 'successful_referrals':
        if (updateType === 'referral') {
          shouldProgress = true;
          progressIncrease = 1;
        }
        break;
      case 'photo_shares':
        if (updateType === 'photo_share') {
          shouldProgress = true;
          progressIncrease = 1;
        }
        break;
      case 'spirals_earned':
        achievement.progress = userStats.totalEarned;
        shouldProgress = true;
        break;
      case 'daily_streak':
        achievement.progress = userStats.streakDays;
        shouldProgress = true;
        break;
      case 'viral_shares':
        if (updateType === 'viral') {
          shouldProgress = true;
          progressIncrease = value;
        }
        break;
    }

    if (shouldProgress) {
      achievement.progress = Math.min(
        achievement.progress + progressIncrease,
        achievement.requirements.count
      );

      if (achievement.progress >= achievement.requirements.count && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        unlockedAchievements.push(achievement);
        
        // Award achievement rewards
        userStats.totalEarned += achievement.rewards.spirals;
      }
    }
  });

  return unlockedAchievements;
};

// Calculate daily streak
const updateDailyStreak = (userId) => {
  const userStats = socialStats.get(userId);
  const today = new Date().toDateString();
  const lastShare = userStats.lastShareDate ? new Date(userStats.lastShareDate).toDateString() : null;
  
  if (lastShare === today) {
    // Already shared today
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();
  
  if (lastShare === yesterdayString) {
    // Continuing streak
    userStats.streakDays += 1;
  } else if (lastShare !== today) {
    // Breaking streak or starting new
    userStats.streakDays = 1;
  }
  
  userStats.lastShareDate = new Date().toISOString();
};

// Get user achievements
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo_user';
    initializeUserAchievements(userId);
    
    const userAchievements = socialAchievements.get(userId);
    
    res.json({
      success: true,
      achievements: userAchievements,
      totalUnlocked: userAchievements.filter(a => a.unlocked).length,
      totalAvailable: userAchievements.length
    });
  } catch (error) {
    console.error('Failed to get achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load achievements'
    });
  }
});

// Get social stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo_user';
    initializeUserAchievements(userId);
    
    const userStats = socialStats.get(userId);
    
    res.json({
      success: true,
      stats: userStats
    });
  } catch (error) {
    console.error('Failed to get social stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load social stats'
    });
  }
});

// Record social share
router.post('/share', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { platform, content, timestamp } = req.body;
    
    initializeUserAchievements(userId);
    
    const userStats = socialStats.get(userId);
    const spiralsEarned = calculatePlatformReward(platform);
    
    // Update stats
    userStats.totalShares += 1;
    userStats.totalEarned += spiralsEarned;
    
    // Update weekly shares (simplified - in production, use proper date tracking)
    userStats.weeklyShares += 1;
    
    // Update daily streak
    updateDailyStreak(userId);
    
    // Update platform-specific stats
    const platformKey = platform.toLowerCase().replace(/[^a-z]/g, '');
    if (userStats.platforms[platformKey]) {
      userStats.platforms[platformKey].shares += 1;
      userStats.platforms[platformKey].earned += spiralsEarned;
    }
    
    // Check for achievement unlocks
    const newAchievements = checkAchievements(userId, 'share');
    
    // Special handling for photo shares
    if (content?.type === 'photo') {
      checkAchievements(userId, 'photo_share');
    }
    
    res.json({
      success: true,
      spiralsEarned,
      newAchievements,
      totalEarned: userStats.totalEarned,
      streakDays: userStats.streakDays
    });
    
  } catch (error) {
    console.error('Failed to record share:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record share'
    });
  }
});

// Record social engagement (likes, comments, etc.)
router.post('/engagement', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { type, count = 1, postId } = req.body;
    
    initializeUserAchievements(userId);
    
    // Check for engagement achievements
    const newAchievements = checkAchievements(userId, 'engagement', count);
    
    res.json({
      success: true,
      newAchievements,
      engagementRecorded: count
    });
    
  } catch (error) {
    console.error('Failed to record engagement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record engagement'
    });
  }
});

// Record successful referral
router.post('/referral', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { referredUserId, purchaseAmount } = req.body;
    
    initializeUserAchievements(userId);
    
    const userStats = socialStats.get(userId);
    const referralBonus = Math.floor(purchaseAmount * 0.05); // 5% referral bonus
    
    userStats.totalEarned += referralBonus;
    
    // Check for referral achievements
    const newAchievements = checkAchievements(userId, 'referral');
    
    res.json({
      success: true,
      referralBonus,
      newAchievements,
      totalEarned: userStats.totalEarned
    });
    
  } catch (error) {
    console.error('Failed to record referral:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record referral'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = [];
    
    // In production, this would query the database
    for (const [userId, stats] of socialStats.entries()) {
      const achievements = socialAchievements.get(userId);
      const unlockedCount = achievements ? achievements.filter(a => a.unlocked).length : 0;
      
      leaderboard.push({
        userId,
        totalShares: stats.totalShares,
        totalEarned: stats.totalEarned,
        streakDays: stats.streakDays,
        achievementsUnlocked: unlockedCount,
        rank: 0 // Will be calculated after sorting
      });
    }
    
    // Sort by total earned SPIRALs
    leaderboard.sort((a, b) => b.totalEarned - a.totalEarned);
    leaderboard.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    res.json({
      success: true,
      leaderboard: leaderboard.slice(0, 50) // Top 50
    });
    
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load leaderboard'
    });
  }
});

export default router;