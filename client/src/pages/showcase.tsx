import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Share2, 
  MessageCircle,
  Star,
  MapPin,
  Award,
  Video,
  Image as ImageIcon,
  Filter,
  Search,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Users,
  TrendingUp
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
  userHasLiked?: boolean;
}

interface TestimonialComment {
  id: number;
  testimonialId: number;
  userId: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
  };
}

interface TestimonialsData {
  testimonials: RetailerTestimonialWithStore[];
  total: number;
}

interface CommentsData {
  comments: TestimonialComment[];
}

export default function ShowcasePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    featured: false,
    search: ''
  });
  const [expandedTestimonials, setExpandedTestimonials] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());
  const [commentForm, setCommentForm] = useState<{[key: number]: string}>({});

  // Fetch testimonials
  const { data: testimonialsData, isLoading } = useQuery<TestimonialsData>({
    queryKey: ['/api/testimonials', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.featured) params.append('featured', 'true');
      
      const response = await fetch(`/api/testimonials?${params.toString()}`);
      return response.json();
    }
  });

  // Like testimonial mutation
  const likeMutation = useMutation({
    mutationFn: async (testimonialId: number) => {
      const response = await fetch(`/api/testimonials/${testimonialId}/like`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Thank you!",
        description: `You earned ${data.spiralsEarned} SPIRALs for supporting local businesses!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    },
  });

  // Share testimonial mutation
  const shareMutation = useMutation({
    mutationFn: async ({ testimonialId, platform }: { testimonialId: number; platform: string }) => {
      const response = await fetch(`/api/testimonials/${testimonialId}/share`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
        body: JSON.stringify({ platform }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Shared!",
        description: `You earned ${data.spiralsEarned} SPIRALs for sharing local business stories!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async ({ testimonialId, comment }: { testimonialId: number; comment: string }) => {
      const response = await fetch(`/api/testimonials/${testimonialId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': '1' // Mock auth
        },
        body: JSON.stringify({ comment }),
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Comment Added!",
        description: `You earned ${data.spiralsEarned} SPIRALs for community engagement!`,
      });
      setCommentForm(prev => ({ ...prev, [variables.testimonialId]: '' }));
      queryClient.invalidateQueries({ queryKey: [`/api/testimonials/${variables.testimonialId}/comments`] });
    },
  });

  // Get comments for a testimonial
  const getCommentsQuery = (testimonialId: number) => useQuery<CommentsData>({
    queryKey: [`/api/testimonials/${testimonialId}/comments`],
    queryFn: async () => {
      const response = await fetch(`/api/testimonials/${testimonialId}/comments`);
      return response.json();
    },
    enabled: showComments.has(testimonialId)
  });

  const toggleExpanded = (testimonialId: number) => {
    const newExpanded = new Set(expandedTestimonials);
    if (newExpanded.has(testimonialId)) {
      newExpanded.delete(testimonialId);
    } else {
      newExpanded.add(testimonialId);
    }
    setExpandedTestimonials(newExpanded);
  };

  const toggleComments = (testimonialId: number) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(testimonialId)) {
      newShowComments.delete(testimonialId);
    } else {
      newShowComments.add(testimonialId);
    }
    setShowComments(newShowComments);
  };

  const handleShare = (testimonial: RetailerTestimonialWithStore, platform: string) => {
    shareMutation.mutate({ testimonialId: testimonial.id, platform });
    
    // Generate share URL based on platform
    const shareText = `Check out this inspiring story from ${testimonial.store.name}: "${testimonial.title}" 🏪✨ #LocalBusiness #SPIRAL`;
    const shareUrl = `${window.location.origin}/showcase`;
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleAddComment = (testimonialId: number) => {
    const comment = commentForm[testimonialId]?.trim();
    if (!comment) return;
    
    commentMutation.mutate({ testimonialId, comment });
  };

  const testimonials = testimonialsData?.testimonials || [];
  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filters.search && !testimonial.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !testimonial.story.toLowerCase().includes(filters.search.toLowerCase()) &&
        !testimonial.store.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const featuredTestimonial = filteredTestimonials.find(t => t.isFeatured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-8 w-8 text-[var(--spiral-coral)]" />
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)]">
                Retailer Showcase
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover inspiring stories from local business owners who are building community, 
              creating authentic experiences, and making a difference one customer at a time.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {testimonials.length} Stories
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {testimonials.reduce((sum, t) => sum + t.likesCount, 0)} Community Likes
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                {testimonials.reduce((sum, t) => sum + t.sharesCount, 0)} Shares
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search stories..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="arts">Arts & Crafts</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="downtown">Downtown District</SelectItem>
                    <SelectItem value="arts">Arts Quarter</SelectItem>
                    <SelectItem value="wellness">Wellness District</SelectItem>
                    <SelectItem value="tech">Tech Hub</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={filters.featured ? "default" : "outline"}
                  onClick={() => setFilters(prev => ({ ...prev, featured: !prev.featured }))}
                  className={filters.featured ? "bg-[var(--spiral-coral)]" : ""}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Featured Only
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Store of the Week */}
          {featuredTestimonial && (
            <Card className="border-[var(--spiral-coral)]/20 bg-gradient-to-r from-[var(--spiral-coral)]/5 to-[var(--spiral-gold)]/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-[var(--spiral-coral)]" />
                  <Badge className="bg-[var(--spiral-coral)] text-white">Featured Store</Badge>
                  <CardTitle className="text-2xl text-[var(--spiral-navy)]">
                    {featuredTestimonial.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-lg">
                  {featuredTestimonial.store.name} • {featuredTestimonial.store.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {expandedTestimonials.has(featuredTestimonial.id) || featuredTestimonial.story.length <= 300
                        ? featuredTestimonial.story
                        : `${featuredTestimonial.story.substring(0, 300)}...`
                      }
                    </p>
                    {featuredTestimonial.story.length > 300 && (
                      <Button
                        variant="ghost"
                        onClick={() => toggleExpanded(featuredTestimonial.id)}
                        className="text-[var(--spiral-coral)] p-0 h-auto"
                      >
                        {expandedTestimonials.has(featuredTestimonial.id) ? 'Show Less' : 'Read More'}
                        <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${
                          expandedTestimonials.has(featuredTestimonial.id) ? 'rotate-180' : ''
                        }`} />
                      </Button>
                    )}
                    
                    {/* Store Rating */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= featuredTestimonial.store.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {featuredTestimonial.store.rating} • {featuredTestimonial.store.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {featuredTestimonial.imageUrl && (
                      <img 
                        src={featuredTestimonial.imageUrl} 
                        alt={featuredTestimonial.store.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    
                    {featuredTestimonial.videoUrl && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Watch Their Story
                        </div>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <Button
                            onClick={() => window.open(featuredTestimonial.videoUrl!, '_blank')}
                            className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Watch Video
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Engagement Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likeMutation.mutate(featuredTestimonial.id)}
                      disabled={likeMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {featuredTestimonial.likesCount} Likes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(featuredTestimonial.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Comments
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(featuredTestimonial, 'facebook')}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(featuredTestimonial, 'twitter')}
                      className="text-sky-600 hover:bg-sky-50"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Testimonials */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">
              Community Stories ({filteredTestimonials.filter(t => !t.isFeatured).length})
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTestimonials
                .filter(testimonial => !testimonial.isFeatured)
                .map((testimonial) => {
                  const commentsQuery = getCommentsQuery(testimonial.id);
                  const comments = commentsQuery.data?.comments || [];
                  
                  return (
                    <Card key={testimonial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{testimonial.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="font-medium">{testimonial.store.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {testimonial.store.category}
                              </Badge>
                            </CardDescription>
                            <div className="flex items-center gap-1 mt-2">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{testimonial.store.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star 
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= testimonial.store.rating 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          {expandedTestimonials.has(testimonial.id) || testimonial.story.length <= 200
                            ? testimonial.story
                            : `${testimonial.story.substring(0, 200)}...`
                          }
                        </p>
                        
                        {testimonial.story.length > 200 && (
                          <Button
                            variant="ghost"
                            onClick={() => toggleExpanded(testimonial.id)}
                            className="text-[var(--spiral-coral)] p-0 h-auto text-sm"
                          >
                            {expandedTestimonials.has(testimonial.id) ? 'Show Less' : 'Read More'}
                            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${
                              expandedTestimonials.has(testimonial.id) ? 'rotate-180' : ''
                            }`} />
                          </Button>
                        )}
                        
                        {testimonial.imageUrl && (
                          <img 
                            src={testimonial.imageUrl} 
                            alt={testimonial.store.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                        
                        {testimonial.videoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(testimonial.videoUrl!, '_blank')}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Watch Video
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}

                        {/* Engagement Actions */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => likeMutation.mutate(testimonial.id)}
                              disabled={likeMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              {testimonial.likesCount}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleComments(testimonial.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {comments.length}
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(testimonial, 'facebook')}
                              className="text-blue-600 hover:bg-blue-50 p-1"
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(testimonial, 'twitter')}
                              className="text-sky-600 hover:bg-sky-50 p-1"
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {showComments.has(testimonial.id) && (
                          <div className="space-y-3 pt-3 border-t">
                            {comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">
                                    {comment.user.firstName} {comment.user.lastName?.charAt(0)}.
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.comment}</p>
                              </div>
                            ))}
                            
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Add a supportive comment..."
                                value={commentForm[testimonial.id] || ''}
                                onChange={(e) => setCommentForm(prev => ({
                                  ...prev,
                                  [testimonial.id]: e.target.value
                                }))}
                                rows={2}
                                className="text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(testimonial.id)}
                                disabled={commentMutation.isPending || !commentForm[testimonial.id]?.trim()}
                                className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                              >
                                Post
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>

          {/* Empty State */}
          {filteredTestimonials.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No stories found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more retailer stories
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}