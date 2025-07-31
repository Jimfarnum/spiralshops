import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating, EnhancedReviews, EnhancedWishlistButton, SpiralPlusBanner } from '@/components/enhanced-features';

export default function EnhancedFeaturesDemo() {
  // Mock user data for demo
  const mockUser = {
    id: 'user-123',
    name: 'John Doe'
  };

  // Mock product data for demo
  const mockProduct = {
    id: 'prod-456',
    name: 'Premium Local Honey',
    price: 24.99,
    image: '/api/placeholder/300/300'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enhanced SPIRAL Features
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the improved components with better TypeScript support, 
            shadcn/ui integration, and seamless backend connectivity.
          </p>
        </div>

        {/* SPIRAL Plus Banner */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">SPIRAL Plus Membership</h2>
          <SpiralPlusBanner />
        </section>

        {/* Star Rating Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Enhanced Star Rating</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interactive Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Rate this product:
                    </label>
                    <StarRating value={0} onChange={(rating) => console.log('Rating:', rating)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Read-Only Display</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <StarRating value={4.5} readOnly />
                    <span className="text-sm text-gray-600">4.5 out of 5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={3.2} readOnly size="sm" />
                    <span className="text-xs text-gray-500">3.2 average</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Size Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <StarRating value={5} readOnly size="sm" />
                    <span className="text-xs">Small</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={4} readOnly size="md" />
                    <span className="text-sm">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={3} readOnly size="lg" />
                    <span className="text-base">Large</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Wishlist Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Enhanced Wishlist Button</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={mockProduct.image} 
                    alt={mockProduct.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{mockProduct.name}</h3>
                    <p className="text-gray-600">${mockProduct.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <EnhancedWishlistButton
                    productId={mockProduct.id}
                    productName={mockProduct.name}
                    productPrice={mockProduct.price}
                    productImage={mockProduct.image}
                    userId={mockUser.id}
                  />
                  <Badge variant="secondary">Demo Mode</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reviews Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Enhanced Reviews System</h2>
          <EnhancedReviews
            productId={mockProduct.id}
            userId={mockUser.id}
            userName={mockUser.name}
          />
        </section>

        {/* Features Comparison */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Improvements Made</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Previous Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• No TypeScript support</li>
                  <li>• Basic inline styles only</li>
                  <li>• Local storage only persistence</li>
                  <li>• No proper error handling</li>
                  <li>• Limited accessibility features</li>
                  <li>• No integration with existing systems</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Enhanced Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Full TypeScript integration</li>
                  <li>• shadcn/ui component library</li>
                  <li>• Backend API connectivity</li>
                  <li>• React Query for data management</li>
                  <li>• Toast notifications & error handling</li>
                  <li>• Integration with SPIRAL authentication</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Details */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Technical Implementation</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-blue-600">Frontend</h3>
                  <ul className="text-sm space-y-1">
                    <li>• React with TypeScript</li>
                    <li>• shadcn/ui components</li>
                    <li>• TanStack Query</li>
                    <li>• Tailwind CSS</li>
                    <li>• Lucide React icons</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-green-600">Backend</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Express.js routes</li>
                    <li>• Zod validation</li>
                    <li>• RESTful API design</li>
                    <li>• Error handling</li>
                    <li>• Data persistence</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-purple-600">Features</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Star ratings system</li>
                    <li>• Reviews & verification</li>
                    <li>• Wishlist management</li>
                    <li>• Membership promotion</li>
                    <li>• Real-time updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Integration Notes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Integration Guide</h2>
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">How to Use These Components</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono">
                  <p className="mb-2">// Import the enhanced components</p>
                  <p className="mb-2 text-blue-600">import {'{'} StarRating, EnhancedReviews, EnhancedWishlistButton {'}'} from '@/components/enhanced-features';</p>
                  <p className="mb-2">// Use in your product pages</p>
                  <p className="text-green-600">&lt;StarRating value={'{rating}'} onChange={'{setRating}'} /&gt;</p>
                </div>
                <p className="mt-4 text-gray-600">
                  These components are now fully integrated with your SPIRAL platform's existing 
                  authentication, styling, and data management systems.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}