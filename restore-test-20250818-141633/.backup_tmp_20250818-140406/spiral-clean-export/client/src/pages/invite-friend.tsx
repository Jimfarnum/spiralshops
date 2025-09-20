import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Users, Gift, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function InviteFriend() {
  const [inviteCode, setInviteCode] = useState('SPIRAL2025X');
  const [referralStats] = useState({
    totalReferrals: 3,
    pendingReferrals: 1,
    spiralsEarned: 120,
    nextTierRequirement: 5
  });
  const { toast } = useToast();

  const generateNewCode = () => {
    const newCode = 'SPIRAL' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(newCode);
    toast({
      title: "New invite code generated!",
      description: "Your new invite code is ready to share.",
    });
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Copied to clipboard!",
      description: "Share your invite code with friends.",
    });
  };

  const shareInviteCode = async () => {
    const shareData = {
      title: 'Join SPIRAL - Local Shopping Made Easy',
      text: `Use my invite code ${inviteCode} to join SPIRAL and earn 20 SPIRALs! Discover amazing local businesses and support your community.`,
      url: `https://spiralshops.com/signup?invite=${inviteCode}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyInviteCode();
      }
    } else {
      copyInviteCode();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <main className="section-modern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              Invite Friends to SPIRAL
            </h1>
            <p className="text-xl text-gray-600">
              Share the love for local shopping and earn SPIRALs together
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invite Code Section */}
            <Card className="section-box">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[var(--spiral-coral)]" />
                  Your Invite Code
                </CardTitle>
                <CardDescription>
                  Share this code with friends to give them 20 SPIRALs when they sign up
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <Input 
                    value={inviteCode} 
                    readOnly 
                    className="font-mono text-lg font-bold text-center"
                  />
                  <Button onClick={copyInviteCode} variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button onClick={shareInviteCode} className="button-primary flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Code
                  </Button>
                  <Button onClick={generateNewCode} className="button-secondary">
                    Generate New
                  </Button>
                </div>

                <div className="section-box bg-gradient-to-br from-[var(--spiral-coral)]/10 to-[var(--spiral-gold)]/10 border-[var(--spiral-coral)]/20">
                  <h3 className="font-semibold text-[var(--spiral-navy)] mb-2">How It Works</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-[var(--spiral-coral)]/10 text-[var(--spiral-coral)]">1</Badge>
                      <span>Friend signs up with your code</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-[var(--spiral-coral)]/10 text-[var(--spiral-coral)]">2</Badge>
                      <span>They get 20 SPIRALs instantly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-[var(--spiral-coral)]/10 text-[var(--spiral-coral)]">3</Badge>
                      <span>You earn 20 SPIRALs when they make their first purchase</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Stats */}
            <Card className="section-box">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[var(--spiral-gold)]" />
                  Your Referral Stats
                </CardTitle>
                <CardDescription>
                  Track your referral success and tier progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[var(--spiral-sage)]/10 rounded-lg">
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{referralStats.totalReferrals}</div>
                    <div className="text-sm text-gray-600">Total Referrals</div>
                  </div>
                  <div className="text-center p-4 bg-[var(--spiral-coral)]/10 rounded-lg">
                    <div className="text-2xl font-bold text-[var(--spiral-navy)]">{referralStats.spiralsEarned}</div>
                    <div className="text-sm text-gray-600">SPIRALs Earned</div>
                  </div>
                </div>

                <div className="section-box bg-gradient-to-br from-[var(--spiral-navy)]/5 to-[var(--spiral-sage)]/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[var(--spiral-navy)]">Community Builder Tier</span>
                    <Badge className="bg-[var(--spiral-sage)] text-white">Active</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {referralStats.nextTierRequirement - referralStats.totalReferrals} more referrals to reach Local Ambassador
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[var(--spiral-sage)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(referralStats.totalReferrals / referralStats.nextTierRequirement) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-[var(--spiral-navy)]">Recent Activity</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Sarah M.", action: "Signed up", spirals: 20, time: "2 days ago" },
                      { name: "Mike R.", action: "First purchase", spirals: 20, time: "1 week ago" },
                      { name: "Emma L.", action: "Signed up", spirals: 20, time: "2 weeks ago" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{activity.name}</div>
                          <div className="text-xs text-gray-500">{activity.action} • {activity.time}</div>
                        </div>
                        <Badge className="bg-[var(--spiral-coral)]/10 text-[var(--spiral-coral)]">
                          +{activity.spirals} SPIRALs
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Tiers */}
          <Card className="section-box mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--spiral-navy)]" />
                Community Status Tiers
              </CardTitle>
              <CardDescription>
                Level up your SPIRAL status by referring more friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { name: "New Member", referrals: "0", spirals: "0", color: "bg-gray-100" },
                  { name: "Community Builder", referrals: "1-4", spirals: "100", color: "bg-[var(--spiral-sage)]/20" },
                  { name: "Local Ambassador", referrals: "5-9", spirals: "250", color: "bg-[var(--spiral-coral)]/20" },
                  { name: "Community Champion", referrals: "10-19", spirals: "500", color: "bg-[var(--spiral-gold)]/20" },
                  { name: "SPIRAL Legend", referrals: "20+", spirals: "1000+", color: "bg-[var(--spiral-navy)]/20" }
                ].map((tier, index) => (
                  <div key={index} className={`p-4 rounded-lg ${tier.color} text-center`}>
                    <div className="font-semibold text-sm mb-1">{tier.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{tier.referrals} referrals</div>
                    <Badge variant="outline" className="text-xs">
                      {tier.spirals} bonus
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}