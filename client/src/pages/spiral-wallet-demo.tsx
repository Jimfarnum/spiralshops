import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, TrendingUp, TrendingDown, Gift, Users, Share, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpiralWalletTransaction {
  date: string;
  type: "earn" | "spend";
  source: "purchase" | "referral" | "share" | "in_person_bonus" | "reward_redeem";
  amount: number;
  description: string;
}

interface SpiralWallet {
  userId: string;
  balance: number;
  history: SpiralWalletTransaction[];
}

export default function SpiralWalletDemo() {
  const [wallet, setWallet] = useState<SpiralWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("demo-user-123");
  const [earnAmount, setEarnAmount] = useState("25");
  const [spendAmount, setSpendAmount] = useState("10");
  const { toast } = useToast();

  const loadWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/spiral-wallet/${userId}`);
      const data = await response.json();
      setWallet(data);
    } catch (error) {
      console.error("Error loading wallet:", error);
      toast({
        title: "Error",
        description: "Failed to load wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/spiral-wallet/demo-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      
      if (data.success) {
        setWallet(data.wallet);
        toast({
          title: "Demo Transactions Created",
          description: data.message,
        });
      }
    } catch (error) {
      console.error("Error creating demo transactions:", error);
      toast({
        title: "Error",
        description: "Failed to create demo transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const earnSpirals = async (source: string, description: string, amount: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/spiral-wallet/${userId}/earn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, source, description }),
      });
      const data = await response.json();
      
      if (data.success) {
        setWallet(data.wallet);
        toast({
          title: "SPIRALs Earned!",
          description: data.message,
        });
      }
    } catch (error) {
      console.error("Error earning SPIRALs:", error);
      toast({
        title: "Error",
        description: "Failed to earn SPIRALs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const spendSpirals = async (source: string, description: string, amount: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/spiral-wallet/${userId}/spend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, source, description }),
      });
      const data = await response.json();
      
      if (data.success) {
        setWallet(data.wallet);
        toast({
          title: "SPIRALs Spent",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error spending SPIRALs:", error);
      toast({
        title: "Error",
        description: "Failed to spend SPIRALs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, [userId]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "purchase": return <ShoppingBag className="w-4 h-4" />;
      case "referral": return <Users className="w-4 h-4" />;
      case "share": return <Share className="w-4 h-4" />;
      case "in_person_bonus": return <Gift className="w-4 h-4" />;
      case "reward_redeem": return <Gift className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "purchase": return "bg-blue-100 text-blue-800";
      case "referral": return "bg-green-100 text-green-800";
      case "share": return "bg-purple-100 text-purple-800";
      case "in_person_bonus": return "bg-orange-100 text-orange-800";
      case "reward_redeem": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <Wallet className="w-8 h-8 text-blue-600" />
          SPIRAL Wallet Demo
        </h1>
        <p className="text-gray-600">Test the complete SPIRAL wallet system with real-time transactions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Wallet Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Balance
            </CardTitle>
            <CardDescription>Current SPIRAL balance for {userId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {wallet?.balance || 0} SPIRALs
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
              />
              <Button 
                onClick={loadWallet} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Loading..." : "Refresh Wallet"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Test wallet functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={createDemoTransactions}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Create Demo Transactions
            </Button>
            
            <Button 
              onClick={() => earnSpirals("referral", "Friend signed up using your code", parseInt(earnAmount))}
              disabled={loading}
              className="w-full"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Earn {earnAmount} SPIRALs (Referral)
            </Button>
            
            <Button 
              onClick={() => spendSpirals("reward_redeem", "10% discount at Fashion Store", parseInt(spendAmount))}
              disabled={loading}
              className="w-full"
              variant="secondary"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Spend {spendAmount} SPIRALs (Reward)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="earn-spend">Earn & Spend</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Recent SPIRAL transactions • {wallet?.history.length || 0} total transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wallet?.history && wallet.history.length > 0 ? (
                <div className="space-y-3">
                  {wallet.history.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSourceIcon(transaction.source)}
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} SPIRALs
                        </div>
                        <Badge className={getSourceBadgeColor(transaction.source)}>
                          {transaction.source.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No transactions yet. Create some demo transactions to get started!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earn-spend" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Earn SPIRALs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Earn SPIRALs</CardTitle>
                <CardDescription>Add SPIRALs to your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="earnAmount">Amount to Earn</Label>
                  <Input
                    id="earnAmount"
                    type="number"
                    value={earnAmount}
                    onChange={(e) => setEarnAmount(e.target.value)}
                    placeholder="25"
                  />
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => earnSpirals("purchase", "Online purchase at Tech Store", parseInt(earnAmount))}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Online Purchase
                  </Button>
                  
                  <Button 
                    onClick={() => earnSpirals("in_person_bonus", "In-person shopping bonus", parseInt(earnAmount))}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    In-Person Bonus
                  </Button>
                  
                  <Button 
                    onClick={() => earnSpirals("share", "Shared product on social media", parseInt(earnAmount))}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Social Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Spend SPIRALs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Spend SPIRALs</CardTitle>
                <CardDescription>Redeem SPIRALs for rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="spendAmount">Amount to Spend</Label>
                  <Input
                    id="spendAmount"
                    type="number"
                    value={spendAmount}
                    onChange={(e) => setSpendAmount(e.target.value)}
                    placeholder="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => spendSpirals("reward_redeem", "10% discount at Fashion Boutique", parseInt(spendAmount))}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    10% Discount
                  </Button>
                  
                  <Button 
                    onClick={() => spendSpirals("reward_redeem", "Free shipping on next order", parseInt(spendAmount))}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    Free Shipping
                  </Button>
                  
                  <Button 
                    onClick={() => spendSpirals("reward_redeem", "$5 off at local restaurant", parseInt(spendAmount))}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    Restaurant Credit
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 mt-4">
                  Current balance: {wallet?.balance || 0} SPIRALs
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>SPIRAL Wallet Features</CardTitle>
          <CardDescription>Complete wallet system with transaction tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Earning Sources</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Online purchases</li>
                <li>• In-person shopping bonuses</li>
                <li>• Referral rewards</li>
                <li>• Social media sharing</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Spending Options</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Store discounts</li>
                <li>• Free shipping</li>
                <li>• Restaurant credits</li>
                <li>• Mall perks</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Advanced Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time balance tracking</li>
                <li>• Complete transaction history</li>
                <li>• Insufficient balance protection</li>
                <li>• Multiple earning sources</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}