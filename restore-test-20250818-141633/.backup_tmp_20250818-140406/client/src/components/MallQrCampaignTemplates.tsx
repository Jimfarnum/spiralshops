import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Target, 
  Users, 
  Calendar, 
  Download,
  Copy,
  Share2,
  TrendingUp,
  Clock,
  Heart,
  Gift,
  Star,
  Award,
  Handshake
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  suggestedIncentive: string;
  defaultLandingPath: string;
  suggestedCopy: string;
  suggestedHashtags: string[];
  category: string;
  estimatedReach: string;
  duration: string;
}

interface CampaignResult {
  success: boolean;
  campaignId: string;
  qrLink: string;
  qrImage: string;
  template: Template;
  campaign: {
    name: string;
    incentive: string;
    copy: string;
    hashtags: string[];
  };
}

interface Props {
  ownerType?: 'mall' | 'retailer';
  ownerId?: string;
  className?: string;
}

const categoryIcons = {
  promotional: Target,
  event: Calendar,
  seasonal: Gift,
  'trust-building': Award,
  loyalty: Star,
  community: Handshake
};

const reachColors = {
  High: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-blue-100 text-blue-800 border-blue-200'
};

export default function MallQrCampaignTemplates({ 
  ownerType = "mall", 
  ownerId = "demo-mall-001",
  className = ""
}: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [campaignName, setCampaignName] = useState("");
  const [customIncentive, setCustomIncentive] = useState("");
  const [customCopy, setCustomCopy] = useState("");
  const [notes, setNotes] = useState("");
  const [qrResult, setQrResult] = useState<CampaignResult | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const url = selectedCategory === "all" 
        ? "/api/qr/templates" 
        : `/api/qr/templates?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast({
        title: "Fetch Failed",
        description: "Could not load campaign templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createFromTemplate = async () => {
    if (!selectedTemplate || !ownerId) {
      toast({
        title: "Selection Required",
        description: "Please select a template and ensure owner ID is set",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      const body = {
        templateId: selectedTemplate.id,
        ownerType,
        ownerId,
        campaignName: campaignName || selectedTemplate.name,
        customIncentive: customIncentive || undefined,
        customCopy: customCopy || undefined,
        metadata: { notes: notes || undefined },
      };

      const response = await fetch("/api/qr/create-from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.success) {
        setQrResult(data);
        toast({
          title: "Campaign Created!",
          description: `Your "${data.campaign.name}" campaign is ready to launch`,
        });
      } else {
        throw new Error(data.error || 'Failed to create campaign');
      }
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Could not create campaign from template",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const downloadQR = () => {
    if (!qrResult?.qrImage) return;

    const link = document.createElement('a');
    link.href = qrResult.qrImage;
    link.download = `SPIRAL-${qrResult.campaign.name.replace(/[^a-zA-Z0-9]/g, '-')}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Downloaded",
      description: "Campaign QR code saved to downloads"
    });
  };

  const copyLink = async () => {
    if (!qrResult?.qrLink) return;

    try {
      await navigator.clipboard.writeText(qrResult.qrLink);
      toast({
        title: "Link Copied",
        description: "Campaign link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const shareQR = async () => {
    if (!qrResult?.qrLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SPIRAL Campaign - ${qrResult.campaign.name}`,
          text: qrResult.campaign.copy,
          url: qrResult.qrLink,
        });
      } catch (error) {
        // User cancelled or not supported
      }
    } else {
      copyLink();
    }
  };

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Sparkles className="w-6 h-6" />
          QR Campaign Templates
        </CardTitle>
        <CardDescription className="text-purple-600">
          Choose from proven marketing templates and generate trackable QR campaigns with SOAP G coordination
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!qrResult ? (
          <>
            {/* Category Filter */}
            <div className="flex items-center gap-4 mb-6">
              <Label htmlFor="category-filter" className="text-purple-800 font-medium">
                Filter by Category:
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-purple-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const IconComponent = categoryIcons[template.category as keyof typeof categoryIcons] || Target;
                const isSelected = selectedTemplate?.id === template.id;
                
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-purple-400 bg-purple-100 shadow-md' 
                        : 'border-purple-200 bg-white/60 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <IconComponent className="w-5 h-5 text-purple-600" />
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${reachColors[template.estimatedReach as keyof typeof reachColors]}`}
                        >
                          {template.estimatedReach}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {template.duration}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-purple-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-purple-700 mb-3">{template.description}</p>
                    
                    <div className="space-y-2 text-xs text-purple-600">
                      <div>
                        <strong>Incentive:</strong> {template.suggestedIncentive}
                      </div>
                      <div>
                        <strong>Hashtags:</strong> {template.suggestedHashtags.join(' ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campaign Customization */}
            {selectedTemplate && (
              <div className="border-t border-purple-200 pt-6 space-y-4">
                <h3 className="font-semibold text-purple-900 mb-4">Customize Your Campaign</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign-name" className="text-purple-800">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder={selectedTemplate.name}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="custom-incentive" className="text-purple-800">Custom Incentive (Optional)</Label>
                    <Input
                      id="custom-incentive"
                      value={customIncentive}
                      onChange={(e) => setCustomIncentive(e.target.value)}
                      placeholder={selectedTemplate.suggestedIncentive}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="custom-copy" className="text-purple-800">Custom Copy (Optional)</Label>
                  <Textarea
                    id="custom-copy"
                    value={customCopy}
                    onChange={(e) => setCustomCopy(e.target.value)}
                    placeholder={selectedTemplate.suggestedCopy}
                    className="border-purple-200 focus:border-purple-400"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes" className="text-purple-800">Internal Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes for your team (not visible to customers)..."
                    className="border-purple-200 focus:border-purple-400"
                    rows={2}
                  />
                </div>
                
                <Button
                  onClick={createFromTemplate}
                  disabled={creating || !selectedTemplate || !ownerId}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {creating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Campaign...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Campaign QR Code
                    </div>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Campaign Result */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">Campaign Ready! 🎉</h3>
              <p className="text-purple-700">Your "{qrResult.campaign.name}" campaign is live and trackable</p>
            </div>

            <div className="bg-white/80 p-6 rounded-lg border border-purple-200">
              <div className="text-center mb-4">
                <img 
                  src={qrResult.qrImage} 
                  alt={`QR Code for ${qrResult.campaign.name}`}
                  className="w-64 h-64 mx-auto border-2 border-purple-100 rounded-lg shadow-sm"
                />
              </div>

              {/* QR Actions */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <Button 
                  onClick={downloadQR}
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                
                <Button 
                  onClick={copyLink}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Link
                </Button>
                
                <Button 
                  onClick={shareQR}
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Campaign Details */}
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-purple-50 border border-purple-100 rounded">
                  <strong className="text-purple-800">Campaign Copy:</strong>
                  <p className="text-purple-700 italic mt-1">{qrResult.campaign.copy}</p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-100 rounded">
                  <strong className="text-blue-800">Incentive:</strong>
                  <p className="text-blue-700 mt-1">{qrResult.campaign.incentive}</p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-100 rounded">
                  <strong className="text-green-800">Hashtags:</strong>
                  <p className="text-green-700 mt-1">{qrResult.campaign.hashtags.join(' ')}</p>
                </div>
                
                <div className="text-xs text-purple-600 p-2 bg-purple-50 border border-purple-100 rounded">
                  <p><strong>Campaign ID:</strong> {qrResult.campaignId}</p>
                  <p><strong>Template:</strong> {qrResult.template.name} ({qrResult.template.category})</p>
                  <p><strong>Tracking:</strong> All QR scans will be logged to SOAP G analytics</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setQrResult(null);
                setSelectedTemplate(null);
                setCampaignName("");
                setCustomIncentive("");
                setCustomCopy("");
                setNotes("");
              }}
              variant="outline"
              className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Create Another Campaign
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}