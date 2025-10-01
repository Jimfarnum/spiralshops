import React from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, Tag, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';

const mockProducts = [
  {
    id: 1,
    name: 'Blue Denim Jacket',
    price: 49.99,
    distance: 2.1,
    promoted: true,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Classic blue denim jacket made from premium cotton. Perfect for casual outings and layering. Features traditional button closure, chest pockets, and a timeless design that never goes out of style.',
    store: 'Vintage Threads',
    storeRating: 4.8,
    availability: 'In Stock',
    material: '100% Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Vintage Leather Boots',
    price: 89.95,
    distance: 5.4,
    promoted: false,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Handcrafted vintage leather boots with genuine leather construction. Durable design with comfortable insole and classic styling. Perfect for both casual and semi-formal occasions.',
    store: 'Vintage Threads',
    storeRating: 4.8,
    availability: 'In Stock',
    material: 'Genuine Leather',
    sizes: ['7', '8', '9', '10', '11', '12'],
  },
  {
    id: 3,
    name: 'Handcrafted Tote Bag',
    price: 59.99,
    distance: 3.7,
    promoted: false,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Beautiful handcrafted tote bag made from sustainable materials. Spacious interior with multiple compartments. Perfect for daily use, shopping, or as a stylish work bag.',
    store: 'Vintage Threads',
    storeRating: 4.8,
    availability: 'Limited Stock',
    material: 'Canvas & Leather',
    sizes: ['One Size'],
  },
  {
    id: 4,
    name: 'Smart LED Light Bulbs',
    price: 24.99,
    distance: 1.2,
    promoted: true,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Energy-efficient smart LED light bulbs with WiFi connectivity. Control brightness, color, and scheduling through your smartphone. Compatible with popular smart home systems.',
    store: 'Tech Haven',
    storeRating: 4.6,
    availability: 'In Stock',
    material: 'LED Technology',
    sizes: ['E26 Base'],
  },
  {
    id: 5,
    name: 'Wireless Bluetooth Speaker',
    price: 79.99,
    distance: 4.1,
    promoted: false,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Premium wireless Bluetooth speaker with exceptional sound quality. 12-hour battery life, waterproof design, and deep bass. Perfect for outdoor activities and home entertainment.',
    store: 'Tech Haven',
    storeRating: 4.6,
    availability: 'In Stock',
    material: 'Aluminum & Fabric',
    sizes: ['Portable'],
  },
  {
    id: 6,
    name: 'Ceramic Coffee Mugs Set',
    price: 34.95,
    distance: 2.8,
    promoted: false,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Beautiful set of 4 ceramic coffee mugs with elegant glazed finish. Microwave and dishwasher safe. Each mug holds 12oz and features a comfortable ergonomic handle.',
    store: 'Home & Hearth',
    storeRating: 4.7,
    availability: 'In Stock',
    material: 'Ceramic',
    sizes: ['12oz'],
  },
  {
    id: 7,
    name: 'Bamboo Cutting Board',
    price: 19.99,
    distance: 1.5,
    promoted: false,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Eco-friendly bamboo cutting board with natural antimicrobial properties. Large surface area perfect for meal prep. Easy to clean and maintain with proper care.',
    store: 'Home & Hearth',
    storeRating: 4.7,
    availability: 'In Stock',
    material: 'Sustainable Bamboo',
    sizes: ['Large (18x12 inches)'],
  },
  {
    id: 8,
    name: 'Gaming Mechanical Keyboard',
    price: 149.99,
    distance: 6.2,
    promoted: true,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    description: 'Professional gaming mechanical keyboard with RGB backlighting and customizable keys. Responsive mechanical switches provide tactile feedback for gaming and typing.',
    store: 'Tech Haven',
    storeRating: 4.6,
    availability: 'In Stock',
    material: 'Aluminum Frame',
    sizes: ['Full Size'],
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === parseInt(id || '0'));
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product) return;
    
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
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                  {product.promoted && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      Promoted
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Store:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{product.store}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.storeRating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Distance:</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{product.distance} miles away</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Availability:</span>
                  <span className={`font-medium ${
                    product.availability === 'In Stock' 
                      ? 'text-green-600' 
                      : product.availability === 'Limited Stock'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {product.availability}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Material:</span>
                  <span className="text-gray-700">{product.material}</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="font-medium text-gray-900">Available Sizes:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full font-semibold py-3"
                >
                  Contact Store
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Connect with {product.store} to purchase or learn more
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;