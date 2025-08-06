import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Star, ShoppingCart, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface RecommendationItem {
  productId: string;
  score: number;
  reason: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    storeName: string;
    rating: number;
    imageUrl: string;
    inStock: boolean;
  };
}

interface AIRecommendationsProps {
  userId?: string;
  productId?: string;
  context?: 'homepage' | 'product' | 'checkout' | 'search';
  limit?: number;
  title?: string;
  showReason?: boolean;
  className?: string;
}

export default function AIRecommendations({ 
  userId, 
  productId, 
  context = 'homepage', 
  limit = 5,
  title = "Recommended for You",
  showReason = true,
  className = ""
}: AIRecommendationsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const { data: recommendationsResponse, isLoading } = useQuery({
    queryKey: ['/api/recommend', userId, productId, context, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (productId) params.append('productId', productId);
      params.append('context', context);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/recommend?${params}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100);
  };

  const getContextIcon = () => {
    switch (context) {
      case 'product':
        return <Heart className="h-4 w-4" />;
      case 'checkout':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Handle both legacy and new standardized response formats
  const recommendations = recommendationsResponse?.data?.recommendations || recommendationsResponse || [];
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#006d77]">
            {getContextIcon()}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {recommendations.map((item: any, index: number) => (
          <Card 
            key={item.productId}
            className={`hover:shadow-lg transition-all duration-200 relative ${
              hoveredProduct === item.productId ? 'ring-2 ring-[#006d77]/20 scale-[1.02]' : ''
            }`}
            onMouseEnter={() => setHoveredProduct(item.productId)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {!item.product.inStock && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
                
                {/* Score Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#006d77] text-white">
                    {Math.round(item.score * 10) / 10}★
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
                    {item.product.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.product.storeName}
                  </p>
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#006d77]">
                    {formatPrice(item.product.price)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {item.product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <Badge variant="outline" className="text-xs">
                  {item.product.category}
                </Badge>

                {/* AI Reason */}
                {showReason && (
                  <p className="text-xs text-gray-500 italic line-clamp-2">
                    {item.reason}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[#006d77] hover:bg-[#004d55] text-white"
                    disabled={!item.product.inStock}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View More Button */}
      {context === 'homepage' && recommendations.length >= limit && (
        <div className="text-center">
          <Link href="/products">
            <Button variant="outline" size="lg" className="border-[#006d77] text-[#006d77] hover:bg-[#006d77] hover:text-white">
              Discover More Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}