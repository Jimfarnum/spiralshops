import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Zap, Star } from "lucide-react";
import { Link, useLocation } from "wouter";

interface PlanData {
  plan: string | null;
  email: string | null;
}

export default function UpgradeSuccess() {
  const [location] = useLocation();
  const [planData, setPlanData] = useState<PlanData | null>(null);

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const email = urlParams.get('email');
    
    setPlanData({ plan, email });
  }, [location]);

  const getPlanIcon = (plan: string | null) => {
    switch (plan?.toLowerCase()) {
      case "premium": return <Crown className="h-8 w-8 text-purple-600" />;
      case "gold": return <Star className="h-8 w-8 text-yellow-600" />;
      case "silver": return <Zap className="h-8 w-8 text-gray-600" />;
      default: return <CheckCircle className="h-8 w-8 text-green-600" />;
    }
  };

  const getPlanColor = (plan: string | null) => {
    switch (plan?.toLowerCase()) {
      case "premium": return "bg-purple-100 text-purple-800 border-purple-200";
      case "gold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "silver": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  if (!planData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getPlanIcon(planData.plan)}
          </div>
          <CardTitle className="text-2xl">Upgrade Successful!</CardTitle>
          <CardDescription>
            Welcome to your new SPIRAL plan
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <Badge className={`text-lg py-2 px-4 ${getPlanColor(planData.plan)}`}>
            {planData.plan ? `${planData.plan.charAt(0).toUpperCase() + planData.plan.slice(1)} Plan` : 'New Plan'}
          </Badge>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">
              Your plan has been activated and all premium features are now available.
            </p>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>New Features Unlocked:</strong></p>
            <ul className="text-left list-disc list-inside space-y-1">
              {planData.plan?.toLowerCase() === 'silver' && (
                <>
                  <li>100 product listings</li>
                  <li>Advanced analytics dashboard</li>
                  <li>Promotion boost tools</li>
                </>
              )}
              {planData.plan?.toLowerCase() === 'gold' && (
                <>
                  <li>500 product listings</li>
                  <li>Advanced analytics dashboard</li>
                  <li>Promotion boost tools</li>
                  <li>Priority customer support</li>
                  <li>Custom branding options</li>
                </>
              )}
              {planData.plan?.toLowerCase() === 'premium' && (
                <>
                  <li>Unlimited product listings</li>
                  <li>Advanced analytics dashboard</li>
                  <li>Promotion boost tools</li>
                  <li>Priority customer support</li>
                  <li>Custom branding options</li>
                  <li>Dedicated account manager</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button asChild className="flex-1">
              <Link to="/retailer-dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}