import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ReviewForm from './review-form';
import { 
  Star, 
  Shield, 
  ThumbsUp, 
  Flag, 
  MoreHorizontal,
  User,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  Filter
} from 'lucide-react';

interface ReviewWithUser {
  id: number;
  productId: string;
  userId: string;
  orderId: number | null;
  rating: number;
  title: string | null;
  comment: string | null;
  photoUrl: string | null;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  reportCount: number;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  userHelpfulVote?: boolean;
}

interface ProductRatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  verifiedPurchaseCount: number;
}

interface ReviewsData {
  reviews: ReviewWithUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ReviewEligibility {
  canReview: boolean;
  hasPurchased: boolean;
  hasExistingReview: boolean;
  isVerifiedPurchase: boolean;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  // Fetch review eligibility
  const { data: eligibility } = useQuery<ReviewEligibility>({
    queryKey: [`/api/products/${productId}/can-review`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}/can-review`, {
        headers: { 'user-id': '1' } // Mock auth
      });
      return response.json();
    }
  });

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery<ReviewsData>({
    queryKey: [`/api/products/${productId}/reviews`, sortBy],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}/reviews?sort=${sortBy}&limit=20`);
      return response.json();
    }
  });

  // Fetch rating statistics
  const { data: ratingStats } = useQuery<{ stats: ProductRatingStats }>({
    queryKey: [`/api/products/${productId}/rating-stats`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}/rating-stats`);
      return response.json();
    }
  });

  // Mark review as helpful
  const helpfulMutation = useMutation({
    mutationFn: async ({ reviewId, isHelpful }: { reviewId: number; isHelpful: boolean }) => {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
        body: JSON.stringify({ isHelpful }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      toast({
        title: "Thanks for your feedback!",
        description: "Your vote helps other shoppers find the most helpful reviews.",
      });
    },
  });

  // Report review
  const reportMutation = useMutation({
    mutationFn: async ({ reviewId, reason }: { reviewId: number; reason: string }) => {
      const response = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
        body: JSON.stringify({ reason, description: 'Reported by user' }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Reported",
        description: "Thank you for helping maintain review quality. Our team will review this shortly.",
      });
    },
  });

  const StarRating = ({ rating, showNumber = true }: { rating: number; showNumber?: boolean }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );

  const toggleExpanded = (reviewId: number) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const stats = ratingStats?.stats;
  const reviews = reviewsData?.reviews || [];

  if (reviewsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      {stats && stats.totalReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{stats.averageRating}</div>
                  <div>
                    <StarRating rating={stats.averageRating} showNumber={false} />
                    <div className="text-sm text-gray-600">
                      Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                    </div>
                    {stats.verifiedPurchaseCount > 0 && (
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3" />
                        {stats.verifiedPurchaseCount} verified purchase{stats.verifiedPurchaseCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{stars}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <Progress 
                      value={(stats.ratingDistribution[stars] / stats.totalReviews) * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-gray-600 w-8">
                      {stats.ratingDistribution[stars]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Share Your Experience</h3>
              <p className="text-sm text-gray-600">
                {eligibility?.canReview 
                  ? "Tell other shoppers about this product"
                  : eligibility?.hasExistingReview 
                    ? "You've already reviewed this product"
                    : "Purchase this product to leave a verified review"
                }
              </p>
            </div>
            <Button 
              onClick={() => setShowReviewForm(true)}
              disabled={!eligibility?.canReview}
              className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
            >
              Write Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form Modal */}
      {showReviewForm && eligibility && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <ReviewForm
            productId={productId}
            productName={productName}
            canReview={eligibility.canReview}
            hasPurchased={eligibility.hasPurchased}
            hasExistingReview={eligibility.hasExistingReview}
            isVerifiedPurchase={eligibility.isVerifiedPurchase}
            onClose={() => setShowReviewForm(false)}
            onSubmitSuccess={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reviews ({reviews.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              const needsExpansion = review.comment && review.comment.length > 200;
              
              return (
                <div key={review.id} className="border rounded-lg p-4 space-y-3">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--spiral-coral)]/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-[var(--spiral-coral)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.user.firstName && review.user.lastName 
                              ? `${review.user.firstName} ${review.user.lastName.charAt(0)}.`
                              : 'Anonymous User'
                            }
                          </span>
                          {review.isVerifiedPurchase && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Rating and Title */}
                  <div className="space-y-2">
                    <StarRating rating={review.rating} showNumber={false} />
                    {review.title && (
                      <h4 className="font-semibold">{review.title}</h4>
                    )}
                  </div>

                  {/* Review Content */}
                  {review.comment && (
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        {needsExpansion && !isExpanded 
                          ? `${review.comment.substring(0, 200)}...`
                          : review.comment
                        }
                      </p>
                      {needsExpansion && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(review.id)}
                          className="text-[var(--spiral-coral)] p-0 h-auto"
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Review Photo */}
                  {review.photoUrl && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ImageIcon className="h-4 w-4" />
                        Customer Photo
                      </div>
                      <img 
                        src={review.photoUrl} 
                        alt="Customer review photo"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => helpfulMutation.mutate({ reviewId: review.id, isHelpful: true })}
                        disabled={helpfulMutation.isPending}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpfulCount})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reportMutation.mutate({ reviewId: review.id, reason: 'inappropriate' })}
                        disabled={reportMutation.isPending}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* No Reviews State */}
      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-6">
              Be the first to share your experience with this product
            </p>
            {eligibility?.canReview && (
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
              >
                Write the First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}