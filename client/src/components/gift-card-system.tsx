import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Gift, CreditCard, Mail, ShoppingBag, Calendar, Check, Copy } from 'lucide-react';

interface GiftCard {
  id: string;
  code: string;
  originalAmount: number;
  currentBalance: number;
  recipientEmail?: string;
  recipientName?: string;
  mallName?: string;
  storeName?: string;
  personalMessage?: string;
  expiresAt?: string;
  purchasedAt: string;
  isActive: boolean;
}

interface Mall {
  id: string;
  name: string;
  storeCount: number;
}

interface Store {
  id: string;
  name: string;
  mallId: string;
  category: string;
}

const mockMalls: Mall[] = [
  { id: '1', name: 'Westfield Valley Fair', storeCount: 240 },
  { id: '2', name: 'Stanford Shopping Center', storeCount: 140 },
  { id: '3', name: 'Santana Row', storeCount: 70 },
];

const mockStores: Store[] = [
  { id: '1', name: 'Apple Store', mallId: '1', category: 'Electronics' },
  { id: '2', name: 'Nordstrom', mallId: '1', category: 'Department Store' },
  { id: '3', name: 'Zara', mallId: '2', category: 'Fashion' },
  { id: '4', name: 'Cheesecake Factory', mallId: '3', category: 'Restaurant' },
];

