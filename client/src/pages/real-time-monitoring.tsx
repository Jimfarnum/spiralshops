import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Users, 
  ShoppingCart,
  DollarSign,
  Globe,
  Server,
  Database,
  Wifi,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface SystemMetric {
  name: string;
  value: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
}

interface RealTimeData {
  timestamp: string;
  activeUsers: number;
  ordersPerMinute: number;
  revenue: number;
  responseTime: number;
}

export default function RealTimeMonitoring() {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Initialize monitoring
    loadInitialData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        updateRealTimeData();
        checkSystemHealth();
        setLastUpdate(new Date());
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const loadInitialData = () => {
    // Initialize system metrics
    setMetrics([
      {
        name: "System Uptime",
        value: "99.9%",
        status: "healthy",
        trend: "stable",
        icon: <Server className="w-5 h-5" />
      },
      {
        name: "Response Time",
        value: "127ms",
        status: "healthy",
        trend: "down",
        icon: <Zap className="w-5 h-5" />
      },
      {
        name: "Active Users",
        value: "12,847",
        status: "healthy",
        trend: "up",
        icon: <Users className="w-5 h-5" />
      },
      {
        name: "Transactions/Min",
        value: "456",
        status: "warning",
        trend: "up",
        icon: <ShoppingCart className="w-5 h-5" />
      },
      {
        name: "Database Load",
        value: "68%",
        status: "healthy",
        trend: "stable",
        icon: <Database className="w-5 h-5" />
      },
      {
        name: "API Gateway",
        value: "Online",
        status: "healthy",
        trend: "stable",
        icon: <Wifi className="w-5 h-5" />
      }
    ]);

    // Initialize real-time data
    const initialData = [];
    for (let i = 29; i >= 0; i--) {
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - i);
      initialData.push({
        timestamp: timestamp.toISOString(),
        activeUsers: 12000 + Math.floor(Math.random() * 2000),
        ordersPerMinute: 400 + Math.floor(Math.random() * 200),
        revenue: 15000 + Math.floor(Math.random() * 5000),
        responseTime: 100 + Math.floor(Math.random() * 50)
      });
    }
    setRealTimeData(initialData);

    // Initialize alerts
    setAlerts([
      {
        id: 1,
        type: "warning",
        message: "High traffic detected in North America region",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        severity: "medium"
      },
      {
        id: 2,
        type: "info",
        message: "Scheduled maintenance completed successfully",
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        severity: "low"
      }
    ]);
  };

  const updateRealTimeData = () => {
    setRealTimeData(prev => {
      const newData = [...prev.slice(1)]; // Remove oldest entry
      const lastEntry = prev[prev.length - 1];
      
      // Add new data point with realistic variations
      newData.push({
        timestamp: new Date().toISOString(),
        activeUsers: Math.max(8000, lastEntry.activeUsers + (Math.random() - 0.5) * 1000),
        ordersPerMinute: Math.max(200, lastEntry.ordersPerMinute + (Math.random() - 0.5) * 100),
        revenue: Math.max(10000, lastEntry.revenue + (Math.random() - 0.3) * 2000),
        responseTime: Math.max(50, lastEntry.responseTime + (Math.random() - 0.5) * 30)
      });
      
      return newData;
    });
  };

  const checkSystemHealth = () => {
    // Simulate system health checks
    const currentData = realTimeData[realTimeData.length - 1];
    if (!currentData) return;

    // Update metrics based on current data
    setMetrics(prev => prev.map(metric => {
      switch (metric.name) {
        case "Active Users":
          return {
            ...metric,
            value: currentData.activeUsers.toLocaleString(),
            status: currentData.activeUsers > 15000 ? "warning" : "healthy"
          };
        case "Response Time":
          return {
            ...metric,
            value: `${Math.round(currentData.responseTime)}ms`,
            status: currentData.responseTime > 200 ? "warning" : "healthy"
          };
        case "Transactions/Min":
          return {
            ...metric,
            value: Math.round(currentData.ordersPerMinute).toString(),
            status: currentData.ordersPerMinute > 600 ? "warning" : "healthy"
          };
        default:
          return metric;
      }
    }));

    // Generate new alerts if thresholds are exceeded
    if (currentData.responseTime > 200 && Math.random() < 0.1) {
      setAlerts(prev => [{
        id: Date.now(),
        type: "warning",
        message: "Response time above threshold (200ms)",
        timestamp: new Date(),
        severity: "medium"
      }, ...prev.slice(0, 4)]); // Keep only 5 latest alerts
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "critical": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Real-Time System Monitoring</h1>
            <p className="text-gray-600">Live platform performance and health metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
              {isLive ? "Live" : "Paused"}
            </Button>
          </div>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(metric.status)}>
                      {metric.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      <p className="text-xl font-bold">{metric.value}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusIcon(metric.status)}
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-Time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Users (Last 30 Minutes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={realTimeData}>
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value as string).toLocaleTimeString()}
                    formatter={(value) => [value?.toLocaleString(), 'Active Users']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Orders Per Minute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={realTimeData}>
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value as string).toLocaleTimeString()}
                    formatter={(value) => [value, 'Orders/Min']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ordersPerMinute" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={realTimeData}>
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value as string).toLocaleTimeString()}
                    formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={realTimeData}>
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value as string).toLocaleTimeString()}
                    formatter={(value) => [`${value}ms`, 'Response Time']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    No active alerts
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant={alert.type === "warning" ? "secondary" : "default"}>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>34%</span>
                </div>
                <Progress value={34} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>68%</span>
                </div>
                <Progress value={68} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disk Usage</span>
                  <span>45%</span>
                </div>
                <Progress value={45} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Network I/O</span>
                  <span>23%</span>
                </div>
                <Progress value={23} />
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Uptime</p>
                    <p className="font-semibold">47 days, 3 hours</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Version</p>
                    <p className="font-semibold">v2.4.1</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Environment</p>
                    <p className="font-semibold">Production</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Region</p>
                    <p className="font-semibold">US-East-1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}