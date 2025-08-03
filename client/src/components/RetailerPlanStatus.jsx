import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Star, Gift } from "lucide-react";

const RetailerPlanStatus = ({ stripeCustomerId }) => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanStatus = async () => {
      try {
        const response = await fetch(`/api/plan-status/${stripeCustomerId}`);
        const data = await response.json();
        setPlanData(data);
      } catch (error) {
        console.error('Error fetching plan status:', error);
        setPlanData({ plan: "Free", features: {} });
      } finally {
        setLoading(false);
      }
    };

    if (stripeCustomerId) {
      fetchPlanStatus();
    }
  }, [stripeCustomerId]);

  const getPlanIcon = (plan) => {
    switch (plan) {
      case "Premium": return <Crown className="h-5 w-5 text-purple-600" />;
      case "Gold": return <Star className="h-5 w-5 text-yellow-600" />;
      case "Silver": return <Zap className="h-5 w-5 text-gray-600" />;
      default: return <Gift className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Premium": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Gold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Silver": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const { plan, features, mock } = planData || {};

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getPlanIcon(plan)}
            <div>
              <CardTitle className="text-xl">Your SPIRAL Plan</CardTitle>
              <CardDescription>
                Current subscription status and features
              </CardDescription>
            </div>
          </div>
          <Badge className={getPlanColor(plan)}>
            {plan} Plan
            {mock && " (Demo)"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Product Listings:</div>
            <Badge variant="outline">
              {features?.productListings === -1 ? "Unlimited" : features?.productListings || 0}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Analytics:</div>
            <Badge variant={features?.advancedAnalytics ? "default" : "secondary"}>
              {features?.advancedAnalytics ? "Advanced" : "Basic"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Promotion Boost:</div>
            <Badge variant={features?.promoBoost ? "default" : "secondary"}>
              {features?.promoBoost ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Support:</div>
            <Badge variant={features?.prioritySupport ? "default" : "secondary"}>
              {features?.prioritySupport ? "Priority" : "Standard"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Branding:</div>
            <Badge variant={features?.customBranding ? "default" : "secondary"}>
              {features?.customBranding ? "Custom" : "SPIRAL"}
            </Badge>
          </div>
        </div>

        {plan !== "Premium" && (
          <div className="flex space-x-2">
            <Button variant="default" size="sm">
              Upgrade Plan
            </Button>
            <Button variant="outline" size="sm">
              View All Plans
            </Button>
          </div>
        )}

        {plan === "Free" && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Upgrade to unlock:</strong> Advanced analytics, promotion boost tools, and priority support
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RetailerPlanStatus;