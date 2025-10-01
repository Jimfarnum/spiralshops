import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, CheckCircle2, XCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AuditRecord {
  _id?: string;
  date: string;
  status: string;
  latencyMs: number;
  routesTested: number;
  routesPassed: number;
  routesFailed: number;
  launchSafe: boolean;
  createdAt: string;
}

interface AuditSummary {
  totalAudits: number;
  averageLatency: number;
  successRate: number;
  lastAuditDate: string;
  lastAuditStatus: string;
}

export default function AuditHistoryChart() {
  const [data, setData] = useState<AuditRecord[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAuditHistory = async (selectedDays: number) => {
    setLoading(true);
    try {
      const [historyResponse, summaryResponse] = await Promise.all([
        fetch(`/api/audit/history?days=${selectedDays}`),
        fetch(`/api/audit/summary?days=${selectedDays}`)
      ]);
      
      const historyData = await historyResponse.json();
      const summaryData = await summaryResponse.json();
      
      if (historyData.ok) {
        setData(historyData.history || []);
      }
      
      if (summaryData.ok) {
        setSummary(summaryData.summary);
      }
    } catch (error) {
      console.error("Failed to fetch audit data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditHistory(days);
  }, [days]);

  const chartData = {
    labels: data.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Response Time (ms)",
        data: data.map((d) => d.latencyMs),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Routes Failed",
        data: data.map((d) => d.routesFailed),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: false,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `SOAP-G Audit Trends (${days} Days)`,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Response Time (ms)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Failed Routes'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const latestRecord = data[data.length - 1];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Audits</p>
                  <p className="text-2xl font-bold">{summary.totalAudits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold">{summary.averageLatency}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">{summary.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(summary.lastAuditStatus)}`}></div>
                <div>
                  <p className="text-sm text-gray-600">Last Status</p>
                  <p className="text-xl font-bold capitalize">{summary.lastAuditStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">SOAP-G Audit History</CardTitle>
            <div className="flex space-x-2">
              {[7, 14, 30].map((dayOption) => (
                <button
                  key={dayOption}
                  onClick={() => setDays(dayOption)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    days === dayOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {dayOption}d
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : data.length > 0 ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No audit history available</p>
                <p className="text-sm">Run some audits to see trends here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Audit Details */}
      {latestRecord && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Audit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-semibold">{latestRecord.date}</p>
              </div>
              <div>
                <p className="text-gray-600">Routes Tested</p>
                <p className="font-semibold">{latestRecord.routesTested}</p>
              </div>
              <div>
                <p className="text-gray-600">Routes Passed</p>
                <p className="font-semibold text-green-600">{latestRecord.routesPassed}</p>
              </div>
              <div>
                <p className="text-gray-600">Launch Safe</p>
                <Badge variant={latestRecord.launchSafe ? "default" : "destructive"}>
                  {latestRecord.launchSafe ? "YES" : "NO"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>✅ Daily snapshots automatically stored via SOAP-G</p>
        <p>✅ 7–30 day historical trendlines</p>
        <p>✅ Real-time system health monitoring</p>
      </div>
    </div>
  );
}