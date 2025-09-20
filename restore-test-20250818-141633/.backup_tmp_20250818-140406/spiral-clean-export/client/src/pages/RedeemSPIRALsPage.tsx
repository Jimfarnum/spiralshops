import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Gift, CreditCard, Percent, Star } from 'lucide-react';

const RedeemSPIRALsPage = () => {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const userBalance = 2450; // Mock user balance

  const rewards = [
    {
      id: 'discount-10',
      title: '$10 Store Credit',
      cost: 1000,
      type: 'Store Credit',
      icon: CreditCard,
      description: 'Use at any participating store'
    },
    {
      id: 'discount-25',
      title: '$25 Store Credit',
      cost: 2500,
      type: 'Store Credit',
      icon: CreditCard,
      description: 'Use at any participating store'
    },
    {
      id: 'gift-card-50',
      title: '$50 Gift Card',
      cost: 5000,
      type: 'Gift Card',
      icon: Gift,
      description: 'Physical or digital gift card'
    },
    {
      id: 'exclusive-discount',
      title: '20% Off Next Purchase',
      cost: 1500,
      type: 'Discount',
      icon: Percent,
      description: 'Valid for 30 days'
    }
  ];

  const canAfford = (cost: number) => userBalance >= cost;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Redeem Your SPIRALs
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-semibold text-gray-800">
              {userBalance.toLocaleString()} SPIRALs Available
            </span>
          </div>
          <p className="text-gray-600">
            Choose from our selection of rewards and exclusive offers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {rewards.map((reward) => {
            const IconComponent = reward.icon;
            const affordable = canAfford(reward.cost);
            
            return (
              <Card 
                key={reward.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedReward === reward.id ? 'ring-2 ring-teal-500' : ''
                } ${!affordable ? 'opacity-60' : ''}`}
                onClick={() => affordable && setSelectedReward(reward.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-8 h-8 text-teal-600" />
                      <div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <Badge variant="outline">{reward.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-teal-600">
                        {reward.cost.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">SPIRALs</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{reward.description}</p>
                  <Button 
                    className="w-full" 
                    disabled={!affordable}
                    variant={affordable ? "default" : "outline"}
                  >
                    {affordable ? 'Redeem Now' : 'Insufficient SPIRALs'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedReward && (
          <Card className="bg-teal-50 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-800">Confirm Redemption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Selected Reward:</span>
                  <span className="font-semibold">
                    {rewards.find(r => r.id === selectedReward)?.title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cost:</span>
                  <span className="font-semibold text-teal-600">
                    {rewards.find(r => r.id === selectedReward)?.cost.toLocaleString()} SPIRALs
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Remaining Balance:</span>
                  <span className="font-semibold">
                    {(userBalance - (rewards.find(r => r.id === selectedReward)?.cost || 0)).toLocaleString()} SPIRALs
                  </span>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                    Confirm Redemption
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedReward(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RedeemSPIRALsPage;