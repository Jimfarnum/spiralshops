import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Search, MapPin, Store, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

const MallsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock malls data - in a real app, this would come from your API
  const malls = [
    {
      id: 1,
      name: "Downtown Plaza",
      location: "Downtown District",
      stores: 45,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      featured: "Fashion & Electronics",
      rating: 4.5,
      href: "/mall/downtown-plaza"
    },
    {
      id: 2,
      name: "Riverside Shopping Center",
      location: "Riverside Area",
      stores: 32,
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      featured: "Home & Lifestyle",
      rating: 4.3,
      href: "/mall/riverside-center"
    },
    {
      id: 3,
      name: "Heritage Square Mall",
      location: "Historic Quarter",
      stores: 28,
      image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      featured: "Local Artisans & Food",
      rating: 4.7,
      href: "/mall/heritage-square"
    },
    {
      id: 4,
      name: "Sunset Valley Mall",
      location: "West End",
      stores: 52,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      featured: "Entertainment & Dining",
      rating: 4.4,
      href: "/mall/sunset-valley"
    },
    {
      id: 5,
      name: "Metro Center",
      location: "City Center",
      stores: 67,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      featured: "Luxury & Department Stores",
      rating: 4.6,
      href: "/mall/metro-center"
    }
  ];

  // Filter malls based on search term
  const filteredMalls = malls.filter(mall =>
    mall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mall.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mall.featured.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Malls</h1>
          <p className="text-gray-600">Find the best shopping destinations in your area</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search malls by name, location, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Showing {filteredMalls.length} malls
          </div>
        </div>

        {/* Malls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMalls.map((mall) => (
            <Link key={mall.id} href={mall.href} className="group">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={mall.image} 
                    alt={mall.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--spiral-coral)] transition-colors">
                      {mall.name}
                    </h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">
                        {mall.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{mall.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <Store className="w-4 h-4 mr-2" />
                    <span className="text-sm">{mall.stores} stores</span>
                  </div>
                  
                  <Badge variant="secondary" className="mb-4">
                    {mall.featured}
                  </Badge>
                  
                  <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white">
                    Explore Mall
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMalls.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No malls found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Shop at SPIRAL Malls?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Retailers</h3>
              <p className="text-gray-600">All stores are verified and trusted local businesses</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--spiral-sage)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn SPIRALs</h3>
              <p className="text-gray-600">Get rewards for every purchase at participating stores</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Focus</h3>
              <p className="text-gray-600">Support local businesses and strengthen your community</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MallsPage;