export default function GiftCardSystem() {
  const [activeTab, setActiveTab] = useState('purchase');
  const [selectedMall, setSelectedMall] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [giftCardForm, setGiftCardForm] = useState({
    amount: '',
    recipientName: '',
    recipientEmail: '',
    personalMessage: '',
    deliveryDate: '',
  });
  const [redeemCode, setRedeemCode] = useState('');
  const [purchasedGiftCard, setPurchasedGiftCard] = useState<GiftCard | null>(null);
  const { toast } = useToast();

  const mockUserGiftCards: GiftCard[] = [
    {
      id: '1',
      code: 'SPIRAL-GIFT-ABC123',
      originalAmount: 50.00,
      currentBalance: 35.50,
      mallName: 'Westfield Valley Fair',
      personalMessage: 'Happy Birthday!',
      expiresAt: '2025-12-31',
      purchasedAt: '2025-01-15',
      isActive: true,
    },
    {
      id: '2',
      code: 'SPIRAL-GIFT-XYZ789',
      originalAmount: 100.00,
      currentBalance: 100.00,
      storeName: 'Apple Store',
      personalMessage: 'Congratulations on your new job!',
      expiresAt: '2025-08-31',
      purchasedAt: '2025-01-10',
      isActive: true,
    }
  ];

  const handlePurchaseGiftCard = () => {
    if (!giftCardForm.amount || !giftCardForm.recipientName || !giftCardForm.recipientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(giftCardForm.amount);
    if (amount < 5 || amount > 500) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be between $5 and $500.",
        variant: "destructive",
      });
      return;
    }

    // Generate gift card
    const newGiftCard: GiftCard = {
      id: Date.now().toString(),
      code: `SPIRAL-GIFT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      originalAmount: amount,
      currentBalance: amount,
      recipientName: giftCardForm.recipientName,
      recipientEmail: giftCardForm.recipientEmail,
      personalMessage: giftCardForm.personalMessage,
      mallName: selectedMall ? mockMalls.find(m => m.id === selectedMall)?.name : undefined,
      storeName: selectedStore ? mockStores.find(s => s.id === selectedStore)?.name : undefined,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      purchasedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    setPurchasedGiftCard(newGiftCard);
    
    // Reset form
    setGiftCardForm({
      amount: '',
      recipientName: '',
      recipientEmail: '',
      personalMessage: '',
      deliveryDate: '',
    });
    setSelectedMall('');
    setSelectedStore('');

    toast({
      title: "Gift Card Purchased!",
      description: `$${amount} gift card created and sent to ${giftCardForm.recipientEmail}`,
    });
  };

  const handleRedeemGiftCard = () => {
    if (!redeemCode.trim()) {
      toast({
        title: "Enter Gift Card Code",
        description: "Please enter a valid gift card code to redeem.",
        variant: "destructive",
      });
      return;
    }

    // Simulate redemption validation
    const validCodes = ['SPIRAL-GIFT-ABC123', 'SPIRAL-GIFT-XYZ789', 'SPIRAL-GIFT-DEMO123'];
    
    if (validCodes.includes(redeemCode.toUpperCase())) {
      toast({
        title: "Gift Card Redeemed!",
        description: "Gift card balance has been applied to your account.",
      });
      setRedeemCode('');
    } else {
      toast({
        title: "Invalid Gift Card",
        description: "This gift card code is not valid or has already been used.",
        variant: "destructive",
      });
    }
  };

  const copyGiftCardCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Gift card code copied to clipboard.",
    });
  };

  const filteredStores = selectedMall ? mockStores.filter(store => store.mallId === selectedMall) : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-3">SPIRAL Gift Cards</h1>
        <p className="text-lg text-gray-600">Give the gift of local shopping with SPIRAL gift cards</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="purchase">Purchase Gift Card</TabsTrigger>
          <TabsTrigger value="redeem">Redeem Gift Card</TabsTrigger>
          <TabsTrigger value="manage">My Gift Cards</TabsTrigger>
        </TabsList>

        {/* Purchase Gift Card Tab */}
        <TabsContent value="purchase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[var(--spiral-coral)]" />
                Purchase Gift Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gift Card Type Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Gift Card Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={`cursor-pointer border-2 transition-all ${!selectedMall && !selectedStore ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)]/5' : 'border-gray-200 hover:border-gray-300'}`} 
                        onClick={() => { setSelectedMall(''); setSelectedStore(''); }}>
                    <CardContent className="p-4 text-center">
                      <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-[var(--spiral-coral)]" />
                      <h3 className="font-medium mb-1">All SPIRAL Stores</h3>
                      <p className="text-sm text-gray-600">Use at any SPIRAL partner store</p>
                    </CardContent>
                  </Card>
                  
                  <Card className={`cursor-pointer border-2 transition-all ${selectedMall && !selectedStore ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <CardContent className="p-4 text-center">
                      <Gift className="h-8 w-8 mx-auto mb-2 text-[var(--spiral-sage)]" />
                      <h3 className="font-medium mb-1">Specific Mall</h3>
                      <p className="text-sm text-gray-600">Use at stores in one mall</p>
                    </CardContent>
                  </Card>
                  
                  <Card className={`cursor-pointer border-2 transition-all ${selectedStore ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <CardContent className="p-4 text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-[var(--spiral-gold)]" />
                      <h3 className="font-medium mb-1">Specific Store</h3>
                      <p className="text-sm text-gray-600">Use at one specific store</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Mall Selection */}
              {(selectedMall || selectedStore) && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mall-select">Select Mall</Label>
                    <Select value={selectedMall} onValueChange={setSelectedMall}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a mall" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockMalls.map((mall) => (
                          <SelectItem key={mall.id} value={mall.id}>
                            {mall.name} ({mall.storeCount} stores)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Store Selection */}
                  {selectedStore && selectedMall && (
                    <div>
                      <Label htmlFor="store-select">Select Store</Label>
                      <Select value={selectedStore} onValueChange={setSelectedStore}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a store" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredStores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name} - {store.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Gift Card Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Gift Card Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="5"
                    max="500"
                    placeholder="Enter amount (5-500)"
                    value={giftCardForm.amount}
                    onChange={(e) => setGiftCardForm({...giftCardForm, amount: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery-date">Delivery Date (Optional)</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={giftCardForm.deliveryDate}
                    onChange={(e) => setGiftCardForm({...giftCardForm, deliveryDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Recipient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipient-name">Recipient Name *</Label>
                  <Input
                    id="recipient-name"
                    placeholder="Enter recipient's name"
                    value={giftCardForm.recipientName}
                    onChange={(e) => setGiftCardForm({...giftCardForm, recipientName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="recipient-email">Recipient Email *</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    placeholder="Enter recipient's email"
                    value={giftCardForm.recipientEmail}
                    onChange={(e) => setGiftCardForm({...giftCardForm, recipientEmail: e.target.value})}
                  />
                </div>
              </div>

              {/* Personal Message */}
              <div>
                <Label htmlFor="personal-message">Personal Message (Optional)</Label>
                <Textarea
                  id="personal-message"
                  placeholder="Add a personal message to your gift card..."
                  rows={3}
                  value={giftCardForm.personalMessage}
                  onChange={(e) => setGiftCardForm({...giftCardForm, personalMessage: e.target.value})}
                />
              </div>

              <Button 
                onClick={handlePurchaseGiftCard}
                className="w-full button-primary"
                size="lg"
              >
                <Gift className="h-4 w-4 mr-2" />
                Purchase Gift Card
              </Button>
            </CardContent>
          </Card>

          {/* Purchase Confirmation */}
          {purchasedGiftCard && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Gift Card Created!</h3>
                  <p className="text-green-700 mb-4">
                    Your ${purchasedGiftCard.originalAmount} gift card has been sent to {purchasedGiftCard.recipientEmail}
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200 max-w-md mx-auto">
                    <div className="text-sm text-gray-600 mb-2">Gift Card Code:</div>
                    <div className="flex items-center justify-center gap-2">
                      <code className="font-mono text-lg font-bold">{purchasedGiftCard.code}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyGiftCardCode(purchasedGiftCard.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Redeem Gift Card Tab */}
        <TabsContent value="redeem" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[var(--spiral-coral)]" />
                Redeem Gift Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="redeem-code">Gift Card Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="redeem-code"
                    placeholder="Enter gift card code (e.g., SPIRAL-GIFT-ABC123)"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleRedeemGiftCard}>
                    Redeem
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">How to Redeem:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Enter your gift card code above</li>
                  <li>• Balance will be applied to your SPIRAL account</li>
                  <li>• Use during checkout at any participating store</li>
                  <li>• Check remaining balance in "My Gift Cards" tab</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Gift Cards Tab */}
        <TabsContent value="manage" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">My Gift Cards</h2>
            <Badge variant="outline">
              {mockUserGiftCards.length} Active Cards
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockUserGiftCards.map((giftCard) => (
              <Card key={giftCard.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        ${giftCard.currentBalance.toFixed(2)} / ${giftCard.originalAmount.toFixed(2)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {giftCard.mallName || giftCard.storeName || 'All SPIRAL Stores'}
                      </p>
                    </div>
                    <Badge className={giftCard.currentBalance > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {giftCard.currentBalance > 0 ? 'Active' : 'Used'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Code:</span>
                      <div className="flex items-center gap-2">
                        <code className="font-mono">{giftCard.code}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyGiftCardCode(giftCard.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {giftCard.personalMessage && (
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Message:</span>
                        <span className="text-right max-w-xs">{giftCard.personalMessage}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span>{giftCard.expiresAt ? new Date(giftCard.expiresAt).toLocaleDateString() : 'No expiration'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Purchased:</span>
                      <span>{new Date(giftCard.purchasedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {giftCard.currentBalance > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="w-full">
                        <ShoppingBag className="h-3 w-3 mr-2" />
                        Use This Gift Card
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {mockUserGiftCards.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Gift Cards Yet</h3>
              <p className="text-gray-600 mb-4">Purchase your first gift card to get started!</p>
              <Button onClick={() => setActiveTab('purchase')}>
                Purchase Gift Card
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}