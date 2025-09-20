import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, ShoppingCart, Heart, Share2, MapPin, 
  Truck, Shield, ArrowLeft, Package, Clock 
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  ratings: { average: number; count: number };
  inStock: boolean;
  stockLevel: number;
  reviews: Array<{
    id: number;
    rating: number;
    comment: string;
    author: string;
    date: string;
    verified: boolean;
  }>;
  specifications: {
    brand: string;
    warranty: string;
    shipping: string;
    returnPolicy: string;
    availability: string;
  };
  relatedProducts: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    rating: number;
  }>;
  estimatedDelivery: string;
  availableQuantity: number;
}

export default function EnhancedProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<ProductDetail>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!productId,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-[var(--spiral-coral)]">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-[var(--spiral-coral)]">Products</Link></li>
            <li>/</li>
            <li className="text-[var(--spiral-navy)] font-semibold">{product.category}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/api/placeholder/500/500";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.ratings.average}</span>
                  <span className="text-gray-600">({product.ratings.count} reviews)</span>
                </div>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.specifications.availability}
                </Badge>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="text-3xl font-bold text-[var(--spiral-navy)] mb-6">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-[var(--spiral-teal)] hover:bg-[var(--spiral-teal)]/90"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>{product.estimatedDelivery}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>{product.specifications.warranty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>{product.specifications.shipping}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{product.specifications.returnPolicy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="reviews" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.author}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="font-semibold text-gray-900">Brand</dt>
                    <dd className="text-gray-700">{product.specifications.brand}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">Warranty</dt>
                    <dd className="text-gray-700">{product.specifications.warranty}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">Available Quantity</dt>
                    <dd className="text-gray-700">{product.availableQuantity} units</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">Category</dt>
                    <dd className="text-gray-700">{product.category}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Information</h4>
                    <p className="text-gray-700">{product.specifications.shipping}</p>
                    <p className="text-gray-700">Estimated delivery: {product.estimatedDelivery}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
                    <p className="text-gray-700">{product.specifications.returnPolicy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {product.relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-32 object-cover rounded mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/api/placeholder/200/200";
                        }}
                      />
                      <h3 className="font-semibold text-sm mb-1">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--spiral-navy)]">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}