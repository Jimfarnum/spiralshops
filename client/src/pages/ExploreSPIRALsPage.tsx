import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Award, TrendingUp } from 'lucide-react';

const ExploreSPIRALsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explore SPIRAL Rewards
          </h1>
          <p className="text-lg text-gray-600">
            Discover all the ways to earn and use your SPIRAL points
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" />
                <CardTitle>Earn Points</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Online purchases</span>
                  <Badge variant="secondary">5 per $100</Badge>
                </div>
                <div className="flex justify-between">
                  <span>In-store purchases</span>
                  <Badge variant="secondary">10 per $100</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Referrals</span>
                  <Badge variant="secondary">+5 each</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-green-500" />
                <CardTitle>Redeem Rewards</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Store discounts</span>
                  <Badge variant="outline">2x value</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Gift cards</span>
                  <Badge variant="outline">1:1 value</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Special offers</span>
                  <Badge variant="outline">Exclusive</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-500" />
                <CardTitle>Tier Benefits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Bronze</span>
                  <Badge variant="outline">0-999</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Silver</span>
                  <Badge variant="outline">1,000+</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Gold</span>
                  <Badge variant="outline">5,000+</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" className="bg-gradient-to-r from-teal-600 to-teal-700">
            <TrendingUp className="w-5 h-5 mr-2" />
            Start Earning SPIRALs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExploreSPIRALsPage;