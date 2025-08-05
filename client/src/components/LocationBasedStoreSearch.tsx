import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Filter, SortAsc, Target, Navigation2 } from 'lucide-react';
import { locationService, type LocationData, type Coordinates } from '@/services/locationService';
import LocationPermissionRequest from './LocationPermissionRequest';
import StoreCard from './store-card';

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  coordinates?: Coordinates;
  city: string;
  state: string;
  zipCode: string;
  rating: number;
  reviewCount: number;
  distance?: number;
  distanceText?: string;
  isVerified?: boolean;
  verificationTier?: string;
}

interface SearchFilters {
  query: string;
  category: string;
  radius: number;
  sortBy: string;
  city: string;
  state: string;
}

export default function LocationBasedStoreSearch() {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [showLocationRequest, setShowLocationRequest] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    radius: 10,
    sortBy: 'distance',
    city: '',
    state: ''
  });

  // Search stores using location API
  const { data: searchResults, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/location-search', userLocation, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.query) params.append('query', filters.query);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      
      if (userLocation?.coordinates) {
        params.append('latitude', userLocation.coordinates.latitude.toString());
        params.append('longitude', userLocation.coordinates.longitude.toString());
        params.append('radius', filters.radius.toString());
      }
      
      params.append('sortBy', filters.sortBy);
      
      const response = await fetch(`/api/location-search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to search stores');
      }
      return response.json();
    },
    enabled: false // Only run when user location is available or manual search is performed
  });

  const stores: Store[] = searchResults?.stores || [];
  const aiResults = searchResults?.aiResults;

  useEffect(() => {
    if (userLocation || filters.city || filters.state || filters.query) {
      refetch();
    }
  }, [userLocation, filters, refetch]);

  const handleLocationGranted = (location: LocationData) => {
    setUserLocation(location);
    setShowLocationRequest(false);
    
    // Update city/state from location
    if (location.city && location.state) {
      setFilters(prev => ({
        ...prev,
        city: location.city || '',
        state: location.state || ''
      }));
    }
  };

  const handleLocationDenied = () => {
    setShowLocationRequest(false);
  };

  const handleSearch = () => {
    refetch();
  };

  const updateFilter = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const categories = [
    'all', 'Department Store', 'Coffee Shop', 'Grocery', 'Electronics', 
    'Fashion', 'Restaurants', 'Health & Beauty', 'Home & Garden', 'Sports'
  ];

  if (showLocationRequest && !userLocation) {
    return (
      <div className="space-y-6">
        <LocationPermissionRequest
          onLocationGranted={handleLocationGranted}
          onLocationDenied={handleLocationDenied}
        />
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">Or search without location services:</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
            />
            <Input
              placeholder="State"
              value={filters.state}
              onChange={(e) => updateFilter('state', e.target.value)}
              className="w-20"
            />
            <Button 
              onClick={() => {
                setShowLocationRequest(false);
                refetch();
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Status */}
      {userLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <Navigation2 className="h-4 w-4" />
            <span className="font-medium">Location Active:</span>
            <span>{userLocation.city && userLocation.state ? `${userLocation.city}, ${userLocation.state}` : 'Location detected'}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowLocationRequest(true)}
              className="ml-auto"
            >
              Change Location
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Local Stores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Search stores, products, or services..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {userLocation && (
              <Select value={filters.radius.toString()} onValueChange={(value) => updateFilter('radius', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Within 5 miles</SelectItem>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="City"
                value={filters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
              />
              <Input
                placeholder="State"
                value={filters.state}
                onChange={(e) => updateFilter('state', e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Search Results */}
      {aiResults && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">AI Search Insights</span>
            </div>
            <p className="text-blue-700 mb-2">{aiResults.reasoning}</p>
            {aiResults.suggestions && aiResults.suggestions.length > 0 && (
              <div>
                <p className="text-sm text-blue-600 mb-2">Try these searches:</p>
                <div className="flex flex-wrap gap-2">
                  {aiResults.suggestions.map((suggestion: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={() => updateFilter('query', suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isLoading ? 'Searching...' : `Found ${stores.length} stores`}
            {userLocation && filters.radius && ` within ${filters.radius} miles`}
          </h3>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Searching for stores...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p>Error searching stores: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
          </div>
        )}

        {!isLoading && !error && stores.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">No stores found</p>
            <p>Try adjusting your search criteria or expanding the search radius</p>
          </div>
        )}

        {stores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}