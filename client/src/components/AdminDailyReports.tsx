import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Users,
  Activity,
  Database,
  Download,
  RefreshCw,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

interface DailyReport {
  id: string;
  date: string;
  timestamp: string;
  overallStatus: 'green' | 'yellow' | 'red';
  checklist: {
    overall: number;
    categories: any;
  };
  soapgHealth: {
    summary: {
      total: number;
      healthy: number;
      unhealthy: number;
      averageResponseTime: number;
      status: string;
    };
    agents: any[];
    recommendations: string[];
  };
  cloudantPerformance: {
    queryPerformance: {
      responseTime: number;
      status: string;
      grade: string;
    };
  };
  retailerAdoption: {
    totalRetailers: number;
    earlyAdopters: number;
    adoptionRate: number;
    newRetailersToday: number;
    growthRate: number;
    status: string;
    recommendations: string[];
  };
  alerts: string[];
  todaysFocus: string[];
  summary: {
    checklistCompletion: string;
    agentHealth: string;
    databasePerformance: string;
    retailerGrowth: string;
    alertCount: number;
  };
}

const StatusIndicator = ({ status }: { status: 'green' | 'yellow' | 'red' | string }) => {
  const getColor = (status: string) => {
    switch (status) {
      case 'green':
      case 'excellent':
      case 'all_healthy':
      case 'complete':
        return 'bg-green-500';
      case 'yellow':
      case 'good':
      case 'mostly_healthy':
      case 'warning':
        return 'bg-yellow-500';
      case 'red':
      case 'critical':
      case 'degraded':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return <div className={`w-3 h-3 rounded-full ${getColor(status)}`} />;
};

export default function AdminDailyReports() {
  const [currentReport, setCurrentReport] = useState<DailyReport | null>(null);
  const [historicalReports, setHistoricalReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchCurrentReport = async (force = false) => {
    try {
      if (force) setGenerating(true);
      
      const response = await fetch(`/api/admin/daily-report${force ? '?force=true' : ''}`);
      const data = await response.json();
      
      if (data.ok) {
        setCurrentReport(data.report);
      }
    } catch (error) {
      console.error('Failed to fetch current report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const fetchHistoricalReports = async () => {
    try {
      const response = await fetch('/api/admin/daily-reports/history?limit=14');
      const data = await response.json();
      
      if (data.ok) {
        setHistoricalReports(data.reports.sort((a: DailyReport, b: DailyReport) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to fetch historical reports:', error);
    }
  };

  const exportReport = (format: 'json' | 'csv') => {
    if (!currentReport) return;
    
    let content: string;
    let filename: string;
    let mimeType: string;
    
    if (format === 'json') {
      content = JSON.stringify(currentReport, null, 2);
      filename = `spiral-daily-report-${currentReport.date}.json`;
      mimeType = 'application/json';
    } else {
      // CSV format
      const csvData = [
        ['Metric', 'Value', 'Status'],
        ['Date', currentReport.date, ''],
        ['Overall Status', currentReport.overallStatus, ''],
        ['Checklist Completion', currentReport.summary.checklistCompletion, currentReport.checklist.overall >= 80 ? 'Good' : 'Needs Attention'],
        ['Agent Health', currentReport.summary.agentHealth, ''],
        ['Database Performance', currentReport.summary.databasePerformance, ''],
        ['Retailer Growth', currentReport.summary.retailerGrowth, ''],
        ['Alert Count', currentReport.summary.alertCount.toString(), currentReport.summary.alertCount === 0 ? 'Good' : 'Attention Required'],
        ['Total Retailers', currentReport.retailerAdoption.totalRetailers.toString(), ''],
        ['Early Adopters', currentReport.retailerAdoption.earlyAdopters.toString(), ''],
        ['Adoption Rate', `${currentReport.retailerAdoption.adoptionRate}%`, '']
      ];
      
      content = csvData.map(row => row.join(',')).join('\n');
      filename = `spiral-daily-report-${currentReport.date}.csv`;
      mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCurrentReport(), fetchHistoricalReports()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-64"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Daily Reports</h1>
          {currentReport && (
            <Badge variant={currentReport.overallStatus === 'green' ? 'default' : 
                           currentReport.overallStatus === 'yellow' ? 'secondary' : 'destructive'}>
              {currentReport.overallStatus.toUpperCase()} STATUS
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => fetchCurrentReport(true)}
            disabled={generating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
          
          {currentReport && (
            <>
              <Button
                onClick={() => exportReport('json')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                JSON
              </Button>
              <Button
                onClick={() => exportReport('csv')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Current Report */}
      {currentReport && (
        <div className="space-y-6">
          {/* Quick Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Checklist</p>
                    <p className="text-2xl font-bold text-blue-800">{currentReport.summary.checklistCompletion}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">AI Agents</p>
                    <p className="text-2xl font-bold text-green-800">
                      {currentReport.soapgHealth.summary.healthy}/{currentReport.soapgHealth.summary.total}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Database</p>
                    <p className="text-2xl font-bold text-purple-800">{currentReport.summary.databasePerformance}</p>
                  </div>
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Retailers</p>
                    <p className="text-2xl font-bold text-orange-800">{currentReport.retailerAdoption.totalRetailers}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {currentReport.alerts.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="space-y-1">
                  {currentReport.alerts.map((alert, index) => (
                    <div key={index} className="text-red-800">{alert}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Today's Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Today's Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentReport.todaysFocus.map((task, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{task}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <Tabs defaultValue="checklist" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="checklist">Launch Checklist</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="adoption">Retailer Adoption</TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Launch Checklist Progress</CardTitle>
                  <div className="flex items-center gap-2">
                    <Progress value={currentReport.checklist.overall} className="flex-1" />
                    <span className="font-semibold">{currentReport.checklist.overall}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(currentReport.checklist.categories).map(([category, data]: [string, any]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <StatusIndicator status={data.status} />
                          <span className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{data.completed}/{data.total}</div>
                          <div className="text-sm text-gray-500">{data.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SOAP-G AI Agents Status</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Activity className="h-4 w-4" />
                    Average Response Time: {currentReport.soapgHealth.summary.averageResponseTime}ms
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentReport.soapgHealth.agents.map((agent: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <StatusIndicator status={agent.status} />
                          <span className="font-medium">{agent.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{agent.responseTime}ms</div>
                          <div className="text-xs text-gray-500">
                            {new Date(agent.lastHeartbeat).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {currentReport.soapgHealth.recommendations.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Recommendations:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        {currentReport.soapgHealth.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Database Performance</h4>
                        <p className="text-sm text-gray-600">Query response time</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={currentReport.cloudantPerformance.queryPerformance.grade === 'A' ? 'default' : 
                                       currentReport.cloudantPerformance.queryPerformance.grade === 'B' ? 'secondary' : 'destructive'}>
                          Grade {currentReport.cloudantPerformance.queryPerformance.grade}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentReport.cloudantPerformance.queryPerformance.responseTime}ms
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="adoption" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Retailer Early Adoption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-800">{currentReport.retailerAdoption.totalRetailers}</div>
                      <div className="text-sm text-blue-600">Total Retailers</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-800">{currentReport.retailerAdoption.earlyAdopters}</div>
                      <div className="text-sm text-green-600">Early Adopters</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-800">{currentReport.retailerAdoption.adoptionRate}%</div>
                      <div className="text-sm text-purple-600">Adoption Rate</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-800">+{currentReport.retailerAdoption.newRetailersToday}</div>
                      <div className="text-sm text-orange-600">New Today</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Growth Rate: <span className="font-semibold">{currentReport.retailerAdoption.growthRate}%</span>
                    </span>
                  </div>
                  
                  {currentReport.retailerAdoption.recommendations.length > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Recommendations:</h4>
                      <ul className="text-orange-700 text-sm space-y-1">
                        {currentReport.retailerAdoption.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Historical Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Report History (Last 14 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historicalReports.length > 0 ? (
            <div className="space-y-2">
              {historicalReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <StatusIndicator status={report.overallStatus} />
                    <div>
                      <div className="font-medium">{new Date(report.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">
                        {report.summary.checklistCompletion} complete • {report.summary.alertCount} alerts
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{report.retailerAdoption.totalRetailers} retailers</div>
                    <div className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(report.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No historical reports available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}