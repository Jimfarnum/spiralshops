import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useLocationStore } from '@/lib/locationStore';
import { Search, MapPin, Building2, Users, Store, Navigation, Star, Clock } from 'lucide-react';

interface Mall {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  image: string;
  description: string;
  storeCount: number;
  category: string;
  rating: number;
  distance?: number;
  hours: string;
  features: string[];
  popularStores: string[];
}

// Comprehensive mall directory with detailed information
const allMalls: Mall[] = [
  // Minnesota Malls
  {
    id: 'mall-1',
    name: 'Mall of America',
    city: 'Bloomington',
    state: 'MN',
    zipCode: '55425',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'America\'s largest mall with over 500 stores, entertainment, and dining options.',
    storeCount: 520,
    category: 'mega',
    rating: 4.5,
    distance: 0.5,
    hours: '10 AM - 9 PM',
    features: ['Food Court', 'Entertainment', 'Parking', 'Kids Zone', 'Movie Theater'],
    popularStores: ['Macy\'s', 'Target', 'Apple Store', 'Nike', 'H&M']
  },
  {
    id: 'mall-2',
    name: 'Ridgedale Mall',
    city: 'Minnetonka',
    state: 'MN',
    zipCode: '55305',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Upscale shopping destination with luxury brands and boutique stores.',
    storeCount: 180,
    category: 'upscale',
    rating: 4.2,
    distance: 1.8,
    hours: '10 AM - 8 PM',
    features: ['Luxury Brands', 'Dining', 'Valet Parking', 'Personal Shopping'],
    popularStores: ['Nordstrom', 'Williams Sonoma', 'Coach', 'Lululemon']
  },
  {
    id: 'mall-3',
    name: 'Southdale Center',
    city: 'Edina',
    state: 'MN',
    zipCode: '55435',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Historic shopping center, America\'s first enclosed mall, recently renovated.',
    storeCount: 140,
    category: 'regional',
    rating: 4.0,
    distance: 2.3,
    hours: '10 AM - 9 PM',
    features: ['Historic Significance', 'Food Court', 'Free WiFi', 'Family Events'],
    popularStores: ['Macy\'s', 'JCPenney', 'Bath & Body Works', 'GameStop']
  },

  // California Malls
  {
    id: 'mall-5',
    name: 'Beverly Center',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90048',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Iconic LA shopping destination with luxury brands and rooftop dining.',
    storeCount: 160,
    category: 'luxury',
    rating: 4.3,
    distance: 1.2,
    hours: '10 AM - 10 PM',
    features: ['Rooftop Dining', 'Luxury Shopping', 'Valet Service', 'Art Installations'],
    popularStores: ['Bloomingdale\'s', 'Gucci', 'Louis Vuitton', 'Tesla']
  },
  {
    id: 'mall-7',
    name: 'Westfield Valley Fair',
    city: 'Santa Clara',
    state: 'CA',
    zipCode: '95050',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Silicon Valley\'s premier shopping center with tech-forward experiences.',
    storeCount: 240,
    category: 'regional',
    rating: 4.4,
    distance: 0.8,
    hours: '10 AM - 9 PM',
    features: ['Tech Hub', 'Interactive Displays', 'Electric Vehicle Charging', 'Innovation Labs'],
    popularStores: ['Apple Store', 'Microsoft Store', 'Tesla', 'Nordstrom']
  },

  // New York Malls
  {
    id: 'mall-8',
    name: 'Westfield World Trade Center',
    city: 'New York',
    state: 'NY',
    zipCode: '10007',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Underground shopping destination at the heart of Lower Manhattan.',
    storeCount: 125,
    category: 'urban',
    rating: 4.1,
    distance: 0.3,
    hours: '10 AM - 8 PM',
    features: ['Underground Access', 'Transit Connected', 'Memorial Views', 'Business District'],
    popularStores: ['Eataly', 'Kate Spade', 'Hugo Boss', 'Sephora']
  },
  {
    id: 'mall-9',
    name: 'Roosevelt Field',
    city: 'Garden City',
    state: 'NY',
    zipCode: '11530',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Long Island\'s largest shopping mall with diverse retail and dining.',
    storeCount: 270,
    category: 'regional',
    rating: 4.2,
    distance: 2.1,
    hours: '10 AM - 9 PM',
    features: ['Large Food Court', 'Department Stores', 'Family Entertainment', 'Ample Parking'],
    popularStores: ['Macy\'s', 'Nordstrom', 'Apple Store', 'Zara']
  },

  // Texas Malls
  {
    id: 'mall-11',
    name: 'Galleria Dallas',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75240',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Upscale shopping center with ice skating rink and luxury boutiques.',
    storeCount: 200,
    category: 'upscale',
    rating: 4.3,
    distance: 1.8,
    hours: '10 AM - 9 PM',
    features: ['Ice Skating Rink', 'Luxury Brands', 'Fine Dining', 'Hotels'],
    popularStores: ['Nordstrom', 'Macy\'s', 'Tiffany & Co.', 'Westin Hotel']
  },

  // Florida Malls
  {
    id: 'mall-14',
    name: 'Aventura Mall',
    city: 'Aventura',
    state: 'FL',
    zipCode: '33180',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    description: 'Miami area\'s premier shopping destination with luxury and lifestyle brands.',
    storeCount: 300,
    category: 'luxury',
    rating: 4.4,
    distance: 1.3,
    hours: '10 AM - 10 PM',
    features: ['Luxury Shopping', 'Art Installations', 'Outdoor Spaces', 'Sliding Roof'],
    popularStores: ['Nordstrom', 'Bloomingdale\'s', 'Apple Store', 'Louis Vuitton']
  }
];

