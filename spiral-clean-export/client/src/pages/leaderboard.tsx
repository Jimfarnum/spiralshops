import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Star, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('all_time');

  // Mock leaderboard data - in production this would come from the database
  const leaderboardData = {
    total_spirals: [
      { rank: 1, name: "Sarah M.", username: "@sarahm", spirals: 2450, tier: "SPIRAL Legend", change: "+15%" },
      { rank: 2, name: "Mike R.", username: "@mikeeats", spirals: 2180, tier: "Community Champion", change: "+8%" },
      { rank: 3, name: "Emma L.", username: "@emmalocal", spirals: 1920, tier: "Community Champion", change: "+12%" },
      { rank: 4, name: "David K.", username: "@davidshops", spirals: 1750, tier: "Local Ambassador", change: "+5%" },
      { rank: 5, name: "Lisa P.", username: "@lisap", spirals: 1650, tier: "Local Ambassador", change: "+18%" },
      { rank: 6, name: "Alex T.", username: "@alext", spirals: 1520, tier: "Local Ambassador", change: "+3%" },
      { rank: 7, name: "Rachel W.", username: "@rachelw", spirals: 1420, tier: "Community Builder", change: "+22%" },
      { rank: 8, name: "Tom H.", username: "@tomhh", spirals: 1350, tier: "Community Builder", change: "+7%" },
      { rank: 9, name: "Maya S.", username: "@mayas", spirals: 1280, tier: "Community Builder", change: "+14%" },
      { rank: 10, name: "Chris B.", username: "@chrisb", spirals: 1200, tier: "Community Builder", change: "+9%" }
    ],
    referrals: [
      { rank: 1, name: "Sarah M.", username: "@sarahm", count: 28, tier: "SPIRAL Legend", change: "+3" },
      { rank: 2, name: "Mike R.", username: "@mikeeats", count: 24, tier: "Community Champion", change: "+2" },
      { rank: 3, name: "Emma L.", username: "@emmalocal", count: 22, tier: "Community Champion", change: "+4" },
      { rank: 4, name: "David K.", username: "@davidshops", count: 18, tier: "Local Ambassador", change: "+1" },
      { rank: 5, name: "Lisa P.", username: "@lisap", count: 16, tier: "Local Ambassador", change: "+5" }
    ],
    purchases: [
      { rank: 1, name: "Emma L.", username: "@emmalocal", count: 45, tier: "Community Champion", change: "+8" },
      { rank: 2, name: "Sarah M.", username: "@sarahm", count: 42, tier: "SPIRAL Legend", change: "+5" },
      { rank: 3, name: "Lisa P.", username: "@lisap", count: 38, tier: "Local Ambassador", change: "+12" },
      { rank: 4, name: "Mike R.", username: "@mikeeats", count: 35, tier: "Community Champion", change: "+3" },
      { rank: 5, name: "David K.", username: "@davidshops", count: 32, tier: "Local Ambassador", change: "+7" }
    ]
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "SPIRAL Legend": return "bg-[var(--spiral-navy)] text-white";
      case "Community Champion": return "bg-[var(--spiral-gold)] text-white";
      case "Local Ambassador": return "bg-[var(--spiral-coral)] text-white";
      case "Community Builder": return "bg-[var(--spiral-sage)] text-white";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-[var(--spiral-gold)]" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Star className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold text-[var(--spiral-navy)]">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <main className="section-modern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              SPIRAL Leaderboard
            </h1>
            <p className="text-xl text-gray-600">
              Celebrate our top community members and local shopping champions
            </p>
          </div>

          {/* Top 3 Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {leaderboardData.total_spirals.slice(0, 3).map((user, index) => (
              <Card key={user.rank} className={`section-box ${index === 0 ? 'ring-2 ring-[var(--spiral-gold)] bg-gradient-to-br from-[var(--spiral-gold)]/5 to-[var(--spiral-coral)]/5' : ''}`}>
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    {getRankIcon(user.rank)}
                  </div>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription className="text-sm">{user.username}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
                    {user.spirals.toLocaleString()} SPIRALs
                  </div>
                  <Badge className={getTierColor(user.tier)} variant="secondary">
                    {user.tier}
                  </Badge>
                  <div className="flex items-center justify-center mt-2 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {user.change} this month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Leaderboards */}
          <Card className="section-box">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[var(--spiral-gold)]" />
                Community Rankings
              </CardTitle>
              <CardDescription>
                Track top performers across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="total_spirals" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="total_spirals" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Total SPIRALs
                  </TabsTrigger>
                  <TabsTrigger value="referrals" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Referrals
                  </TabsTrigger>
                  <TabsTrigger value="purchases" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Purchases
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="total_spirals" className="mt-6">
                  <div className="space-y-3">
                    {leaderboardData.total_spirals.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--spiral-cream)]">
                            {getRankIcon(user.rank)}
                          </div>
                          <div>
                            <div className="font-semibold text-[var(--spiral-navy)]">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-[var(--spiral-navy)]">
                            {user.spirals.toLocaleString()} SPIRALs
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTierColor(user.tier)} variant="secondary" size="sm">
                              {user.tier}
                            </Badge>
                            <span className="text-xs text-green-600">{user.change}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="referrals" className="mt-6">
                  <div className="space-y-3">
                    {leaderboardData.referrals.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--spiral-cream)]">
                            {getRankIcon(user.rank)}
                          </div>
                          <div>
                            <div className="font-semibold text-[var(--spiral-navy)]">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-[var(--spiral-navy)]">
                            {user.count} referrals
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTierColor(user.tier)} variant="secondary" size="sm">
                              {user.tier}
                            </Badge>
                            <span className="text-xs text-green-600">{user.change} this month</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="purchases" className="mt-6">
                  <div className="space-y-3">
                    {leaderboardData.purchases.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--spiral-cream)]">
                            {getRankIcon(user.rank)}
                          </div>
                          <div>
                            <div className="font-semibold text-[var(--spiral-navy)]">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-[var(--spiral-navy)]">
                            {user.count} purchases
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTierColor(user.tier)} variant="secondary" size="sm">
                              {user.tier}
                            </Badge>
                            <span className="text-xs text-green-600">{user.change} this month</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="section-box bg-gradient-to-br from-[var(--spiral-navy)]/5 to-[var(--spiral-coral)]/5 border-[var(--spiral-coral)]/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                  Want to Join the Leaderboard?
                </h3>
                <p className="text-gray-600 mb-6">
                  Start shopping local, refer friends, and climb the ranks in our community
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="button-primary">
                    Start Shopping
                  </Button>
                  <Button className="button-secondary">
                    Invite Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}