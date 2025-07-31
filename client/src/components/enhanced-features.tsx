/*
 * Enhanced SPIRAL Features
 * 
 * This module provides enhanced React components that integrate with
 * the existing SPIRAL platform architecture, including proper TypeScript
 * support, shadcn/ui integration, and backend API connectivity.
 */

import React, { useState, useEffect } from 'react';
import { Star, Heart, HeartOff, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  addedAt: string;
}

/*
 * Enhanced StarRating Component
 * Integrates with shadcn/ui and provides better accessibility
 */
interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const isFilled = star <= (hovered || value);
        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} cursor-pointer transition-colors
              ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              ${readOnly ? 'cursor-default' : 'hover:text-yellow-400'}
            `}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onChange?.(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          />
        );
      })}
    </div>
  );
}

/*
 * Enhanced Reviews Component
 * Integrates with existing SPIRAL backend and authentication
 */
interface ReviewsProps {
  productId: string;
  userId?: string;
  userName?: string;
}

export function EnhancedReviews({ productId, userId, userName }: ReviewsProps) {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reviews from API
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });
      if (!response.ok) throw new Error('Failed to submit review');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setNewRating(0);
      setNewComment('');
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review.",
        variant: "destructive"
      });
      return;
    }
    if (newRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating.",
        variant: "destructive"
      });
      return;
    }
    submitReview.mutate({ rating: newRating, comment: newComment });
  }

  const averageRating = Array.isArray(reviews) && reviews.length > 0 
    ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return <div className="animate-pulse space-y-4">Loading reviews...</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Customer Reviews
          <div className="flex items-center gap-2">
            <StarRating value={averageRating} readOnly />
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({Array.isArray(reviews) ? reviews.length : 0} review{Array.isArray(reviews) && reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Reviews */}
        {Array.isArray(reviews) && reviews.map((review: Review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.userName}</span>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <StarRating value={review.rating} readOnly size="sm" />
            <p className="mt-2 text-sm">{review.comment}</p>
          </div>
        ))}

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Write a Review</h4>
          <div>
            <label className="text-sm font-medium">Rating</label>
            <StarRating value={newRating} onChange={setNewRating} />
          </div>
          <div>
            <label className="text-sm font-medium">Comment</label>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="mt-1"
            />
          </div>
          <Button 
            type="submit" 
            disabled={submitReview.isPending || !userId}
            className="w-full"
          >
            {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/*
 * Enhanced Wishlist Component
 * Integrates with existing SPIRAL wishlist system
 */
interface WishlistButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  userId?: string;
}

export function EnhancedWishlistButton({ 
  productId, 
  productName, 
  productPrice, 
  productImage, 
  userId 
}: WishlistButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if item is in wishlist
  const { data: wishlist = [] } = useQuery<WishlistItem[]>({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/wishlist`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      return response.json();
    },
    enabled: !!userId
  });

  // Toggle wishlist mutation
  const toggleWishlist = useMutation({
    mutationFn: async (action: 'add' | 'remove') => {
      const response = await fetch(`/api/users/${userId}/wishlist/${productId}`, {
        method: action === 'add' ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productPrice,
          productImage
        })
      });
      if (!response.ok) throw new Error(`Failed to ${action} wishlist item`);
      return response.json();
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
      toast({
        title: action === 'add' ? "Added to wishlist" : "Removed from wishlist",
        description: action === 'add' 
          ? `${productName} has been added to your wishlist`
          : `${productName} has been removed from your wishlist`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  if (!userId) {
    return (
      <Button variant="outline" disabled>
        <Heart className="w-4 h-4 mr-2" />
        Sign in to Save
      </Button>
    );
  }

  const isInWishlist = Array.isArray(wishlist) && wishlist.some((item: WishlistItem) => item.id === productId);

  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      onClick={() => toggleWishlist.mutate(isInWishlist ? 'remove' : 'add')}
      disabled={toggleWishlist.isPending}
      className="gap-2"
    >
      {isInWishlist ? (
        <>
          <Heart className="w-4 h-4 fill-current" />
          Saved
        </>
      ) : (
        <>
          <Heart className="w-4 h-4" />
          Save
        </>
      )}
    </Button>
  );
}

/*
 * Enhanced Membership Banner
 * Integrates with SPIRAL branding and loyalty system
 */
export function SpiralPlusBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">SPIRAL Plus</h3>
              <p className="text-gray-600 text-sm">
                Free same-day delivery • 2x SPIRAL points • Exclusive local deals
              </p>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  SPIRAL Plus Membership
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Premium Benefits:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Free same-day delivery on all orders</li>
                    <li>• Double SPIRAL points on every purchase</li>
                    <li>• Exclusive access to local deals and events</li>
                    <li>• Priority customer support</li>
                    <li>• Early access to new local retailers</li>
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">$9.99/month</div>
                    <div className="text-sm text-muted-foreground">Cancel anytime</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Free Trial
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  30-day free trial • No commitments • Support local businesses
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export { type Review, type WishlistItem };