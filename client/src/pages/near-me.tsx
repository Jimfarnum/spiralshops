import React, { useState } from 'react';
import NearMeFilter from '@/components/NearMeFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Star, Clock, Phone } from 'lucide-react';

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
  mapsUrl: string;
  phone?: string;
  hours?: string;
}

export default function NearMePage() {
  const [foundStores, setFoundStores] = useState<Store[]>([]);

  const openMaps = (store: Store) => {
    window.open(store.mapsUrl, '_blank');
  };

  const openDirections = (store: Store) => {
    window.open(store.directionsUrl, '_blank');
  };

  return (

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Stores Near Me</h1>
            <p className="text-xl text-gray-600 mb-6">
              Discover local businesses and get directions with our smart location search
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>📍 GPS-powered search</span>
              <span>🛍️ Real-time inventory</span>
              <span>⭐ Verified retailers</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Search Controls */}
            <div className="lg:col-span-1">
              <NearMeFilter 
                onStoresFound={setFoundStores}
                className="sticky top-4"
              />
            </div>

            {/* Results Display */}
            <div className="lg:col-span-2">
              {foundStores.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      {foundStores.length} Stores Found
                    </h2>
                    <Badge variant="outline">
                      Sorted by distance
                    </Badge>
                  </div>

                  <div className="grid gap-4">
                    {foundStores.map((store) => (
                      <Card key={store.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold">{store.name}</h3>
                                {store.isVerified && (
                                  <Badge variant="secondary">
                                    ✓ Verified
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {store.distance}mi away
                                </span>
                                <Badge variant="outline">{store.category}</Badge>
                                {parseFloat(store.rating) > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    {store.rating}
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 mb-3">{store.address}</p>

                              {store.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                  <Phone className="h-3 w-3" />
                                  <a href={`tel:${store.phone}`} className="hover:text-blue-600">
                                    {store.phone}
                                  </a>
                                </div>
                              )}

                              {store.hours && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{store.hours}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => openDirections(store)}
                                className="whitespace-nowrap"
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                Directions
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openMaps(store)}
                                className="whitespace-nowrap"
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                View Map
                              </Button>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2 pt-3 border-t">
                            <Button variant="ghost" size="sm">
                              View Store
                            </Button>
                            <Button variant="ghost" size="sm">
                              Add to Favorites
                            </Button>
                            <Button variant="ghost" size="sm">
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
                    <p className="text-gray-600 mb-4">
                      Use the search panel to find stores and businesses near your location
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div>
                        <strong>1.</strong> Enable location
                      </div>
                      <div>
                        <strong>2.</strong> Set search radius
                      </div>
                      <div>
                        <strong>3.</strong> Choose categories
                      </div>
                      <div>
                        <strong>4.</strong> Get directions
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Smart Location Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find stores within your preferred radius with GPS-powered precision
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-green-600" />
                  One-Click Directions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get instant directions to any store using Google Maps integration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Verified Retailers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Shop with confidence at verified local businesses and retailers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}