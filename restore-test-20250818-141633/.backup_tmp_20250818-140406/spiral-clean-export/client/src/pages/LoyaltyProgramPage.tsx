import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Award, Gift, TrendingUp, Users, Crown } from 'lucide-react';
import { Link } from 'wouter';

const LoyaltyProgramPage = () => {
  const userTier = 'Silver';
  const currentPoints = 2450;
  const nextTierPoints = 5000;
  const progress = (currentPoints / nextTierPoints) * 100;

  const tiers = [
    {
      name: 'Bronze',
      min: 0,
      max: 999,
      icon: Award,
      color: 'text-amber-600',
      benefits: ['5 SPIRALs per $100 online', 'Basic customer support', 'Monthly newsletter']
    },
    {
      name: 'Silver',
      min: 1000,
      max: 4999,
      icon: Star,
      color: 'text-gray-500',
      benefits: ['6 SPIRALs per $100 online', 'Priority customer support', 'Exclusive offers', 'Free shipping on orders $50+']
    },
    {
      name: 'Gold',
      min: 5000,
      max: 9999,
      icon: Crown,
      color: 'text-yellow-500',
      benefits: ['8 SPIRALs per $100 online', '15 SPIRALs per $100 in-store', 'VIP customer support', 'Early access to sales', 'Birthday rewards']
    },
    {
      name: 'Platinum',
      min: 10000,
      max: Infinity,
      icon: Crown,
      color: 'text-purple-600',
      benefits: ['10 SPIRALs per $100 online', '20 SPIRALs per $100 in-store', 'Dedicated account manager', 'Exclusive events', 'Premium rewards catalog']
    }
  ];

  const currentTierData = tiers.find(tier => tier.name === userTier);
  const nextTierData = tiers.find(tier => tier.min > currentPoints);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL Loyalty Program
          </h1>
          <p className="text-xl text-gray-600">
            Earn rewards with every purchase. Shop local, earn global.
          </p>
        </div>

        {/* Current Status */}
        <Card className="mb-8 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentTierData && (
                  <currentTierData.icon className={`w-8 h-8 ${currentTierData.color}`} />
                )}
                <div>
                  <CardTitle className="text-2xl">{userTier} Member</CardTitle>
                  <p className="text-gray-600">{currentPoints.toLocaleString()} SPIRALs</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Current Tier
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {nextTierData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Progress to {nextTierData.name}
                  </span>
                  <span className="text-sm font-medium">
                    {currentPoints.toLocaleString()} / {nextTierData.min.toLocaleString()} SPIRALs
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-gray-600">
                  Earn {(nextTierData.min - currentPoints).toLocaleString()} more SPIRALs to reach {nextTierData.name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tier Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tiers.map((tier) => {
            const IconComponent = tier.icon;
            const isCurrentTier = tier.name === userTier;
            const isUnlocked = currentPoints >= tier.min;
            
            return (
              <Card 
                key={tier.name}
                className={`relative transition-all ${
                  isCurrentTier 
                    ? 'ring-2 ring-teal-500 shadow-lg' 
                    : isUnlocked 
                    ? 'shadow-md' 
                    : 'opacity-60'
                }`}
              >
                {isCurrentTier && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-teal-600">Current</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <IconComponent className={`w-12 h-12 mx-auto mb-2 ${tier.color}`} />
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {tier.min === 0 ? '0' : tier.min.toLocaleString()}
                    {tier.max === Infinity ? '+' : ` - ${tier.max.toLocaleString()}`} SPIRALs
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How to Earn */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <CardTitle>Shop Online</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Earn SPIRALs with every online purchase from participating retailers.
              </p>
              <Badge variant="outline" className="text-lg">
                5-10 SPIRALs per $100
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <CardTitle>Refer Friends</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Invite friends to join SPIRAL and earn bonus points for each signup.
              </p>
              <Badge variant="outline" className="text-lg">
                +5 SPIRALs each
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-purple-500" />
                <CardTitle>Special Events</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Participate in seasonal promotions and special events for bonus SPIRALs.
              </p>
              <Badge variant="outline" className="text-lg">
                Bonus Multipliers
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/explore-spirals">
            <Button size="lg" className="bg-gradient-to-r from-teal-600 to-teal-700">
              <Star className="w-5 h-5 mr-2" />
              Explore Ways to Earn
            </Button>
          </Link>
          <Link href="/redeem-spirals">
            <Button size="lg" variant="outline">
              <Gift className="w-5 h-5 mr-2" />
              Redeem Your SPIRALs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgramPage;