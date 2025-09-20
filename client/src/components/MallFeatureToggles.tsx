import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Info,
  RotateCcw
} from 'lucide-react';

interface Features {
  [key: string]: boolean;
}

interface MallFeatureTogglesProps {
  mallId: string;
}

const featureDescriptions = {
  onboarding: "Automated retailer onboarding system with step-by-step guidance",
  verification: "5-tier store verification system with trust badges",
  events: "Mall events calendar and promotional campaigns",
  qrCampaigns: "QR code generation for products and campaigns",
  analytics: "Detailed analytics dashboard and reporting",
  aiAssistant: "AI-powered assistance for retailers and shoppers",
  loyaltyProgram: "SPIRAL points earning and redemption system",
  socialSharing: "Social media integration and sharing rewards",
  mobilePay: "Mobile payment processing including Apple/Google Pay",
  deliveryTracking: "Real-time delivery and pickup tracking"
};

export default function MallFeatureToggles({ mallId }: MallFeatureTogglesProps) {
  const [features, setFeatures] = useState<Features>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadFeatures = async () => {
    try {
      const response = await fetch(`/api/mall/${mallId}/features`);
      const data = await response.json();
      
      if (data.ok) {
        setFeatures(data.features);
        setLastUpdated(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Failed to load mall features:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, [mallId]);

  const toggleFeature = async (featureKey: string) => {
    setSaving(featureKey);
    
    try {
      const updatedFeatures = { 
        ...features, 
        [featureKey]: !features[featureKey] 
      };
      
      const response = await fetch(`/api/mall/${mallId}/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: updatedFeatures }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setFeatures(data.features);
        setLastUpdated(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
    } finally {
      setSaving(null);
    }
  };

  const resetToDefaults = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/mall/${mallId}/features/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setFeatures(data.features);
        setLastUpdated(new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Failed to reset features:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeFeatures = Object.values(features).filter(Boolean).length;
  const totalFeatures = Object.keys(features).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Mall Feature Settings
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {activeFeatures}/{totalFeatures} Active
              </Badge>
              <Button
                onClick={loadFeatures}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-orange-600"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Mall ID: <strong>{mallId}</strong> • Last updated: {lastUpdated}
              <br />
              Toggle features ON/OFF. Disabled features are hidden from retailers and shoppers.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {Object.entries(features).map(([featureKey, isEnabled]) => (
              <div key={featureKey} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize text-lg">
                        {featureKey.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {isEnabled ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {featureDescriptions[featureKey as keyof typeof featureDescriptions] || 
                       'Feature description not available'}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => toggleFeature(featureKey)}
                    disabled={saving === featureKey}
                    className={`ml-4 ${
                      isEnabled 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`}
                  >
                    {saving === featureKey ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : isEnabled ? (
                      <div className="flex items-center gap-1">
                        <ToggleRight className="h-4 w-4" />
                        ON
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ToggleLeft className="h-4 w-4" />
                        OFF
                      </div>
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500">
                  Status: {isEnabled ? 'Active - Visible to users' : 'Disabled - Hidden from users'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Feature Management System</span>
              <span>Changes take effect immediately</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}