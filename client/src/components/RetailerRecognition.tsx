import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, CheckCircle, TrendingUp } from "lucide-react";

interface RecognitionData {
  recognition: string[];
  badges: string[];
  tier: string;
  engagement: number;
}

interface RetailerRecognitionProps {
  retailerId: string;
}

export default function RetailerRecognition({ retailerId }: RetailerRecognitionProps) {
  const [data, setData] = useState<RecognitionData>({
    recognition: [],
    badges: [],
    tier: "Growing",
    engagement: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecognition = async () => {
      try {
        const response = await fetch(`/api/recognition/retailer/recognition/${retailerId}`);
        const result = await response.json();
        
        if (result.status === "success") {
          setData({
            recognition: result.recognition || [],
            badges: result.badges || [],
            tier: result.tier || "Growing",
            engagement: result.engagement || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch recognition:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecognition();
  }, [retailerId]);

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return "text-green-600";
    if (engagement >= 70) return "text-blue-600";
    return "text-gray-600";
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Premium": return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "Standard": return <Award className="h-5 w-5 text-blue-500" />;
      default: return <Star className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getTierIcon(data.tier)}
            <span className="text-xl font-bold">Your Recognition</span>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {data.tier} Tier
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Engagement Score */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Engagement Score</span>
          </div>
          <div className={`text-2xl font-bold ${getEngagementColor(data.engagement)}`}>
            {data.engagement}%
          </div>
        </div>

        {/* Recognition Messages */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
            🎉 Current Recognition
          </h3>
          {data.recognition.length > 0 ? (
            <div className="space-y-2">
              {data.recognition.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Keep building your engagement — recognition is coming! 🚀
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-2">
                Complete onboarding, engage with customers, and maintain quality service to earn recognition.
              </p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
            🏆 Your Achievement Badges
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.badges.length > 0 ? (
              data.badges.map((badge, idx) => (
                <Badge
                  key={idx}
                  variant="default"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 px-3 py-2 text-sm font-semibold shadow-lg"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))
            ) : (
              <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  No badges earned yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-1">
                  Excellence in service, customer satisfaction, and platform engagement will earn you badges!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-sm font-medium text-center">
            💡 <strong>Pro Tip:</strong> Higher engagement scores unlock exclusive SPIRAL features, 
            priority support, and premium campaign opportunities!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}