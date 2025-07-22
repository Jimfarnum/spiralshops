import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { 
  Award, 
  Star, 
  TrendingUp, 
  Clock, 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  Mail,
  Users,
  Gift,
  Calendar,
  Filter,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface LoyaltyData {
  userId: string;
  totalEarned: number;
  currentBalance: number;
  pendingPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referralCode: string;
  referralCount: number;
  nextTierPoints: number;
  progressToNextTier: number;
}

interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  earned: number;
  redeemed: number;
  balance: number;
  type: 'earned' | 'redeemed';
  orderId?: string;
  status: 'completed' | 'pending' | 'processing';
}

// Mock data - in production this would come from backend
const mockLoyaltyData: LoyaltyData = {
  userId: "user123",
  totalEarned: 2150,
  currentBalance: 1875,
  pendingPoints: 125,
  tier: 'Gold',
  referralCode: 'SPIRAL-USER123',
  referralCount: 8,
  nextTierPoints: 3000,
  progressToNextTier: 72
};

const mockTransactions: LoyaltyTransaction[] = [
  {
    id: '1',
    date: '2025-01-22',
    description: 'Purchase at Local Coffee Roasters',
    earned: 15,
    redeemed: 0,
    balance: 1875,
    type: 'earned',
    orderId: 'ORD-2025-001',
    status: 'completed'
  },
  {
    id: '2',
    date: '2025-01-21',
    description: 'Referral Bonus - Sarah M. first purchase',
    earned: 50,
    redeemed: 0,
    balance: 1860,
    type: 'earned',
    status: 'completed'
  },
  {
    id: '3',
    date: '2025-01-20',
    description: 'Redeemed for shipping discount',
    earned: 0,
    redeemed: 25,
    balance: 1810,
    type: 'redeemed',
    status: 'completed'
  },
  {
    id: '4',
    date: '2025-01-19',
    description: 'Purchase at Downtown Bookstore (Pending)',
    earned: 35,
    redeemed: 0,
    balance: 1835,
    type: 'earned',
    orderId: 'ORD-2025-002',
    status: 'pending'
  },
  {
    id: '5',
    date: '2025-01-18',
    description: 'Social Media Share Bonus',
    earned: 5,
    redeemed: 0,
    balance: 1800,
    type: 'earned',
    status: 'completed'
  }
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'Bronze': return 'bg-amber-600 text-white';
    case 'Silver': return 'bg-gray-500 text-white';
    case 'Gold': return 'bg-yellow-500 text-white';
    case 'Platinum': return 'bg-purple-600 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'Bronze': return '🥉';
    case 'Silver': return '🥈';
    case 'Gold': return '🥇';
    case 'Platinum': return '💎';
    default: return '⭐';
  }
};

