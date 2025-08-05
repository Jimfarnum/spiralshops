import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Store, Search, Filter, Star, Users, ShoppingBag, Navigation } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import LocationPermissionRequest from '@/components/LocationPermissionRequest';
import { locationService, type LocationData } from '@/services/locationService';

interface Mall {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  image: string;
  tenantCount: number;
  categories: string[];
  spiralPerks: string[];
  rating: number;
  distance: number;
  featured: boolean;
}

const mallsData: Mall[] = [
  {
    id: 'downtown-plaza',
    name: 'Downtown SPIRAL Plaza',
    location: 'Downtown District',
    address: '123 Main Street, City Center',
    description: 'The flagship SPIRAL mall featuring the best local artisans, boutiques, and eateries. Experience authentic local culture with exclusive SPIRAL rewards and community events.',
    image: 'https://images.unsplash.com/photo-1555529669-2269763671c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    tenantCount: 45,
    categories: ['fashion', 'food', 'home', 'gifts', 'beauty'],
    spiralPerks: ['Double SPIRALs on weekends', 'Exclusive member events', 'Priority pickup service'],
    rating: 4.8,
    distance: 0.5,
    featured: true
  },
  {
    id: 'artisan-quarter',
    name: 'Artisan Quarter Mall',
    location: 'Historic Arts District',
    address: '456 Craft Lane, Arts Quarter',
    description: 'A curated collection of local craftspeople and artisans. From handmade jewelry to custom furniture, discover unique pieces that tell the story of our community.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    tenantCount: 28,
    categories: ['crafts', 'art', 'home', 'gifts'],
    spiralPerks: ['Artisan workshops included', 'Custom order discounts', 'Meet-the-maker events'],
    rating: 4.9,
    distance: 1.2,
    featured: true
  },
  {
    id: 'neighborhood-center',
    name: 'Neighborhood SPIRAL Center',
    location: 'Riverside Community',
    address: '789 Community Blvd, Riverside',
    description: 'Your local community hub bringing together essential services, fresh groceries, and neighborhood favorites all in one convenient location.',
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    tenantCount: 32,
    categories: ['grocery', 'services', 'health', 'food'],
    spiralPerks: ['Daily pickup convenience', 'Grocery loyalty bonuses', 'Community event hosting'],
    rating: 4.6,
    distance: 2.1,
    featured: false
  },
  {
    id: 'green-market',
    name: 'Green Market SPIRAL Hub',
    location: 'Sustainable District',
    address: '321 Eco Way, Green Quarter',
    description: 'Focused on sustainable living and eco-friendly products. Support local businesses that care about our environment and community future.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    tenantCount: 22,
    categories: ['sustainable', 'food', 'beauty', 'home'],
    spiralPerks: ['Eco-bonus SPIRALs', 'Sustainability workshops', 'Carbon-neutral delivery'],
    rating: 4.7,
    distance: 3.5,
    featured: false
  }
];

