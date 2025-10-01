import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Copy, 
  Gift, 
  TrendingUp, 
  Award, 
  Heart, 
  Package, 
  Settings, 
  User,
  Calendar,
  MapPin
} from "lucide-react";
import ShopperOrderHistory from "./ShopperOrderHistory.jsx";

export default function ShopperDashboardNew() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [referralCode, setReferralCode] = useState<string>("");
  const [earnings, setEarnings] = useState<number>(0);
  const [redeemed, setRedeemed] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const userId = 'demo-shopper-001';

  useEffect(() => {
    fetchShopperData();
  }, []);

  const fetchShopperData = async () => {
    setIsLoading(true);
    try {
      // Fetch wallet balance
      const walletResponse = await fetch(`/api/spiral-wallet/${userId}`);
      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        setWalletBalance(walletData.balance);
        setRecentTransactions(walletData.history?.slice(0, 5) || []);
        
        // Calculate totals from history
        const totalEarned = walletData.history?.filter((t: any) => t.type === 'earn')
          .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
        const totalRedeemed = walletData.history?.filter((t: any) => t.type === 'spend')
          .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
        
        setEarnings(totalEarned);
        setRedeemed(totalRedeemed);
      } else {
        // Create demo wallet if it doesn't exist
        await createDemoWallet();
      }
      
      // Generate or fetch referral code
      setReferralCode(`SPIRAL-${userId.slice(-3).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`);
    } catch (error) {
      console.error('Error fetching shopper data:', error);
      toast({
        title: "Error loading data",
        description: "Unable to load SPIRAL wallet information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoWallet = async () => {
    try {
      // Create some demo transactions
      const demoTransactions = [
        { amount: 50, source: 'purchase', description: 'Welcome bonus - First SPIRAL purchase' },
        { amount: 25, source: 'referral', description: 'Friend signup bonus' },
        { amount: 10, source: 'share', description: 'Social media sharing reward' }
      ];

      for (const transaction of demoTransactions) {
        await fetch(`/api/spiral-wallet/${userId}/earn`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });
      }

      // Refresh data after creating demo transactions
      setTimeout(() => fetchShopperData(), 500);
    } catch (error) {
      console.error('Error creating demo wallet:', error);
    }
  };

  const handleShareReferral = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Referral code copied!",
      description: "Share it with friends to earn 10 SPIRALs each"
    });
  };

  const handleSocialShare = async (platform: string) => {
    const shareText = `Join me on SPIRAL and support local businesses! Use my code ${referralCode} to get started. #EarnSPIRALs #ShopLocal #MainStreetRevival`;
    
    // Award sharing SPIRALs
    try {
      await fetch(`/api/spiral-wallet/${userId}/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 5,
          source: 'share',
          description: `Social media share on ${platform}`
        })
      });

      fetchShopperData(); // Refresh balance
      
      toast({
        title: "Earned 5 SPIRALs!",
        description: `Thanks for sharing SPIRAL on ${platform}`
      });
    } catch (error) {
      console.error('Error awarding share SPIRALs:', error);
    }

    // Open share dialog
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://spiral.com')}&quote=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--spiral-navy)] mx-auto mb-4"></div>
          <p className="text-[var(--spiral-navy)]">Loading your SPIRAL dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Your SPIRAL Dashboard
          </h1>
          <p className="section-description text-lg">
            Manage your shopping, rewards, and local business connections
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Wallet Balance */}
              <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-[var(--spiral-gold)]" />
                    Current Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
                    {walletBalance.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600">SPIRALs</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ ${(walletBalance * 0.01).toFixed(2)} value
                  </p>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">3</div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const ordersTab = document.querySelector('[data-value="orders"]') as HTMLElement;
                      ordersTab?.click();
                    }}
                  >
                    View All
                  </Button>
                </CardContent>
              </Card>

              {/* Following Stores */}
              <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    Following
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-2">12</div>
                  <p className="text-sm text-gray-600">Local Stores</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const followingTab = document.querySelector('[data-value="following"]') as HTMLElement;
                      followingTab?.click();
                    }}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Button 
                className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)]"
                onClick={() => window.location.href = '/products'}
              >
                Start Shopping
              </Button>
              <Button 
                variant="outline"
                className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white"
                onClick={() => window.location.href = '/stores'}
              >
                Browse Stores
              </Button>
              <Button 
                variant="outline"
                className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white"
                onClick={() => window.location.href = '/wishlist'}
              >
                My Wishlist
              </Button>
              <Button 
                variant="outline"
                className="border-[var(--spiral-gold)] text-[var(--spiral-gold)] hover:bg-[var(--spiral-gold)] hover:text-white"
                onClick={() => window.location.href = '/social-rewards'}
              >
                Social Rewards
              </Button>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <ShopperOrderHistory shopperId={userId} />
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Earned */}
              <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Total Earned
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    {earnings.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600">SPIRALs</p>
                  <p className="text-xs text-gray-500 mt-1">
                    From purchases & sharing
                  </p>
                </CardContent>
              </Card>

              {/* Total Redeemed */}
              <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5 text-blue-600" />
                    Total Redeemed
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {redeemed.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600">SPIRALs</p>
                  <p className="text-xs text-gray-500 mt-1">
                    For rewards & discounts
                  </p>
                </CardContent>
              </Card>

              {/* Referral Section */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-[var(--spiral-navy)] flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Refer Friends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      value={referralCode} 
                      readOnly 
                      className="font-mono text-center bg-gray-50" 
                    />
                    <Button 
                      onClick={handleShareReferral}
                      className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)]"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSocialShare('twitter')}
                        className="flex-1"
                      >
                        Share on X
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSocialShare('facebook')}
                        className="flex-1"
                      >
                        Share on Facebook
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Earn 5 SPIRALs per social share!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How to Earn */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--spiral-navy)]">
                  How to Earn SPIRALs
                </CardTitle>
                <CardDescription>
                  Multiple ways to grow your SPIRAL balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="secondary" className="min-w-fit">+5</Badge>
                  <div>
                    <p className="font-medium text-sm">Online Shopping</p>
                    <p className="text-xs text-gray-600">5 SPIRALs per $100 spent online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Badge variant="secondary" className="min-w-fit">+10</Badge>
                  <div>
                    <p className="font-medium text-sm">In-Store Shopping</p>
                    <p className="text-xs text-gray-600">10 SPIRALs per $100 in-person purchases</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Badge variant="secondary" className="min-w-fit">+10</Badge>
                  <div>
                    <p className="font-medium text-sm">Friend Referrals</p>
                    <p className="text-xs text-gray-600">Each friend who joins with your code</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Badge variant="secondary" className="min-w-fit">+5</Badge>
                  <div>
                    <p className="font-medium text-sm">Social Sharing</p>
                    <p className="text-xs text-gray-600">Share SPIRAL on social media</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-[var(--spiral-navy)]">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest SPIRAL transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={transaction.type === 'earn' ? 'default' : 'secondary'}
                          className={transaction.type === 'earn' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input placeholder="Your name" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input placeholder="your.email@example.com" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="City, State" className="mt-1" />
                  </div>
                  <Button>Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Following Stores
                </CardTitle>
                <CardDescription>
                  Manage the local businesses you follow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No stores followed yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Browse stores and click "Follow" to see them here!
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => window.location.href = '/stores'}
                  >
                    Browse Stores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about orders and rewards</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-muted-foreground">Control your data sharing preferences</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Account Security</p>
                      <p className="text-sm text-muted-foreground">Change password and security settings</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}