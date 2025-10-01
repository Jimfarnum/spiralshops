import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, Gift, Percent, Crown, Coins, ShoppingBag, Trophy, Zap } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function LoyaltyProgram() {
  const [spiralBalance] = useState(1250); // Mock user balance
  const { toast } = useToast();

  const spiralTiers = [
    {
      name: "Bronze Explorer",
      minSpent: 0,
      spiralRate: "1 SPIRAL per $5",
      perks: ["Basic rewards", "Birthday bonus", "Member-only deals"],
      color: "from-amber-400 to-amber-600",
      icon: Star
    },
    {
      name: "Silver Shopper", 
      minSpent: 250,
      spiralRate: "1 SPIRAL per $4",
      perks: ["15% bonus SPIRALs", "Early sale access", "Free shipping"],
      color: "from-gray-400 to-gray-600",
      icon: Gift
    },
    {
      name: "Gold Advocate",
      minSpent: 750,
      spiralRate: "1 SPIRAL per $3",
      perks: ["25% bonus SPIRALs", "Personal shopper", "VIP events"],
      color: "from-yellow-400 to-yellow-600",
      icon: Crown
    },
    {
      name: "Platinum Champion",
      minSpent: 2000,
      spiralRate: "1 SPIRAL per $2",
      perks: ["50% bonus SPIRALs", "Concierge service", "Exclusive experiences"],
      color: "from-purple-400 to-purple-600",
      icon: Trophy
    }
  ];

  const rewardOptions = [
    {
      item: "$5 Local Store Credit",
      cost: 100,
      description: "Use at any participating local business",
      category: "Store Credit",
      popular: true
    },
    {
      item: "$10 Local Store Credit",
      cost: 200,
      description: "Use at any participating local business", 
      category: "Store Credit",
      popular: false
    },
    {
      item: "Free Coffee & Pastry",
      cost: 75,
      description: "Redeemable at local cafés and bakeries",
      category: "Food & Drink",
      popular: false
    },
    {
      item: "$25 Local Store Credit",
      cost: 500,
      description: "Use at any participating local business",
      category: "Store Credit", 
      popular: false
    },
    {
      item: "Local Art Print",
      cost: 150,
      description: "Beautiful prints from local artists",
      category: "Gifts & Art",
      popular: false
    },
    {
      item: "Premium Gift Wrapping",
      cost: 50,
      description: "Professional wrapping for your purchases",
      category: "Services",
      popular: false
    }
  ];

  const recentActivity = [
    {
      type: "earned",
      amount: 25,
      description: "Purchase at Peterson's Coffee Shop",
      date: "2 hours ago"
    },
    {
      type: "earned", 
      amount: 15,
      description: "Review bonus for Maya's Bakery",
      date: "1 day ago"
    },
    {
      type: "redeemed",
      amount: -100,
      description: "Redeemed $5 Local Store Credit",
      date: "3 days ago"
    },
    {
      type: "earned",
      amount: 40,
      description: "Purchase at Riverside Books",
      date: "5 days ago"
    }
  ];

  const handleRedemption = (reward: any) => {
    if (spiralBalance < reward.cost) {
      toast({
        title: "Insufficient SPIRALs",
        description: `You need ${reward.cost} SPIRALs but only have ${spiralBalance}.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reward Redeemed!",
      description: `You've redeemed ${reward.item} for ${reward.cost} SPIRALs.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <Star className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reward Loyalty
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Earn SPIRALs with every purchase and redeem for exclusive perks, 
            local store credits, and special experiences. The more you shop local, 
            the more rewards you earn!
          </p>
        </div>

        {/* Current SPIRAL Balance */}
        <div className="max-w-md mx-auto mb-12">
          <Card className="p-6 text-center bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <div className="flex items-center justify-center mb-2">
              <Coins className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">Your SPIRALs</span>
            </div>
            <div className="text-4xl font-bold mb-2">{spiralBalance.toLocaleString()}</div>
            <p className="text-purple-100">Ready to redeem for amazing rewards!</p>
            <Button className="mt-4 bg-white text-purple-600 hover:bg-gray-100">
              <Gift className="h-4 w-4 mr-2" />
              Browse Rewards
            </Button>
          </Card>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Shop Local</h3>
            <p className="text-gray-600 text-sm">Earn 1 SPIRAL for every $5 spent at participating local businesses</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Earn Bonus SPIRALs</h3>
            <p className="text-gray-600 text-sm">Get extra SPIRALs for reviews, referrals, and special promotions</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <Gift className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Redeem Rewards</h3>
            <p className="text-gray-600 text-sm">Use SPIRALs for store credits, exclusive items, and special experiences</p>
          </Card>
        </div>

        {/* SPIRAL Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            SPIRAL Loyalty Tiers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spiralTiers.map((tier, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <tier.icon className="h-6 w-6 mr-2 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Spend ${tier.minSpent}+ to qualify
                  </div>
                  <div className="font-medium text-purple-600 mb-4">
                    {tier.spiralRate}
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tier.perks.map((perk, perkIndex) => (
                      <li key={perkIndex} className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-400" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reward Redemption */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Redeem Your SPIRALs
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {rewardOptions.map((reward, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{reward.item}</h3>
                    {reward.popular && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mb-3">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-purple-600">
                      <Coins className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{reward.cost}</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleRedemption(reward)}
                      disabled={spiralBalance < reward.cost}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Redeem
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent SPIRAL Activity
            </h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {activity.type === 'earned' ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        ) : (
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                        )}
                        <span className={`font-semibold ${activity.type === 'earned' ? 'text-green-600' : 'text-orange-600'}`}>
                          {activity.type === 'earned' ? '+' : ''}{activity.amount}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{activity.description}</p>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Link href="/spirals">
              <Button variant="outline" className="w-full mt-4">
                View Full History
              </Button>
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 py-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-4">
            Start Earning SPIRALs Today!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of shoppers earning rewards while supporting local businesses. 
            Every purchase brings you closer to amazing rewards!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                <Star className="h-5 w-5 mr-2" />
                Join SPIRAL
              </Button>
            </Link>
            <Link href="/stores">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}