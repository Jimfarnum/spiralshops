import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { MapPin, Upload, Camera, Navigation, Star, Clock } from 'lucide-react';

interface SearchResult {
  name: string;
  store?: string;
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

interface AnalysisData {
  labels?: Array<{ description: string; score: number }>;
  searchTerms?: string[];
}

export default function ImageSearchUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => alert("Location permission denied.")
    );
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0];
    setFile(imageFile);
    getLocation();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      setFile(imageFile);
      getLocation();
    }
  };

  const handleUpload = async () => {
    if (!file || !location) return alert("Image or location missing.");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("location", JSON.stringify(location));

    try {
      const res = await fetch("/api/ai-image-search", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.data?.products || data.data || []);
        setAnalysisData(data.data?.analysis);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Simple Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed gray",
          padding: "40px",
          textAlign: "center",
          marginBottom: "20px",
        }}
        className="rounded-lg hover:border-blue-400 transition-colors"
      >
        {file ? `Selected: ${file.name}` : "Drag and drop an image here"}
      </div>

      {/* Location Status */}
      {location && (
        <div className="text-center text-green-600 mb-4">
          Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </div>
      )}

      {/* Upload Button */}
      <div className="text-center">
        <button 
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Analyzing..." : "Search by Image"}
        </button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map((item, idx) => (
            <li key={idx} className="border p-4 rounded-lg bg-white shadow-sm">
              <strong className="text-lg">{item.name}</strong> — {item.distance} mi away
              <br />
              {item.store && <span className="text-gray-600">Store: {item.store}</span>}
              <br />
              {item.directions && (
                <a href={item.directions} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  Get Directions
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Analysis Data */}
      {analysisData && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">AI Analysis:</h4>
          {analysisData.labels && (
            <div className="mb-2">
              <span className="text-sm font-medium">Detected: </span>
              {analysisData.labels.slice(0, 5).map((label, idx) => (
                <span key={idx} className="text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                  {label.description} ({Math.round(label.score * 100)}%)
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}