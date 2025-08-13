import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, DollarSign, ShoppingCart, Users, 
  Repeat, Target, MapPin, Calendar, Download, RefreshCw 
} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface KPIData {
  retailer_id: string;
  range: { from: string | null; to: string | null };
  kpis: {
    revenue: number;
    orders: number;
    aov: number;
    gross_margin_pct: number;
    customers: number;
    repeat_rate_pct: number;
    clv_approx: number;
  };
  top_products: Array<{
    sku: string;
    title: string;
    qty: number;
    revenue: number;
  }>;
}

interface TimeseriesData {
  interval: string;
  series: Array<{
    bucket: string;
    revenue: number;
    orders: number;
  }>;
}

interface ZipTrendsData {
  trends: Array<{
    zip: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('timeseries');
  const [selectedRetailer, setSelectedRetailer] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [interval, setInterval] = useState<string>("daily");

  // Set default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  }, []);

  // Fetch retailers
  const { data: retailersData } = useQuery({
    queryKey: ['/api/analytics/retailers'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/retailers');
      return response.json();
    }
  });

  // Fetch KPIs
  const { data: kpisData, isLoading: kpisLoading, refetch: refetchKpis } = useQuery<KPIData>({
    queryKey: ['/api/analytics/kpis', selectedRetailer, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedRetailer !== "all") params.append('retailer_id', selectedRetailer);
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo) params.append('to', dateTo);
      
      const response = await fetch(`/api/analytics/kpis?${params}`);
      return response.json();
    },
    enabled: !!dateFrom && !!dateTo
  });

  // Fetch timeseries
  const { data: timeseriesData, refetch: refetchTimeseries } = useQuery<TimeseriesData>({
    queryKey: ['/api/analytics/timeseries', selectedRetailer, dateFrom, dateTo, interval],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedRetailer !== "all") params.append('retailer_id', selectedRetailer);
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo) params.append('to', dateTo);
      params.append('interval', interval);
      
      const response = await fetch(`/api/analytics/timeseries?${params}`);
      return response.json();
    },
    enabled: !!dateFrom && !!dateTo
  });

  // Fetch zip trends
  const { data: zipTrendsData, refetch: refetchZipTrends } = useQuery<ZipTrendsData>({
    queryKey: ['/api/analytics/zip-trends', dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo) params.append('to', dateTo);
      
      const response = await fetch(`/api/analytics/zip-trends?${params}`);
      return response.json();
    },
    enabled: !!dateFrom && !!dateTo
  });

  const handleRefresh = () => {
    refetchKpis();
    refetchTimeseries();
    refetchZipTrends();
  };

  const retailers = retailersData?.retailers || [];
  const kpis = kpisData?.kpis;
  const topProducts = kpisData?.top_products || [];
  const timeseries = timeseriesData?.series || [];
  const zipTrends = zipTrendsData?.trends || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">SPIRAL Retailer Intelligence Hub</p>
            </div>
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
              <SelectTrigger>
                <SelectValue placeholder="Select Retailer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Retailers</SelectItem>
                {retailers.map((retailer: any) => (
                  <SelectItem key={retailer.id} value={retailer.id}>
                    {retailer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From Date"
            />

            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To Date"
            />

            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger>
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${kpis.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {kpis.gross_margin_pct.toFixed(1)}% gross margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.orders}</div>
                <p className="text-xs text-muted-foreground">
                  ${kpis.aov.toFixed(2)} avg order value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.customers}</div>
                <p className="text-xs text-muted-foreground">
                  {kpis.repeat_rate_pct.toFixed(1)}% repeat rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CLV Est.</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${kpis.clv_approx.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">
                  Customer lifetime value
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeseries">Revenue Trends</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="geography">Geographic</TabsTrigger>
          </TabsList>

          <TabsContent value="timeseries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeseries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bucket" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Zip Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zipTrends.slice(0, 10).map((trend, index) => (
                    <div key={trend.zip} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{trend.zip}</Badge>
                        <span className="text-sm text-gray-600">{trend.orders} orders</span>
                      </div>
                      <div className="font-semibold">${trend.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}