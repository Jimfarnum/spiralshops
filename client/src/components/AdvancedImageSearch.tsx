import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Upload, Camera, MapPin, Search, Eye, Cpu, Database, Navigation } from 'lucide-react';

interface SearchResult {
  id: number;
  name: string;
  category: string;
  price: number;
  store: string;
  description: string;
  distance?: number;
  distanceText?: string;
  directions?: string;
  rating: number;
  reviews: number;
}

interface AnalysisData {
  labels: Array<{ description: string; score: number }>;
  confidence: number;
  matchingStrategy: string;
  visionApiUsed: boolean;
}

interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    total: number;
    analysis: AnalysisData;
    location: { latitude: number; longitude: number } | null;
    searchRadius: string;
  };
  duration: string;
  timestamp: string;
  error?: string;
}

export default function AdvancedImageSearch() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [useLocation, setUseLocation] = useState(true);
  const [error, setError] = useState<string>('');

  // Get user's location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setError('');
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Search will be performed without distance filtering.');
      }
    );
  }, []);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Perform advanced image search
  const performSearch = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setError('');

    try {
      // Get location if enabled and not already obtained
      if (useLocation && !location) {
        setSearchProgress(20);
        getCurrentLocation();
      }

      setSearchProgress(40);

      const formData = new FormData();
      formData.append('image', selectedFile);
      
      if (useLocation && location) {
        formData.append('location', JSON.stringify(location));
      }

      setSearchProgress(60);

      const response = await fetch('/api/advanced-image-search', {
        method: 'POST',
        body: formData
      });

      setSearchProgress(80);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      if (data.success) {
        setSearchResults(data.data.results);
        setAnalysisData(data.data.analysis);
        setSearchProgress(100);
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during search');
    } finally {
      setIsSearching(false);
      setTimeout(() => setSearchProgress(0), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Eye className="h-8 w-8 text-blue-600" />
          Advanced AI Image Search
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload an image and let our AI-powered system find matching products in local stores near you using Google Cloud Vision API
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File input */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  Click to upload an image or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, GIF, BMP (max 10MB)
                </p>
              </label>
            </div>

            {/* Image preview */}
            {previewUrl && (
              <div className="space-y-2">
                <h3 className="font-medium">Preview:</h3>
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-w-md mx-auto rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Location toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="use-location"
                checked={useLocation}
                onChange={(e) => setUseLocation(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="use-location" className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                Use my location for distance-based results
              </label>
            </div>

            {/* Search button */}
            <Button
              onClick={performSearch}
              disabled={!selectedFile || isSearching}
              className="w-full"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Cpu className="h-4 w-4 mr-2 animate-spin" />
                  Processing Image...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Products
                </>
              )}
            </Button>

            {/* Progress bar */}
            {isSearching && (
              <div className="space-y-2">
                <Progress value={searchProgress} className="w-full" />
                <p className="text-sm text-gray-600 text-center">
                  {searchProgress < 40 ? 'Analyzing image...' :
                   searchProgress < 80 ? 'Searching products...' :
                   'Finalizing results...'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Detected Labels:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.labels.map((label, index) => (
                    <Badge key={index} variant="secondary">
                      {label.description} ({(label.score * 100).toFixed(0)}%)
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Analysis Details:</h4>
                <div className="space-y-1 text-sm">
                  <p>Confidence: {(analysisData.confidence * 100).toFixed(1)}%</p>
                  <p>Vision API: {analysisData.visionApiUsed ? '✅ Active' : '❌ Fallback'}</p>
                  <p>Strategy: {analysisData.matchingStrategy}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Found {searchResults.length} Matching Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((product) => (
                <Card key={product.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {product.description}
                      </p>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-green-600">
                            ${product.price.toFixed(2)}
                          </span>
                          <div className="text-sm">
                            ⭐ {product.rating} ({product.reviews})
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">{product.store}</p>
                        
                        {product.distance !== undefined && (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <MapPin className="h-3 w-3" />
                            {product.distanceText} away
                          </div>
                        )}
                      </div>
                      
                      {product.directions && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(product.directions, '_blank')}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No results message */}
      {searchResults.length === 0 && analysisData && (
        <Alert>
          <AlertDescription>
            No matching products found for the detected items. Try uploading a different image or expand your search area.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}