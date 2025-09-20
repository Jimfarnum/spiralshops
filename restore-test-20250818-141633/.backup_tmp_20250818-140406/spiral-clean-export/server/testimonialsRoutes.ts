import type { Express } from "express";

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

// Mock testimonials data for demonstration
const mockTestimonials: RetailerTestimonialWithStore[] = [
  {
    id: 1,
    storeId: "1",
    title: "From Passion to Community Impact",
    story: "Starting Local Coffee Roasters five years ago was a dream rooted in bringing authentic, locally-sourced coffee to our community. Every bean is carefully selected from small farms, and every cup tells a story of sustainability and quality. What brings me the most joy is seeing families gather in our space, students finding their study spot, and neighbors becoming friends over our signature dark roast. SPIRAL has helped us reach even more coffee lovers while maintaining our commitment to personal service and community connection.",
    imageUrl: "/api/placeholder/400/300",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isApproved: true,
    isFeatured: true,
    likesCount: 47,
    sharesCount: 12,
    createdAt: "2025-01-18T09:00:00Z",
    store: {
      name: "Local Coffee Roasters",
      category: "Food & Beverage",
      location: "Downtown District",
      rating: 4.8
    }
  },
  {
    id: 2,
    storeId: "2",
    title: "Crafting Beauty, One Piece at a Time",
    story: "Artisan Pottery Studio began in my garage with just a wheel and a kiln. Today, we're a thriving community space where people discover the therapeutic art of pottery. Each piece in our collection is handmade with love, carrying the unique fingerprint of its creator. Through SPIRAL, we've connected with customers who truly appreciate handcrafted artistry, and many have become lifelong friends. Our pottery classes have become a cornerstone of the community, bringing together people from all walks of life.",
    imageUrl: "/api/placeholder/400/300",
    videoUrl: null,
    isApproved: true,
    isFeatured: false,
    likesCount: 32,
    sharesCount: 8,
    createdAt: "2025-01-16T14:30:00Z",
    store: {
      name: "Artisan Pottery Studio",
      category: "Arts & Crafts",
      location: "Arts Quarter",
      rating: 4.9
    }
  },
  {
    id: 3,
    storeId: "3",
    title: "Growing Together with Nature",
    story: "Green Leaf Tea Co. started with a simple mission: to share the healing power of organic, ethically-sourced teas. As a small family business, we've built relationships with tea gardens around the world, ensuring fair trade and sustainable practices. Our customers often tell us how our teas have become part of their daily wellness routine. The SPIRAL platform has allowed us to reach health-conscious individuals who value quality and authenticity in their tea experience.",
    imageUrl: "/api/placeholder/400/300",
    videoUrl: null,
    isApproved: true,
    isFeatured: false,
    likesCount: 28,
    sharesCount: 6,
    createdAt: "2025-01-14T11:15:00Z",
    store: {
      name: "Green Leaf Tea Co.",
      category: "Health & Wellness",
      location: "Wellness District",
      rating: 4.7
    }
  },
  {
    id: 4,
    storeId: "4",
    title: "Innovation Meets Tradition",
    story: "At TechCraft Electronics, we believe technology should enhance life, not complicate it. Starting as a small repair shop, we've grown into a trusted source for cutting-edge gadgets and personalized tech solutions. What sets us apart is our commitment to education – we don't just sell products, we help customers understand and maximize their technology investments. SPIRAL has connected us with tech enthusiasts who appreciate both innovation and reliable service.",
    imageUrl: "/api/placeholder/400/300",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isApproved: false, // Pending approval
    isFeatured: false,
    likesCount: 15,
    sharesCount: 3,
    createdAt: "2025-01-20T16:45:00Z",
    store: {
      name: "TechCraft Electronics",
      category: "Electronics",
      location: "Tech Hub",
      rating: 4.6
    }
  }
];

