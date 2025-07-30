import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Search,
  Gift,
  DollarSign,
  Calendar,
  Store,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GiftCard {
  cardNumber: string;
  balance: number;
  originalAmount: number;
  issuedDate: string;
  expiresDate: string;
  store: string;
  cardType: 'universal' | 'store-specific' | 'mall-specific';
  status: 'active' | 'expired' | 'used';
  lastUsed?: string;
  transactionHistory: Array<{
    date: string;
    description: string;
    amount: number;
    type: 'purchase' | 'redemption';
    location: string;
  }>;
}

export default function GiftCardBalanceChecker() {
  const { toast } = useToast();
  
  const [cardNumber, setCardNumber] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);
  const [error, setError] = useState('');

  // Mock gift card database
  const mockGiftCards: Record<string, GiftCard> = {
    '4567123456789012': {
      cardNumber: '4567123456789012',
      balance: 85.50,
      originalAmount: 100.00,
      issuedDate: '2025-01-15',
      expiresDate: '2026-01-15',
      store: 'Universal SPIRAL Card',
      cardType: 'universal',
      status: 'active',
      lastUsed: '2025-01-28',
      transactionHistory: [
        {
          date: '2025-01-28',
          description: 'Coffee & Pastry',
          amount: -12.50,
          type: 'redemption',
          location: 'Local Coffee Shop'
        },
        {
          date: '2025-01-20',
          description: 'Book Purchase',
          amount: -2.00,
          type: 'redemption',
          location: 'Barnes & Noble'
        }
      ]
    },
    '5432987654321098': {
      cardNumber: '5432987654321098',
      balance: 0.00,
      originalAmount: 50.00,
      issuedDate: '2024-12-01',
      expiresDate: '2025-12-01',
      store: 'Target Store Card',
      cardType: 'store-specific',
      status: 'used',
      lastUsed: '2025-01-25',
      transactionHistory: [
        {
          date: '2025-01-25',
          description: 'Electronics Purchase',
          amount: -50.00,
          type: 'redemption',
          location: 'Target Electronics'
        }
      ]
    },
    '6789012345678901': {
      cardNumber: '6789012345678901',
      balance: 25.75,
      originalAmount: 75.00,
      issuedDate: '2024-11-30',
      expiresDate: '2025-11-30',
      store: 'Westfield Mall Card',
      cardType: 'mall-specific',
      status: 'active',
      lastUsed: '2025-01-29',
      transactionHistory: [
        {
          date: '2025-01-29',
          description: 'Food Court Purchase',
          amount: -18.25,
          type: 'redemption',
          location: 'Mall Food Court'
        },
        {
          date: '2025-01-15',
          description: 'Clothing Purchase',
          amount: -31.00,
          type: 'redemption',
          location: 'Fashion Boutique'
        }
      ]
    }
  };

  const checkBalance = async () => {
    setIsLoading(true);
    setError('');
    setGiftCard(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate card number format
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      setError('Please enter a valid 16-digit card number');
      setIsLoading(false);
      return;
    }

    // Check if card exists
    const foundCard = mockGiftCards[cardNumber];
    if (!foundCard) {
      setError('Gift card not found. Please check your card number and try again.');
      setIsLoading(false);
      return;
    }

    // Check if card is expired
    if (new Date(foundCard.expiresDate) < new Date()) {
      foundCard.status = 'expired';
    }

    setGiftCard(foundCard);
    setIsLoading(false);

    toast({
      title: "Balance Retrieved",
      description: `Your gift card balance is $${foundCard.balance.toFixed(2)}`,
    });
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.substring(0, 16);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted.replace(/\s/g, ''));
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'universal': return 'bg-blue-100 text-blue-800';
      case 'store-specific': return 'bg-green-100 text-green-800';
      case 'mall-specific': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'expired': return <Clock className="h-4 w-4 text-red-600" />;
      case 'used': return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            Gift Card Balance Checker
          </h1>
          <p className="text-gray-600">
            Check your SPIRAL gift card balance and transaction history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Check Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Check Gift Card Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gift Card Number
                    </label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(cardNumber)}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the 16-digit number on your gift card
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Security Code (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      maxLength={4}
                      className="w-24 font-mono"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={checkBalance}
                    disabled={isLoading || cardNumber.length !== 16}
                    className="w-full"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? 'Checking Balance...' : 'Check Balance'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gift Card Details */}
            {giftCard && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Gift Card Details</span>
                    {getStatusIcon(giftCard.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Card Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card Number:</span>
                          <span className="font-mono">
                            ****{giftCard.cardNumber.slice(-4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Store:</span>
                          <span>{giftCard.store}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <Badge className={getCardTypeColor(giftCard.cardType)}>
                            {giftCard.cardType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="capitalize">{giftCard.status}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Balance Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Balance:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ${giftCard.balance.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Amount:</span>
                          <span>${giftCard.originalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount Used:</span>
                          <span>${(giftCard.originalAmount - giftCard.balance).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expires:</span>
                          <span>{new Date(giftCard.expiresDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {giftCard.status === 'expired' && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This gift card has expired and can no longer be used.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transaction History */}
            {giftCard && giftCard.transactionHistory.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {giftCard.transactionHistory.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium">{transaction.description}</h4>
                            <p className="text-sm text-gray-600">{transaction.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold ${
                            transaction.type === 'redemption' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'redemption' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => {
                    setCardNumber('4567123456789012');
                    setSecurityCode('');
                  }}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Demo Universal Card
                </Button>
                <Button 
                  onClick={() => {
                    setCardNumber('5432987654321098');
                    setSecurityCode('');
                  }}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Store className="h-4 w-4 mr-2" />
                  Demo Store Card
                </Button>
                <Button 
                  onClick={() => {
                    setCardNumber('6789012345678901');
                    setSecurityCode('');
                  }}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Demo Mall Card
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium">Can't find your card?</h4>
                    <p className="text-gray-600">
                      Contact customer support at support@spiral.com or call 1-800-SPIRAL.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Card expired?</h4>
                    <p className="text-gray-600">
                      Some expired cards may be eligible for extension. Contact support for assistance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Card damaged?</h4>
                    <p className="text-gray-600">
                      We can issue a replacement card with your remaining balance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}