import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import SocialSharingEngine from '@/components/social-sharing-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Star, 
  Package, 
  Heart, 
  Bell, 
  MapPin, 
  Calendar, 
  CreditCard,
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
      category: 'Food & Beverage',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
      rating: 4.8,
      distance: 0.8
    },
    {
      id: '2',
      name: 'Pottery Studio',
      category: 'Home & Crafts',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
      rating: 4.9,
      distance: 1.2
    }
  ];

  const handleSaveProfile = () => {
    // This would typically save to backend
    setEditingProfile(false);
    toast({
      title: "Profile updated!",
      description: "Your account information has been saved.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] font-['Poppins']">My Account</h1>
          <p className="text-gray-600 mt-2 text-lg font-['Inter']">Manage your SPIRAL profile and activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader className="text-center bg-gradient-to-r from-[var(--spiral-sage)]/20 to-[var(--spiral-coral)]/20">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  {user?.name || 'SPIRAL Member'}
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Active since January 2024
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-[var(--spiral-sage)]/10 rounded-lg p-4">
                      <p className="text-3xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                        {spiralBalance}
                      </p>
                      <p className="text-sm text-gray-600 font-['Inter']">Current SPIRALs</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
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
                    <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl">
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
                        <div key={order.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                              <div>
                                <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                                  Order {order.id}
                                </p>
                                <p className="text-sm text-gray-600 font-['Inter']">
                                  {order.date} • {order.items} items
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                                ${order.total.toFixed(2)}
                              </p>
                              <p className="text-sm text-[var(--spiral-coral)] font-['Inter']">
                                +{order.spiralsEarned} SPIRALs
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="capitalize">
                              {order.status}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-['Inter']">
                              <MapPin className="h-4 w-4" />
                              {order.fulfillmentMethod}
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
                        <div key={store.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <img
                              src={store.image}
                              alt={store.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                                {store.name}
                              </h3>
                              <p className="text-sm text-gray-600 font-['Inter']">{store.category}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                  <span className="text-sm">{store.rating}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {store.distance} miles
                                </div>
                              </div>
                            </div>
                            <Link href={`/store/${store.id}`}>
                              <Button variant="outline" size="sm" className="rounded-lg">
                                Visit
                              </Button>
                            </Link>
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
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingProfile(!editingProfile)}
                        className="rounded-lg"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        {editingProfile ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 font-['Inter']">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!editingProfile}
                          className="mt-1 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-['Inter']">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!editingProfile}
                          className="mt-1 rounded-lg"
                        />
                      </div>
                    </div>

                    {editingProfile && (
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSaveProfile}
                          className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl"
                        >
                          Save Changes
                        </Button>
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