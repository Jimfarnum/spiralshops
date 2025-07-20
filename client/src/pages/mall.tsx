import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Store, Users, Star, Filter } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Mock mall and store data
const mockMalls = {
  'downtown-plaza': {
    id: 'downtown-plaza',
    name: 'Downtown Plaza',
    address: '123 Main Street, Downtown',
    description: 'Premier shopping destination in the heart of the city',
    stores: [
      {
        id: 1,
        name: 'Vintage Threads',
        logo: 'https://images.unsplash.com/photo-1558655146-364adaf25ee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        description: 'Curated vintage and retro fashion',
        category: 'clothing',
        rating: 4.8,
        followerCount: 156
      },
      {
        id: 2,
        name: 'TechHub Electronics',
        logo: 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        description: 'Latest gadgets and electronics',
        category: 'electronics',
        rating: 4.6,
        followerCount: 289
      },
      {
        id: 3,
        name: 'Garden Fresh Market',
        logo: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        description: 'Organic groceries and fresh produce',
        category: 'food',
        rating: 4.9,
        followerCount: 425
      },
      {
        id: 4,
        name: 'Style Studio',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        description: 'Modern clothing and accessories',
        category: 'clothing',
        rating: 4.7,
        followerCount: 312
      },
      {
        id: 5,
        name: 'Book Corner',
        logo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        description: 'Books, magazines, and stationery',
        category: 'books',
        rating: 4.5,
        followerCount: 178
      },
      {
        id: 6,
        name: 'Coffee Central',
        logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        description: 'Artisan coffee and light meals',
        category: 'food',
        rating: 4.8,
        followerCount: 534
      }
    ]
  }
};

const categories = [
  { id: 'all', name: 'All Stores', icon: Store },
  { id: 'clothing', name: 'Clothing', icon: Users },
  { id: 'electronics', name: 'Electronics', icon: Store },
  { id: 'food', name: 'Food & Dining', icon: Store },
  { id: 'books', name: 'Books & Media', icon: Store }
];

const Mall = ({ params }: { params: { mallName: string } }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const mallName = params?.mallName || 'downtown-plaza';
  const mall = mockMalls[mallName as keyof typeof mockMalls];

  if (!mall) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Mall not found</h1>
            <p className="text-gray-600 mb-8">The mall you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredStores = selectedCategory === 'all' 
    ? mall.stores 
    : mall.stores.filter(store => store.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Mall Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{mall.name}</h1>
            <div className="flex items-center justify-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{mall.address}</span>
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">{mall.description}</p>
            <div className="mt-6 flex justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                {mall.stores.length} Stores
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Open Today
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Store Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? 'All Stores' : 
             categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredStores.length} stores)
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={store.logo}
                      alt={`${store.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{store.rating}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{store.followerCount} followers</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{store.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {store.category}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Follow Store
                      </Button>
                      <Link href={`/store/${store.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Visit Store
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mall Map Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mall Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-gray-100 rounded-lg">
                {mall.stores.map((store, index) => (
                  <div
                    key={store.id}
                    className="bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Unit {index + 1}01</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Interactive mall map - Click on any store to view details
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Mall;