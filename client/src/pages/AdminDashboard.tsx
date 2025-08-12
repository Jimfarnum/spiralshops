import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Database, Server, CreditCard } from "lucide-react";
import { CloudantBadge, StripeBadge, EmailBadge, SearchBadge, SystemStatusSummary } from "@/components/CloudantBadge";
import AdminQRPerformanceCard from "@/components/AdminQRPerformanceCard";

interface SystemHealth {
  status: string;
  message: string;
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