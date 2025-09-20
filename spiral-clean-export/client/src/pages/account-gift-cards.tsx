import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, DollarSign, Send, Mail } from "lucide-react";
import { Link } from "wouter";

// Mock user ID - in real app would get from auth context
const MOCK_USER_ID = 1;

interface GiftCard {
  id: number;
  code: string;
  senderName: string;
  amount: number;
  balance: number;
  message?: string;
  status: string;
  expirationDate: string;
  createdAt: string;
  redeemedAt?: string;
}

export default function AccountGiftCards() {
  const { data: giftCards, isLoading, error } = useQuery({
    queryKey: [`/api/gift-cards/user/${MOCK_USER_ID}`],
    select: (response: any) => response.received as GiftCard[],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Gift Cards</h1>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gift Cards</h1>
            <p className="text-gray-600">Manage your SPIRAL gift cards and view transaction history</p>
          </div>
          <Link href="/gift-cards">
            <Button className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Purchase Gift Card
            </Button>
          </Link>
        </div>

        {!giftCards || giftCards.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Gift Cards Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't received any SPIRAL gift cards. Purchase one for yourself or ask friends to send you one!
              </p>
              <Link href="/gift-cards">
                <Button>Get Your First Gift Card</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Balance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(giftCards.reduce((sum, card) => sum + card.balance, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Gift className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Cards</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {giftCards.filter(card => card.status === 'active' && card.balance > 0).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Received</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(giftCards.reduce((sum, card) => sum + card.amount, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gift Cards List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Gift Cards</h2>
              {giftCards.map((card) => (
                <Card key={card.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                          <Gift className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">Gift Card #{card.code}</h3>
                            <Badge className={getStatusColor(card.status)}>
                              {card.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            From: <span className="font-medium">{card.senderName}</span>
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Received {formatDate(card.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Expires {formatDate(card.expirationDate)}
                            </span>
                          </div>
                          {card.message && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-gray-700 italic">"{card.message}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">Current Balance</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(card.balance)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Original: {formatCurrency(card.amount)}
                        </p>
                        {card.balance > 0 && card.status === 'active' && (
                          <Link href="/products">
                            <Button size="sm" className="mt-3">
                              Use Card
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Sending Gift Cards</h4>
                  <p className="text-sm text-gray-600">
                    You can purchase and send gift cards to friends and family from our gift card page.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Using Gift Cards</h4>
                  <p className="text-sm text-gray-600">
                    Enter your gift card code at checkout to apply the balance to your order. Partial amounts are supported.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Expiration</h4>
                  <p className="text-sm text-gray-600">
                    Gift cards expire 12 months from the purchase date. Use them before the expiration date to avoid losing the balance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}