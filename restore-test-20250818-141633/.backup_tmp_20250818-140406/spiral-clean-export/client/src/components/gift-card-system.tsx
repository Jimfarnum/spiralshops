import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Gift, 
  CreditCard, 
  Mail, 
  Copy,
  Check,
  ShoppingBag,
  Store,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

interface GiftCard {
  id: number;
  code: string;
  purchasedByUserId?: number;
  recipientEmail?: string;
  recipientName?: string;
  originalAmount: string;
  currentBalance: string;
  mallId?: number;
  storeId?: number;
  personalMessage?: string;
  isActive: boolean;
  expiresAt?: string;
  purchasedAt: string;
  redeemedAt?: string;
}

export default function GiftCardSystem() {
  const [activeTab, setActiveTab] = useState('purchase');
  const [purchaseForm, setPurchaseForm] = useState({
    amount: '',
    recipientName: '',
    recipientEmail: '',
    personalMessage: '',
    giftCardType: 'all-stores', // 'all-stores', 'mall-specific', 'store-specific'
    mallId: '',
    storeId: ''
  });
  const [redeemCode, setRedeemCode] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's gift cards
  const { data: myGiftCards = [], isLoading: loadingMyCards } = useQuery({
    queryKey: ['/api/gift-cards/my-cards'],
  });

  // Fetch available stores and malls for gift card selection
  const { data: stores = [] } = useQuery({
    queryKey: ['/api/stores'],
  });

  const { data: malls = [] } = useQuery({
    queryKey: ['/api/malls'],
  });

  // Purchase gift card mutation
  const purchaseGiftCardMutation = useMutation({
    mutationFn: async (giftCardData: any) => {
      return apiRequest('/api/gift-cards/purchase', {
        method: 'POST',
        body: JSON.stringify(giftCardData),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Gift Card Purchased!",
        description: `Gift card code: ${data.code}. Email sent to ${purchaseForm.recipientEmail}`,
      });
      setPurchaseForm({
        amount: '',
        recipientName: '',
        recipientEmail: '',
        personalMessage: '',
        giftCardType: 'all-stores',
        mallId: '',
        storeId: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/gift-cards/my-cards'] });
    },
    onError: () => {
      toast({
        title: "Purchase failed",
        description: "Please check your payment information and try again.",
        variant: "destructive",
      });
    },
  });

  // Redeem gift card mutation
  const redeemGiftCardMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest(`/api/gift-cards/redeem/${code}`, {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Gift Card Redeemed!",
        description: `$${data.amount} added to your account balance.`,
      });
      setRedeemCode('');
      queryClient.invalidateQueries({ queryKey: ['/api/gift-cards/my-cards'] });
    },
    onError: (error: any) => {
      toast({
        title: "Redemption failed",
        description: error.message || "Invalid or expired gift card code.",
        variant: "destructive",
      });
    },
  });

  const handlePurchaseGiftCard = async () => {
    if (!purchaseForm.amount || !purchaseForm.recipientName || !purchaseForm.recipientEmail) {
      toast({
        title: "Please fill in all required fields",
        description: "Amount, recipient name, and email are required.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(purchaseForm.amount);
    if (amount < 5 || amount > 1000) {
      toast({
        title: "Invalid amount",
        description: "Gift card amount must be between $5 and $1,000.",
        variant: "destructive",
      });
      return;
    }

    const giftCardData = {
      originalAmount: amount,
      currentBalance: amount,
      recipientName: purchaseForm.recipientName,
      recipientEmail: purchaseForm.recipientEmail,
      personalMessage: purchaseForm.personalMessage,
      mallId: purchaseForm.giftCardType === 'mall-specific' ? parseInt(purchaseForm.mallId) : null,
      storeId: purchaseForm.giftCardType === 'store-specific' ? parseInt(purchaseForm.storeId) : null,
      purchasedByUserId: 1, // Mock user ID - would come from auth
    };

    purchaseGiftCardMutation.mutate(giftCardData);
  };

  const handleRedeemGiftCard = () => {
    if (!redeemCode.trim()) {
      toast({
        title: "Please enter a gift card code",
        variant: "destructive",
      });
      return;
    }
    redeemGiftCardMutation.mutate(redeemCode.trim().toUpperCase());
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Code copied to clipboard!",
      });
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const getGiftCardTypeDisplay = (giftCard: GiftCard) => {
    if (giftCard.storeId) return "Store-Specific";
    if (giftCard.mallId) return "Mall-Specific";
    return "All SPIRAL Stores";
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4 flex items-center gap-3">
            <Gift className="h-8 w-8 text-[var(--spiral-coral)]" />
            SPIRAL Gift Cards
          </h1>
          <p className="text-gray-600 text-lg">
            Give the gift of local shopping with SPIRAL gift cards
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchase">Purchase Gift Cards</TabsTrigger>
            <TabsTrigger value="redeem">Redeem Gift Cards</TabsTrigger>
            <TabsTrigger value="my-cards">My Gift Cards</TabsTrigger>
          </TabsList>

          {/* Purchase Gift Cards */}
          <TabsContent value="purchase" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Purchase Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Purchase a Gift Card</CardTitle>
                  <CardDescription>
                    Perfect for birthdays, holidays, or any special occasion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Gift Card Type */}
                  <div>
                    <Label htmlFor="giftCardType">Gift Card Type</Label>
                    <Select 
                      value={purchaseForm.giftCardType} 
                      onValueChange={(value) => setPurchaseForm(prev => ({ ...prev, giftCardType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gift card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-stores">All SPIRAL Stores</SelectItem>
                        <SelectItem value="mall-specific">Specific Mall</SelectItem>
                        <SelectItem value="store-specific">Specific Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mall Selection */}
                  {purchaseForm.giftCardType === 'mall-specific' && (
                    <div>
                      <Label htmlFor="mallId">Select Mall</Label>
                      <Select 
                        value={purchaseForm.mallId} 
                        onValueChange={(value) => setPurchaseForm(prev => ({ ...prev, mallId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a mall" />
                        </SelectTrigger>
                        <SelectContent>
                          {malls.map((mall: any) => (
                            <SelectItem key={mall.id} value={mall.id.toString()}>
                              {mall.name} - {mall.city}, {mall.state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Store Selection */}
                  {purchaseForm.giftCardType === 'store-specific' && (
                    <div>
                      <Label htmlFor="storeId">Select Store</Label>
                      <Select 
                        value={purchaseForm.storeId} 
                        onValueChange={(value) => setPurchaseForm(prev => ({ ...prev, storeId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a store" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store: any) => (
                            <SelectItem key={store.id} value={store.id.toString()}>
                              {store.name} - {store.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <Label htmlFor="amount">Amount ($5 - $1,000) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        min="5"
                        max="1000"
                        value={purchaseForm.amount}
                        onChange={(e) => setPurchaseForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="25.00"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div>
                    <Label htmlFor="recipientName">Recipient Name *</Label>
                    <Input
                      id="recipientName"
                      value={purchaseForm.recipientName}
                      onChange={(e) => setPurchaseForm(prev => ({ ...prev, recipientName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipientEmail">Recipient Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={purchaseForm.recipientEmail}
                        onChange={(e) => setPurchaseForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                        placeholder="john@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div>
                    <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
                    <Textarea
                      id="personalMessage"
                      value={purchaseForm.personalMessage}
                      onChange={(e) => setPurchaseForm(prev => ({ ...prev, personalMessage: e.target.value }))}
                      placeholder="Happy Birthday! Enjoy shopping local..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handlePurchaseGiftCard}
                    disabled={purchaseGiftCardMutation.isPending}
                    className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                  >
                    {purchaseGiftCardMutation.isPending ? 'Processing...' : `Purchase Gift Card`}
                  </Button>
                </CardContent>
              </Card>

              {/* Gift Card Preview */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-navy)] text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">SPIRAL Gift Card</h3>
                        <p className="text-white/80">
                          {getGiftCardTypeDisplay({
                            storeId: purchaseForm.giftCardType === 'store-specific' ? 1 : undefined,
                            mallId: purchaseForm.giftCardType === 'mall-specific' ? 1 : undefined,
                          } as GiftCard)}
                        </p>
                      </div>
                      <Gift className="h-12 w-12 text-white/80" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">
                        ${purchaseForm.amount || '25.00'}
                      </div>
                      <div className="text-sm text-white/80">
                        Valid at participating SPIRAL locations
                      </div>
                    </div>
                    
                    {purchaseForm.recipientName && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm">For: {purchaseForm.recipientName}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Gift Card Types Info */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Gift Card Options</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <ShoppingBag className="h-4 w-4 mt-0.5 text-[var(--spiral-coral)]" />
                        <div>
                          <div className="font-medium">All SPIRAL Stores</div>
                          <div className="text-gray-600">Use at any participating store nationwide</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-0.5 text-[var(--spiral-coral)]" />
                        <div>
                          <div className="font-medium">Mall-Specific</div>
                          <div className="text-gray-600">Use at any store within a specific mall</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Store className="h-4 w-4 mt-0.5 text-[var(--spiral-coral)]" />
                        <div>
                          <div className="font-medium">Store-Specific</div>
                          <div className="text-gray-600">Use at one particular store location</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Redeem Gift Cards */}
          <TabsContent value="redeem" className="mt-6">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Redeem Gift Card</CardTitle>
                <CardDescription>
                  Enter your gift card code to add funds to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="redeemCode">Gift Card Code</Label>
                  <Input
                    id="redeemCode"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    placeholder="SPIRAL-XXXX-XXXX"
                    className="font-mono text-center"
                  />
                </div>
                
                <Button 
                  onClick={handleRedeemGiftCard}
                  disabled={redeemGiftCardMutation.isPending}
                  className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                >
                  {redeemGiftCardMutation.isPending ? 'Redeeming...' : 'Redeem Gift Card'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Gift Cards */}
          <TabsContent value="my-cards" className="mt-6">
            {loadingMyCards ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myGiftCards.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gift Cards Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't purchased any gift cards yet. Get started by purchasing your first gift card!
                  </p>
                  <Button 
                    onClick={() => setActiveTab('purchase')}
                    className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                  >
                    Purchase Gift Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myGiftCards.map((giftCard: GiftCard) => (
                  <Card key={giftCard.id} className={`${giftCard.currentBalance === '0.00' ? 'opacity-60' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-[var(--spiral-navy)]">
                            SPIRAL Gift Card
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getGiftCardTypeDisplay(giftCard)}
                          </p>
                        </div>
                        <Badge variant={giftCard.isActive ? 'default' : 'secondary'}>
                          {giftCard.currentBalance === '0.00' ? 'Used' : 'Active'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Balance:</span>
                          <span className="font-semibold text-xl">
                            ${parseFloat(giftCard.currentBalance).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Code:</span>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {giftCard.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(giftCard.code)}
                              className="p-1 h-8 w-8"
                            >
                              {copiedCode === giftCard.code ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Purchased:</span>
                          <span>{new Date(giftCard.purchasedAt).toLocaleDateString()}</span>
                        </div>
                        
                        {giftCard.expiresAt && (
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Expires:</span>
                            <span>{new Date(giftCard.expiresAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {giftCard.recipientName && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-gray-600">
                              Gift for: <span className="font-medium">{giftCard.recipientName}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}