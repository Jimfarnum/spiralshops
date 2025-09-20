import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Map, Store, Navigation, Phone, Clock, Star, MapPin } from "lucide-react";

interface StoreLocation {
  id: number;
  name: string;
  category: string;
  x: number;
  y: number;
  phone?: string;
  hours?: string;
  rating?: number;
  description?: string;
}

interface MallMapData {
  id: number;
  mallId: number;
  mallName: string;
  svgUrl?: string;
  jsonPathData?: any;
  mapMetadata?: any;
  storeLocations?: StoreLocation[];
}

interface MallMapViewerProps {
  mallId: number;
  className?: string;
  showDirections?: boolean;
}

export default function MallMapViewer({ 
  mallId, 
  className = "",
  showDirections = true 
}: MallMapViewerProps) {
  const [mapData, setMapData] = useState<MallMapData | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredStore, setHoveredStore] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMallMap();
  }, [mallId]);

  const fetchMallMap = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/mall-map/${mallId}`);
      if (response.ok) {
        const data = await response.json();
        setMapData(data.mallMap);
      } else if (response.status === 404) {
        // Create demo map data if none exists
        const demoMapData: MallMapData = {
          id: 1,
          mallId,
          mallName: `Mall ${mallId}`,
          storeLocations: [
            {
              id: 1,
              name: "TechWorld Electronics",
              category: "Electronics",
              x: 150,
              y: 100,
              phone: "(555) 123-4567",
              hours: "10 AM - 9 PM",
              rating: 4.5,
              description: "Latest electronics and gadgets"
            },
            {
              id: 2,
              name: "Fashion Forward",
              category: "Clothing",
              x: 300,
              y: 150,
              phone: "(555) 234-5678",
              hours: "10 AM - 8 PM",
              rating: 4.2,
              description: "Trendy clothing and accessories"
            },
            {
              id: 3,
              name: "BookNook Cafe",
              category: "Books & Coffee",
              x: 200,
              y: 250,
              phone: "(555) 345-6789",
              hours: "8 AM - 10 PM",
              rating: 4.7,
              description: "Books, coffee, and cozy atmosphere"
            },
            {
              id: 4,
              name: "Sports Central",
              category: "Sports",
              x: 400,
              y: 120,
              phone: "(555) 456-7890",
              hours: "9 AM - 9 PM",
              rating: 4.3,
              description: "Athletic gear and equipment"
            },
            {
              id: 5,
              name: "Home & Garden",
              category: "Home Goods",
              x: 250,
              y: 180,
              phone: "(555) 567-8901",
              hours: "10 AM - 7 PM",
              rating: 4.1,
              description: "Home decor and garden supplies"
            }
          ]
        };
        setMapData(demoMapData);
      }
    } catch (error) {
      console.error("Error fetching mall map:", error);
      toast({
        title: "Map Error",
        description: "Failed to load mall map",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreClick = (store: StoreLocation) => {
    setSelectedStore(store);
  };

  const getDirections = (store: StoreLocation) => {
    toast({
      title: "Directions",
      description: `Navigate to ${store.name}. Feature integration with Google Maps coming soon!`,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Electronics': 'bg-blue-500',
      'Clothing': 'bg-pink-500', 
      'Books & Coffee': 'bg-amber-500',
      'Sports': 'bg-green-500',
      'Home Goods': 'bg-purple-500',
      'Food': 'bg-red-500',
      'Beauty': 'bg-rose-500',
      'Jewelry': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <Card className={`bg-white shadow-lg ${className}`}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--spiral-navy)] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading mall map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mapData) {
    return (
      <Card className={`bg-white shadow-lg ${className}`}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Mall map not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Interactive Mall Map */}
      <Card className="lg:col-span-2 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-[var(--spiral-navy)]" />
            {mapData.mallName} - Interactive Map
          </CardTitle>
          <CardDescription>
            Click on store markers to view details and get directions
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
            {/* Mall Layout SVG Container */}
            <svg
              viewBox="0 0 500 300"
              className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100"
              style={{ minHeight: '320px' }}
            >
              {/* Mall Structure */}
              <rect x="50" y="50" width="400" height="200" 
                    fill="white" stroke="#e5e7eb" strokeWidth="2" rx="8" />
              
              {/* Mall Corridors */}
              <rect x="70" y="130" width="360" height="40" 
                    fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="220" y="70" width="60" height="160" 
                    fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              
              {/* Store Locations */}
              {mapData.storeLocations?.map((store) => (
                <g key={store.id}>
                  {/* Store Marker */}
                  <circle
                    cx={store.x}
                    cy={store.y}
                    r={hoveredStore === store.id ? "12" : "8"}
                    className={`${getCategoryColor(store.category)} cursor-pointer transition-all duration-200 hover:opacity-80`}
                    onClick={() => handleStoreClick(store)}
                    onMouseEnter={() => setHoveredStore(store.id)}
                    onMouseLeave={() => setHoveredStore(null)}
                  />
                  
                  {/* Store Icon */}
                  <Store 
                    x={store.x - 6} 
                    y={store.y - 6} 
                    width="12" 
                    height="12" 
                    className="text-white pointer-events-none"
                  />
                  
                  {/* Store Label */}
                  <text
                    x={store.x}
                    y={store.y + 20}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 pointer-events-none"
                  >
                    {store.name.split(' ')[0]}
                  </text>
                  
                  {/* Hover Tooltip */}
                  {hoveredStore === store.id && (
                    <g>
                      <rect
                        x={store.x - 40}
                        y={store.y - 45}
                        width="80"
                        height="30"
                        fill="black"
                        fillOpacity="0.8"
                        rx="4"
                        className="pointer-events-none"
                      />
                      <text
                        x={store.x}
                        y={store.y - 30}
                        textAnchor="middle"
                        className="text-xs font-medium fill-white pointer-events-none"
                      >
                        {store.name}
                      </text>
                    </g>
                  )}
                </g>
              ))}
              
              {/* Selected Store Highlight */}
              {selectedStore && (
                <circle
                  cx={selectedStore.x}
                  cy={selectedStore.y}
                  r="15"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-ping"
                />
              )}
            </svg>
          </div>
          
          {/* Map Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Store Categories</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(mapData.storeLocations?.map(s => s.category) || [])).map((category) => (
                <Badge 
                  key={category}
                  variant="secondary" 
                  className={`${getCategoryColor(category)} text-white text-xs`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Details Panel */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[var(--spiral-navy)]" />
            Store Details
          </CardTitle>
          <CardDescription>
            {selectedStore ? "Store information and contact details" : "Click a store on the map to view details"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {selectedStore ? (
            <div className="space-y-4">
              {/* Store Header */}
              <div className="pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
                  {selectedStore.name}
                </h3>
                <Badge 
                  variant="secondary"
                  className={`${getCategoryColor(selectedStore.category)} text-white text-xs mt-1`}
                >
                  {selectedStore.category}
                </Badge>
              </div>

              {/* Store Rating */}
              {selectedStore.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{selectedStore.rating}</span>
                  <span className="text-sm text-gray-500">rating</span>
                </div>
              )}

              {/* Store Description */}
              {selectedStore.description && (
                <p className="text-sm text-gray-600">
                  {selectedStore.description}
                </p>
              )}

              {/* Contact Information */}
              <div className="space-y-2">
                {selectedStore.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-[var(--spiral-coral)]" />
                    <span>{selectedStore.phone}</span>
                  </div>
                )}
                
                {selectedStore.hours && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[var(--spiral-coral)]" />
                    <span>{selectedStore.hours}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {showDirections && (
                  <Button
                    onClick={() => getDirections(selectedStore)}
                    variant="outline"
                    className="w-full border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                )}
                
                <Button
                  onClick={() => window.location.href = `/store/${selectedStore.id}`}
                  className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-navy)] text-white"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Visit Store Page
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a store from the map to view detailed information</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}