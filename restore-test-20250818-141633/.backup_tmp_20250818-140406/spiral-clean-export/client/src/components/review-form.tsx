import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Upload, 
  Shield, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  productName: string;
  canReview: boolean;
  hasPurchased: boolean;
  hasExistingReview: boolean;
  isVerifiedPurchase: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function ReviewForm({ 
  productId, 
  productName, 
  canReview, 
  hasPurchased, 
  hasExistingReview, 
  isVerifiedPurchase,
  onClose,
  onSubmitSuccess
}: ReviewFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your experience with other shoppers.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/rating-stats`] });
      onSubmitSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      rating,
      title: title.trim() || null,
      comment: comment.trim() || null,
      photoUrl: photoUrl.trim() || null,
    });
  };

  const StarRating = ({ value, onRate, onHover, onLeave }: any) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          className="p-1 transition-colors"
        >
          <Star
            className={`h-6 w-6 ${
              star <= (hoveredRating || value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
      </span>
    </div>
  );

  if (!canReview) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Write a Review</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasPurchased && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                You can only review products you have purchased. This helps ensure authentic, verified reviews for other shoppers.
              </AlertDescription>
            </Alert>
          )}
          
          {hasExistingReview && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You have already reviewed this product. Each customer can only submit one review per product.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Write a Review</CardTitle>
            <CardDescription>{productName}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isVerifiedPurchase && (
          <Badge className="w-fit bg-green-100 text-green-800 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Verified Purchase
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRating
              value={rating}
              onRate={setRating}
              onHover={setHoveredRating}
              onLeave={() => setHoveredRating(0)}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Review Title (Optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              maxLength={100}
            />
            <div className="text-xs text-gray-500 text-right">
              {title.length}/100 characters
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review (Optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience with this product..."
              rows={4}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/1000 characters
            </div>
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Photo URL (Optional)</label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Add a photo to help other shoppers see the product in use
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={rating === 0 || submitReviewMutation.isPending}
              className="flex-1"
            >
              {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          {/* Guidelines */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Reviews should be honest, helpful, and respectful. Reviews that violate our community guidelines may be removed.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  );
}