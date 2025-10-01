import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RetailerRecognition from "@/components/RetailerRecognition";
import ShopperRetailerBadges from "@/components/ShopperRetailerBadges";
import { Crown, Users, Store, Award } from "lucide-react";

export default function RecognitionDemo() {
  const [selectedRetailer, setSelectedRetailer] = useState("retailer_1");

  const retailerOptions = [
    { id: "retailer_1", name: "Tech Haven Electronics", tier: "Premium" },
    { id: "retailer_2", name: "Fashion Forward Boutique", tier: "Standard" },
    { id: "retailer_3", name: "Local Coffee Roasters", tier: "Growing" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Award className="h-8 w-8" />
              SPIRAL Recognition System Demo
            </CardTitle>
            <p className="text-blue-100">
              Experience how SPIRAL's three-tier recognition system builds retailer confidence 
              while providing shoppers with trust indicators.
            </p>
          </CardHeader>
        </Card>

        {/* Retailer Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Select Demo Retailer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {retailerOptions.map((retailer) => (
                <Button
                  key={retailer.id}
                  variant={selectedRetailer === retailer.id ? "default" : "outline"}
                  onClick={() => setSelectedRetailer(retailer.id)}
                  className="flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  {retailer.name}
                  <span className="text-xs opacity-75">({retailer.tier})</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recognition Views */}
        <Tabs defaultValue="retailer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="retailer" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Retailer View
            </TabsTrigger>
            <TabsTrigger value="shopper" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Shopper View
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Admin View
            </TabsTrigger>
          </TabsList>

          {/* Retailer View Tab */}
          <TabsContent value="retailer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  What Retailers See (Motivational)
                </h3>
                <RetailerRecognition retailerId={selectedRetailer} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Key Features
                </h3>
                <div className="space-y-3">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Positive Recognition</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Shows achievements and progress, never rankings that could discourage
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        <Crown className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Tier-Based System</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Premium, Standard, and Growing tiers provide appropriate recognition
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Shopper View Tab */}
          <TabsContent value="shopper" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  What Shoppers See (Trust Indicators)
                </h3>
                <ShopperRetailerBadges retailerId={selectedRetailer} />
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Compact View Example:</h4>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Store Name</span>
                      <ShopperRetailerBadges retailerId={selectedRetailer} compact />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Shopper Benefits
                </h3>
                <div className="space-y-3">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Trust & Confidence</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Badges and verification help shoppers make informed decisions
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                        <Award className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Quality Assurance</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Top performers and customer favorites are clearly identified
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Admin View Tab */}
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Administrative Controls</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Admin panel provides full visibility and control over the recognition system.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      📊 Private Leaderboard Access
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      View full engagement scores, tier rankings, and performance metrics for all retailers.
                    </p>
                    <Button size="sm" className="mt-2" onClick={() => {
                      fetch('/api/recognition/admin/leaderboard')
                        .then(res => res.json())
                        .then(data => {
                          console.log("Admin leaderboard:", data);
                          alert(`Loaded ${data.leaderboard?.length || 0} retailer profiles`);
                        });
                    }}>
                      Test Admin Leaderboard
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      🎯 Recognition Management
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Update badges, tier assignments, and engagement scores for individual retailers.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      🔒 Privacy Protection
                    </h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      Sensitive data (exact engagement scores, rankings) are never exposed to retailers or shoppers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}