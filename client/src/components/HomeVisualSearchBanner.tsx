import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, Upload, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

interface HomeVisualSearchBannerProps {
  className?: string;
}

export default function HomeVisualSearchBanner({ className }: HomeVisualSearchBannerProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      // Navigate to visual search page with the file
      // This would need to be passed via a state or context
      window.location.href = '/visual-search';
    }
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 border-0 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Camera className="h-5 w-5 text-purple-600" />
              </div>
              <div className="p-1 bg-yellow-100 rounded-md">
                <Sparkles className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                NEW FEATURE
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Shop by Photo with AI Vision
            </h3>
            
            <p className="text-gray-600 mb-4 text-sm">
              Upload any image and our AI will identify the product, then find similar items in nearby stores. 
              Perfect for finding that exact item you saw somewhere!
            </p>
            
            <div className="flex items-center gap-3">
              <Link href="/visual-search">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Try Visual Search
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <div className="text-xs text-gray-500">
                Works with any photo
              </div>
            </div>
          </div>
          
          {/* Visual Upload Area */}
          <div className="ml-6 relative">
            <div 
              className={`w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 ${
                isDragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 bg-white/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className={`h-6 w-6 mx-auto mb-1 ${isDragOver ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className="text-xs text-gray-500">
                  Drag photo here
                </div>
              </div>
            </div>
            
            {/* Floating examples */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-lg shadow-md border p-1">
              <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-300 rounded"></div>
            </div>
            <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-white rounded-lg shadow-md border p-1">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Usage stats or features */}
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>✨ AI-powered recognition</span>
              <span>📍 Location-based results</span>
              <span>🏪 Real nearby stores</span>
            </div>
            <div className="text-purple-600 font-medium">
              Free to use
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}