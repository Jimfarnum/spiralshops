import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, LineChart, PieChart, AreaChart, Area, Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Store, Users, Activity, Download, RefreshCw, AlertTriangle, Info, Crown, MapPin, Clock, Star, Zap, Eye } from "lucide-react";

interface MallAnalyticsData {
  totalRevenue: number;
  totalStores: number;
  totalOrders: number;
  avgOrderValue: number;
  topStores: Array<{ name: string; revenue: number; orders: number; growth: number; id: string }>;
  revenueByCategory: Array<{ category: string; revenue: number; percentage: number; id: string }>;
  footTrafficByHour: Array<{ hour: number; visitors: number; id: string }>;
  loyaltyMetrics: {
    totalMembers: number;
    pointsIssued: number;
    pointsRedeemed: number;
    topEarners: Array<{ name: string; points: number; tier: string; id: string }>;
  };
  liveOrders: Array<any>;
  systemAlerts: Array<{ type: string; message: string; priority: string; timestamp: string; id: string }>;
}

export default function EnhancedMallAnalytics() {
  const [mallId] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [uniqueSessionId] = useState(() => `mall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const { data: analyticsData, isLoading, refetch } = useQuery<MallAnalyticsData>({
    queryKey: [`/api/mall/${mallId}/analytics`, uniqueSessionId],
    queryFn: async () => {
      const response = await fetch(`/api/mall/${mallId}/analytics?sessionId=${uniqueSessionId}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const data = await response.json();
      
      // Add unique IDs to all data items
      return {
        ...data,
        topStores: data.topStores?.map((store: any, index: number) => ({
          ...store,
          id: `store-${uniqueSessionId}-${index}`
        })) || [],
        revenueByCategory: data.revenueByCategory?.map((cat: any, index: number) => ({
          ...cat,
          id: `category-${uniqueSessionId}-${index}`
        })) || [],
        footTrafficByHour: data.footTrafficByHour?.map((hour: any, index: number) => ({
          ...hour,
          id: `hour-${uniqueSessionId}-${index}`
        })) || [],
        loyaltyMetrics: {
          ...data.loyaltyMetrics,
          topEarners: data.loyaltyMetrics?.topEarners?.map((earner: any, index: number) => ({
            ...earner,
            id: `earner-${uniqueSessionId}-${index}`
          })) || []
        },
        systemAlerts: data.systemAlerts?.map((alert: any, index: number) => ({
          ...alert,
          id: `alert-${uniqueSessionId}-${index}`
        })) || []
      };
    },
    refetchInterval: 30000,
  });

  const { data: liveOrders } = useQuery({
    queryKey: ['/api/live-orders', mallId, uniqueSessionId],
    queryFn: async () => {
      const response = await fetch(`/api/live-orders?mallId=${mallId}&limit=10&sessionId=${uniqueSessionId}`);
      if (!response.ok) throw new Error("Failed to fetch live orders");
      const data = await response.json();
      return data.map((order: any, index: number) => ({
        ...order,
        id: `order-${uniqueSessionId}-${index}`
      }));
    },
    refetchInterval: 5000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/mall/${mallId}/analytics/export?sessionId=${uniqueSessionId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mall-analytics-${mallId}-${uniqueSessionId}.csv`;
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6" id={`loading-${uniqueSessionId}`}>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6" id={`mall-analytics-${uniqueSessionId}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8" id={`header-${uniqueSessionId}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🏬 Enhanced Mall Analytics Dashboard
              </h1>
              <p className="text-slate-600 text-lg">Mall ID: <code className="bg-slate-100 px-2 py-1 rounded text-sm">{mallId}</code> | Session: <code className="bg-slate-100 px-2 py-1 rounded text-sm">{uniqueSessionId}</code></p>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Updates Every 30s
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Last: {lastUpdate.toLocaleTimeString()}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                id={`refresh-btn-${uniqueSessionId}`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                onClick={handleExport} 
                variant="outline"
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                id={`export-btn-${uniqueSessionId}`}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id={`kpi-grid-${uniqueSessionId}`}>
          {[
            { 
              title: "Total Revenue", 
              value: formatCurrency(analyticsData?.totalRevenue || 0), 
              icon: DollarSign, 
              change: "+18.2%", 
              color: "from-green-500 to-emerald-600",
              bgColor: "bg-green-50",
              id: `kpi-revenue-${uniqueSessionId}`
            },
            { 
              title: "Active Stores", 
              value: analyticsData?.totalStores?.toLocaleString() || "0", 
              icon: Store, 
              change: "+5 this month", 
              color: "from-blue-500 to-cyan-600",
              bgColor: "bg-blue-50",
              id: `kpi-stores-${uniqueSessionId}`
            },
            { 
              title: "Total Orders", 
              value: analyticsData?.totalOrders?.toLocaleString() || "0", 
              icon: Activity, 
              change: "+22.5%", 
              color: "from-purple-500 to-violet-600",
              bgColor: "bg-purple-50",
              id: `kpi-orders-${uniqueSessionId}`
            },
            { 
              title: "Avg Order Value", 
              value: formatCurrency(analyticsData?.avgOrderValue || 0), 
              icon: TrendingUp, 
              change: "+12.1%", 
              color: "from-orange-500 to-red-600",
              bgColor: "bg-orange-50",
              id: `kpi-aov-${uniqueSessionId}`
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

        {/* Enhanced Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6" id={`analytics-tabs-${uniqueSessionId}`}>
          <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-slate-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
              <Store className="h-4 w-4 mr-2" />
              Stores
            </TabsTrigger>
            <TabsTrigger value="traffic" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
              <Users className="h-4 w-4 mr-2" />
              Traffic
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
              <Star className="h-4 w-4 mr-2" />
              Loyalty
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg">
              <Zap className="h-4 w-4 mr-2" />
              Live Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6" id={`overview-tab-${uniqueSessionId}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Category */}
              <Card className="border-0 shadow-lg" id={`revenue-chart-${uniqueSessionId}`}>
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue by Category
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Mall revenue distribution across categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData?.revenueByCategory || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        paddingAngle={5}
                        dataKey="percentage"
                        label={({ category, percentage }) => `${category} ${percentage}%`}
                      >
                        {(analyticsData?.revenueByCategory || []).map((entry, index) => (
                          <Cell key={`cell-${entry.id || index}`} fill={ENHANCED_COLORS[index % ENHANCED_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value}% (${formatCurrency(props.payload.revenue)})`, 
                          props.payload.category
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #6366f1', 
                          borderRadius: '12px' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Foot Traffic */}
              <Card className="border-0 shadow-lg" id={`traffic-chart-${uniqueSessionId}`}>
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <AreaChart className="h-5 w-5" />
                    Foot Traffic by Hour
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Hourly visitor patterns throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-br from-green-50 to-teal-50">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData?.footTrafficByHour || []}>
                      <defs>
                        <linearGradient id={`trafficGradient-${uniqueSessionId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #10b981', 
                          borderRadius: '12px' 
                        }}
                        formatter={(value) => [`${value} visitors`, 'Traffic']}
                        labelFormatter={(hour) => `${hour}:00`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="visitors" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fill={`url(#trafficGradient-${uniqueSessionId})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stores" className="space-y-6" id={`stores-tab-${uniqueSessionId}`}>
            <Card className="border-0 shadow-lg" id={`top-stores-${uniqueSessionId}`}>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Top Performing Stores
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Store performance rankings and growth metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="space-y-4">
                  {(analyticsData?.topStores || []).map((store, index) => (
                    <div key={store.id || `store-${index}`} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-500">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{store.name}</h4>
                          <p className="text-sm text-gray-600">{store.orders} orders</p>
                          <Badge 
                            variant={store.growth > 0 ? 'default' : 'secondary'} 
                            className="mt-1"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {store.growth > 0 ? '+' : ''}{store.growth}%
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(store.revenue)}</p>
                        <Progress value={(store.revenue / (analyticsData?.topStores[0]?.revenue || 1)) * 100} className="w-24 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6" id={`traffic-tab-${uniqueSessionId}`}>
            <Card className="border-0 shadow-lg" id={`traffic-details-${uniqueSessionId}`}>
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Detailed Traffic Analysis
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Comprehensive visitor flow and patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData?.footTrafficByHour || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #ea580c', 
                        borderRadius: '12px' 
                      }}
                      formatter={(value) => [`${value} visitors`, 'Traffic']}
                      labelFormatter={(hour) => `${hour}:00`}
                    />
                    <Bar dataKey="visitors" fill="#ea580c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6" id={`loyalty-tab-${uniqueSessionId}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg" id={`loyalty-stats-${uniqueSessionId}`}>
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Loyalty Program Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{analyticsData?.loyaltyMetrics?.totalMembers?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Members</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-pink-600">{analyticsData?.loyaltyMetrics?.pointsIssued?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Points Issued</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg" id={`top-earners-${uniqueSessionId}`}>
                <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Top SPIRAL Earners
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <div className="space-y-3">
                    {(analyticsData?.loyaltyMetrics?.topEarners || []).map((earner, index) => (
                      <div key={earner.id || `earner-${index}`} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{earner.name}</p>
                            <Badge variant="outline">{earner.tier}</Badge>
                          </div>
                        </div>
                        <p className="font-bold text-orange-600">{earner.points.toLocaleString()} pts</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-6" id={`live-tab-${uniqueSessionId}`}>
            <Card className="border-0 shadow-lg" id={`live-orders-${uniqueSessionId}`}>
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Live Order Activity
                </CardTitle>
                <CardDescription className="text-green-100">
                  Real-time orders across all mall stores
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="space-y-4">
                  {(liveOrders || []).length > 0 ? (
                    (liveOrders || []).map((order, index) => (
                      <div key={order.id || `order-${index}`} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{order.customer_name}</p>
                            <p className="text-sm text-gray-600">{order.item_count} items</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(order.amount)}</p>
                          <p className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No live orders currently. Orders will appear here in real-time.</p>
                    </div>
                  )}
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
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Eye className="h-3 w-3 mr-1" />
                Session: {uniqueSessionId.split('-').pop()}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <MapPin className="h-3 w-3 mr-1" />
                Mall ID: {mallId}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}