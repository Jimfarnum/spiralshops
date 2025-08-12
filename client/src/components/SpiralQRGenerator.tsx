import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  Download, 
  Copy,
  Sparkles,
  BarChart3,
  Calendar,
  ExternalLink,
  Eye,
  Zap
} from 'lucide-react';

interface Campaign {
  _id: string;
  campaignName: string;
  targetUrl: string;
  scans: number;
  createdAt: string;
}

interface AISuggestion {
  name: string;
  description: string;
  targetUrl: string;
}

interface QRGeneratorProps {
  className?: string;
  onQRGenerated?: (qrData: any) => void;
}

export default function SpiralQRGenerator({ 
  className = "",
  onQRGenerated 
}: QRGeneratorProps) {
  const [campaignName, setCampaignName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [style, setStyle] = useState<'full' | 'compact'>('full');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load existing campaigns
      const campaignsResponse = await fetch('/api/qr/admin/qr-dashboard');
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      // Load AI suggestions
      const suggestionsResponse = await fetch('/api/qr/mall-manager/qr-hub');
      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json();
        setAiSuggestions(suggestionsData.aiSuggestions || []);
      }
    } catch (error) {
      console.error('Failed to load QR data:', error);
      toast({
        title: "Loading Failed",
        description: "Could not load existing campaigns and suggestions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async () => {
    if (!campaignName.trim() || !targetUrl.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both campaign name and target URL",
        variant: "destructive"
      });
      return;
    }

    // Validate URL format
    try {
      new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/qr/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          retailerId: 'spiral-qr-generator',
          campaignName: campaignName.trim(),
          targetUrl: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
          style,
          shopperId: 'admin-generated'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setQrImage(data.qrImage);
        
        toast({
          title: "QR Code Generated!",
          description: `Campaign "${campaignName}" is ready to use`,
        });

        // Callback for parent component
        if (onQRGenerated) {
          onQRGenerated(data);
        }

        // Reload campaigns to show the new one
        loadData();
      } else {
        throw new Error(data.message || 'Generation failed');
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate QR code",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrImage) return;

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `SPIRAL-${campaignName.replace(/[^a-zA-Z0-9]/g, '-')}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Downloaded",
      description: "QR code saved to downloads"
    });
  };

  const copyQRImage = async () => {
    if (!qrImage) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrImage);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);

      toast({
        title: "QR Copied",
        description: "QR code copied to clipboard"
      });
    } catch (error) {
      // Fallback to copying the data URL
      try {
        await navigator.clipboard.writeText(qrImage);
        toast({
          title: "QR Data Copied",
          description: "QR code data copied to clipboard"
        });
      } catch (fallbackError) {
        toast({
          title: "Copy Failed",
          description: "Could not copy QR code",
          variant: "destructive"
        });
      }
    }
  };

  const applySuggestion = (suggestion: string) => {
    setCampaignName(suggestion);
    // Generate a reasonable target URL based on the suggestion
    const urlFriendly = suggestion.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setTargetUrl(`https://spiralshops.com/campaign/${urlFriendly}`);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <QrCode className="w-6 h-6" />
          SPIRAL QR Code Generator
        </CardTitle>
        <CardDescription className="text-blue-600">
          Create branded QR codes with embedded SPIRAL logos for campaigns and promotions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Generator Form */}
        <div className="bg-white/80 p-6 rounded-lg border border-blue-200 space-y-4">
          <div>
            <Label htmlFor="campaign-name" className="text-blue-800 font-medium">Campaign Name</Label>
            <Input
              id="campaign-name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Summer Sale 2024"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="target-url" className="text-blue-800 font-medium">Target URL</Label>
            <Input
              id="target-url"
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://spiralshops.com/campaign/summer-sale"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label className="text-blue-800 font-medium">QR Style</Label>
            <Select value={style} onValueChange={(value: 'full' | 'compact') => setStyle(value)}>
              <SelectTrigger className="border-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full (with SPIRAL logo)</SelectItem>
                <SelectItem value="compact">Compact (no logo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateQR}
            disabled={generating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {generating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating QR Code...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Generate QR Code
              </div>
            )}
          </Button>
        </div>

        {/* Generated QR Display */}
        {qrImage && (
          <div className="bg-white/90 p-6 rounded-lg border border-blue-200 text-center space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">Your QR Code is Ready!</h3>
            
            <div className="inline-block p-4 bg-white rounded-lg shadow-sm border-2 border-blue-100">
              <img 
                src={qrImage} 
                alt={`SPIRAL QR Code for ${campaignName}`}
                className={style === 'full' ? 'w-64 h-64' : 'w-48 h-48'}
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                {style === 'full' ? 'Branded SPIRAL QR' : 'Compact QR'}
              </Badge>
              <Badge variant="outline" className="text-green-700 border-green-300">
                Campaign: {campaignName}
              </Badge>
            </div>

            <div className="flex justify-center gap-3">
              <Button 
                onClick={downloadQR}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              
              <Button 
                onClick={copyQRImage}
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>

              <Button 
                onClick={() => window.open(targetUrl, '_blank')}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Test URL
              </Button>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-900 mb-3">
              <Sparkles className="w-5 h-5" />
              AI Campaign Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => applySuggestion(suggestion)}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left border-purple-200 hover:bg-purple-100 h-auto p-3"
                >
                  <div className="text-sm text-purple-700">{suggestion}</div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Existing Campaigns */}
        {campaigns.length > 0 && (
          <div className="bg-white/80 p-4 rounded-lg border border-blue-200">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-900 mb-4">
              <BarChart3 className="w-5 h-5" />
              Recent Campaigns
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {campaigns.slice(0, 5).map((campaign) => (
                <div 
                  key={campaign._id}
                  className="flex items-center justify-between p-3 bg-white rounded border border-blue-100 hover:border-blue-200 transition-colors"
                >
                  <div>
                    <div className="font-medium text-blue-900">{campaign.campaignName}</div>
                    <div className="text-sm text-blue-600 truncate max-w-xs">
                      {campaign.targetUrl}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Eye className="w-4 h-4" />
                      {campaign.scans} scans
                    </div>
                    <div className="text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {campaigns.length > 5 && (
              <div className="text-center mt-3">
                <Badge variant="outline" className="text-blue-600">
                  +{campaigns.length - 5} more campaigns
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}