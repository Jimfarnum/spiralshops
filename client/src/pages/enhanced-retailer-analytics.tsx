import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, LineChart, PieChart, AreaChart, Area, Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download, RefreshCw, AlertTriangle, Info, Target, Activity, Zap, Eye, Star } from "lucide-react";

interface RetailerAnalyticsData {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  repeatCustomers: number;
  topProducts: Array<{ name: string; sales: number; units: number; id: string }>;
  salesByDay: Array<{ date: string; sales: number; id: string }>;
  categoryBreakdown: Array<{ category: string; percentage: number; amount: number; id: string }>;
  recentOrders: Array<any>;
  alerts: Array<{ type: string; message: string; priority: string; timestamp: string; id: string }>;
}

export default function EnhancedRetailerAnalytics() {
  const [timeframe, setTimeframe] = useState("30d");
  const [retailerId] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uniqueSessionId] = useState(() => `retailer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const { data: analyticsData, isLoading, refetch } = useQuery<RetailerAnalyticsData>({
    queryKey: [`/api/retailer/${retailerId}/analytics`, timeframe, uniqueSessionId],
    queryFn: async () => {
      const response = await fetch(`/api/retailer/${retailerId}/analytics?timeframe=${timeframe}&sessionId=${uniqueSessionId}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const data = await response.json();
      
      // Add unique IDs to all data items
      return {
        ...data,
        topProducts: data.topProducts?.map((product: any, index: number) => ({
          ...product,
          id: `product-${uniqueSessionId}-${index}`
        })) || [],
        salesByDay: data.salesByDay?.map((day: any, index: number) => ({
          ...day,
          id: `day-${uniqueSessionId}-${index}`
        })) || [],
        categoryBreakdown: data.categoryBreakdown?.map((cat: any, index: number) => ({
          ...cat,
          id: `category-${uniqueSessionId}-${index}`
        })) || [],
        alerts: data.alerts?.map((alert: any, index: number) => ({
          ...alert,
          id: `alert-${uniqueSessionId}-${index}`
        })) || []
      };
    },
    refetchInterval: 30000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/retailer/${retailerId}/analytics/export?timeframe=${timeframe}&sessionId=${uniqueSessionId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `retailer-analytics-${timeframe}-${uniqueSessionId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const ENHANCED_COLORS = ['#006d77', '#ff9f1c', '#e9c46a', '#f4a261', '#e76f51', '#2a9d8f', '#264653'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6" id={`loading-${uniqueSessionId}`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={`skeleton-${i}`} className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6" id={`retailer-analytics-${uniqueSessionId}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8" id={`header-${uniqueSessionId}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#006d77] to-[#2a9d8f] bg-clip-text text-transparent">
                📊 Enhanced Retailer Analytics
              </h1>
              <p className="text-slate-600 text-lg">Session ID: <code className="bg-slate-100 px-2 py-1 rounded text-sm">{uniqueSessionId}</code></p>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Updates Every 30s
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Target className="h-3 w-3 mr-1" />
                  Real-time Data
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-40 bg-white border-2 border-[#006d77]/20 focus:border-[#006d77]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="bg-[#006d77] hover:bg-[#004d55] text-white shadow-lg"
                id={`refresh-btn-${uniqueSessionId}`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                onClick={handleExport} 
                variant="outline"
                className="border-2 border-[#ff9f1c] text-[#ff9f1c] hover:bg-[#ff9f1c] hover:text-white"
                id={`export-btn-${uniqueSessionId}`}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id={`kpi-grid-${uniqueSessionId}`}>
          {[
            { 
              title: "Total Sales", 
              value: formatCurrency(analyticsData?.totalSales || 0), 
              icon: DollarSign, 
              change: "+12.5%", 
              color: "from-green-500 to-emerald-600",
              bgColor: "bg-green-50",
              id: `kpi-sales-${uniqueSessionId}`
            },
            { 
              title: "Total Orders", 
              value: analyticsData?.totalOrders?.toLocaleString() || "0", 
              icon: ShoppingCart, 
              change: "+8.2%", 
              color: "from-blue-500 to-cyan-600",
              bgColor: "bg-blue-50",
              id: `kpi-orders-${uniqueSessionId}`
            },
            { 
              title: "Avg Order Value", 
              value: formatCurrency(analyticsData?.avgOrderValue || 0), 
              icon: Target, 
              change: "+5.1%", 
              color: "from-purple-500 to-violet-600",
              bgColor: "bg-purple-50",
              id: `kpi-aov-${uniqueSessionId}`
            },
            { 
              title: "Repeat Customers", 
              value: analyticsData?.repeatCustomers?.toLocaleString() || "0", 
              icon: Users, 
              change: "+15.3%", 
              color: "from-orange-500 to-red-600",
              bgColor: "bg-orange-50",
              id: `kpi-repeat-${uniqueSessionId}`
            }
          ].map((kpi) => (
            <Card key={kpi.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" id={kpi.id}>
              <CardContent className="p-0">
                <div className={`h-2 bg-gradient-to-r ${kpi.color}`}></div>
                <div className={`p-6 ${kpi.bgColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${kpi.color} shadow-lg`}>
                      <kpi.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-white/70 text-slate-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {kpi.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6" id={`analytics-tabs-${uniqueSessionId}`}>
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-slate-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#006d77] data-[state=active]:text-white rounded-lg">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[#006d77] data-[state=active]:text-white rounded-lg">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#006d77] data-[state=active]:text-white rounded-lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-[#006d77] data-[state=active]:text-white rounded-lg">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6" id={`overview-tab-${uniqueSessionId}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Sales Chart */}
              <Card className="border-0 shadow-lg" id={`sales-chart-${uniqueSessionId}`}>
                <CardHeader className="bg-gradient-to-r from-[#006d77] to-[#2a9d8f] text-white rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <AreaChart className="h-5 w-5" />
                    Sales Performance Trend
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Daily sales over the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData?.salesByDay || []}>
                      <defs>
                        <linearGradient id={`salesGradient-${uniqueSessionId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#006d77" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#006d77" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #006d77', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [formatCurrency(Number(value)), 'Sales']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#006d77" 
                        strokeWidth={3}
                        fill={`url(#salesGradient-${uniqueSessionId})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Enhanced Category Breakdown */}
              <Card className="border-0 shadow-lg" id={`category-chart-${uniqueSessionId}`}>
                <CardHeader className="bg-gradient-to-r from-[#ff9f1c] to-[#f4a261] text-white rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Category Performance
                  </CardTitle>
                  <CardDescription className="text-orange-100">
                    Revenue distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData?.categoryBreakdown || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="percentage"
                        label={({ category, percentage }) => `${category} ${percentage}%`}
                      >
                        {(analyticsData?.categoryBreakdown || []).map((entry, index) => (
                          <Cell key={`cell-${entry.id || index}`} fill={ENHANCED_COLORS[index % ENHANCED_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value}%`, 
                          props.payload.category
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #ff9f1c', 
                          borderRadius: '12px' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6" id={`products-tab-${uniqueSessionId}`}>
            <Card className="border-0 shadow-lg" id={`top-products-${uniqueSessionId}`}>
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Products
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Best-selling products by revenue and units
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="space-y-4">
                  {(analyticsData?.topProducts || []).map((product, index) => (
                    <div key={product.id || `product-${index}`} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-purple-500">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.units} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(product.sales)}</p>
                        <Progress value={(product.sales / (analyticsData?.topProducts[0]?.sales || 1)) * 100} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6" id={`trends-tab-${uniqueSessionId}`}>
            <Card className="border-0 shadow-lg" id={`trends-analysis-${uniqueSessionId}`}>
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Trend Analysis
                </CardTitle>
                <CardDescription className="text-emerald-100">
                  Detailed trend visualization with insights
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData?.salesByDay || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #10b981', 
                        borderRadius: '12px' 
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Sales']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={4}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6" id={`alerts-tab-${uniqueSessionId}`}>
            <Card className="border-0 shadow-lg" id={`alerts-panel-${uniqueSessionId}`}>
              <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  System Alerts & Notifications
                </CardTitle>
                <CardDescription className="text-red-100">
                  Important updates and alerts for your store
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-red-50 to-pink-50">
                <div className="space-y-4">
                  {(analyticsData?.alerts || []).map((alert, index) => (
                    <div 
                      key={alert.id || `alert-${index}`} 
                      className={`p-4 rounded-xl border-l-4 ${
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        alert.type === 'error' ? 'bg-red-50 border-red-500' :
                        'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {alert.type === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          ) : alert.type === 'error' ? (
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{alert.message}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={alert.priority === 'high' ? 'destructive' : 'secondary'}
                          className="capitalize"
                        >
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6" id={`footer-${uniqueSessionId}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                Enhanced UI Active
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Eye className="h-3 w-3 mr-1" />
                Session: {uniqueSessionId.split('-').pop()}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}