import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, Clock, CheckCircle, XCircle, RefreshCw, CreditCard, Gift, Eye, MessageSquare, DollarSign } from "lucide-react";

// Review form schema
const reviewSchema = z.object({
  returnId: z.string().min(1),
  status: z.enum(['approved', 'rejected']),
  decisionNote: z.string().optional(),
  adminUserId: z.string().min(1)
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface ReturnRequest {
  id: string;
  userId: string;
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
  adminUserId?: string;
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

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500'
};

export default function AdminReturns() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  // Mock admin user ID - in real app, get from auth
  const adminUserId = "admin-1";

  const reviewForm = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      adminUserId
    }
  });

  // Fetch all return requests with optional status filter
  const { data: returnRequests, isLoading, refetch } = useQuery({
    queryKey: ['/api/returns/admin/all', selectedTab === 'all' ? undefined : selectedTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTab !== 'all') {
        params.append('status', selectedTab);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/returns/admin/all?${params}`);
      if (!response.ok) throw new Error("Failed to fetch return requests");
      return response.json() as Promise<ReturnRequest[]>;
    }
  });

  // Review (approve/reject) return request
  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewForm) => {
      const response = await fetch('/api/returns/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to review return request");
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Return Request Updated",
        description: `Return request has been ${variables.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/returns/admin/all'] });
      setShowReviewDialog(false);
      setSelectedReturn(null);
      reviewForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Process refund
  const refundMutation = useMutation({
    mutationFn: async ({ returnId, method }: { returnId: string; method: 'stripe' | 'spiral_credit' }) => {
      const response = await fetch('/api/returns/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnId, method })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process refund");
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Refund Processed",
        description: `Refund has been processed via ${variables.method === 'stripe' ? 'original payment method' : 'SPIRAL credit'}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/returns/admin/all'] });
      setShowRefundDialog(false);
      setSelectedReturn(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Refund Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const openReviewDialog = (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    reviewForm.reset({
      returnId: returnRequest.id,
      status: 'approved',
      adminUserId
    });
    setShowReviewDialog(true);
  };

  const openRefundDialog = (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setShowRefundDialog(true);
  };

  const onReviewSubmit = (data: ReviewForm) => {
    reviewMutation.mutate(data);
  };

  const processRefund = (method: 'stripe' | 'spiral_credit') => {
    if (!selectedReturn) return;
    refundMutation.mutate({ returnId: selectedReturn.id, method });
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriority = (returnRequest: ReturnRequest) => {
    // High priority: expensive items, old requests, or rejected previously
    if (returnRequest.originalAmount > 20000) return 'high'; // > $200
    if (returnRequest.status === 'rejected') return 'high';
    
    const daysSince = Math.floor((Date.now() - new Date(returnRequest.submittedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 7) return 'high';
    if (daysSince > 3) return 'medium';
    
    return 'low';
  };

  const getStatusCounts = () => {
    if (!returnRequests) return { all: 0, pending: 0, approved: 0, rejected: 0, refunded: 0 };
    
    return {
      all: returnRequests.length,
      pending: returnRequests.filter(r => r.status === 'pending').length,
      approved: returnRequests.filter(r => r.status === 'approved').length,
      rejected: returnRequests.filter(r => r.status === 'rejected').length,
      refunded: returnRequests.filter(r => r.status === 'refunded').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Return & Refund Management</h1>
              <p className="text-gray-600 mt-1">Review return requests and process refunds</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="secondary">
                {returnRequests?.length || 0} Total Requests
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{statusCounts.refunded}</p>
                <p className="text-sm text-gray-600">Refunded</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            <TabsTrigger value="refunded">Refunded ({statusCounts.refunded})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {isLoading ? (
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
            ) : returnRequests && returnRequests.length > 0 ? (
              <div className="grid gap-4">
                {returnRequests.map((returnRequest) => {
                  const StatusIcon = statusIcons[returnRequest.status as keyof typeof statusIcons];
                  const priority = getPriority(returnRequest);
                  
                  return (
                    <Card key={returnRequest.id} className={`border-l-4 ${priorityColors[priority]}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-semibold text-lg">{returnRequest.productName}</h3>
                              <Badge className={statusColors[returnRequest.status as keyof typeof statusColors]}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {returnRequest.status.charAt(0).toUpperCase() + returnRequest.status.slice(1)}
                              </Badge>
                              {returnRequest.autoApproved && (
                                <Badge variant="secondary">Auto-Approved</Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={priority === 'high' ? 'border-red-500 text-red-700' : 
                                          priority === 'medium' ? 'border-yellow-500 text-yellow-700' : 
                                          'border-green-500 text-green-700'}
                              >
                                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Request ID</p>
                                <p className="font-medium font-mono">#{returnRequest.id.slice(-8)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Customer ID</p>
                                <p className="font-medium">#{returnRequest.userId}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Order ID</p>
                                <p className="font-medium">#{returnRequest.orderId}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Amount</p>
                                <p className="font-medium text-green-600">{formatCurrency(returnRequest.originalAmount)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Refund Method</p>
                                <p className="font-medium">
                                  {returnRequest.refundType === 'original' ? 
                                    <span className="flex items-center gap-1">
                                      <CreditCard className="h-3 w-3" />
                                      Original Payment
                                    </span> : 
                                    <span className="flex items-center gap-1">
                                      <Gift className="h-3 w-3" />
                                      SPIRAL Credit
                                    </span>
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Submitted</p>
                                <p className="font-medium">{formatDate(returnRequest.submittedAt)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Product ID</p>
                                <p className="font-medium font-mono">{returnRequest.productId}</p>
                              </div>
                              {returnRequest.decisionAt && (
                                <div>
                                  <p className="text-gray-600">Decision Date</p>
                                  <p className="font-medium">{formatDate(returnRequest.decisionAt)}</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <p className="text-gray-600 text-sm font-medium">Customer's Reason:</p>
                              <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-gray-300">{returnRequest.reason}</p>
                            </div>

                            {returnRequest.decisionNote && (
                              <div className="space-y-2">
                                <p className="text-gray-600 text-sm font-medium">Admin Response:</p>
                                <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                  {returnRequest.decisionNote}
                                </p>
                              </div>
                            )}

                            {returnRequest.imageUrl && (
                              <div className="space-y-2">
                                <p className="text-gray-600 text-sm font-medium">Attached Photo:</p>
                                <img
                                  src={returnRequest.imageUrl}
                                  alt="Return request photo"
                                  className="max-w-xs rounded-lg border shadow-sm"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-6">
                            {returnRequest.status === 'pending' && (
                              <Button
                                onClick={() => openReviewDialog(returnRequest)}
                                className="bg-[#006d77] hover:bg-[#004d55] text-white"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            )}
                            
                            {returnRequest.status === 'approved' && (
                              <Button
                                onClick={() => openRefundDialog(returnRequest)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Process Refund
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
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
                  <p className="text-gray-600">
                    {selectedTab === 'all' ? 
                      'No return requests have been submitted yet.' : 
                      `No ${selectedTab} return requests found.`}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Return Request</DialogTitle>
              <DialogDescription>
                Review and approve or reject this return request from customer.
              </DialogDescription>
            </DialogHeader>
            
            {selectedReturn && (
              <div className="space-y-6">
                {/* Return Details Summary */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Product</p>
                      <p className="font-semibold">{selectedReturn.productName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-semibold text-green-600">{formatCurrency(selectedReturn.originalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Refund Method</p>
                      <p className="font-semibold">{selectedReturn.refundType === 'original' ? 'Original Payment' : 'SPIRAL Credit'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Submitted</p>
                      <p className="font-semibold">{formatDate(selectedReturn.submittedAt)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Customer's Reason:</p>
                    <p className="text-sm bg-white p-2 rounded border">{selectedReturn.reason}</p>
                  </div>
                </div>

                <Form {...reviewForm}>
                  <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-6">
                    {/* Decision */}
                    <FormField
                      control={reviewForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decision</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              type="button"
                              variant={field.value === 'approved' ? 'default' : 'outline'}
                              onClick={() => field.onChange('approved')}
                              className={field.value === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve Return
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 'rejected' ? 'default' : 'outline'}
                              onClick={() => field.onChange('rejected')}
                              className={field.value === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject Return
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Admin Notes */}
                    <FormField
                      control={reviewForm.control}
                      name="decisionNote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response to Customer (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide additional context or instructions for the customer..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This message will be visible to the customer in their return history.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReviewDialog(false)}
                        disabled={reviewMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={reviewMutation.isPending}
                        className="bg-[#006d77] hover:bg-[#004d55] text-white"
                      >
                        {reviewMutation.isPending ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Decision'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Refund Processing Dialog */}
        <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Refund</DialogTitle>
              <DialogDescription>
                Choose the refund method for this approved return request.
              </DialogDescription>
            </DialogHeader>
            
            {selectedReturn && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Product</p>
                      <p className="font-semibold">{selectedReturn.productName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Refund Amount</p>
                      <p className="font-semibold text-green-600">{formatCurrency(selectedReturn.originalAmount)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-600 text-sm">Customer Preference:</p>
                    <p className="font-semibold">
                      {selectedReturn.refundType === 'original' ? 'Original Payment Method' : 'SPIRAL Credit'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Select Refund Method:</h4>
                  <div className="grid gap-3">
                    <Button
                      onClick={() => processRefund('stripe')}
                      disabled={refundMutation.isPending}
                      className="justify-start h-auto p-4 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-semibold">Original Payment Method</p>
                          <p className="text-sm opacity-80">Refund to customer's original card/payment</p>
                        </div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={() => processRefund('spiral_credit')}
                      disabled={refundMutation.isPending}
                      className="justify-start h-auto p-4 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-semibold">SPIRAL Credit (+20% bonus)</p>
                          <p className="text-sm opacity-80">
                            Award {Math.floor(selectedReturn.originalAmount / 20)} SPIRAL points 
                            ({formatCurrency(selectedReturn.originalAmount + (selectedReturn.originalAmount * 0.2))} value)
                          </p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>

                {refundMutation.isPending && (
                  <div className="flex items-center justify-center p-4">
                    <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                    Processing refund...
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}