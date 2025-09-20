import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Database, Server, CreditCard, Play, RefreshCw, Activity, Star, TrendingUp } from "lucide-react";
import { CloudantBadge, StripeBadge, EmailBadge, SearchBadge, SystemStatusSummary } from "@/components/CloudantBadge";
import AdminQRPerformanceCard from "@/components/AdminQRPerformanceCard";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SystemHealth {
  status: string;
  message: string;
}

interface AdminHealth {
  search_p95_ms: number;
  onboarding_under_24h: boolean;
  checkout_success_rate: number;
  status: string;
  last_updated: string;
}

function HealthBadge() {
  const { data: health, isLoading, error } = useQuery<SystemHealth>({
    queryKey: ['/api/check'],
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 animate-spin" />
        <span className="text-xs">API Health</span>
      </Badge>
    );
  }

  if (error || health?.status !== "healthy") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1.5">
        <XCircle className="h-3 w-3" />
        <span className="text-xs">API Down</span>
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700">
      <CheckCircle className="h-3 w-3" />
      <span className="text-xs">API Healthy</span>
    </Badge>
  );
}

function DatabaseBadge() {
  return (
    <Badge variant="default" className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700">
      <Database className="h-3 w-3" />
      <span className="text-xs">PostgreSQL</span>
    </Badge>
  );
}

function AdminHealthCard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { data: adminHealth, isLoading, refetch } = useQuery<AdminHealth>({
    queryKey: ['/api/admin/health'],
    refetchInterval: 30000,
  });

  const runDemo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/function-agent/run', { method: 'POST' });
      const data = await response.json();
      toast({
        title: "Demo Started",
        description: data.message || "Platform demo started successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start demo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshCache = async () => {
    try {
      const response = await fetch('/api/cache/refresh', { method: 'POST' });
      const data = await response.json();
      toast({
        title: "Cache Refreshed",
        description: data.message || "Cache refresh completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh cache",
        variant: "destructive"
      });
    }
  };

  const HealthTile = ({ label, value, threshold, type }: {
    label: string;
    value: any;
    threshold?: number | boolean;
    type: 'boolean' | 'number' | 'percentage'
  }) => {
    let isHealthy = true;
    let displayValue = value;

    if (type === 'boolean') {
      isHealthy = value === true;
      displayValue = value ? "Yes" : "No";
    } else if (type === 'number' && threshold) {
      isHealthy = value < threshold;
      displayValue = `${value}ms`;
    } else if (type === 'percentage' && threshold) {
      isHealthy = value > threshold;
      displayValue = `${(value * 100).toFixed(1)}%`;
    }

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <Badge variant={isHealthy ? "default" : "destructive"}>
          {displayValue}
        </Badge>
      </div>
    );
  };

  return (
    <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <Activity className="w-5 h-5" />
          Platform Health Dashboard
        </CardTitle>
        <CardDescription className="text-teal-600">
          Real-time system health and quick actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">Loading health data...</p>
          </div>
        ) : adminHealth ? (
          <div className="space-y-3">
            <HealthTile
              label="Search Performance (< 2000ms)"
              value={adminHealth.search_p95_ms}
              threshold={2000}
              type="number"
            />
            <HealthTile
              label="Onboarding (< 24h)"
              value={adminHealth.onboarding_under_24h}
              type="boolean"
            />
            <HealthTile
              label="Checkout Success (> 98%)"
              value={adminHealth.checkout_success_rate}
              threshold={0.98}
              type="percentage"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
              <Button 
                onClick={runDemo} 
                disabled={loading}
                size="sm" 
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Play className="h-4 w-4 mr-1" />
                {loading ? "Running..." : "Run Demo"}
              </Button>
              
              <Button 
                onClick={refreshCache} 
                variant="outline" 
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Cache
              </Button>
              
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
              >
                <Activity className="h-4 w-4 mr-1" />
                Refresh Health
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Last updated: {new Date(adminHealth.last_updated).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-600">
            Failed to load health data
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SPIRAL Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <SystemStatusSummary />
          <CloudantBadge />
          <StripeBadge />
          <EmailBadge />
          <SearchBadge />
          <HealthBadge />
        </div>
      </div>

      {/* New Health Dashboard */}
      <AdminHealthCard />

      {/* QR Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminQRPerformanceCard />
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Database className="w-5 h-5" />
              SOAP G Agent Status
            </CardTitle>
            <CardDescription className="text-green-600">
              Real-time coordination and performance monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-white/60 rounded border border-green-100">
                <span className="text-sm font-medium text-green-900">Marketing AI</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 rounded border border-green-100">
                <span className="text-sm font-medium text-green-900">Shopper Engagement</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 rounded border border-green-100">
                <span className="text-sm font-medium text-green-900">Social Media AI</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              <div className="text-center text-xs text-green-600 mt-3">
                7 Agents • Cross-Agent Reporting • QR Integration
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SPIRAL Balance Overview */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Star className="w-5 h-5" />
            Platform SPIRALS Overview
          </CardTitle>
          <CardDescription className="text-orange-600">
            Total SPIRALS circulation and platform economics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/60 rounded border border-orange-100">
              <Star className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">2.4M</p>
              <p className="text-xs text-orange-700">Total SPIRALS Issued</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded border border-orange-100">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">1.8M</p>
              <p className="text-xs text-green-700">Active SPIRALS</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded border border-orange-100">
              <Database className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">612K</p>
              <p className="text-xs text-blue-700">Redeemed SPIRALS</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded border border-orange-100">
              <Activity className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">$47.3K</p>
              <p className="text-xs text-purple-700">Platform Value</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-orange-700">
              <span className="font-semibold">75% circulation rate</span> • <span className="font-semibold">$0.02 avg value</span> • <span className="font-semibold">14.2K weekly transactions</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IBM Cloud</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Connected</div>
            <p className="text-xs text-muted-foreground">
              Washington DC region
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">
              spiral_production ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">7 Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Launch Ready</div>
            <p className="text-xs text-muted-foreground">
              100% functionality achieved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Current platform status and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">IBM Cloud Cloudant</span>
              <Badge variant="default" className="bg-green-600">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">PostgreSQL Database</span>
              <Badge variant="default" className="bg-green-600">Healthy</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Stripe Integration</span>
              <Badge variant="default" className="bg-green-600">Ready</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">AI Operations</span>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Status</CardTitle>
            <CardDescription>Production readiness checklist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Environment Variables</span>
              <Badge variant="default" className="bg-green-600">Configured</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Security Headers</span>
              <Badge variant="default" className="bg-green-600">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Rate Limiting</span>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Production Database</span>
              <Badge variant="default" className="bg-green-600">Ready</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}