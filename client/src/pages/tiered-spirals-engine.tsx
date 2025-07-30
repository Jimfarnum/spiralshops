import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Star,
  TrendingUp,
  Gift,
  Zap,
  Trophy,
  Target,
  Award,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpiralTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  benefits: string[];
  multiplier: number;
  icon: React.ReactNode;
}

interface UserProgress {
  currentPoints: number;
  currentTier: string;
  nextTier?: string;
  pointsToNext: number;
  totalEarned: number;
  monthlyEarned: number;
}

export default function TieredSpiralsEngine() {
  const { toast } = useToast();
  
  const spiralTiers: SpiralTier[] = [
    {
      id: 'bronze',
      name: 'Bronze Explorer',
      minPoints: 0,
      maxPoints: 999,
      color: 'bg-amber-100 text-amber-800',
      benefits: ['5 SPIRALs per $100 online', 'Basic customer support', 'Standard shipping'],
      multiplier: 1.0,
      icon: <Star className="h-5 w-5" />
    },
    {
      id: 'silver',
      name: 'Silver Shopper',
      minPoints: 1000,
      maxPoints: 2999,
      color: 'bg-gray-100 text-gray-800',
      benefits: ['7 SPIRALs per $100 online', 'Priority customer support', 'Free shipping on $50+', '5% birthday bonus'],
      multiplier: 1.4,
      icon: <Award className="h-5 w-5" />
    },
    {
      id: 'gold',
      name: 'Gold VIP',
      minPoints: 3000,
      maxPoints: 7499,
      color: 'bg-yellow-100 text-yellow-800',
      benefits: ['10 SPIRALs per $100 online', 'VIP customer support', 'Free shipping always', '10% birthday bonus', 'Early sale access'],
      multiplier: 2.0,
      icon: <Trophy className="h-5 w-5" />
    },
    {
      id: 'platinum',
      name: 'Platinum Elite',
      minPoints: 7500,
      maxPoints: 14999,
      color: 'bg-purple-100 text-purple-800',
      benefits: ['15 SPIRALs per $100 online', 'Dedicated support line', 'Free express shipping', '15% birthday bonus', 'Exclusive events', 'Personal shopper'],
      multiplier: 3.0,
      icon: <Crown className="h-5 w-5" />
    },
    {
      id: 'diamond',
      name: 'Diamond Legend',
      minPoints: 15000,
      maxPoints: Infinity,
      color: 'bg-blue-100 text-blue-800',
      benefits: ['20 SPIRALs per $100 online', 'White-glove service', 'All shipping free', '20% birthday bonus', 'VIP events', 'Concierge service', 'Annual gift'],
      multiplier: 4.0,
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentPoints: 2450,
    currentTier: 'silver',
    nextTier: 'gold',
    pointsToNext: 550,
    totalEarned: 4890,
    monthlyEarned: 480
  });

  const [autoUpgradeEnabled, setAutoUpgradeEnabled] = useState(true);
  const [upgradeHistory, setUpgradeHistory] = useState([
    {
      date: '2025-01-15',
      fromTier: 'Bronze Explorer',
      toTier: 'Silver Shopper',
      pointsAtUpgrade: 1000
    }
  ]);

  const getCurrentTier = () => {
    return spiralTiers.find(tier => tier.id === userProgress.currentTier) || spiralTiers[0];
  };

  const getNextTier = () => {
    const currentIndex = spiralTiers.findIndex(tier => tier.id === userProgress.currentTier);
    return currentIndex < spiralTiers.length - 1 ? spiralTiers[currentIndex + 1] : null;
  };

  const calculateProgress = () => {
    const currentTier = getCurrentTier();
    const progressInTier = userProgress.currentPoints - currentTier.minPoints;
    const tierRange = currentTier.maxPoints - currentTier.minPoints;
    return Math.min((progressInTier / tierRange) * 100, 100);
  };

  const simulatePointsEarning = (points: number) => {
    const newPoints = userProgress.currentPoints + points;
    const newTier = spiralTiers.find(tier => 
      newPoints >= tier.minPoints && newPoints <= tier.maxPoints
    );
    
    setUserProgress(prev => ({
      ...prev,
      currentPoints: newPoints,
      totalEarned: prev.totalEarned + points,
      monthlyEarned: prev.monthlyEarned + points
    }));

    // Check for tier upgrade
    if (newTier && newTier.id !== userProgress.currentTier) {
      handleTierUpgrade(newTier);
    }

    toast({
      title: "SPIRALs Earned!",
      description: `+${points} SPIRALs earned from your purchase`,
    });
  };

  const handleTierUpgrade = (newTier: SpiralTier) => {
    if (!autoUpgradeEnabled) return;

    const currentTier = getCurrentTier();
    
    setUpgradeHistory(prev => [...prev, {
      date: new Date().toISOString().split('T')[0],
      fromTier: currentTier.name,
      toTier: newTier.name,
      pointsAtUpgrade: userProgress.currentPoints
    }]);

    setUserProgress(prev => ({
      ...prev,
      currentTier: newTier.id
    }));

    toast({
      title: "🎉 Tier Upgrade!",
      description: `Congratulations! You've been upgraded to ${newTier.name}`,
    });
  };

  const getUpgradePreview = () => {
    const nextTier = getNextTier();
    if (!nextTier) return null;

    const currentTier = getCurrentTier();
    const additionalBenefits = nextTier.benefits.filter(
      benefit => !currentTier.benefits.includes(benefit)
    );

    return {
      tier: nextTier,
      additionalBenefits,
      pointsNeeded: nextTier.minPoints - userProgress.currentPoints
    };
  };

  const upgradePreview = getUpgradePreview();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            Tiered SPIRALS Engine
          </h1>
          <p className="text-gray-600">
            Advanced loyalty system with automatic tier upgrades and progressive benefits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Current Status</span>
                  <Badge className={getCurrentTier().color}>
                    {getCurrentTier().icon}
                    <span className="ml-2">{getCurrentTier().name}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userProgress.currentPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Current SPIRALs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userProgress.totalEarned.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {getCurrentTier().multiplier}x
                    </div>
                    <div className="text-sm text-gray-600">Earning Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {userProgress.monthlyEarned}
                    </div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                </div>

                {upgradePreview && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress to {upgradePreview.tier.name}</span>
                      <span className="text-sm text-gray-600">
                        {upgradePreview.pointsNeeded} SPIRALs to go
                      </span>
                    </div>
                    <Progress value={calculateProgress()} className="h-3" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Tiers Overview */}
            <Card>
              <CardHeader>
                <CardTitle>SPIRALS Tier System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spiralTiers.map((tier, index) => (
                    <div key={tier.id} className={`p-4 rounded-lg border-2 ${
                      tier.id === userProgress.currentTier 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={tier.color}>
                            {tier.icon}
                            <span className="ml-2">{tier.name}</span>
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {tier.minPoints.toLocaleString()}{tier.maxPoints === Infinity ? '+' : ` - ${tier.maxPoints.toLocaleString()}`} SPIRALs
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{tier.multiplier}x Earning Rate</div>
                          <div className="text-sm text-gray-600">
                            {Math.round(5 * tier.multiplier)} SPIRALs per $100
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center text-sm text-gray-700">
                            <Star className="h-3 w-3 mr-2 text-yellow-500" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Tier Preview */}
            {upgradePreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ChevronUp className="h-5 w-5 mr-2" />
                    Next Tier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={upgradePreview.tier.color} size="lg">
                    {upgradePreview.tier.icon}
                    <span className="ml-2">{upgradePreview.tier.name}</span>
                  </Badge>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">New Benefits:</h4>
                    <div className="space-y-2">
                      {upgradePreview.additionalBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Gift className="h-3 w-3 mr-2 text-green-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      {upgradePreview.pointsNeeded} more SPIRALs needed for upgrade
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Auto-Upgrade Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Auto-Upgrade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automatic tier upgrades</span>
                  <input
                    type="checkbox"
                    checked={autoUpgradeEnabled}
                    onChange={(e) => setAutoUpgradeEnabled(e.target.checked)}
                    className="rounded"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Automatically upgrade when you reach the required SPIRALs
                </p>
              </CardContent>
            </Card>

            {/* Earning Simulator */}
            <Card>
              <CardHeader>
                <CardTitle>Earn SPIRALs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => simulatePointsEarning(50)} 
                  className="w-full" 
                  variant="outline"
                >
                  +50 SPIRALs ($10 purchase)
                </Button>
                <Button 
                  onClick={() => simulatePointsEarning(250)} 
                  className="w-full" 
                  variant="outline"
                >
                  +250 SPIRALs ($50 purchase)
                </Button>
                <Button 
                  onClick={() => simulatePointsEarning(500)} 
                  className="w-full"
                >
                  +500 SPIRALs ($100 purchase)
                </Button>
              </CardContent>
            </Card>

            {/* Upgrade History */}
            {upgradeHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upgradeHistory.map((upgrade, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{upgrade.toTier}</div>
                        <div className="text-xs text-gray-600">
                          {upgrade.date} • {upgrade.pointsAtUpgrade} SPIRALs
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}