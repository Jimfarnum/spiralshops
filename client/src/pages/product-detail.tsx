import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Heart, Share2, Star, MapPin, Truck, Store, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import ReviewsSection from "@/components/reviews-section";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: string;
  inStock: boolean;
  stockLevel: number;
  rating: number;
  reviewCount: number;
  store: {
    id: string;
    name: string;
    location: string;
  };
  mall?: {
    id: string;
    name: string;
  };
  specifications: Array<{
    name: string;
    value: string;
  }>;
  shippingOptions: Array<{
    type: string;
    timeframe: string;
    cost: number;
  }>;
}

export function ProductDetailPage() {
  const [, params] = useRoute("/product/:productId");
  const { productId } = params || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [fulfillmentMethod, setFulfillmentMethod] = useState("ship-to-me");
  const { addItem } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProduct: Product = {
        id: productId || "1",
        name: "Premium Wireless Headphones",
        price: 199.99,
        originalPrice: 249.99,
        images: [
          "/api/placeholder/600/600",
          "/api/placeholder/600/600",
          "/api/placeholder/600/600"
        ],
        description: "Experience superior sound quality with these premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding.",
        category: "Electronics",
        inStock: true,
        stockLevel: 15,
        rating: 4.5,
        reviewCount: 127,
        store: {
          id: "1",
          name: "TechWorld Electronics",
          location: "Level 2, Suite 245"
        },
        mall: {
          id: "westfield-valley",
          name: "Westfield Valley Fair"
        },
        specifications: [
          { name: "Battery Life", value: "30 hours" },
          { name: "Noise Cancellation", value: "Active ANC" },
          { name: "Connectivity", value: "Bluetooth 5.0" },
          { name: "Weight", value: "250g" },
          { name: "Warranty", value: "2 years" }
        ],
        shippingOptions: [
          { type: "Standard Shipping", timeframe: "3-5 business days", cost: 0 },
          { type: "Express Shipping", timeframe: "1-2 business days", cost: 12.99 },
          { type: "In-Store Pickup", timeframe: "Ready today", cost: 0 },
          { type: "Mall SPIRAL Center", timeframe: "Ready tomorrow", cost: 0 }
        ]
      };
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      store: product.store.name,
      mallId: product.mall?.id || "",
      mallName: product.mall?.name || ""
    }, quantity);
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Product link copied to clipboard.",
    });
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stockLevel || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--spiral-navy)] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600">The requested product could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const spiralsEarned = Math.floor((product.price * quantity) / 20); // 5 SPIRALs per $100

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[var(--spiral-coral)]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[var(--spiral-coral)]">Products</Link>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-[var(--spiral-coral)]' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-[var(--spiral-navy)]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Store Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sold by {product.store.name}</h4>
                    <p className="text-sm text-gray-600">{product.store.location}</p>
                    {product.mall && (
                      <p className="text-sm text-gray-600">at {product.mall.name}</p>
                    )}
                  </div>
                  <Link href={`/mall/${product.mall?.id}/store/${product.store.id}`}>
                    <Button variant="outline" size="sm">
                      View Store
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Fulfillment Options */}
            <div>
              <h4 className="font-medium mb-3">Fulfillment Options</h4>
              <Select value={fulfillmentMethod} onValueChange={setFulfillmentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.shippingOptions.map((option) => (
                    <SelectItem key={option.type} value={option.type.toLowerCase().replace(/\s+/g, '-')}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.type}</span>
                        <span className="text-sm text-gray-500 ml-4">
                          {option.cost > 0 ? `$${option.cost}` : 'Free'} • {option.timeframe}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustQuantity(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustQuantity(1)}
                    disabled={quantity >= product.stockLevel}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stockLevel} available
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* SPIRAL Earnings */}
              <div className="bg-[var(--spiral-gold)]/10 border border-[var(--spiral-gold)]/20 rounded-lg p-3">
                <p className="text-sm">
                  <span className="font-medium">Earn {spiralsEarned} SPIRALs</span> with this purchase
                  {fulfillmentMethod === 'in-store-pickup' && (
                    <span className="text-[var(--spiral-coral)]"> (Double value when used in-store!)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping & Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-[var(--spiral-coral)] mt-0.5" />
                <div>
                  <h4 className="font-medium">Free Standard Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Store className="h-5 w-5 text-[var(--spiral-coral)] mt-0.5" />
                <div>
                  <h4 className="font-medium">In-Store Pickup</h4>
                  <p className="text-sm text-gray-600">Available at {product.store.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--spiral-coral)] mt-0.5" />
                <div>
                  <h4 className="font-medium">SPIRAL Center Pickup</h4>
                  <p className="text-sm text-gray-600">Convenient mall pickup location</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          targetType="product"
          targetId={product.id}
          targetName={product.name}
          overallRating={product.rating}
          totalReviews={product.reviewCount}
        />
      </div>
    </div>
  );
}

export default ProductDetailPage;