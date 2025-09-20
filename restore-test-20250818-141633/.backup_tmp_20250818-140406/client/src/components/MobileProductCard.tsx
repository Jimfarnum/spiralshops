import { Link } from "wouter";
import { Star, MapPin, ShoppingCart, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";

interface Product {
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

interface MobileProductCardProps {
  product: Product;
}

export default function MobileProductCard({ product }: MobileProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
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

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 sm:h-40 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/api/placeholder/300/200";
          }}
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-[var(--spiral-coral)] text-white text-xs">
            {product.discount}% OFF
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3">
        {/* Store and Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">{product.store}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>
        
        {/* Product Name */}
        <h4 className="font-medium text-gray-900 mb-2 text-sm leading-tight line-clamp-2">
          {product.name}
        </h4>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-[var(--spiral-navy)]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="flex-1 bg-[var(--spiral-teal)] hover:bg-[var(--spiral-teal)]/90 text-xs h-8"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}