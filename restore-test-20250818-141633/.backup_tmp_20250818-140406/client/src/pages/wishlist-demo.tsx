import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Heart, 
  Bell, 
  TrendingDown, 
  Package, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const WishlistDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL Wishlist & Price Alerts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your favorite products and get instant notifications for price drops and restocks. 
            Never miss a deal again with our intelligent alert system.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Smart Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Save products you love and organize them with custom alert preferences
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Price Drop Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get notified instantly when prices drop on your wishlist items
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Restock Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Be the first to know when out-of-stock items are available again
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Data Examples */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* Sample Wishlist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Your Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Wireless Bluetooth Headphones",
                  price: 299.99,
                  originalPrice: 349.99,
                  inStock: true,
                  priceDropAlert: true,
                  restockAlert: true
                },
                {
                  name: "Smart Fitness Tracker",
                  price: 159.99,
                  inStock: false,
                  priceDropAlert: false,
                  restockAlert: true
                },
                {
                  name: "Portable Phone Charger",
                  price: 89.99,
                  inStock: true,
                  priceDropAlert: true,
                  restockAlert: false
                }
              ].map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">${item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                        <Badge variant={item.inStock ? 'default' : 'secondary'}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4" />
                      Price drops: {item.priceDropAlert ? 'On' : 'Off'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Restocks: {item.restockAlert ? 'On' : 'Off'}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sample Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-start gap-3">
                  <TrendingDown className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Price Drop Alert!</h4>
                    <p className="text-sm text-gray-600">Wireless Bluetooth Headphones</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm line-through text-gray-500">$349.99</span>
                      <span className="text-sm font-semibold text-green-600">$299.99</span>
                      <Badge variant="outline" className="text-green-600">-14%</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Back in Stock!</h4>
                    <p className="text-sm text-gray-600">Smart Fitness Tracker</p>
                    <p className="text-sm text-blue-600">Now available for $159.99</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-orange-50">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Limited Time Offer</h4>
                    <p className="text-sm text-gray-600">Special discount on Portable Phone Charger</p>
                    <p className="text-sm text-orange-600">Extra 10% off this weekend</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Complete Feature Set
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time price monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Instant email notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Customizable alert preferences</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Price history tracking</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Stock availability alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Percentage discount calculations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Multiple notification channels</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Wishlist sharing capabilities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Try the Live Wishlist System
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Experience the full functionality with real price tracking and alerts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/wishlist-alerts">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Live Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Implementation Note */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">Technical Implementation</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Schema Structure:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>WishlistItems table with JSONB alert preferences</li>
                <li>PriceAlerts table for tracking notifications</li>
                <li>Real-time price monitoring system</li>
                <li>Percentage change calculations</li>
              </ul>
            </div>
            <div>
              <p><strong>API Endpoints:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>POST /api/wishlist/add - Add items with preferences</li>
                <li>GET /api/wishlist/:shopperId - Retrieve wishlist</li>
                <li>GET /api/alerts/:shopperId - Get pending alerts</li>
                <li>POST /api/products/simulate-price-change - Testing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistDemo;