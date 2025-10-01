import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Settings, 
  Activity, 
  BarChart3, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Truck,
  CreditCard,
  Package,
  Bell,
  ExternalLink
} from 'lucide-react';

interface Service {
  id: string;
  service: string;
  category: string;
  status: string;
  mode: string;
  endpoint: string;
  configured: boolean;
  toggle: boolean;
  description: string;
}

interface HealthCheck {
  service: string;
  status: string;
  responseTime: string;
  lastCheck: string;
  endpoint: string;
}

interface Metric {
  service: string;
  category: string;
  totalRequests: number;
  successRate: number;
  avgResponseTime: string;
  errorRate: number;
  lastRequest: string;
}

interface LogEntry {
  timestamp: string;
  service: string;
  action: string;
  status: string;
  responseTime: string;
  details: string;
}

export default function AdminExternalServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [configRes, healthRes, metricsRes, logsRes] = await Promise.all([
        fetch('/api/admin/external/services/config'),
        fetch('/api/admin/external/services/health'),
        fetch('/api/admin/external/services/metrics'),
        fetch('/api/admin/external/services/logs')
      ]);

      const [configData, healthData, metricsData, logsData] = await Promise.all([
        configRes.json(),
        healthRes.json(),
        metricsRes.json(),
        logsRes.json()
      ]);

      setServices(configData.services || []);
      setHealthChecks(healthData.healthChecks || []);
      setMetrics(metricsData.metrics || []);
      setLogs(logsData.logs || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = async (serviceId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/external/services/${serviceId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      
      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to toggle service:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shipping':
        return <Truck className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'logistics':
        return <Package className="h-4 w-4" />;
      case 'notifications':
        return <Bell className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string, mode: string) => {
    const isLive = mode === 'Live';
    const isActive = status === 'Active';
    
    if (isActive && isLive) {
      return <Badge className="bg-green-500">Live</Badge>;
    } else if (isActive && !isLive) {
      return <Badge variant="secondary">Mock</Badge>;
    } else {
      return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">External Services Admin Control</h1>
        <p className="text-gray-600">
          Manage and monitor external service integrations
        </p>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Services Configuration */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Service Configuration
              </CardTitle>
              <CardDescription>
                Configure and toggle external service integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getCategoryIcon(service.category)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{service.service}</h3>
                          {getStatusBadge(service.status, service.mode)}
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{service.endpoint}</span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {service.toggle && (
                        <Switch
                          checked={service.status === 'Active'}
                          onCheckedChange={(checked) => toggleService(service.id, checked)}
                        />
                      )}
                      {getStatusIcon(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Monitoring */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Service Health Monitor
              </CardTitle>
              <CardDescription>
                Real-time health status and response times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead>Endpoint</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthChecks.map((check, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center gap-2">
                        {getStatusIcon(check.status)}
                        {check.service}
                      </TableCell>
                      <TableCell>
                        <Badge variant={check.status === 'healthy' ? 'default' : 'destructive'}>
                          {check.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{check.responseTime}</TableCell>
                      <TableCell>{new Date(check.lastCheck).toLocaleTimeString()}</TableCell>
                      <TableCell className="text-xs text-gray-500">{check.endpoint}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Service usage statistics and performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg Response</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Last Request</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center gap-2">
                        {getCategoryIcon(metric.category)}
                        {metric.service}
                      </TableCell>
                      <TableCell>{metric.totalRequests.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={metric.successRate > 95 ? 'default' : 'destructive'}>
                          {metric.successRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{metric.avgResponseTime}</TableCell>
                      <TableCell>
                        <Badge variant={metric.errorRate < 5 ? 'secondary' : 'destructive'}>
                          {metric.errorRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(metric.lastRequest).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Logs */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Service Logs
              </CardTitle>
              <CardDescription>
                Recent service activity and error logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.service}</span>
                          <Badge variant="outline">{log.action}</Badge>
                          <span className="text-sm text-gray-500">{log.responseTime}</span>
                        </div>
                        <p className="text-sm text-gray-600">{log.details}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={fetchData} variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Metrics
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}