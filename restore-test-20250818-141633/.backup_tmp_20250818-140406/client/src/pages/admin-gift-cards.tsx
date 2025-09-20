import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Gift, Plus, MoreHorizontal, Edit, Ban, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const createGiftCardSchema = z.object({
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().email().optional().or(z.literal("")),
  recipientEmail: z.string().email("Valid recipient email is required"),
  amount: z.number().min(5, "Minimum amount is $5").max(1000, "Maximum amount is $1000"),
  message: z.string().optional(),
  expirationMonths: z.number().min(1).max(60).default(12),
});

type CreateGiftCardForm = z.infer<typeof createGiftCardSchema>;

interface GiftCard {
  id: number;
  code: string;
  senderName: string;
  senderEmail?: string;
  recipientEmail: string;
  amount: number;
  balance: number;
  status: string;
  message?: string;
  expirationDate: string;
  deliveryDate: string;
  createdAt: string;
  redeemedAt?: string;
}

export default function AdminGiftCards() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const form = useForm<CreateGiftCardForm>({
    resolver: zodResolver(createGiftCardSchema),
    defaultValues: {
      senderName: "",
      senderEmail: "",
      recipientEmail: "",
      amount: 25,
      message: "",
      expirationMonths: 12,
    },
  });

  // Fetch all gift cards
  const { data: giftCardsData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/gift-cards"],
    select: (response: any) => response.giftCards as GiftCard[],
  });

  // Create gift card mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateGiftCardForm) => {
      return await apiRequest("/api/admin/gift-cards/create", "POST", data);
    },
    onSuccess: (response) => {
      toast({
        title: "Gift Card Created!",
        description: `Gift card ${response.giftCard.code} has been created successfully.`,
      });
      form.reset();
      setShowCreateForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gift-cards"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create gift card",
        variant: "destructive",
      });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest(`/api/admin/gift-cards/${id}/status`, "PATCH", { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Gift card status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gift-cards"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update gift card status",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'redeemed':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'cancelled' : 'active';
    toggleStatusMutation.mutate({ id, status: newStatus });
  };

  const onSubmit = (data: CreateGiftCardForm) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Gift Cards</h1>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = giftCardsData ? {
    total: giftCardsData.length,
    active: giftCardsData.filter(card => card.status === 'active').length,
    redeemed: giftCardsData.filter(card => card.status === 'redeemed').length,
    totalValue: giftCardsData.reduce((sum, card) => sum + card.amount, 0),
    remainingBalance: giftCardsData.reduce((sum, card) => sum + card.balance, 0),
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gift Card Administration</h1>
            <p className="text-gray-600">Manage SPIRAL gift cards, create new ones, and track redemptions</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Gift Card
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-600">Total Cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.redeemed}</p>
                    <p className="text-sm text-gray-600">Redeemed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                  <p className="text-sm text-gray-600">Total Value</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.remainingBalance)}</p>
                  <p className="text-sm text-gray-600">Remaining Balance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Gift Card</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="senderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sender Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="SPIRAL Admin" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="senderEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sender Email (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="admin@spiral.com" type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="recipientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Email *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="recipient@example.com" type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min={5} 
                                max={1000}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expirationMonths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration (Months)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min={1} 
                                max={60}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Personal Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? "Creating..." : "Create Gift Card"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Gift Cards Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Gift Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giftCardsData?.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-mono text-sm">{card.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{card.senderName}</p>
                        {card.senderEmail && (
                          <p className="text-xs text-gray-500">{card.senderEmail}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{card.recipientEmail}</p>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(card.amount)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(card.balance)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(card.status)}>
                        {card.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(card.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(card.id, card.status)}
                        disabled={toggleStatusMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        {card.status === 'active' ? (
                          <>
                            <Ban className="w-3 h-3" />
                            Cancel
                          </>
                        ) : card.status === 'cancelled' ? (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            Activate
                          </>
                        ) : (
                          <>
                            <Edit className="w-3 h-3" />
                            Edit
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {!giftCardsData || giftCardsData.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Gift Cards</h3>
                <p className="text-gray-600">Create your first gift card to get started.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}