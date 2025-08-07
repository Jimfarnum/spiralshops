import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { MapPin, Upload, Camera, Navigation, Star, Clock } from 'lucide-react';

interface AnalysisData {
  labels?: Array<{ description: string; score: number }>;
  searchTerms?: string[];
}

interface SearchResult {
  name: string;
  store: string;
  distance: string;
  price?: string;
  rating?: number;
  confidence?: number;
  directions?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

export default function ImageSearchUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => alert("Location permission denied. Please enable GPS for better results.")
    );
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0];
    
    if (imageFile && imageFile.type.startsWith('image/')) {
      setFile(imageFile);
      getLocation();
      setProgress(25);
    } else {
      alert("Please drop a valid image file (JPG, PNG, GIF, BMP)");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile && imageFile.type.startsWith('image/')) {
      setFile(imageFile);
      getLocation();
      setProgress(25);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");
    if (!location) return alert("Location is required for local search results.");
    
    setUploading(true);
    setProgress(50);
    
    const formData = new FormData();
    formData.append("image", file);
    formData.append("location", JSON.stringify(location));

    try {
      setProgress(75);
      const res = await fetch("/api/ai-image-search", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setProgress(100);
      
      if (data.success) {
        setResults(data.data?.products || []);
        setAnalysisData(data.data?.analysis);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Image Search Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            {file ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">Selected: {file.name}</p>
                <p className="text-sm text-gray-500">File size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">Drag and drop an image here</p>
                <p className="text-gray-500">or click to browse files</p>
                <p className="text-xs text-gray-400">Supports JPG, PNG, GIF, BMP up to 10MB</p>
              </div>
            )}
          </div>

          {/* Location Status */}
          {location && (
            <Alert className="bg-green-50 border-green-200">
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!file || !location || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Search by Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Detected Labels:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.labels?.slice(0, 8).map((label, idx) => (
                    <Badge key={idx} variant="secondary">
                      {label.description} ({Math.round(label.score * 100)}%)
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Search Terms Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.searchTerms?.map((term, idx) => (
                    <Badge key={idx} variant="outline">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Local Product Matches ({results.length} found)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">{item.store}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{item.distance} mi away</span>
                      </div>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      {item.price && (
                        <p className="text-xl font-bold text-green-600">{item.price}</p>
                      )}
                      {item.confidence && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(item.confidence)}% match
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {item.directions && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.directions} target="_blank" rel="noreferrer">
                            <Navigation className="h-4 w-4 mr-1" />
                            Directions
                          </a>
                        </Button>
                      )}
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {results.length === 0 && file && !uploading && (
        <Card>
          <CardContent className="text-center py-8">
            <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No matching products found in your area.</p>
            <p className="text-sm text-gray-500 mt-2">Try uploading a different image or expand your search radius.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}