const mockComments: TestimonialComment[] = [
  {
    id: 1,
    testimonialId: 1,
    userId: "1",
    comment: "Your coffee shop is truly the heart of our neighborhood! The community space you've created is invaluable.",
    isApproved: true,
    createdAt: "2025-01-19T10:30:00Z",
    user: {
      firstName: "Sarah",
      lastName: "Johnson"
    }
  },
  {
    id: 2,
    testimonialId: 1,
    userId: "2",
    comment: "Best dark roast in the city! Thank you for supporting local farmers and bringing quality coffee to our community.",
    isApproved: true,
    createdAt: "2025-01-19T14:20:00Z",
    user: {
      firstName: "Mike",
      lastName: "Chen"
    }
  },
  {
    id: 3,
    testimonialId: 2,
    userId: "3",
    comment: "The pottery classes changed my life! Such a welcoming space for creativity and learning.",
    isApproved: true,
    createdAt: "2025-01-17T09:15:00Z",
    user: {
      firstName: "Emma",
      lastName: "Wilson"
    }
  }
];

export function registerTestimonialsRoutes(app: Express) {
  // Get all approved testimonials for showcase page
  app.get('/api/testimonials', async (req, res) => {
    try {
      const { category, location, featured, limit = 20 } = req.query;
      
      let filteredTestimonials = mockTestimonials.filter(t => t.isApproved);
      
      if (category) {
        filteredTestimonials = filteredTestimonials.filter(t => 
          t.store.category.toLowerCase().includes((category as string).toLowerCase())
        );
      }
      
      if (location) {
        filteredTestimonials = filteredTestimonials.filter(t => 
          t.store.location.toLowerCase().includes((location as string).toLowerCase())
        );
      }
      
      if (featured === 'true') {
        filteredTestimonials = filteredTestimonials.filter(t => t.isFeatured);
      }
      
      // Sort by featured first, then by likes, then by date
      filteredTestimonials.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.likesCount !== b.likesCount) return b.likesCount - a.likesCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      const limitedTestimonials = filteredTestimonials.slice(0, Number(limit));
      
      res.json({
        success: true,
        testimonials: limitedTestimonials,
        total: filteredTestimonials.length
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  });

  // Get testimonials for a specific store
  app.get('/api/stores/:storeId/testimonials', async (req, res) => {
    try {
      const { storeId } = req.params;
      
      const storeTestimonials = mockTestimonials.filter(t => 
        t.storeId === storeId && t.isApproved
      );
      
      res.json({
        success: true,
        testimonials: storeTestimonials
      });
    } catch (error) {
      console.error('Error fetching store testimonials:', error);
      res.status(500).json({ error: 'Failed to fetch store testimonials' });
    }
  });

  // Submit a new testimonial (store owner)
  app.post('/api/testimonials', async (req, res) => {
    try {
      const { storeId, title, story, imageUrl, videoUrl } = req.body;
      
      // Validate required fields
      if (!storeId || !title || !story) {
        return res.status(400).json({ error: 'Store ID, title, and story are required' });
      }
      
      // Create new testimonial (in production, this would insert into database)
      const newTestimonial: RetailerTestimonialWithStore = {
        id: mockTestimonials.length + 1,
        storeId,
        title,
        story,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        isApproved: false, // Requires admin approval
        isFeatured: false,
        likesCount: 0,
        sharesCount: 0,
        createdAt: new Date().toISOString(),
        store: {
          name: "New Store", // Would fetch from stores table
          category: "General",
          location: "Various",
          rating: 4.5
        }
      };
      
      mockTestimonials.push(newTestimonial);
      
      res.json({
        success: true,
        testimonial: newTestimonial,
        message: 'Testimonial submitted successfully and is awaiting approval'
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      res.status(500).json({ error: 'Failed to submit testimonial' });
    }
  });

  // Like a testimonial
  app.post('/api/testimonials/:id/like', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.headers['user-id'] || '1'; // Mock auth
      
      const testimonial = mockTestimonials.find(t => t.id === Number(id));
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      // Toggle like (in production, check if user already liked)
      testimonial.likesCount++;
      
      // Award SPIRAL points for engagement
      const spiralsEarned = 2;
      
      res.json({
        success: true,
        likesCount: testimonial.likesCount,
        spiralsEarned,
        message: 'Thank you for supporting local businesses!'
      });
    } catch (error) {
      console.error('Error liking testimonial:', error);
      res.status(500).json({ error: 'Failed to like testimonial' });
    }
  });

  // Share a testimonial
  app.post('/api/testimonials/:id/share', async (req, res) => {
    try {
      const { id } = req.params;
      const { platform } = req.body; // 'facebook', 'twitter', 'linkedin'
      
      const testimonial = mockTestimonials.find(t => t.id === Number(id));
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      testimonial.sharesCount++;
      
      // Award SPIRAL points for sharing
      const spiralsEarned = 5;
      
      res.json({
        success: true,
        sharesCount: testimonial.sharesCount,
        spiralsEarned,
        message: 'Thank you for sharing and supporting local businesses!'
      });
    } catch (error) {
      console.error('Error sharing testimonial:', error);
      res.status(500).json({ error: 'Failed to share testimonial' });
    }
  });

  // Add comment to testimonial
  app.post('/api/testimonials/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      const userId = req.headers['user-id'] || '1'; // Mock auth
      
      if (!comment || comment.trim().length === 0) {
        return res.status(400).json({ error: 'Comment is required' });
      }
      
      const testimonial = mockTestimonials.find(t => t.id === Number(id));
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      const newComment: TestimonialComment = {
        id: mockComments.length + 1,
        testimonialId: Number(id),
        userId,
        comment: comment.trim(),
        isApproved: true, // Auto-approve for demo
        createdAt: new Date().toISOString(),
        user: {
          firstName: "Current",
          lastName: "User"
        }
      };
      
      mockComments.push(newComment);
      
      // Award SPIRAL points for engagement
      const spiralsEarned = 3;
      
      res.json({
        success: true,
        comment: newComment,
        spiralsEarned,
        message: 'Comment added successfully!'
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  // Get comments for a testimonial
  app.get('/api/testimonials/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      
      const testimonialComments = mockComments.filter(c => 
        c.testimonialId === Number(id) && c.isApproved
      );
      
      res.json({
        success: true,
        comments: testimonialComments
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // Admin: Get pending testimonials
  app.get('/api/admin/testimonials/pending', async (req, res) => {
    try {
      const pendingTestimonials = mockTestimonials.filter(t => !t.isApproved);
      
      res.json({
        success: true,
        testimonials: pendingTestimonials,
        total: pendingTestimonials.length
      });
    } catch (error) {
      console.error('Error fetching pending testimonials:', error);
      res.status(500).json({ error: 'Failed to fetch pending testimonials' });
    }
  });

  // Admin: Approve/reject testimonial
  app.post('/api/admin/testimonials/:id/moderate', async (req, res) => {
    try {
      const { id } = req.params;
      const { action, featured } = req.body; // 'approve' or 'reject'
      
      const testimonial = mockTestimonials.find(t => t.id === Number(id));
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      if (action === 'approve') {
        testimonial.isApproved = true;
        if (featured) {
          testimonial.isFeatured = true;
        }
      } else if (action === 'reject') {
        testimonial.isApproved = false;
        testimonial.isFeatured = false;
      }
      
      res.json({
        success: true,
        message: `Testimonial ${action}d successfully`,
        testimonial
      });
    } catch (error) {
      console.error('Error moderating testimonial:', error);
      res.status(500).json({ error: 'Failed to moderate testimonial' });
    }
  });

  // Admin: Set featured testimonial
  app.post('/api/admin/testimonials/:id/feature', async (req, res) => {
    try {
      const { id } = req.params;
      const { featured } = req.body;
      
      const testimonial = mockTestimonials.find(t => t.id === Number(id));
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      
      testimonial.isFeatured = featured;
      
      res.json({
        success: true,
        message: `Testimonial ${featured ? 'featured' : 'unfeatured'} successfully`,
        testimonial
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      res.status(500).json({ error: 'Failed to update featured status' });
    }
  });
}