import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Crown, Star } from "lucide-react";

const PlanUpgradeButton = ({ currentPlan, stripeCustomerEmail }) => {
  const [loading, setLoading] = useState(false);

  const planPricing = {
    silver: { price: 29, icon: <Zap className="h-4 w-4" />, color: "bg-gray-100 text-gray-800" },
    gold: { price: 79, icon: <Star className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" },
    premium: { price: 149, icon: <Crown className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" }
  };

  const handleUpgrade = async (planTier) => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTier,
          retailerEmail: stripeCustomerEmail
        })
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Upgrade failed:", data.error);
        // In a real app, you'd show a toast notification
        alert("⚠️ Upgrade failed. " + (data.error || "Please try again."));
      }
    } catch (error) {
      console.error("Upgrade request failed:", error);
      alert("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableUpgrades = () => {
    const upgrades = [];
    
    if (currentPlan === "Free") {
      upgrades.push("silver", "gold", "premium");
    } else if (currentPlan === "Silver") {
      upgrades.push("gold", "premium");
    } else if (currentPlan === "Gold") {
      upgrades.push("premium");
    }
    
    return upgrades;
  };

  const availableUpgrades = getAvailableUpgrades();

  if (availableUpgrades.length === 0) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Crown className="h-4 w-4 mr-1" />
        Premium Plan Active
      </Badge>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">
        Available Upgrades:
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableUpgrades.map((planTier) => {
          const plan = planPricing[planTier];
          return (
            <Button
              key={planTier}
              onClick={() => handleUpgrade(planTier)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                plan.icon
              )}
              <span className="capitalize">{planTier}</span>
              <Badge variant="secondary" className={plan.color}>
                ${plan.price}/mo
              </Badge>
            </Button>
          );
        })}
      </div>
      
      {currentPlan === "Free" && (
        <div className="text-xs text-gray-500 mt-2">
          Start with Silver to unlock advanced analytics and promotion tools
        </div>
      )}
    </div>
  );
};

export default PlanUpgradeButton;