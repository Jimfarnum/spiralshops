import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Star, MapPin } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  category: string;
  store: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  discount?: number;
}

interface MobileProductGridProps {
  products: Product[];
  loading?: boolean;
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({ products, loading }) => {
  const addToCart = useCartStore(state => state.addItem);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Card key={product.id} className="mobile-card overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="relative">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">📦</span>
                </div>
              )}
            </div>
            
            {/* Discount Badge */}
            {product.discount && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                -{product.discount}%
              </Badge>
            )}
            
            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-white/80 hover:bg-white rounded-full"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-3">
            {/* Product Info */}
            <div className="mb-3">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 hover:text-[var(--spiral-coral)] transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              {/* Store & Location */}
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{product.store}</span>
              </div>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviews || 0})
                  </span>
                </div>
              )}
            </div>
            
            {/* Price & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[var(--spiral-navy)]">
                  ${product.price.toFixed(2)}
                </span>
                {product.discount && (
                  <span className="text-xs text-gray-500 line-through">
                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              
              <Button
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image || '/placeholder-product.jpg',
                  store: product.store,
                  quantity: 1
                })}
                disabled={!product.inStock}
                className="mobile-button h-9 px-3 text-xs bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            
            {/* Category Badge */}
            <Badge variant="outline" className="mt-2 text-xs">
              {product.category}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobileProductGrid;