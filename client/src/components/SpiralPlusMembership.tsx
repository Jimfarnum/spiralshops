import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Truck, Gift, Star, Shield, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MembershipTier {
  name: string;
  price: number;
  monthlyPrice?: number;
  benefits: string[];
  spiralMultiplier: number;
  freeShippingThreshold: number;
}

interface SpiralPlusMembershipProps {
  currentTier?: string;
}

export function SpiralPlusMembership({ currentTier = 'free' }: SpiralPlusMembershipProps) {
  const [selectedTier, setSelectedTier] = useState<string>('plus');
  const [paymentPlan, setPaymentPlan] = useState<'annual' | 'monthly'>('annual');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const tiers = {
    free: {
      name: 'SPIRAL Free',
      price: 0,
      benefits: [
        'Basic product search',
        'Standard delivery (5-7 days)',
        'Email customer support',
        'Basic SPIRAL rewards (5¢ = 1 point)'
      ],
      spiralMultiplier: 1,
      freeShippingThreshold: 75
    },
    plus: {
      name: 'SPIRAL+',
      price: 79,
      monthlyPrice: 8.99,
      benefits: [
        'FREE 2-day shipping on all orders',
        'Priority customer support (live chat)',
        'Enhanced SPIRAL rewards (2x points)',
        'Early access to sales and new products',
        'Exclusive member-only deals',
        'Free returns and exchanges',
        'Price matching guarantee'
      ],
      spiralMultiplier: 2,
      freeShippingThreshold: 0
    },
    premium: {
      name: 'SPIRAL Premium',
      price: 149,
      monthlyPrice: 14.99,
      benefits: [
        'FREE same-day delivery in major cities',
        '24/7 premium support (phone + chat)',
        'Triple SPIRAL rewards (3x points)',
        'Personal shopping assistant',
        'Exclusive premium products access',
        'Free installation and setup services',
        'Concierge services for special requests',
        'Annual $25 SPIRAL credit'
      ],
      spiralMultiplier: 3,
      freeShippingThreshold: 0
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/membership/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier,
          paymentPlan,
          userId: 'demo_user', // In real app, get from auth context
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Membership Upgraded! 🎉",
          description: `Welcome to ${result.upgrade.newTier.toUpperCase()}! All benefits are now active.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'plus': return <Star className="w-5 h-5 text-blue-500" />;
      default: return <Gift className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
      {Object.entries(tiers).map(([tierKey, tier]) => {
        const isCurrentTier = currentTier === tierKey;
        const isPremium = tierKey === 'premium';
        const isSelected = selectedTier === tierKey;
        const displayPrice = paymentPlan === 'monthly' ? tier.monthlyPrice : tier.price;

        return (
          <Card 
            key={tierKey}
            className={`relative ${isPremium ? 'border-yellow-300 shadow-lg scale-105' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => tierKey !== 'free' && setSelectedTier(tierKey)}
          >
            {isPremium && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-2">
                {getTierIcon(tierKey)}
                <CardTitle>{tier.name}</CardTitle>
              </div>
              <div className="text-3xl font-bold">
                ${displayPrice || 0}
                {tierKey !== 'free' && (
                  <span className="text-sm font-normal text-gray-600">
                    /{paymentPlan === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </div>
              {tierKey !== 'free' && tier.monthlyPrice && (
                <div className="text-sm text-gray-600">
                  {paymentPlan === 'annual' && `$${tier.monthlyPrice}/month if paid monthly`}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {isCurrentTier && (
                <Badge variant="outline" className="w-full justify-center">
                  Current Plan
                </Badge>
              )}

              <div className="space-y-2">
                {tier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>
                    {tier.freeShippingThreshold === 0 
                      ? 'Free shipping on all orders' 
                      : `Free shipping over $${tier.freeShippingThreshold}`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  <span>{tier.spiralMultiplier}x SPIRAL rewards</span>
                </div>
                {tierKey === 'plus' && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>2-day delivery guarantee</span>
                  </div>
                )}
                {tierKey === 'premium' && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>24/7 premium support</span>
                  </div>
                )}
              </div>

              {!isCurrentTier && tierKey !== 'free' && (
                <Button 
                  onClick={() => setSelectedTier(tierKey)}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                >
                  {isSelected ? 'Selected' : `Choose ${tier.name}`}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Upgrade Section */}
      {selectedTier !== 'free' && selectedTier !== currentTier && (
        <div className="md:col-span-3 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Complete Your Upgrade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  variant={paymentPlan === 'annual' ? 'default' : 'outline'}
                  onClick={() => setPaymentPlan('annual')}
                >
                  Annual (Save 25%)
                </Button>
                <Button
                  variant={paymentPlan === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setPaymentPlan('monthly')}
                >
                  Monthly
                </Button>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${paymentPlan === 'annual' ? tiers[selectedTier].price : tiers[selectedTier].monthlyPrice}
                  <span className="text-sm font-normal text-gray-600">
                    /{paymentPlan === 'annual' ? 'year' : 'month'}
                  </span>
                </div>
                {paymentPlan === 'annual' && (
                  <div className="text-sm text-green-600">
                    You save ${((tiers[selectedTier].monthlyPrice || 0) * 12) - tiers[selectedTier].price} per year!
                  </div>
                )}
              </div>

              <Button 
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isLoading ? 'Processing...' : `Upgrade to ${tiers[selectedTier].name}`}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <Shield className="w-4 h-4 inline mr-1" />
                30-day money-back guarantee • Cancel anytime
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SpiralPlusMembership;