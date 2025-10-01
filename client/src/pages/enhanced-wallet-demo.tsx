import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, CreditCard, Gift, History, TrendingUp, Star, Send, ArrowUpDown } from 'lucide-react';

interface WalletData {
  userId: string;
  spiralBalance: number;
  giftCardBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  loyaltyTier: string;
  recentTransactions: Transaction[];
  giftCards: GiftCard[];
}

interface Transaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  source: string;
  description: string;
  date: string;
  storeName?: string;
}

interface GiftCard {
  id: string;
  balance: number;
  originalAmount: number;
  storeName: string;
  expiresAt: string;
  code: string;
}

export default function EnhancedWalletDemo() {
  const [selectedUserId, setSelectedUserId] = useState('user123');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardAmount, setGiftCardAmount] = useState('');

  const queryClient = useQueryClient();

  // Wallet data query
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: [`/api/wallet/${selectedUserId}`],
  });

  // Transaction history query
  const { data: transactionHistory } = useQuery({
    queryKey: [`/api/wallet/${selectedUserId}/transactions`],
  });

  // Loyalty tier query
  const { data: loyaltyTier } = useQuery({
    queryKey: [`/api/wallet/${selectedUserId}/loyalty-tier`],
  });

  // Add gift card mutation
  const addGiftCardMutation = useMutation({
    mutationFn: async (data: { userId: string; giftCardCode: string; amount: number }) => {
      const response = await fetch('/api/wallet/add-gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wallet/${selectedUserId}`] });
      setGiftCardCode('');
      setGiftCardAmount('');
    },
  });

  // Transfer SPIRALs mutation
  const transferMutation = useMutation({
    mutationFn: async (data: { fromUserId: string; toUserId: string; amount: number; message: string }) => {
      const response = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wallet/${selectedUserId}`] });
      setTransferAmount('');
      setTransferRecipient('');
    },
  });

  // Purchase with wallet mutation
  const purchaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/wallet/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wallet/${selectedUserId}`] });
    },
  });

  const handleAddGiftCard = () => {
    if (giftCardCode && giftCardAmount) {
      addGiftCardMutation.mutate({
        userId: selectedUserId,
        giftCardCode,
        amount: parseFloat(giftCardAmount),
      });
    }
  };

  const handleTransfer = () => {
    if (transferAmount && transferRecipient) {
      transferMutation.mutate({
        fromUserId: selectedUserId,
        toUserId: transferRecipient,
        amount: parseInt(transferAmount),
        message: 'SPIRAL transfer',
      });
    }
  };

  const handlePurchase = (spiralAmount: number, giftCardAmount: number) => {
    purchaseMutation.mutate({
      userId: selectedUserId,
      amount: 50,
      spiralAmount,
      giftCardAmount,
      description: 'Demo purchase',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Wallet className="inline-block w-10 h-10 text-purple-600 mr-3" />
            Enhanced SPIRAL Wallet
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive wallet system with SPIRALs, gift cards, loyalty tiers, and seamless payment integration
          </p>
        </div>

        {/* User Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demo User Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user123">Demo User (Gold Tier)</SelectItem>
                <SelectItem value="user456">Test User (Silver Tier)</SelectItem>
                <SelectItem value="user789">Sample User (Bronze Tier)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Wallet Overview */}
        {walletData && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  SPIRAL Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {walletData.spiralBalance.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">SPIRALs available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Gift className="w-5 h-5 text-green-500 mr-2" />
                  Gift Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${walletData.giftCardBalance.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Available balance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                  Total Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {walletData.totalEarned.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Lifetime SPIRALs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="w-5 h-5 text-amber-500 mr-2" />
                  Loyalty Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {walletData.loyaltyTier}
                </div>
                <p className="text-sm text-gray-600">Current status</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Wallet Actions */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {walletData?.recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.storeName} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`font-bold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'earn' ? '+' : '-'}{Math.abs(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wallet Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Free Shipping</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Early Access</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bonus Multiplier</span>
                      <Badge>1.5x</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Birthday Bonus</span>
                      <Badge variant="outline">100 SPIRALs</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gift-cards">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Gift Card</CardTitle>
                  <CardDescription>Redeem a gift card to add funds to your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Gift card code"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                  />
                  <Input
                    placeholder="Amount"
                    type="number"
                    value={giftCardAmount}
                    onChange={(e) => setGiftCardAmount(e.target.value)}
                  />
                  <Button onClick={handleAddGiftCard} disabled={addGiftCardMutation.isPending}>
                    {addGiftCardMutation.isPending ? 'Adding...' : 'Redeem Gift Card'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Gift Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {walletData?.giftCards.map((card) => (
                      <div key={card.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{card.storeName}</p>
                            <p className="text-sm text-gray-600">Expires: {card.expiresAt}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${card.balance.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">of ${card.originalAmount.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Code: {card.code}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transfer">
            <Card>
              <CardHeader>
                <CardTitle>Transfer SPIRALs</CardTitle>
                <CardDescription>Send SPIRALs to friends and family</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Recipient user ID"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                  />
                  <Input
                    placeholder="Amount to transfer"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleTransfer} disabled={transferMutation.isPending}>
                  <Send className="w-4 h-4 mr-2" />
                  {transferMutation.isPending ? 'Transferring...' : 'Send SPIRALs'}
                </Button>
                <p className="text-sm text-gray-600">
                  Transfer fee: 2% • Minimum transfer: 10 SPIRALs
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchase">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Demo</CardTitle>
                <CardDescription>Test wallet payment functionality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Demo Purchase: $50.00</h4>
                  <p className="text-sm text-gray-600 mb-4">Test product for wallet payment integration</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => handlePurchase(50, 0)}
                      disabled={purchaseMutation.isPending}
                    >
                      Pay with SPIRALs (50)
                    </Button>
                    <Button
                      onClick={() => handlePurchase(0, 50)}
                      disabled={purchaseMutation.isPending}
                    >
                      Pay with Gift Card ($50)
                    </Button>
                    <Button
                      onClick={() => handlePurchase(25, 25)}
                      disabled={purchaseMutation.isPending}
                    >
                      Mixed Payment
                    </Button>
                  </div>
                </div>
                
                {purchaseMutation.data && (
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium text-green-800">Purchase Successful!</h4>
                    <p className="text-sm text-green-600">
                      Earned {purchaseMutation.data.spiralsEarned} SPIRALs from this purchase
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty">
            {loyaltyTier && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Loyalty Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Current Tier: {loyaltyTier.currentTier}</span>
                          <span>{loyaltyTier.currentPoints} points</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${loyaltyTier.nextTier?.progressPercentage || 100}%` }}
                          />
                        </div>
                        {loyaltyTier.nextTier && (
                          <p className="text-sm text-gray-600 mt-1">
                            {loyaltyTier.nextTier.pointsNeeded} points to {loyaltyTier.nextTier.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tier Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Earning Multiplier</span>
                        <Badge>{loyaltyTier.tierBenefits?.earningMultiplier}x</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Free Shipping</span>
                        <Badge variant={loyaltyTier.tierBenefits?.freeShipping ? "default" : "secondary"}>
                          {loyaltyTier.tierBenefits?.freeShipping ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Priority Support</span>
                        <Badge variant={loyaltyTier.tierBenefits?.prioritySupport ? "default" : "secondary"}>
                          {loyaltyTier.tierBenefits?.prioritySupport ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Early Access</span>
                        <Badge variant={loyaltyTier.tierBenefits?.earlyAccess ? "default" : "secondary"}>
                          {loyaltyTier.tierBenefits?.earlyAccess ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}