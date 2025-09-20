import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { 
  Store, 
  Star, 
  TrendingUp, 
  Gift, 
  History,
  Award,
  Target,
  Coins,
  ArrowRight,
  Crown,
  Trophy
} from 'lucide-react';

interface RetailerLoyaltyStats {
  storeId: number;
  storeName: string;
  currentBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  currentTier: string;
  nextTierThreshold: number;
  pointsToNextTier: number;
  pointsPerDollar: number;
  recentTransactions: Array<{
    id: number;
    pointsEarned: number;
    pointsRedeemed: number;
    transactionType: string;
    description: string;
    createdAt: string;
  }>;
}

interface RetailerLoyaltyData {
  retailers: RetailerLoyaltyStats[];
  totalBalance: number;
  totalEarned: number;
}

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'platinum': return <Crown className="h-4 w-4 text-purple-600" />;
    case 'gold': return <Trophy className="h-4 w-4 text-yellow-600" />;
    case 'silver': return <Award className="h-4 w-4 text-gray-500" />;
    default: return <Star className="h-4 w-4 text-amber-600" />;
  }
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-amber-100 text-amber-800 border-amber-200';
  }
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'earned': return <Coins className="h-4 w-4 text-green-600" />;
    case 'redeemed': return <Gift className="h-4 w-4 text-blue-600" />;
    case 'bonus': return <Star className="h-4 w-4 text-purple-600" />;
    default: return <History className="h-4 w-4 text-gray-600" />;
  }
};

export default function RetailerLoyaltyPage() {
  const { data: loyaltyData, isLoading } = useQuery<RetailerLoyaltyData>({
    queryKey: ['/api/loyalty/retailers'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const retailers = loyaltyData?.retailers || [];
  const totalBalance = loyaltyData?.totalBalance || 0;
  const totalEarned = loyaltyData?.totalEarned || 0;

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              Retailer Loyalty Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Track your SPIRAL points and tier status with each local retailer
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[var(--spiral-coral)]/10 rounded-full">
                    <Coins className="h-6 w-6 text-[var(--spiral-coral)]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{totalBalance}</div>
                    <div className="text-sm text-gray-600">Total Available Balance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{totalEarned}</div>
                    <div className="text-sm text-gray-600">Total Points Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Store className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{retailers.length}</div>
                    <div className="text-sm text-gray-600">Active Retailers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Retailer Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">Your Retailer Loyalty Status</h2>
            
            {retailers.map((retailer) => (
              <Card key={retailer.storeId} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--spiral-coral)]/10 rounded-lg">
                        <Store className="h-5 w-5 text-[var(--spiral-coral)]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{retailer.storeName}</CardTitle>
                        <CardDescription>
                          {retailer.pointsPerDollar} SPIRALs per $1 spent
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getTierColor(retailer.currentTier)} border px-3 py-1`}>
                      {getTierIcon(retailer.currentTier)}
                      <span className="ml-1 capitalize">{retailer.currentTier}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Current Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--spiral-coral)]">{retailer.currentBalance}</div>
                      <div className="text-sm text-gray-600">Available Balance</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{retailer.totalEarned}</div>
                      <div className="text-sm text-gray-600">Total Earned</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{retailer.totalRedeemed}</div>
                      <div className="text-sm text-gray-600">Total Redeemed</div>
                    </div>
                  </div>

                  {/* Tier Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Progress to Next Tier</div>
                      <div className="text-sm text-gray-600">
                        {retailer.pointsToNextTier} points to {retailer.currentTier === 'bronze' ? 'Silver' : 
                                                              retailer.currentTier === 'silver' ? 'Gold' : 
                                                              retailer.currentTier === 'gold' ? 'Platinum' : 'Max Level'}
                      </div>
                    </div>
                    <Progress 
                      value={((retailer.totalEarned) / retailer.nextTierThreshold) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Recent Transactions */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent Activity
                    </h4>
                    <div className="space-y-2">
                      {retailer.recentTransactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(transaction.transactionType)}
                            <div>
                              <div className="text-sm font-medium">{transaction.description}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {transaction.pointsEarned > 0 && (
                              <div className="text-sm font-semibold text-green-600">
                                +{transaction.pointsEarned}
                              </div>
                            )}
                            {transaction.pointsRedeemed > 0 && (
                              <div className="text-sm font-semibold text-blue-600">
                                -{transaction.pointsRedeemed}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Link href={`/store/${retailer.storeId}`}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Store className="mr-2 h-4 w-4" />
                        Visit Store
                      </Button>
                    </Link>
                    <Link href={`/loyalty/retailer/${retailer.storeId}`}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Target className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                    {retailer.currentBalance >= 25 && (
                      <Button className="w-full sm:w-auto bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80">
                        <Gift className="mr-2 h-4 w-4" />
                        Redeem Points
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {retailers.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No retailer loyalty yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start shopping at local retailers to begin earning store-specific SPIRAL points
                  </p>
                  <Link href="/products">
                    <Button>
                      <Store className="mr-2 h-4 w-4" />
                      Start Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Access */}
          <Card className="bg-gradient-to-r from-[var(--spiral-coral)]/10 to-[var(--spiral-sage)]/10 border-[var(--spiral-coral)]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2">
                    Mall Bonus Perks Available
                  </h3>
                  <p className="text-gray-600">
                    Shop at multiple stores in the same mall to unlock bonus SPIRALs and special perks
                  </p>
                </div>
                <Link href="/loyalty/mall-perks">
                  <Button variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/10">
                    View Mall Perks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}