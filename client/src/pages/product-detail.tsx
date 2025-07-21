import { useState } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SocialShare from '@/components/social-share';
import SocialSharingEngine from '@/components/social-sharing-engine';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, MapPin, ArrowLeft, Star, Heart, Share2, Gift, Package, Store, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  store: string;
  category: string;
  description: string;
  distance?: number;
  zipCode?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  features?: string[];
}

// Extended product data for detail page
const productData: { [key: string]: Product } = {
  '1': { 
    id: 1, 
    name: "Artisan Coffee Blend", 
    price: 24.99, 
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600", 
    store: "Local Roasters", 
    category: "food", 
    description: "Our signature artisan coffee blend combines the finest single-origin beans from sustainable farms. This medium roast delivers rich, complex flavors with notes of chocolate and caramel, perfect for your morning routine or afternoon pick-me-up. Each bag is roasted fresh weekly in small batches to ensure optimal flavor and quality.",
    distance: 0.8, 
    zipCode: "10001",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    features: ["Single-origin beans", "Small batch roasted", "Sustainable farming", "Medium roast", "12oz bag"]
  },
  '2': { 
    id: 2, 
    name: "Handmade Ceramic Mug", 
    price: 18.50, 
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600", 
    store: "Pottery Studio", 
    category: "home", 
    description: "Beautiful handcrafted ceramic mug made by local artisans. Each piece is unique, featuring a smooth glaze finish and comfortable handle design. Perfect for your morning coffee, afternoon tea, or any hot beverage. The ceramic construction retains heat well and is both microwave and dishwasher safe.",
    distance: 1.2, 
    zipCode: "10001",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    features: ["Handcrafted", "Unique design", "Microwave safe", "Dishwasher safe", "12oz capacity"]
  },
  '3': { 
    id: 3, 
    name: "Organic Honey", 
    price: 12.99, 
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600", 
    store: "Bee Farm Co.", 
    category: "food", 
    description: "Pure organic wildflower honey sourced from our local beehives. This raw, unfiltered honey retains all its natural enzymes and nutrients. With a delicate floral taste and golden color, it's perfect for sweetening tea, spreading on toast, or adding to your favorite recipes. Supporting local beekeepers and sustainable practices.",
    distance: 2.1, 
    zipCode: "10002",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    features: ["Raw & unfiltered", "Organic certified", "Local wildflower", "Glass jar", "16oz"]
  },
  '4': { 
    id: 4, 
    name: "Vintage Leather Jacket", 
    price: 89.99, 
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600", 
    store: "Vintage Threads", 
    category: "clothing", 
    description: "Classic vintage leather jacket in excellent condition. This timeless piece features genuine leather construction, full zip front, and multiple pockets. The jacket has been carefully restored and conditioned. Perfect for adding a touch of vintage style to any outfit. Available in various sizes.",
    distance: 0.5, 
    zipCode: "10001",
    rating: 4.6,
    reviews: 45,
    inStock: true,
    features: ["Genuine leather", "Full zip front", "Multiple pockets", "Restored condition", "Vintage style"]
  }
};

export function ProductDetailPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = productData[id || '1'];

  if (!product) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,99.6%)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]">
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    }, quantity);

    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  // Social sharing now handled by SocialShare component

  return (
    <div className="min-h-screen bg-[hsl(0,0%,99.6%)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 font-['Inter']">
            <li><Link href="/" className="hover:text-[hsl(183,100%,23%)]">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-[hsl(183,100%,23%)]">Products</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold capitalize">{product.category}</li>
            <li>/</li>
            <li className="text-gray-900 font-semibold truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/products')}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="capitalize mb-2">
                  {product.category}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                  <SocialSharingEngine
                    type="product"
                    title={`Check out ${product.name} from ${product.storeName}`}
                    description={product.description}
                    storeName={product.storeName}
                    productName={product.name}
                    showEarningsPreview={true}
                  />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-['Inter']">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="text-3xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
                ${product.price.toFixed(2)}
              </div>

              {/* SPIRAL Earnings Info */}
              <div className="bg-gradient-to-r from-[var(--spiral-sage)]/20 to-[var(--spiral-coral)]/20 rounded-xl p-4 mb-6 border border-[var(--spiral-sage)]/30">
                <h4 className="font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins'] flex items-center">
                  <Gift className="h-4 w-4 mr-2" />
                  Earn SPIRALs with this purchase
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm font-['Inter']">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-[var(--spiral-coral)]">+{Math.floor(product.price / 20)} SPIRALs</p>
                    <p className="text-gray-600">Online Purchase</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-semibold text-[var(--spiral-coral)]">+{Math.floor(product.price / 10)} SPIRALs</p>
                    <p className="text-gray-600">In-Store Pickup</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 font-['Poppins']">
                    Sold by {product.store}
                  </h3>
                  {product.distance && (
                    <div className="flex items-center text-sm text-gray-600 mt-1 font-['Inter']">
                      <MapPin className="h-4 w-4 mr-1" />
                      {product.distance} miles away
                    </div>
                  )}
                </div>
                <Link href={`/store/${product.store.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Visit Store
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'} font-['Inter']`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Fulfillment Options */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                Choose Your Fulfillment Method
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border border-[var(--spiral-sage)] rounded-xl p-3 hover:bg-[var(--spiral-sage)]/5 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">Ship to Me</p>
                      <p className="text-sm text-gray-600 font-['Inter']">Ships in 2-3 days</p>
                    </div>
                    <Package className="h-5 w-5 text-[var(--spiral-sage)]" />
                  </div>
                </div>
                <div className="border border-[var(--spiral-coral)] rounded-xl p-3 hover:bg-[var(--spiral-coral)]/5 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">In-Store Pickup</p>
                      <p className="text-sm text-gray-600 font-['Inter']">Ready today</p>
                    </div>
                    <Store className="h-5 w-5 text-[var(--spiral-coral)]" />
                  </div>
                </div>
                <div className="border border-[var(--spiral-gold)] rounded-xl p-3 hover:bg-[var(--spiral-gold)]/5 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--spiral-navy)] font-['Inter']">Mall Center</p>
                      <p className="text-sm text-gray-600 font-['Inter']">Ready tomorrow</p>
                    </div>
                    <ShoppingBag className="h-5 w-5 text-[var(--spiral-gold)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700 font-['Inter']">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r bg-white min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white h-12 text-lg font-semibold rounded-2xl"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-12 rounded-2xl border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Find in Store
                </Button>
              </div>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-['Poppins']">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 font-['Inter']">
                      <div className="w-1.5 h-1.5 bg-[hsl(183,100%,23%)] rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-['Poppins']">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed font-['Inter']">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section - Placeholder */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 font-['Poppins']">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            <div className="text-center text-gray-500 col-span-full py-8 font-['Inter']">
              Related products coming soon...
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}