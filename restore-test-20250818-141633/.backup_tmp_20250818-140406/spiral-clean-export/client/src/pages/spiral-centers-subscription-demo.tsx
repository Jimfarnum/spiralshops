import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Package, Truck, Clock, Building, Star, ArrowRight, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

export default function SpiralCentersSubscriptionDemo() {
  const [selectedCenter, setSelectedCenter] = useState(1);
  
  // Mock integrated data showing SPIRAL Centers + Subscription synergy
  const subscriptionCenterIntegration = {
    userSubscription: {
      id: 1,
      title: "Weekly Farmers Market Box",
      nextDelivery: "Friday, August 2, 2025",
      frequency: "weekly",
      status: "active",
      spiralBonus: "1.5x points",
      totalItems: 8,
      estimatedValue: "$42.99"
    },
    nearestCenter: {
      id: 1,
      name: "SPIRAL Center Minneapolis",
      code: "MSP",
      address: "900 Nicollet Mall",
      city: "Minneapolis",
      state: "MN",
      distance: "2.3 miles",
      type: "mall",
      services: ["same-day", "pickup", "delivery", "returns"],
      operatingHours: "8AM-9PM",
      currentInventory: 87,
      subscriptionCapacity: "95% available"
    },
    deliveryOptions: [
      {
        method: "ship-to-spiral-center",
        name: "SPIRAL Center Pickup",
        description: "Free pickup from SPIRAL Center",
        cost: "$0.00",
        timing: "Ready today by 5PM",
        spiralBonus: "+3 extra points",
        benefits: ["No shipping fees", "Secure storage", "Extended pickup hours"]
      },
      {
        method: "same-day-delivery", 
        name: "Same-Day Home Delivery",
        description: "Direct delivery from SPIRAL Center",
        cost: "$4.99",
        timing: "Today by 8PM",
        spiralBonus: "+2 extra points",
        benefits: ["Contactless delivery", "Real-time tracking", "Climate controlled"]
      },
      {
        method: "ship-to-me",
        name: "Standard Shipping",
        description: "Traditional shipping method",
        cost: "$7.99",
        timing: "2-3 business days",
        spiralBonus: "Standard points",
        benefits: ["Home delivery", "Standard tracking"]
      }
    ],
    competitiveAdvantages: [
      {
        feature: "Local Hub Network",
        spiral: "✅ 4 centers in metro area",
        amazon: "❌ Limited fulfillment centers",
        advantage: "Faster local delivery"
      },
      {
        feature: "Same-Day Pickup",
        spiral: "✅ Ready within hours",
        amazon: "❌ Next-day minimum",
        advantage: "Immediate access"
      },
      {
        feature: "Community Integration",
        spiral: "✅ Mall-based convenient locations",
        amazon: "❌ Warehouse locations only",
        advantage: "Accessible pickup points"
      },
      {
        feature: "Local Business Support",
        spiral: "✅ Supports local retailers",
        amazon: "❌ Corporate supply chain",
        advantage: "Community investment"
      },
      {
        feature: "Flexible Storage",
        spiral: "✅ 7-day hold at center",
        amazon: "❌ Limited hold time",
        advantage: "Convenient scheduling"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/subscriptions" className="text-blue-600 hover:text-blue-800">
            ← Back to Subscriptions
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SPIRAL Centers + Subscription Services
        </h1>
        <p className="text-gray-600">
          Revolutionary logistics network that enhances subscription delivery through local community hubs
        </p>
      </div>

      {/* Active Subscription Overview */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-blue-900">Your Active Subscription</CardTitle>
              <CardDescription className="text-blue-700">
                Enhanced with SPIRAL Centers logistics network
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">{subscriptionCenterIntegration.userSubscription.title}</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Next Delivery:</span> {subscriptionCenterIntegration.userSubscription.nextDelivery}</p>
                <p><span className="font-medium">Frequency:</span> {subscriptionCenterIntegration.userSubscription.frequency}</p>
                <p><span className="font-medium">Items:</span> {subscriptionCenterIntegration.userSubscription.totalItems} products</p>
                <p><span className="font-medium">Value:</span> {subscriptionCenterIntegration.userSubscription.estimatedValue}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Assigned SPIRAL Center</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{subscriptionCenterIntegration.nearestCenter.name}</p>
                <p>{subscriptionCenterIntegration.nearestCenter.address}</p>
                <p>{subscriptionCenterIntegration.nearestCenter.city}, {subscriptionCenterIntegration.nearestCenter.state}</p>
                <p className="text-green-600">📍 {subscriptionCenterIntegration.nearestCenter.distance} away</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Enhanced Benefits</h3>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {subscriptionCenterIntegration.userSubscription.spiralBonus} SPIRAL points
                </p>
                <p className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-blue-500" />
                  Same-day pickup available
                </p>
                <p className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  Secure climate-controlled storage
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-purple-500" />
                  Extended pickup hours
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="delivery-options" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="delivery-options">Enhanced Delivery Options</TabsTrigger>
          <TabsTrigger value="network-benefits">Network Benefits</TabsTrigger>
          <TabsTrigger value="competitive-analysis">Competitive Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery-options" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionCenterIntegration.deliveryOptions.map((option, index) => (
              <Card key={option.method} className={`relative ${index === 0 ? 'border-green-200 bg-green-50' : ''}`}>
                {index === 0 && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="default" className="bg-green-600">
                      <Zap className="w-3 h-3 mr-1" />
                      BEST VALUE
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{option.name}</CardTitle>
                    <span className="text-lg font-bold text-green-600">{option.cost}</span>
                  </div>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{option.timing}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-blue-600">{option.spiralBonus}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Benefits:</p>
                      <ul className="space-y-1">
                        {option.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      variant={index === 0 ? "default" : "outline"} 
                      className="w-full"
                    >
                      {index === 0 ? "Select (Recommended)" : "Select Option"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network-benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Community Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Mall-Based Locations</p>
                      <p className="text-sm text-gray-600">Convenient pickup points integrated into shopping centers you already visit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Extended Hours</p>
                      <p className="text-sm text-gray-600">Open until 9PM for flexible pickup scheduling around your life</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Local Support</p>
                      <p className="text-sm text-gray-600">Staffed by community members who understand local needs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  Logistics Excellence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Same-Day Processing</p>
                      <p className="text-sm text-gray-600">Orders ready for pickup within hours, not days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Climate Control</p>
                      <p className="text-sm text-gray-600">Temperature-controlled storage for fresh groceries and perishables</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Smart Routing</p>
                      <p className="text-sm text-gray-600">AI-optimized center-to-center shipping reduces delivery time by 60%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Enhanced SPIRAL Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Bonus Points for Pickup</p>
                      <p className="text-sm text-gray-600">Earn +3 SPIRAL points when you choose center pickup</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Subscription Multiplier</p>
                      <p className="text-sm text-gray-600">1.5x points on all subscription orders vs regular purchases</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Community Impact</p>
                      <p className="text-sm text-gray-600">Double rewards when supporting local businesses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Security & Reliability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Secure Storage</p>
                      <p className="text-sm text-gray-600">24/7 monitored facilities with package tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">7-Day Hold</p>
                      <p className="text-sm text-gray-600">Flexible pickup window accommodates busy schedules</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Real-Time Updates</p>
                      <p className="text-sm text-gray-600">SMS and app notifications for order status and pickup readiness</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitive-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                SPIRAL Centers vs. Amazon Subscribe & Save
              </CardTitle>
              <CardDescription>
                How SPIRAL's logistics network provides superior subscription service delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionCenterIntegration.competitiveAdvantages.map((comparison, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">{comparison.feature}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">SPIRAL:</span>
                        <span className="text-sm font-medium">{comparison.spiral}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Amazon:</span>
                        <span className="text-sm font-medium">{comparison.amazon}</span>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {comparison.advantage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">SPIRAL Advantage Summary</h4>
                <p className="text-sm text-green-800 mb-3">
                  Our local SPIRAL Centers network provides faster delivery, convenient pickup, and stronger community support than traditional subscription services.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">60% faster local delivery</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">$0 pickup fees</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Community investment</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Enhanced rewards</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-8">
        <Link href="/subscriptions">
          <Button variant="outline">
            ← Back to Subscriptions
          </Button>
        </Link>
        <Link href="/spiral-centers">
          <Button variant="outline">
            View All SPIRAL Centers
          </Button>
        </Link>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Optimize My Subscription
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}