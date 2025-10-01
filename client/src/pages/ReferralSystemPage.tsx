import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, Gift, Copy, Share2, TrendingUp, UserPlus, Sparkles, Trophy, Star } from 'lucide-react';

interface ReferralStats {
  totalReferrals: number;
  successfulSignups: number;
  totalEarned: number;
  conversionRate: number;
  currentTier: string;
  nextTierProgress: number;
}

interface ReferralEntry {
  id: string;
  email: string;
  signedUp: boolean;
  firstPurchase: boolean;
  spiralsEarned: number;
  referredAt: string;
  signupDate?: string;
  purchaseDate?: string;
}

export default function ReferralSystemPage() {
  const [referralCode, setReferralCode] = useState('SPIRAL2025');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulSignups: 0,
    totalEarned: 0,
    conversionRate: 0,
    currentTier: 'Bronze',
    nextTierProgress: 65
  });
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referrals/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setReferrals(data.referrals);
        setReferralCode(data.referralCode);
      }
    } catch (error) {
      // Demo data for development
      const mockStats: ReferralStats = {
        totalReferrals: 12,
        successfulSignups: 8,
        totalEarned: 450,
        conversionRate: 66.7,
        currentTier: 'Silver',
        nextTierProgress: 65
      };

      const mockReferrals: ReferralEntry[] = [
        {
          id: '1',
          email: 'alice@example.com',
          signedUp: true,
          firstPurchase: true,
          spiralsEarned: 75,
          referredAt: '2025-01-05T10:00:00Z',
          signupDate: '2025-01-05T14:30:00Z',
          purchaseDate: '2025-01-06T09:15:00Z'
        },
        {
          id: '2',
          email: 'bob@example.com',
          signedUp: true,
          firstPurchase: false,
          spiralsEarned: 25,
          referredAt: '2025-01-06T16:20:00Z',
          signupDate: '2025-01-07T11:45:00Z'
        },
        {
          id: '3',
          email: 'carol@example.com',
          signedUp: false,
          firstPurchase: false,
          spiralsEarned: 0,
          referredAt: '2025-01-07T08:30:00Z'
        }
      ];

      setStats(mockStats);
      setReferrals(mockReferrals);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Referral Code Copied",
      description: "Your referral code has been copied to clipboard.",
    });
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Referral Link Copied",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const shareReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join SPIRAL with my referral code!',
        text: `Sign up for SPIRAL and we'll both earn rewards! Use my referral code: ${referralCode}`,
        url: link
      });
    }
  };

  const tierBenefits = {
    Bronze: { multiplier: 1, bonus: 0, perks: ['Basic rewards', 'Standard support'] },
    Silver: { multiplier: 1.25, bonus: 10, perks: ['25% bonus rewards', '+10 SPIRALs per referral', 'Priority support'] },
    Gold: { multiplier: 1.5, bonus: 20, perks: ['50% bonus rewards', '+20 SPIRALs per referral', 'VIP support', 'Early access'] },
    Platinum: { multiplier: 2, bonus: 50, perks: ['100% bonus rewards', '+50 SPIRALs per referral', 'Dedicated account manager', 'Exclusive events'] }
  };

  const currentTierInfo = tierBenefits[stats.currentTier as keyof typeof tierBenefits];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
          <Users className="w-10 h-10 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-teal-600 mb-2">
            SPIRAL Referral Program
          </h1>
          <p className="text-gray-600">
            Invite friends to join SPIRAL and earn rewards when they sign up and make their first purchase
          </p>
        </div>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Your Referral Code
          </CardTitle>
          <CardDescription>
            Share this code or link with friends to start earning rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg border-2 border-dashed border-teal-200">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Your unique referral code:</p>
              <p className="text-2xl font-bold text-teal-600 font-mono">{referralCode}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyReferralCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button variant="outline" onClick={copyReferralLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button onClick={shareReferralLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">Signup Bonus</h4>
              <p className="text-sm text-blue-700">Friend gets 50 SPIRALs, you get 25 SPIRALs</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">First Purchase Bonus</h4>
              <p className="text-sm text-green-700">Both get additional 50 SPIRALs + 10% off</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful Signups</p>
                <p className="text-2xl font-bold text-green-600">{stats.successfulSignups}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SPIRALs Earned</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalEarned}</p>
              </div>
              <Gift className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Referral Tier: {stats.currentTier}
          </CardTitle>
          <CardDescription>
            Unlock better rewards as you refer more friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next tier</span>
              <span>{stats.nextTierProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.nextTierProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(tierBenefits).map(([tier, benefits]) => (
              <div
                key={tier}
                className={`p-4 rounded-lg border-2 ${
                  tier === stats.currentTier
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className={`w-4 h-4 ${tier === stats.currentTier ? 'text-teal-600' : 'text-gray-400'}`} />
                  <h4 className={`font-semibold ${tier === stats.currentTier ? 'text-teal-600' : 'text-gray-600'}`}>
                    {tier}
                  </h4>
                </div>
                <ul className="text-xs space-y-1">
                  {benefits.perks.map((perk, index) => (
                    <li key={index} className="text-gray-600">• {perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>
            Track the status of your referrals and earned rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No referrals yet</h3>
              <p className="text-gray-500 mb-4">Start sharing your referral code to earn rewards!</p>
              <Button onClick={copyReferralLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{referral.email}</p>
                          <p className="text-sm text-gray-600">
                            Referred: {new Date(referral.referredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        {referral.signedUp ? (
                          <Badge className="bg-green-100 text-green-800">
                            Signed Up {referral.signupDate && `on ${new Date(referral.signupDate).toLocaleDateString()}`}
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending Signup
                          </Badge>
                        )}
                        
                        {referral.firstPurchase ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            First Purchase {referral.purchaseDate && `on ${new Date(referral.purchaseDate).toLocaleDateString()}`}
                          </Badge>
                        ) : referral.signedUp ? (
                          <Badge className="bg-orange-100 text-orange-800">
                            Awaiting Purchase
                          </Badge>
                        ) : null}
                        
                        {referral.spiralsEarned > 0 && (
                          <Badge className="bg-purple-100 text-purple-800">
                            +{referral.spiralsEarned} SPIRALs
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-orange-500" />
            How Referral Rewards Work
          </CardTitle>
          <CardDescription>
            Earn progressive rewards for every friend you bring to SPIRAL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Share Your Code</h4>
              <p className="text-sm text-gray-600">
                Share your unique referral code or link with friends and family
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">2. Friend Signs Up</h4>
              <p className="text-sm text-gray-600">
                They create an account and get 50 SPIRALs, you get 25 SPIRALs
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">3. First Purchase Bonus</h4>
              <p className="text-sm text-gray-600">
                When they make their first purchase, you both get 50 more SPIRALs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}