export default function LoyaltyDashboard() {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // In production, this would fetch from backend
  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ['/api/loyalty/dashboard'],
    queryFn: () => Promise.resolve(mockLoyaltyData),
  });

  const { data: transactions } = useQuery({
    queryKey: ['/api/loyalty/transactions'],
    queryFn: () => Promise.resolve(mockTransactions),
  });

  const filteredTransactions = transactions?.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'earned') return transaction.earned > 0;
    if (activeFilter === 'redeemed') return transaction.redeemed > 0;
    return true;
  }) || [];

  const handleCopyReferralLink = async () => {
    const referralUrl = `spiralshops.com/r/${loyaltyData?.referralCode}`;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedReferral(true);
      toast({
        title: "Referral link copied!",
        description: "Share with friends to earn bonus SPIRALs",
      });
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const referralUrl = `spiralshops.com/r/${loyaltyData?.referralCode}`;
    const message = "Join me on SPIRAL - discover amazing local businesses and earn rewards! Use my referral link:";
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message + ' ' + referralUrl)}&hashtags=SPIRAL,ShopLocal`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Join me on SPIRAL!&body=${encodeURIComponent(message + '\n\n' + referralUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      toast({
        title: "Thanks for sharing!",
        description: "You'll earn 10 SPIRALs when your friend makes their first purchase",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please log in to view your loyalty dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/api/login'}>
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              SPIRAL Loyalty Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Track your rewards, share with friends, and unlock exclusive benefits
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total SPIRALs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-[var(--spiral-gold)]" />
                  Total Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--spiral-navy)]">
                  {loyaltyData.totalEarned.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">SPIRALs earned all-time</p>
              </CardContent>
            </Card>

            {/* Available Balance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[var(--spiral-coral)]" />
                  Available Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--spiral-coral)]">
                  {loyaltyData.currentBalance.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Ready to redeem</p>
              </CardContent>
            </Card>

            {/* Pending Points */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--spiral-sage)]" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--spiral-sage)]">
                  {loyaltyData.pendingPoints}
                </div>
                <p className="text-sm text-gray-600">Processing orders</p>
              </CardContent>
            </Card>

            {/* Tier Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  Tier Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getTierColor(loyaltyData.tier)}>
                    {getTierIcon(loyaltyData.tier)} {loyaltyData.tier}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {loyaltyData.tier === 'Platinum' ? 'Max Tier' : 'Platinum'}</span>
                    <span>{loyaltyData.progressToNextTier}%</span>
                  </div>
                  <Progress value={loyaltyData.progressToNextTier} />
                  {loyaltyData.tier !== 'Platinum' && (
                    <p className="text-xs text-gray-600">
                      {loyaltyData.nextTierPoints - loyaltyData.totalEarned} SPIRALs until next tier
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transaction History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Transaction History</CardTitle>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                        <TabsList className="grid grid-cols-3 w-48">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="earned">Earned</TabsTrigger>
                          <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Earned</TableHead>
                          <TableHead className="text-right">Redeemed</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{transaction.description}</span>
                                {transaction.status === 'pending' && (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                {transaction.orderId && (
                                  <Badge variant="outline" className="text-xs">
                                    {transaction.orderId}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.earned > 0 ? (
                                <span className="text-green-600 font-medium">
                                  +{transaction.earned}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.redeemed > 0 ? (
                                <span className="text-red-600 font-medium">
                                  -{transaction.redeemed}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {transaction.balance.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile View - Accordion Style */}
                  <div className="md:hidden space-y-3">
                    {filteredTransactions.map((transaction) => (
                      <Card key={transaction.id} className="border-l-4 border-l-[var(--spiral-coral)]">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{transaction.description}</div>
                              <div className="text-xs text-gray-600">
                                {new Date(transaction.date).toLocaleDateString()}
                              </div>
                            </div>
                            {transaction.status === 'pending' && (
                              <Badge variant="outline" className="text-xs ml-2">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Earned:</span>
                              {transaction.earned > 0 ? (
                                <div className="text-green-600 font-medium">+{transaction.earned}</div>
                              ) : (
                                <div className="text-gray-400">-</div>
                              )}
                            </div>
                            <div>
                              <span className="text-gray-600">Redeemed:</span>
                              {transaction.redeemed > 0 ? (
                                <div className="text-red-600 font-medium">-{transaction.redeemed}</div>
                              ) : (
                                <div className="text-gray-400">-</div>
                              )}
                            </div>
                            <div>
                              <span className="text-gray-600">Balance:</span>
                              <div className="font-medium">{transaction.balance.toLocaleString()}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referral Section */}
            <div className="space-y-6">
              {/* Referral Link Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[var(--spiral-coral)]" />
                    Invite Friends
                  </CardTitle>
                  <CardDescription>
                    Earn 10 SPIRALs when a friend makes their first purchase
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Referral Stats */}
                  <div className="bg-[var(--spiral-cream)] rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--spiral-navy)]">
                        {loyaltyData.referralCount}
                      </div>
                      <div className="text-sm text-gray-600">Friends referred</div>
                    </div>
                  </div>

                  {/* Referral Link */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Referral Link</label>
                    <div className="flex gap-2">
                      <Input
                        value={`spiralshops.com/r/${loyaltyData.referralCode}`}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={handleCopyReferralLink}
                        className="shrink-0"
                      >
                        {copiedReferral ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Share with friends</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialShare('facebook')}
                        className="flex items-center gap-2"
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="hidden sm:inline">Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialShare('twitter')}
                        className="flex items-center gap-2"
                      >
                        <Twitter className="h-4 w-4 text-blue-400" />
                        <span className="hidden sm:inline">Twitter</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialShare('email')}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-gray-600" />
                        <span className="hidden sm:inline">Email</span>
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded">
                    💡 Tip: Share your link on social media or send it directly to friends. You'll earn SPIRALs for each successful referral!
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Gift className="mr-2 h-4 w-4" />
                    Redeem SPIRALs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Earning Opportunities
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Program Terms
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}