import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Heart, Share2, MapPin, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  store: string;
  category: string;
  description?: string;
  distance?: number;
  rating?: number;
  zipCode?: string;
  city?: string;
  state?: string;
}

interface MobileProductGridProps {
  products: Product[];
  columns?: 1 | 2;
  showDistance?: boolean;
  showRating?: boolean;
  className?: string;
}

export default function MobileProductGrid({ 
  products, 
  columns = 2, 
  showDistance = true, 
  showRating = true, 
  className = '' 
}: MobileProductGridProps) {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      store: product.store
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000
    });
  };

  const handleToggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newWishlist = new Set(wishlist);
    if (wishlist.has(productId)) {
      newWishlist.delete(productId);
      toast({
        title: "Removed from Wishlist",
        description: "Item removed from your wishlist.",
        duration: 2000
      });
    } else {
      newWishlist.add(productId);
      toast({
        title: "Added to Wishlist",
        description: "Item saved to your wishlist.",
        duration: 2000
      });
    }
    setWishlist(newWishlist);
  };

  const handleShare = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} from ${product.store} on SPIRAL`,
        url: `${window.location.origin}/product/${product.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard.",
        duration: 2000
      });
    }
  };

  return (
    <div className={`${className}`}>
      <div className={`grid ${columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-4`}>
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => handleToggleWishlist(product.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => handleShare(product, e)}
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>

                {/* Category Badge */}
                <Badge className="absolute top-2 left-2 capitalize bg-white/90 text-gray-800 border">
                  {product.category}
                </Badge>

                {/* Price Badge - Mobile Optimized */}
                <div className="absolute bottom-2 right-2 bg-[var(--spiral-navy)] text-white px-2 py-1 rounded-lg">
                  <span className="font-bold text-sm">${product.price}</span>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg font-bold text-gray-900 font-['Poppins'] line-clamp-1">
                  {product.name}
                </CardTitle>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{product.store}</span>
                  </div>
                  
                  {showRating && product.rating && (
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>

                {showDistance && product.distance && (
                  <div className="text-xs text-blue-600 font-medium">
                    {product.distance} mi away
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                {product.description && (
                  <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2 font-['Inter']">
                    {product.description}
                  </CardDescription>
                )}

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] h-9 text-sm font-semibold"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Mobile-specific empty state */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Poppins']">No products found</h3>
          <p className="text-gray-600 text-sm font-['Inter'] max-w-sm mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}