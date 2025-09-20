import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Share2, 
  Copy, 
  Crown, 
  Medal, 
  Target, 
  Users, 
  TrendingUp,
  Facebook,
  Twitter,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  totalInvites: number;
  successfulInvites: number;
  totalSpiralEarned: number;
  currentRank: number;
  badges: string[];
  isPublic: boolean;
}

interface ReferralStats {
  totalInvites: number;
  successfulInvites: number;
  pendingInvites: number;
  totalSpiralEarned: number;
  currentRank: number | null;
  badges: string[];
  recentReferrals: Array<{
    id: string;
    spiralsEarned: number;
    completedAt: string;
  }>;
}

export default function InviteLeaderboard() {
  const [referralCode, setReferralCode] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentUserId] = useState('user123'); // Mock user ID
  const { toast } = useToast();

  // Fetch leaderboard data
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/leaderboard/top'],
    retry: false,
  });

  // Fetch user referral stats
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/invite/stats/${currentUserId}`],
    retry: false,
  });

  // Generate referral code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/invite/generate', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUserId }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (result: any) => {
      setReferralCode(result.referralCode);
      setShareUrl(result.shareUrl);
      toast({
        title: "Referral Code Generated",
        description: "Your unique referral link is ready to share!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate referral code. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Share tracking mutation
  const shareTrackingMutation = useMutation({
    mutationFn: async (platform: string) => {
      return apiRequest('/api/invite/share', {
        method: 'POST',
        body: JSON.stringify({ 
          userId: currentUserId, 
          platform, 
          referralCode 
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (result: any) => {
      toast({
        title: "Share Tracked",
        description: `Earned ${result.spiralsEarned} SPIRALs for sharing on ${result.platform}!`,
      });
    }
  });

  const handleGenerateCode = () => {
    generateCodeMutation.mutate();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied to Clipboard",
        description: "Your referral link has been copied!",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const shareOnPlatform = (platform: string, url?: string) => {
    const message = "Join me on SPIRAL - the local shopping platform that rewards community! Use my referral link to earn SPIRALs:";
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Join me on SPIRAL!')}&body=${encodeURIComponent(`${message}\n\n${shareUrl}`)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(`${message} ${shareUrl}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      shareTrackingMutation.mutate(platform);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Target className="h-5 w-5 text-blue-500" />;
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes('👑')) return 'bg-yellow-500';
    if (badge.includes('🥇')) return 'bg-amber-500';
    if (badge.includes('💎')) return 'bg-purple-500';
    if (badge.includes('🌟')) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">SPIRAL Invite Leaderboard</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join the movement and earn SPIRALs by bringing friends to the local shopping community
          </p>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="invite" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Invite Friends
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              My Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Input
                placeholder="Filter by location (city, state)..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="max-w-md"
              />
              <Button variant="outline">Filter</Button>
            </div>

            {leaderboardLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {leaderboard?.leaderboard?.map((entry: LeaderboardEntry, index: number) => (
                  <Card key={entry.id} className={`transition-all hover:shadow-lg ${index < 3 ? 'ring-2 ring-yellow-200' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.currentRank)}
                            <span className="text-2xl font-bold">#{entry.currentRank}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{entry.userName}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {entry.successfulInvites} successful invites
                              </span>
                              <span>{entry.totalSpiralEarned} SPIRALs earned</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entry.badges.map((badge, i) => (
                            <Badge key={i} className={`${getBadgeColor(badge)} text-white`}>
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invite" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Your Referral Link
                </CardTitle>
                <CardDescription>
                  Share your unique link with friends to earn SPIRALs when they join and shop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!referralCode ? (
                  <Button 
                    onClick={handleGenerateCode}
                    disabled={generateCodeMutation.isPending}
                    className="w-full"
                  >
                    {generateCodeMutation.isPending ? 'Generating...' : 'Generate My Referral Link'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        value={shareUrl} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button onClick={copyToClipboard} variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        onClick={() => shareOnPlatform('facebook')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        onClick={() => shareOnPlatform('twitter')}
                        className="bg-sky-500 hover:bg-sky-600"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button
                        onClick={() => shareOnPlatform('email')}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        onClick={() => shareOnPlatform('sms')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        SMS
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Referral Rewards</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>10 SPIRALs</strong> when someone signs up with your link</li>
                    <li>• <strong>Up to 50 SPIRALs</strong> when they make their first purchase</li>
                    <li>• <strong>2 SPIRALs</strong> every time you share your link</li>
                    <li>• <strong>Bonus badges</strong> and leaderboard recognition</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {statsLoading ? (
              <Card className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Referral Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{userStats?.totalInvites || 0}</p>
                        <p className="text-sm text-gray-600">Total Invites</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{userStats?.successfulInvites || 0}</p>
                        <p className="text-sm text-gray-600">Successful</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{userStats?.totalSpiralEarned || 0}</p>
                        <p className="text-sm text-gray-600">SPIRALs Earned</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {userStats?.currentRank ? `#${userStats.currentRank}` : 'Unranked'}
                        </p>
                        <p className="text-sm text-gray-600">Current Rank</p>
                      </div>
                    </div>

                    {userStats?.badges && userStats.badges.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Your Badges</h4>
                        <div className="flex flex-wrap gap-2">
                          {userStats.badges.map((badge: string, i: number) => (
                            <Badge key={i} className={`${getBadgeColor(badge)} text-white`}>
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userStats?.recentReferrals && userStats.recentReferrals.length > 0 ? (
                      <div className="space-y-3">
                        {userStats.recentReferrals.map((referral: any) => (
                          <div key={referral.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">
                              {new Date(referral.completedAt).toLocaleDateString()}
                            </span>
                            <Badge className="bg-green-100 text-green-800">
                              +{referral.spiralsEarned} SPIRALs
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No successful referrals yet. Start sharing your link!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Join the SPIRAL Movement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Build Community</h3>
                <p className="text-sm text-gray-600">Help grow the local shopping movement in your area</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Earn Rewards</h3>
                <p className="text-sm text-gray-600">Get SPIRALs for every friend who joins and shops locally</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Compete & Win</h3>
                <p className="text-sm text-gray-600">Climb the leaderboard and earn exclusive badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}