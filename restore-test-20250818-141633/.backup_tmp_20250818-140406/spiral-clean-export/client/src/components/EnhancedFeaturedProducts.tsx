import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, MapPin, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: string;
  discount?: number;
  image: string;
  store: string;
  rating: number;
  location: string;
  category: string;
  description: string;
  featured: boolean;
}

interface FeaturedProductsResponse {
  success: boolean;
  products: FeaturedProduct[];
  total: number;
}

export default function EnhancedFeaturedProducts() {
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const { data: apiResponse, isLoading, error } = useQuery<FeaturedProductsResponse>({
    queryKey: ["/api/products/featured"],
    queryFn: async () => {
      const response = await fetch("/api/products/featured");
      if (!response.ok) throw new Error("Failed to fetch featured products");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
  });

  const handleAddToCart = (product: FeaturedProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="h-5 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !apiResponse?.success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Featured Products</h3>
          <p className="text-gray-600 mb-4">Unable to load featured products at this time.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const products = apiResponse.products || [];

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Featured Products</h3>
        <p className="text-gray-600 text-center py-8">No featured products available at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[var(--spiral-navy)]">Featured Products</h3>
        <Link href="/products">
          <Button variant="outline" size="sm">
            View All <Eye className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/api/placeholder/300/200";
                }}
              />
              
              {/* Discount Badge */}
              {product.discount && (
                <Badge className="absolute top-2 left-2 bg-[var(--spiral-coral)] text-white">
                  {product.discount}% OFF
                </Badge>
              )}
              
              {/* Store Badge */}
              <Badge variant="secondary" className="absolute top-2 right-2 bg-white/90">
                {product.category}
              </Badge>
            </div>

            {/* Product Details */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{product.store}</span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[var(--spiral-navy)] transition-colors">
                {product.name}
              </h4>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-gray-500">({Math.floor(Math.random() * 50) + 10} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[var(--spiral-navy)]">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  className="flex-1 bg-[var(--spiral-teal)] hover:bg-[var(--spiral-teal)]/90"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View More Link */}
      <div className="text-center mt-6">
        <Link href="/products?featured=true">
          <Button variant="outline" size="lg">
            Explore More Featured Products
          </Button>
        </Link>
      </div>
    </div>
  );
}