import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Package, DollarSign, Clock, Store } from 'lucide-react';

interface SearchResult {
  inventoryId: number;
  retailerId: number;
  retailerName: string;
  sku: string;
  title: string;
  quantity: number;
  price: string;
  category: string;
  brand: string;
  condition: string;
  distance: number | null;
  retailerAddress: string;
  allowPartnerFulfillment: boolean;
}

interface SearchParams {
  sku?: string;
  title?: string;
  category?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  maxPrice?: number;
}

export default function CrossRetailerSearch() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    radius: 25
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setSearchParams(prev => ({ ...prev, ...location }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Search query
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['cross-retailer-search', searchParams],
    queryFn: async () => {
      if (!hasSearched) return null;
      
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/cross-retailer/search?${params}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    },
    enabled: hasSearched
  });

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleQuickOrder = async (result: SearchResult) => {
    if (!userLocation) {
      alert('Please enable location access for delivery routing');
      return;
    }

    try {
      const routingResponse = await fetch('/api/cross-retailer/route-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: result.sku,
          quantity: 1,
          customerLat: userLocation.lat,
          customerLng: userLocation.lng,
          preferredRetailerId: result.retailerId
        })
      });

      const routingData = await routingResponse.json();
      
      if (routingData.success) {
        alert(`Order routed to ${routingData.routing.selectedRetailer.name}! Estimated delivery: ${routingData.routing.selectedRetailer.estimatedDeliveryTime} minutes`);
      } else {
        alert('Failed to route order: ' + routingData.message);
      }
    } catch (error) {
      console.error('Order routing error:', error);
      alert('Failed to process order routing');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Cross-Retailer Inventory Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Search by SKU"
              value={searchParams.sku || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, sku: e.target.value }))}
            />
            <Input
              placeholder="Product title"
              value={searchParams.title || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Category"
              value={searchParams.category || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, category: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Max price"
              value={searchParams.maxPrice || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) || undefined }))}
            />
            <Input
              type="number"
              placeholder="Search radius (miles)"
              value={searchParams.radius || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, radius: parseInt(e.target.value) || 25 }))}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={getUserLocation}
              variant="outline"
              disabled={!!userLocation}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {userLocation ? 'Location Detected' : 'Get My Location'}
            </Button>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search Inventory'}
            </Button>
          </div>

          {userLocation && (
            <p className="text-sm text-muted-foreground">
              Searching within {searchParams.radius} miles of your location
            </p>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <p className="text-sm text-muted-foreground">
              Found {searchResults.totalResults} items • {searchResults.searchedArea}
            </p>
          </CardHeader>
          <CardContent>
            {searchResults.results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No products found matching your criteria
              </p>
            ) : (
              <div className="space-y-4">
                {searchResults.results.map((result: SearchResult) => (
                  <Card key={`${result.retailerId}-${result.inventoryId}`} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg">{result.title}</h3>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">${result.price}</p>
                              {result.distance && (
                                <p className="text-sm text-muted-foreground">
                                  {result.distance.toFixed(1)} miles away
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Store className="h-4 w-4" />
                              {result.retailerName}
                            </span>
                            <span>SKU: {result.sku}</span>
                            {result.brand && <span>Brand: {result.brand}</span>}
                            {result.category && <span>Category: {result.category}</span>}
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant={result.quantity > 10 ? "default" : result.quantity > 0 ? "secondary" : "destructive"}>
                              {result.quantity} in stock
                            </Badge>
                            <Badge variant="outline">{result.condition}</Badge>
                            {result.allowPartnerFulfillment && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Cross-delivery available
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            📍 {result.retailerAddress}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Store
                          </Button>
                          <Button variant="outline" size="sm">
                            Check Availability
                          </Button>
                        </div>
                        <Button 
                          onClick={() => handleQuickOrder(result)}
                          disabled={!userLocation || result.quantity === 0}
                          size="sm"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Quick Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <p className="text-red-600">
              Search failed: {error.message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}