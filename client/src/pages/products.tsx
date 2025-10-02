import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCartStore } from '@/lib/cartStore';
import { Link } from 'wouter';
import { 
  Search, Filter, Grid, List, Star, MapPin, Store as StoreIcon,
  ShoppingCart, Heart, Package, ArrowUpDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SocialPixelManager } from '@/utils/socialPixels';
import WishlistButton from '@/components/WishlistButton';
import StoreCard from '@/components/store-card';
import VerifiedBadge from '@/components/VerifiedBadge';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  store: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  isVerified?: boolean;
  verificationTier?: string;
  distance?: string;
}

// Feature navigation links
const FEATURE_LINKS = [
  { id: 'shopping', label: 'Shopping', icon: ShoppingCart, path: '/products' },
  { id: 'loyalty', label: 'Loyalty Program', icon: Star, path: '/loyalty' },
  { id: 'centers', label: 'SPIRAL Centers', icon: MapPin, path: '/spiral-centers' },
  { id: 'logistics', label: 'Delivery & Logistics', icon: Package, path: '/advanced-logistics' },
  { id: 'social', label: 'Social Features', icon: Heart, path: '/social-feed' },
  { id: 'giftcards', label: 'Gift Cards', icon: StoreIcon, path: '/wallet' },
];

const CONTENT_TABS = [
  { id: 'about', label: 'About' },
  { id: 'products', label: 'Products' },
  { id: 'stores', label: 'Stores' },
  { id: 'malls', label: 'Malls' },
];

const ProductsPage = () => {
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [contentTab, setContentTab] = useState('products');

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  const { data: storesData, isLoading: isLoadingStores } = useQuery({
    queryKey: ['/api/stores'],
    queryFn: async () => {
      const response = await fetch('/api/stores');
      if (!response.ok) throw new Error('Failed to fetch stores');
      const data = await response.json();
      return data.stores || [];
    }
  });

  const stores = Array.isArray(storesData) ? storesData : [];

  // Filter and sort products
  const filteredProducts = products
    .filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.store.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  // Filter and sort stores
  const filteredStores = stores
    .filter((store: Store) => {
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || store.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a: Store, b: Store) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      store: product.store
    });

    SocialPixelManager.trackAddToCart(
      product.id.toString(),
      product.name,
      product.price,
      1
    );
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <CardTitle className="text-sm font-semibold line-clamp-2">
            {product.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{product.store}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <WishlistButton 
              productId={product.id.toString()} 
              shopperId="shopper_123" 
            />
            <Button 
              size="sm" 
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.inStock ? 'Add' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="flex items-center p-4 hover:shadow-md transition-shadow">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 ml-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <div className="flex items-center gap-4 mt-1">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{product.store}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-green-600 mb-2">
              ${product.price.toFixed(2)}
            </div>
            <div className="flex gap-2">
              <WishlistButton 
                productId={product.id.toString()} 
                shopperId="shopper_123" 
              />
              <Button 
                size="sm" 
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const isLoading = isLoadingProducts || isLoadingStores;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img 
                src="/spiral-blue.svg" 
                alt="SPIRAL Logo" 
                className="w-16 h-16 object-contain"
              />
              <h1 className="text-3xl font-bold text-gray-900">
                SPIRAL - Local Commerce Platform
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                data-testid="button-view-grid"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                data-testid="button-view-list"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products, stores, or malls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="select-category"
              >
                <option value="all">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="select-sort"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation + Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Feature Navigation Links - Top Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FEATURE_LINKS.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.id === 'shopping'; // Active on products page
            return (
              <Link key={feature.id} href={feature.path}>
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                  data-testid={`nav-feature-${feature.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {feature.label}
                </Button>
              </Link>
            );
          })}
        </div>
        
        {/* Content Tabs - Second Row */}
        <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
              {CONTENT_TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  data-testid={`tab-content-${tab.id}`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600" data-testid="text-products-count">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product: any) => (
                  viewMode === 'grid' 
                    ? <ProductCard key={product.id} product={product} />
                    : <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stores">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600" data-testid="text-stores-count">
                Showing {filteredStores.length} of {stores.length} stores
              </p>
            </div>

            {filteredStores.length === 0 ? (
              <div className="text-center py-12">
                <StoreIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No stores found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredStores.map((store: Store) => (
                  <Link key={store.id} href={`/store/${store.id}`}>
                    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                      <CardHeader className="p-4">
                        {store.imageUrl && (
                          <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                            <img 
                              src={store.imageUrl} 
                              alt={store.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold line-clamp-1">
                              {store.name}
                            </CardTitle>
                            {store.isVerified && <VerifiedBadge tier={store.verificationTier as any} />}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {store.category}
                          </Badge>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {store.description}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {store.rating} ({store.reviewCount} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{store.address}</span>
                          </div>
                          {store.distance && (
                            <div className="text-xs text-blue-600 font-medium">
                              {store.distance} away
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About SPIRAL Shopping</h2>
              <div className="prose max-w-none">
                <p className="text-lg mb-4">
                  Discover local products from independent retailers in your area. Shop directly from local stores and support your community.
                </p>
                <p className="text-gray-600 mb-4">
                  SPIRAL connects you with trusted local retailers and malls across the United States. Browse thousands of products, 
                  earn loyalty rewards with every purchase, and enjoy flexible delivery options including in-store pickup and SPIRAL Center delivery.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">✨ Key Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Shop from local independent retailers</li>
                      <li>Earn SPIRALs loyalty rewards</li>
                      <li>Multiple delivery options</li>
                      <li>Verified store ratings</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">🎁 Benefits</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Support your local community</li>
                      <li>Get exclusive local deals</li>
                      <li>Same-day pickup available</li>
                      <li>Secure transactions guaranteed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="malls">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Malls Directory</h2>
              <p className="text-gray-600">Browse local malls and shopping centers featuring SPIRAL retailers and centers.</p>
              <div className="mt-6 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Mall directory feature coming soon</p>
              </div>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default ProductsPage;
