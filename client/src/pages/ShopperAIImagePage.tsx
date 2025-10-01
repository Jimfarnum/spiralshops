import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Smartphone, Brain, MapPin } from 'lucide-react';
import ShopperAIImageAgent from '../components/ShopperAIImageAgent';
import { mobileStyles } from '../styles/mobile-config';

export default function ShopperAIImagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-optimized styling */}
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-full p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ShopperAI Image Search</h1>
                <p className="text-gray-600 text-sm">AI-powered visual product discovery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">Mobile Optimized</h3>
                <p className="text-blue-100 text-sm">Perfect for on-the-go shopping</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Brain className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">AI-Powered Analysis</h3>
                <p className="text-blue-100 text-sm">Smart product recognition</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">Local Results</h3>
                <p className="text-blue-100 text-sm">Find products at nearby stores</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6">
        <ShopperAIImageAgent />
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">1</div>
                <p>Take or upload a photo</p>
              </div>
              <div>
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">2</div>
                <p>AI analyzes the image</p>
              </div>
              <div>
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">3</div>
                <p>Search local inventory</p>
              </div>
              <div>
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">4</div>
                <p>Get directions to stores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}