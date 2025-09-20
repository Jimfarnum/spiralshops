import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, HeartOff } from 'lucide-react';

interface AddToWishlistButtonProps {
  productId: string;
  isInWishlist?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function AddToWishlistButton({ 
  productId, 
  isInWishlist = false, 
  variant = 'outline',
  size = 'default',
  className = ''
}: AddToWishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleWishlist = async () => {
    setLoading(true);
    
    try {
      if (inWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setInWishlist(false);
          toast({
            title: "Removed from Wishlist",
            description: "Product has been removed from your wishlist.",
          });
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            productId,
            priceDropAlert: true,
            restockAlert: true
          })
        });
        
        if (response.ok) {
          setInWishlist(true);
          toast({
            title: "Added to Wishlist",
            description: "Product saved! You'll be notified about price drops and restocks.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleWishlist}
      disabled={loading}
      className={`${className} ${inWishlist ? 'text-red-600 hover:text-red-700' : ''}`}
    >
      {loading ? (
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : inWishlist ? (
        <Heart className="w-4 h-4 fill-current" />
      ) : (
        <HeartOff className="w-4 h-4" />
      )}
      {size !== 'sm' && (
        <span className="ml-2">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}