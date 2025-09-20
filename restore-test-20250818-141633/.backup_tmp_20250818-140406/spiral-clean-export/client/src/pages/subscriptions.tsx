import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Package, Star, CheckCircle, Pause, X, Plus, Gift, Zap, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: number;
  title: string;
  description: string;
  frequency: string;
  nextDelivery: string;
  nextDeliveryFormatted: string;
  status: string;
  totalPrice: string;
  discountPercentage: number;
  spiralBonusMultiplier: string;
  savings: string;
  items: SubscriptionItem[];
  createdAt: string;
}

interface SubscriptionItem {
  id: number;
  productName: string;
  storeName: string;
  quantity: number;
  price: string;
  fulfillmentMethod: string;
}

interface PopularTemplate {
  id: string;
  title: string;
  description: string;
  frequency: string;
  estimatedPrice: string;
  discount: string;
  spiralBonus: string;
  items: string[];
  stores: string[];
}

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState('my-subscriptions');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock user ID - in real app this would come from auth context
  const userId = 1;

  // Fetch user's subscriptions
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['subscriptions', userId],
    queryFn: async () => {
      const response = await fetch(`/api/subscriptions/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      return response.json();
    }
  });

  // Fetch popular subscription templates
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ['subscription-templates'],
    queryFn: async () => {
      const response = await fetch('/api/subscriptions/popular');
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json();
    }
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: 'pause' | 'resume' | 'cancel' }) => {
      const status = action === 'pause' ? 'paused' : action === 'resume' ? 'active' : 'cancelled';
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error(`Failed to ${action} subscription`);
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', userId] });
      toast({
        title: "Subscription Updated",
        description: `Subscription ${variables.action}d successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <Package className="w-4 h-4" />;
      case 'quarterly': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleSubscriptionAction = (id: number, action: 'pause' | 'resume' | 'cancel') => {
    updateSubscriptionMutation.mutate({ id, action });
  };

  if (subscriptionsLoading || templatesLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subscriptions = subscriptionsData?.subscriptions || [];
  const templates = templatesData?.templates || [];

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4">
                SPIRAL Subscriptions
              </h1>
              <p className="text-gray-600 text-lg">
                Never run out of your local favorites. Save money and earn bonus SPIRAL points.
              </p>
            </div>
            <Link href="/spiral-centers-subscription-demo">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View SPIRAL Centers Integration
              </Button>
            </Link>
          </div>
        </div>

        {/* Benefits Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--spiral-navy)]">Save 5-15%</div>
                  <div className="text-sm text-gray-600">On every delivery</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--spiral-navy)]">Bonus SPIRAL Points</div>
                  <div className="text-sm text-gray-600">1.5-2.0x multiplier</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--spiral-navy)]">Never Run Out</div>
                  <div className="text-sm text-gray-600">Automatic delivery</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--spiral-navy)]">Support Local</div>
                  <div className="text-sm text-gray-600">Consistent community support</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-subscriptions">My Subscriptions ({subscriptions.length})</TabsTrigger>
            <TabsTrigger value="browse">Browse Popular</TabsTrigger>
          </TabsList>

          {/* My Subscriptions Tab */}
          <TabsContent value="my-subscriptions" className="mt-6">
            {subscriptions.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--spiral-navy)] mb-2">
                    No Subscriptions Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start saving with local business subscriptions and earn bonus SPIRAL points.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('browse')}
                    className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90"
                  >
                    Browse Popular Subscriptions
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((subscription: Subscription) => (
                  <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getFrequencyIcon(subscription.frequency)}
                          <CardTitle className="text-lg">{subscription.title}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <CardDescription>{subscription.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Next Delivery:</span>
                        <span className="font-semibold">{subscription.nextDeliveryFormatted}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total:</span>
                        <span className="font-semibold text-lg">${subscription.totalPrice}</span>
                      </div>
                      
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        {subscription.savings}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-[var(--spiral-navy)]">
                          Items ({subscription.items.length}):
                        </div>
                        <div className="space-y-1">
                          {subscription.items.slice(0, 3).map((item: SubscriptionItem) => (
                            <div key={item.id} className="text-xs text-gray-600 flex justify-between">
                              <span>{item.quantity}x {item.productName}</span>
                              <span>${item.price}</span>
                            </div>
                          ))}
                          {subscription.items.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{subscription.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        {subscription.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubscriptionAction(subscription.id, 'pause')}
                            className="flex-1"
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        {subscription.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubscriptionAction(subscription.id, 'resume')}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resume
                          </Button>
                        )}
                        {subscription.status !== 'cancelled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Browse Popular Tab */}
          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template: PopularTemplate) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {getFrequencyIcon(template.frequency)}
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Estimated Price:</span>
                      <span className="font-semibold">{template.estimatedPrice}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm bg-green-50 text-green-600 p-2 rounded">
                        {template.discount}
                      </div>
                      <div className="text-sm bg-blue-50 text-blue-600 p-2 rounded">
                        {template.spiralBonus}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[var(--spiral-navy)]">
                        Includes:
                      </div>
                      <ul className="space-y-1">
                        {template.items.map((item, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[var(--spiral-navy)]">
                        Partner Stores:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.stores.map((store, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {store}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90"
                      onClick={() => {
                        toast({
                          title: "Coming Soon!",
                          description: "Subscription setup will be available soon. We'll notify you when it's ready!",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Subscription
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}