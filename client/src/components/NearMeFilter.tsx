import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Navigation, Target, Sliders, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  distance: number;
  lat: number;
  lng: number;
  rating: string;
  isVerified: boolean;
  directionsUrl: string;
}

interface NearMeFilterProps {
  onStoresFound?: (stores: Store[]) => void;
  className?: string;
}

export default function NearMeFilter({ onStoresFound, className }: NearMeFilterProps) {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [radius, setRadius] = useState([10]); // Slider uses array
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const categories = ['Electronics', 'Fashion', 'Coffee', 'Jewelry', 'Sports', 'Music'];

  // Get user's current location
  const getUserLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setIsGettingLocation(false);
        
        toast({
          title: "Location found",
          description: `Found your location within ${position.coords.accuracy}m accuracy`,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
        
        // Fallback to Minneapolis for demo
        const fallbackLocation = { lat: 44.9537, lng: -93.0900 };
        setUserLocation(fallbackLocation);
        
        toast({
          title: "Using demo location",
          description: "Using Minneapolis, MN as demo location",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Search nearby stores
  const { data: nearbyData, isLoading, refetch } = useQuery({
    queryKey: ['nearby-stores', userLocation, radius[0], selectedCategories, showVerifiedOnly],
    queryFn: () => {
      if (!userLocation) return null;
      
      const params = new URLSearchParams({
        radius: radius[0].toString(),
        limit: '25'
      });
      
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories.join(','));
      }

      return fetch(`/api/maps/near-me/${userLocation.lat}/${userLocation.lng}?${params}`)
        .then(res => res.json());
    },
    enabled: !!userLocation,
  });

  // Smart proximity search for advanced filtering
  const { data: smartData, refetch: refetchSmart } = useQuery({
    queryKey: ['smart-proximity', userLocation, radius[0], selectedCategories, showVerifiedOnly],
    queryFn: () => {
      if (!userLocation) return null;
      
      return fetch('/api/maps/smart-proximity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLat: userLocation.lat,
          userLng: userLocation.lng,
          filters: {
            radius: radius[0],
            categories: selectedCategories,
            isVerified: showVerifiedOnly ? true : null
          }
        })
      }).then(res => res.json());
    },
    enabled: !!userLocation && (selectedCategories.length > 0 || showVerifiedOnly),
  });

  const stores = smartData?.success ? smartData.data.stores : nearbyData?.success ? nearbyData.data.stores : [];
  const suggestions = smartData?.data?.suggestions;

  // Notify parent component when stores are found
  useEffect(() => {
    if (stores && onStoresFound) {
      onStoresFound(stores);
    }
  }, [stores, onStoresFound]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  };

  const openDirections = (store: Store) => {
    window.open(store.directionsUrl, '_blank');
    toast({
      title: "Directions opened",
      description: `Getting directions to ${store.name}`,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setShowVerifiedOnly(false);
    setRadius([10]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Location Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Find Stores Near Me
          </CardTitle>
          <CardDescription>
            Search for stores within your preferred radius
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!userLocation ? (
            <Button 
              onClick={getUserLocation} 
              disabled={isGettingLocation}
              className="w-full"
            >
              {isGettingLocation ? (
                <>Getting Location...</>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Get My Location
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
              <Button variant="outline" size="sm" onClick={getUserLocation}>
                Update Location
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Filters */}
      {userLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Search Filters
            </CardTitle>
            <CardDescription>
              Customize your search preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Radius Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Search Radius</Label>
                <span className="text-sm font-medium">{radius[0]} miles</span>
              </div>
              <Slider
                value={radius}
                onValueChange={setRadius}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Category Filters */}
            <div className="space-y-3">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                    />
                    <Label htmlFor={category} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={showVerifiedOnly}
                onCheckedChange={(checked) => setShowVerifiedOnly(!!checked)}
              />
              <Label htmlFor="verified" className="text-sm">
                Verified stores only
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
              <Button onClick={() => refetch()} size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {userLocation && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isLoading ? 'Searching...' : `Found ${stores?.length || 0} stores`}
            </CardTitle>
            {suggestions && (
              <CardDescription>
                Within {radius[0]} miles • Closest: {suggestions.closestStore?.name || 'None'} 
                ({suggestions.closestStore?.distance.toFixed(1)}mi)
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : stores?.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stores.map((store: Store) => (
                  <div key={store.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{store.name}</h4>
                        <p className="text-sm text-gray-600">{store.category}</p>
                        <p className="text-xs text-gray-500">{store.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {store.distance}mi away
                          </Badge>
                          {store.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDirections(store)}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Go
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : userLocation ? (
              <p className="text-gray-500 text-center py-4">
                No stores found within {radius[0]} miles. Try expanding your search radius.
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Smart Suggestions */}
      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Smart Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.recommendedRadius !== radius[0] && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Try searching within {suggestions.recommendedRadius} miles for more options
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setRadius([suggestions.recommendedRadius])}
                >
                  Use Suggested Radius
                </Button>
              </div>
            )}
            
            {suggestions.popularNearby?.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Popular Nearby</h5>
                <div className="flex flex-wrap gap-2">
                  {suggestions.popularNearby.map((store: Store) => (
                    <Badge key={store.id} variant="secondary" className="cursor-pointer">
                      {store.name} ({store.distance}mi)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}