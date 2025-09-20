import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift,
  CreditCard,
  MapPin,
  Store,
  Calendar,
  CheckCircle,
  Plus,
  Search,
  Send,
  Download,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GiftCard {
  id: string;
  type: 'mall' | 'store' | 'spiral';
  name: string;
  balance: number;
  originalValue: number;
  mallName?: string;
  storeName?: string;
  purchaseDate: string;
  expiryDate: string;
  code: string;
  status: 'active' | 'used' | 'expired';
}

interface Mall {
  id: string;
  name: string;
  location: string;
  storeCount: number;
  category: string;
}

interface Store {
  id: string;
  name: string;
  mallId: string;
  category: string;
  giftCardAvailable: boolean;
}

export default function MallGiftCardSystem() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('purchase');
  
  const [giftCards, setGiftCards] = useState<GiftCard[]>([
    {
      id: '1',
      type: 'mall',
      name: 'Southdale Center Gift Card',
      balance: 75.50,
      originalValue: 100.00,
      mallName: 'Southdale Center',
      purchaseDate: '2025-01-15',
      expiryDate: '2026-01-15',
      code: 'MALL-2025-ABC123',
      status: 'active'
    },
    {
      id: '2',
      type: 'store',
      name: 'Target Gift Card',
      balance: 25.00,
      originalValue: 50.00,
      storeName: 'Target Store',
      purchaseDate: '2025-01-10',
      expiryDate: '2026-01-10',
      code: 'STORE-2025-XYZ789',
      status: 'active'
    },
    {
      id: '3',
      type: 'spiral',
      name: 'SPIRAL Universal Card',
      balance: 150.00,
      originalValue: 150.00,
      purchaseDate: '2025-01-20',
      expiryDate: '2026-01-20',
      code: 'SPIRAL-2025-UNI456',
      status: 'active'
    }
  ]);

  const [malls] = useState<Mall[]>([
    { id: '1', name: 'Southdale Center', location: 'Edina, MN', storeCount: 120, category: 'Regional Mall' },
    { id: '2', name: 'Mall of America', location: 'Bloomington, MN', storeCount: 500, category: 'Super Regional' },
    { id: '3', name: 'Ridgedale Center', location: 'Minnetonka, MN', storeCount: 145, category: 'Regional Mall' }
  ]);

  const [stores] = useState<Store[]>([
    { id: '1', name: 'Target', mallId: '1', category: 'Department Store', giftCardAvailable: true },
    { id: '2', name: 'Macy\'s', mallId: '1', category: 'Department Store', giftCardAvailable: true },
    { id: '3', name: 'Apple Store', mallId: '2', category: 'Electronics', giftCardAvailable: true },
    { id: '4', name: 'Nordstrom', mallId: '2', category: 'Fashion', giftCardAvailable: true }
  ]);

  const [purchaseForm, setPurchaseForm] = useState({
    type: 'mall',
    mallId: '',
    storeId: '',
    amount: '',
    recipientEmail: '',
    recipientName: '',
    message: '',
    deliveryDate: '',
    senderName: ''
  });

  const [redeemForm, setRedeemForm] = useState({
    code: '',
    amount: ''
  });

  const handlePurchaseFormChange = (field: string, value: string) => {
    setPurchaseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRedeemFormChange = (field: string, value: string) => {
    setRedeemForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const purchaseGiftCard = () => {
    if (!purchaseForm.amount || !purchaseForm.recipientEmail || !purchaseForm.senderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newGiftCard: GiftCard = {
      id: Date.now().toString(),
      type: purchaseForm.type as 'mall' | 'store' | 'spiral',
      name: getGiftCardName(),
      balance: parseFloat(purchaseForm.amount),
      originalValue: parseFloat(purchaseForm.amount),
      mallName: purchaseForm.type === 'mall' ? malls.find(m => m.id === purchaseForm.mallId)?.name : undefined,
      storeName: purchaseForm.type === 'store' ? stores.find(s => s.id === purchaseForm.storeId)?.name : undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      code: `${purchaseForm.type.toUpperCase()}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'active'
    };

    setGiftCards(prev => [...prev, newGiftCard]);

    toast({
      title: "Gift Card Purchased!",
      description: `$${purchaseForm.amount} gift card has been sent to ${purchaseForm.recipientEmail}`
    });

    // Reset form
    setPurchaseForm({
      type: 'mall',
      mallId: '',
      storeId: '',
      amount: '',
      recipientEmail: '',
      recipientName: '',
      message: '',
      deliveryDate: '',
      senderName: ''
    });
  };

  const redeemGiftCard = () => {
    if (!redeemForm.code || !redeemForm.amount) {
      toast({
        title: "Missing Information",
        description: "Please enter both gift card code and amount to redeem.",
        variant: "destructive"
      });
      return;
    }

    const giftCard = giftCards.find(card => card.code === redeemForm.code);
    
    if (!giftCard) {
      toast({
        title: "Invalid Code",
        description: "Gift card code not found.",
        variant: "destructive"
      });
      return;
    }

    const redeemAmount = parseFloat(redeemForm.amount);
    
    if (redeemAmount > giftCard.balance) {
      toast({
        title: "Insufficient Balance",
        description: `This gift card only has $${giftCard.balance.toFixed(2)} remaining.`,
        variant: "destructive"
      });
      return;
    }

    // Update gift card balance
    setGiftCards(prev => prev.map(card => 
      card.id === giftCard.id
        ? { ...card, balance: card.balance - redeemAmount }
        : card
    ));

    toast({
      title: "Gift Card Redeemed!",
      description: `$${redeemAmount.toFixed(2)} has been applied to your purchase.`
    });

    setRedeemForm({ code: '', amount: '' });
  };

  const getGiftCardName = () => {
    switch (purchaseForm.type) {
      case 'mall':
        const mall = malls.find(m => m.id === purchaseForm.mallId);
        return `${mall?.name} Gift Card`;
      case 'store':
        const store = stores.find(s => s.id === purchaseForm.storeId);
        return `${store?.name} Gift Card`;
      case 'spiral':
        return 'SPIRAL Universal Gift Card';
      default:
        return 'Gift Card';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-gray-100 text-gray-600';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mall': return 'bg-blue-100 text-blue-800';
      case 'store': return 'bg-purple-100 text-purple-800';
      case 'spiral': return 'bg-gradient-to-r from-[var(--spiral-navy)] to-[var(--spiral-coral)] text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">Mall Gift Card System</h1>
          <p className="text-gray-600">Purchase, manage, and redeem gift cards for malls, stores, and SPIRAL</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="purchase" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Purchase</span>
            </TabsTrigger>
            <TabsTrigger value="redeem" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Redeem</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>My Cards</span>
            </TabsTrigger>
          </TabsList>

          {/* Purchase Tab */}
          <TabsContent value="purchase">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <span>Purchase Gift Card</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Gift Card Type Selection */}
                  <div>
                    <Label>Gift Card Type</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { value: 'mall', label: 'Mall Card', desc: 'Use at any store in the mall' },
                        { value: 'store', label: 'Store Card', desc: 'Use at specific store only' },
                        { value: 'spiral', label: 'SPIRAL Card', desc: 'Use anywhere on SPIRAL' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => handlePurchaseFormChange('type', type.value)}
                          className={`p-3 border-2 rounded-lg text-sm transition-all ${
                            purchaseForm.type === type.value
                              ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)] text-white'
                              : 'border-gray-200 hover:border-[var(--spiral-coral)]'
                          }`}
                        >
                          <div className="font-semibold">{type.label}</div>
                          <div className="text-xs opacity-75">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mall Selection */}
                  {purchaseForm.type === 'mall' && (
                    <div>
                      <Label htmlFor="mallSelect">Select Mall</Label>
                      <select
                        id="mallSelect"
                        value={purchaseForm.mallId}
                        onChange={(e) => handlePurchaseFormChange('mallId', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Choose a mall...</option>
                        {malls.map((mall) => (
                          <option key={mall.id} value={mall.id}>
                            {mall.name} - {mall.location} ({mall.storeCount} stores)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Store Selection */}
                  {purchaseForm.type === 'store' && (
                    <div>
                      <Label htmlFor="storeSelect">Select Store</Label>
                      <select
                        id="storeSelect"
                        value={purchaseForm.storeId}
                        onChange={(e) => handlePurchaseFormChange('storeId', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Choose a store...</option>
                        {stores.filter(store => store.giftCardAvailable).map((store) => (
                          <option key={store.id} value={store.id}>
                            {store.name} ({store.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <Label htmlFor="amount">Gift Card Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={purchaseForm.amount}
                      onChange={(e) => handlePurchaseFormChange('amount', e.target.value)}
                      placeholder="Enter amount ($25 - $500)"
                      min="25"
                      max="500"
                    />
                    <div className="flex space-x-2 mt-2">
                      {[25, 50, 100, 250].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePurchaseFormChange('amount', amount.toString())}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Recipient Information</h3>
                    <div>
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input
                        id="recipientName"
                        value={purchaseForm.recipientName}
                        onChange={(e) => handlePurchaseFormChange('recipientName', e.target.value)}
                        placeholder="Enter recipient's name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientEmail">Recipient Email</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={purchaseForm.recipientEmail}
                        onChange={(e) => handlePurchaseFormChange('recipientEmail', e.target.value)}
                        placeholder="Enter recipient's email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderName">Your Name</Label>
                      <Input
                        id="senderName"
                        value={purchaseForm.senderName}
                        onChange={(e) => handlePurchaseFormChange('senderName', e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={purchaseForm.message}
                      onChange={(e) => handlePurchaseFormChange('message', e.target.value)}
                      placeholder="Add a personal message..."
                      rows={3}
                    />
                  </div>

                  {/* Delivery Date */}
                  <div>
                    <Label htmlFor="deliveryDate">Delivery Date (Optional)</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={purchaseForm.deliveryDate}
                      onChange={(e) => handlePurchaseFormChange('deliveryDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <Button
                    onClick={purchaseGiftCard}
                    className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                    disabled={!purchaseForm.amount || !purchaseForm.recipientEmail || !purchaseForm.senderName}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Purchase & Send Gift Card
                  </Button>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Gift Card Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] p-6 rounded-lg text-white text-center">
                    <Gift className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{getGiftCardName()}</h3>
                    <div className="text-3xl font-bold mb-2">
                      ${purchaseForm.amount || '0.00'}
                    </div>
                    <div className="text-sm opacity-75">
                      From: {purchaseForm.senderName || 'Your Name'}
                    </div>
                    <div className="text-sm opacity-75">
                      To: {purchaseForm.recipientName || 'Recipient Name'}
                    </div>
                    {purchaseForm.message && (
                      <div className="mt-4 p-3 bg-white/20 rounded text-sm">
                        "{purchaseForm.message}"
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Redeem Tab */}
          <TabsContent value="redeem">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center flex items-center justify-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Redeem Gift Card</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="redeemCode">Gift Card Code</Label>
                    <Input
                      id="redeemCode"
                      value={redeemForm.code}
                      onChange={(e) => handleRedeemFormChange('code', e.target.value)}
                      placeholder="Enter gift card code"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="redeemAmount">Amount to Redeem</Label>
                    <Input
                      id="redeemAmount"
                      type="number"
                      value={redeemForm.amount}
                      onChange={(e) => handleRedeemFormChange('amount', e.target.value)}
                      placeholder="Enter amount to redeem"
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                  <Button
                    onClick={redeemGiftCard}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!redeemForm.code || !redeemForm.amount}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Redeem Gift Card
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <p>Enter your gift card code and the amount you'd like to use.</p>
                    <p>The remaining balance will stay on your card.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Gift Cards</h2>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    Total Balance: ${giftCards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {giftCards.map((card) => (
                  <Card key={card.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${
                      card.type === 'spiral' 
                        ? 'from-[var(--spiral-navy)] to-[var(--spiral-coral)]' 
                        : 'from-gray-400 to-gray-600'
                    } transform rotate-45 translate-x-6 -translate-y-6`}></div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <Badge className={getTypeColor(card.type)}>
                            {card.type.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(card.status)}>
                            {card.status.toUpperCase()}
                          </Badge>
                        </div>
                        <Gift className="h-6 w-6 text-gray-400" />
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{card.name}</h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Balance:</span>
                          <span className="font-semibold text-green-600">
                            ${card.balance.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Original Value:</span>
                          <span>${card.originalValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span>{new Date(card.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-2 bg-gray-50 rounded text-xs font-mono text-center">
                        {card.code}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab('purchase')}
                      className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Buy New Gift Card
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('redeem')}
                      variant="outline"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Redeem Gift Card
                    </Button>
                    <Button variant="outline">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Shop with Cards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}