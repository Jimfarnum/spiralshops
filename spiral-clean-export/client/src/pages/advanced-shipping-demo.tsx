import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Truck, Home, Store, Clock, MapPin, Package, Calendar, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShippingAddress {
  id: string;
  label: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  estimatedDate: string;
  icon: any;
  available: boolean;
  features: string[];
}

interface Product {
  id: string;
  title: string;
  price: number;
  storeName: string;
  storeId: number;
  category: string;
  quantity: number;
  availabilityOptions: {
    sameDay: boolean;
    nextDay: boolean;
    standard: boolean;
    pickup: boolean;
  };
}

const SAMPLE_ADDRESSES: ShippingAddress[] = [
  {
    id: '1',
    label: 'Home',
    name: 'John Smith',
    address: '123 Main Street',
    city: 'Minneapolis',
    state: 'MN',
    zip: '55401',
    isDefault: true
  },
  {
    id: '2',
    label: 'Work Office',
    name: 'John Smith',
    address: '456 Business Ave, Suite 200',
    city: 'St. Paul',
    state: 'MN',
    zip: '55102',
    isDefault: false
  },
  {
    id: '3',
    label: 'Mom\'s House',
    name: 'Mary Smith',
    address: '789 Elm Street',
    city: 'Bloomington',
    state: 'MN',
    zip: '55431',
    isDefault: false
  },
  {
    id: '4',
    label: 'Vacation Home',
    name: 'John & Jane Smith',
    address: '321 Lake View Drive',
    city: 'Minnetonka',
    state: 'MN',
    zip: '55345',
    isDefault: false
  }
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    price: 89.99,
    storeName: 'Twin Cities Tech Hub',
    storeId: 1,
    category: 'Electronics',
    quantity: 1,
    availabilityOptions: {
      sameDay: true,
      nextDay: true,
      standard: true,
      pickup: true
    }
  },
  {
    id: '2',
    title: 'Premium Coffee Beans (Dark Roast)',
    price: 24.99,
    storeName: 'Mississippi River Coffee',
    storeId: 2,
    category: 'Food & Beverage',
    quantity: 2,
    availabilityOptions: {
      sameDay: false,
      nextDay: true,
      standard: true,
      pickup: true
    }
  },
  {
    id: '3',
    title: 'Cotton Casual T-Shirt',
    price: 19.99,
    storeName: 'North Loop Fashion Co.',
    storeId: 3,
    category: 'Clothing',
    quantity: 1,
    availabilityOptions: {
      sameDay: false,
      nextDay: false,
      standard: true,
      pickup: true
    }
  }
];

