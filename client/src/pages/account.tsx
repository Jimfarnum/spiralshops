import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  User, 
  ShoppingCart, 
  Share2, 
  Star, 
  Package, 
  Heart, 
  Bell, 
  MapPin, 
  Gift,
  TrendingUp,
  Store,
  Edit3
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SocialSharingEngine from '@/components/social-sharing-engine';
import InviteCodeSystem from '@/components/invite-code-system';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'processing' | 'shipped';
  items: number;
  spiralsEarned: number;
  fulfillmentMethod: string;
}

interface FavoriteStore {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  distance: number;
}

const Account = () => {
  const { user } = useAuthStore();
  const { spiralBalance, totalEarned, totalRedeemed, transactions } = useLoyaltyStore();
  const { toast } = useToast();

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    notifications: {
      email: true,
      push: false,
      sms: false
    }
  });

  // Mock order data
  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      total: 89.47,
      status: 'delivered',
      items: 3,
      spiralsEarned: 4,
      fulfillmentMethod: 'Ship to Me'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      total: 156.32,
      status: 'delivered',
      items: 5,
      spiralsEarned: 8,
      fulfillmentMethod: 'In-Store Pickup'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-05',
      total: 42.99,
      status: 'processing',
      items: 2,
      spiralsEarned: 2,
      fulfillmentMethod: 'Mall SPIRAL Center'
    }
  ];

  // Mock favorite stores
  const favoriteStores: FavoriteStore[] = [
    {
      id: '1',
      name: 'Local Roasters',
      category: 'Coffee & Tea',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop',
      rating: 4.8,
      distance: 0.3
    },
    {
      id: '2',
      name: 'Green Garden Market',
      category: 'Grocery',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
      rating: 4.6,
      distance: 0.8
    },
    {
      id: '3',
      name: 'Artisan Boutique',
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      rating: 4.9,
      distance: 1.2
    }
  ];

  const handleSaveProfile = () => {
    setEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
            My Account
          </h1>
          <p className="text-gray-600 text-lg font-['Inter']">
            Manage your profile, orders, and SPIRAL rewards in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 mb-6">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                  {profileData.name || 'Sarah Chen'}
                </h2>
                <p className="text-gray-600 mb-4 font-['Inter']">
                  {profileData.email || 'sarah@example.com'}
                </p>
                
                <div className="bg-gradient-to-r from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10 rounded-xl p-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--spiral-coral)] mb-1 font-['Poppins']">
                      {spiralBalance}
                    </p>
                    <p className="text-sm text-gray-600 font-['Inter']">Current SPIRALs</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                        {totalEarned}
                      </p>
                      <p className="text-xs text-gray-600 font-['Inter']">Total Earned</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                        {orders.length}
                      </p>
                      <p className="text-xs text-gray-600 font-['Inter']">Orders</p>
                    </div>
                  </div>

                  <Link href="/spirals">
                    <Button className="w-full mt-4 bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl">
                      View SPIRALs Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="orders" className="rounded-lg">Orders</TabsTrigger>
                <TabsTrigger value="favorites" className="rounded-lg">Favorites</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Recent Activity */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center">
                              <Gift className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">
                                {transaction.type === 'earned' ? 'Earned' : 'Redeemed'} {transaction.amount} SPIRALs
                              </p>
                              <p className="text-sm text-gray-600 font-['Inter']">{transaction.source}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 font-['Inter']">{transaction.date.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/products">
                        <Button variant="outline" className="h-20 flex flex-col items-center gap-2 border-[var(--spiral-sage)] hover:bg-[var(--spiral-sage)]/10">
                          <Package className="h-6 w-6" />
                          <span className="text-sm">Shop</span>
                        </Button>
                      </Link>
                      <Link href="/inventory-dashboard">
                        <Button variant="outline" className="h-20 flex flex-col items-center gap-2 border-[var(--spiral-sage)] hover:bg-[var(--spiral-sage)]/10">
                          <Bell className="h-6 w-6" />
                          <span className="text-sm">Inventory</span>
                        </Button>
                      </Link>
                      <Link href="/mall-directory">
                        <Button variant="outline" className="h-20 flex flex-col items-center gap-2 border-[var(--spiral-sage)] hover:bg-[var(--spiral-sage)]/10">
                          <Store className="h-6 w-6" />
                          <span className="text-sm">Find Stores</span>
                        </Button>
                      </Link>
                      <Link href="/spirals">
                        <Button variant="outline" className="h-20 flex flex-col items-center gap-2 border-[var(--spiral-sage)] hover:bg-[var(--spiral-sage)]/10">
                          <Gift className="h-6 w-6" />
                          <span className="text-sm">Use SPIRALs</span>
                        </Button>
                      </Link>
                      <SocialSharingEngine
                        type="account"
                        title="Join me on SPIRAL - discovering amazing local businesses!"
                        description="I'm loving my SPIRAL experience! Earning rewards while supporting local businesses in my community."
                        showEarningsPreview={true}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Invite Code System */}
                <InviteCodeSystem
                  userId={1}
                  userInviteCode="spiralchen247"
                  totalReferrals={7}
                  referralEarnings={350}
                />
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-600 font-['Inter']">
                                {new Date(order.date).toLocaleDateString()} • {order.fulfillmentMethod}
                              </p>
                            </div>
                            <Badge 
                              className={
                                order.status === 'delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 font-['Inter']">Total Amount</p>
                              <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">${order.total.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-['Inter']">Items</p>
                              <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">{order.items}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-['Inter']">SPIRALs Earned</p>
                              <p className="font-semibold text-[var(--spiral-coral)] font-['Inter']">{order.spiralsEarned}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Favorite Stores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoriteStores.map((store) => (
                        <div key={store.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                          <div className="flex items-start gap-4">
                            <img
                              src={store.image}
                              alt={store.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-[var(--spiral-navy)] mb-1 font-['Inter']">
                                {store.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 font-['Inter']">{store.category}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{store.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{store.distance} mi</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!editingProfile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-[var(--spiral-navy)] font-['Inter']">Name</Label>
                            <p className="text-gray-700 font-['Inter']">{profileData.name || 'Sarah Chen'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-[var(--spiral-navy)] font-['Inter']">Email</Label>
                            <p className="text-gray-700 font-['Inter']">{profileData.email || 'sarah@example.com'}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => setEditingProfile(true)}
                            variant="outline"
                            className="rounded-xl"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-sm font-medium text-[var(--spiral-navy)] font-['Inter']">Name</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                              className="rounded-xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium text-[var(--spiral-navy)] font-['Inter']">Email</Label>
                            <Input
                              id="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => setEditingProfile(false)}
                            variant="outline"
                            className="rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveProfile}
                            className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-[var(--spiral-navy)] font-['Inter']">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-600 font-['Inter']">
                          Order updates and SPIRAL activity
                        </p>
                      </div>
                      <Switch
                        checked={profileData.notifications.email}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: checked }
                          }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-[var(--spiral-navy)] font-['Inter']">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-gray-600 font-['Inter']">
                          Nearby deals and experiences
                        </p>
                      </div>
                      <Switch
                        checked={profileData.notifications.push}
                        onCheckedChange={(checked) => 
                          setProfileData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, push: checked }
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;