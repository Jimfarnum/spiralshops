import React from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Store, 
  Star, 
  TrendingUp, 
  Gift, 
  History,
  Award,
  Target,
  Coins,
  Crown,
  Trophy,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

const RetailerLoyaltyDetails = () => {
  const [location] = useLocation();
  const retailerId = location.split('/').pop() || '1';

  // Mock retailer loyalty data based on ID
  const retailerData = {
    storeId: parseInt(retailerId),
    storeName: 'Fashion Forward Boutique',
    currentBalance: 127,
    totalEarned: 890,
    totalRedeemed: 763,
    currentTier: 'gold',
    nextTierThreshold: 1000,
    pointsToNextTier: 110,
    pointsPerDollar: 5,
    store: {
      address: '456 Commerce St, Portland, OR 97201',
      phone: '(555) 123-4567',
      email: 'info@fashionforward.com',
      website: 'www.fashionforward.com',
      rating: 4.8,
      description: 'Premium fashion boutique specializing in sustainable and ethically-made clothing for the modern professional.',
      hours: {
        weekdays: '10:00 AM - 8:00 PM',
        saturday: '10:00 AM - 9:00 PM',
        sunday: '12:00 PM - 6:00 PM'
      }
    },
    recentTransactions: [
      {
        id: 1,
        pointsEarned: 22,
        pointsRedeemed: 0,
        transactionType: 'earned',
        description: 'Winter Clothing Collection - $79.99',
        createdAt: '2025-01-18T14:30:00Z',
        purchaseDetails: {
          total: 79.99,
          items: 3,
          paymentMethod: 'Credit Card ending in 4242'
        }
      },
      {
        id: 2,
        pointsEarned: 45,
        pointsRedeemed: 0,
        transactionType: 'earned',
        description: 'Professional Blazer Set - $189.99',
        createdAt: '2025-01-15T11:20:00Z',
        purchaseDetails: {
          total: 189.99,
          items: 2,
          paymentMethod: 'Credit Card ending in 4242'
        }
      },
      {
        id: 3,
        pointsEarned: 0,
        pointsRedeemed: 50,
        transactionType: 'redeemed',
        description: 'Redeemed for 10% off coupon',
        createdAt: '2025-01-10T16:45:00Z'
      },
      {
        id: 4,
        pointsEarned: 30,
        pointsRedeemed: 0,
        transactionType: 'bonus',
        description: 'New Customer Bonus',
        createdAt: '2025-01-05T09:15:00Z'
      }
    ],
    tierBenefits: {
      current: [
        'Earn 5 SPIRALs per $1 spent',
        'Birthday month 2x points',
        'Early access to sales',
        'Free alterations on purchases over $100'
      ],
      next: [
        'Earn 7 SPIRALs per $1 spent',
        'Quarterly bonus points',
        'VIP styling sessions',
        'Free shipping on all orders',
        'Exclusive member events'
      ]
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return <Crown className="h-5 w-5 text-purple-600" />;
      case 'gold': return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'silver': return <Award className="h-5 w-5 text-gray-500" />;
      default: return <Star className="h-5 w-5 text-amber-600" />;
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

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/loyalty-retailers">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Loyalty Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
              {retailerData.storeName}
            </h1>
            <p className="text-gray-600 font-['Inter']">
              Loyalty Program Details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current Status Overview */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Status
                  </CardTitle>
                  <Badge className={`${getTierColor(retailerData.currentTier)} border px-3 py-1`}>
                    {getTierIcon(retailerData.currentTier)}
                    <span className="ml-1 capitalize">{retailerData.currentTier} Member</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-[var(--spiral-coral)]/10 rounded-lg">
                    <div className="text-3xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                      {retailerData.currentBalance}
                    </div>
                    <div className="text-sm text-gray-600 font-['Inter']">Available SPIRALs</div>
                  </div>
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 font-['Poppins']">
                      {retailerData.totalEarned}
                    </div>
                    <div className="text-sm text-gray-600 font-['Inter']">Total Earned</div>
                  </div>
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 font-['Poppins']">
                      {retailerData.totalRedeemed}
                    </div>
                    <div className="text-sm text-gray-600 font-['Inter']">Total Redeemed</div>
                  </div>
                </div>

                {/* Tier Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[var(--spiral-navy)] font-['Inter']">
                      Progress to Platinum Tier
                    </div>
                    <div className="text-sm text-gray-600 font-['Inter']">
                      {retailerData.pointsToNextTier} points to go
                    </div>
                  </div>
                  <Progress 
                    value={((retailerData.totalEarned) / retailerData.nextTierThreshold) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 font-['Inter']">
                    <span>{retailerData.totalEarned} earned</span>
                    <span>{retailerData.nextTierThreshold} needed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaction History
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Your complete earning and redemption activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {retailerData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.transactionType === 'earned' ? 'bg-green-100' :
                          transaction.transactionType === 'redeemed' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {getTransactionIcon(transaction.transactionType)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--spiral-navy)] font-['Inter']">
                            {transaction.description}
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1 font-['Inter']">
                            <p>{new Date(transaction.createdAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                            {transaction.purchaseDetails && (
                              <div className="text-xs text-gray-500">
                                <p>Total: ${transaction.purchaseDetails.total} • {transaction.purchaseDetails.items} items</p>
                                <p>Payment: {transaction.purchaseDetails.paymentMethod}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {transaction.pointsEarned > 0 && (
                          <div className="text-lg font-semibold text-green-600 font-['Poppins']">
                            +{transaction.pointsEarned}
                          </div>
                        )}
                        {transaction.pointsRedeemed > 0 && (
                          <div className="text-lg font-semibold text-blue-600 font-['Poppins']">
                            -{transaction.pointsRedeemed}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 font-['Inter']">SPIRALs</div>
                        
                        {/* View Purchase Details Button */}
                        {transaction.purchaseDetails && (
                          <Link href={`/purchase-details?id=purchase-${transaction.id}`}>
                            <Button variant="outline" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Tier Benefits */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your {retailerData.currentTier.charAt(0).toUpperCase() + retailerData.currentTier.slice(1)} Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retailerData.tierBenefits.current.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[var(--spiral-navy)] font-['Inter']">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Store Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2 font-['Inter']">
                  <p className="text-gray-600">{retailerData.store.description}</p>
                  
                  <div className="pt-2 border-t space-y-2">
                    <div>
                      <p className="font-medium text-[var(--spiral-navy)]">Address</p>
                      <p className="text-gray-600">{retailerData.store.address}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--spiral-navy)]">Phone</p>
                      <p className="text-gray-600">{retailerData.store.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--spiral-navy)]">Website</p>
                      <p className="text-[var(--spiral-coral)]">{retailerData.store.website}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{retailerData.store.rating}</span>
                      <span className="text-gray-600">rating</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Link href={`/store/${retailerData.storeId}`}>
                    <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white">
                      <Store className="h-4 w-4 mr-2" />
                      Visit Store Page
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Store Hours
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {retailerData.currentBalance >= 25 && (
                  <Button className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-gold)] text-white">
                    <Gift className="h-4 w-4 mr-2" />
                    Redeem {retailerData.currentBalance} SPIRALs
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
                <Button variant="outline" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Leave Store Review
                </Button>
              </CardContent>
            </Card>

            {/* Next Tier Preview */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  Platinum Tier Benefits
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Unlock these benefits with {retailerData.pointsToNextTier} more points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {retailerData.tierBenefits.next.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-700 font-['Inter']">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RetailerLoyaltyDetails;