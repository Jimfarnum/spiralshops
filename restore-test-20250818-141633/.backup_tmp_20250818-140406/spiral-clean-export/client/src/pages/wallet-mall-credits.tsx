import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, DollarSign, Gift, ArrowRight, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface MallCredit {
  id: string;
  userId: number;
  mallId: string;
  mallName: string;
  amount: number;
  remainingBalance: number;
  source: 'promotion' | 'loyalty_bonus' | 'event' | 'referral';
  description?: string;
  isActive: boolean;
  expiresAt?: string;
  earnedAt: string;
}

export default function WalletMallCredits() {
  const [selectedCredit, setSelectedCredit] = useState<MallCredit | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID (in real app would come from auth context)
  const userId = 1;

  // Fetch mall credits
  const { data: walletData, isLoading } = useQuery({
    queryKey: [`/api/wallet/user/${userId}`],
  });

  // Earn mall credit mutation (for demo purposes)
  const earnMallCredit = useMutation({
    mutationFn: async (data: {
      userId: number;
      mallId: string;
      mallName: string;
      amount: number;
      source: string;
      description: string;
    }) => {
      return apiRequest(`/api/wallet/mall-credit/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Mall Credit Earned!',
        description: 'Your new mall credit has been added to your wallet.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/wallet/user/${userId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to earn mall credit.',
        variant: 'destructive',
      });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEarnDemoCredit = (mallName: string, amount: number, description: string) => {
    earnMallCredit.mutate({
      userId,
      mallId: mallName.toLowerCase().replace(/\s+/g, '-'),
      mallName,
      amount,
      source: 'promotion',
      description,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading mall credits...</p>
          </div>
        </div>
      </div>
    );
  }

  const mallCredits = walletData?.mallCredits || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mall Credits</h1>
        <p className="text-gray-600">Your mall-specific rewards and promotional credits</p>
      </div>

      {/* Mall Credits Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mall Credits</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(walletData?.totalMallCredits || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available to spend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Credits</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mallCredits.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              From {new Set(mallCredits.map(c => c.mallId)).size} malls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Apply</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">Enabled</div>
            <p className="text-xs text-muted-foreground">
              Credits apply automatically at checkout
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demo Section */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Gift className="h-5 w-5" />
            Feature 14 Demo: Earn Mall Credits
          </CardTitle>
          <CardDescription className="text-blue-700">
            Try earning mall credits from different promotional activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleEarnDemoCredit('Burnsville Mall', 10, '3-store shopping challenge completed')}
              disabled={earnMallCredit.isPending}
              className="flex items-center justify-between p-6 h-auto"
              variant="outline"
            >
              <div className="text-left">
                <div className="font-semibold">Shopping Challenge</div>
                <div className="text-sm text-gray-600">Visit 3 stores in Burnsville Mall</div>
              </div>
              <div className="text-green-600 font-bold">+$10</div>
            </Button>

            <Button
              onClick={() => handleEarnDemoCredit('Westfield Valley Fair', 25, 'Loyalty tier bonus - Gold member reward')}
              disabled={earnMallCredit.isPending}
              className="flex items-center justify-between p-6 h-auto"
              variant="outline"
            >
              <div className="text-left">
                <div className="font-semibold">Gold Member Bonus</div>
                <div className="text-sm text-gray-600">Westfield Valley Fair loyalty</div>
              </div>
              <div className="text-green-600 font-bold">+$25</div>
            </Button>

            <Button
              onClick={() => handleEarnDemoCredit('Downtown Shopping Center', 15, 'Weekend event participation reward')}
              disabled={earnMallCredit.isPending}
              className="flex items-center justify-between p-6 h-auto"
              variant="outline"
            >
              <div className="text-left">
                <div className="font-semibold">Event Participation</div>
                <div className="text-sm text-gray-600">Downtown Shopping Center event</div>
              </div>
              <div className="text-green-600 font-bold">+$15</div>
            </Button>

            <Button
              onClick={() => handleEarnDemoCredit('Mall of America', 50, 'Referral bonus - Friend signed up and made first purchase')}
              disabled={earnMallCredit.isPending}
              className="flex items-center justify-between p-6 h-auto"
              variant="outline"
            >
              <div className="text-left">
                <div className="font-semibold">Referral Bonus</div>
                <div className="text-sm text-gray-600">Mall of America program</div>
              </div>
              <div className="text-green-600 font-bold">+$50</div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mall Credits List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Your Mall Credits</h2>
        
        <div className="grid gap-4">
          {mallCredits.map((credit) => (
            <Card key={credit.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {credit.mallName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{credit.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <Badge 
                        variant="outline" 
                        className={
                          credit.source === 'promotion' ? 'border-purple-200 text-purple-700' :
                          credit.source === 'loyalty_bonus' ? 'border-blue-200 text-blue-700' :
                          credit.source === 'event' ? 'border-green-200 text-green-700' :
                          'border-orange-200 text-orange-700'
                        }
                      >
                        {credit.source.replace('_', ' ')}
                      </Badge>
                      <span>Earned: {formatDate(credit.earnedAt)}</span>
                      {credit.expiresAt && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Expires: {formatDate(credit.expiresAt)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={credit.isActive ? "default" : "secondary"}
                        className={credit.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {credit.isActive ? "Available" : "Used"}
                      </Badge>
                      {credit.isActive && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Auto-applies at checkout
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatCurrency(credit.remainingBalance)}
                    </div>
                    {credit.amount > credit.remainingBalance && (
                      <div className="text-sm text-gray-500">
                        of {formatCurrency(credit.amount)}
                      </div>
                    )}
                  </div>
                </div>

                {credit.isActive && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Use this credit when shopping at {credit.mallName} stores
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('/products', '_blank')}
                        className="flex items-center gap-2"
                      >
                        Shop Now
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {mallCredits.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Mall Credits Yet</h3>
                <p className="text-gray-600 mb-6">
                  Mall credits are earned through promotions, loyalty bonuses, events, and referrals.
                  Try the demo buttons above to see how they work!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => window.open('/mall-directory', '_blank')}>
                    Explore Malls
                  </Button>
                  <Button onClick={() => window.open('/events', '_blank')}>
                    Find Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <Card className="mt-8 bg-gray-50">
        <CardHeader>
          <CardTitle>How Mall Credits Work</CardTitle>
          <CardDescription>
            Understand how to earn and use your mall-specific rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-700">How to Earn</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Complete shopping challenges (visit multiple stores)</li>
                <li>• Reach loyalty program milestones</li>
                <li>• Participate in mall events and activities</li>
                <li>• Refer friends who make their first purchase</li>
                <li>• Special seasonal and promotional bonuses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">How to Use</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Credits automatically apply during checkout</li>
                <li>• Only valid at the specific mall where earned</li>
                <li>• Can be combined with gift cards and SPIRALs</li>
                <li>• Some credits may have expiration dates</li>
                <li>• Partial redemption allowed for larger purchases</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}