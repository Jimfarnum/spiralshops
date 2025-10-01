import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, TrendingUp, MapPin } from 'lucide-react';

interface OrderDraft {
  amount: number;
  orderId: string;
  fulfillmentMethod: 'pickup_in_store' | 'delivery';
  inviteUsed: boolean;
  storeId: string;
  mallId: string;
  items: Array<{
    sku: string;
    category: string;
    qty: number;
    price: number;
  }>;
}

interface CheckoutSpiralsPreviewProps {
  userId: string;
  orderDraft: OrderDraft;
}

export default function CheckoutSpiralsPreview({ userId, orderDraft }: CheckoutSpiralsPreviewProps) {
  // SPIRAL calculation: 1 SPIRAL per $1 spent with multipliers
  let spirals = Math.floor(orderDraft.amount); // Base: 1 SPIRAL per $1
  
  // Apply multipliers
  if (orderDraft.fulfillmentMethod === 'pickup_in_store') spirals *= 2; // 2x for pickup
  if (orderDraft.inviteUsed) spirals *= 3; // 3x for invite
  // Note: 5x for events would be applied elsewhere
  
  const totalSpirals = spirals;
  const redemptionValue = totalSpirals / 100; // 100 SPIRALs = $1
  
  // Mock current user balance (in production, this would come from API)
  const currentBalance = 2450;
  const newBalance = currentBalance + totalSpirals;

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Star className="w-5 h-5" />
          SPIRALS You'll Earn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Balance */}
        <div className="flex items-center justify-between p-3 bg-white/60 rounded border border-orange-100">
          <span className="text-sm text-gray-600">Current Balance</span>
          <span className="font-semibold text-orange-600">
            {currentBalance.toLocaleString()} SPIRALs
          </span>
        </div>

        {/* Earning Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Base (${orderDraft.amount.toFixed(2)} × 1)</span>
            <span className="font-medium text-orange-600">{Math.floor(orderDraft.amount).toLocaleString()}</span>
          </div>
          
          {orderDraft.fulfillmentMethod === 'pickup_in_store' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Pickup Multiplier (2x)
              </span>
              <span className="font-medium text-blue-600">×2</span>
            </div>
          )}
          
          {orderDraft.inviteUsed && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Gift className="w-3 h-3" />
                Invite Multiplier (3x)
              </span>
              <span className="font-medium text-green-600">×3</span>
            </div>
          )}
        </div>

        {/* Total Earning */}
        <div className="border-t border-orange-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-orange-700">Total SPIRALs Earned</span>
            <span className="text-xl font-bold text-orange-600">+{totalSpirals.toLocaleString()}</span>
          </div>
        </div>

        {/* New Balance Preview */}
        <div className="flex items-center justify-between p-3 bg-orange-100 rounded border border-orange-200">
          <span className="font-semibold text-orange-700">New Balance</span>
          <span className="text-xl font-bold text-orange-600">
            {newBalance.toLocaleString()} SPIRALs
          </span>
        </div>

        {/* Order Details */}
        <div className="pt-2 border-t border-orange-200">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {orderDraft.fulfillmentMethod === 'pickup_in_store' ? 'Store Pickup' : 'Delivery'}
            </Badge>
            {orderDraft.inviteUsed && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Invite Used
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {orderDraft.items.length} item{orderDraft.items.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Order #{orderDraft.orderId} • Store {orderDraft.storeId}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}