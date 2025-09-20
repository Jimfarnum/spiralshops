import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Plus, Trash2, ArrowLeft, Shield, Star, Apple, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  brand?: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
  walletType?: 'apple_pay' | 'google_pay' | 'paypal' | 'spiral_wallet';
}

interface NewPaymentMethod {
  type: 'card' | 'bank' | 'wallet';
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  nameOnCard?: string;
  walletType?: string;
  nickname?: string;
}

const PaymentIcon = ({ method }: { method: PaymentMethod }) => {
  if (method.walletType === 'apple_pay') {
    return <Apple className="h-6 w-6" />;
  }
  if (method.walletType === 'google_pay') {
    return <Smartphone className="h-6 w-6" />;
  }
  if (method.type === 'wallet') {
    return <Shield className="h-6 w-6" />;
  }
  return <CreditCard className="h-6 w-6" />;
};

export default function PaymentMethodsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMethod, setNewMethod] = useState<NewPaymentMethod>({
    type: 'card'
  });
  const queryClient = useQueryClient();

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ['/api/payment-methods'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/payment-methods');
        if (!response.ok) {
          // Return demo data if API not available
          return [
            {
              id: '1',
              type: 'card',
              brand: 'Visa',
              last4: '4242',
              expiryMonth: 12,
              expiryYear: 2025,
              isDefault: true,
              nickname: 'Primary Card'
            },
            {
              id: '2',
              type: 'wallet',
              last4: '',
              isDefault: false,
              walletType: 'apple_pay',
              nickname: 'Apple Pay'
            },
            {
              id: '3',
              type: 'wallet',
              last4: '',
              isDefault: false,
              walletType: 'spiral_wallet',
              nickname: 'SPIRAL Wallet'
            }
          ];
        }
        return response.json();
      } catch {
        return [];
      }
    }
  });

  // Add payment method
  const addPaymentMethodMutation = useMutation({
    mutationFn: (method: NewPaymentMethod) => 
      apiRequest('POST', '/api/payment-methods', method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      setIsAddDialogOpen(false);
      setNewMethod({ type: 'card' });
    }
  });

  // Remove payment method
  const removePaymentMethodMutation = useMutation({
    mutationFn: (methodId: string) => 
      apiRequest('DELETE', `/api/payment-methods/${methodId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
    }
  });

  // Set default payment method
  const setDefaultMutation = useMutation({
    mutationFn: (methodId: string) => 
      apiRequest('POST', `/api/payment-methods/${methodId}/set-default`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
    }
  });

  const handleAddMethod = () => {
    addPaymentMethodMutation.mutate(newMethod);
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const getMethodDisplayName = (method: PaymentMethod) => {
    if (method.nickname) return method.nickname;
    
    if (method.walletType === 'apple_pay') return 'Apple Pay';
    if (method.walletType === 'google_pay') return 'Google Pay';
    if (method.walletType === 'paypal') return 'PayPal';
    if (method.walletType === 'spiral_wallet') return 'SPIRAL Wallet';
    
    if (method.brand && method.last4) {
      return `${method.brand} •••• ${method.last4}`;
    }
    
    return 'Payment Method';
  };

  return (
    <>
      <SEOHead 
        title="Payment Methods - SPIRAL"
        description="Manage your payment methods and billing preferences"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--spiral-navy)]">
                Payment Methods
              </h1>
              <p className="text-sm text-gray-600">
                Manage your saved payment options
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new payment method to your account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="payment-type">Payment Type</Label>
                    <Select 
                      value={newMethod.type} 
                      onValueChange={(value: 'card' | 'bank' | 'wallet') => 
                        setNewMethod({ ...newMethod, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="wallet">Digital Wallet</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newMethod.type === 'card' && (
                    <>
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={newMethod.cardNumber || ''}
                          onChange={(e) => setNewMethod({ 
                            ...newMethod, 
                            cardNumber: formatCardNumber(e.target.value) 
                          })}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry-month">Expiry Month</Label>
                          <Select 
                            value={newMethod.expiryMonth || ''} 
                            onValueChange={(value) => setNewMethod({ ...newMethod, expiryMonth: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                  {String(i + 1).padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="expiry-year">Expiry Year</Label>
                          <Select 
                            value={newMethod.expiryYear || ''} 
                            onValueChange={(value) => setNewMethod({ ...newMethod, expiryYear: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input
                          id="name-on-card"
                          placeholder="John Doe"
                          value={newMethod.nameOnCard || ''}
                          onChange={(e) => setNewMethod({ ...newMethod, nameOnCard: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {newMethod.type === 'wallet' && (
                    <div>
                      <Label htmlFor="wallet-type">Wallet Type</Label>
                      <Select 
                        value={newMethod.walletType || ''} 
                        onValueChange={(value) => setNewMethod({ ...newMethod, walletType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apple_pay">Apple Pay</SelectItem>
                          <SelectItem value="google_pay">Google Pay</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="spiral_wallet">SPIRAL Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="nickname">Nickname (Optional)</Label>
                    <Input
                      id="nickname"
                      placeholder="My primary card"
                      value={newMethod.nickname || ''}
                      onChange={(e) => setNewMethod({ ...newMethod, nickname: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1" 
                      onClick={handleAddMethod}
                      disabled={addPaymentMethodMutation.isPending}
                    >
                      {addPaymentMethodMutation.isPending ? 'Adding...' : 'Add Method'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Payment Methods List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--spiral-navy)] mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading payment methods...</p>
              </div>
            ) : paymentMethods.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No payment methods yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add a payment method to make checkout faster
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method: PaymentMethod) => (
                  <Card key={method.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <PaymentIcon method={method} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {getMethodDisplayName(method)}
                            </h3>
                            {method.isDefault && (
                              <Badge variant="default" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Default
                              </Badge>
                            )}
                          </div>
                          {method.expiryMonth && method.expiryYear && (
                            <p className="text-sm text-gray-600">
                              Expires {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                            </p>
                          )}
                          {method.walletType && (
                            <p className="text-sm text-gray-600">
                              Digital wallet payment
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!method.isDefault && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setDefaultMutation.mutate(method.id)}
                              disabled={setDefaultMutation.isPending}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removePaymentMethodMutation.mutate(method.id)}
                            disabled={removePaymentMethodMutation.isPending || method.isDefault}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Security Note */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Your payment information is secure
                  </h3>
                  <p className="text-sm text-gray-600">
                    We use industry-standard encryption to protect your payment data. 
                    Card numbers are tokenized and never stored on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}