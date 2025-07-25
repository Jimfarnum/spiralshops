import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const RetailerDashboard = () => {
  const [sales, setSales] = useState(0);
  const [fee, setFee] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [adBudget, setAdBudget] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Retailer Dashboard
          </h1>
          <p className="section-description text-lg">
            Manage your SPIRAL business metrics and advertising tools
          </p>
        </div>

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
                SPIRAL Wallet
              </CardTitle>
              <CardDescription>
                Your accumulated SPIRAL rewards balance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border-2 border-yellow-200">
                <div className="text-center">
                  <span className="text-sm text-gray-600 block">Current Balance</span>
                  <span className="text-3xl font-bold text-[var(--spiral-navy)]">
                    {walletBalance.toFixed(0)} SPIRALs
                  </span>
                  <span className="text-sm text-gray-600 block mt-1">
                    ≈ ${(walletBalance * 0.01).toFixed(2)} value
                  </span>
                </div>
              </div>

              <Button 
                onClick={refreshWallet}
                disabled={isLoading}
                className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)]"
              >
                {isLoading ? "Refreshing..." : "Refresh Wallet"}
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Earn SPIRALs from customer purchases</p>
                <p>• Redeem for advertising credits</p>
                <p>• Use for platform fee discounts</p>
              </div>
            </CardContent>
          </Card>

          {/* Advertising Tools */}
          <Card className="bg-white shadow-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl text-[var(--spiral-navy)]">
                Advertising Preview Tool
              </CardTitle>
              <CardDescription>
                Estimate reach and engagement for your SPIRAL ads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="adBudget">Monthly Ad Budget ($)</Label>
                  <Input
                    id="adBudget"
                    type="number"
                    value={adBudget}
                    onChange={handleAdBudgetChange}
                    placeholder="Enter ad budget"
                    className="mt-1"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600 block">Estimated Reach</span>
                  <span className="text-xl font-bold text-[var(--spiral-navy)]">
                    {(adBudget * 50).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 block">impressions</span>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600 block">Estimated Clicks</span>
                  <span className="text-xl font-bold text-green-600">
                    {Math.round(adBudget * 2.5).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 block">potential visits</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white"
            >
              Manage Products
            </Button>
            <Button 
              variant="outline"
              className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white"
            >
              View Analytics
            </Button>
            <Button 
              variant="outline"
              className="border-[var(--spiral-gold)] text-[var(--spiral-gold)] hover:bg-[var(--spiral-gold)] hover:text-white"
            >
              Customer Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;