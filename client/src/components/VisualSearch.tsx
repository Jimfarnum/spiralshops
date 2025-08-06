import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Camera, Upload, Search, MapPin, Navigation, Eye, ShoppingBag, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  productType: string;
  keywords: string[];
  colors: string[];
  style: string;
  gender: string;
  category: string;
  subcategory: string;
  description: string;
  price_range: string;
  brand_style: string;
}

interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  distance: number;
  lat: number;
  lng: number;
  directionsUrl: string;
  isVerified: boolean;
  rating: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  storeId: number;
  storeName: string;
}

interface VisualSearchProps {
  className?: string;
}

export default function VisualSearch({ className }: VisualSearchProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(25);

  // Image analysis mutation
  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/visual-search/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setAnalysis(data.data.analysis);
        toast({
          title: "Image analyzed successfully",
          description: `Found ${data.data.analysis.productType} with ${data.data.analysis.keywords?.length || 0} keywords`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Search nearby stores mutation
  const searchNearbyMutation = useMutation({
    mutationFn: async ({ analysis, userLat, userLng, radius }: {
      analysis: AnalysisResult;
      userLat: number;
      userLng: number;
      radius: number;
    }) => {
      const response = await fetch('/api/visual-search/search-nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, userLat, userLng, radius }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search nearby stores');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Search complete",
          description: `Found ${data.data.nearbyStores.length} relevant stores nearby`,
        });
      }
    }
  });

  // Similar products query
  const { data: similarProductsData } = useQuery({
    queryKey: ['similar-products', analysis],
    queryFn: () => {
      if (!analysis) return null;
      
      return fetch('/api/visual-search/similar-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, limit: 10 }),
      }).then(res => res.json());
    },
    enabled: !!analysis,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    analyzeImageMutation.mutate(selectedFile);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        
        toast({
          title: "Location found",
          description: `Located within ${position.coords.accuracy}m accuracy`,
        });
      },
      () => {
        // Fallback to Minneapolis for demo
        const fallbackLocation = { lat: 44.9537, lng: -93.0900 };
        setUserLocation(fallbackLocation);
        
        toast({
          title: "Using demo location",
          description: "Using Minneapolis, MN as demo location",
        });
      }
    );
  };

  const handleSearchNearby = () => {
    if (!analysis || !userLocation) return;
    
    searchNearbyMutation.mutate({
      analysis,
      userLat: userLocation.lat,
      userLng: userLocation.lng,
      radius: searchRadius
    });
  };

  const openDirections = (store: Store) => {
    window.open(store.directionsUrl, '_blank');
  };

  const nearbyStores = searchNearbyMutation.data?.data?.nearbyStores || [];
  const suggestions = searchNearbyMutation.data?.data?.suggestions;
  const similarProducts = similarProductsData?.data?.products || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Visual Product Search
          </CardTitle>
          <CardDescription>
            Upload an image to find similar products and nearby stores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="image-upload">Select Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            
            {previewUrl && (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-xs max-h-48 object-contain rounded-lg border"
                />
                <Button 
                  onClick={handleAnalyze}
                  disabled={analyzeImageMutation.isPending}
                  className="w-full"
                >
                  {analyzeImageMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered product identification and categorization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Product Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {analysis.productType}</div>
                  <div><strong>Category:</strong> {analysis.category}</div>
                  <div><strong>Style:</strong> {analysis.style}</div>
                  <div><strong>Gender:</strong> {analysis.gender}</div>
                  {analysis.price_range && (
                    <div><strong>Est. Price:</strong> {analysis.price_range}</div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Keywords & Features</h4>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywords?.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  {analysis.colors?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Colors:</span>
                      <div className="flex flex-wrap gap-1">
                        {analysis.colors.map((color, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-600">{analysis.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location & Search */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Find Nearby Stores
            </CardTitle>
            <CardDescription>
              Search for stores that might carry similar items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {!userLocation ? (
                <Button onClick={getUserLocation} variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get My Location
                </Button>
              ) : (
                <div className="text-sm text-gray-600">
                  Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Label htmlFor="radius">Radius:</Label>
                <Input
                  id="radius"
                  type="number"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                  className="w-20"
                  min="1"
                  max="50"
                />
                <span className="text-sm text-gray-600">miles</span>
              </div>
            </div>

            {userLocation && (
              <Button 
                onClick={handleSearchNearby}
                disabled={searchNearbyMutation.isPending}
                className="w-full"
              >
                {searchNearbyMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Nearby Stores
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Nearby Stores Results */}
      {nearbyStores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nearby Stores ({nearbyStores.length})</CardTitle>
            <CardDescription>
              Stores that might carry similar items within {searchRadius} miles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyStores.map((store: Store) => (
                <div key={store.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{store.name}</h4>
                        {store.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{store.category}</p>
                      <p className="text-xs text-gray-500 mb-2">{store.address}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {store.distance}mi away
                        </span>
                        {parseFloat(store.rating) > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            {store.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => openDirections(store)}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {suggestions && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium mb-2">Search Summary</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Availability:</strong> {suggestions.estimatedAvailability}
                  </div>
                  <div>
                    <strong>Relevant Stores:</strong> {suggestions.relevantStores}
                  </div>
                  <div>
                    <strong>Total Nearby:</strong> {suggestions.totalNearbyStores}
                  </div>
                  <div>
                    <strong>Category:</strong> {suggestions.categoryMatch}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Similar Products
            </CardTitle>
            <CardDescription>
              Products matching your image analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarProducts.map((product: Product) => (
                <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h4 className="font-medium mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">${product.price}</span>
                    <span className="text-xs text-gray-500">{product.storeName}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}