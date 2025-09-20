import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const RetailerDashboard = () => {
  const [sales, setSales] = useState(0);
  const [fee, setFee] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [adBudget, setAdBudget] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const userId = 'demo-retailer-001';

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/spiral-wallet/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance);
      } else {
        // Create wallet if it doesn't exist
        const createResponse = await fetch(`/api/spiral-wallet/demo-transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (createResponse.ok) {
          const createData = await createResponse.json();
          setWalletBalance(createData.balance);
        }
      }
    } catch (error) {
      console.error('Wallet fetch error', error);
      toast({
        title: "Error fetching wallet",
        description: "Unable to load SPIRAL wallet balance",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setSales(value);
    setFee(calculateFee(value));
  };

  const calculateFee = (amount: number) => {
    if (amount <= 1000) return amount * 0.05;
    if (amount <= 5000) return amount * 0.06;
    return amount * 0.07;
  };

  const handleAdBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdBudget(parseFloat(e.target.value) || 0);
  };

  const refreshWallet = () => {
    fetchWallet();
    toast({
      title: "Wallet refreshed",
      description: "SPIRAL balance has been updated"
    });
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Retailer Dashboard
          </h1>
          <p className="section-description text-lg">
            Manage your SPIRAL business metrics and advertising tools
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Manage Products</TabsTrigger>
            <TabsTrigger value="analytics">View Analytics</TabsTrigger>
            <TabsTrigger value="support">Customer Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales & Fees Calculator */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-[var(--spiral-navy)]">
                    Sales & Platform Fees
                  </CardTitle>
                  <CardDescription>
                    Calculate your monthly SPIRAL platform fees
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sales">Monthly Sales ($)</Label>
                    <Input
                      id="sales"
                      type="number"
                      value={sales}
                      onChange={handleSalesChange}
                      placeholder="Enter monthly sales amount"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[var(--spiral-navy)]">
                        SPIRAL Platform Fee:
                      </span>
                      <span className="text-lg font-bold text-[var(--spiral-coral)]">
                        ${fee.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {sales <= 1000 ? "5% fee tier" : sales <= 5000 ? "6% fee tier" : "7% fee tier"}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[var(--spiral-navy)]">
                        Net Earnings:
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${(sales - fee).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      After SPIRAL platform fees
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* SPIRAL Wallet */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-[var(--spiral-navy)]">
                    SPIRAL Wallet Balance
                  </CardTitle>
                  <CardDescription>
                    Your rewards and credits for platform usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] rounded-lg text-white">
                    <div className="text-3xl font-bold mb-2">
                      ${isLoading ? "..." : walletBalance.toFixed(2)}
                    </div>
                    <p className="text-sm opacity-90">Available SPIRAL Credits</p>
                  </div>
                  
                  <Button 
                    onClick={refreshWallet} 
                    disabled={isLoading}
                    className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                  >
                    {isLoading ? "Refreshing..." : "Refresh Balance"}
                  </Button>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Use SPIRAL credits to reduce platform fees</p>
                    <p>• Earn credits through customer referrals</p>
                    <p>• Get bonus credits for featured listings</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advertising Calculator */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--spiral-navy)]">
                  SPIRAL Advertising ROI Calculator
                </CardTitle>
                <CardDescription>
                  Estimate your advertising reach and potential returns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="adBudget">Monthly Ad Budget ($)</Label>
                  <Input
                    id="adBudget"
                    type="number"
                    value={adBudget}
                    onChange={handleAdBudgetChange}
                    placeholder="Enter monthly advertising budget"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <span className="text-sm text-gray-600 block">Estimated Reach</span>
                    <span className="text-2xl font-bold text-[var(--spiral-navy)]">
                      {Math.round(adBudget * 50).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 block">impressions</span>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border">
                    <span className="text-sm text-gray-600 block">Estimated Clicks</span>
                    <span className="text-xl font-bold text-green-600">
                      {Math.round(adBudget * 2.5).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 block">potential visits</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">
                    SPIRAL Advertising Benefits:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Target local customers within your community</li>
                    <li>• Promote on SPIRAL platform and partner networks</li>
                    <li>• Use SPIRAL rewards to reduce advertising costs</li>
                    <li>• Track performance with detailed analytics</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--spiral-navy)]">
                  Product Management
                </CardTitle>
                <CardDescription>
                  Manage your inventory and product listings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90">
                    <div className="text-center">
                      <div className="font-semibold">Add New Product</div>
                      <div className="text-xs opacity-90">Create product listing</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <div className="font-semibold">Bulk Import</div>
                      <div className="text-xs opacity-70">CSV upload</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <div className="font-semibold">Inventory Sync</div>
                      <div className="text-xs opacity-70">Auto-update stock</div>
                    </div>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Quick Stats</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[var(--spiral-navy)]">42</div>
                      <div className="text-sm text-gray-600">Active Products</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[var(--spiral-coral)]">8</div>
                      <div className="text-sm text-gray-600">Low Stock</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[var(--spiral-gold)]">23</div>
                      <div className="text-sm text-gray-600">Orders Today</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--spiral-navy)]">
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Track your store performance and customer engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">$2,847</div>
                    <div className="text-sm text-gray-600">Revenue This Month</div>
                    <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-[var(--spiral-coral)] mb-2">147</div>
                    <div className="text-sm text-gray-600">Orders Completed</div>
                    <div className="text-xs text-green-600 mt-1">+8% from last month</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-[var(--spiral-gold)] mb-2">4.8</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                    <div className="text-xs text-blue-600 mt-1">Based on 89 reviews</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">Top Performing Products</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Wireless Headphones", sales: 23, revenue: "$1,380" },
                      { name: "Cotton T-Shirt", sales: 18, revenue: "$972" },
                      { name: "LED Desk Lamp", sales: 15, revenue: "$825" }
                    ].map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{product.name}</span>
                        <div className="text-right">
                          <div className="font-semibold">{product.revenue}</div>
                          <div className="text-sm text-gray-600">{product.sales} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--spiral-navy)]">
                  Customer Support Center
                </CardTitle>
                <CardDescription>
                  Manage customer inquiries and support requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Recent Support Tickets</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <div className="font-medium">Order #1247 - Delivery Issue</div>
                        <div className="text-sm text-gray-600">Customer: Sarah M. • 2 hours ago</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                        <div className="font-medium">Product Return Request</div>
                        <div className="text-sm text-gray-600">Customer: Mike R. • 1 day ago</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                        <div className="font-medium">General Inquiry</div>
                        <div className="text-sm text-gray-600">Customer: Lisa K. • 2 days ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Support Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Open Tickets</span>
                        <span className="font-semibold text-[var(--spiral-coral)]">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolved Today</span>
                        <span className="font-semibold text-green-600">7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Response Time</span>
                        <span className="font-semibold">2.3 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction</span>
                        <span className="font-semibold text-[var(--spiral-gold)]">4.9/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90">
                    View All Tickets
                  </Button>
                  <Button variant="outline">
                    Create New Ticket
                  </Button>
                  <Button variant="outline">
                    Support Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RetailerDashboard;