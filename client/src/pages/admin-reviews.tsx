import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Shield, 
  Flag, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Eye,
  Trash2
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
}

interface FlaggedReviewsData {
  flaggedReviews: ReviewWithUser[];
  total: number;
}

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('flagged');

  // Fetch flagged reviews
  const { data: flaggedData, isLoading } = useQuery<FlaggedReviewsData>({
    queryKey: ['/api/admin/flagged-reviews'],
    queryFn: async () => {
      const response = await fetch('/api/admin/flagged-reviews');
      return response.json();
    }
  });

  // Moderate review (approve/reject)
  const moderateMutation = useMutation({
    mutationFn: async ({ reviewId, action }: { reviewId: number; action: 'approve' | 'reject' }) => {
      const response = await fetch(`/api/admin/reviews/${reviewId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        throw new Error('Failed to moderate review');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Review Moderated",
        description: `Review has been ${variables.action}d successfully.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/flagged-reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: "Moderation Failed",
        description: error.message || "Failed to moderate review",
        variant: "destructive",
      });
    },
  });

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const getSeverityBadge = (reportCount: number, isApproved: boolean) => {
    if (!isApproved) {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    }
    if (reportCount >= 3) {
      return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
    }
    if (reportCount >= 1) {
      return <Badge className="bg-yellow-100 text-yellow-800">Reported</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Under Review</Badge>;
  };

  const flaggedReviews = flaggedData?.flaggedReviews || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4">
              Review Moderation Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage flagged reviews and maintain content quality across the platform
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-lg font-bold">{flaggedReviews.length}</div>
                    <div className="text-xs text-gray-600">Flagged Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="text-lg font-bold">
                      {flaggedReviews.filter(r => r.reportCount >= 3).length}
                    </div>
                    <div className="text-xs text-gray-600">High Priority</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-lg font-bold">
                      {flaggedReviews.filter(r => r.isApproved).length}
                    </div>
                    <div className="text-xs text-gray-600">Approved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-lg font-bold">
                      {flaggedReviews.filter(r => !r.isApproved).length}
                    </div>
                    <div className="text-xs text-gray-600">Rejected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Moderation Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flagged">Flagged Reviews</TabsTrigger>
              <TabsTrigger value="high-priority">High Priority</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="flagged" className="space-y-4">
              {flaggedReviews.filter(r => r.isApproved).map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--spiral-coral)]/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-[var(--spiral-coral)]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Review for Product {review.productId}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>
                              {review.user.firstName} {review.user.lastName?.charAt(0)}.
                            </span>
                            {review.isVerifiedPurchase && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(review.reportCount, review.isApproved)}
                        <Badge variant="outline">
                          {review.reportCount} report{review.reportCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Review Content */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} />
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {review.title && (
                        <h4 className="font-semibold text-lg">{review.title}</h4>
                      )}

                      {review.comment && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      )}

                      {review.photoUrl && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Customer Photo:</div>
                          <img 
                            src={review.photoUrl} 
                            alt="Customer review photo"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>

                    {/* Review Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        {review.helpfulCount} helpful votes
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag className="h-4 w-4" />
                        {review.reportCount} reports
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Product ID: {review.productId}
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={() => moderateMutation.mutate({ reviewId: review.id, action: 'approve' })}
                        disabled={moderateMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Keep Review
                      </Button>
                      <Button
                        onClick={() => moderateMutation.mutate({ reviewId: review.id, action: 'reject' })}
                        disabled={moderateMutation.isPending}
                        variant="destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Remove Review
                      </Button>
                      <Button variant="outline" disabled={moderateMutation.isPending}>
                        <Flag className="mr-2 h-4 w-4" />
                        View Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {flaggedReviews.filter(r => r.isApproved).length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">All caught up!</h3>
                    <p className="text-gray-500">
                      No flagged reviews requiring moderation at this time.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="high-priority" className="space-y-4">
              {flaggedReviews.filter(r => r.reportCount >= 3 && r.isApproved).map((review) => (
                <Card key={review.id} className="border-red-200 bg-red-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-red-800">
                        High Priority Review - {review.reportCount} Reports
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This review has received multiple reports and requires immediate attention.
                      </AlertDescription>
                    </Alert>
                    {/* Same review content as above */}
                    <div className="mt-4 space-y-3">
                      <StarRating rating={review.rating} />
                      {review.title && <h4 className="font-semibold">{review.title}</h4>}
                      {review.comment && (
                        <div className="bg-white rounded-lg p-3 border">
                          <p>{review.comment}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => moderateMutation.mutate({ reviewId: review.id, action: 'approve' })}
                        disabled={moderateMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Keep Review
                      </Button>
                      <Button
                        onClick={() => moderateMutation.mutate({ reviewId: review.id, action: 'reject' })}
                        disabled={moderateMutation.isPending}
                        variant="destructive"
                      >
                        Remove Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {flaggedReviews.filter(r => !r.isApproved).map((review) => (
                <Card key={review.id} className="border-gray-300 bg-gray-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-600">Rejected Review</CardTitle>
                      <Badge className="bg-red-100 text-red-800">Removed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-600">
                      <StarRating rating={review.rating} />
                      {review.title && <div className="font-medium">{review.title}</div>}
                      {review.comment && <div className="italic">"{review.comment}"</div>}
                      <div className="text-sm">
                        Removed on {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => moderateMutation.mutate({ reviewId: review.id, action: 'approve' })}
                        disabled={moderateMutation.isPending}
                        variant="outline"
                        size="sm"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Restore Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}