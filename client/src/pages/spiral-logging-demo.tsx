import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Activity, Search, Filter, RefreshCw, AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogEntry {
  timestamp: string;
  category: string;
  action: string;
  data: any;
  sessionId?: string;
  environment?: string;
}

interface LogStats {
  totalActions: number;
  categories: Record<string, number>;
  recentActivity: LogEntry[];
  topActions: Array<{ action: string; count: number }>;
}

export default function SpiralLoggingDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({
    totalActions: 0,
    categories: {},
    recentActivity: [],
    topActions: []
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSystemLogs();
    generateTestActions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filterCategory, searchTerm]);

  const loadSystemLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system/logs');
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs || []);
        setStats(data.stats || calculateStats(data.logs || []));
      } else {
        // Generate mock logs for demonstration
        const mockLogs = generateMockLogs();
        setLogs(mockLogs);
        setStats(calculateStats(mockLogs));
      }
    } catch (error) {
      console.error('Error loading logs:', error);
      const mockLogs = generateMockLogs();
      setLogs(mockLogs);
      setStats(calculateStats(mockLogs));
    } finally {
      setLoading(false);
    }
  };

  const generateMockLogs = (): LogEntry[] => {
    const categories = ['payment', 'ai_analytics', 'user_action', 'api_call', 'spiral_points', 'store_verification', 'mobile_payment', 'fraud_detection'];
    const actions = [
      'payment_processed', 'ai_analysis_completed', 'user_login', 'api_request', 'points_earned', 
      'store_verified', 'mobile_payment_attempt', 'fraud_alert_generated', 'checkout_completed',
      'demand_forecast_generated', 'pricing_recommendation_made', 'customer_segmentation_updated'
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      category: categories[Math.floor(Math.random() * categories.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      data: {
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        amount: Math.random() * 500,
        status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 100),
        details: `Sample log entry ${i + 1}`
      },
      sessionId: 'demo_session',
      environment: 'development'
    }));
  };

  const calculateStats = (logEntries: LogEntry[]): LogStats => {
    const categories: Record<string, number> = {};
    const actionCounts: Record<string, number> = {};

    logEntries.forEach(log => {
      categories[log.category] = (categories[log.category] || 0) + 1;
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    const topActions = Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));

    return {
      totalActions: logEntries.length,
      categories,
      recentActivity: logEntries.slice(0, 10),
      topActions
    };
  };

  const applyFilters = () => {
    let filtered = logs;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(log => log.category === filterCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.data).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const generateTestActions = async () => {
    try {
      const testActions = [
        { category: 'payment', action: 'test_payment_processed', amount: 99.99 },
        { category: 'ai_analytics', action: 'test_demand_forecast', confidence: 87 },
        { category: 'mobile_payment', action: 'test_apple_pay', device: 'iOS' },
        { category: 'fraud_detection', action: 'test_risk_assessment', riskScore: 23 }
      ];

      for (const action of testActions) {
        await fetch('/api/system/log-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action)
        });
      }
    } catch (error) {
      console.error('Error generating test actions:', error);
    }
  };

  const downloadLogs = async () => {
    try {
      const response = await fetch('/api/system/download-logs');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spiral_logs_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Logs Downloaded",
        description: "SPIRAL system logs have been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download logs",
        variant: "destructive"
      });
    }
  };

  const clearLogs = async () => {
    try {
      await fetch('/api/system/clear-logs', { method: 'POST' });
      setLogs([]);
      setFilteredLogs([]);
      setStats({ totalActions: 0, categories: {}, recentActivity: [], topActions: [] });
      
      toast({
        title: "Logs Cleared",
        description: "All system logs have been cleared",
      });
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Unable to clear logs",
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': case 'mobile_payment': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'ai_analytics': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'fraud_detection': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'user_action': return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-slate-600" />
            <h1 className="text-4xl font-bold text-gray-900">SPIRAL Logging System</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Comprehensive action logging and system monitoring for SPIRAL platform
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-sm bg-slate-50 text-slate-800 border-slate-200">
              Real-Time Activity Tracking
            </Badge>
            <Button onClick={downloadLogs} className="gap-2">
              <Download className="w-4 h-4" />
              Download Logs
            </Button>
            <Button onClick={loadSystemLogs} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalActions}</div>
              <div className="text-sm text-gray-600">Total Actions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{Object.keys(stats.categories).length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.topActions[0]?.count || 0}</div>
              <div className="text-sm text-gray-600">Top Action Count</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{filteredLogs.length}</div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="analytics">Log Analytics</TabsTrigger>
            <TabsTrigger value="settings">Log Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Log Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search">Search Logs</Label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search actions, categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Filter by Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="ai_analytics">AI Analytics</SelectItem>
                        <SelectItem value="user_action">User Action</SelectItem>
                        <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                        <SelectItem value="fraud_detection">Fraud Detection</SelectItem>
                        <SelectItem value="spiral_points">SPIRAL Points</SelectItem>
                        <SelectItem value="store_verification">Store Verification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={clearLogs} variant="outline" className="w-full">
                      Clear All Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Log Entries */}
            <Card>
              <CardHeader>
                <CardTitle>System Activity Log ({filteredLogs.length} entries)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredLogs.map((log, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      {log.data.status && (
                        <Badge className={`text-xs ${getStatusColor(log.data.status)} mb-2`}>
                          {log.data.status}
                        </Badge>
                      )}
                      
                      <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                  
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No logs found matching your criteria
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.categories).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span className="capitalize">{category.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${(count / stats.totalActions) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topActions.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{item.action.replace(/_/g, ' ')}</span>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logging Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Log Level</Label>
                      <Select defaultValue="info">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Auto-Save Frequency</Label>
                      <Select defaultValue="10">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Every Action</SelectItem>
                          <SelectItem value="10">Every 10 Actions</SelectItem>
                          <SelectItem value="50">Every 50 Actions</SelectItem>
                          <SelectItem value="100">Every 100 Actions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Export Configuration</div>
                        <div className="text-sm text-gray-600">Download current logging settings</div>
                      </div>
                      <Button variant="outline">Export Config</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Performance Monitoring</div>
                        <div className="text-sm text-gray-600">Track API response times and system performance</div>
                      </div>
                      <Button variant="outline">View Performance</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}