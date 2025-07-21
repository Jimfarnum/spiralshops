import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Building2, 
  X, 
  Search,
  Store,
  ShoppingBag,
  Navigation,
  Target,
  Globe,
  Locate
} from 'lucide-react';
import { useLocationStore, locationSuggestions } from '@/lib/locationStore';

interface LocationFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationFilter({ isOpen, onClose }: LocationFilterProps) {
  const { 
    currentLocation, 
    mallContext,
    searchPreferences,
    setLocationFilter, 
    clearMallContext, 
    resetFilters,
    setSearchPreferences,
    getNearbyLocations
  } = useLocationStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [zipCodeInput, setZipCodeInput] = useState(searchPreferences.currentZipCode || '');

  // Filter suggestions based on search term
  const filteredSuggestions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return {
      malls: locationSuggestions.malls.filter(mall => 
        mall.name.toLowerCase().includes(term) || 
        mall.city.toLowerCase().includes(term)
      ),
      cities: locationSuggestions.cities.filter(city => 
        city.toLowerCase().includes(term)
      ),
      states: locationSuggestions.states.filter(state => 
        state.toLowerCase().includes(term)
      ),
      zipCodes: locationSuggestions.zipCodes.filter(zip => 
        zip.includes(term)
      )
    };
  }, [searchTerm]);

  const handleLocationSelect = (type: 'zip' | 'city' | 'state' | 'mall', value: string) => {
    let displayName = value;
    
    if (type === 'mall') {
      const mall = locationSuggestions.malls.find(m => m.name === value);
      displayName = mall ? `${mall.name} (${mall.city}, ${mall.state})` : value;
    }
    
    setLocationFilter({
      type,
      value,
      displayName
    });
    
    onClose();
    setSearchTerm('');
  };

  const handleShopAllLocations = () => {
    resetFilters();
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--spiral-coral)]" />
              <h2 className="text-xl font-semibold text-[var(--spiral-navy)]">
                Smart Location Search
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Current Selection Display */}
          {currentLocation.type !== 'all' && (
            <div className="mt-4 p-3 bg-[var(--spiral-coral)]/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--spiral-coral)]" />
                  <span className="text-sm font-medium text-[var(--spiral-navy)]">
                    Current: {currentLocation.displayName}
                  </span>
                  {mallContext.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Mall Mode Active
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={mallContext.isActive ? clearMallContext : resetFilters}
                >
                  {mallContext.isActive ? 'Exit Mall Mode' : 'Clear Filter'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Advanced Search Controls */}
          <div className="space-y-4 mb-6">
            {/* Primary Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by zip code, city, state, or mall name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Location Preferences */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Your Zip Code (for distance)</label>
                <div className="relative">
                  <Locate className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <Input
                    placeholder="Enter zip"
                    value={zipCodeInput}
                    onChange={(e) => setZipCodeInput(e.target.value)}
                    onBlur={() => setSearchPreferences({ currentZipCode: zipCodeInput })}
                    className="pl-8 text-sm h-8"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Max Distance</label>
                <Select 
                  value={searchPreferences.maxDistance.toString()} 
                  onValueChange={(value) => setSearchPreferences({ maxDistance: parseInt(value) })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locationSuggestions.maxDistanceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Sort By</label>
                <Select 
                  value={searchPreferences.sortBy} 
                  onValueChange={(value: 'distance' | 'relevance' | 'alphabetical') => 
                    setSearchPreferences({ sortBy: value })
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Nearest First</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="relevance">Relevance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="malls">Malls</TabsTrigger>
              <TabsTrigger value="cities">Cities</TabsTrigger>
              <TabsTrigger value="zip">Zip Codes</TabsTrigger>
            </TabsList>

            {/* All Locations Tab */}
            <TabsContent value="all" className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleShopAllLocations}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop All Locations
              </Button>
              
              {/* Quick Access */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Nationwide Coverage
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'].map((city) => (
                      <Button
                        key={city}
                        variant="outline"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => handleLocationSelect('city', city)}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {city}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Major Shopping Malls</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {filteredSuggestions.malls.slice(0, 4).map((mall) => (
                      <Button
                        key={mall.id}
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => handleLocationSelect('mall', mall.name)}
                      >
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{mall.name}</div>
                          <div className="text-xs text-gray-500">{mall.city}, {mall.state}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Nearby Tab */}
            <TabsContent value="nearby" className="space-y-2">
              <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded">
                {searchPreferences.currentZipCode 
                  ? `Showing locations within ${searchPreferences.maxDistance} miles of ${searchPreferences.currentZipCode}`
                  : 'Enter your zip code above to see nearby locations'
                }
              </div>
              {searchPreferences.currentZipCode ? (
                <div className="space-y-2">
                  {getNearbyLocations().map((mall) => (
                    <Button
                      key={mall.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleLocationSelect('mall', mall.name)}
                    >
                      <Building2 className="h-4 w-4 mr-3 flex-shrink-0 text-[var(--spiral-coral)]" />
                      <div className="text-left flex-1">
                        <div className="font-medium">{mall.name}</div>
                        <div className="text-xs text-gray-500">
                          {mall.city}, {mall.state} • {mall.distance?.toFixed(1) || '?'} miles
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Enter your zip code above to find nearby malls and stores
                </div>
              )}
            </TabsContent>

            {/* Malls Tab */}
            <TabsContent value="malls" className="space-y-2">
              <div className="text-xs text-gray-500 mb-2 p-2 bg-amber-50 rounded">
                <strong>Mall Mode:</strong> Select a mall for exclusive shopping within that location nationwide
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredSuggestions.malls.map((mall) => (
                  <Button
                    key={mall.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleLocationSelect('mall', mall.name)}
                  >
                    <Building2 className="h-4 w-4 mr-3 flex-shrink-0 text-[var(--spiral-coral)]" />
                    <div className="text-left flex-1">
                      <div className="font-medium">{mall.name}</div>
                      <div className="text-xs text-gray-500">
                        {mall.city}, {mall.state} • {mall.zipCode}
                        {searchPreferences.currentZipCode && mall.zipCode && (
                          <span className="ml-2 text-blue-600">
                            ~{Math.abs(parseInt(searchPreferences.currentZipCode) - parseInt(mall.zipCode)) / 1000}mi
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              {filteredSuggestions.malls.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No malls found matching "{searchTerm}"
                </div>
              )}
            </TabsContent>

            {/* Cities Tab */}
            <TabsContent value="cities" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {filteredSuggestions.cities.map((city) => (
                  <Button
                    key={city}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleLocationSelect('city', city)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {city}
                  </Button>
                ))}
              </div>
              {filteredSuggestions.cities.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No cities found matching "{searchTerm}"
                </div>
              )}
            </TabsContent>

            {/* Zip Codes Tab */}
            <TabsContent value="zip" className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {filteredSuggestions.zipCodes.map((zip) => (
                  <Button
                    key={zip}
                    variant="outline"
                    className="justify-center"
                    onClick={() => handleLocationSelect('zip', zip)}
                  >
                    {zip}
                  </Button>
                ))}
              </div>
              {filteredSuggestions.zipCodes.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No zip codes found matching "{searchTerm}"
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}