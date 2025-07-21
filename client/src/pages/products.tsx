import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import LocationFilter from '@/components/location-filter';
import { useLocationStore } from '@/lib/locationStore';
import { Search, Filter, X, MapPin, Building2, Navigation, Target } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  store: string;
  category: string;
  description?: string;
  distance?: number;
  zipCode?: string;
  mallId?: string;
  mallName?: string;
  city?: string;
  state?: string;
}

// Comprehensive nationwide product data with smart categorization and product use cases
const allProducts: Product[] = [
  // Minnesota Products
  { id: 1, name: "Artisan Coffee Blend", price: 24.99, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Local Roasters", category: "food", description: "Premium single-origin coffee blend • Perfect for morning energy", distance: 0.8, zipCode: "55305", city: "Minnetonka", state: "MN", mallId: "mall-2", mallName: "Ridgedale Mall" },
  { id: 2, name: "Handmade Ceramic Mug", price: 18.50, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Pottery Studio", category: "home", description: "Beautiful handcrafted ceramic mug • Office-ready, gift-worthy", distance: 1.2, zipCode: "55425", city: "Bloomington", state: "MN", mallId: "mall-1", mallName: "Mall of America" },
  { id: 3, name: "Organic Honey", price: 12.99, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Bee Farm Co.", category: "food", description: "Pure organic wildflower honey • Healthy cooking, natural wellness", distance: 2.1, zipCode: "55344", city: "Minnetonka", state: "MN" },
  { id: 4, name: "Vintage Leather Jacket", price: 89.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Vintage Threads", category: "clothing", description: "Classic leather jacket • Office-ready, weekend casual", distance: 0.5, zipCode: "55425", city: "Bloomington", state: "MN", mallId: "mall-1", mallName: "Mall of America" },
  
  // California Products
  { id: 5, name: "Surf Board Wax", price: 12.50, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Wave Riders", category: "sports", description: "Premium surf wax • For beach days, water sports", distance: 1.2, zipCode: "90048", city: "Los Angeles", state: "CA", mallId: "mall-5", mallName: "Beverly Center" },
  { id: 6, name: "Organic Avocado Oil", price: 19.99, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Farm Fresh CA", category: "food", description: "Cold-pressed avocado oil • Healthy cooking, skincare", distance: 2.3, zipCode: "94304", city: "Palo Alto", state: "CA", mallId: "mall-6", mallName: "Stanford Shopping Center" },
  { id: 7, name: "Tech Startup Hoodie", price: 65.00, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Silicon Style", category: "clothing", description: "Premium comfort hoodie • Office-ready, casual Friday", distance: 0.8, zipCode: "95050", city: "Santa Clara", state: "CA", mallId: "mall-7", mallName: "Westfield Valley Fair" },
  
  // New York Products
  { id: 8, name: "NYC Skyline Print", price: 45.00, image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Metro Art Gallery", category: "home", description: "Limited edition NYC print • Home decor, office wall art", distance: 0.3, zipCode: "10007", city: "New York", state: "NY", mallId: "mall-8", mallName: "Westfield World Trade Center" },
  { id: 9, name: "Artisan Bagels", price: 8.99, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Brooklyn Bakery", category: "food", description: "Hand-rolled authentic bagels • Morning breakfast, office treats", distance: 2.1, zipCode: "11530", city: "Garden City", state: "NY", mallId: "mall-9", mallName: "Roosevelt Field" },
  { id: 10, name: "Broadway Show Tote", price: 22.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Theater District Gifts", category: "clothing", description: "Official Broadway merchandise • Show memorabilia, gift-worthy", distance: 1.5, zipCode: "11373", city: "Elmhurst", state: "NY", mallId: "mall-10", mallName: "Queens Center" },
  
  // Texas Products
  { id: 11, name: "BBQ Spice Rub", price: 14.99, image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Texas Flavors", category: "food", description: "Authentic Texas BBQ blend • For grilling, outdoor cooking", distance: 1.8, zipCode: "75240", city: "Dallas", state: "TX", mallId: "mall-11", mallName: "Galleria Dallas" },
  { id: 12, name: "Cowboy Boots", price: 129.99, image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Lone Star Leather", category: "clothing", description: "Authentic handcrafted boots • Western style, durable wear", distance: 3.2, zipCode: "78752", city: "Austin", state: "TX", mallId: "mall-12", mallName: "Highland Mall" },
  { id: 13, name: "Oil Rig Model", price: 35.50, image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Energy Collectibles", category: "home", description: "Detailed oil rig replica • Office decor, collector's item", distance: 2.5, zipCode: "77056", city: "Houston", state: "TX", mallId: "mall-13", mallName: "The Galleria" },
  
  // Florida Products
  { id: 14, name: "Tropical Plant Kit", price: 28.99, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Miami Green", category: "home", description: "Indoor tropical plants • Home decor, office greenery", distance: 1.3, zipCode: "33180", city: "Aventura", state: "FL", mallId: "mall-14", mallName: "Aventura Mall" },
  { id: 15, name: "Key Lime Pie Mix", price: 11.99, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Keys Kitchen", category: "food", description: "Authentic Florida dessert mix • For entertaining, special occasions", distance: 2.8, zipCode: "33431", city: "Boca Raton", state: "FL", mallId: "mall-15", mallName: "Town Center at Boca Raton" },
  { id: 16, name: "Hurricane Candle", price: 16.50, image: "https://images.unsplash.com/photo-1602874801265-3c2ba0dc90d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Storm Prep Co.", category: "home", description: "Emergency hurricane candle • For power outages, emergency prep", distance: 3.5, zipCode: "33607", city: "Tampa", state: "FL", mallId: "mall-16", mallName: "International Plaza" },
  
  // Illinois Products
  { id: 17, name: "Deep Dish Pizza Kit", price: 24.99, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Chicago Classics", category: "food", description: "Authentic Chicago pizza kit • For family dinner, entertaining", distance: 0.9, zipCode: "60611", city: "Chicago", state: "IL", mallId: "mall-17", mallName: "Water Tower Place" },
  { id: 18, name: "Wind City Scarf", price: 32.00, image: "https://images.unsplash.com/photo-1519810409259-73e5a5c00adf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Midwest Warmth", category: "clothing", description: "Chicago-themed winter scarf • Cold weather, office style", distance: 2.4, zipCode: "60173", city: "Schaumburg", state: "IL", mallId: "mall-18", mallName: "Woodfield Mall" },
  
  // Pennsylvania Products
  { id: 19, name: "Liberty Bell Replica", price: 55.00, image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Philadelphia History", category: "home", description: "Historical replica bell • Patriotic decor, educational gift", distance: 1.6, zipCode: "19406", city: "King of Prussia", state: "PA", mallId: "mall-19", mallName: "King of Prussia Mall" },
  { id: 20, name: "Philly Cheese Steak Seasoning", price: 9.99, image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "East Coast Flavors", category: "food", description: "Authentic Philly seasoning • For home cooking, grilling", distance: 1.6, zipCode: "19406", city: "King of Prussia", state: "PA", mallId: "mall-19", mallName: "King of Prussia Mall" }
];

const categories = ['All', 'food', 'clothing', 'home', 'beauty', 'tech', 'sports'];

// Product use categories for smart search
const productUses = [
  'office-ready', 'for camping', 'for baby shower', 'gift-worthy', 'emergency prep',
  'entertaining', 'home decor', 'healthy cooking', 'outdoor cooking', 'cold weather',
  'beach days', 'morning energy', 'special occasions', 'weekend casual', 'water sports',
  'educational gift', 'collector\'s item', 'patriotic decor'
];
const stores = Array.from(new Set(allProducts.map(p => p.store)));
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'distance', label: 'Distance: Closest First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }
];

const distanceOptions = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
  { value: 100, label: '100 miles' },
  { value: 999, label: 'Nationwide' }
];

export function ProductsPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [useSearchTerm, setUseSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [maxDistance, setMaxDistance] = useState(25);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationFilterOpen, setIsLocationFilterOpen] = useState(false);
  
  const { currentLocation, mallContext } = useLocationStore();

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Location-based filtering
      if (currentLocation.type !== 'all') {
        switch (currentLocation.type) {
          case 'mall':
            // Mall mode - only show products from selected mall
            if (!product.mallId || product.mallName !== currentLocation.value) {
              return false;
            }
            break;
          case 'city':
            if (!product.city || product.city !== currentLocation.value) {
              return false;
            }
            break;
          case 'state':
            if (!product.state || product.state !== currentLocation.value) {
              return false;
            }
            break;
          case 'zip':
            if (!product.zipCode || product.zipCode !== currentLocation.value) {
              return false;
            }
            break;
        }
      }

      // Search query filter (name, store, description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesStore = product.store.toLowerCase().includes(query);
        const matchesDescription = product.description?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesStore && !matchesDescription) {
          return false;
        }
      }
      
      // Use case search filtering (smart search for product purposes)
      if (useSearchTerm) {
        const useQuery = useSearchTerm.toLowerCase();
        if (!product.description?.toLowerCase().includes(useQuery)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Store filter
      if (selectedStores.length > 0 && !selectedStores.includes(product.store)) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Distance filter
      if (product.distance && product.distance > maxDistance) {
        return false;
      }

      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      default:
        // Keep default order for relevance
        break;
    }

    return filtered;
  }, [searchQuery, useSearchTerm, selectedCategory, selectedStores, priceRange, maxDistance, sortBy, currentLocation, mallContext]);

  const handleStoreToggle = (store: string) => {
    setSelectedStores(prev => 
      prev.includes(store) 
        ? prev.filter(s => s !== store)
        : [...prev, store]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setUseSearchTerm('');
    setSelectedCategory('All');
    setSelectedStores([]);
    setPriceRange([0, 100]);
    setMaxDistance(25);
    setSortBy('relevance');
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 font-['Poppins']">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category}
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(category)}
              />
              <Label htmlFor={category} className="capitalize font-['Inter']">
                {category === 'All' ? 'All Categories' : category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 font-['Poppins']">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 font-['Inter']">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 font-['Poppins']">Stores</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stores.map(store => (
            <div key={store} className="flex items-center space-x-2">
              <Checkbox 
                id={store}
                checked={selectedStores.includes(store)}
                onCheckedChange={() => handleStoreToggle(store)}
              />
              <Label htmlFor={store} className="font-['Inter']">{store}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block font-['Poppins']">
          Distance Filter
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {distanceOptions.map((option) => (
            <Button
              key={option.value}
              variant={maxDistance === option.value ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                maxDistance === option.value 
                  ? 'bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]' 
                  : ''
              }`}
              onClick={() => setMaxDistance(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-600 font-['Inter']">
          {maxDistance === 999 ? 'Searching nationwide' : `Within ${maxDistance} miles`}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block font-['Poppins']">
          Use Case Filters
        </Label>
        <div className="flex flex-wrap gap-2">
          {productUses.slice(0, 6).map((useCase) => (
            <Button
              key={useCase}
              variant={useSearchTerm === useCase ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                useSearchTerm === useCase 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
              }`}
              onClick={() => setUseSearchTerm(useSearchTerm === useCase ? '' : useCase)}
            >
              {useCase}
            </Button>
          ))}
        </div>
        {productUses.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs text-blue-600"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? 'Show Less' : `Show ${productUses.length - 6} More`}
          </Button>
        )}
        {showAdvancedFilters && (
          <div className="flex flex-wrap gap-2 mt-2">
            {productUses.slice(6).map((useCase) => (
              <Button
                key={useCase}
                variant={useSearchTerm === useCase ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  useSearchTerm === useCase 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
                }`}
                onClick={() => setUseSearchTerm(useSearchTerm === useCase ? '' : useCase)}
              >
                {useCase}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Button 
        onClick={clearFilters}
        variant="outline"
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(0,0%,99.6%)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 font-['Inter']">
            <li><Link href="/" className="hover:text-[hsl(183,100%,23%)]">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">Products</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Poppins']">
              {mallContext.isActive ? `Shopping at ${mallContext.mallName}` : 'Local Products'}
            </h1>
            
            {/* Location Filter Button */}
            <Button 
              variant="outline" 
              onClick={() => setIsLocationFilterOpen(true)}
              className="flex items-center gap-2 bg-white"
            >
              <Navigation className="h-4 w-4" />
              {currentLocation.type === 'all' ? 'Choose Location' : currentLocation.displayName}
              {mallContext.isActive && <Badge variant="secondary" className="ml-1">Mall Mode</Badge>}
            </Button>
          </div>
          
          <p className="text-xl text-gray-600 font-['Inter'] mb-6">
            {mallContext.isActive 
              ? `Exclusively browsing products available at ${mallContext.mallName}`
              : 'Discover amazing products from neighborhood businesses'
            }
          </p>
          
          {/* Mall Mode Alert */}
          {mallContext.isActive && (
            <div className="mb-6 p-4 bg-[var(--spiral-coral)]/10 border border-[var(--spiral-coral)]/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[var(--spiral-coral)]" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--spiral-navy)]">
                    Mall Shopping Mode Active
                  </h3>
                  <p className="text-xs text-gray-600">
                    You're exclusively shopping at {mallContext.mallName}. All products, cart, and checkout are limited to this mall.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsLocationFilterOpen(true)}
                  className="text-[var(--spiral-coral)] hover:text-[var(--spiral-navy)]"
                >
                  Change Mall
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Search and Sort Bar */}
        <div className="space-y-4 mb-6">
          {/* Main Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products, stores, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg rounded-2xl"
              />
            </div>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by use: office-ready, for camping, gift-worthy..."
                value={useSearchTerm}
                onChange={(e) => setUseSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg rounded-2xl border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
          
          {/* Smart Use Case Quick Tags */}
          {useSearchTerm === '' && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">Popular searches:</span>
              {['office-ready', 'for camping', 'gift-worthy', 'entertaining', 'emergency prep', 'healthy cooking', 'weekend casual', 'water sports'].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-3 py-1 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                  onClick={() => setUseSearchTerm(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
          
          {/* Advanced Distance Filter */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">Distance:</span>
            <div className="flex flex-wrap gap-2">
              {distanceOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={maxDistance === option.value ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs px-3 py-1 ${
                    maxDistance === option.value 
                      ? 'bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setMaxDistance(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1"></div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12 rounded-2xl">
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

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="lg:hidden h-12 px-4 rounded-2xl">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-['Poppins']">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== 'All' || selectedStores.length > 0 || searchQuery || useSearchTerm) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <Badge variant="secondary" className="px-3 py-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== 'All' && (
              <Badge variant="secondary" className="px-3 py-1 capitalize">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {useSearchTerm && (
              <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700 border-blue-200">
                Use: "{useSearchTerm}"
                <button onClick={() => setUseSearchTerm('')} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedStores.map(store => (
              <Badge key={store} variant="secondary" className="px-3 py-1">
                {store}
                <button onClick={() => handleStoreToggle(store)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-6 font-['Poppins']">Filters</h2>
              <FilterPanel />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600 font-['Inter']">
                {filteredProducts.length} products found
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4 font-['Inter']">No products found matching your criteria.</p>
                <Button onClick={clearFilters} className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Location Filter Modal */}
      <LocationFilter 
        isOpen={isLocationFilterOpen} 
        onClose={() => setIsLocationFilterOpen(false)} 
      />
    </div>
  );
}