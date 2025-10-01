import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CheckoutSpiralsPreview from '@/components/CheckoutSpiralsPreview';

export default function CheckoutSpiralsDemo() {
  const currentUserId = "user_123";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            SPIRAL Checkout Preview Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            See how SPIRALS are calculated and displayed during checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Exact Example */}
          <Card>
            <CardHeader>
              <CardTitle>Your Example Order</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutSpiralsPreview
                userId={currentUserId}
                orderDraft={{
                  amount: 129.99,
                  orderId: 'draft-123',
                  fulfillmentMethod: 'pickup_in_store',
                  inviteUsed: true,
                  storeId: 'store_abc',
                  mallId: 'mall_xyz',
                  items: [{ sku: 'sku-1', category: 'apparel', qty: 1, price: 129.99 }]
                }}
              />
            </CardContent>
          </Card>

          {/* Alternative Example - Delivery */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Example</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutSpiralsPreview
                userId={currentUserId}
                orderDraft={{
                  amount: 299.99,
                  orderId: 'draft-456',
                  fulfillmentMethod: 'delivery',
                  inviteUsed: false,
                  storeId: 'store_def',
                  mallId: 'mall_xyz',
                  items: [
                    { sku: 'sku-2', category: 'electronics', qty: 1, price: 199.99 },
                    { sku: 'sku-3', category: 'apparel', qty: 2, price: 50.00 }
                  ]
                }}
              />
            </CardContent>
          </Card>

          {/* Large Order Example */}
          <Card>
            <CardHeader>
              <CardTitle>Large Order with Multiple Bonuses</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutSpiralsPreview
                userId={currentUserId}
                orderDraft={{
                  amount: 599.99,
                  orderId: 'draft-789',
                  fulfillmentMethod: 'pickup_in_store',
                  inviteUsed: true,
                  storeId: 'store_ghi',
                  mallId: 'mall_xyz',
                  items: [
                    { sku: 'sku-4', category: 'electronics', qty: 1, price: 399.99 },
                    { sku: 'sku-5', category: 'apparel', qty: 3, price: 66.67 },
                    { sku: 'sku-6', category: 'home', qty: 1, price: 133.33 }
                  ]
                }}
              />
            </CardContent>
          </Card>

          {/* Small Order Example */}
          <Card>
            <CardHeader>
              <CardTitle>Small Order - No Bonuses</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutSpiralsPreview
                userId={currentUserId}
                orderDraft={{
                  amount: 24.99,
                  orderId: 'draft-small',
                  fulfillmentMethod: 'delivery',
                  inviteUsed: false,
                  storeId: 'store_small',
                  mallId: 'mall_xyz',
                  items: [{ sku: 'sku-small', category: 'food', qty: 1, price: 24.99 }]
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* SPIRAL Earning Rules */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">SPIRAL Earning Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Base Earning</h4>
                <p className="text-sm">1 SPIRAL per $1 spent</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pickup Multiplier</h4>
                <p className="text-sm">2x SPIRALs for in-store pickup</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Invite Multiplier</h4>
                <p className="text-sm">3x SPIRALs when using invite</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Event Multiplier</h4>
                <p className="text-sm">5x SPIRALs during special events</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Redemption</h4>
                <p className="text-sm">100 SPIRALs = $1 credit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}