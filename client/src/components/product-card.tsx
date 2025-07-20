import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  store: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[hsl(183,100%,23%)]">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            {product.category}
          </Badge>
        </div>
        <div className="absolute top-2 left-2 flex items-center bg-white/90 px-2 py-1 rounded-md">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs text-gray-700 ml-1">4.5</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{product.store}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[hsl(183,100%,23%)]">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ${(product.price * 1.2).toFixed(2)}
            </span>
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          className="w-full bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white font-medium py-2 text-sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;