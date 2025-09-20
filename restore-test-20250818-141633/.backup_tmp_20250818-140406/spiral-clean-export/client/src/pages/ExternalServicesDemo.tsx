import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Truck, CreditCard, Package, Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function ExternalServicesDemo() {
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServiceStatus();
  }, []);

  const fetchServiceStatus = async () => {
    try {
      const response = await fetch('/api/external/status');
      const data = await response.json();
      setServiceStatus(data);
    } catch (error) {
      console.error('Failed to fetch service status:', error);
    }
  };

  const testService = async (action: string, payload: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/external/handle/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      setTestResults(prev => [{
        id: Date.now(),
        action,
        result,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Service test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (configured: boolean, mock: boolean) => {
    if (configured && !mock) {
      return <Badge variant="default" className="bg-green-500">Live</Badge>;
    } else if (mock) {
      return <Badge variant="secondary">Mock</Badge>;
    } else {
      return <Badge variant="destructive">Not Configured</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">External Services Integration Hub</h1>
        <p className="text-gray-600">
          Centralized API management for shipping, payments, logistics, and notifications
        </p>
      </div>

      {/* Service Status Overview */}
      {serviceStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Service Status Overview
            </CardTitle>
            <CardDescription>
              Current configuration and availability of external services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Shipping</span>
                  {getStatusBadge(serviceStatus.services.shipping.configured, serviceStatus.services.shipping.mock)}
                </div>
                <p className="text-sm text-gray-600">FedEx, UPS, Shippo</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Payment</span>
                  {getStatusBadge(serviceStatus.services.payment.configured, serviceStatus.services.payment.mock)}
                </div>
                <p className="text-sm text-gray-600">Stripe, Square</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">Logistics</span>
                  {getStatusBadge(serviceStatus.services.logistics.configured, serviceStatus.services.logistics.mock)}
                </div>
                <p className="text-sm text-gray-600">Order tracking</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="font-medium">Notifications</span>
                  {getStatusBadge(serviceStatus.services.notifications.sms || serviceStatus.services.notifications.email, true)}
                </div>
                <p className="text-sm text-gray-600">SMS, Email</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="shipping" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Shipping Services */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Services
              </CardTitle>
              <CardDescription>
                Test shipping quotes, tracking, and label creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => testService('shipping.quote', {
                    from: { zip: '10001' },
                    to: { zip: '90210' },
                    weight: 2.5,
                    dimensions: { length: 10, width: 8, height: 6 }
                  })}
                  disabled={loading}
                  className="h-20 flex-col"
                >
                  <Truck className="h-6 w-6 mb-2" />
                  Get Quote
                </Button>
                
                <Button 
                  onClick={() => testService('shipping.track', {
                    trackingNumber: 'TRK123456789'
                  })}
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Package className="h-6 w-6 mb-2" />
                  Track Package
                </Button>
                
                <Button 
                  onClick={() => testService('shipping.create', {
                    from: { name: 'SPIRAL Store', zip: '10001' },
                    to: { name: 'Customer', zip: '90210' },
                    service: 'GROUND'
                  })}
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <CheckCircle className="h-6 w-6 mb-2" />
                  Create Label
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Services */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Services
              </CardTitle>
              <CardDescription>
                Test payment processing, tokenization, and refunds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => testService('payment.token', {
                    card: { number: '4242424242424242', exp_month: 12, exp_year: 2026, cvc: '123' }
                  })}
                  disabled={loading}
                  className="h-20 flex-col"
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  Create Token
                </Button>
                
                <Button 
                  onClick={() => testService('payment.charge', {
                    amount: 2999,
                    currency: 'usd',
                    source: 'tok_visa'
                  })}
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <CheckCircle className="h-6 w-6 mb-2" />
                  Process Charge
                </Button>
                
                <Button 
                  onClick={() => testService('payment.refund', {
                    charge: 'ch_123456',
                    amount: 1500
                  })}
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <AlertCircle className="h-6 w-6 mb-2" />
                  Issue Refund
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logistics Services */}
        <TabsContent value="logistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Logistics Services
              </CardTitle>
              <CardDescription>
                Test order tracking and fulfillment updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => testService('logistics.track', {
                    orderId: 'ORD123456'
                  })}
                  disabled={loading}
                  className="h-20 flex-col"
                >
                  <Package className="h-6 w-6 mb-2" />
                  Track Order
                </Button>
                
                <Button 
                  onClick={() => testService('logistics.update', {
                    orderId: 'ORD123456',
                    status: 'OUT_FOR_DELIVERY'
                  })}
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Clock className="h-6 w-6 mb-2" />
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Services */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Services
              </CardTitle>
              <CardDescription>
                Test SMS and email notification delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => testService('notification.sms', {
                    to: '+1234567890',
                    message: 'Your SPIRAL order is ready for pickup!'
                  })}
                  disabled={loading}
                  className="h-20 flex-col"
                >
                  <Bell className="h-6 w-6 mb-2" />
                  Send SMS
                </Button>
                
                <Button 
                  onClick={() => testService('notification.email', {
                    to: 'customer@example.com',
                    subject: 'SPIRAL Order Confirmation',
                    message: 'Thank you for your order!'
                  })}
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <CheckCircle className="h-6 w-6 mb-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
            <CardDescription>
              Latest API integration test responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{test.action}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(test.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {test.result.result?.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <Textarea
                    value={JSON.stringify(test.result, null, 2)}
                    readOnly
                    className="font-mono text-sm"
                    rows={6}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Configuration Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">API Configuration Required</CardTitle>
          <CardDescription className="text-blue-700">
            To enable live external service integrations, provide the following API keys via environment variables:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Shipping Services</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• FEDEX_API_KEY</li>
                <li>• UPS_API_KEY</li>
                <li>• SHIPPO_API_KEY</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Notifications</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• TWILIO_AUTH_TOKEN</li>
                <li>• SENDGRID_API_KEY</li>
              </ul>
            </div>
          </div>
          <p className="text-blue-600 mt-4 text-sm">
            Without API keys, services will return mock data for development and testing purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}