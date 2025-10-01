import React from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Gift, 
  Store, 
  Calendar, 
  Star,
  TrendingUp,
  Share2
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

const PurchaseDetails = () => {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const purchaseId = urlParams.get('id') || 'purchase-winter-clothing';

  // Mock purchase data
  const purchase = {
    id: purchaseId,
    name: 'Winter Clothing Collection',
    description: 'Cozy winter jacket and accessories bundle from Fashion Forward Boutique',
    date: '2025-01-18',
    total: 79.99,
    spiralsEarned: 22,
    store: {
      id: 1,
      name: 'Fashion Forward Boutique',
      address: '456 Commerce St, Portland, OR 97201',
      phone: '(555) 123-4567',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop'
    },
    items: [
      {
        name: 'Winter Jacket - Navy Blue',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop'
      },
      {
        name: 'Matching Scarf',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=150&h=150&fit=crop'
      }
    ],
    paymentMethod: 'Visa ending in 4242',
    transactionId: 'TXN-2025-001234',
    spiralTransaction: {
      id: 'SPL-2025-001234',
      pointsEarned: 22,
      multiplier: 1.0,
      reason: 'Purchase at local retailer',
      bonusPoints: 2,
      bonusReason: 'First purchase at this store'
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Account
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
              Purchase Details
            </h1>
            <p className="text-gray-600 font-['Inter']">
              Transaction on {new Date(purchase.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Purchase Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Purchase Overview */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  {purchase.name}
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  {purchase.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-[var(--spiral-sage)]/10 rounded-lg">
                    <p className="text-2xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                      ${purchase.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 font-['Inter']">Total Spent</p>
                  </div>
                  <div className="text-center p-4 bg-[var(--spiral-coral)]/10 rounded-lg">
                    <p className="text-2xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                      +{purchase.spiralsEarned}
                    </p>
                    <p className="text-sm text-gray-600 font-['Inter']">SPIRALs Earned</p>
                  </div>
                  <div className="text-center p-4 bg-[var(--spiral-gold)]/10 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <p className="text-lg font-bold text-[var(--spiral-navy)] font-['Poppins']">
                        {purchase.store.rating}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 font-['Inter']">Store Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Purchased */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--spiral-navy)] font-['Poppins']">
                  <Gift className="h-5 w-5" />
                  Items Purchased
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchase.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--spiral-navy)] font-['Inter']">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Store Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--spiral-navy)] font-['Poppins']">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={purchase.store.image}
                    alt={purchase.store.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--spiral-navy)] mb-2 font-['Inter']">
                      {purchase.store.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 font-['Inter']">
                      <p>{purchase.store.address}</p>
                      <p>Phone: {purchase.store.phone}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{purchase.store.rating} rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link href={`/store/${purchase.store.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Visit Store
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full">
                      Leave Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SPIRALs Breakdown */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--spiral-navy)] font-['Poppins']">
                  <TrendingUp className="h-5 w-5" />
                  SPIRALs Earned Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[var(--spiral-sage)]/10 rounded-lg">
                    <div>
                      <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">Base Purchase Reward</p>
                      <p className="text-sm text-gray-600 font-['Inter']">
                        {purchase.spiralTransaction.reason}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-[var(--spiral-coral)] font-['Poppins']">
                      +{purchase.spiralTransaction.pointsEarned - purchase.spiralTransaction.bonusPoints}
                    </span>
                  </div>
                  
                  {purchase.spiralTransaction.bonusPoints > 0 && (
                    <div className="flex justify-between items-center p-3 bg-[var(--spiral-gold)]/10 rounded-lg">
                      <div>
                        <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">Bonus Points</p>
                        <p className="text-sm text-gray-600 font-['Inter']">
                          {purchase.spiralTransaction.bonusReason}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-[var(--spiral-gold)] font-['Poppins']">
                        +{purchase.spiralTransaction.bonusPoints}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center p-3 bg-[var(--spiral-coral)]/10 rounded-lg border-2 border-[var(--spiral-coral)]/20">
                    <div>
                      <p className="font-bold text-[var(--spiral-navy)] font-['Inter']">Total SPIRALs Earned</p>
                      <p className="text-sm text-gray-600 font-['Inter']">
                        Transaction ID: {purchase.spiralTransaction.id}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                      +{purchase.spiralTransaction.pointsEarned}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Transaction Details */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Date</p>
                  <p className="font-semibold font-['Inter']">
                    {new Date(purchase.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Payment Method</p>
                  <p className="font-semibold font-['Inter']">{purchase.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Transaction ID</p>
                  <p className="font-mono text-sm font-['Inter']">{purchase.transactionId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white">
                  Shop Again
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Experience
                </Button>
                <Link href="/spirals">
                  <Button variant="outline" className="w-full">
                    View All SPIRALs
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Earn More SPIRALs */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-[var(--spiral-coral)]/5 to-[var(--spiral-gold)]/5">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">Earn More SPIRALs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3 font-['Inter']">
                    Share this purchase with friends to earn bonus SPIRALs!
                  </p>
                  <Button size="sm" className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-gold)] text-white">
                    Share & Earn +5 SPIRALs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PurchaseDetails;