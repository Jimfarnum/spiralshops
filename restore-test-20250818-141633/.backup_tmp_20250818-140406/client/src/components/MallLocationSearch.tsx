import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Store, Star, Users, ShoppingBag, Navigation2 } from 'lucide-react';
import { locationService, type LocationData } from '@/services/locationService';
import LocationPermissionRequest from './LocationPermissionRequest';
import { Link } from 'wouter'; 

interface Mall {
  id: string;
  name: string;
  location: string;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  city: string;
  state: string;
  tenantCount: number;
  categories: string[];
  rating: number;
  distance?: number;
  distanceText?: string;
  featured?: boolean;
  image?: string;
  spiralPerks?: string[];
}

export default function MallLocationSearch() {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [showLocationRequest, setShowLocationRequest] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [radius, setRadius] = useState(25);

  // Search malls using location API
  const { data: searchResults, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/mall-location-search', userLocation, selectedCategory, radius],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      if (userLocation?.coordinates) {
        params.append('latitude', userLocation.coordinates.latitude.toString());
        params.append('longitude', userLocation.coordinates.longitude.toString());
        params.append('radius', radius.toString());
      }
      
      if (userLocation?.city) params.append('city', userLocation.city);
      if (userLocation?.state) params.append('state', userLocation.state);
      
      const response = await fetch(`/api/mall-location-search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to search malls');
      }
      return response.json();
    },
    enabled: false
  });

  const malls: Mall[] = searchResults?.malls || [];

  useEffect(() => {
    if (userLocation) {
      refetch();
    }
  }, [userLocation, selectedCategory, radius, refetch]);

  const handleLocationGranted = (location: LocationData) => {
    setUserLocation(location);
    setShowLocationRequest(false);
  };

  const handleLocationDenied = () => {
    setShowLocationRequest(false);
  };

  const filteredMalls = malls.filter(mall => {
    if (!searchTerm) return true;
    return mall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           mall.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           mall.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const categories = ['all', 'fashion', 'food', 'home', 'gifts', 'beauty', 'crafts', 'art', 'grocery', 'services', 'health', 'sustainable'];

  if (showLocationRequest && !userLocation) {
    return (
      <div className="space-y-6">
        <LocationPermissionRequest
          onLocationGranted={handleLocationGranted}
          onLocationDenied={handleLocationDenied}
        />
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
            <span className="font-medium">Searching near:</span>
            <span>{userLocation.city && userLocation.state ? `${userLocation.city}, ${userLocation.state}` : 'Your location'}</span>
            <Badge variant="secondary" className="ml-auto">
              {malls.length} malls found
            </Badge>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Find Shopping Malls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Search malls, locations, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => refetch()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {userLocation && (
              <Select value={radius.toString()} onValueChange={(value) => setRadius(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Search Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                  <SelectItem value="100">Within 100 miles</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isLoading ? 'Searching...' : `${filteredMalls.length} malls found`}
            {userLocation && ` within ${radius} miles`}
          </h3>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Finding malls near you...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p>Error searching malls: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
          </div>
        )}

        {!isLoading && !error && filteredMalls.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <Store className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">No malls found</p>
            <p>Try expanding your search radius or choosing different categories</p>
          </div>
        )}

        {filteredMalls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMalls.map((mall) => (
              <Card key={mall.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  {mall.image && (
                    <img
                      src={mall.image}
                      alt={mall.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  )}
                  {mall.featured && (
                    <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{mall.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {mall.distance ? `${mall.distance} mi` : mall.location} • {mall.tenantCount} stores
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold">{mall.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{mall.tenantCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mall.categories.slice(0, 3).map(category => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {mall.spiralPerks && mall.spiralPerks.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-blue-600 font-medium mb-1">SPIRAL Perks:</p>
                      <p className="text-xs text-gray-600">{mall.spiralPerks[0]}</p>
                    </div>
                  )}
                  
                  <Link href={`/mall/${mall.id}`}>
                    <Button variant="outline" className="w-full">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View Mall Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}