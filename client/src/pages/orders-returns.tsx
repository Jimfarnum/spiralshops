import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, RefreshCw, Upload, CreditCard, Gift } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

// Return request form schema
const returnRequestSchema = z.object({
  orderId: z.string().min(1, "Please select an order"),
  productId: z.string().min(1, "Please select a product"),
  productName: z.string().min(1),
  originalAmount: z.number().min(0),
  reason: z.string().min(10, "Please provide a detailed reason (at least 10 characters)"),
  refundType: z.enum(['original', 'spiral_credit'], {
    required_error: "Please select a refund method"
  }),
  imageUrl: z.string().optional()
});

type ReturnRequestForm = z.infer<typeof returnRequestSchema>;

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    productId: string;
  }>;
}

interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  originalAmount: number;
  reason: string;
  refundType: string;
  status: string;
  imageUrl?: string;
  submittedAt: string;
  decisionAt?: string;
  decisionNote?: string;
  autoApproved: boolean;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-blue-100 text-blue-800'
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  refunded: Gift
};

export default function OrdersReturns() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showReturnForm, setShowReturnForm] = useState(false);

  // Mock user ID for demo - in real app, get from auth
  const userId = user?.id || "1";

  const form = useForm<ReturnRequestForm>({
    resolver: zodResolver(returnRequestSchema),
    defaultValues: {
      refundType: 'original'
    }
  });

  // Fetch eligible orders for return
  const { data: eligibleOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/returns/eligible-orders', userId],
    queryFn: async () => {
      const response = await fetch(`/api/returns/eligible-orders?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch eligible orders");
      return response.json() as Promise<Order[]>;
    },
    enabled: !!userId
  });

  // Fetch user's return history
  const { data: returnHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/returns/status', userId],
    queryFn: async () => {
      const response = await fetch(`/api/returns/status?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch return history");
      return response.json() as Promise<ReturnRequest[]>;
    },
    enabled: !!userId
  });

  // Submit return request
  const submitReturnMutation = useMutation({
    mutationFn: async (data: ReturnRequestForm) => {
      const response = await fetch('/api/returns/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit return request");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Return Request Submitted",
        description: "Your return request has been submitted successfully. You'll receive an update soon.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/returns/status'] });
      setShowReturnForm(false);
      form.reset();
      setSelectedOrder(null);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleOrderSelect = (orderId: string) => {
    const order = eligibleOrders?.find(o => o.id === orderId);
    setSelectedOrder(order || null);
    setSelectedProduct(null);
    form.setValue('orderId', orderId);
  };

  const handleProductSelect = (productId: string) => {
    if (!selectedOrder) return;
    
    const product = selectedOrder.items.find(item => item.productId === productId);
    setSelectedProduct(product || null);
    
    if (product) {
      form.setValue('productId', productId);
      form.setValue('productName', product.name);
      form.setValue('originalAmount', product.price);
    }
  };

  const onSubmit = (data: ReturnRequestForm) => {
    submitReturnMutation.mutate(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your orders and manage returns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/api/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
                <p className="text-gray-600">Request returns and track refund status</p>
              </div>
            </div>
            
            <Dialog open={showReturnForm} onOpenChange={setShowReturnForm}>
              <DialogTrigger asChild>
                <Button className="bg-[#006d77] hover:bg-[#004d55] text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Request Return
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Request Product Return</DialogTitle>
                  <DialogDescription>
                    Select an eligible order and product to start your return request.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Order Selection */}
                    <FormField
                      control={form.control}
                      name="orderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Order (within 30 days)</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            handleOrderSelect(value);
                          }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose an eligible order" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eligibleOrders?.map((order) => (
                                <SelectItem key={order.id} value={order.id}>
                                  Order #{order.id} - {formatDate(order.createdAt)} ({formatCurrency(order.totalAmount)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Product Selection */}
                    {selectedOrder && (
                      <FormField
                        control={form.control}
                        name="productId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Product to Return</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              handleProductSelect(value);
                            }}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a product from this order" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedOrder.items.map((item) => (
                                  <SelectItem key={item.productId} value={item.productId}>
                                    {item.name} - {formatCurrency(item.price)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Return Reason */}
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Return</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please explain why you're returning this item (damaged, wrong size, not as described, etc.)"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide as much detail as possible to help us process your return quickly.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Refund Method */}
                    <FormField
                      control={form.control}
                      name="refundType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Refund Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="original">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Original Payment Method
                                </div>
                              </SelectItem>
                              <SelectItem value="spiral_credit">
                                <div className="flex items-center gap-2">
                                  <Gift className="h-4 w-4" />
                                  SPIRAL Credit (+20% bonus value)
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            SPIRAL Credit gives you 20% more value to use at any participating store!
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Optional Photo Upload */}
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo (Optional)</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                Upload a photo if the item is damaged or incorrect
                              </p>
                              <Input
                                type="url"
                                placeholder="Or paste image URL here..."
                                className="mt-2"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Photos help us process returns faster, especially for damaged items.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReturnForm(false)}
                        disabled={submitReturnMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitReturnMutation.isPending}
                        className="bg-[#006d77] hover:bg-[#004d55] text-white"
                      >
                        {submitReturnMutation.isPending ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Return Request'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Return History</TabsTrigger>
            <TabsTrigger value="eligible">Eligible Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Return Requests</h2>
                <p className="text-gray-600">Track the status of your return and refund requests</p>
              </div>
            </div>

            {historyLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : returnHistory && returnHistory.length > 0 ? (
              <div className="grid gap-4">
                {returnHistory.map((returnRequest) => {
                  const StatusIcon = statusIcons[returnRequest.status as keyof typeof statusIcons];
                  return (
                    <Card key={returnRequest.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{returnRequest.productName}</h3>
                              <Badge className={statusColors[returnRequest.status as keyof typeof statusColors]}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {returnRequest.status.charAt(0).toUpperCase() + returnRequest.status.slice(1)}
                              </Badge>
                              {returnRequest.autoApproved && (
                                <Badge variant="secondary">Auto-Approved</Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Order ID</p>
                                <p className="font-medium">#{returnRequest.orderId}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Amount</p>
                                <p className="font-medium">{formatCurrency(returnRequest.originalAmount)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Refund Method</p>
                                <p className="font-medium">
                                  {returnRequest.refundType === 'original' ? 'Original Payment' : 'SPIRAL Credit'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Submitted</p>
                                <p className="font-medium">{formatDate(returnRequest.submittedAt)}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-gray-600 text-sm">Reason:</p>
                              <p className="text-sm bg-gray-50 p-3 rounded">{returnRequest.reason}</p>
                            </div>

                            {returnRequest.decisionNote && (
                              <div className="space-y-2">
                                <p className="text-gray-600 text-sm">Admin Response:</p>
                                <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                  {returnRequest.decisionNote}
                                </p>
                              </div>
                            )}

                            {returnRequest.imageUrl && (
                              <div className="space-y-2">
                                <p className="text-gray-600 text-sm">Attached Photo:</p>
                                <img
                                  src={returnRequest.imageUrl}
                                  alt="Return request photo"
                                  className="max-w-xs rounded-lg border"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Return Requests</h3>
                  <p className="text-gray-600 mb-6">You haven't submitted any return requests yet.</p>
                  <Button
                    onClick={() => setShowReturnForm(true)}
                    className="bg-[#006d77] hover:bg-[#004d55] text-white"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Request Your First Return
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="eligible" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Eligible for Return</h2>
                <p className="text-gray-600">Orders from the past 30 days that can be returned</p>
              </div>
            </div>

            {ordersLoading ? (
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : eligibleOrders && eligibleOrders.length > 0 ? (
              <div className="grid gap-4">
                {eligibleOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                            <Badge variant="outline">
                              {formatDate(order.createdAt)}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800">
                              Eligible for Return
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p>Total: <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span></p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-gray-600 text-sm font-medium">Items in this order:</p>
                            <div className="grid gap-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Product ID: {item.productId}</p>
                                  </div>
                                  <p className="font-semibold">{formatCurrency(item.price)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            setSelectedOrder(order);
                            form.setValue('orderId', order.id);
                            setShowReturnForm(true);
                          }}
                          className="bg-[#006d77] hover:bg-[#004d55] text-white"
                        >
                          Return Item
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Eligible Orders</h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any recent orders eligible for return. Orders can be returned within 30 days of purchase.
                  </p>
                  <Link href="/products">
                    <Button className="bg-[#006d77] hover:bg-[#004d55] text-white">
                      Shop Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}