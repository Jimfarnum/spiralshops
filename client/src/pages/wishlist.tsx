import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { useCartStore } from '@/lib/cartStore';
import { Heart, ShoppingCart, Search, Filter, Trash2, Share, Eye, Star, MapPin, Clock } from 'lucide-react';

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  store: string;
  category: string;
  description: string;
  distance?: number;
  zipCode?: string;
  city?: string;
  state?: string;
  dateAdded: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Mock wishlist data - in real app this would come from backend/localStorage
const mockWishlistItems: WishlistItem[] = [
  {
    id: 1,
    productId: 1,
    name: "Artisan Coffee Blend",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    store: "Local Roasters",
    category: "food",
    description: "Premium single-origin coffee blend perfect for morning energy",
    distance: 0.8,
    zipCode: "55305",
    city: "Minnetonka",
    state: "MN",
    dateAdded: "2025-01-15",
    notes: "Try this for the office coffee station",
    priority: 'high',
    availability: 'in-stock'
  },
  {
    id: 2,
    productId: 4,
    name: "Vintage Leather Jacket",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    store: "Vintage Threads",
    category: "clothing",
    description: "Classic leather jacket perfect for office-ready, weekend casual wear",
    distance: 0.5,
    zipCode: "55425",
    city: "Bloomington",
    state: "MN",
    dateAdded: "2025-01-10",
    priority: 'medium',
    availability: 'low-stock'
  },
  {
    id: 3,
    productId: 7,
    name: "Tech Startup Hoodie",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    store: "Silicon Style",
    category: "clothing",
    description: "Premium comfort hoodie for office-ready, casual Friday wear",
    distance: 0.8,
    zipCode: "95050",
    city: "Santa Clara",
    state: "CA",
    dateAdded: "2025-01-08",
    notes: "Perfect for remote work days",
    priority: 'low',
    availability: 'out-of-stock'
  }
];

const sortOptions = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'priority', label: 'Priority: High to Low' },
  { value: 'distance', label: 'Distance: Nearest First' }
];

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

const availabilityColors = {
  'in-stock': 'bg-green-100 text-green-800',
  'low-stock': 'bg-yellow-100 text-yellow-800',
  'out-of-stock': 'bg-red-100 text-red-800'
};

export default function WishlistPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const categories = ['All', ...Array.from(new Set(wishlistItems.map(item => item.category)))];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = wishlistItems.filter(item => {
      // Search filtering
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesStore = item.store.toLowerCase().includes(query);
        const matchesDescription = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesStore && !matchesDescription) {
          return false;
        }
      }

      // Category filtering
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
    }

    return filtered;
  }, [wishlistItems, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (item: WishlistItem) => {
    if (item.availability === 'out-of-stock') {
      toast({
        title: "Out of Stock",
        description: `${item.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }

    addItem({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      store: item.store
    });

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`
    });
  };

  const handleRemoveFromWishlist = (itemId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist."
    });
  };

  const handleUpdatePriority = (itemId: number, priority: WishlistItem['priority']) => {
    setWishlistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, priority } : item
    ));
  };

  const getStockMessage = (availability: WishlistItem['availability']) => {
    switch (availability) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock - Order Soon!';
      case 'out-of-stock':
        return 'Out of Stock';
    }
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
            <li><Link href="/account" className="hover:text-[hsl(183,100%,23%)]">Account</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">Wishlist</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Poppins'] mb-2">
              My Wishlist
            </h1>
            <p className="text-xl text-gray-600 font-['Inter']">
              {filteredAndSortedItems.length} saved {filteredAndSortedItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex">
              <Share className="h-4 w-4 mr-2" />
              Share Wishlist
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search your wishlist..."
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
                {categories.map(category => (
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

        {/* Wishlist Content */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
              {wishlistItems.length === 0 ? 'Your wishlist is empty' : 'No items match your search'}
            </h3>
            <p className="text-gray-600 mb-8 font-['Inter'] max-w-md mx-auto">
              {wishlistItems.length === 0 
                ? 'Start adding products you love to keep track of them and purchase later.'
                : 'Try adjusting your search or filter criteria to find your saved items.'
              }
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products">
                <Button className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
              {wishlistItems.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className={priorityColors[item.priority]}>
                      {item.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/80 hover:bg-white text-red-500 hover:text-red-600 p-1 h-8 w-8"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className={availabilityColors[item.availability]}>
                      {getStockMessage(item.availability)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold font-['Poppins'] mb-1">
                        {item.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {item.store}
                        {item.distance && (
                          <span className="ml-2 text-blue-600">
                            • {item.distance} mi
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[hsl(183,100%,23%)]">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 font-['Inter']">
                    {item.description}
                  </CardDescription>

                  {item.notes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-['Inter']">
                        <strong>Note:</strong> {item.notes}
                      </p>
                    </div>
                  )}

                  {/* Date Added */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </div>

                  {/* Priority Selector */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Priority:</p>
                    <div className="flex gap-1">
                      {(['high', 'medium', 'low'] as const).map(priority => (
                        <Button
                          key={priority}
                          variant={item.priority === priority ? "default" : "outline"}
                          size="sm"
                          className={`text-xs h-6 px-2 ${
                            item.priority === priority 
                              ? priority === 'high' ? 'bg-red-500 hover:bg-red-600' :
                                priority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                'bg-green-500 hover:bg-green-600'
                              : ''
                          }`}
                          onClick={() => handleUpdatePriority(item.id, priority)}
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]"
                      onClick={() => handleAddToCart(item)}
                      disabled={item.availability === 'out-of-stock'}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      <Eye className="h-4 w-4" />
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