import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  TrendingUp, 
  Gift, 
  Calendar,
  Award,
  Target,
  Clock,
  Zap,
  Users,
  ShoppingBag
} from 'lucide-react';

interface LoyaltyStats {
  currentBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  nextRewardLevel: number;
  progressToNext: number;
  lifetimeRank: string;
  monthlyRank: number;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  source: string;
  description: string;
  date: string;
  multiplier?: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  isAvailable: boolean;
  image: string;
}

export default function LoyaltyDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loyaltyStats, setLoyaltyStats] = useState<LoyaltyStats>({
    currentBalance: 325,
    totalEarned: 1250,
    totalRedeemed: 925,
    nextRewardLevel: 500,
    progressToNext: 65,
    lifetimeRank: "Local Ambassador",
    monthlyRank: 12
  });

  const [recentTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "earned",
      amount: 45,
      source: "online_purchase",
      description: "Purchase at Local Artisan Goods - $90.00",
      date: "2025-01-21T14:30:00Z",
      multiplier: 1.0
    },
    {
      id: "2", 
      type: "earned",
      amount: 100,
      source: "event",
      description: "Double SPIRALS Saturday - Heritage Square Mall",
      date: "2025-01-20T16:00:00Z",
      multiplier: 2.0
    },
    {
      id: "3",
      type: "redeemed",
      amount: -50,
      source: "discount",
      description: "Redeemed for $10 off next purchase",
      date: "2025-01-19T11:15:00Z"
    },
    {
      id: "4",
      type: "earned",
      amount: 25,
      source: "sharing",
      description: "Shared local find on social media",
      date: "2025-01-18T09:45:00Z"
    },
    {
      id: "5",
      type: "earned",
      amount: 75,
      source: "in_person_purchase",
      description: "In-store pickup at Downtown Boutique - $75.00",
      date: "2025-01-17T13:20:00Z",
      multiplier: 1.0
    }
  ]);

  const [availableRewards] = useState<Reward[]>([
    {
      id: "1",
      title: "$5 Off Any Purchase",
      description: "Use at any participating store",
      cost: 250,
      category: "discount",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop"
    },
    {
      id: "2",
      title: "Free Coffee",
      description: "Redeem at Local Roasters Co.",
      cost: 150,
      category: "food",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop"
    },
    {
      id: "3",
      title: "Mall Parking Pass",
      description: "Free parking for a day",
      cost: 100,
      category: "convenience",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=200&h=200&fit=crop"
    },
    {
      id: "4",
      title: "$25 Gift Card",
      description: "Use at any mall store",
      cost: 1250,
      category: "gift_card",
      isAvailable: false,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop"
    }
  ]);

  const getTransactionIcon = (source: string) => {
    switch (source) {
      case 'online_purchase':
      case 'in_person_purchase':
        return <ShoppingBag className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'sharing':
        return <Users className="h-4 w-4" />;
      case 'discount':
        return <Gift className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    return type === 'earned' ? 'text-green-600' : 'text-red-600';
  };

  const redeemReward = (rewardId: string, cost: number) => {
    if (loyaltyStats.currentBalance >= cost) {
      setLoyaltyStats(prev => ({
        ...prev,
        currentBalance: prev.currentBalance - cost,
        totalRedeemed: prev.totalRedeemed + cost
      }));
      
      // In real app, would make API call
      console.log('Redeeming reward:', rewardId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-3xl font-bold text-[var(--spiral-navy)]">
                  {loyaltyStats.currentBalance}
                </p>
                <p className="text-xs text-gray-500">SPIRALs</p>
              </div>
              <Star className="h-8 w-8 text-[var(--spiral-coral)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  {loyaltyStats.totalEarned}
                </p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lifetime Rank</p>
                <p className="text-lg font-bold text-[var(--spiral-navy)]">
                  {loyaltyStats.lifetimeRank}
                </p>
                <p className="text-xs text-gray-500">Keep it up!</p>
              </div>
              <Award className="h-8 w-8 text-[var(--spiral-coral)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Reward</p>
                <p className="text-lg font-bold text-[var(--spiral-navy)]">
                  {loyaltyStats.nextRewardLevel - loyaltyStats.currentBalance} more
                </p>
                <p className="text-xs text-gray-500">SPIRALs needed</p>
              </div>
              <Target className="h-8 w-8 text-[var(--spiral-coral)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Level */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
              Progress to Next Reward Level
            </h3>
            <Badge className="bg-[var(--spiral-coral)] text-white">
              {loyaltyStats.progressToNext}% Complete
            </Badge>
          </div>
          <Progress value={loyaltyStats.progressToNext} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{loyaltyStats.currentBalance} SPIRALs</span>
            <span>{loyaltyStats.nextRewardLevel} SPIRALs</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Recent Activity</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
          <TabsTrigger value="earning">Earning Opportunities</TabsTrigger>
        </TabsList>

        {/* Recent Activity Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--spiral-coral)]" />
                Recent SPIRAL Activity
              </CardTitle>
              <CardDescription>
                Your latest earning and redemption history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {getTransactionIcon(transaction.source)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--spiral-navy)]">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          {transaction.multiplier && transaction.multiplier > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              {transaction.multiplier}x Bonus
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`text-right ${getTransactionColor(transaction.type)}`}>
                      <p className="text-lg font-bold">
                        {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500">SPIRALs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Store Tab */}
        <TabsContent value="rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[var(--spiral-coral)]" />
                SPIRAL Rewards Store
              </CardTitle>
              <CardDescription>
                Redeem your SPIRALs for exclusive local rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={reward.image} 
                      alt={reward.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                        {reward.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {reward.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[var(--spiral-coral)]" />
                          <span className="font-bold text-[var(--spiral-navy)]">
                            {reward.cost}
                          </span>
                        </div>
                        <Button
                          onClick={() => redeemReward(reward.id, reward.cost)}
                          disabled={!reward.isAvailable || loyaltyStats.currentBalance < reward.cost}
                          size="sm"
                          className={reward.isAvailable && loyaltyStats.currentBalance >= reward.cost 
                            ? "bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90" 
                            : ""
                          }
                        >
                          {loyaltyStats.currentBalance >= reward.cost ? 'Redeem' : 'Not Enough'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earning Opportunities Tab */}
        <TabsContent value="earning" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[var(--spiral-coral)]" />
                  Quick Ways to Earn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Shop Online</h4>
                    <p className="text-sm text-gray-600">5 SPIRALs per $100</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">In-Store Pickup</h4>
                    <p className="text-sm text-gray-600">10 SPIRALs per $100</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Share Local Finds</h4>
                    <p className="text-sm text-gray-600">5 SPIRALs per share</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Refer Friends</h4>
                    <p className="text-sm text-gray-600">50 SPIRALs per signup</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--spiral-coral)]" />
                  Special Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border border-[var(--spiral-coral)] rounded-lg bg-[var(--spiral-coral)]/5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[var(--spiral-coral)]">Double SPIRALS Saturday</h4>
                    <Badge className="bg-[var(--spiral-coral)] text-white">This Week</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Earn 2x SPIRALs on all purchases this Saturday at participating malls
                  </p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Mall Event Bonus</h4>
                    <Badge variant="outline">+25 SPIRALs</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Attend live jazz performance at Heritage Square Mall
                  </p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Review Bonus</h4>
                    <Badge variant="outline">+15 SPIRALs</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Leave a verified review for your recent purchases
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}