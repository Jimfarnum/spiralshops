import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, MapPin, Building } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

interface SplitShippingProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

const SplitShipping: React.FC<SplitShippingProps> = ({ formData, setFormData, errors }) => {
  const { items } = useCartStore();

  const handleItemFulfillmentChange = (itemId: string, method: string) => {
    setFormData((prev: any) => ({
      ...prev,
      itemFulfillmentMethods: {
        ...prev.itemFulfillmentMethods,
        [itemId]: method
      }
    }));
  };

  const getFulfillmentIcon = (method: string) => {
    switch (method) {
      case 'ship-to-me':
        return <Package className="h-4 w-4" />;
      case 'in-store-pickup':
        return <MapPin className="h-4 w-4" />;
      case 'ship-to-mall':
        return <Building className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getFulfillmentMessage = (method: string) => {
    switch (method) {
      case 'ship-to-me':
        return 'Ships in 2-3 business days';
      case 'in-store-pickup':
        return 'Ready for pickup today!';
      case 'ship-to-mall':
        return 'Ready at mall in 1-2 days';
      default:
        return 'Ships in 2-3 business days';
    }
  };

  const getFulfillmentColor = (method: string) => {
    switch (method) {
      case 'ship-to-me':
        return 'bg-blue-100 text-blue-800';
      case 'in-store-pickup':
        return 'bg-green-100 text-green-800';
      case 'ship-to-mall':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
          Item Fulfillment Options
        </h3>
        <Badge variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)]">
          Split Shipping Available
        </Badge>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const itemMethod = formData.itemFulfillmentMethods[item.id] || formData.fulfillmentMethod;
          
          return (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-medium text-[var(--spiral-navy)] font-['Poppins']">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Qty: {item.quantity} • ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Select 
                        value={itemMethod} 
                        onValueChange={(value) => handleItemFulfillmentChange(item.id.toString(), value)}
                      >
                        <SelectTrigger className="w-full rounded-lg">
                          <div className="flex items-center gap-2">
                            {getFulfillmentIcon(itemMethod)}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ship-to-me">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Ship to Me
                            </div>
                          </SelectItem>
                          <SelectItem value="in-store-pickup">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              In-Store Pickup
                            </div>
                          </SelectItem>
                          <SelectItem value="ship-to-mall">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Ship to Mall
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getFulfillmentColor(itemMethod)}`}>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getFulfillmentMessage(itemMethod)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--spiral-sage)]/10 rounded-lg p-4 border border-[var(--spiral-sage)]/20">
        <p className="text-sm text-[var(--spiral-navy)] font-['Inter']">
          <strong>💡 Pro Tip:</strong> Choose different fulfillment methods for each item to get the best delivery timeline and earn maximum SPIRALs!
        </p>
      </div>
    </div>
  );
};

export default SplitShipping;