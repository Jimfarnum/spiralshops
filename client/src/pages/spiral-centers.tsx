import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Package, Truck, Clock, Phone, Mail, Building, Users, TrendingUp, Activity } from 'lucide-react';

interface SpiralCenter {
  id: number;
  name: string;
  code: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: string;
  longitude?: string;
  mallId?: number;
  capacity: number;
  operatingHours: string;
  services: string[];
  status: string;
  managerName?: string;
  phone?: string;
  email?: string;
  currentInventory: number;
  weeklyShipments: number;
  createdAt: Date;
  updatedAt: Date;
}

interface NetworkStats {
  totalCenters: number;
  activeCenters: number;
  totalCapacity: number;
  averageUtilization: string;
  weeklyShipments: number;
}

export default function SpiralCenters() {
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    state: '',
    status: 'active'
  });
  const [trackingNumber, setTrackingNumber] = useState('');

  const { data: centersData, isLoading } = useQuery({
    queryKey: ['/api/spiral-centers', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`/api/spiral-centers?${params}`);
      return response.json();
    }
  });

  const { data: networkData, isLoading: networkLoading } = useQuery({
    queryKey: ['/api/spiral-centers/network-map'],
    queryFn: async () => {
      const response = await fetch('/api/spiral-centers/network-map');
      return response.json();
    }
  });

  const centers: SpiralCenter[] = centersData?.centers || [];
  const networkStats: NetworkStats = centersData?.networkStats || {
    totalCenters: 0,
    activeCenters: 0,
    totalCapacity: 0,
    averageUtilization: '0%',
    weeklyShipments: 0
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mall': return <Building className="w-4 h-4" />;
      case 'mainstreet': return <MapPin className="w-4 h-4" />;
      case 'hub': return <Package className="w-4 h-4" />;
      case 'distribution': return <Truck className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mall': return 'bg-blue-100 text-blue-800';
      case 'mainstreet': return 'bg-green-100 text-green-800';
      case 'hub': return 'bg-purple-100 text-purple-800';
      case 'distribution': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackShipment = async () => {
    if (!trackingNumber.trim()) return;
    
    try {
      const response = await fetch(`/api/spiral-centers/shipments/track/${trackingNumber}`);
      const data = await response.json();
      
      if (data.success) {
        // Handle tracking data display
        console.log('Tracking data:', data.tracking);
      }
    } catch (error) {
      console.error('Error tracking shipment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SPIRAL Centers Network</h1>
            <p className="text-gray-600">
              Logistics hubs enabling efficient shipping between centers and enhanced local delivery options
            </p>
          </div>
          <Link href="/spiral-centers-subscription-demo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              View Subscription Integration Demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Centers</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.totalCenters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Centers</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.activeCenters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.totalCapacity.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.averageUtilization}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.weeklyShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="centers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="centers">Centers Directory</TabsTrigger>
          <TabsTrigger value="network">Network Map</TabsTrigger>
          <TabsTrigger value="tracking">Shipment Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="centers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Center Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="mall">Mall Centers</SelectItem>
                    <SelectItem value="mainstreet">Main Street</SelectItem>
                    <SelectItem value="hub">Hubs</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                />

                <Input
                  placeholder="State (e.g., MN)"
                  value={filters.state}
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  maxLength={2}
                />

                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Centers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{center.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary" className={getTypeColor(center.type)}>
                          {getTypeIcon(center.type)}
                          {center.type.charAt(0).toUpperCase() + center.type.slice(1)}
                        </Badge>
                        <span className="text-sm font-mono">{center.code}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={center.status === 'active' ? 'default' : 'secondary'}>
                      {center.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{center.address}</p>
                      <p>{center.city}, {center.state} {center.zipCode}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-600">Capacity</p>
                      <p className="text-lg font-semibold">{center.capacity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Current Stock</p>
                      <p className="text-lg font-semibold">{center.currentInventory}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{center.operatingHours}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {center.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {center.managerName && (
                    <div className="border-t pt-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{center.managerName}</span>
                      </div>
                      {center.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{center.phone}</span>
                        </div>
                      )}
                      {center.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{center.email}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SPIRAL Centers Network Map</CardTitle>
              <CardDescription>
                Visual representation of center locations and shipping routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600">Interactive Network Map</p>
                  <p className="text-sm text-gray-500">
                    Shows {networkData?.network?.centers?.length || 0} centers with active shipping routes
                  </p>
                  {!networkLoading && networkData?.network && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Active Shipments: {networkData.network.activeShipments}</p>
                      <p>Network Health: {networkData.network.networkHealth}</p>
                      <p>Average Delivery: {networkData.network.averageDeliveryTime}</p>
                      <p>On-Time Rate: {networkData.network.onTimePercentage}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Shipment</CardTitle>
              <CardDescription>
                Enter a tracking number to view shipment status and location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter tracking number (e.g., SP2025013100001)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTrackShipment}>
                  Track Shipment
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Sample tracking numbers for demo:
                </p>
                <div className="mt-2 space-y-1">
                  <code className="text-xs bg-white px-2 py-1 rounded block">SP2025013100001</code>
                  <code className="text-xs bg-white px-2 py-1 rounded block">SP2025013100002</code>
                  <code className="text-xs bg-white px-2 py-1 rounded block">SP2025013100003</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Delivery Time</span>
                    <span className="text-lg font-semibold">18.5 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">On-Time Delivery Rate</span>
                    <span className="text-lg font-semibold text-green-600">96.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Network Utilization</span>
                    <span className="text-lg font-semibold">{networkStats.averageUtilization}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weekly Throughput</span>
                    <span className="text-lg font-semibold">{networkStats.weeklyShipments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Center Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['mall', 'mainstreet', 'hub', 'distribution'].map((type) => {
                    const count = centers.filter(c => c.type === type).length;
                    const percentage = centers.length > 0 ? (count / centers.length * 100).toFixed(0) : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(type)}
                          <span className="text-sm capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}