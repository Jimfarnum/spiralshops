import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Star, 
  Gift, 
  Trophy,
  CheckCircle,
  Clock,
  Users,
  Sparkles,
  Target,
  MapPin,
  ShoppingBag,
  Coins,
  Calendar
} from 'lucide-react';

interface MallPerkProgress {
  campaignId: number;
  mallId: number;
  mallName: string;
  title: string;
  description: string;
  perkType: string;
  bonusPoints: number;
  requiredStores: number;
  progress: number;
  storesVisited: string[];
  totalSpent: number;
  isCompleted: boolean;
  canClaim: boolean;
}

interface MallPerksData {
  perks: MallPerkProgress[];
  activePerks: MallPerkProgress[];
  completedPerks: MallPerkProgress[];
  claimableRewards: number;
}

const getPerkTypeIcon = (type: string) => {
  switch (type) {
    case 'bonus_points': return <Star className="h-5 w-5 text-yellow-600" />;
    case 'discount': return <Gift className="h-5 w-5 text-blue-600" />;
    case 'gift': return <Trophy className="h-5 w-5 text-purple-600" />;
    default: return <Sparkles className="h-5 w-5 text-green-600" />;
  }
};

const getPerkTypeColor = (type: string) => {
  switch (type) {
    case 'bonus_points': return 'bg-yellow-100 text-yellow-800';
    case 'discount': return 'bg-blue-100 text-blue-800';
    case 'gift': return 'bg-purple-100 text-purple-800';
    default: return 'bg-green-100 text-green-800';
  }
};

export default function MallPerksPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: perksData, isLoading } = useQuery<MallPerksData>({
    queryKey: ['/api/loyalty/mall-perks'],
  });

  const claimPerkMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await fetch(`/api/loyalty/claim-perk/${campaignId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to claim perk reward');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reward Claimed!",
        description: data.reward.message,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/loyalty/mall-perks'] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim perk reward",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const perks = perksData?.perks || [];
  const activePerks = perksData?.activePerks || [];
  const completedPerks = perksData?.completedPerks || [];
  const claimableRewards = perksData?.claimableRewards || 0;

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              Mall Bonus Perks
            </h1>
            <p className="text-lg text-gray-600">
              Shop at multiple stores within the same mall to unlock exclusive bonus rewards
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-lg font-bold">{activePerks.length}</div>
                    <div className="text-xs text-gray-600">Active Perks</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-lg font-bold">{completedPerks.length}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-lg font-bold">{claimableRewards}</div>
                    <div className="text-xs text-gray-600">Ready to Claim</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="text-lg font-bold">
                      {perks.reduce((sum, perk) => sum + (perk.isCompleted ? perk.bonusPoints : 0), 0)}
                    </div>
                    <div className="text-xs text-gray-600">Bonus SPIRALs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Active and Completed Perks */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Perks ({activePerks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedPerks.length})</TabsTrigger>
            </TabsList>

            {/* Active Perks */}
            <TabsContent value="active" className="space-y-6">
              {activePerks.map((perk) => (
                <Card key={perk.campaignId} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--spiral-coral)]/10 rounded-lg">
                          {getPerkTypeIcon(perk.perkType)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{perk.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {perk.mallName}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getPerkTypeColor(perk.perkType)}>
                        +{perk.bonusPoints} SPIRALs
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{perk.description}</p>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Store Progress</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {perk.progress} of {perk.requiredStores} stores
                        </span>
                      </div>
                      
                      <Progress 
                        value={(perk.progress / perk.requiredStores) * 100} 
                        className="h-2"
                      />

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Total spent: ${perk.totalSpent.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Stores Visited */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Stores Visited:</div>
                      <div className="flex flex-wrap gap-2">
                        {perk.storesVisited.map((store, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {store}
                          </Badge>
                        ))}
                        {Array.from({ length: perk.requiredStores - perk.progress }).map((_, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {perk.requiredStores - perk.progress} more store{perk.requiredStores - perk.progress !== 1 ? 's' : ''} needed
                        </div>
                        <div className="text-sm font-semibold text-[var(--spiral-coral)]">
                          Reward: +{perk.bonusPoints} SPIRALs
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activePerks.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No active perks</h3>
                    <p className="text-gray-500">
                      Visit a shopping mall to discover available bonus perk campaigns
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Completed Perks */}
            <TabsContent value="completed" className="space-y-6">
              {completedPerks.map((perk) => (
                <Card key={perk.campaignId} className="overflow-hidden border-green-200 bg-green-50/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {perk.title}
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {perk.mallName}
                          </CardDescription>
                        </div>
                      </div>
                      {perk.canClaim ? (
                        <Button 
                          onClick={() => claimPerkMutation.mutate(perk.campaignId)}
                          disabled={claimPerkMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Gift className="mr-2 h-4 w-4" />
                          Claim +{perk.bonusPoints}
                        </Button>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Claimed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{perk.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Achievement:</div>
                        <div className="text-green-600 font-semibold">
                          ✓ Visited {perk.requiredStores} stores
                        </div>
                        <div className="text-sm text-gray-600">
                          Total spent: ${perk.totalSpent.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Stores Visited:</div>
                        <div className="flex flex-wrap gap-1">
                          {perk.storesVisited.map((store, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {store}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {completedPerks.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed perks yet</h3>
                    <p className="text-gray-500">
                      Complete mall perk challenges to see your achievements here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}