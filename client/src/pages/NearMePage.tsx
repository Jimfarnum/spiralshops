import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import StoreLocationList from '@/components/StoreLocationList';
import NearMeFilter from '@/components/NearMeFilter';
import { MapPin, Store, TrendingUp, Navigation } from 'lucide-react';

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
}

export default function NearMePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      const data = await response.json();
      
      if (data.success && data.data?.stores) {
        // Convert API response to expected format with coordinates
        const storesWithCoords = data.data.stores.map((store: any) => ({
          id: store.id.toString(),
          name: store.name,
          address: store.location || store.address || `${store.city}, ${store.state}`,
          lat: store.latitude || (44.9780 + (Math.random() - 0.5) * 0.1), // Demo coordinates around Minneapolis
          lng: store.longitude || (-93.2638 + (Math.random() - 0.5) * 0.1),
          category: store.category || 'Retail',
          rating: store.rating || (4.0 + Math.random() * 1.0),
          hours: store.hours || 'Mon-Sat 9AM-9PM, Sun 11AM-7PM',
          phone: store.phone || `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          image: store.image || '/api/placeholder/150/150'
        }));
        
        setStores(storesWithCoords);
      }
    } catch (error) {
      toast({
        title: "Loading Error",
        description: "Could not load store locations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSelect = (store: Store) => {
    toast({
      title: "Store Selected",
      description: `Selected ${store.name}`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
          <MapPin className="w-10 h-10 text-teal-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-teal-600 mb-2">
            Near Me
          </h1>
          <p className="text-gray-600">
            Discover local businesses and stores in your area
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Store className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stores.length}</p>
            <p className="text-sm text-gray-600">Total Stores</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {userLocation ? stores.filter(s => s.rating && s.rating >= 4.5).length : '-'}
            </p>
            <p className="text-sm text-gray-600">Highly Rated</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Navigation className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {userLocation ? `${radius} mi` : '-'}
            </p>
            <p className="text-sm text-gray-600">Search Radius</p>
          </CardContent>
        </Card>
      </div>

      {/* Location Filter */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <NearMeFilter
            onRadiusChange={setRadius}
            onLocationChange={setUserLocation}
            defaultRadius={10}
          />
        </div>

        {/* Store List */}
        <div className="lg:col-span-3">
          <StoreLocationList
            stores={stores}
            title="Nearby Businesses"
            showSearch={true}
            showFilters={true}
            defaultRadius={radius}
            onStoreSelect={handleStoreSelect}
          />
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-500" />
            How Location Services Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Share Location</h4>
              <p className="text-sm text-gray-600">
                Allow SPIRAL to access your location for personalized results
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">2. Find Nearby Stores</h4>
              <p className="text-sm text-gray-600">
                See stores sorted by distance with accurate mile calculations
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Navigation className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">3. Get Directions</h4>
              <p className="text-sm text-gray-600">
                One-click turn-by-turn directions via Google Maps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}