const mallCategories = ['All', 'mega', 'luxury', 'upscale', 'regional', 'urban'];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'distance', label: 'Distance: Nearest First' },
  { value: 'stores', label: 'Most Stores' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'alphabetical', label: 'A-Z' }
];

export default function MallsPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  
  const { setMallContext } = useLocationStore();

  const filteredMalls = useMemo(() => {
    let filtered = allMalls.filter(mall => {
      // Search query filtering
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = mall.name.toLowerCase().includes(query);
        const matchesCity = mall.city.toLowerCase().includes(query);
        const matchesState = mall.state.toLowerCase().includes(query);
        const matchesDescription = mall.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesState && !matchesDescription) {
          return false;
        }
      }

      // Category filtering
      if (selectedCategory !== 'All' && mall.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'stores':
        filtered.sort((a, b) => b.storeCount - a.storeCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep default order for relevance
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleMallSelect = (mall: Mall) => {
    setMallContext(mall.id, mall.name);
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,99.6%)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 font-['Inter']">
            <li><Link href="/" className="hover:text-[hsl(183,100%,23%)]">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">Shopping Malls</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Poppins'] mb-4">
            Shopping Malls Directory
          </h1>
          <p className="text-xl text-gray-600 font-['Inter'] mb-6">
            Discover amazing shopping destinations across the United States
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search malls by name, city, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg rounded-xl"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 h-12 rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {mallCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    <span className="capitalize">{category === 'All' ? 'All Categories' : category}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-['Inter']">
            {filteredMalls.length} shopping {filteredMalls.length === 1 ? 'mall' : 'malls'} found
          </p>
        </div>

        {/* Mall Grid */}
        {filteredMalls.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4 font-['Inter']">No malls found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortBy('relevance');
              }}
              className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMalls.map(mall => (
              <Card key={mall.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                <div className="relative">
                  <img 
                    src={mall.image} 
                    alt={mall.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <Badge 
                    className={`absolute top-3 right-3 capitalize ${
                      mall.category === 'luxury' ? 'bg-purple-100 text-purple-800' :
                      mall.category === 'mega' ? 'bg-green-100 text-green-800' :
                      mall.category === 'upscale' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {mall.category}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold font-['Poppins'] mb-1">
                        {mall.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {mall.city}, {mall.state}
                        {mall.distance && (
                          <span className="ml-2 text-blue-600">
                            • {mall.distance} mi
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{mall.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 font-['Inter']">
                    {mall.description}
                  </CardDescription>

                  {/* Mall Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Store className="h-4 w-4 mr-1" />
                      {mall.storeCount} stores
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {mall.hours}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mall.features.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {mall.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{mall.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Popular Stores */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Popular stores:</p>
                    <p className="text-sm text-gray-700 font-['Inter']">
                      {mall.popularStores.slice(0, 3).join(', ')}
                      {mall.popularStores.length > 3 && '...'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]"
                      onClick={() => handleMallSelect(mall)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Shop This Mall
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/mall/${mall.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}