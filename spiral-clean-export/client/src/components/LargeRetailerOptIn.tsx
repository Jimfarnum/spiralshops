import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, ShoppingBag, Star, Truck, CreditCard, Shield, Info } from "lucide-react";

interface LargeRetailerOptInProps {
  userId: string;
  className?: string;
  onToggle?: (optedIn: boolean) => void;
}

interface OptInStatus {
  optedIn: boolean;
  preferences: {
    categories?: string[];
    maxDistance?: number;
    notificationsEnabled?: boolean;
  };
}

export default function LargeRetailerOptIn({ 
  userId, 
  className = "",
  onToggle 
}: LargeRetailerOptInProps) {
  const [optInStatus, setOptInStatus] = useState<OptInStatus>({
    optedIn: false,
    preferences: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOptInStatus();
  }, [userId]);

  const fetchOptInStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/large-retailer/status/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOptInStatus({
          optedIn: data.optedIn,
          preferences: data.preferences || {}
        });
      }
    } catch (error) {
      console.error("Error fetching opt-in status:", error);
      toast({
        title: "Error",
        description: "Failed to load preferences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOptIn = async (optedIn: boolean) => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/large-retailer/opt-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          optedIn,
          preferences: optInStatus.preferences
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOptInStatus(prev => ({
          ...prev,
          optedIn: data.setting.optedIn
        }));

        toast({
          title: optedIn ? "Large Retailer Offers Enabled" : "Large Retailer Offers Disabled",
          description: optedIn 
            ? "You'll now see offers from major retailers alongside local businesses" 
            : "You'll only see local business offers",
        });

        if (onToggle) {
          onToggle(optedIn);
        }
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      console.error("Error toggling opt-in:", error);
      toast({
        title: "Update Failed",
        description: "Unable to update preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const largeRetailerBenefits = [
    {
      icon: ShoppingBag,
      title: "Expanded Product Selection",
      description: "Access to thousands of additional products from major retailers"
    },
    {
      icon: Truck,
      title: "Fast Shipping Options",
      description: "Next-day and same-day delivery from large retailer distribution centers"
    },
    {
      icon: CreditCard,
      title: "Competitive Pricing",
      description: "Compare prices across local and national retailers for best deals"
    },
    {
      icon: Star,
      title: "Verified Quality",
      description: "Products from established brands with extensive quality guarantees"
    }
  ];

  const localBusinessAdvantages = [
    {
      icon: Building2,
      title: "Support Your Community",
      description: "Keep money circulating in your local economy"
    },
    {
      icon: Shield,
      title: "Personal Service",
      description: "Build relationships with local business owners who know you"
    },
    {
      icon: Star,
      title: "Unique Products",
      description: "Discover one-of-a-kind items you won't find anywhere else"
    },
    {
      icon: Info,
      title: "Local Expertise",
      description: "Get advice from people who understand your community's needs"
    }
  ];

  if (isLoading) {
    return (
      <Card className={`bg-white shadow-lg ${className}`}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--spiral-navy)] mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading preferences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Toggle Card */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--spiral-navy)]" />
            Large Retailer Integration
          </CardTitle>
          <CardDescription>
            Choose whether to include offers from major retailers alongside local businesses
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="large-retailer-toggle" className="text-base font-medium">
                Include Large Retailer Offers
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Show products from major retailers like Amazon, Target, and Walmart
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={optInStatus.optedIn ? "default" : "secondary"}
                className={optInStatus.optedIn ? "bg-green-500" : "bg-gray-400"}
              >
                {optInStatus.optedIn ? "Enabled" : "Disabled"}
              </Badge>
              <Switch
                id="large-retailer-toggle"
                checked={optInStatus.optedIn}
                onCheckedChange={toggleOptIn}
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Current Status Info */}
          <div className={`p-4 rounded-lg border-2 ${
            optInStatus.optedIn 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-3">
              {optInStatus.optedIn ? (
                <ShoppingBag className="w-5 h-5 text-blue-600 mt-0.5" />
              ) : (
                <Building2 className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              <div>
                <h4 className={`font-semibold ${
                  optInStatus.optedIn ? 'text-blue-900' : 'text-green-900'
                }`}>
                  {optInStatus.optedIn 
                    ? "Mixed Marketplace Active" 
                    : "Local-Only Mode Active"
                  }
                </h4>
                <p className={`text-sm ${
                  optInStatus.optedIn ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {optInStatus.optedIn
                    ? "You're seeing products from both local businesses and major retailers"
                    : "You're only seeing products from local businesses in your area"
                  }
                </p>
                {optInStatus.optedIn && (
                  <p className="text-xs text-blue-600 mt-1">
                    Local businesses are still prioritized in search results and earn you bonus SPIRALs
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Large Retailer Benefits */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <ShoppingBag className="w-5 h-5" />
              Large Retailer Benefits
            </CardTitle>
            <CardDescription>
              What you gain by including major retailers
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {largeRetailerBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <benefit.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Local Business Advantages */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Building2 className="w-5 h-5" />
              Local Business Focus
            </CardTitle>
            <CardDescription>
              Why supporting local businesses matters
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {localBusinessAdvantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <advantage.icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">{advantage.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="bg-gray-50 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              You can change this preference anytime from your dashboard settings
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/products'}
                className="border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white"
              >
                Browse Products
              </Button>
              <Button
                onClick={() => window.location.href = '/shopper-dashboard'}
                className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-navy)] text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}