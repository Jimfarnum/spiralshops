import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Trophy, 
  Star, 
  Users, 
  Heart, 
  Camera, 
  Gift,
  Medal,
  Crown,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiTiktok } from 'react-icons/si';

interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'sharing' | 'engagement' | 'community' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    count: number;
    timeframe?: string;
  };
  rewards: {
    spirals: number;
    perks?: string[];
  };
  unlocked: boolean;
  progress: number;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  baseReward: number;
  multiplier: number;
}

const SocialSharingRewards: React.FC = () => {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<AchievementBadge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [socialStats, setSocialStats] = useState({
    totalShares: 0,
    totalEarned: 0,
    weeklyShares: 0,
    streakDays: 0
  });

  const socialPlatforms: SocialPlatform[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <SiFacebook className="w-5 h-5" />,
      color: 'text-blue-600',
      baseReward: 5,
      multiplier: 1.2
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: <SiX className="w-5 h-5" />,
      color: 'text-gray-800',
      baseReward: 3,
      multiplier: 1.1
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <SiInstagram className="w-5 h-5" />,
      color: 'text-pink-600',
      baseReward: 7,
      multiplier: 1.5
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <SiTiktok className="w-5 h-5" />,
      color: 'text-black',
      baseReward: 10,
      multiplier: 2.0
    }
  ];

  const initialAchievements: AchievementBadge[] = [
    {
      id: 'first_share',
      title: 'Social Butterfly',
      description: 'Share your first SPIRAL experience',
      icon: <Share2 className="w-6 h-6" />,
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
      icon: <Zap className="w-6 h-6" />,
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
      icon: <Heart className="w-6 h-6" />,
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
      icon: <Users className="w-6 h-6" />,
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
      icon: <Camera className="w-6 h-6" />,
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
      icon: <Crown className="w-6 h-6" />,
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
      icon: <Target className="w-6 h-6" />,
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
      icon: <Award className="w-6 h-6" />,
      category: 'engagement',
      rarity: 'legendary',
      requirements: { type: 'viral_shares', count: 50 },
      rewards: { spirals: 1000, perks: ['Viral Bonus', 'Featured Content'] },
      unlocked: false,
      progress: 0
    }
  ];

  useEffect(() => {
    // Load achievements from API
    loadAchievements();
    loadSocialStats();
  }, []);

  const loadAchievements = async () => {
    try {
      const response = await fetch('/api/social-achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || initialAchievements);
      } else {
        setAchievements(initialAchievements);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
      setAchievements(initialAchievements);
    }
  };

  const loadSocialStats = async () => {
    try {
      const response = await fetch('/api/social-stats');
      if (response.ok) {
        const data = await response.json();
        setSocialStats(data.stats || socialStats);
      }
    } catch (error) {
      console.error('Failed to load social stats:', error);
    }
  };

  const shareToSocial = async (platform: string, content: any) => {
    try {
      const response = await fetch('/api/social-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          content,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Shared Successfully!",
          description: `+${data.spiralsEarned} SPIRALs earned for sharing on ${platform}`,
        });
        
        // Refresh achievements and stats
        loadAchievements();
        loadSocialStats();
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to record your share. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sharing': return <Share2 className="w-4 h-4" />;
      case 'engagement': return <Heart className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      case 'milestone': return <Trophy className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Social Sharing Rewards</h1>
          <p className="text-xl text-gray-600">Earn SPIRALs and unlock exclusive badges by sharing your SPIRAL experience</p>
        </div>

        {/* Stats Dashboard */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Your Social Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{socialStats.totalShares}</div>
                <div className="text-sm text-gray-600">Total Shares</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{socialStats.totalEarned}</div>
                <div className="text-sm text-gray-600">SPIRALs Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{socialStats.weeklyShares}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{socialStats.streakDays}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Share Actions */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-blue-500" />
              Quick Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialPlatforms.map(platform => (
                <Button
                  key={platform.id}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 hover:scale-105 transition-transform"
                  onClick={() => shareToSocial(platform.name, { type: 'quick_share' })}
                >
                  <div className={platform.color}>
                    {platform.icon}
                  </div>
                  <span className="text-sm">{platform.name}</span>
                  <span className="text-xs text-green-600">+{platform.baseReward} SPIRALs</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['all', 'sharing', 'engagement', 'community', 'milestone'].map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category !== 'all' && getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </Button>
          ))}
        </div>

        {/* Achievement Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map(achievement => (
            <Card 
              key={achievement.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300' 
                  : 'bg-white/80 backdrop-blur-sm'
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Medal className="w-6 h-6 text-yellow-500" />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {achievement.icon}
                  </div>
                  <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>

                {!achievement.unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.requirements.count}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.requirements.count) * 100} 
                      className="h-2"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">+{achievement.rewards.spirals} SPIRALs</span>
                  </div>
                  {achievement.rewards.perks && achievement.rewards.perks.length > 0 && (
                    <div className="space-y-1">
                      {achievement.rewards.perks.map((perk, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{perk}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialSharingRewards;