import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Star, 
  ThumbsUp, 
  User, 
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Filter,
  SortDesc
} from 'lucide-react';

interface Review {
  id: number;
  userId: number;
  reviewType: 'product' | 'store';
  targetId: string;
  storeId?: number;
  storeName?: string;
  productName?: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  orderId?: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId?: string;
  storeId?: number;
  reviewType: 'product' | 'store';
  targetName: string;
  storeName?: string;
}

const StarRating = ({ rating, onRatingChange, readOnly = false }: { 
  rating: number; 
  onRatingChange?: (rating: number) => void; 
  readOnly?: boolean;
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= rating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300 hover:text-yellow-400'
          } ${readOnly ? 'cursor-default' : ''}`}
          onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
};

export default function ProductReviews({ productId, storeId, reviewType, targetName, storeName }: ProductReviewsProps) {
  const [newReview, setNewReview] = useState({
    rating: 0,
    reviewText: '',
    reviewerName: ''
  });
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const targetIdValue = reviewType === 'product' ? productId : storeId?.toString();

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: [`/api/reviews/${reviewType}/${targetIdValue}`],
    enabled: !!targetIdValue,
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      return apiRequest(`/api/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Review submitted successfully!",
        description: "Thank you for sharing your feedback with the community.",
      });
      setNewReview({ rating: 0, reviewText: '', reviewerName: '' });
      setShowReviewForm(false);
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${reviewType}/${targetIdValue}`] });
    },
    onError: (error) => {
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Mark review as helpful
  const helpfulVoteMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${reviewType}/${targetIdValue}`] });
    },
  });

  const handleSubmitReview = async () => {
    if (!newReview.rating || !newReview.reviewText.trim() || !newReview.reviewerName.trim()) {
      toast({
        title: "Please complete all fields",
        description: "Rating, review text, and your name are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const reviewData = {
      reviewType,
      targetId: targetIdValue,
      storeId: reviewType === 'store' ? storeId : undefined,
      storeName: reviewType === 'product' ? storeName : undefined,
      productName: reviewType === 'product' ? targetName : undefined,
      rating: newReview.rating,
      reviewText: newReview.reviewText.trim(),
      reviewerName: newReview.reviewerName.trim(),
      isVerifiedPurchase: false, // This would be determined by backend based on order history
      userId: 1, // Mock user ID - would come from auth
    };

    submitReviewMutation.mutate(reviewData);
    setIsSubmitting(false);
  };

  const filteredReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes;
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--spiral-coral)]" />
                {reviewType === 'product' ? 'Product Reviews' : 'Store Reviews'}
              </CardTitle>
              <CardDescription>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} for {targetName}
              </CardDescription>
            </div>
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
              <DialogTrigger asChild>
                <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with {targetName}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Rating *</Label>
                    <StarRating 
                      rating={newReview.rating} 
                      onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reviewerName">Your Name *</Label>
                    <Input
                      id="reviewerName"
                      value={newReview.reviewerName}
                      onChange={(e) => setNewReview(prev => ({ ...prev, reviewerName: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reviewText">Review *</Label>
                    <Textarea
                      id="reviewText"
                      value={newReview.reviewText}
                      onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                      placeholder="Tell others about your experience..."
                      rows={4}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {reviews.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--spiral-navy)]">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} readOnly />
                <p className="text-sm text-gray-600 mt-1">
                  Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              
              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-8">{stars}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filters and Sorting */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <SortDesc className="h-4 w-4" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filters'}
              </h3>
              <p className="text-gray-600">
                {reviews.length === 0 
                  ? `Be the first to review ${targetName}!` 
                  : 'Try adjusting your filters to see more reviews.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-navy)] rounded-full flex items-center justify-center text-white font-semibold">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--spiral-navy)]">
                          {review.reviewerName}
                        </span>
                        {review.isVerifiedPurchase && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} readOnly />
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.reviewText}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => helpfulVoteMutation.mutate(review.id)}
                    className="text-gray-600 hover:text-[var(--spiral-coral)]"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpfulVotes})
                  </Button>
                  
                  {reviewType === 'product' && review.storeName && (
                    <span className="text-sm text-gray-500">
                      Purchased from {review.storeName}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}