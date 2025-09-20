import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Users, Star, RefreshCw, Target } from "lucide-react";

type ProgressKey = "RisingStar"|"LoyaltyLeader"|"CommunityAnchor"|"TopPerformerTier";

interface ProgressItem {
  current: number;
  target: number;
  met: boolean;
  tip: string;
  extra?: string;
}

interface RetailerProgressProps {
  retailerId: string;
}

export default function RetailerProgress({ retailerId }: RetailerProgressProps) {
  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<ProgressKey, ProgressItem> | null>(null);
  const [recalcBusy, setRecalcBusy] = useState(false);

  async function fetchProgress() {
    setLoading(true);
    try {
      const res = await fetch(`/api/recognition/progress/${retailerId}`);
      const data = await res.json();
      
      if (data.ok) {
        setEngagement(data.engagement || 0);
        setBadges(data.badges || []);
        setProgress(data.progress || null);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    fetchProgress(); 
  }, [retailerId]);

  async function recalcNow() {
    setRecalcBusy(true);
    try {
      await fetch(`/api/recognition/recompute/${retailerId}`, { method: "POST" });
      await fetchProgress();
    } catch (error) {
      console.error("Failed to recalculate:", error);
    } finally {
      setRecalcBusy(false);
    }
  }

  if (loading || !progress) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-64"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rows: { key: ProgressKey; label: string; icon: React.ReactNode }[] = [
    { 
      key: "RisingStar", 
      label: "Rising Star", 
      icon: <Star className="h-4 w-4 text-yellow-500" />
    },
    { 
      key: "LoyaltyLeader", 
      label: "Loyalty Leader", 
      icon: <Users className="h-4 w-4 text-blue-500" />
    },
    { 
      key: "CommunityAnchor", 
      label: "Community Anchor", 
      icon: <Trophy className="h-4 w-4 text-purple-500" />
    },
    { 
      key: "TopPerformerTier", 
      label: "Top Performer in Tier", 
      icon: <TrendingUp className="h-4 w-4 text-green-500" />
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <Target className="h-6 w-6 text-blue-600" />
            <span>Your Progress & Next Milestones</span>
          </CardTitle>
          <Button
            onClick={recalcNow}
            disabled={recalcBusy}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${recalcBusy ? 'animate-spin' : ''}`} />
            {recalcBusy ? "Refreshing…" : "Refresh Progress"}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Current Engagement Score:</span>
          </div>
          <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
            {engagement}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Cards */}
        <div className="grid gap-4">
          {rows.map(({ key, label, icon }) => {
            const item = progress[key];
            const target = item?.target ?? 100;
            const current = Math.min(item?.current ?? 0, target);
            const pct = Math.min(100, Math.round((current / target) * 100));
            const met = !!item?.met;
            
            return (
              <Card key={key} className={`transition-all duration-200 ${met ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-semibold">
                      {icon}
                      {label}
                    </div>
                    <div className={`text-sm font-medium ${met ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {met ? (
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          Achieved!
                        </div>
                      ) : (
                        `${current} / ${target}`
                      )}
                    </div>
                  </div>
                  
                  {!met && (
                    <>
                      <Progress value={pct} className="mb-3" />
                      {item?.extra && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 mb-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                          {item.extra}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <strong>💡 Tip:</strong> {item?.tip}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Achievement Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {badges.length ? (
                badges.map((badge, i) => (
                  <Badge 
                    key={i} 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 px-4 py-2 text-sm font-semibold shadow-lg"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))
              ) : (
                <div className="text-center w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed">
                  <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No badges yet—follow the tips above to earn your first!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Tips */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🚀 Boost Your Engagement Score
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div>• <strong>Campaign Previews:</strong> +5 points each</div>
              <div>• <strong>Campaign Downloads:</strong> +10 points each</div>
              <div>• <strong>Posts Published:</strong> +20 points each</div>
              <div>• <strong>Social Shares:</strong> +15 points each</div>
              <div>• <strong>QR Code Scans:</strong> +2 points each</div>
              <div>• <strong>SPIRAL Redemptions:</strong> +0.1 points each (max 300)</div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}