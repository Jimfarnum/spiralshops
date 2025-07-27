import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Truck, DollarSign, Clock, Award, Package, MapPin, Zap, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShippingOption {
  carrierId: number;
  carrierName: string;
  carrierCode: string;
  serviceId: string;
  serviceName: string;
  estimatedDays: number;
  originalCost: number;
  finalCost: number;
  freeShippingApplied: boolean;
  freeShippingSource: string | null;
  reliabilityScore: number;
  features: string[];
  deliveryDate: string;
  savings: number;
}

interface OptimizationResult {
  recommendedOption: ShippingOption;
  allOptions: ShippingOption[];
  freeShippingOffer: any;
  analysis: {
    totalOptionsEvaluated: number;
    averageCost: number;
    potentialSavings: number;
    criteria: string;
    distance: number;
    isLocal: boolean;
  };
}

export default function ShippingOptimizationDemo() {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [carriers, setCarriers] = useState([]);
  const [freeOffers, setFreeOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('optimizer');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    originZip: '55401',
    destinationZip: '55102',
    weight: 2.5,
    orderValue: 125.00,
    retailerId: 1,
    urgency: 'standard',
    criteria: 'cost_effective'
  });

  useEffect(() => {
    loadCarriers();
    loadFreeOffers();
  }, []);

  const loadCarriers = async () => {
    try {
      const response = await fetch('/api/shipping/carriers');
      const data = await response.json();
      setCarriers(data.carriers || []);
    } catch (error) {
      console.error('Failed to load carriers:', error);
    }
  };

  const loadFreeOffers = async () => {
    try {
      const response = await fetch('/api/shipping/free-offers');
      const data = await response.json();
      setFreeOffers(data.offers || []);
    } catch (error) {
      console.error('Failed to load free offers:', error);
    }
  };

  const optimizeShipping = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/shipping/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: [{ category: 'electronics' }],
          dimensions: { length: 12, width: 9, height: 3 }
        })
      });
      
      const result = await response.json();
      setOptimizationResult(result);
      
      toast({
        title: "Shipping Optimized!",
        description: `Found ${result.analysis.totalOptionsEvaluated} options. Best: ${result.recommendedOption.carrierName}`
      });
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        title: "Optimization Failed",
        description: "Could not calculate shipping options",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCarrierIcon = (carrierCode: string) => {
    switch (carrierCode) {
      case 'USPS': return '📮';
      case 'UPS': return '🚚';
      case 'FEDEX': return '✈️';
      case 'DHL': return '🌍';
      case 'AMZL': return '📦';
      default: return '🚛';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days === 0) return 'bg-red-100 text-red-800';
    if (days === 1) return 'bg-orange-100 text-orange-800';
    if (days <= 3) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL Shipping Optimization Engine
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Multi-carrier analysis with free shipping detection
          </p>
          <Badge variant="outline" className="text-sm bg-green-50 text-green-800 border-green-200">
            Real-time cost comparison across 5+ carriers
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="optimizer">Shipping Optimizer</TabsTrigger>
            <TabsTrigger value="carriers">Available Carriers</TabsTrigger>
            <TabsTrigger value="free-offers">Free Shipping Offers</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Optimization Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Origin ZIP</label>
                        <Input
                          value={formData.originZip}
                          onChange={(e) => setFormData(prev => ({ ...prev, originZip: e.target.value }))}
                          placeholder="55401"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Destination ZIP</label>
                        <Input
                          value={formData.destinationZip}
                          onChange={(e) => setFormData(prev => ({ ...prev, destinationZip: e.target.value }))}
                          placeholder="55102"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Weight (lbs)</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Order Value ($)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.orderValue}
                          onChange={(e) => setFormData(prev => ({ ...prev, orderValue: parseFloat(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Urgency Level</label>
                      <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same_day">Same Day</SelectItem>
                          <SelectItem value="next_day">Next Day</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="economy">Economy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Optimization Criteria</label>
                      <Select value={formData.criteria} onValueChange={(value) => setFormData(prev => ({ ...prev, criteria: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cost_effective">Most Cost Effective</SelectItem>
                          <SelectItem value="fastest">Fastest Delivery</SelectItem>
                          <SelectItem value="most_reliable">Most Reliable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={optimizeShipping} 
                      disabled={loading}
                      className="w-full bg-[#006d77] hover:bg-[#005a5f]"
                    >
                      {loading ? 'Optimizing...' : 'Find Best Shipping Option'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {optimizationResult ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-[#006d77]" />
                          Recommended Option
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 border-2 border-[#006d77] rounded-lg bg-blue-50">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{getCarrierIcon(optimizationResult.recommendedOption.carrierCode)}</div>
                            <div>
                              <h3 className="font-bold text-lg">{optimizationResult.recommendedOption.serviceName}</h3>
                              <p className="text-gray-600">{optimizationResult.recommendedOption.carrierName}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge className={getUrgencyColor(optimizationResult.recommendedOption.estimatedDays)}>
                                  {optimizationResult.recommendedOption.estimatedDays === 0 ? 'Same Day' : `${optimizationResult.recommendedOption.estimatedDays} days`}
                                </Badge>
                                {optimizationResult.recommendedOption.freeShippingApplied && (
                                  <Badge className="bg-green-100 text-green-800">FREE SHIPPING</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#006d77]">
                              {optimizationResult.recommendedOption.finalCost === 0 ? 'FREE' : `$${optimizationResult.recommendedOption.finalCost.toFixed(2)}`}
                            </div>
                            {optimizationResult.recommendedOption.savings > 0 && (
                              <div className="text-sm text-green-600">
                                Saves ${optimizationResult.recommendedOption.savings.toFixed(2)}
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              Reliability: {(optimizationResult.recommendedOption.reliabilityScore * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>

                        {optimizationResult.recommendedOption.freeShippingSource && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Free shipping provided by:</strong> {optimizationResult.recommendedOption.freeShippingSource}
                            </p>
                          </div>
                        )}

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {optimizationResult.recommendedOption.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>All Available Options</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {optimizationResult.allOptions.map((option, idx) => (
                            <div key={idx} className={`p-4 border rounded-lg ${idx === 0 ? 'border-[#006d77] bg-blue-50' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{getCarrierIcon(option.carrierCode)}</span>
                                  <div>
                                    <h4 className="font-medium">{option.serviceName}</h4>
                                    <p className="text-sm text-gray-600">{option.carrierName}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold">
                                    {option.finalCost === 0 ? 'FREE' : `$${option.finalCost.toFixed(2)}`}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {option.estimatedDays === 0 ? 'Same Day' : `${option.estimatedDays} days`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Optimization Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#006d77]">{optimizationResult.analysis.totalOptionsEvaluated}</div>
                            <div className="text-sm text-gray-600">Options Evaluated</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#006d77]">${optimizationResult.analysis.averageCost.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">Average Cost</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">${optimizationResult.analysis.potentialSavings.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">Potential Savings</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{optimizationResult.analysis.distance} mi</div>
                            <div className="text-sm text-gray-600">Distance</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-medium text-gray-600">No optimization results yet</h3>
                      <p className="text-gray-500 mt-2">Configure your shipping parameters and click optimize to see results</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="carriers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Shipping Carriers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carriers.map((carrier: any) => (
                    <div key={carrier.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getCarrierIcon(carrier.code)}</span>
                        <div>
                          <h4 className="font-medium">{carrier.name}</h4>
                          <p className="text-sm text-gray-600">{carrier.code}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Same Day:</span>
                          <span className={carrier.supportsSameDay ? 'text-green-600' : 'text-gray-400'}>
                            {carrier.supportsSameDay ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Next Day:</span>
                          <span className={carrier.supportsNextDay ? 'text-green-600' : 'text-gray-400'}>
                            {carrier.supportsNextDay ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>International:</span>
                          <span className={carrier.supportsInternational ? 'text-green-600' : 'text-gray-400'}>
                            {carrier.supportsInternational ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Reliability:</span>
                          <span className="text-blue-600">{(carrier.reliabilityScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="free-offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Free Shipping Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freeOffers.map((offer: any) => (
                    <div key={offer.id} className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-800">{offer.entityName}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {offer.offeredBy.charAt(0).toUpperCase() + offer.offeredBy.slice(1)} Offer
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700 mb-2">{offer.terms}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Minimum Order:</span>
                          <span className="ml-2">{offer.minimumOrderValue ? `$${offer.minimumOrderValue.toFixed(2)}` : 'None'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Geographic:</span>
                          <span className="ml-2">{offer.eligibleZipCodes === 'nationwide' ? 'Nationwide' : 'Local only'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-600">Performance Analytics</h3>
                  <p className="text-gray-500 mt-2">Real-time carrier performance metrics and cost analysis</p>
                  <p className="text-sm text-gray-400 mt-4">Data includes on-time delivery rates, average costs, and damage rates</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}