import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Package, Star, Zap } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  store: string;
  rating: number;
  category: string;
}

interface ProductBundle {
  id: string;
  title: string;
  description: string;
  products: Product[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  bundleType: 'frequently-bought' | 'similar-items' | 'complete-set' | 'seasonal';
}

interface ProductBundlesProps {
  currentProductId: number;
  currentProductCategory: string;
}

export default function ProductBundles({ currentProductId, currentProductCategory }: ProductBundlesProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);

  // Sample bundle data - in real app would come from API
  const bundles: ProductBundle[] = [
    {
      id: 'frequently-bought-1',
      title: 'Frequently Bought Together',
      description: 'Customers who bought this item also purchased:',
      bundleType: 'frequently-bought',
      products: [
        {
          id: 101,
          name: 'Coffee Filter Papers',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1516024851043-bdf063c21bf1?w=100&h=100&fit=crop',
          store: 'Coffee Essentials',
          rating: 4.5,
          category: 'food'
        },
        {
          id: 102,
          name: 'Milk Frother',
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
          store: 'Kitchen Tools Co',
          rating: 4.7,
          category: 'home'
        }
      ],
      originalPrice: 28.98,
      bundlePrice: 24.99,
      savings: 3.99
    },
    {
      id: 'similar-items-1',
      title: 'Similar Items You Might Like',
      description: 'Based on your interests and browsing history:',
      bundleType: 'similar-items',
      products: [
        {
          id: 103,
          name: 'Artisan Tea Collection',
          price: 22.50,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
          store: 'Tea & More',
          rating: 4.6,
          category: 'food'
        },
        {
          id: 104,
          name: 'Bamboo Coasters Set',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop',
          store: 'Eco Living',
          rating: 4.4,
          category: 'home'
        }
      ],
      originalPrice: 35.49,
      bundlePrice: 29.99,
      savings: 5.50
    },
    {
      id: 'complete-set-1',
      title: 'Complete Coffee Experience',
      description: 'Everything you need for the perfect morning routine:',
      bundleType: 'complete-set',
      products: [
        {
          id: 105,
          name: 'Premium Coffee Beans',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop',
          store: 'Local Roasters',
          rating: 4.8,
          category: 'food'
        },
        {
          id: 106,
          name: 'Coffee Storage Jar',
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop',
          store: 'Storage Solutions',
          rating: 4.3,
          category: 'home'
        },
        {
          id: 107,
          name: 'Coffee Measuring Spoon',
          price: 6.99,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop',
          store: 'Kitchen Basics',
          rating: 4.2,
          category: 'home'
        }
      ],
      originalPrice: 38.97,
      bundlePrice: 32.99,
      savings: 5.98
    }
  ];

  const addBundleToCart = (bundle: ProductBundle) => {
    bundle.products.forEach(product => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price * (bundle.bundlePrice / bundle.originalPrice), // Apply bundle discount
        image: product.image,
        store: product.store,
        quantity: 1,
        storeId: `store-${product.id}`,
        category: product.category
      });
    });

    toast({
      title: "Bundle added to cart!",
      description: `Added ${bundle.products.length} items with $${bundle.savings.toFixed(2)} savings`,
    });

    setSelectedBundles(prev => [...prev, bundle.id]);
  };

  const getBundleIcon = (type: string) => {
    switch (type) {
      case 'frequently-bought': return Package;
      case 'similar-items': return Star;
      case 'complete-set': return Zap;
      default: return Package;
    }
  };

  const getBundleColor = (type: string) => {
    switch (type) {
      case 'frequently-bought': return 'text-blue-600';
      case 'similar-items': return 'text-purple-600';
      case 'complete-set': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {bundles.map((bundle) => {
        const IconComponent = getBundleIcon(bundle.bundleType);
        const isSelected = selectedBundles.includes(bundle.id);
        
        return (
          <Card key={bundle.id} className={`${isSelected ? 'ring-2 ring-[var(--spiral-coral)] bg-orange-50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className={`h-5 w-5 ${getBundleColor(bundle.bundleType)}`} />
                    {bundle.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {bundle.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Save ${bundle.savings.toFixed(2)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bundle Products */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bundle.products.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-[var(--spiral-navy)] truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">{product.store}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[var(--spiral-navy)]">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Individual prices:</span>
                    <span className="text-sm line-through text-gray-500">
                      ${bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[var(--spiral-navy)]">Bundle price:</span>
                    <span className="text-lg font-bold text-[var(--spiral-coral)]">
                      ${bundle.bundlePrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => addBundleToCart(bundle)}
                    disabled={isSelected}
                    className={`w-full ${
                      isSelected 
                        ? 'bg-green-600 hover:bg-green-600' 
                        : 'bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add Bundle to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}