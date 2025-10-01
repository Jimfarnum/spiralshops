import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Truck, Store, MapPin, Clock, Package, Star } from 'lucide-react';

const DeliveryOptionsPage = () => {
  const [selectedOption, setSelectedOption] = useState('ship-to-me');

  const deliveryOptions = [
    {
      id: 'ship-to-me',
      title: 'Ship to Me',
      description: 'Standard home delivery',
      icon: Truck,
      estimatedTime: '3-5 business days',
      cost: '$5.99',
      features: ['Tracking included', 'Signature confirmation', 'Insurance coverage']
    },
    {
      id: 'in-store-pickup',
      title: 'In-Store Pickup',
      description: 'Pick up at the retailer location',
      icon: Store,
      estimatedTime: 'Ready in 2-4 hours',
      cost: 'FREE',
      features: ['No shipping fees', 'Immediate availability check', 'Personal assistance']
    },
    {
      id: 'spiral-center',
      title: 'SPIRAL Center Pickup',
      description: 'Pick up at nearest SPIRAL hub',
      icon: MapPin,
      estimatedTime: '1-2 business days',
      cost: '$2.99',
      features: ['Extended pickup hours', 'Secure storage', 'Multiple retailer consolidation']
    },
    {
      id: 'same-day',
      title: 'Same-Day Delivery',
      description: 'Express delivery within metro area',
      icon: Clock,
      estimatedTime: '2-6 hours',
      cost: '$12.99',
      features: ['Real-time tracking', 'Text notifications', 'Delivery window selection'],
      premium: true
    }
  ];

  const spiralCenters = [
    { name: 'Downtown SPIRAL Center', address: '123 Main St', distance: '0.8 miles', hours: '7 AM - 10 PM' },
    { name: 'Westside SPIRAL Hub', address: '456 Oak Ave', distance: '2.1 miles', hours: '8 AM - 9 PM' },
    { name: 'North Mall SPIRAL Point', address: '789 Pine Rd', distance: '3.4 miles', hours: '9 AM - 8 PM' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Delivery Options
          </h1>
          <p className="text-lg text-gray-600">
            Choose the delivery method that works best for you
          </p>
        </div>

        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-4">
          {deliveryOptions.map((option) => {
            const IconComponent = option.icon;
            
            return (
              <div key={option.id} className="relative">
                <Label htmlFor={option.id} className="cursor-pointer">
                  <Card className={`transition-all hover:shadow-lg ${
                    selectedOption === option.id ? 'ring-2 ring-teal-500 shadow-lg' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                        <IconComponent className="w-8 h-8 text-teal-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{option.title}</CardTitle>
                            {option.premium && (
                              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{option.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-teal-600">{option.cost}</div>
                          <div className="text-sm text-gray-500">{option.estimatedTime}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-12">
                        <ul className="space-y-1 text-sm text-gray-600">
                          {option.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-teal-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {/* SPIRAL Centers Details */}
        {selectedOption === 'spiral-center' && (
          <Card className="mt-6 bg-teal-50 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-800">Nearby SPIRAL Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spiralCenters.map((center, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <h4 className="font-semibold text-gray-900">{center.name}</h4>
                      <p className="text-sm text-gray-600">{center.address}</p>
                      <p className="text-sm text-gray-500">Hours: {center.hours}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-teal-600">{center.distance}</div>
                      <Button size="sm" variant="outline" className="mt-1">
                        Select This Location
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-gradient-to-r from-teal-600 to-teal-700">
            <Truck className="w-5 h-5 mr-2" />
            Continue with {deliveryOptions.find(opt => opt.id === selectedOption)?.title}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• All delivery times are estimates and may vary based on location and retailer availability</li>
            <li>• SPIRAL Centers offer secure package storage for up to 7 days</li>
            <li>• Same-day delivery available in select metro areas only</li>
            <li>• Additional fees may apply for oversized or special handling items</li>
            <li>• Free shipping promotions may override standard delivery fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptionsPage;