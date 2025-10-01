import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, Store, MapPin, Package, Clock, DollarSign } from "lucide-react";
import { useCartStore, FulfillmentGroupSummary } from "@/lib/cartStore";

const getFulfillmentIcon = (method: string) => {
  switch (method) {
    case 'ship-to-me': return Truck;
    case 'in-store-pickup': return Store;
    case 'ship-to-mall': return MapPin;
    default: return Package;
  }
};

const getFulfillmentLabel = (method: string) => {
  switch (method) {
    case 'ship-to-me': return 'Ship to Me';
    case 'in-store-pickup': return 'In-Store Pickup';
    case 'ship-to-mall': return 'SPIRAL Center Pickup';
    default: return 'Standard Fulfillment';
  }
};

interface FulfillmentGroupCardProps {
  group: FulfillmentGroupSummary;
}

function FulfillmentGroupCard({ group }: FulfillmentGroupCardProps) {
  const Icon = getFulfillmentIcon(group.fulfillmentMethod);
  const label = getFulfillmentLabel(group.fulfillmentMethod);

  return (
    <Card className="border-l-4" style={{ borderLeftColor: 'var(--spiral-coral)' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-5 w-5 text-[var(--spiral-coral)]" />
          {label}
        </CardTitle>
        {group.storeName && (
          <p className="text-sm text-gray-600">
            {group.storeName}
            {group.mallName && ` • ${group.mallName}`}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {group.items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span>Subtotal ({group.items.length} items)</span>
            </div>
            <span className="font-medium">${group.subtotal.toFixed(2)}</span>
          </div>
          
          {group.shippingCost > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Shipping</span>
              </div>
              <span className="font-medium">${group.shippingCost.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--spiral-coral)]" />
              <span className="font-medium">Estimated Delivery</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {group.estimatedDelivery}
            </Badge>
          </div>
        </div>

        <div className="bg-[var(--spiral-sage)] bg-opacity-20 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Group Total:</span>
            <span className="font-bold text-lg">
              ${(group.subtotal + group.shippingCost).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FulfillmentGroups() {
  const { getFulfillmentGroups } = useCartStore();
  const groups = getFulfillmentGroups();

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No items in cart</p>
        </CardContent>
      </Card>
    );
  }

  const totalCost = groups.reduce((sum, group) => sum + group.subtotal + group.shippingCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Order Summary by Fulfillment</h3>
        <Badge variant="secondary" className="px-3 py-1">
          {groups.length} fulfillment {groups.length === 1 ? 'group' : 'groups'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {groups.map((group, index) => (
          <FulfillmentGroupCard key={index} group={group} />
        ))}
      </div>

      <Card className="bg-[var(--spiral-navy)] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-xl">
            <span className="font-bold">Total Order Amount:</span>
            <span className="font-bold">${totalCost.toFixed(2)}</span>
          </div>
          <p className="text-sm opacity-90 mt-2">
            Split across {groups.length} fulfillment {groups.length === 1 ? 'method' : 'methods'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}