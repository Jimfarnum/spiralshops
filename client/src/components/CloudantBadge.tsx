import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Database, CreditCard, Mail, Search } from "lucide-react";

interface StatusSummary {
  ok: boolean;
  services: {
    cloudant: { connected: boolean; service: string; data?: any };
    stripe: { connected: boolean; configured: boolean; service: string };
    email: { connected: boolean; configured: boolean; service: string; provider?: string };
    search: { connected: boolean; configured: boolean; service: string; provider?: string };
  };
  connected: boolean;
  fullyConnected: boolean;
  timing_ms: number;
  now: string;
}

interface CloudantStatus {
  ok: boolean;
  connected: boolean;
  data: {
    db: string;
    couchdb: string;
    version: string;
    host: string;
    available_databases: number;
    databases_list: string;
  };
  timing_ms: number;
  now: string;
}

export function CloudantBadge() {
  const { data: status, isLoading, error } = useQuery<CloudantStatus>({
    queryKey: ['/api/cloudant-status'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 animate-spin" />
        <span className="text-xs">Cloudant</span>
      </Badge>
    );
  }

  if (error || !status?.ok) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1.5">
        <XCircle className="h-3 w-3" />
        <span className="text-xs">Cloudant Error</span>
      </Badge>
    );
  }

  const isConnected = status.connected;
  const responseTime = status.timing_ms;

  return (
    <Badge 
      variant={isConnected ? "default" : "secondary"} 
      className={`flex items-center gap-1.5 ${
        isConnected ? "bg-green-600 hover:bg-green-700" : ""
      }`}
    >
      {isConnected ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      <span className="text-xs">
        {isConnected ? `Cloudant ${responseTime}ms` : "Cloudant Down"}
      </span>
    </Badge>
  );
}

export function StripeBadge() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['/api/status/stripe'],
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 animate-spin" />
        <span className="text-xs">Stripe</span>
      </Badge>
    );
  }

  const isConnected = status?.connected;
  const isConfigured = status?.configured;

  return (
    <Badge 
      variant={isConnected ? "default" : isConfigured ? "secondary" : "outline"} 
      className={`flex items-center gap-1.5 ${
        isConnected ? "bg-blue-600 hover:bg-blue-700" : ""
      }`}
    >
      <CreditCard className="h-3 w-3" />
      <span className="text-xs">
        {isConnected ? "Stripe Ready" : isConfigured ? "Stripe Config" : "Stripe Off"}
      </span>
    </Badge>
  );
}

export function EmailBadge() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['/api/status/email'],
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 animate-spin" />
        <span className="text-xs">Email</span>
      </Badge>
    );
  }

  const isConnected = status?.connected;
  const isConfigured = status?.configured;

  return (
    <Badge 
      variant={isConnected ? "default" : isConfigured ? "secondary" : "outline"} 
      className={`flex items-center gap-1.5 ${
        isConnected ? "bg-green-600 hover:bg-green-700" : ""
      }`}
    >
      <Mail className="h-3 w-3" />
      <span className="text-xs">
        {isConnected ? "Email Ready" : isConfigured ? "Email Config" : "Email Off"}
      </span>
    </Badge>
  );
}

export function SearchBadge() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['/api/status/search'],
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 animate-spin" />
        <span className="text-xs">Search</span>
      </Badge>
    );
  }

  const isConnected = status?.connected;
  const isConfigured = status?.configured;

  return (
    <Badge 
      variant={isConnected ? "default" : isConfigured ? "secondary" : "outline"} 
      className={`flex items-center gap-1.5 ${
        isConnected ? "bg-purple-600 hover:bg-purple-700" : ""
      }`}
    >
      <Search className="h-3 w-3" />
      <span className="text-xs">
        {isConnected ? "Search Ready" : isConfigured ? "Search Config" : "Search Off"}
      </span>
    </Badge>
  );
}

export function SystemStatusSummary() {
  const { data: summary, isLoading } = useQuery<StatusSummary>({
    queryKey: ['/api/status/summary'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 animate-spin" />
        <span className="text-xs">System Status</span>
      </Badge>
    );
  }

  const fullyConnected = summary?.fullyConnected;
  const allConfigured = summary?.connected;

  return (
    <Badge 
      variant={fullyConnected ? "default" : allConfigured ? "secondary" : "destructive"} 
      className={`flex items-center gap-1.5 ${
        fullyConnected ? "bg-green-600 hover:bg-green-700" : ""
      }`}
    >
      {fullyConnected ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      <span className="text-xs">
        {fullyConnected ? "All Systems" : allConfigured ? "Partial" : "System Error"}
      </span>
    </Badge>
  );
}

export default CloudantBadge;