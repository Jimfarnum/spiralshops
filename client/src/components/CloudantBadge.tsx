import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

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

export default function CloudantBadge() {
  const { data: status, isLoading, error } = useQuery<CloudantStatus>({
    queryKey: ['/api/cloudant-status'],
    refetchInterval: 30000, // Refresh every 30 seconds
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