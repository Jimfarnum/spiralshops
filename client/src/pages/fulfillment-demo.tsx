import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, MapPin, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  cost: number;
  icon: React.ReactNode;
  available: boolean;
}

interface ShippingCalculation {
  option: string;
  cost: number;
  estimatedDelivery: string;
  trackingAvailable: boolean;
}

export default function FulfillmentDemo() {
  const [selectedZip, setSelectedZip] = useState('55401');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [packageWeight, setPackageWeight] = useState(2.5);

  // Delivery options query
  const { data: deliveryOptions } = useQuery({
    queryKey: ['/api/fulfillment/delivery-options', selectedZip],
    initialData: [
      {
        id: 'fedex-ground',
        name: 'FedEx Ground',
        description: 'Reliable ground shipping',
        estimatedTime: '2-5 business days',
        cost: 8.99,
        icon: <Truck className="w-5 h-5" />,
        available: true
      },
      {
        id: 'fedex-express',
        name: 'FedEx Express',
        description: 'Next business day',
        estimatedTime: '1 business day',
        cost: 24.99,
        icon: <Package className="w-5 h-5" />,
        available: true
      },
      {
        id: 'usps-priority',
        name: 'USPS Priority',
        description: 'USPS Priority Mail',
        estimatedTime: '1-3 business days',
        cost: 12.50,
        icon: <Truck className="w-5 h-5" />,
        available: true
      },
      {
        id: 'local-pickup',
        name: 'Local Pickup',
        description: 'Pick up at store',
        estimatedTime: 'Ready in 2 hours',
        cost: 0,
        icon: <MapPin className="w-5 h-5" />,
        available: true
      },
      {
        id: 'spiral-center',
        name: 'SPIRAL Center',
        description: 'Mall pickup location',
        estimatedTime: 'Next business day',
        cost: 2.99,
        icon: <MapPin className="w-5 h-5" />,
        available: true
      }
    ] as DeliveryOption[]
  });

  // Shipping calculation mutation
  const shippingMutation = useMutation({
    mutationFn: async (data: { option: string; zipCode: string; weight: number }) => {
      const response = await fetch('/api/fulfillment/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });

  // Tracking lookup mutation
  const trackingMutation = useMutation({
    mutationFn: async (trackingNumber: string) => {
      const response = await fetch(`/api/fulfillment/track/${trackingNumber}`);
      return response.json();
    },
  });

  const handleCalculateShipping = () => {
    if (selectedOption) {
      shippingMutation.mutate({
        option: selectedOption,
        zipCode: selectedZip,
        weight: packageWeight
      });
    }
  };

  const handleTrackPackage = () => {
    trackingMutation.mutate('1Z12345E0205271688');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Truck className="inline-block w-10 h-10 text-purple-600 mr-3" />
            Multi-Option Fulfillment Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced delivery system with FedEx, USPS, local pickup, and SPIRAL Center routing
          </p>
        </div>

        <Tabs defaultValue="delivery-options" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="delivery-options">Delivery Options</TabsTrigger>
            <TabsTrigger value="shipping-calculator">Shipping Calculator</TabsTrigger>
            <TabsTrigger value="tracking">Package Tracking</TabsTrigger>
            <TabsTrigger value="routing">Smart Routing</TabsTrigger>
          </TabsList>

          <TabsContent value="delivery-options">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliveryOptions?.map((option) => (
                <Card key={option.id} className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedOption === option.id ? 'ring-2 ring-purple-500' : ''
                }`} onClick={() => setSelectedOption(option.id)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        {option.icon}
                        <span className="ml-2">{option.name}</span>
                      </div>
                      {option.available ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Estimated Time:</span>
                        <Badge variant="outline">{option.estimatedTime}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cost:</span>
                        <span className="font-bold text-lg">
                          {option.cost === 0 ? 'FREE' : `$${option.cost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="pt-2">
                        <Badge 
                          variant={option.available ? "default" : "destructive"}
                          className="w-full justify-center"
                        >
                          {option.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedOption && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Selected Option</h3>
                    <p className="text-gray-600">
                      {deliveryOptions?.find(opt => opt.id === selectedOption)?.name} - 
                      {deliveryOptions?.find(opt => opt.id === selectedOption)?.estimatedTime}
                    </p>
                    <Button className="mt-4">Continue with this option</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="shipping-calculator">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Calculator</CardTitle>
                  <CardDescription>Calculate shipping costs based on destination and package details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination ZIP Code</label>
                    <Select value={selectedZip} onValueChange={setSelectedZip}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="55401">55401 (Minneapolis, MN)</SelectItem>
                        <SelectItem value="10001">10001 (New York, NY)</SelectItem>
                        <SelectItem value="90210">90210 (Beverly Hills, CA)</SelectItem>
                        <SelectItem value="60601">60601 (Chicago, IL)</SelectItem>
                        <SelectItem value="33101">33101 (Miami, FL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Package Weight (lbs)</label>
                    <Select value={packageWeight.toString()} onValueChange={(value) => setPackageWeight(parseFloat(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5 lbs</SelectItem>
                        <SelectItem value="1.0">1.0 lbs</SelectItem>
                        <SelectItem value="2.5">2.5 lbs</SelectItem>
                        <SelectItem value="5.0">5.0 lbs</SelectItem>
                        <SelectItem value="10.0">10.0 lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Method</label>
                    <Select value={selectedOption} onValueChange={setSelectedOption}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping method" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryOptions?.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name} - {option.estimatedTime}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleCalculateShipping}
                    disabled={!selectedOption || shippingMutation.isPending}
                    className="w-full"
                  >
                    {shippingMutation.isPending ? 'Calculating...' : 'Calculate Shipping'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {shippingMutation.data ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">Shipping Quote</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span>Method:</span>
                            <span className="font-medium">{shippingMutation.data.carrier}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span className="font-bold">${shippingMutation.data.cost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Delivery:</span>
                            <span>{shippingMutation.data.estimatedDelivery}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tracking:</span>
                            <Badge variant={shippingMutation.data.trackingAvailable ? "default" : "secondary"}>
                              {shippingMutation.data.trackingAvailable ? "Available" : "Not Available"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Book This Shipment</Button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Select options and calculate shipping to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Package Tracking</CardTitle>
                  <CardDescription>Track your packages across all carriers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tracking Number</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="1Z12345E0205271688"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue="1Z12345E0205271688"
                      />
                      <Button onClick={handleTrackPackage} disabled={trackingMutation.isPending}>
                        {trackingMutation.isPending ? 'Tracking...' : 'Track'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Sample Tracking Numbers:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>FedEx: 1234 5678 9012</p>
                      <p>UPS: 1Z12345E0205271688</p>
                      <p>USPS: 9400 1000 0000 0000 0000 00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tracking Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {trackingMutation.data ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Tracking #: {trackingMutation.data.trackingNumber}</span>
                          <Badge>{trackingMutation.data.status}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Carrier:</span>
                            <span>{trackingMutation.data.carrier}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Location:</span>
                            <span>{trackingMutation.data.currentLocation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Delivery:</span>
                            <span>{trackingMutation.data.expectedDelivery}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Tracking History:</h4>
                        {trackingMutation.data.events?.map((event: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.description}</p>
                              <p className="text-xs text-gray-600">{event.location} • {event.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter a tracking number to see package status</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routing">
            <Card>
              <CardHeader>
                <CardTitle>Smart Routing & Optimization</CardTitle>
                <CardDescription>Intelligent delivery routing based on destination, cost, and time preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Route Optimization</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Cost Optimization</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Automatically selects most cost-effective shipping
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Speed Optimization</span>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Prioritizes fastest delivery options
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Eco-Friendly</span>
                          <Badge variant="outline">Available</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Selects carbon-neutral shipping options
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Carrier Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">FedEx</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                          </div>
                          <span className="text-xs">94%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">USPS</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{width: '87%'}}></div>
                          </div>
                          <span className="text-xs">87%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Local Pickup</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '98%'}}></div>
                          </div>
                          <span className="text-xs">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Delivery Analytics</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">2.3 days</div>
                        <p className="text-xs text-gray-600">Average delivery time</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">96.2%</div>
                        <p className="text-xs text-gray-600">On-time delivery rate</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">$8.45</div>
                        <p className="text-xs text-gray-600">Average shipping cost</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}