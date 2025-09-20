import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Users, Megaphone, Wallet, Calculator, TrendingUp, Target, Zap } from "lucide-react";

interface ToolkitResult {
  success: boolean;
  [key: string]: any;
}

export default function RetailerToolkit() {
  const [result, setResult] = useState<ToolkitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form states for each tool
  const [revenueForm, setRevenueForm] = useState({
    monthlySales: 10000,
    avgTransaction: 50,
    category: "General"
  });

  const [trafficForm, setTrafficForm] = useState({
    onlineOrders: 200,
    redemptionRate: 20
  });

  const [campaignForm, setCampaignForm] = useState({
    campaignType: "promo",
    retailerName: "Local Store"
  });

  const [walletForm, setWalletForm] = useState({
    spiralsEarned: 500,
    spiralsRedeemed: 200
  });

  const callAPI = async (endpoint: string, payload: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/toolkit/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Calculation Complete",
          description: "Your toolkit results are ready!"
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to the toolkit API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-blue-600" />
          SPIRAL Retailer Sales Toolkit
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Powerful tools to analyze your business performance and growth potential
        </p>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Traffic
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet ROI
          </TabsTrigger>
        </TabsList>

        {/* Revenue Comparison Tool */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue Comparison Tool
              </CardTitle>
              <CardDescription>
                Compare your potential earnings on SPIRAL vs other platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlySales">Monthly Sales ($)</Label>
                  <Input
                    id="monthlySales"
                    type="number"
                    value={revenueForm.monthlySales}
                    onChange={(e) => setRevenueForm({...revenueForm, monthlySales: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="avgTransaction">Average Transaction ($)</Label>
                  <Input
                    id="avgTransaction"
                    type="number"
                    value={revenueForm.avgTransaction}
                    onChange={(e) => setRevenueForm({...revenueForm, avgTransaction: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => callAPI("revenue", revenueForm)}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Calculating..." : "Calculate Savings"}
              </Button>
              
              {result?.success && result.savings !== undefined && (
                <Card className="bg-green-50 dark:bg-green-900/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${result.savings.toFixed(2)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Monthly savings with SPIRAL ({result.savingsPercentage}% reduction)
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-red-500">Other Platforms</p>
                          <p className="font-semibold">${result.amazonFee.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-green-500">SPIRAL Platform</p>
                          <p className="font-semibold">${result.spiralFee.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Forecaster */}
        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Foot Traffic Forecaster
              </CardTitle>
              <CardDescription>
                Predict in-store visits from your online SPIRAL campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="onlineOrders">Monthly Online Orders</Label>
                  <Input
                    id="onlineOrders"
                    type="number"
                    value={trafficForm.onlineOrders}
                    onChange={(e) => setTrafficForm({...trafficForm, onlineOrders: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="redemptionRate">Redemption Rate (%)</Label>
                  <Input
                    id="redemptionRate"
                    type="number"
                    value={trafficForm.redemptionRate}
                    onChange={(e) => setTrafficForm({...trafficForm, redemptionRate: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => callAPI("traffic", trafficForm)}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Forecasting..." : "Forecast Traffic"}
              </Button>
              
              {result?.success && result.inStoreVisits !== undefined && (
                <Card className="bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">
                          {result.inStoreVisits}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Extra In-Store Visits
                        </p>
                      </div>
                      <div>
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          ${result.revenueImpact.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Additional Revenue
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaign Wizard */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-purple-600" />
                AI Campaign Wizard
              </CardTitle>
              <CardDescription>
                Generate AI-powered marketing campaigns for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaignType">Campaign Type</Label>
                  <Input
                    id="campaignType"
                    value={campaignForm.campaignType}
                    onChange={(e) => setCampaignForm({...campaignForm, campaignType: e.target.value})}
                    placeholder="e.g., promo, seasonal, grand opening"
                  />
                </div>
                <div>
                  <Label htmlFor="retailerName">Your Store Name</Label>
                  <Input
                    id="retailerName"
                    value={campaignForm.retailerName}
                    onChange={(e) => setCampaignForm({...campaignForm, retailerName: e.target.value})}
                    placeholder="Your business name"
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => callAPI("campaigns", campaignForm)}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Generating..." : "Generate Campaign"}
              </Button>
              
              {result?.success && result.campaign && (
                <Card className="bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg">{result.campaign.headline}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{result.campaign.message}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Campaign Details:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Campaign ID: <Badge variant="outline">{result.campaign.campaignId.slice(0, 8)}...</Badge></div>
                          <div>Estimated Reach: <Badge>{result.campaign.estimatedReach.toLocaleString()}</Badge></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Platforms:</p>
                        <div className="flex gap-2 flex-wrap">
                          {result.campaign.platforms.map((platform: string) => (
                            <Badge key={platform} variant="secondary">{platform}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>QR Campaign Link:</Label>
                        <Input 
                          value={result.campaign.qrLink} 
                          readOnly 
                          className="text-blue-600 text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet ROI */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-orange-600" />
                SPIRAL Wallet ROI Calculator
              </CardTitle>
              <CardDescription>
                Calculate the return on investment from your SPIRAL loyalty program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="spiralsEarned">SPIRALs Earned</Label>
                  <Input
                    id="spiralsEarned"
                    type="number"
                    value={walletForm.spiralsEarned}
                    onChange={(e) => setWalletForm({...walletForm, spiralsEarned: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="spiralsRedeemed">SPIRALs Redeemed</Label>
                  <Input
                    id="spiralsRedeemed"
                    type="number"
                    value={walletForm.spiralsRedeemed}
                    onChange={(e) => setWalletForm({...walletForm, spiralsRedeemed: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => callAPI("wallet", walletForm)}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Calculating..." : "Calculate ROI"}
              </Button>
              
              {result?.success && result.spiralValue !== undefined && (
                <Card className="bg-orange-50 dark:bg-orange-900/20">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600">
                          ${result.spiralValue.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Value Redeemed
                        </p>
                      </div>
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">
                          {result.repeatVisits}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Repeat Visits
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Redemption Rate</p>
                        <p className="font-semibold">{result.redemptionRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Customer Lifetime Value</p>
                        <p className="font-semibold">${result.customerLifetimeValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Toolkit Analytics Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Toolkit Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-lg">1,247</div>
              <div className="text-gray-500">Total Calculations</div>
            </div>
            <div>
              <div className="font-bold text-lg text-green-600">$2,150</div>
              <div className="text-gray-500">Avg Monthly Savings</div>
            </div>
            <div>
              <div className="font-bold text-lg text-blue-600">45%</div>
              <div className="text-gray-500">Revenue Tool Usage</div>
            </div>
            <div>
              <div className="font-bold text-lg text-purple-600">28%</div>
              <div className="text-gray-500">Traffic Tool Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}