export default function MallDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [showLocationRequest, setShowLocationRequest] = useState(true);

  // Mall location search query
  const { data: mallSearchResults, isLoading: mallsLoading, error: mallsError, refetch: refetchMalls } = useQuery({
    queryKey: ['/api/mall-location-search', userLocation, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      if (userLocation?.coordinates) {
        params.append('latitude', userLocation.coordinates.latitude.toString());
        params.append('longitude', userLocation.coordinates.longitude.toString());
        params.append('radius', '25'); // 25 mile radius for malls
      }
      
      if (userLocation?.city) params.append('city', userLocation.city);
      if (userLocation?.state) params.append('state', userLocation.state);
      
      const response = await fetch(`/api/mall-location-search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to search malls');
      }
      return response.json();
    },
    enabled: !!userLocation || selectedCategory !== 'all'
  });

  const handleLocationGranted = (location: LocationData) => {
    setUserLocation(location);
    setShowLocationRequest(false);
    refetchMalls();
  };

  const handleLocationDenied = () => {
    setShowLocationRequest(false);
  };

  // Use API results or fallback to static data
  const apiMalls = mallSearchResults?.malls || [];
  const displayMalls = apiMalls.length > 0 ? apiMalls : mallsData;

  const filteredMalls = displayMalls
    .filter(mall => {
      const matchesSearch = mall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mall.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || mall.categories?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || Infinity) - (b.distance || Infinity);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'tenants':
          return (b.tenantCount || 0) - (a.tenantCount || 0);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

  const allCategories = Array.from(new Set(displayMalls.flatMap(mall => mall.categories || [])));

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
            SPIRAL Mall Directory
          </h1>
          <p className="text-xl text-gray-600 mb-2 font-['Inter']">
            Discover local shopping destinations in your community
          </p>
          <p className="text-[var(--spiral-coral)] font-semibold font-['Inter']">
            Everything Local. Just for You.
          </p>
        </div>

        {/* Location Permission Request */}
        {showLocationRequest && !userLocation && (
          <div className="mb-8">
            <LocationPermissionRequest
              onLocationGranted={handleLocationGranted}
              onLocationDenied={handleLocationDenied}
            />
          </div>
        )}

        {/* Location Status */}
        {userLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-green-800">
              <Navigation className="h-4 w-4" />
              <span className="font-medium">Your Location:</span>
              <span>{userLocation.city && userLocation.state ? `${userLocation.city}, ${userLocation.state}` : 'Location detected'}</span>
              <Badge variant="secondary" className="ml-auto">
                {displayMalls.length} malls found nearby
              </Badge>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search malls or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="tenants">Number of Stores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Malls */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">
            Featured SPIRAL Destinations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mallsData.filter(mall => mall.featured).map(mall => (
              <Card key={mall.id} className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={mall.image}
                    alt={mall.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-[var(--spiral-coral)] text-white">
                    Featured
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                        {mall.name}
                      </CardTitle>
                      <CardDescription className="font-['Inter'] flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {mall.location} • {mall.distance} miles
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold">{mall.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 font-['Inter']">{mall.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600 font-['Inter']">
                        <Store className="h-4 w-4 mr-2" />
                        {mall.tenantCount} Local Stores
                      </div>
                      <div className="flex items-center text-sm text-gray-600 font-['Inter']">
                        <Users className="h-4 w-4 mr-2" />
                        Community Hub
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {mall.spiralPerks.slice(0, 2).map((perk, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-[var(--spiral-sage)] text-[var(--spiral-sage)]">
                          {perk}
                        </Badge>
                      ))}
                    </div>

                    <Link href={`/mall/${mall.id}`}>
                      <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white rounded-xl">
                        Explore Mall
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Malls Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">
            All SPIRAL Malls ({filteredMalls.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMalls.map(mall => (
              <Card key={mall.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={mall.image}
                    alt={mall.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  {mall.featured && (
                    <Badge className="absolute top-2 right-2 bg-[var(--spiral-gold)] text-white text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[var(--spiral-navy)] font-['Poppins']">
                    {mall.name}
                  </CardTitle>
                  <CardDescription className="font-['Inter'] text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {mall.distance ? `${mall.distance} mi` : mall.location} • {mall.tenantCount} stores
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold">{mall.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mall.categories.slice(0, 2).map(category => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Link href={`/mall/${mall.id}`}>
                    <Button variant="outline" className="w-full border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white rounded-xl">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[var(--spiral-sage)]/20 to-[var(--spiral-coral)]/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
            Ready to Explore Your Local Community?
          </h3>
          <p className="text-gray-600 mb-6 font-['Inter']">
            Visit any SPIRAL mall to earn rewards, support local businesses, and discover unique products you won't find anywhere else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-8 py-3 rounded-xl">
                Browse Products
              </Button>
            </Link>
            <Link href="/spirals">
              <Button variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white px-8 py-3 rounded-xl">
                Learn About SPIRALs
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};