import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Store {
  id: number;
  name: string;
  address: string;
  phone?: string;
  category: string;
  rating?: string;
  lat?: number;
  lng?: number;
}

interface GoogleMapsProps {
  store: Store;
  className?: string;
}

export function GoogleMapsDirections({ store, className = "" }: GoogleMapsProps) {
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Generate Google Maps directions URL
  const getDirectionsUrl = (lat?: number, lng?: number) => {
    if (lat && lng) {
      // Use coordinates if available
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else {
      // Fall back to address search
      const encodedAddress = encodeURIComponent(store.address);
      return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    }
  };

  // Get user location and open directions
  const openDirectionsWithLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          let directionsUrl;
          if (store.lat && store.lng) {
            // Use precise coordinates for both origin and destination
            directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${store.lat},${store.lng}`;
          } else {
            // Use user location and store address
            const encodedAddress = encodeURIComponent(store.address);
            directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${encodedAddress}`;
          }
          
          window.open(directionsUrl, '_blank');
          setIsGettingLocation(false);
          
          toast({
            title: "Directions opened",
            description: `Google Maps directions to ${store.name} opened in new tab`,
          });
        },
        (error) => {
          setIsGettingLocation(false);
          console.error('Geolocation error:', error);
          
          // Fall back to basic directions without user location
          const directionsUrl = getDirectionsUrl(store.lat, store.lng);
          window.open(directionsUrl, '_blank');
          
          toast({
            title: "Directions opened",
            description: "Location access denied. Basic directions opened.",
            variant: "default",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setIsGettingLocation(false);
      // Geolocation not supported, use basic directions
      const directionsUrl = getDirectionsUrl(store.lat, store.lng);
      window.open(directionsUrl, '_blank');
      
      toast({
        title: "Directions opened",
        description: "Location services not available. Basic directions opened.",
      });
    }
  };

  // Open store location in Google Maps
  const openStoreLocation = () => {
    let mapsUrl;
    if (store.lat && store.lng) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
    } else {
      const query = encodeURIComponent(`${store.name} ${store.address}`);
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    
    window.open(mapsUrl, '_blank');
    
    toast({
      title: "Location opened",
      description: `${store.name} location opened in Google Maps`,
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-blue-600" />
          Get Directions
        </CardTitle>
        <CardDescription>
          Navigate to {store.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600 mb-3">
          <p className="font-medium">{store.name}</p>
          <p>{store.address}</p>
          {store.phone && <p>{store.phone}</p>}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={openDirectionsWithLocation}
            disabled={isGettingLocation}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isGettingLocation ? "Getting Location..." : "Get Directions"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={openStoreLocation}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View on Maps
          </Button>
        </div>
        
        {store.rating && (
          <div className="text-sm text-gray-500 pt-2 border-t">
            <span className="inline-flex items-center">
              ⭐ {store.rating} rating
              {store.category && <span className="ml-2 text-gray-400">• {store.category}</span>}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MallDirectionsProps {
  mallName: string;
  address: string;
  stores?: Store[];
  className?: string;
}

export function MallDirections({ mallName, address, stores = [], className = "" }: MallDirectionsProps) {
  const { toast } = useToast();

  const openMallDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const encodedAddress = encodeURIComponent(address);
          const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${encodedAddress}`;
          
          window.open(directionsUrl, '_blank');
          
          toast({
            title: "Mall directions opened",
            description: `Google Maps directions to ${mallName}`,
          });
        },
        () => {
          // Fall back without user location
          const encodedAddress = encodeURIComponent(address);
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
          window.open(directionsUrl, '_blank');
          
          toast({
            title: "Mall directions opened",
            description: "Basic directions opened",
          });
        }
      );
    } else {
      const encodedAddress = encodeURIComponent(address);
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(directionsUrl, '_blank');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          {mallName}
        </CardTitle>
        <CardDescription>{address}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={openMallDirections} className="w-full mb-3">
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions to Mall
        </Button>
        
        {stores.length > 0 && (
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">{stores.length} stores available:</p>
            <div className="space-y-1">
              {stores.slice(0, 3).map(store => (
                <p key={store.id} className="text-xs">• {store.name}</p>
              ))}
              {stores.length > 3 && (
                <p className="text-xs text-gray-400">+ {stores.length - 3} more stores</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GoogleMapsDirections;