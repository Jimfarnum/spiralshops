import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Heart, Users, Store, Star, TrendingUp, Bell, Settings } from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import { FollowedStoresList } from "@/components/FollowedStoresList";
import { PopularStores } from "@/components/PopularStores";

export default function RetailerFollowDemo() {
  const [currentUserId] = useState(1);
  
  // Mock user preferences
  const [preferences, setPreferences] = useState({
    newProductNotifications: true,
    saleNotifications: true,
    eventNotifications: true,
    weeklyDigest: false,
  });

  // Mock featured stores data
  const featuredStores = [
    {
      id: 1,
      name: "Downtown Books & Coffee",
      description: "Local bookstore with artisan coffee and cozy reading spaces. We specialize in rare books and host weekly reading clubs.",
      category: "Books & Coffee",
      rating: 4.8,
      address: "123 Main St, Downtown",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Fresh Garden Market",
      description: "Organic produce and fresh flowers from local farms. Supporting sustainable agriculture in our community.",
      category: "Grocery & Fresh",
      rating: 4.9,
      address: "456 Green Ave, Uptown",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Vintage Threads Boutique",
      description: "Curated vintage clothing and accessories. Unique pieces from different eras, sustainably sourced.",
      category: "Fashion & Vintage",
      rating: 4.7,
      address: "789 Style Blvd, Arts District",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    },
  ];

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Retailer Follow System</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow your favorite local stores to get personalized updates on new products, exclusive sales, 
            and special events. Build connections with businesses you love and never miss out on great deals!
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Discover Stores
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Following
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Discover Stores Tab */}
          <TabsContent value="discover" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredStores.map((store) => (
                <Card key={store.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={store.imageUrl} 
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{store.name}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{store.rating}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {store.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {store.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">{store.address}</p>
                    
                    <div className="flex gap-2">
                      <FollowButton
                        userId={currentUserId}
                        followType="store"
                        followId={store.id}
                        storeName={store.name}
                        className="flex-1"
                      />
                      <Button variant="outline" size="default">
                        Visit Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="mt-6">
            <FollowedStoresList 
              userId={currentUserId}
              followType="store"
              className="max-w-4xl mx-auto"
            />
          </TabsContent>

          {/* Popular Stores Tab */}
          <TabsContent value="popular" className="mt-6">
            <PopularStores
              userId={currentUserId}
              limit={15}
              className="max-w-4xl mx-auto"
            />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <p className="text-gray-600">
                  Control how and when you receive updates from stores you follow.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Product Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Get notified when followed stores add new products
                    </p>
                  </div>
                  <Switch
                    checked={preferences.newProductNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('newProductNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sale Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Be the first to know about discounts and special offers
                    </p>
                  </div>
                  <Switch
                    checked={preferences.saleNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('saleNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Event Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Stay updated on store events, workshops, and community gatherings
                    </p>
                  </div>
                  <Switch
                    checked={preferences.eventNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('eventNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-gray-600">
                      Receive a weekly summary of activity from all followed stores
                    </p>
                  </div>
                  <Switch
                    checked={preferences.weeklyDigest}
                    onCheckedChange={(checked) => handlePreferenceChange('weeklyDigest', checked)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Feature Benefits */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Follow Local Stores?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Stay Informed</h3>
              <p className="text-gray-600 text-sm">
                Get real-time notifications about new arrivals, flash sales, and exclusive offers from your favorite stores.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Support Local</h3>
              <p className="text-gray-600 text-sm">
                Build meaningful connections with local business owners and help strengthen your community economy.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Personalized Experience</h3>
              <p className="text-gray-600 text-sm">
                Customize your notification preferences and discover products tailored to your interests and shopping habits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}