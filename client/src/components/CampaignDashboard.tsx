import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Download, 
  Eye, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Rocket, 
  Users,
  Calendar,
  Timer
} from "lucide-react";

interface CampaignStatus {
  success: boolean;
  active: boolean;
  campaignId?: string;
  title?: string;
  status?: string;
  countdown?: number;
  countdownMinutes?: number;
  countdownHours?: number;
  unlocked?: boolean;
  optedOut?: boolean;
  earlyAdopter?: boolean;
  launchDate?: string;
  message?: string;
  lastUpdated?: string;
}

interface PreviewAsset {
  name: string;
  preview: string;
  description: string;
}

export default function CampaignDashboard({ retailerId }: { retailerId: string }) {
  const [status, setStatus] = useState<CampaignStatus | null>(null);
  const [previewAssets, setPreviewAssets] = useState<PreviewAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [optOutReason, setOptOutReason] = useState("");
  const [showOptOutDialog, setShowOptOutDialog] = useState(false);
  const { toast } = useToast();

  // Real-time status fetching
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/campaigns/status/${retailerId}`);
        const data = await res.json();
        setStatus(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch campaign status:", error);
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Update every 30 seconds for real-time countdown
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [retailerId]);

  const handlePreview = async () => {
    try {
      const res = await fetch(`/api/campaigns/preview/${retailerId}`);
      const data = await res.json();
      
      if (data.success) {
        setPreviewAssets(data.previewAssets);
        toast({
          title: "Preview Access Granted!",
          description: data.message
        });
        
        // Refresh status to show early adopter badge
        const statusRes = await fetch(`/api/campaigns/status/${retailerId}`);
        const statusData = await statusRes.json();
        setStatus(statusData);
      } else {
        toast({
          title: "Preview Unavailable",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load preview materials",
        variant: "destructive"
      });
    }
  };

  const handleOptOut = async () => {
    try {
      const res = await fetch(`/api/campaigns/opt-out/${retailerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: optOutReason || "Not aligned with my store" })
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: data.alreadyOptedOut ? "Already Opted Out" : "Opt-Out Confirmed",
          description: data.message
        });
        
        // Refresh status
        const statusRes = await fetch(`/api/campaigns/status/${retailerId}`);
        const statusData = await statusRes.json();
        setStatus(statusData);
        
        setShowOptOutDialog(false);
        setOptOutReason("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to opt out of campaign",
        variant: "destructive"
      });
    }
  };

  const formatCountdown = (countdown: number) => {
    const hours = Math.floor(countdown / 1000 / 60 / 60);
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / 1000 / 60);
    const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatLaunchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading campaign status...</span>
        </CardContent>
      </Card>
    );
  }

  if (!status || !status.active) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            📢 SPIRAL National Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No active campaigns at this time. Stay tuned for upcoming SPIRAL national campaigns!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-blue-600" />
              {status.title || "SPIRAL National Campaign"}
            </CardTitle>
            <div className="flex gap-2">
              {status.earlyAdopter && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Users className="h-3 w-3 mr-1" />
                  Early Adopter
                </Badge>
              )}
              <Badge 
                variant={status.status === "live" ? "default" : "secondary"}
                className={status.status === "live" ? "bg-green-100 text-green-800" : ""}
              >
                {status.status === "live" ? "🔴 LIVE" : "⏰ Scheduled"}
              </Badge>
            </div>
          </div>
          {status.message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {status.message}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Opted Out State */}
          {status.optedOut && (
            <Alert className="border-red-200 bg-red-50">
              <X className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                ❌ <strong>You have opted out of this campaign.</strong> You will not receive campaign materials or notifications.
              </AlertDescription>
            </Alert>
          )}

          {/* Campaign Live State */}
          {status.status === "live" && !status.optedOut && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                🎉 <strong>Campaign is LIVE!</strong> Download your campaign materials now and start posting.
              </AlertDescription>
            </Alert>
          )}

          {/* Countdown Timer for Scheduled Campaigns */}
          {status.status === "scheduled" && status.countdown && status.countdown > 0 && !status.optedOut && (
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Timer className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <p className="text-sm text-blue-600 font-medium">Launching in:</p>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-400">
                      {formatCountdown(status.countdown)}
                    </p>
                    {status.launchDate && (
                      <p className="text-xs text-blue-600 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatLaunchDate(status.launchDate)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {!status.optedOut && (
            <div className="flex gap-3 flex-wrap">
              {/* Live Campaign - Download Button */}
              {status.status === "live" && (
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => window.open('/api/campaigns/list', '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Campaign Pack
                </Button>
              )}
              
              {/* Scheduled Campaign - Preview Button */}
              {status.status === "scheduled" && (
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {status.earlyAdopter ? "View Preview Again" : "Get Early Preview"}
                </Button>
              )}
              
              {/* Opt-Out Button */}
              <Button 
                variant="destructive" 
                onClick={() => setShowOptOutDialog(true)}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Opt Out
              </Button>
            </div>
          )}

          {/* Preview Assets Display */}
          {previewAssets.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Campaign Preview Materials
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {previewAssets.map((asset, idx) => (
                    <Card key={idx} className="p-3 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-2 min-h-[80px] flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {asset.name} Preview
                          </span>
                        </div>
                        <p className="text-xs font-medium">{asset.name}</p>
                        <p className="text-xs text-gray-500">{asset.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaign Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Campaign ID:</span>
                <p className="font-mono text-xs">{status.campaignId?.slice(0, 8)}...</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="capitalize">{status.status}</p>
              </div>
              {status.launchDate && (
                <div className="col-span-2">
                  <span className="text-gray-500">Launch Date:</span>
                  <p>{formatLaunchDate(status.launchDate)}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opt-Out Dialog */}
      {showOptOutDialog && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Opt Out of Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to opt out of this campaign? You will not receive any campaign materials or notifications.
            </p>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Reason (optional):
              </label>
              <select 
                value={optOutReason}
                onChange={(e) => setOptOutReason(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a reason...</option>
                <option value="Not aligned with my store brand">Not aligned with my store brand</option>
                <option value="Timing doesn't work for my business">Timing doesn't work for my business</option>
                <option value="Content not suitable for my audience">Content not suitable for my audience</option>
                <option value="Too busy with other campaigns">Too busy with other campaigns</option>
                <option value="Technical issues">Technical issues</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="destructive" 
                onClick={handleOptOut}
                className="flex-1"
              >
                Confirm Opt-Out
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowOptOutDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}