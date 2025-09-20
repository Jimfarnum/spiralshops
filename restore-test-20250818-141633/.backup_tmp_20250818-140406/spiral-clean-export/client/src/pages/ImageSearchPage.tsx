import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Search, MapPin, Star, ShoppingCart, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { formatDistance } from '@/utils/getDistance';

interface ImageSearchResult {
  id: number;
  name: string;
  category: string;
  price: number;
  store: string;
  distance?: number;
  matchScore: number;
}

interface ImageAnalysis {
  productType: string;
  category: string;
  color?: string;
  brand?: string;
  keywords: string[];
}

export default function ImageSearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ImageSearchResult[]>([]);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { coordinates: userLocation, getCurrentLocation, isLoading: locationLoading } = useLocation();
  
  const requestLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      if (userLocation) {
        formData.append('location', JSON.stringify(userLocation));
      }

      const response = await fetch('/api/ai/search-by-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data.matches);
        setAnalysis(data.data.analysis);
        toast({
          title: "Image analyzed successfully!",
          description: `Found ${data.data.matches.length} matching products`,
        });
      } else {
        throw new Error(data.error || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Image search error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const addToCart = (product: ImageSearchResult) => {
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Image Search
          </h1>
          <p className="text-gray-600">
            Upload or take a photo to find similar products in local stores
          </p>
        </div>

        {/* Location Permission */}
        {!userLocation && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Enable location for better results</p>
                    <p className="text-sm text-blue-700">We'll show you the closest stores with matching products</p>
                  </div>
                </div>
                <Button 
                  onClick={requestLocation} 
                  disabled={locationLoading}
                  size="sm"
                >
                  {locationLoading ? 'Getting location...' : 'Enable Location'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-teal-500 bg-teal-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="max-w-full h-48 object-contain mx-auto rounded"
                      />
                      <p className="text-sm text-gray-600">
                        Click or drag to upload a different image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          {isDragActive ? 'Drop image here' : 'Upload an image'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Drag & drop or click to select • PNG, JPG, GIF, WebP • Max 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {isLoading && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-teal-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent"></div>
                      Analyzing image...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Image Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Product Type:</span>
                      <span className="ml-2 text-gray-700">{analysis.productType}</span>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <span className="ml-2 text-gray-700">{analysis.category}</span>
                    </div>
                    {analysis.color && (
                      <div>
                        <span className="font-medium">Color:</span>
                        <span className="ml-2 text-gray-700">{analysis.color}</span>
                      </div>
                    )}
                    {analysis.brand && (
                      <div>
                        <span className="font-medium">Brand:</span>
                        <span className="ml-2 text-gray-700">{analysis.brand}</span>
                      </div>
                    )}
                    {analysis.keywords && analysis.keywords.length > 0 && (
                      <div>
                        <span className="font-medium">Keywords:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  Search Results {results.length > 0 && `(${results.length})`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Upload an image to see matching products</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((product) => (
                      <Card key={product.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-gray-600">{product.store}</p>
                              <Badge variant="outline" className="mt-1">
                                {product.category}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                ${product.price}
                              </p>
                              {product.distance && (
                                <p className="text-sm text-gray-500">
                                  {formatDistance(product.distance)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">Match Score: {product.matchScore}/5</span>
                            </div>
                            <div className="flex gap-2">
                              {product.distance && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(product.store)}`,
                                    '_blank'
                                  )}
                                >
                                  <Navigation className="w-4 h-4 mr-1" />
                                  Directions
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => addToCart(product)}
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}