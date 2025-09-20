import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Gift, 
  Eye, 
  Target,
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface WeeklyStat {
  week: string;
  spiralEarnings: number;
  userActivity: number;
  retailerSales: number;
  conversions: number;
}

interface TopProduct {
  id: string;
  name: string;
  views: number;
  clicks: number;
  store: string;
  category: string;
  conversionRate: number;
}

interface UserMetric {
  userId: string;
  name: string;
  spiralsEarned: number;
  spiralsRedeemed: number;
  totalPurchases: number;
  lastActive: string;
}

interface RetailerMetric {
  retailerId: string;
  name: string;
  totalSales: number;
  spiralsGenerated: number;
  products: number;
  conversionRate: number;
}

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock weekly data
  const weeklyStats: WeeklyStat[] = [
    { week: 'Jan 8-14', spiralEarnings: 1247, userActivity: 89, retailerSales: 12450, conversions: 156 },
    { week: 'Jan 1-7', spiralEarnings: 1089, userActivity: 76, retailerSales: 10890, conversions: 134 },
    { week: 'Dec 25-31', spiralEarnings: 1456, userActivity: 102, retailerSales: 14560, conversions: 189 },
    { week: 'Dec 18-24', spiralEarnings: 1678, userActivity: 125, retailerSales: 16780, conversions: 234 }
  ];

  // Mock top products
  const topProducts: TopProduct[] = [
    {
      id: '1',
      name: 'Artisan Coffee Blend',
      views: 1247,
      clicks: 189,
      store: 'Local Roasters',
      category: 'Beverages',
      conversionRate: 15.2
    },
    {
      id: '2',
      name: 'Handmade Pottery Bowl',
      views: 987,
      clicks: 145,
      store: 'Clay Studio',
      category: 'Home & Crafts',
      conversionRate: 14.7
    },
    {
      id: '3',
      name: 'Organic Honey',
      views: 856,
      clicks: 123,
      store: 'Riverside Farm',
      category: 'Food',
      conversionRate: 14.4
    },
    {
      id: '4',
      name: 'Vintage Leather Bag',
      views: 734,
      clicks: 98,
      store: 'Heritage Crafts',
      category: 'Fashion',
      conversionRate: 13.4
    },
    {
      id: '5',
      name: 'Sourdough Bread',
      views: 689,
      clicks: 87,
      store: 'Corner Bakery',
      category: 'Food',
      conversionRate: 12.6
    }
  ];

  // Mock user metrics
  const topUsers: UserMetric[] = [
    {
      userId: '1',
      name: 'Sarah Chen',
      spiralsEarned: 267,
      spiralsRedeemed: 145,
      totalPurchases: 23,
      lastActive: '2024-01-20'
    },
    {
      userId: '2',
      name: 'Mike Rodriguez',
      spiralsEarned: 234,
      spiralsRedeemed: 89,
      totalPurchases: 18,
      lastActive: '2024-01-19'
    },
    {
      userId: '3',
      name: 'Emily Watson',
      spiralsEarned: 198,
      spiralsRedeemed: 156,
      totalPurchases: 15,
      lastActive: '2024-01-20'
    }
  ];

  // Mock retailer metrics
  const topRetailers: RetailerMetric[] = [
    {
      retailerId: '1',
      name: 'Local Roasters',
      totalSales: 12450,
      spiralsGenerated: 567,
      products: 12,
      conversionRate: 18.7
    },
    {
      retailerId: '2',
      name: 'Clay Studio',
      totalSales: 8930,
      spiralsGenerated: 423,
      products: 28,
      conversionRate: 16.2
    },
    {
      retailerId: '3',
      name: 'Corner Bakery',
      totalSales: 7650,
      spiralsGenerated: 345,
      products: 15,
      conversionRate: 15.8
    }
  ];

  const currentWeek = weeklyStats[0];
  const previousWeek = weeklyStats[1];

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const overallConversionRate = 16.8;
  const totalActiveUsers = 127;
  const totalRetailers = 23;

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-['Inter']">
                Comprehensive insights into SPIRAL platform performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Total SPIRALs Earned</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    {currentWeek.spiralEarnings.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    {parseFloat(calculateGrowth(currentWeek.spiralEarnings, previousWeek.spiralEarnings)) > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${parseFloat(calculateGrowth(currentWeek.spiralEarnings, previousWeek.spiralEarnings)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateGrowth(currentWeek.spiralEarnings, previousWeek.spiralEarnings)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1 font-['Inter']">vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-coral)]/20 rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-[var(--spiral-coral)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Active Users</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    {totalActiveUsers}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {calculateGrowth(currentWeek.userActivity, previousWeek.userActivity)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1 font-['Inter']">vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-sage)]/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-[var(--spiral-sage)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Conversion Rate</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    {overallConversionRate}%
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">2.4%</span>
                    <span className="text-sm text-gray-500 ml-1 font-['Inter']">vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-gold)]/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-[var(--spiral-gold)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Total Sales</p>
                  <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    ${currentWeek.retailerSales.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {calculateGrowth(currentWeek.retailerSales, previousWeek.retailerSales)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1 font-['Inter']">vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[var(--spiral-navy)]/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-[var(--spiral-navy)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg">Products</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg">Users</TabsTrigger>
            <TabsTrigger value="retailers" className="rounded-lg">Retailers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Trends */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly SPIRAL Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyStats.slice(0, 4).map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">{stat.week}</p>
                          <p className="text-sm text-gray-600 font-['Inter']">{stat.userActivity} active users</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-[var(--spiral-coral)] font-['Poppins']">
                            {stat.spiralEarnings.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 font-['Inter']">SPIRALs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Metrics */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Conversion Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[var(--spiral-sage)]/10 rounded-lg p-4">
                        <p className="text-2xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                          {currentWeek.conversions}
                        </p>
                        <p className="text-sm text-gray-600 font-['Inter']">Conversions This Week</p>
                      </div>
                      <div className="bg-[var(--spiral-coral)]/10 rounded-lg p-4">
                        <p className="text-2xl font-bold text-[var(--spiral-sage)] font-['Poppins']">
                          {overallConversionRate}%
                        </p>
                        <p className="text-sm text-gray-600 font-['Inter']">Overall Rate</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-['Inter']">
                        <span>Product Views</span>
                        <span>7,234</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[var(--spiral-sage)] h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm font-['Inter']">
                        <span>Add to Cart</span>
                        <span>2,156</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[var(--spiral-coral)] h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm font-['Inter']">
                        <span>Checkout Complete</span>
                        <span>1,214</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[var(--spiral-navy)] h-2 rounded-full" style={{ width: '17%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Top Performing Products
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Products with highest views and conversion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-['Inter']">
                              {product.store} • {product.category}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-[var(--spiral-sage)]/20 text-[var(--spiral-sage)]">
                          {product.conversionRate}% conversion
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                            {product.views.toLocaleString()}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-coral)] font-['Poppins']">
                            {product.clicks.toLocaleString()}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-sage)] font-['Poppins']">
                            {Math.round(product.clicks * product.conversionRate / 100)}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Sales</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top SPIRAL Users
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Most active users in the SPIRAL community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.map((user, index) => (
                    <div key={user.userId} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--spiral-gold)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-['Inter']">
                              Last active: {user.lastActive}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {user.totalPurchases} purchases
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-coral)] font-['Poppins']">
                            {user.spiralsEarned}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Earned</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-sage)] font-['Poppins']">
                            {user.spiralsRedeemed}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Redeemed</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                            {user.spiralsEarned - user.spiralsRedeemed}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Balance</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retailers Tab */}
          <TabsContent value="retailers" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Retailers
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Best performing retailers on the SPIRAL platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRetailers.map((retailer, index) => (
                    <div key={retailer.retailerId} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--spiral-navy)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                              {retailer.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-['Inter']">
                              {retailer.products} products listed
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-[var(--spiral-coral)]/20 text-[var(--spiral-coral)]">
                          {retailer.conversionRate}% conversion
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                            ${retailer.totalSales.toLocaleString()}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Sales</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-coral)] font-['Poppins']">
                            {retailer.spiralsGenerated}
                          </p>
                          <p className="text-gray-600 font-['Inter']">SPIRALs Generated</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-[var(--spiral-sage)] font-['Poppins']">
                            {retailer.products}
                          </p>
                          <p className="text-gray-600 font-['Inter']">Products</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;