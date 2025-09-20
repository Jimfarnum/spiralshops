import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MallFeatureToggles from "@/components/MallFeatureToggles";
import { 
  Building2,
  Settings2,
  Users,
  BarChart3,
  ShoppingBag,
  MapPin,
  Search
} from 'lucide-react';

export default function MallDashboard() {
  const [mallId, setMallId] = useState("westfield_center_123"); // Default mall ID for demo
  const [customMallId, setCustomMallId] = useState("");

  const handleMallIdChange = () => {
    if (customMallId.trim()) {
      setMallId(customMallId.trim());
    }
  };

  const predefinedMalls = [
    { id: "westfield_center_123", name: "Westfield Shopping Center", location: "Minneapolis, MN" },
    { id: "southdale_mall_456", name: "Southdale Center", location: "Edina, MN" },
    { id: "mall_of_america_789", name: "Mall of America", location: "Bloomington, MN" },
    { id: "ridgedale_center_101", name: "Ridgedale Center", location: "Minnetonka, MN" },
    { id: "rosedale_center_202", name: "Rosedale Center", location: "Roseville, MN" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Mall Manager Dashboard</h1>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            SPIRAL Platform v2.0
          </Badge>
        </div>

        {/* Mall Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Mall Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {predefinedMalls.map((mall) => (
                <Button
                  key={mall.id}
                  onClick={() => setMallId(mall.id)}
                  variant={mallId === mall.id ? "default" : "outline"}
                  className="h-auto p-3 text-left justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">{mall.name}</div>
                    <div className="text-xs opacity-70">{mall.location}</div>
                    <div className="text-xs opacity-50">ID: {mall.id}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Input
                placeholder="Enter custom Mall ID (e.g., custom_mall_456)"
                value={customMallId}
                onChange={(e) => setCustomMallId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleMallIdChange} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Load Mall
              </Button>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Current Mall ID: <strong>{mallId}</strong></span>
              <span>Feature settings apply to this mall only</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-gray-500">Active Retailers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,250</div>
              <div className="text-sm text-gray-500">Daily Shoppers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">87%</div>
              <div className="text-sm text-gray-500">Feature Adoption</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Settings2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">Grade A</div>
              <div className="text-sm text-gray-500">System Health</div>
            </CardContent>
          </Card>
        </div>

        {/* Mall Feature Controls */}
        <MallFeatureToggles mallId={mallId} />

        {/* Footer Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 text-center">
              <p>
                <strong>Mall Feature Management System</strong> - Control which SPIRAL features are available 
                in your mall. Changes take effect immediately and apply to all retailers and shoppers 
                within this mall location.
              </p>
              <p className="mt-2">
                Need help? Contact SPIRAL support at{" "}
                <span className="text-blue-600">support@spiral.com</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}