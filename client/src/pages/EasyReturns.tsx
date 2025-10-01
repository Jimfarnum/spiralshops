import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Package, RefreshCw, CheckCircle, Clock, CreditCard, Gift, Zap, Star } from 'lucide-react';
import { Link } from 'wouter';

interface QuickReason {
  id: string;
  title: string;
  description: string;
  autoApprove: boolean;
  refundType: string;
  icon: string;
}

interface MockOrder {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    status: string;
  }>;
  total: number;
  canReturn: boolean;
}

export default function EasyReturns() {
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedReason, setSelectedReason] = useState<QuickReason | null>(null);
  const [showReturnFlow, setShowReturnFlow] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID
  const userId = '1';

  // Load quick return reasons
  const { data: quickReasons, isLoading: reasonsLoading } = useQuery({
    queryKey: ['/api/returns/quick-reasons'],
    queryFn: async () => {
      const response = await fetch('/api/returns/quick-reasons');
      if (!response.ok) throw new Error('Failed to load return reasons');
      const data = await response.json();
      return data.reasons || [];
    }
  });

  // Mock recent orders that can be returned
  const mockOrders: MockOrder[] = [
    {
      id: 'order_123',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      items: [
        {
          id: 'item_1',
          name: 'Wireless Bluetooth Headphones',
          price: 89.99,
          image: '/api/placeholder/300/300',
          status: 'delivered'
        },
        {
          id: 'item_2', 
          name: 'USB-C Charging Cable',
          price: 19.99,
          image: '/api/placeholder/300/300',
          status: 'delivered'
        }
      ],
      total: 109.98,
      canReturn: true
    },
    {
      id: 'order_456',
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      items: [
        {
          id: 'item_3',
          name: 'Summer Fashion Dress',
          price: 79.99,
          image: '/api/placeholder/300/300',
          status: 'delivered'
        }
      ],
      total: 79.99,
      canReturn: true
    }
  ];

  // One-click return mutation
  const oneClickReturnMutation = useMutation({
    mutationFn: async ({ orderId, productId, reason }: { orderId: string; productId: string; reason: string }) => {
      const response = await fetch('/api/returns/one-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          orderId,
          productId,
          reason
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Return failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.autoApproved ? "Return Approved Instantly! 🎉" : "Return Submitted ✅",
        description: data.message,
      });
      
      setShowReturnFlow(false);
      setSelectedOrder(null);
      setSelectedItem(null);
      setSelectedReason(null);
      
      // Refresh orders data
      queryClient.invalidateQueries({ queryKey: ['/api/returns/status'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Return Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleItemReturn = (order: MockOrder, item: any) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setShowReturnFlow(true);
  };

  const handleReasonSelect = (reason: QuickReason) => {
    setSelectedReason(reason);
    
    if (selectedOrder && selectedItem) {
      oneClickReturnMutation.mutate({
        orderId: selectedOrder.id,
        productId: selectedItem.id,
        reason: reason.id
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/orders-returns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Easy Returns</h1>
              <p className="text-gray-600">Return items in just a few clicks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Return Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold text-lg">Instant Approval</h3>
              <p className="text-sm text-gray-600">Most returns approved in under 30 seconds</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold text-lg">Easy Process</h3>
              <p className="text-sm text-gray-600">No printing labels or complex forms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="h-8 w-8 mx-auto mb-2 text-teal-500" />
              <h3 className="font-semibold text-lg">Flexible Refunds</h3>
              <p className="text-sm text-gray-600">Original payment or SPIRAL credit (+20% bonus)</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders - Available for Return</CardTitle>
            <CardDescription>
              Items from the past 30 days that can be returned
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Ordered on {order.date} • Total: ${order.total.toFixed(2)}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Eligible for Return</Badge>
                </div>
                
                <div className="grid gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                        <Badge variant="outline" className="mt-1">
                          {item.status === 'delivered' ? 'Delivered' : item.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleItemReturn(order, item)}
                          disabled={oneClickReturnMutation.isPending}
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Return This Item
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Return Flow Modal */}
        <Dialog open={showReturnFlow} onOpenChange={setShowReturnFlow}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Return Item - Quick & Easy</DialogTitle>
              <DialogDescription>
                {selectedItem && `Returning: ${selectedItem.name}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Why are you returning this item?</h3>
                <p className="text-sm text-gray-600">Select the reason that best describes your situation</p>
              </div>

              {reasonsLoading ? (
                <div className="grid gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3">
                  {quickReasons?.map((reason: QuickReason) => (
                    <Button
                      key={reason.id}
                      variant="outline"
                      onClick={() => handleReasonSelect(reason)}
                      disabled={oneClickReturnMutation.isPending}
                      className="h-auto p-4 text-left justify-start hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <span className="text-2xl">{reason.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{reason.title}</p>
                            {reason.autoApprove && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                Instant Approval
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{reason.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {reason.refundType === 'original' ? (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <CreditCard className="h-3 w-3" />
                                Refund to original payment
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Gift className="h-3 w-3" />
                                SPIRAL credit (+20% bonus)
                              </div>
                            )}
                          </div>
                        </div>
                        {oneClickReturnMutation.isPending ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                        ) : (
                          <div className="text-gray-400">→</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Fast & Flexible Returns</p>
                    <p className="text-sm text-blue-700 mt-1">
                      • No need to package or print labels<br/>
                      • Most returns approved instantly<br/>
                      • Get refunds in 1-3 business days or instant SPIRAL credit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}