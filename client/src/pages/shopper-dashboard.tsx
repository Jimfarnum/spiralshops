import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Star, 
  MapPin, 
  Gift, 
  Heart,
  TrendingUp,
  Award,
  Compass
} from 'lucide-react';

export default function ShopperDashboard() {
  const [spiralBalance, setSpiralBalance] = useState(247);
  const [recentOrders] = useState([
    { id: 1, store: "Bella's Boutique", total: 89.99, status: "Delivered", spirals: 4 },
    { id: 2, store: "Tech Corner", total: 199.99, status: "Processing", spirals: 10 },
  ]);

  const [nearbyStores] = useState([
    { id: 1, name: "Fresh Market", category: "Groceries", distance: "0.3 mi", rating: 4.8 },
    { id: 2, name: "Style Studio", category: "Fashion", distance: "0.5 mi", rating: 4.6 },
    { id: 3, name: "Book Nook", category: "Books", distance: "0.7 mi", rating: 4.9 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Shopper!
          </h1>
          <p className="text-gray-600">
            Discover local stores and earn SPIRALS with every purchase
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* SPIRAL Balance */}
            <Card className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Your SPIRAL Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold mb-2">{spiralBalance}</div>
                    <p className="text-teal-100">SPIRALs earned</p>
                  </div>
                  <Button className="bg-white text-teal-600 hover:bg-gray-100">
                    Redeem Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{order.store}</h3>
                        <p className="text-sm text-gray-600">${order.total}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                        <p className="text-sm text-teal-600 mt-1">+{order.spirals} SPIRALs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discover Stores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5" />
                  Discover Nearby Stores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {nearbyStores.map((store) => (
                    <div key={store.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{store.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {store.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {store.distance}
                        </div>
                        <Button size="sm" variant="outline">
                          Visit Store
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Stores
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  My Wishlist
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  Gift Cards
                </Button>
              </CardContent>
            </Card>

            {/* SPIRAL Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Your SPIRAL Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Gold Member</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {spiralBalance} / 500 SPIRALs to Platinum
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(spiralBalance / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Special Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800">Double SPIRALs Weekend</h4>
                    <p className="text-sm text-green-600">Earn 2x SPIRALs at participating stores</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800">New Store Bonus</h4>
                    <p className="text-sm text-blue-600">+50 SPIRALs for first purchase at new stores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}