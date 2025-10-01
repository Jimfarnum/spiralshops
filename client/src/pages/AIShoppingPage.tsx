import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MessageCircle, Search, Sparkles, MapPin, ShoppingCart } from 'lucide-react';
import AIShoppingAssistant from '@/components/AIShoppingAssistant';
import { Link } from 'wouter';

export default function AIShoppingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI-Powered Shopping
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of local commerce with intelligent search, personalized recommendations, and AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Features Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Shopping Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Search */}
              <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-600" />
                    AI Image Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Upload or take a photo to find similar products in local stores using advanced AI vision
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      GPT-4 Vision Analysis
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Local Store Matching
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Distance-Based Results
                    </div>
                  </div>
                  <Link href="/image-search">
                    <Button className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Try Image Search
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Visual Search */}
              <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Visual Product Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Advanced visual search with product categorization and store recommendations
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Product Recognition
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Category Matching
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Store Recommendations
                    </div>
                  </div>
                  <Link href="/visual-search">
                    <Button variant="outline" className="w-full border-blue-200">
                      <Search className="w-4 h-4 mr-2" />
                      Try Visual Search
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* AI Features Showcase */}
            <Card className="border-2 border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  Phase 4 AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <MessageCircle className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Smart Recommendations</h3>
                    <p className="text-sm text-gray-600">AI-powered product suggestions based on your preferences</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Image Recognition</h3>
                    <p className="text-sm text-gray-600">Advanced computer vision for product identification</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Location Intelligence</h3>
                    <p className="text-sm text-gray-600">GPS-powered local store and product discovery</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick AI Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/near-me">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <MapPin className="w-6 h-6" />
                      <span className="text-sm">Near Me</span>
                    </Button>
                  </Link>
                  <Link href="/wishlist">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <ShoppingCart className="w-6 h-6" />
                      <span className="text-sm">Smart Wishlist</span>
                    </Button>
                  </Link>
                  <Link href="/ai-agents">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Sparkles className="w-6 h-6" />
                      <span className="text-sm">AI Agents</span>
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Search className="w-6 h-6" />
                      <span className="text-sm">Smart Search</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div>
            <AIShoppingAssistant className="sticky top-4" />
          </div>
        </div>
      </div>
    </div>
  );
}