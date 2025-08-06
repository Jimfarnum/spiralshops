import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone, Clock, Star, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleMapsDirections } from '@/components/GoogleMapsIntegration';

interface Store {
  id: number;
  name: string;
  address: string;
  phone?: string;
  category: string;
  rating?: string;
  lat?: number;
  lng?: number;
  isVerified?: boolean;
  hours?: string;
  description?: string;
  website?: string;
}

export default function StoreDetailsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { toast } = useToast();
  const [directions, setDirections] = useState<string | null>(null);

  // Fetch store details
  const { data: storeData, isLoading, error } = useQuery({
    queryKey: ['/api/maps/store-location', storeId],
    queryFn: () => fetch(`/api/maps/store-location/${storeId}`).then(res => res.json()),
    enabled: !!storeId,
  });

  // Fallback to regular store API if maps API fails
  const { data: fallbackStore } = useQuery({
    queryKey: ['/api/stores', storeId],
    queryFn: () => fetch(`/api/stores/${storeId}`).then(res => res.json()),
    enabled: !!storeId && (!storeData || !storeData.success),
  });

  const store = storeData?.success ? storeData.data.store : fallbackStore?.data?.store;

  const openGoogleMaps = (lat?: number, lng?: number, address?: string) => {
    let mapsUrl;
    if (lat && lng) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (address) {
      const query = encodeURIComponent(address);
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    } else {
      toast({
        title: "Location unavailable",
        description: "No location data found for this store",
        variant: "destructive",
      });
      return;
    }
    
    window.open(mapsUrl, '_blank');
  };

  const getDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          let directionsUrl;
          if (store?.lat && store?.lng) {
            directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${store.lat},${store.lng}`;
          } else if (store?.address) {
            const encodedAddress = encodeURIComponent(store.address);
            directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${encodedAddress}`;
          } else {
            toast({
              title: "Cannot get directions",
              description: "Store location data unavailable",
              variant: "destructive",
            });
            return;
          }
          
          window.open(directionsUrl, '_blank');
          toast({
            title: "Directions opened",
            description: `Google Maps directions to ${store.name}`,
          });
        },
        () => {
          // Fall back without user location
          let directionsUrl;
          if (store?.lat && store?.lng) {
            directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
          } else if (store?.address) {
            const encodedAddress = encodeURIComponent(store.address);
            directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
          }
          
          if (directionsUrl) {
            window.open(directionsUrl, '_blank');
          }
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-4">The store you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Store Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{store.address}</span>
            </div>
            {store.phone && (
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Phone className="h-4 w-4" />
                <a href={`tel:${store.phone}`} className="hover:text-blue-600">
                  {store.phone}
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={store.isVerified ? "default" : "secondary"}>
              {store.category}
            </Badge>
            {store.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{store.rating}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {store.description && (
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-gray-600">{store.description}</p>
                </div>
              )}
              
              {store.hours && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hours
                  </h4>
                  <p className="text-gray-600">{store.hours}</p>
                </div>
              )}

              {store.website && (
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(store.website, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => openGoogleMaps(store.lat, store.lng, store.address)}
                  variant="outline"
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Maps
                </Button>
                <Button onClick={getDirections} className="flex-1">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Google Maps Directions Component */}
          <GoogleMapsDirections 
            store={store}
            className="h-fit"
          />
        </div>

        {/* Additional Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Interact with {store.name} and manage your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" size="sm">
                Add to Favorites
              </Button>
              <Button variant="outline" size="sm">
                Share Store
              </Button>
              <Button variant="outline" size="sm">
                Write Review
              </Button>
              <Button variant="outline" size="sm">
                Report Issue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
          >
            ← Back to Stores
          </Button>
        </div>
      </div>
    </div>
  );
}