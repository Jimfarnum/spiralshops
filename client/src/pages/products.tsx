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
import { Search, Filter, X, MapPin } from 'lucide-react';

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
}

// Extended product data for filtering
const allProducts: Product[] = [
  { id: 1, name: "Artisan Coffee Blend", price: 24.99, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Local Roasters", category: "food", description: "Premium single-origin coffee blend", distance: 0.8, zipCode: "10001" },
  { id: 2, name: "Handmade Ceramic Mug", price: 18.50, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Pottery Studio", category: "home", description: "Beautiful handcrafted ceramic mug", distance: 1.2, zipCode: "10001" },
  { id: 3, name: "Organic Honey", price: 12.99, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Bee Farm Co.", category: "food", description: "Pure organic wildflower honey", distance: 2.1, zipCode: "10002" },
  { id: 4, name: "Vintage Leather Jacket", price: 89.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Vintage Threads", category: "clothing", description: "Classic leather jacket in excellent condition", distance: 0.5, zipCode: "10001" },
  { id: 5, name: "Plant-Based Soap", price: 8.75, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Natural Goods", category: "beauty", description: "Eco-friendly soap with natural ingredients", distance: 1.8, zipCode: "10002" },
  { id: 6, name: "Wood Phone Stand", price: 15.99, image: "https://images.unsplash.com/photo-1586953209889-097d0faf7982?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Craft Corner", category: "tech", description: "Sustainable bamboo phone stand", distance: 1.0, zipCode: "10001" },
  { id: 7, name: "Local Fruit Basket", price: 22.50, image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Fresh Farm", category: "food", description: "Seasonal local fruit selection", distance: 3.2, zipCode: "10003" },
  { id: 8, name: "Knitted Scarf", price: 34.99, image: "https://images.unsplash.com/photo-1519810409259-73e5a5c00adf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Yarn Works", category: "clothing", description: "Hand-knitted wool scarf", distance: 1.5, zipCode: "10002" },
  { id: 9, name: "Herbal Tea Set", price: 28.99, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Tea Garden", category: "food", description: "Collection of organic herbal teas", distance: 2.0, zipCode: "10002" },
  { id: 10, name: "Handwoven Basket", price: 45.00, image: "https://images.unsplash.com/photo-1586953209889-097d0faf7982?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Artisan Market", category: "home", description: "Traditional handwoven storage basket", distance: 2.8, zipCode: "10003" },
  { id: 11, name: "Organic Face Cream", price: 32.50, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Pure Beauty", category: "beauty", description: "Anti-aging cream with natural ingredients", distance: 1.1, zipCode: "10001" },
  { id: 12, name: "Canvas Tote Bag", price: 19.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300", store: "Eco Shop", category: "clothing", description: "Sustainable cotton canvas bag", distance: 1.7, zipCode: "10002" }
];

const categories = ['All', 'food', 'clothing', 'home', 'beauty', 'tech'];
const stores = Array.from(new Set(allProducts.map(p => p.store)));
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'distance', label: 'Distance: Closest First' }
];

export function ProductsPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Search query filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.store.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
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
  }, [searchQuery, selectedCategory, selectedStores, priceRange, maxDistance, sortBy]);

  const handleStoreToggle = (store: string) => {
    setSelectedStores(prev => 
      prev.includes(store) 
        ? prev.filter(s => s !== store)
        : [...prev, store]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStores([]);
    setPriceRange([0, 100]);
    setMaxDistance(10);
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
        <h3 className="text-lg font-semibold mb-3 font-['Poppins']">Distance</h3>
        <div className="space-y-3">
          <Slider
            value={[maxDistance]}
            onValueChange={(value) => setMaxDistance(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="text-sm text-gray-600 font-['Inter']">
            Within {maxDistance} miles
          </div>
        </div>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Local Products
          </h1>
          <p className="text-xl text-gray-600 font-['Inter']">
            Discover amazing products from neighborhood businesses
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products and stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg rounded-2xl"
            />
          </div>
          
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

        {/* Active Filters */}
        {(selectedCategory !== 'All' || selectedStores.length > 0 || searchQuery) && (
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
    </div>
  );
}