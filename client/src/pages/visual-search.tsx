import React from 'react';
import VisualSearch from '@/components/VisualSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Search, MapPin, ShoppingBag, Sparkles } from 'lucide-react';

export default function VisualSearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Visual Product Search</h1>
          <p className="text-xl text-gray-600 mb-6">
            Upload a photo to find similar products in nearby stores
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              AI Image Analysis
            </span>
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Smart Product Matching
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location-Based Results
            </span>
          </div>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Upload Image</h3>
              <p className="text-sm text-gray-600">
                Take a photo or upload an image of the product you're looking for
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Our AI identifies product type, colors, style, and key features
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Find Nearby</h3>
              <p className="text-sm text-gray-600">
                Search for stores near your location that might carry similar items
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Shop Local</h3>
              <p className="text-sm text-gray-600">
                Get directions and visit local stores to find your perfect match
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Visual Search Interface */}
        <VisualSearch />

        {/* Additional Features */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI-Powered Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Advanced computer vision for accurate product identification</li>
                <li>• Color, style, and brand recognition</li>
                <li>• Category and subcategory classification</li>
                <li>• Price range estimation</li>
                <li>• Gender and age group targeting</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Smart Location Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• GPS-based proximity search</li>
                <li>• Category-relevant store filtering</li>
                <li>• Real-time distance calculation</li>
                <li>• Store verification and ratings</li>
                <li>• One-click directions to stores</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Best Results</CardTitle>
            <CardDescription>
              Get the most accurate matches with these photo tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Photo Quality</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Use good lighting</li>
                  <li>• Focus on the main product</li>
                  <li>• Avoid blurry images</li>
                  <li>• Include full product view</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Best Angles</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Front-facing view preferred</li>
                  <li>• Show distinctive features</li>
                  <li>• Include brand logos if visible</li>
                  <li>• Capture unique details</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What Works Best</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Clothing and fashion items</li>
                  <li>• Electronics and gadgets</li>
                  <li>• Jewelry and accessories</li>
                  <li>• Home decor and furniture</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}