import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Shield, 
  Zap,
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  Upload
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  orders?: number;
  customers?: number;
}

export default function EnterpriseDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [customerData, setCustomerData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Simulate data loading
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = () => {
    // Simulate dashboard metrics
    setMetrics([
      {
        title: "Total Revenue",
        value: "$2.4M",
        change: "+18.2%",
        trend: "up",
        icon: <DollarSign className="w-5 h-5" />
      },
      {
        title: "Active Stores",
        value: "1,247",
        change: "+12.5%",
        trend: "up",
        icon: <ShoppingCart className="w-5 h-5" />
      },
      {
        title: "Platform Users",
        value: "89,234",
        change: "+24.1%",
        trend: "up",
        icon: <Users className="w-5 h-5" />
      },
      {
        title: "Global Reach",
        value: "23 Countries",
        change: "+2 new",
        trend: "up",
        icon: <Globe className="w-5 h-5" />
      }
    ]);

    // Simulate chart data
    setRevenueData([
      { name: 'Jan', revenue: 180000, orders: 1200, customers: 3400 },
      { name: 'Feb', revenue: 200000, orders: 1350, customers: 3800 },
      { name: 'Mar', revenue: 220000, orders: 1400, customers: 4200 },
      { name: 'Apr', revenue: 240000, orders: 1600, customers: 4600 },
      { name: 'May', revenue: 250000, orders: 1750, customers: 5000 },
      { name: 'Jun', revenue: 280000, orders: 1900, customers: 5400 }
    ]);

    setCustomerData([
      { name: 'Enterprise', value: 35, customers: 23500 },
      { name: 'Professional', value: 40, customers: 31200 },
      { name: 'Basic', value: 25, customers: 18900 }
    ]);
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const systemStatus = [
    { name: "Payment Processing", status: "operational", uptime: "99.9%" },
    { name: "AI Analytics", status: "operational", uptime: "99.8%" },
    { name: "API Gateway", status: "operational", uptime: "99.9%" },
    { name: "Database Cluster", status: "maintenance", uptime: "99.7%" }
  ];

  const recentActivities = [
    { type: "deployment", message: "New AI features deployed to production", time: "2 hours ago" },
    { type: "alert", message: "High traffic detected in North America region", time: "4 hours ago" },
    { type: "update", message: "Security patches applied to all instances", time: "6 hours ago" },
    { type: "integration", message: "New Shopify integration approved", time: "8 hours ago" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Enterprise Command Center</h1>
            <p className="text-gray-600">Real-time platform monitoring and business intelligence</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {metric.icon}
                    <div>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(metric.trend)}
                    <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Customer Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}%`}
                      >
                        {customerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Growth Metrics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Growth Metrics Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                      <Bar dataKey="customers" fill="#82ca9d" name="New Customers" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Operational Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Average Response Time</p>
                      <p className="text-2xl font-bold">127ms</p>
                      <Progress value={85} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Error Rate</p>
                      <p className="text-2xl font-bold">0.02%</p>
                      <Progress value={98} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Throughput</p>
                      <p className="text-2xl font-bold">45k req/min</p>
                      <Progress value={75} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cache Hit Rate</p>
                      <p className="text-2xl font-bold">94.2%</p>
                      <Progress value={94} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Deploy Update
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Scaling
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Audit
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">4.8/5</div>
                    <p className="text-gray-600">Based on 2,340 reviews this month</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>5 stars</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                      <div className="flex justify-between text-sm">
                        <span>4 stars</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} />
                      <div className="flex justify-between text-sm">
                        <span>3 stars</span>
                        <span>5%</span>
                      </div>
                      <Progress value={5} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <span>First Response Time</span>
                      <span className="font-semibold">2.3 hours</span>
                    </div>
                    <Progress value={85} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Resolution Time</span>
                      <span className="font-semibold">8.7 hours</span>
                    </div>
                    <Progress value={90} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-semibold">96%</span>
                    </div>
                    <Progress value={96} className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {systemStatus.map((system, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {system.status === "operational" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                        <span className="font-medium">{system.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant={system.status === "operational" ? "default" : "secondary"}>
                          {system.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">{system.uptime}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">247</div>
                    <p className="text-gray-600">Connected services</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">1.2M</div>
                    <p className="text-gray-600">Requests this month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
                    <p className="text-gray-600">Success rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}