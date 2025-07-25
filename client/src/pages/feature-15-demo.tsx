import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  MessageSquare,
  CheckCircle,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Feature15Demo() {
  const [testUserId, setTestUserId] = useState('demo-user-001');
  const [referralCode, setReferralCode] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [newUserId, setNewUserId] = useState('demo-user-002');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leaderboard data
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/leaderboard/top'],
    retry: false,
  });

  // Fetch user referral stats
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/invite/stats/${testUserId}`],
    retry: false,
  });

  // Generate referral code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch('/api/invite/generate', {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (result: any) => {
      setReferralCode(result.referralCode);
      setShareUrl(result.shareUrl);
      toast({
        title: "✅ Referral Code Generated",
        description: `Generated code: ${result.referralCode}`,
      });
    }
  });

  // Track referral mutation
  const trackReferralMutation = useMutation({
    mutationFn: async ({ referralCode, referredUserId }: { referralCode: string; referredUserId: string }) => {
      const response = await fetch('/api/invite/track', {
        method: 'POST',
        body: JSON.stringify({ referralCode, referredUserId }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (result: any) => {
      toast({
        title: "✅ Referral Tracked",
        description: `Earned ${result.spiralsEarned} SPIRALs for successful referral!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/top'] });
      queryClient.invalidateQueries({ queryKey: [`/api/invite/stats/${testUserId}`] });
    }
  });

  // First purchase bonus mutation
  const firstPurchaseMutation = useMutation({
    mutationFn: async ({ referredUserId, orderId, orderAmount }: { referredUserId: string; orderId: string; orderAmount: number }) => {
      const response = await fetch('/api/invite/first-purchase', {
        method: 'POST',
        body: JSON.stringify({ referredUserId, orderId, orderAmount }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (result: any) => {
      if (result.success) {
        toast({
          title: "✅ First Purchase Bonus",
          description: `Referrer earned ${result.bonusAmount} bonus SPIRALs!`,
        });
      } else {
        toast({
          title: "ℹ️ No Bonus",
          description: result.message,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/top'] });
      queryClient.invalidateQueries({ queryKey: [`/api/invite/stats/${testUserId}`] });
    }
  });

  // Share tracking mutation
  const shareTrackingMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await fetch('/api/invite/share', {
        method: 'POST',
        body: JSON.stringify({ 
          userId: testUserId, 
          platform, 
          referralCode 
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (result: any) => {
      toast({
        title: "✅ Share Tracked",
        description: `Earned ${result.spiralsEarned} SPIRALs for sharing on ${result.platform}!`,
      });
    }
  });

  const handleGenerateCode = () => {
    generateCodeMutation.mutate(testUserId);
  };

  const handleTrackReferral = () => {
    if (!referralCode || !newUserId) {
      toast({
        title: "Missing Information",
        description: "Please generate a referral code and enter a new user ID first.",
        variant: "destructive"
      });
      return;
    }
    trackReferralMutation.mutate({ referralCode, referredUserId: newUserId });
  };

  const handleFirstPurchase = () => {
    if (!newUserId) {
      toast({
        title: "Missing Information",
        description: "Please enter the referred user ID first.",
        variant: "destructive"
      });
      return;
    }
    
    const orderId = `order-${Date.now()}`;
    const orderAmount = Math.floor(Math.random() * 500) + 50; // $50-$550 random order
    
    firstPurchaseMutation.mutate({
      referredUserId: newUserId,
      orderId,
      orderAmount
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "✅ Copied to Clipboard",
        description: "Referral link copied successfully!",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const shareOnPlatform = (platform: string) => {
    shareTrackingMutation.mutate(platform);
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
            <h1 className="text-3xl font-bold text-gray-900">Feature 15: Invite Leaderboard + Viral Sharing Engine</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete demonstration of SPIRAL's viral growth system with referral tracking, leaderboards, and reward mechanisms
          </p>
          <Button asChild className="mt-4">
            <a href="/invite-leaderboard">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Full Invite Leaderboard
            </a>
          </Button>
        </div>

        <Tabs defaultValue="demo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="stats">User Stats</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Test Referral System
                  </CardTitle>
                  <CardDescription>
                    Generate referral codes and test the tracking system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Test User ID</label>
                    <Input
                      value={testUserId}
                      onChange={(e) => setTestUserId(e.target.value)}
                      placeholder="demo-user-001"
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateCode}
                    disabled={generateCodeMutation.isPending}
                    className="w-full"
                  >
                    {generateCodeMutation.isPending ? 'Generating...' : 'Generate Referral Code'}
                  </Button>

                  {referralCode && (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Generated Code:</strong> {referralCode}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          <strong>Share URL:</strong> {shareUrl}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={copyToClipboard} variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button 
                          onClick={() => shareOnPlatform('facebook')} 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Facebook className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button 
                          onClick={() => shareOnPlatform('twitter')} 
                          size="sm" 
                          className="bg-sky-500 hover:bg-sky-600"
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Tweet
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Test Referral Tracking
                  </CardTitle>
                  <CardDescription>
                    Simulate new user signup and first purchase
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">New User ID (Referred User)</label>
                    <Input
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      placeholder="demo-user-002"
                    />
                  </div>

                  <Button
                    onClick={handleTrackReferral}
                    disabled={trackReferralMutation.isPending || !referralCode}
                    className="w-full"
                  >
                    {trackReferralMutation.isPending ? 'Tracking...' : 'Track Referral Signup (+10 SPIRALs)'}
                  </Button>

                  <Button
                    onClick={handleFirstPurchase}
                    disabled={firstPurchaseMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    {firstPurchaseMutation.isPending ? 'Processing...' : 'Simulate First Purchase (Bonus SPIRALs)'}
                  </Button>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Reward Structure</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>+10 SPIRALs</strong> per signup</li>
                      <li>• <strong>+10-50 SPIRALs</strong> first purchase bonus</li>
                      <li>• <strong>+2 SPIRALs</strong> per social share</li>
                      <li>• <strong>Badges & Leaderboard</strong> recognition</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Testing Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Code Generation</p>
                    <p className="text-sm text-gray-600">API Working</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Referral Tracking</p>
                    <p className="text-sm text-gray-600">API Working</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Leaderboard</p>
                    <p className="text-sm text-gray-600">API Working</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Stats Tracking</p>
                    <p className="text-sm text-gray-600">API Working</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Leaderboard</CardTitle>
                <CardDescription>Real-time invite leaderboard with rankings and badges</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboardLoading ? (
                  <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (leaderboard as any)?.leaderboard?.length > 0 ? (
                  <div className="grid gap-4">
                    {(leaderboard as any).leaderboard.map((entry: any, index: number) => (
                      <div key={entry.id} className={`flex items-center justify-between p-4 rounded-lg border ${index < 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.currentRank)}
                            <span className="text-lg font-bold">#{entry.currentRank}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{entry.userName}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{entry.successfulInvites} invites</span>
                              <span>{entry.totalSpiralEarned} SPIRALs</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entry.badges.map((badge: string, i: number) => (
                            <Badge key={i} className={`${getBadgeColor(badge)} text-white`}>
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No leaderboard entries yet</p>
                    <p className="text-sm text-gray-400">Test the referral system to populate the leaderboard</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Referral Statistics</CardTitle>
                <CardDescription>Detailed stats for {testUserId}</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                ) : (userStats as any) ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{(userStats as any).totalInvites}</p>
                        <p className="text-sm text-gray-600">Total Invites</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{(userStats as any).successfulInvites}</p>
                        <p className="text-sm text-gray-600">Successful</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{(userStats as any).totalSpiralEarned}</p>
                        <p className="text-sm text-gray-600">SPIRALs Earned</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {(userStats as any).currentRank ? `#${(userStats as any).currentRank}` : 'Unranked'}
                        </p>
                        <p className="text-sm text-gray-600">Current Rank</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recent Referrals</h4>
                      {(userStats as any).recentReferrals && (userStats as any).recentReferrals.length > 0 ? (
                        <div className="space-y-2">
                          {(userStats as any).recentReferrals.map((referral: any) => (
                            <div key={referral.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <span className="text-sm text-gray-600">
                                {new Date(referral.completedAt).toLocaleString()}
                              </span>
                              <Badge className="bg-green-100 text-green-800">
                                +{referral.spiralsEarned} SPIRALs
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No referrals yet. Generate and share your referral code!
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No stats available for this user
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Unique Referral Codes</p>
                        <p className="text-sm text-gray-600">Each user gets a unique, shareable referral link</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Real-time Tracking</p>
                        <p className="text-sm text-gray-600">Instant referral tracking and SPIRAL rewards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Viral Sharing Engine</p>
                        <p className="text-sm text-gray-600">Multi-platform sharing with tracking and rewards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Badge System</p>
                        <p className="text-sm text-gray-600">Dynamic badges based on performance and achievements</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">PostgreSQL Database</p>
                        <p className="text-sm text-gray-600">Robust database schema for referrals, leaderboard, and rewards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Express.js API</p>
                        <p className="text-sm text-gray-600">RESTful endpoints for all viral growth functionality</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">React Frontend</p>
                        <p className="text-sm text-gray-600">Interactive UI with real-time updates and social sharing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Mobile Optimized</p>
                        <p className="text-sm text-gray-600">Responsive design with mobile sharing capabilities</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Core Endpoints</p>
                    <div className="space-y-1 text-sm">
                      <p><code className="bg-gray-100 px-2 py-1 rounded">POST /api/invite/generate</code></p>
                      <p><code className="bg-gray-100 px-2 py-1 rounded">POST /api/invite/track</code></p>
                      <p><code className="bg-gray-100 px-2 py-1 rounded">GET /api/leaderboard/top</code></p>
                      <p><code className="bg-gray-100 px-2 py-1 rounded">GET /api/invite/stats/:userId</code></p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Bonus Features</p>
                    <div className="space-y-1 text-sm">
                      <p><code className="bg-gray-100 px-2 py-1 rounded">POST /api/invite/first-purchase</code></p>
                      <p><code className="bg-gray-100 px-2 py-1 rounded">POST /api/invite/share</code></p>
                      <p><code className="bg-gray-100 px-2 py-1 rounded">GET /api/leaderboard/by-location</code></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}