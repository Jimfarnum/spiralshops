import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Download, Lock, Rocket, Share2, Video, Image, FileText, Settings } from "lucide-react";
import CampaignDashboard from "./CampaignDashboard";

interface Campaign {
  name: string;
  download: string;
  icon?: React.ReactNode;
  description?: string;
}

export default function CampaignPack({ retailerId = "demo_retailer_1" }: { retailerId?: string }) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function checkUnlock() {
      try {
        const res = await fetch(`/api/campaigns/status/${retailerId}`);
        const data = await res.json();
        setUnlocked(data.unlocked || data.active);
        setLoading(false);
      } catch (error) {
        console.error("Failed to check campaign status:", error);
        setLoading(false);
      }
    }
    checkUnlock();
  }, [retailerId]);

  useEffect(() => {
    if (unlocked) {
      async function loadCampaigns() {
        try {
          const res = await fetch("/api/campaigns/list");
          const data = await res.json();
          setCampaigns(data);
        } catch (error) {
          console.error("Failed to load campaigns:", error);
          toast({
            title: "Error",
            description: "Failed to load campaign materials",
            variant: "destructive"
          });
        }
      }
      loadCampaigns();
    }
  }, [unlocked, toast]);

  const getCampaignIcon = (name: string) => {
    if (name.toLowerCase().includes('tiktok') || name.toLowerCase().includes('video')) {
      return <Video className="h-5 w-5 text-pink-600" />;
    }
    if (name.toLowerCase().includes('instagram') || name.toLowerCase().includes('graphics')) {
      return <Image className="h-5 w-5 text-purple-600" />;
    }
    if (name.toLowerCase().includes('facebook') || name.toLowerCase().includes('posts')) {
      return <Share2 className="h-5 w-5 text-blue-600" />;
    }
    if (name.toLowerCase().includes('qr') || name.toLowerCase().includes('flyer')) {
      return <FileText className="h-5 w-5 text-green-600" />;
    }
    return <Download className="h-5 w-5 text-gray-600" />;
  };

  const handleDownload = (campaign: Campaign) => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = campaign.download;
    link.download = campaign.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `${campaign.name} is being downloaded`
    });
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

  if (!unlocked) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-fit">
            <Lock className="h-8 w-8 text-gray-500" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Rocket className="h-5 w-5" />
            SPIRAL Social Campaign Pack
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            🚀 This feature will be unlocked by SPIRAL Admin during a coordinated
            national launch. Be ready!
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Coming Soon:</strong> Professional marketing materials for TikTok, Instagram, 
              Facebook, and X (Twitter) will be available here when campaigns go live.
            </p>
          </div>
          <Button disabled className="bg-gray-400 cursor-not-allowed">
            <Lock className="h-4 w-4 mr-2" />
            Locked
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-600" />
          SPIRAL Social Campaign Pack
          <Badge variant="default" className="ml-2">
            Live
          </Badge>
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          🎉 Your campaigns are ready! Share across TikTok, Instagram, Facebook,
          and X with one click.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No campaigns available</p>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    {getCampaignIcon(campaign.name)}
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      {campaign.description && (
                        <p className="text-sm text-gray-500">{campaign.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(campaign)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                {idx < campaigns.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
        
        
        <div className="mt-6 flex justify-between items-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-1 mr-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Pro Tip:</strong> Each pack contains ready-to-use content optimized for the specific platform. 
              Simply download, customize with your store details, and share to maximize your reach!
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showAdvanced ? "Simple View" : "Advanced"}
          </Button>
        </div>
      </CardContent>
    </Card>
    
    {/* Advanced Campaign Dashboard */}
    {showAdvanced && (
      <div className="mt-6">
        <CampaignDashboard retailerId={retailerId} />
      </div>
    )}
  </div>
  );
}