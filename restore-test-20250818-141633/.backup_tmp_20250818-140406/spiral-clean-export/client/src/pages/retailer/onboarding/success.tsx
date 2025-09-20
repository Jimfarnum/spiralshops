import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Store, Upload } from 'lucide-react';

export default function StripeConnectSuccess() {
  const [location] = useLocation();
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(location.split('?')[1] || ''));
  }, [location]);

  const retailerId = params?.get('id');
  const stripeId = params?.get('stripe_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-teal-600">
            Stripe Connected Successfully!
          </CardTitle>
          <CardDescription className="text-lg">
            Your SPIRAL store is now ready to accept payments
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Payment processing is now enabled
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Funds will be transferred to your bank account
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                SPIRAL handles all transaction fees
              </li>
            </ul>
          </div>

          {stripeId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-1">Stripe Account ID</h4>
              <code className="text-sm text-blue-600 bg-white px-2 py-1 rounded">
                {stripeId}
              </code>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Upload className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Upload Inventory</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add your products to start selling on SPIRAL
                </p>
                <Button className="w-full" onClick={() => window.location.href = '/product-entry-agent'}>
                  Upload Products
                </Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Store className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Retailer Dashboard</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your store and view analytics
                </p>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/retailer-dashboard'}>
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => window.location.href = '/retailer-onboard-agent'}
              variant="ghost"
              className="text-teal-600"
            >
              ← Back to Onboarding
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}