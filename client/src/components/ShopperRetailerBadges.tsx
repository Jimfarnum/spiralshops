import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, Star, Award } from "lucide-react";

interface ShopperBadgeData {
  name: string;
  verified: boolean;
  badges: string[];
  tier: string;
}

interface ShopperRetailerBadgesProps {
  retailerId: string;
  compact?: boolean;
}

export default function ShopperRetailerBadges({ 
  retailerId, 
  compact = false 
}: ShopperRetailerBadgesProps) {
  const [data, setData] = useState<ShopperBadgeData>({
    name: "",
    verified: false,
    badges: [],
    tier: "Growing"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await fetch(`/api/recognition/shopper/retailer/${retailerId}`);
        const result = await response.json();
        
        if (result.status === "success") {
          setData({
            name: result.name || "Unknown Retailer",
            verified: result.verified || false,
            badges: result.badges || [],
            tier: result.tier || "Growing"
          });
        }
      } catch (error) {
        console.error("Failed to fetch retailer badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [retailerId]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "Standard": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getBadgeIcon = (badge: string) => {
    if (badge.includes("Top Performer") || badge.includes("Elite")) {
      return <Award className="h-3 w-3" />;
    }
    if (badge.includes("Customer") || badge.includes("Community")) {
      return <Star className="h-3 w-3" />;
    }
    return <Shield className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {data.verified && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Verified</span>
          </div>
        )}
        
        {data.badges.slice(0, 2).map((badge, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
          >
            {getBadgeIcon(badge)}
            <span className="ml-1">{badge}</span>
          </Badge>
        ))}
        
        {data.badges.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{data.badges.length - 2} more
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        {/* Retailer Name and Verification */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {data.name}
          </h3>
          <div className="flex items-center gap-2">
            {data.verified && (
              <div className="flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
            <Badge className={`text-xs font-semibold ${getTierColor(data.tier)}`}>
              {data.tier}
            </Badge>
          </div>
        </div>

        {/* Badges */}
        {data.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.badges.map((badge, idx) => (
              <Badge
                key={idx}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 font-medium flex items-center gap-1"
              >
                {getBadgeIcon(badge)}
                {badge}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            This retailer is building their reputation on SPIRAL
          </p>
        )}

        {/* Trust Indicators */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>SPIRAL Member</span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Protected by SPIRAL Guarantee
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}