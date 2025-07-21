import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Star, 
  Eye, 
  Heart, 
  Share2,
  Calendar,
  Download,
  Target,
  Award,
  MapPin,
  Clock
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RetailerAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedStore] = useState('artisan-corner');

  // Mock analytics data
  const summaryStats = {
    totalRevenue: 28459,
    revenueChange: 12.5,
    totalOrders: 247,
    ordersChange: 8.3,
    avgOrderValue: 115.2,
    avgOrderChange: 3.7,
    newCustomers: 89,
    customersChange: 15.2,
    spiralsAwarded: 2847,
    spiralsChange: 18.4,
    conversionRate: 3.2,
    conversionChange: -0.8,
    repeatCustomerRate: 67.5,
    repeatChange: 5.1,
    socialShares: 156,
    sharesChange: 23.6
  };

  const revenueData = [
    { month: 'Jan', revenue: 18500, orders: 145, customers: 92 },
    { month: 'Feb', revenue: 22100, orders: 178, customers: 108 },
    { month: 'Mar', revenue: 25300, orders: 201, customers: 125 },
    { month: 'Apr', revenue: 28459, orders: 247, customers: 156 },
    { month: 'May', revenue: 31200, orders: 289, customers: 178 },
    { month: 'Jun', revenue: 29800, orders: 265, customers: 162 }
  ];

  const categoryData = [
    { name: 'Handmade Jewelry', value: 45, revenue: 12867 },
    { name: 'Art Supplies', value: 25, revenue: 7115 },
    { name: 'Custom Crafts', value: 20, revenue: 5692 },
    { name: 'Workshops', value: 10, revenue: 2785 }
  ];

  const spiralData = [
    { week: 'Week 1', earned: 680, redeemed: 245 },
    { week: 'Week 2', earned: 720, redeemed: 298 },
    { week: 'Week 3', earned: 845, redeemed: 356 },
    { week: 'Week 4', earned: 602, redeemed: 189 }
  ];

  const customerEngagement = [
    { metric: 'Profile Views', value: 1245, change: 8.2 },
    { metric: 'Product Clicks', value: 3567, change: 12.4 },
    { metric: 'Store Followers', value: 289, change: 15.7 },
    { metric: 'Review Rating', value: 4.8, change: 0.2 }
  ];

  const topProducts = [
    { name: 'Custom Engagement Ring', sales: 45, revenue: 6750, spirals: 675 },
    { name: 'Artisan Necklace Set', sales: 38, revenue: 4560, spirals: 456 },
    { name: 'Handmade Earrings', sales: 52, revenue: 3120, spirals: 312 },
    { name: 'Jewelry Workshop', sales: 15, revenue: 2250, spirals: 450 },
    { name: 'Custom Bracelet', sales: 29, revenue: 2175, spirals: 217 }
  ];

  const colors = ['#E27D60', '#2C3E50', '#A8BFAA', '#F4B860'];

  const StatCard = ({ title, value, change, icon: Icon, format = 'number' }: any) => {
    const isPositive = change >= 0;
    const formattedValue = format === 'currency' ? `$${value.toLocaleString()}` : 
                          format === 'percentage' ? `${value}%` : 
                          value.toLocaleString();

    return (
      <Card className="section-box">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-[var(--spiral-navy)]">{formattedValue}</p>
            </div>
            <div className="text-right">
              <Icon className="h-8 w-8 text-[var(--spiral-coral)] mb-2" />
              <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {Math.abs(change)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <main className="section-modern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">Artisan Corner - Downtown District</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="default" className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-navy)]">
                  <a href="/retailer-insights" className="flex items-center gap-2 text-white">
                    AI Insights
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Revenue" 
              value={summaryStats.totalRevenue} 
              change={summaryStats.revenueChange} 
              icon={DollarSign}
              format="currency"
            />
            <StatCard 
              title="Total Orders" 
              value={summaryStats.totalOrders} 
              change={summaryStats.ordersChange} 
              icon={ShoppingCart}
            />
            <StatCard 
              title="New Customers" 
              value={summaryStats.newCustomers} 
              change={summaryStats.customersChange} 
              icon={Users}
            />
            <StatCard 
              title="SPIRALs Awarded" 
              value={summaryStats.spiralsAwarded} 
              change={summaryStats.spiralsChange} 
              icon={Award}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Avg Order Value" 
              value={summaryStats.avgOrderValue} 
              change={summaryStats.avgOrderChange} 
              icon={Target}
              format="currency"
            />
            <StatCard 
              title="Conversion Rate" 
              value={summaryStats.conversionRate} 
              change={summaryStats.conversionChange} 
              icon={TrendingUp}
              format="percentage"
            />
            <StatCard 
              title="Repeat Customers" 
              value={summaryStats.repeatCustomerRate} 
              change={summaryStats.repeatChange} 
              icon={Heart}
              format="percentage"
            />
            <StatCard 
              title="Social Shares" 
              value={summaryStats.socialShares} 
              change={summaryStats.sharesChange} 
              icon={Share2}
            />
          </div>

          <Tabs defaultValue="revenue" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="revenue">Revenue & Orders</TabsTrigger>
              <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
              <TabsTrigger value="products">Product Performance</TabsTrigger>
              <TabsTrigger value="spirals">SPIRAL Activity</TabsTrigger>
            </TabsList>

            {/* Revenue & Orders Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="section-box">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#E27D60" fill="#E27D60" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="section-box">
                  <CardHeader>
                    <CardTitle>Order Volume</CardTitle>
                    <CardDescription>Number of orders processed monthly</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#2C3E50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="section-box">
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Revenue breakdown by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                      {categoryData.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="font-medium text-gray-700">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-[var(--spiral-navy)]">${category.revenue.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{category.value}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customer Analytics Tab */}
            <TabsContent value="customers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="section-box">
                  <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                    <CardDescription>New vs returning customers over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="customers" stroke="#E27D60" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="section-box">
                  <CardHeader>
                    <CardTitle>Customer Engagement</CardTitle>
                    <CardDescription>Key engagement metrics and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customerEngagement.map((metric, index) => (
                        <div key={metric.metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{metric.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--spiral-navy)]">{metric.value}</span>
                            <Badge variant={metric.change >= 0 ? "default" : "destructive"} className="text-xs">
                              {metric.change >= 0 ? '+' : ''}{metric.change}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Product Performance Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card className="section-box">
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>Best sellers by revenue and units sold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-[var(--spiral-coral)] text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-[var(--spiral-navy)]">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.sales} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[var(--spiral-navy)]">${product.revenue.toLocaleString()}</div>
                          <div className="text-sm text-[var(--spiral-coral)]">{product.spirals} SPIRALs awarded</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SPIRAL Activity Tab */}
            <TabsContent value="spirals" className="space-y-6">
              <Card className="section-box">
                <CardHeader>
                  <CardTitle>SPIRAL Points Activity</CardTitle>
                  <CardDescription>SPIRALs earned vs redeemed by customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={spiralData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="earned" fill="#E27D60" name="SPIRALs Earned" />
                      <Bar dataKey="redeemed" fill="#A8BFAA" name="SPIRALs Redeemed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="section-box bg-gradient-to-br from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-[var(--spiral-coral)] mx-auto mb-4" />
                    <h3 className="font-bold text-xl text-[var(--spiral-navy)] mb-2">2,847</h3>
                    <p className="text-gray-600">Total SPIRALs Awarded</p>
                    <p className="text-sm text-[var(--spiral-coral)] mt-2">+18.4% this month</p>
                  </CardContent>
                </Card>

                <Card className="section-box bg-gradient-to-br from-[var(--spiral-sage)]/10 to-[var(--spiral-navy)]/10">
                  <CardContent className="p-6 text-center">
                    <Star className="h-12 w-12 text-[var(--spiral-sage)] mx-auto mb-4" />
                    <h3 className="font-bold text-xl text-[var(--spiral-navy)] mb-2">1,088</h3>
                    <p className="text-gray-600">SPIRALs Redeemed</p>
                    <p className="text-sm text-[var(--spiral-sage)] mt-2">38% redemption rate</p>
                  </CardContent>
                </Card>

                <Card className="section-box bg-gradient-to-br from-[var(--spiral-gold)]/10 to-[var(--spiral-coral)]/10">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 text-[var(--spiral-gold)] mx-auto mb-4" />
                    <h3 className="font-bold text-xl text-[var(--spiral-navy)] mb-2">4.8</h3>
                    <p className="text-gray-600">Customer Satisfaction</p>
                    <p className="text-sm text-[var(--spiral-gold)] mt-2">Based on 247 reviews</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}