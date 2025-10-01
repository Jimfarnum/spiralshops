import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getDistance, formatDistance, getDirectionsUrl } from '@/utils/getDistance';
import { useLocation } from '@/hooks/useLocation';
import NearMeFilter from '@/components/NearMeFilter';
import LocationButton from '@/components/LocationButton';
import { MapPin, Navigation, Search, Filter, Star, Clock, Phone, Store } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category?: string;
  rating?: number;
  hours?: string;
  phone?: string;
  image?: string;
  distance?: number;
}

interface StoreLocationListProps {
  stores: Store[];
  title?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  defaultRadius?: number;
  onStoreSelect?: (store: Store) => void;
  className?: string;
}

export default function StoreLocationList({
  stores,
  title = "Nearby Stores",
  showSearch = true,
  showFilters = true,
  defaultRadius = 10,
  onStoreSelect,
  className = ''
}: StoreLocationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [radiusFilter, setRadiusFilter] = useState(defaultRadius);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const { toast } = useToast();

  // Calculate distances and apply filters
  const filteredAndSortedStores = useMemo(() => {
    let processedStores = stores.map(store => ({
      ...store,
      distance: userLocation 
        ? getDistance(userLocation.lat, userLocation.lng, store.lat, store.lng)
        : undefined
    }));

    // Apply search filter
    if (searchTerm) {
      processedStores = processedStores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.category && store.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      processedStores = processedStores.filter(store => 
        store.category === categoryFilter
      );
    }

    // Apply radius filter if location is available and not "All" mode
    if (userLocation && radiusFilter !== -1) {
      processedStores = processedStores.filter(store => 
        store.distance !== undefined && store.distance <= radiusFilter
      );
    }

    // Sort stores
    processedStores.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          if (!a.distance || !b.distance) return 0;
          return a.distance - b.distance;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return processedStores;
  }, [stores, searchTerm, categoryFilter, radiusFilter, userLocation, sortBy]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = Array.from(new Set(stores.map(store => store.category).filter(Boolean)));
    return cats.sort();
  }, [stores]);

  const handleGetDirections = (store: Store) => {
    const url = getDirectionsUrl(store.lat, store.lng, store.address);
    window.open(url, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Directions Opened",
      description: `Getting directions to ${store.name}`,
    });
  };

  const handleStoreClick = (store: Store) => {
    if (onStoreSelect) {
      onStoreSelect(store);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-600">{title}</h2>
        <Badge variant="secondary">
          {filteredAndSortedStores.length} store{filteredAndSortedStores.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {showSearch && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search stores, categories, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <LocationButton
                  onLocationUpdate={setUserLocation}
                  variant="outline"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex gap-2 flex-wrap">
                {/* Category Filter */}
                {categories.length > 0 && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                )}

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'name')}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  {userLocation && <option value="distance">Sort by Distance</option>}
                  <option value="rating">Sort by Rating</option>
                  <option value="name">Sort by Name</option>
                </select>
                
                {/* All US Stores Quick Toggle */}
                <Button
                  variant={radiusFilter === -1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRadiusFilter(radiusFilter === -1 ? defaultRadius : -1)}
                  className="text-xs"
                >
                  {radiusFilter === -1 ? 'All US Stores' : 'Show All US'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Near Me Filter */}
      {showFilters && (
        <NearMeFilter
          onRadiusChange={setRadiusFilter}
          onLocationChange={setUserLocation}
          defaultRadius={defaultRadius}
          compact={true}
        />
      )}

      {/* Store List */}
      <div className="space-y-3">
        {filteredAndSortedStores.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No stores found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter 
                  ? 'Try adjusting your search or filters'
                  : 'No stores available in this area'
                }
              </p>
              {userLocation && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setRadiusFilter(50);
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedStores.map((store) => (
            <Card 
              key={store.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleStoreClick(store)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Store Image */}
                  {store.image && (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  {/* Store Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {store.name}
                        </h3>
                        {store.category && (
                          <Badge variant="secondary" className="text-xs">
                            {store.category}
                          </Badge>
                        )}
                      </div>
                      
                      {store.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{store.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      {store.address}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {store.distance !== undefined && (
                        <span className="flex items-center gap-1">
                          <Navigation className="w-4 h-4" />
                          {formatDistance(store.distance)} away
                        </span>
                      )}
                      
                      {store.hours && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {store.hours}
                        </span>
                      )}
                      
                      {store.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {store.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(store);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Location Permission Helper */}
      {!userLocation && filteredAndSortedStores.length > 0 && radiusFilter !== -1 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Enable location to see distances and get personalized results
                </p>
                <p className="text-xs text-blue-700">
                  We'll show you the closest stores and provide turn-by-turn directions
                </p>
              </div>
              <LocationButton
                onLocationUpdate={setUserLocation}
                variant="default"
                size="sm"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* All US Stores Info */}
      {radiusFilter === -1 && (
        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-teal-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-teal-900">
                  Showing all brick-and-mortar retail stores across the continental US
                </p>
                <p className="text-xs text-teal-700">
                  SPIRAL connects you with local businesses from coast to coast
                </p>
              </div>
              {!userLocation && (
                <LocationButton
                  onLocationUpdate={setUserLocation}
                  variant="outline"
                  size="sm"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}