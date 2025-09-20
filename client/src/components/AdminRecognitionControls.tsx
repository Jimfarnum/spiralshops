import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Database, Activity, Clock, CheckCircle } from "lucide-react";

interface SoapGLog {
  action: string;
  retailerId?: string;
  total?: number;
  ts: string;
  awarded?: string[];
  engagement?: number;
}

export default function AdminRecognitionControls() {
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState<SoapGLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string>("");

  async function recalcAll() {
    setBusy(true);
    setLastResult("");
    try {
      const response = await fetch("/api/recognition/recompute-all", { method: "POST" });
      const result = await response.json();
      
      if (result.ok) {
        setLastResult(`✅ Successfully recalculated engagement & badges for ${result.updated} retailers.`);
        fetchLogs(); // Refresh logs
      } else {
        setLastResult(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setLastResult(`❌ Network error: ${error}`);
    } finally {
      setBusy(false);
    }
  }

  async function fetchLogs() {
    setLogsLoading(true);
    try {
      const response = await fetch("/api/recognition/logs");
      const result = await response.json();
      
      if (result.ok) {
        setLogs(result.logs || []);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLogsLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Recognition System Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={recalcAll}
              disabled={busy}
              className="flex items-center gap-2"
              size="lg"
            >
              <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
              {busy ? "Recomputing All…" : "Recompute All Retailers Now"}
            </Button>
            
            <Button
              onClick={fetchLogs}
              disabled={logsLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Activity className={`h-4 w-4 ${logsLoading ? 'animate-spin' : ''}`} />
              Refresh Logs
            </Button>
          </div>

          {lastResult && (
            <Alert className={lastResult.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{lastResult}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">How the Auto-Award System Works:</h4>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Engagement Score:</strong> Calculated from campaign activity, social shares, QR scans, and SPIRAL redemptions</li>
              <li>• <strong>Badge Awards:</strong> Rising Star (100+ score), Loyalty Leader (500+ redemptions), Community Anchor (10+ years + 300+ score), Top Performer (90th percentile in tier)</li>
              <li>• <strong>Automated Schedule:</strong> Runs every night at 2:05 AM to update all retailer recognition</li>
              <li>• <strong>Real-time Updates:</strong> Individual retailer scores can be recalculated immediately after key activities</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* SOAP-G Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            SOAP-G Recognition System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading system logs...</p>
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.action === "recalc_all" ? "default" : "secondary"}>
                        {log.action === "recalc_all" ? "Bulk Update" : "Individual Update"}
                      </Badge>
                      {log.retailerId && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Retailer: {log.retailerId}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(log.ts).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    {log.total && (
                      <div>📊 <strong>Total Processed:</strong> {log.total} retailers</div>
                    )}
                    {log.engagement && (
                      <div>📈 <strong>Engagement Score:</strong> {log.engagement}</div>
                    )}
                    {log.awarded && log.awarded.length > 0 && (
                      <div>🏆 <strong>Badges Awarded:</strong> {log.awarded.join(", ")}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recognition system logs found.</p>
              <p className="text-sm">Logs will appear after badge recalculations.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">SPIRAL Recognition Auto-Award System Active</span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">
            Nightly automated badge processing at 2:05 AM • Real-time individual updates available • SOAP-G logging enabled
          </p>
        </CardContent>
      </Card>
    </div>
  );
}