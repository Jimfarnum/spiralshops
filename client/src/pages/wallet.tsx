import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Gift, MapPin, Plus, Clock, DollarSign, Send, ScanLine } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/queryClient';

interface GiftCard {
  id: string;
  code: string;
  issuerId?: number;
  issuerType: 'retailer' | 'mall' | 'spiral';
  amount: number;
  remainingBalance: number;
  isActive: boolean;
  expiresAt?: string;
  title: string;
  description?: string;
  terms?: string;
  createdAt: string;
}

interface MallCredit {
  id: string;
  userId: number;
  mallId: string;
  mallName: string;
  amount: number;
  remainingBalance: number;
  source: 'promotion' | 'loyalty_bonus' | 'event' | 'referral';
  description?: string;
  isActive: boolean;
  expiresAt?: string;
  earnedAt: string;
}

interface WalletData {
  userId: number;
  giftCards: Array<{
    id: string;
    giftCard: GiftCard;
    addedAt: string;
    isRedeemed: boolean;
  }>;
  mallCredits: MallCredit[];
  totalGiftCardBalance: number;
  totalMallCredits: number;
  recentTransactions: Array<{
    id: string;
    transactionType: string;
    amount: number;
    description: string;
    transactionDate: string;
  }>;
}

export default function Wallet() {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [sendGiftCard, setSendGiftCard] = useState({
    recipientEmail: '',
    amount: 25,
    message: '',
    senderName: ''
  });
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID (in real app would come from auth context)
  const userId = 1;

  // Fetch wallet data
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: [`/api/wallet/user/${userId}`],
  });

  // Redeem gift card mutation
  const redeemGiftCard = useMutation({
    mutationFn: async (data: { code: string; userId: number }) => {
      return apiRequest(`/api/wallet/giftcard/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Gift card added to your wallet successfully.',
      });
      setGiftCardCode('');
      queryClient.invalidateQueries({ queryKey: [`/api/wallet/user/${userId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to redeem gift card.',
        variant: 'destructive',
      });
    },
  });

  // Send gift card mutation
  const sendGiftCardMutation = useMutation({
    mutationFn: async (data: typeof sendGiftCard) => {
      return apiRequest(`/api/wallet/giftcard/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Gift Card Sent!',
        description: 'Your gift card has been sent successfully.',
      });
      setSendGiftCard({ recipientEmail: '', amount: 25, message: '', senderName: '' });
      setShowSendDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send gift card.',
        variant: 'destructive',
      });
    },
  });

  const handleRedeemGiftCard = () => {
    if (!giftCardCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a gift card code.',
        variant: 'destructive',
      });
      return;
    }
    
    redeemGiftCard.mutate({ code: giftCardCode, userId });
  };

  const handleSendGiftCard = () => {
    if (!sendGiftCard.recipientEmail || !sendGiftCard.senderName) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    sendGiftCardMutation.mutate(sendGiftCard);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SPIRAL Wallet</h1>
        <p className="text-gray-600">Manage your gift cards and mall credits in one place</p>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gift Card Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(walletData?.totalGiftCardBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {walletData?.giftCards?.length || 0} active cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mall Credits</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(walletData?.totalMallCredits || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {walletData?.mallCredits?.length || 0} active credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency((walletData?.totalGiftCardBalance || 0) + (walletData?.totalMallCredits || 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Available to spend
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gift-cards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
          <TabsTrigger value="mall-credits">Mall Credits</TabsTrigger>
          <TabsTrigger value="transactions">History</TabsTrigger>
        </TabsList>

        {/* Gift Cards Tab */}
        <TabsContent value="gift-cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Add Gift Card
              </CardTitle>
              <CardDescription>
                Enter your gift card code or scan the QR code to add it to your wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter gift card code (e.g., SPRL-XXXX-XXXX)"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleRedeemGiftCard}
                  disabled={redeemGiftCard.isPending}
                  className="px-6"
                >
                  {redeemGiftCard.isPending ? 'Adding...' : 'Add Card'}
                </Button>
                <Button variant="outline" size="icon">
                  <ScanLine className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Gift Cards</h2>
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Gift Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send a Gift Card</DialogTitle>
                  <DialogDescription>
                    Send a SPIRAL gift card to someone special
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient Email *</Label>
                    <Input
                      id="recipient"
                      type="email"
                      placeholder="recipient@example.com"
                      value={sendGiftCard.recipientEmail}
                      onChange={(e) => setSendGiftCard(prev => ({ ...prev, recipientEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sender">Your Name *</Label>
                    <Input
                      id="sender"
                      placeholder="Your name"
                      value={sendGiftCard.senderName}
                      onChange={(e) => setSendGiftCard(prev => ({ ...prev, senderName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="5"
                      max="500"
                      value={sendGiftCard.amount}
                      onChange={(e) => setSendGiftCard(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Add a personal message..."
                      value={sendGiftCard.message}
                      onChange={(e) => setSendGiftCard(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  <Button 
                    onClick={handleSendGiftCard} 
                    disabled={sendGiftCardMutation.isPending}
                    className="w-full"
                  >
                    {sendGiftCardMutation.isPending ? 'Sending...' : `Send ${formatCurrency(sendGiftCard.amount)} Gift Card`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {walletData?.giftCards?.map((wallet) => (
              <Card key={wallet.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{wallet.giftCard.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{wallet.giftCard.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Code: {wallet.giftCard.code}</span>
                        <span>•</span>
                        <span>Added: {formatDate(wallet.addedAt)}</span>
                        {wallet.giftCard.expiresAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires: {formatDate(wallet.giftCard.expiresAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(wallet.giftCard.remainingBalance)}
                      </div>
                      <Badge variant={wallet.giftCard.remainingBalance > 0 ? "default" : "secondary"}>
                        {wallet.giftCard.remainingBalance > 0 ? "Active" : "Used"}
                      </Badge>
                    </div>
                  </div>
                  {wallet.giftCard.terms && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">{wallet.giftCard.terms}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {(!walletData?.giftCards || walletData.giftCards.length === 0) && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Gift Cards Yet</h3>
                  <p className="text-gray-600 mb-4">Add your first gift card using the form above</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Mall Credits Tab */}
        <TabsContent value="mall-credits" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Mall Credits</h2>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Auto-applied at checkout
            </Badge>
          </div>

          <div className="grid gap-4">
            {walletData?.mallCredits?.map((credit) => (
              <Card key={credit.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {credit.mallName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{credit.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge variant="outline">
                          {credit.source.replace('_', ' ')}
                        </Badge>
                        <span>Earned: {formatDate(credit.earnedAt)}</span>
                        {credit.expiresAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires: {formatDate(credit.expiresAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(credit.remainingBalance)}
                      </div>
                      <Badge variant={credit.isActive ? "default" : "secondary"}>
                        {credit.isActive ? "Available" : "Used"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {(!walletData?.mallCredits || walletData.mallCredits.length === 0) && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Mall Credits Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Mall credits are earned through promotions, loyalty bonuses, and special events
                  </p>
                  <Button variant="outline" onClick={() => window.open('/mall-directory', '_blank')}>
                    Explore Malls
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              {walletData?.recentTransactions?.map((transaction, index) => (
                <div key={transaction.id}>
                  {index > 0 && <Separator />}
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.transactionType.includes('earn') 
                          ? 'text-green-600' 
                          : 'text-blue-600'
                      }`}>
                        {transaction.transactionType.includes('earn') ? '+' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.transactionType.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!walletData?.recentTransactions || walletData.recentTransactions.length === 0) && (
                <div className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Transactions Yet</h3>
                  <p className="text-gray-600">Your wallet activity will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}