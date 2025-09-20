import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  QrCode, 
  TrendingUp, 
  Users, 
  BarChart3,
  RefreshCw,
  Eye,
  Zap
} from 'lucide-react'

interface QRStats {
  success: boolean;
  totalScans: number;
  totalGenerated: number;
  todayScans: number;
  todayGenerated: number;
  scanRate: string;
  campaignStats: Record<string, { scans: number; generated: number }>;
  recentScans: any[];
  storageType: string;
}

export default function AdminQRPerformanceCard() {
  const [stats, setStats] = useState<QRStats>({
    success: true,
    totalScans: 0,
    totalGenerated: 0,
    todayScans: 0,
    todayGenerated: 0,
    scanRate: "0",
    campaignStats: {},
    recentScans: [],
    storageType: 'fallback'
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/qr/admin/qr-analytics");
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
      } else {
        console.error("QR analytics fetch error:", data.error);
      }
    } catch (err) {
      console.error("QR analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 10000); // Auto-refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const topCampaigns = Object.entries(stats.campaignStats)
    .sort(([,a], [,b]) => b.scans - a.scans)
    .slice(0, 3);

  if (loading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-blue-900">QR Performance Analytics</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={stats.storageType === 'cloudant' ? 'default' : 'secondary'}>
              {stats.storageType === 'cloudant' ? 'IBM Cloud' : 'Demo Mode'}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-green-100 border-green-300' : ''}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Live' : 'Refresh'}
            </Button>
          </div>
        </div>
        <CardDescription className="text-blue-700">
          Real-time QR code generation and scan tracking for marketing campaigns
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-lg border border-blue-100">
            <QrCode className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-900">{stats.totalGenerated}</p>
            <p className="text-xs text-blue-600">QR Codes Created</p>
          </div>
          
          <div className="text-center p-3 bg-white/60 rounded-lg border border-green-100">
            <Eye className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-900">{stats.totalScans}</p>
            <p className="text-xs text-green-600">Total Scans</p>
          </div>
          
          <div className="text-center p-3 bg-white/60 rounded-lg border border-purple-100">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-900">{stats.scanRate}%</p>
            <p className="text-xs text-purple-600">Scan Rate</p>
          </div>
          
          <div className="text-center p-3 bg-white/60 rounded-lg border border-orange-100">
            <Zap className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-orange-900">{stats.todayScans}</p>
            <p className="text-xs text-orange-600">Today's Scans</p>
          </div>
        </div>

        {/* Campaign Performance */}
        {topCampaigns.length > 0 && (
          <div>
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Top Performing Campaigns
            </h4>
            <div className="space-y-2">
              {topCampaigns.map(([campaign, data]) => (
                <div key={campaign} className="flex items-center justify-between p-2 bg-white/60 rounded border border-blue-100">
                  <span className="text-sm font-medium text-blue-900 truncate max-w-[150px]">
                    {campaign}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-blue-600">{data.generated} QRs</span>
                    <span className="text-green-600">{data.scans} scans</span>
                    <Badge variant="outline" className="text-xs">
                      {data.generated > 0 ? ((data.scans / data.generated) * 100).toFixed(0) : 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Activity */}
        {stats.todayGenerated > 0 && (
          <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Today's Activity</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">QR Codes Generated:</span>
                <span className="font-bold ml-2">{stats.todayGenerated}</span>
              </div>
              <div>
                <span className="text-green-700">Scans Received:</span>
                <span className="font-bold ml-2">{stats.todayScans}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats.recentScans.length > 0 && (
          <div>
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent Scans
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stats.recentScans.slice(0, 5).map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-2 text-xs bg-white/40 rounded border border-blue-100">
                  <span className="text-blue-700 truncate max-w-[120px]">
                    {scan.campaignName || 'Unknown Campaign'}
                  </span>
                  <span className="text-gray-600">
                    {scan.scannedAt ? new Date(scan.scannedAt).toLocaleTimeString() : 'Now'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Message */}
        {stats.totalGenerated === 0 && (
          <div className="text-center p-4 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
            <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm">No QR codes generated yet</p>
            <p className="text-xs text-gray-500">
              QR analytics will appear here once retailers start creating marketing campaigns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}