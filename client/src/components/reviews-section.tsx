import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, User, ShieldCheck, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewsSectionProps {
  targetType: 'product' | 'store';
  targetId: string;
  targetName: string;
  overallRating?: number;
  totalReviews?: number;
}

export default function ReviewsSection({ 
  targetType, 
  targetId, 
  targetName, 
  overallRating = 4.2,
  totalReviews = 0 
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userId: 1,
      userName: "Sarah M.",
      rating: 5,
      title: "Excellent quality and service!",
      content: "I've been shopping here for months and the quality is consistently outstanding. The staff is knowledgeable and always willing to help. Highly recommend!",
      isVerifiedPurchase: true,
      helpfulCount: 12,
      createdAt: "2025-01-15"
    },
    {
      id: "2",
      userId: 2,
      userName: "Mike K.",
      rating: 4,
      title: "Good selection, fair prices",
      content: "Nice variety of products with competitive pricing. The checkout process was smooth and I earned SPIRALs on my purchase which was a nice bonus.",
      isVerifiedPurchase: true,
      helpfulCount: 8,
      createdAt: "2025-01-10"
    },
    {
      id: "3",
      userId: 3,
      userName: "Jennifer L.",
      rating: 5,
      title: "Love the SPIRAL rewards!",
      content: "The loyalty program makes every purchase feel rewarding. The products are high quality and the mall location is convenient for pickup.",
      isVerifiedPurchase: false,
      helpfulCount: 5,
      createdAt: "2025-01-08"
    }
  ]);

  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [filter, setFilter] = useState<'all' | 'verified' | '5' | '4' | '3' | '2' | '1'>('all');
  const { toast } = useToast();

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = () => {
    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and review content.",
        variant: "destructive"
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: 999, // Mock current user
      userName: "You",
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      isVerifiedPurchase: true, // Would check actual purchase history
      helpfulCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: '', content: '' });
    setShowWriteReview(false);
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulCount: review.helpfulCount + 1 }
        : review
    ));
    
    toast({
      title: "Thanks for your feedback",
      description: "Your vote helps other shoppers.",
    });
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'verified') return review.isVerifiedPurchase;
    return review.rating === parseInt(filter);
  });

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mt-2">
            {renderStars(Math.round(overallRating), 'lg')}
            <span className="text-2xl font-bold">{overallRating.toFixed(1)}</span>
            <span className="text-gray-600">({totalReviews || reviews.length} reviews)</span>
          </div>
        </div>
        
        <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
              <Plus className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Write a Review for {targetName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Your Review</Label>
                <Textarea
                  id="content"
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  placeholder="Share your thoughts about this product/store..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmitReview} className="flex-1">
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rating Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rating Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Reviews
        </Button>
        <Button
          variant={filter === 'verified' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('verified')}
        >
          <ShieldCheck className="h-3 w-3 mr-1" />
          Verified Purchases
        </Button>
        {[5, 4, 3, 2, 1].map(rating => (
          <Button
            key={rating}
            variant={filter === rating.toString() ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(rating.toString() as any)}
          >
            {rating} Stars
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{review.userName}</span>
                    </div>
                    {review.isVerifiedPurchase && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="font-semibold">{review.title}</span>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.content}
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpful(review.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpfulCount})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No reviews found for the selected filter.</p>
          <Button variant="outline" onClick={() => setFilter('all')}>
            View All Reviews
          </Button>
        </div>
      )}
    </div>
  );
}