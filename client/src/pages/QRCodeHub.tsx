import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpiralQRGenerator from '@/components/SpiralQRGenerator';
import MallQrCampaignTemplates from '@/components/MallQrCampaignTemplates';
import AdminQRPerformanceCard from '@/components/AdminQRPerformanceCard';
import { QrCode, Sparkles, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRStats {
  totalScans: number;
  totalGenerated: number;
  todayScans: number;
  todayGenerated: number;
  scanRate: string;
}

export default function QRCodeHub() {
  const [stats, setStats] = useState<QRStats>({
    totalScans: 0,
    totalGenerated: 0,
    todayScans: 0,
    todayGenerated: 0,
    scanRate: "0"
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/qr/admin/qr-analytics');
      const data = await response.json();
      if (data.success) {
        setStats({
          totalScans: data.totalScans,
          totalGenerated: data.totalGenerated,
          todayScans: data.todayScans,
          todayGenerated: data.todayGenerated,
          scanRate: data.scanRate
        });
      }
    } catch (error) {
      console.error('Failed to fetch QR stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              SPIRAL QR Code Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create, manage, and track branded QR campaigns with AI-powered suggestions and professional SPIRAL logo integration
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AdminQRPerformanceCard />
          <Card className="lg:col-span-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <BarChart3 className="w-6 h-6" />
                QR Performance Overview
              </CardTitle>
              <CardDescription className="text-purple-600">
                Monitor scan rates, engagement metrics, and campaign effectiveness across all your QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-purple-600">Live QR Analytics</div>
                <Button
                  onClick={fetchStats}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center p-4 bg-white/60 rounded-lg border border-gray-100 animate-pulse">
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/60 rounded-lg border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700">{stats.totalScans}</div>
                    <div className="text-sm text-purple-600">Total Scans</div>
                  </div>
                  <div className="text-center p-4 bg-white/60 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700">{stats.totalGenerated}</div>
                    <div className="text-sm text-blue-600">QR Codes Created</div>
                  </div>
                  <div className="text-center p-4 bg-white/60 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{stats.scanRate}%</div>
                    <div className="text-sm text-green-600">Scan Rate</div>
                  </div>
                  <div className="text-center p-4 bg-white/60 rounded-lg border border-orange-100">
                    <div className="text-2xl font-bold text-orange-700">{stats.todayGenerated}</div>
                    <div className="text-sm text-orange-600">Created Today</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR Generation Tools */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Campaign Templates */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Campaign Templates</h2>
            </div>
            <MallQrCampaignTemplates 
              ownerType="mall"
              ownerId="qr-hub-manager"
            />
          </div>

          {/* Advanced Generator */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Custom QR Generator</h2>
            </div>
            <SpiralQRGenerator 
              onQRGenerated={(qrData) => {
                console.log('QR Hub Generated:', qrData);
              }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-gray-800">Quick Actions & Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg border border-blue-100 text-center">
                <div className="font-semibold text-blue-800 mb-2">Placement Tips</div>
                <div className="text-sm text-blue-600">Eye level, high traffic areas, clear visibility</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-100 text-center">
                <div className="font-semibold text-green-800 mb-2">Call to Action</div>
                <div className="text-sm text-green-600">Use clear instructions like "Scan for Deals"</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-100 text-center">
                <div className="font-semibold text-purple-800 mb-2">Testing</div>
                <div className="text-sm text-purple-600">Always test QR codes before printing</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-orange-100 text-center">
                <div className="font-semibold text-orange-800 mb-2">Design</div>
                <div className="text-sm text-orange-600">High contrast colors for better scanning</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}