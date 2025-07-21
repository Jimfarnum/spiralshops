import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Truck, Store, MapPin, Clock, ShoppingBag } from "lucide-react";
import { useCartStore, CartItem, FulfillmentGroupSummary } from "@/lib/cartStore";

interface FulfillmentSelectorProps {
  item: CartItem;
  onChange?: (itemId: number, method: 'ship-to-me' | 'in-store-pickup' | 'ship-to-mall') => void;
}

const FulfillmentOption = ({ method, icon: Icon, label, description, cost, delivery }: {
  method: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  cost: string;
  delivery: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
    <Icon className="h-5 w-5 text-[var(--spiral-coral)] mt-0.5" />
    <div className="flex-1">
      <h4 className="font-medium">{label}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="flex items-center gap-2 mt-1">
        <Badge variant="secondary" className="text-xs">{cost}</Badge>
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {delivery}
        </Badge>
      </div>
    </div>
  </div>
);

export default function FulfillmentSelector({ item, onChange }: FulfillmentSelectorProps) {
  const { updateFulfillmentMethod } = useCartStore();

  const handleFulfillmentChange = (method: 'ship-to-me' | 'in-store-pickup' | 'ship-to-mall') => {
    updateFulfillmentMethod(item.id, method);
    onChange?.(item.id, method);
  };

  const fulfillmentOptions = [
    {
      value: 'ship-to-me' as const,
      icon: Truck,
      label: 'Ship to Me',
      description: 'Standard shipping to your address',
      cost: '$4.99',
      delivery: '2-5 business days'
    },
    {
      value: 'in-store-pickup' as const,
      icon: Store,
      label: 'In-Store Pickup',
      description: `Pick up at ${item.store || 'store location'}`,
      cost: 'FREE',
      delivery: 'Ready today'
    },
    {
      value: 'ship-to-mall' as const,
      icon: MapPin,
      label: 'SPIRAL Center Pickup',
      description: `Ship to ${item.mallName || 'mall'} SPIRAL Center`,
      cost: 'FREE',
      delivery: '2-3 days'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Choose fulfillment method for "{item.name}"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select
          value={item.fulfillmentMethod || 'ship-to-me'}
          onValueChange={handleFulfillmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select fulfillment method" />
          </SelectTrigger>
          <SelectContent>
            {fulfillmentOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  <span>{option.label} - {option.cost}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          {fulfillmentOptions
            .filter(opt => opt.value === (item.fulfillmentMethod || 'ship-to-me'))
            .map(option => (
              <FulfillmentOption
                key={option.value}
                method={option.value}
                icon={option.icon}
                label={option.label}
                description={option.description}
                cost={option.cost}
                delivery={option.delivery}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}