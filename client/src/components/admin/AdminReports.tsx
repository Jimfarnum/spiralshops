import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
  Database,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

type Report = {
  _id?: string;
  type: "daily" | "weekly";
  createdAt: string;
  content: {
    kpis: {
      retailers: number;
      shoppers: number;
      sales: string;
      campaigns: number;
      agentHealth: number;
      systemPerformance: string;
    };
    insights: string[];
    soapgMetrics: {
      agentsHealthy: number;
      totalAgents: number;
      avgResponseTime: number;
      systemStatus: string;
    };
    checklistProgress: {
      completion: number;
      categories: any;
    };
    alerts: string[];
    recommendations: string[];
  };
};

export default function AdminReports() {
  const [dailyReports, setDailyReports] = useState<Report[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchReports(type: "daily" | "weekly") {
    try {
      const res = await fetch(`/api/reports/${type}`);
      const data = await res.json();
      return data.reports || [];
    } catch (error) {
      console.error(`Failed to fetch ${type} reports:`, error);
      return [];
    }
  }

  async function refreshReport(type: "daily" | "weekly") {
    setRefreshing(true);
    try {
      await fetch(`/api/reports/generate/${type}`, { method: "POST" });
      const [d, w] = await Promise.all([
        fetchReports("daily"),
        fetchReports("weekly"),
      ]);
      setDailyReports(d);
      setWeeklyReports(w);
    } catch (error) {
      console.error(`Failed to refresh ${type} report:`, error);
    }
    setRefreshing(false);
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [d, w] = await Promise.all([
        fetchReports("daily"),
        fetchReports("weekly"),
      ]);
      setDailyReports(d);
      setWeeklyReports(w);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const renderReportCard = (report: Report) => (
    <Card key={report._id || report.createdAt} className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {report.type === 'daily' ? (
              <Calendar className="h-5 w-5 text-blue-600" />
            ) : (
              <BarChart3 className="h-5 w-5 text-green-600" />
            )}
            {report.type === 'daily' ? 'Daily Report' : 'Weekly Report'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPI Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">{report.content.kpis.retailers}</div>
            <div className="text-sm text-blue-600">Active Retailers</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-800">{report.content.kpis.shoppers}</div>
            <div className="text-sm text-green-600">Active Shoppers</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-800">${report.content.kpis.sales}</div>
            <div className="text-sm text-purple-600">Sales Volume</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-800">{report.content.kpis.campaigns}</div>
            <div className="text-sm text-orange-600">Active Campaigns</div>
          </div>
        </div>

        {/* SOAP-G Health Status */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-green-600" />
              SOAP-G Agent Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Agents Status</span>
              <Badge variant={report.content.soapgMetrics.systemStatus === 'healthy' ? 'default' : 'destructive'}>
                {report.content.soapgMetrics.agentsHealthy}/{report.content.soapgMetrics.totalAgents} Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Average Response Time</span>
              <span className="text-sm">{report.content.soapgMetrics.avgResponseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Performance</span>
              <Badge variant={report.content.kpis.systemPerformance === 'A' ? 'default' : 'secondary'}>
                Grade {report.content.kpis.systemPerformance}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Launch Progress */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Launch Checklist Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Overall Completion</span>
              <Badge variant={report.content.checklistProgress.completion >= 80 ? 'default' : 'secondary'}>
                {report.content.checklistProgress.completion}%
              </Badge>
            </div>
            <div className="space-y-2">
              {Object.entries(report.content.checklistProgress.categories || {}).map(([category, data]: [string, any]) => (
                <div key={category} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className={`font-medium ${data.percentage === 100 ? 'text-green-600' : data.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {data.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {report.content.alerts && report.content.alerts.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="space-y-1">
                {report.content.alerts.map((alert, index) => (
                  <div key={index} className="text-red-800 text-sm">{alert}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.content.insights && report.content.insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-800">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  {report.content.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {report.content.recommendations && report.content.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-orange-800">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  {report.content.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">SPIRAL Reports Hub</h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => refreshReport("daily")}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Refreshing…" : "Generate Daily Report"}
          </Button>
          <Button
            onClick={() => refreshReport("weekly")}
            disabled={refreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Refreshing…" : "Generate Weekly Report"}
          </Button>
        </div>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Daily Reports ({dailyReports.length})
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Weekly Reports ({weeklyReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {dailyReports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No daily reports yet.</p>
                <p className="text-sm text-gray-400">Click "Generate Daily Report" to create your first report.</p>
              </CardContent>
            </Card>
          ) : (
            dailyReports.map(renderReportCard)
          )}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          {weeklyReports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No weekly reports yet.</p>
                <p className="text-sm text-gray-400">Click "Generate Weekly Report" to create your first report.</p>
              </CardContent>
            </Card>
          ) : (
            weeklyReports.map(renderReportCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}