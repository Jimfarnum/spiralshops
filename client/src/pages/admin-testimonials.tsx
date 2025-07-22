import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Heart,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Eye,
  Trash2,
  Edit,
  Plus,
  Award,
  Video,
  Image as ImageIcon
} from 'lucide-react';

interface RetailerTestimonialWithStore {
  id: number;
  storeId: string;
  title: string;
  story: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  likesCount: number;
  sharesCount: number;
  createdAt: string;
  store: {
    name: string;
    category: string;
    location: string;
    rating: number;
  };
}

interface PendingTestimonialsData {
  testimonials: RetailerTestimonialWithStore[];
  total: number;
}

export default function AdminTestimonialsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('pending');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    storeId: '1',
    title: '',
    story: '',
    imageUrl: '',
    videoUrl: ''
  });

  // Fetch pending testimonials
  const { data: pendingData, isLoading } = useQuery<PendingTestimonialsData>({
    queryKey: ['/api/admin/testimonials/pending'],
    queryFn: async () => {
      const response = await fetch('/api/admin/testimonials/pending');
      return response.json();
    }
  });

  // Moderate testimonial (approve/reject)
  const moderateMutation = useMutation({
    mutationFn: async ({ testimonialId, action, featured }: { 
      testimonialId: number; 
      action: 'approve' | 'reject'; 
      featured?: boolean 
    }) => {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, featured }),
      });
      if (!response.ok) {
        throw new Error('Failed to moderate testimonial');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Testimonial Moderated",
        description: `Testimonial has been ${variables.action}d successfully.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials/pending'] });
    },
    onError: (error: any) => {
      toast({
        title: "Moderation Failed",
        description: error.message || "Failed to moderate testimonial",
        variant: "destructive",
      });
    },
  });

  // Submit new testimonial
  const submitTestimonialMutation = useMutation({
    mutationFn: async (testimonialData: any) => {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Testimonial Submitted!",
        description: "Your testimonial has been submitted for review and will appear once approved.",
        variant: "default",
      });
      setSubmissionForm({
        storeId: '1',
        title: '',
        story: '',
        imageUrl: '',
        videoUrl: ''
      });
      setShowSubmissionForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials/pending'] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit testimonial",
        variant: "destructive",
      });
    },
  });

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionForm.title.trim() || !submissionForm.story.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and your story.",
        variant: "destructive",
      });
      return;
    }

    submitTestimonialMutation.mutate(submissionForm);
  };

  const pendingTestimonials = pendingData?.testimonials || [];

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
              Retailer Testimonial Management
            </h1>
            <p className="text-lg text-gray-600">
              Submit testimonials and manage community stories from local business owners
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="text-lg font-bold">{pendingTestimonials.length}</div>
                    <div className="text-xs text-gray-600">Pending Approval</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-lg font-bold">3</div>
                    <div className="text-xs text-gray-600">Approved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[var(--spiral-coral)]" />
                  <div>
                    <div className="text-lg font-bold">1</div>
                    <div className="text-xs text-gray-600">Featured</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-lg font-bold">107</div>
                    <div className="text-xs text-gray-600">Total Likes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Management Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="submit">Submit New</TabsTrigger>
              <TabsTrigger value="approved">Approved Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--spiral-coral)]/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-[var(--spiral-coral)]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{testimonial.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{testimonial.store.name}</span>
                            <Badge variant="outline">{testimonial.store.category}</Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Testimonial Content */}
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{testimonial.story}</p>
                      </div>

                      {testimonial.imageUrl && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <ImageIcon className="h-4 w-4" />
                            Attached Image:
                          </div>
                          <img 
                            src={testimonial.imageUrl} 
                            alt="Testimonial image"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}

                      {testimonial.videoUrl && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            Video Link:
                          </div>
                          <a 
                            href={testimonial.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--spiral-coral)] hover:underline text-sm"
                          >
                            {testimonial.videoUrl}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Store Details */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        {testimonial.store.rating} store rating
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {testimonial.store.location}
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={() => moderateMutation.mutate({ 
                          testimonialId: testimonial.id, 
                          action: 'approve',
                          featured: false 
                        })}
                        disabled={moderateMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => moderateMutation.mutate({ 
                          testimonialId: testimonial.id, 
                          action: 'approve',
                          featured: true 
                        })}
                        disabled={moderateMutation.isPending}
                        className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                      >
                        <Award className="mr-2 h-4 w-4" />
                        Approve & Feature
                      </Button>
                      <Button
                        onClick={() => moderateMutation.mutate({ 
                          testimonialId: testimonial.id, 
                          action: 'reject' 
                        })}
                        disabled={moderateMutation.isPending}
                        variant="destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {pendingTestimonials.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">All caught up!</h3>
                    <p className="text-gray-500">
                      No testimonials pending review at this time.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="submit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Store's Testimonial</CardTitle>
                  <CardDescription>
                    Share your business story and connect with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTestimonial} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Story Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={submissionForm.title}
                        onChange={(e) => setSubmissionForm(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                        placeholder="e.g., From Passion to Community Impact"
                        maxLength={100}
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {submissionForm.title.length}/100 characters
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Your Story <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={submissionForm.story}
                        onChange={(e) => setSubmissionForm(prev => ({
                          ...prev,
                          story: e.target.value
                        }))}
                        placeholder="Tell the community about your business journey, what makes you unique, and how you serve the community..."
                        rows={6}
                        maxLength={2000}
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {submissionForm.story.length}/2000 characters
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Image URL (Optional)</label>
                      <Input
                        type="url"
                        value={submissionForm.imageUrl}
                        onChange={(e) => setSubmissionForm(prev => ({
                          ...prev,
                          imageUrl: e.target.value
                        }))}
                        placeholder="https://example.com/your-store-image.jpg"
                      />
                      <div className="text-xs text-gray-500">
                        Add a photo of your store, products, or team
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Video URL (Optional)</label>
                      <Input
                        type="url"
                        value={submissionForm.videoUrl}
                        onChange={(e) => setSubmissionForm(prev => ({
                          ...prev,
                          videoUrl: e.target.value
                        }))}
                        placeholder="https://youtube.com/embed/your-video"
                      />
                      <div className="text-xs text-gray-500">
                        YouTube or Vimeo embed link for your store video
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Your testimonial will be reviewed before appearing on the platform. 
                        Please ensure all content is appropriate and accurately represents your business.
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={submitTestimonialMutation.isPending || !submissionForm.title.trim() || !submissionForm.story.trim()}
                        className="flex-1 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                      >
                        {submitTestimonialMutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-16 w-16 text-[var(--spiral-coral)] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">View All Approved Stories</h3>
                  <p className="text-gray-500 mb-6">
                    See approved testimonials on the public showcase page
                  </p>
                  <Button className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80">
                    Visit Showcase
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}