export default function AdvancedShippingDemo() {
  const [selectedAddress, setSelectedAddress] = useState<{ [productId: string]: string }>({});
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<{ [productId: string]: string }>({});
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const getDeliveryOptions = (product: Product, addressId: string): DeliveryOption[] => {
    const address = SAMPLE_ADDRESSES.find(a => a.id === addressId);
    const isLocal = address?.city === 'Minneapolis' || address?.city === 'St. Paul';
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);
    const fiveDays = new Date();
    fiveDays.setDate(fiveDays.getDate() + 5);

    const options: DeliveryOption[] = [];

    if (product.availabilityOptions.sameDay && isLocal) {
      options.push({
        id: 'same-day',
        name: 'Same Day Delivery',
        description: 'Order by 2 PM, delivered by 8 PM today',
        price: 15.99,
        estimatedDays: 'Today',
        estimatedDate: new Date().toLocaleDateString(),
        icon: Clock,
        available: true,
        features: ['Fastest option', 'Local delivery only', 'Order by 2 PM']
      });
    }

    if (product.availabilityOptions.nextDay) {
      options.push({
        id: 'next-day',
        name: 'Next Day Delivery',
        description: 'Guaranteed delivery by end of next business day',
        price: 9.99,
        estimatedDays: '1 business day',
        estimatedDate: tomorrow.toLocaleDateString(),
        icon: Truck,
        available: true,
        features: ['Guaranteed delivery', 'Tracking included', 'Signature required']
      });
    }

    if (product.availabilityOptions.standard) {
      options.push({
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Free shipping on orders over $50',
        price: selectedAddress && Object.keys(selectedAddress).length > 0 ? 4.99 : 0,
        estimatedDays: '3-5 business days',
        estimatedDate: `${threeDays.toLocaleDateString()} - ${fiveDays.toLocaleDateString()}`,
        icon: Package,
        available: true,
        features: ['Most economical', 'Reliable service', 'Tracking included']
      });
    }

    if (product.availabilityOptions.pickup) {
      options.push({
        id: 'pickup',
        name: 'Store Pickup',
        description: `Pick up at ${product.storeName}`,
        price: 0,
        estimatedDays: 'Ready in 2 hours',
        estimatedDate: 'Today',
        icon: Store,
        available: true,
        features: ['Free option', 'No shipping fees', 'Ready quickly']
      });
    }

    return options;
  };

  const calculateTotal = () => {
    let subtotal = SAMPLE_PRODUCTS.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    let shippingTotal = 0;

    SAMPLE_PRODUCTS.forEach(product => {
      const addressId = selectedAddress[product.id];
      const optionId = selectedDeliveryOption[product.id];
      if (addressId && optionId) {
        const options = getDeliveryOptions(product, addressId);
        const option = options.find(o => o.id === optionId);
        if (option) {
          shippingTotal += option.price;
        }
      }
    });

    const tax = subtotal * 0.08;
    return { subtotal, shipping: shippingTotal, tax, total: subtotal + shippingTotal + tax };
  };

  const handleAddressSelect = (productId: string, addressId: string) => {
    setSelectedAddress(prev => ({ ...prev, [productId]: addressId }));
    // Reset delivery option when address changes
    setSelectedDeliveryOption(prev => ({ ...prev, [productId]: '' }));
  };

  const handleDeliveryOptionSelect = (productId: string, optionId: string) => {
    setSelectedDeliveryOption(prev => ({ ...prev, [productId]: optionId }));
  };

  const isConfigurationComplete = () => {
    return SAMPLE_PRODUCTS.every(product => 
      selectedAddress[product.id] && selectedDeliveryOption[product.id]
    );
  };

  const processOrder = () => {
    if (!isConfigurationComplete()) {
      toast({
        title: "Configuration Required",
        description: "Please select delivery options for all items",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Order Processed Successfully!",
      description: `Your multi-address, multi-delivery order has been placed`,
    });
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Shipping Options Demo
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Multiple addresses, delivery speeds, and pickup options
          </p>
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-800 border-blue-200">
            {SAMPLE_PRODUCTS.length} products with flexible delivery
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Order Overview</TabsTrigger>
            <TabsTrigger value="addresses">Shipping Addresses</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Options</TabsTrigger>
            <TabsTrigger value="summary">Order Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Products in Your Cart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {SAMPLE_PRODUCTS.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                      <div>
                        <h4 className="font-medium">{product.title}</h4>
                        <p className="text-sm text-gray-600">{product.storeName}</p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                        
                        {/* Availability indicators */}
                        <div className="flex gap-2 mt-2">
                          {product.availabilityOptions.sameDay && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Same Day Available
                            </Badge>
                          )}
                          {product.availabilityOptions.nextDay && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              Next Day Available
                            </Badge>
                          )}
                          {product.availabilityOptions.pickup && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                              Store Pickup Available
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#006d77]">
                          ${(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Available Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {SAMPLE_ADDRESSES.map(address => (
                    <div key={address.id} className="p-4 border rounded-lg mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{address.label}</h4>
                        {address.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.name}</p>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Delivery Address for Each Product</CardTitle>
              </CardHeader>
              <CardContent>
                {SAMPLE_PRODUCTS.map(product => (
                  <div key={product.id} className="p-4 border rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{product.title}</h4>
                        <p className="text-sm text-gray-600">{product.storeName}</p>
                      </div>
                      <p className="font-semibold">${product.price.toFixed(2)}</p>
                    </div>

                    <Select 
                      value={selectedAddress[product.id] || ''} 
                      onValueChange={(value) => handleAddressSelect(product.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping address" />
                      </SelectTrigger>
                      <SelectContent>
                        {SAMPLE_ADDRESSES.map(address => (
                          <SelectItem key={address.id} value={address.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{address.label}</span>
                              <span className="text-sm text-gray-600">
                                {address.address}, {address.city}, {address.state}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Delivery Method for Each Product</CardTitle>
              </CardHeader>
              <CardContent>
                {SAMPLE_PRODUCTS.map(product => {
                  const addressId = selectedAddress[product.id];
                  const deliveryOptions = addressId ? getDeliveryOptions(product, addressId) : [];
                  
                  return (
                    <div key={product.id} className="p-4 border rounded-lg mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{product.title}</h4>
                          <p className="text-sm text-gray-600">{product.storeName}</p>
                          {addressId && (
                            <p className="text-sm text-blue-600">
                              Shipping to: {SAMPLE_ADDRESSES.find(a => a.id === addressId)?.label}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                      </div>

                      {!addressId ? (
                        <p className="text-sm text-gray-500 italic">
                          Please select a shipping address first
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {deliveryOptions.map(option => {
                            const Icon = option.icon;
                            const isSelected = selectedDeliveryOption[product.id] === option.id;
                            
                            return (
                              <div
                                key={option.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                  isSelected ? 'border-[#006d77] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleDeliveryOptionSelect(product.id, option.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <Icon className="w-5 h-5 text-[#006d77] mt-1" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h5 className="font-medium">{option.name}</h5>
                                      <span className="font-semibold text-[#006d77]">
                                        {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Calendar className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm font-medium">{option.estimatedDays}</span>
                                      <span className="text-sm text-gray-600">({option.estimatedDate})</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {option.features.map((feature, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Configuration Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {SAMPLE_PRODUCTS.map(product => {
                      const addressId = selectedAddress[product.id];
                      const optionId = selectedDeliveryOption[product.id];
                      const address = SAMPLE_ADDRESSES.find(a => a.id === addressId);
                      const deliveryOptions = addressId ? getDeliveryOptions(product, addressId) : [];
                      const selectedOption = deliveryOptions.find(o => o.id === optionId);

                      return (
                        <div key={product.id} className="p-4 border rounded-lg mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{product.title}</h4>
                            <p className="font-semibold">${product.price.toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{product.storeName}</p>
                          
                          {address && selectedOption ? (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Home className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">
                                  {selectedOption.name} to {address.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {address.address}, {address.city}, {address.state}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-green-700">{selectedOption.estimatedDays}</span>
                                <span className="text-sm font-medium">
                                  {selectedOption.price === 0 ? 'FREE' : `$${selectedOption.price.toFixed(2)}`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <p className="text-sm text-yellow-800">Configuration incomplete</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${totals.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${totals.tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-[#006d77]">${totals.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={processOrder}
                      disabled={!isConfigurationComplete()}
                      className="w-full mt-6 bg-[#006d77] hover:bg-[#005a5f]"
                    >
                      {isConfigurationComplete() ? 'Complete Order' : 'Configure All Items'}
                    </Button>

                    {!isConfigurationComplete() && (
                      <p className="text-sm text-gray-500 text-center mt-2">
                        Select addresses and delivery options for all items
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}