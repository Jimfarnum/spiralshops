import React from "react";
import { Link } from "wouter";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";

export type Product = {
  id: string | number;
  name: string;
  price: number;
  image_url?: string;
  image?: string;
  images?: string[];
  category?: string;
  store?: string;
  rating?: number;
  location?: string;
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  // Smart image resolution with multiple fallback layers
  const getImageUrl = () => {
    return product.image_url || 
           product.image || 
           (product.images && product.images[0]) || 
           "/api/placeholder/300/200";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    console.warn("Image failed to load, switching to placeholder:", img.src);
    
    // Prevent infinite fallback loops
    if (img.src.includes("placeholder")) return;
    
    // Use SPIRAL's existing placeholder system
    img.src = "/api/placeholder/300/200";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent navigation when clicking "Add to Cart"
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: typeof product.id === 'string' ? parseInt(product.id) : product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(),
      category: product.category || "General"
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <a className="block border rounded-lg shadow-sm p-4 hover:shadow-lg transition-shadow cursor-pointer" data-testid={`product-card-${product.id}`}>
        <img
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-3"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* SPIRALS earning indicator */}
        <div className="bg-green-50 border border-green-200 rounded-md p-2 mb-3">
          <span className="text-sm font-medium text-green-800">
            🌀 Earn SPIRALs: ${Math.floor(product.price)} SPIRALs
          </span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h2>
        <p className="text-xl font-bold text-[var(--spiral-teal)] mb-2">
          ${product.price.toFixed(2)}
        </p>
        
        {product.store && (
          <p className="text-sm text-gray-600 mb-3">
            📍 {product.store} {product.location && `• ${product.location}`}
          </p>
        )}
        
        {product.rating && (
          <div className="flex items-center mb-3">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium ml-1">{product.rating}</span>
          </div>
        )}
        
        <button 
          onClick={handleAddToCart}
          className="w-full bg-[var(--spiral-teal)] hover:bg-[var(--spiral-teal)]/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          data-testid={`button-add-to-cart-${product.id}`}
        >
          Add to Cart
        </button>
      </a>
    </Link>
  );
};

export default ProductCard;