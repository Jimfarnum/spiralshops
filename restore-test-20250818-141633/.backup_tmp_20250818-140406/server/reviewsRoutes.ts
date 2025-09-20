import type { Express } from "express";
import { eq, desc, and, avg, count, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  productReviews, 
  reviewFlags, 
  userProductPurchases, 
  reviewHelpfulness,
  users,
  orders
} from "@shared/schema";

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

// Mock data for demonstration
const mockReviews: ReviewWithUser[] = [
  {
    id: 1,
    productId: "product-1",
    userId: "1",
    orderId: 1,
    rating: 5,
    title: "Excellent quality coffee beans!",
    comment: "These dark roast beans are absolutely perfect. Rich flavor, smooth finish, and the aroma fills the entire kitchen. I've been ordering these monthly for over a year now.",
    photoUrl: null,
    isVerifiedPurchase: true,
    isApproved: true,
    helpfulCount: 12,
    reportCount: 0,
    createdAt: "2025-01-20T10:30:00Z",
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      profileImageUrl: null
    },
    userHelpfulVote: undefined
  },
  {
    id: 2,
    productId: "product-1",
    userId: "2",
    orderId: 2,
    rating: 4,
    title: "Good coffee, fast shipping",
    comment: "Really enjoyed this coffee. The taste is robust and the packaging kept it fresh. Only complaint is it's a bit pricey, but worth it for special occasions.",
    photoUrl: null,
    isVerifiedPurchase: true,
    isApproved: true,
    helpfulCount: 8,
    reportCount: 0,
    createdAt: "2025-01-18T14:20:00Z",
    user: {
      firstName: "Mike",
      lastName: "Chen",
      profileImageUrl: null
    }
  },
  {
    id: 3,
    productId: "product-1",
    userId: "3",
    orderId: null,
    rating: 3,
    title: "Average quality",
    comment: "It's okay coffee, nothing special. I've had better from other local roasters.",
    photoUrl: null,
    isVerifiedPurchase: false,
    isApproved: true,
    helpfulCount: 2,
    reportCount: 1,
    createdAt: "2025-01-15T09:45:00Z",
    user: {
      firstName: "Anonymous",
      lastName: "User",
      profileImageUrl: null
    }
  },
  {
    id: 4,
    productId: "product-2",
    userId: "1",
    orderId: 1,
    rating: 5,
    title: "Beautiful ceramic mugs!",
    comment: "These mugs are gorgeous and the perfect size. They keep coffee hot for a long time and feel great in your hands. Highly recommend!",
    photoUrl: "/api/placeholder/400/300",
    isVerifiedPurchase: true,
    isApproved: true,
    helpfulCount: 15,
    reportCount: 0,
    createdAt: "2025-01-19T16:15:00Z",
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      profileImageUrl: null
    }
  }
];

const mockPurchases = [
  { userId: "1", productId: "product-1", orderId: 1, verified: true },
  { userId: "1", productId: "product-2", orderId: 1, verified: true },
  { userId: "2", productId: "product-1", orderId: 2, verified: true },
  { userId: "2", productId: "product-3", orderId: 2, verified: true }
];

export function registerReviewsRoutes(app: Express) {
  // Get reviews for a specific product
  app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
      const { productId } = req.params;
      const { sort = 'newest', page = 1, limit = 10 } = req.query;
      const userId = req.headers['user-id'] || '1'; // Mock auth

      // Filter reviews for this product
      let productReviews = mockReviews.filter(r => r.productId === productId && r.isApproved);

      // Sort reviews
      switch (sort) {
        case 'newest':
          productReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          productReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'highest':
          productReviews.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          productReviews.sort((a, b) => a.rating - b.rating);
          break;
        case 'helpful':
          productReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
          break;
      }

      // Pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedReviews = productReviews.slice(startIndex, endIndex);

      res.json({
        success: true,
        reviews: paginatedReviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: productReviews.length,
          totalPages: Math.ceil(productReviews.length / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      res.status(500).json({ error: 'Failed to fetch product reviews' });
    }
  });

  // Get product rating statistics
  app.get('/api/products/:productId/rating-stats', async (req, res) => {
    try {
      const { productId } = req.params;
      
      const productReviews = mockReviews.filter(r => r.productId === productId && r.isApproved);
      
      if (productReviews.length === 0) {
        return res.json({
          success: true,
          stats: {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            verifiedPurchaseCount: 0
          }
        });
      }

      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / productReviews.length;
      
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      productReviews.forEach(review => {
        ratingDistribution[review.rating]++;
      });

      const verifiedPurchaseCount = productReviews.filter(r => r.isVerifiedPurchase).length;

      res.json({
        success: true,
        stats: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: productReviews.length,
          ratingDistribution,
          verifiedPurchaseCount
        }
      });
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      res.status(500).json({ error: 'Failed to fetch rating stats' });
    }
  });

  // Check if user can review a product (has purchased it)
  app.get('/api/products/:productId/can-review', async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.headers['user-id'] || '1'; // Mock auth

      // Check if user has purchased this product
      const hasPurchased = mockPurchases.some(p => 
        p.userId === userId && p.productId === productId && p.verified
      );

      // Check if user has already reviewed this product
      const existingReview = mockReviews.find(r => 
        r.userId === userId && r.productId === productId
      );

      res.json({
        success: true,
        canReview: hasPurchased && !existingReview,
        hasPurchased,
        hasExistingReview: !!existingReview,
        isVerifiedPurchase: hasPurchased
      });
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      res.status(500).json({ error: 'Failed to check review eligibility' });
    }
  });

  // Submit a new review
  app.post('/api/products/:productId/reviews', async (req, res) => {
    try {
      const { productId } = req.params;
      const { rating, title, comment, photoUrl } = req.body;
      const userId = req.headers['user-id'] || '1'; // Mock auth

      // Validate required fields
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Check if user can review this product
      const hasPurchased = mockPurchases.some(p => 
        p.userId === userId && p.productId === productId && p.verified
      );

      if (!hasPurchased) {
        return res.status(403).json({ error: 'You can only review products you have purchased' });
      }

      // Check for existing review
      const existingReview = mockReviews.find(r => 
        r.userId === userId && r.productId === productId
      );

      if (existingReview) {
        return res.status(409).json({ error: 'You have already reviewed this product' });
      }

      // Create new review (in production, this would insert into database)
      const newReview: ReviewWithUser = {
        id: mockReviews.length + 1,
        productId,
        userId,
        orderId: mockPurchases.find(p => p.userId === userId && p.productId === productId)?.orderId || null,
        rating,
        title: title || null,
        comment: comment || null,
        photoUrl: photoUrl || null,
        isVerifiedPurchase: hasPurchased,
        isApproved: true, // Auto-approve for demo
        helpfulCount: 0,
        reportCount: 0,
        createdAt: new Date().toISOString(),
        user: {
          firstName: "Current",
          lastName: "User",
          profileImageUrl: null
        }
      };

      mockReviews.push(newReview);

      res.json({
        success: true,
        review: newReview,
        message: 'Review submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  });

  // Mark review as helpful
  app.post('/api/reviews/:reviewId/helpful', async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { isHelpful } = req.body;
      const userId = req.headers['user-id'] || '1'; // Mock auth

      const review = mockReviews.find(r => r.id === Number(reviewId));
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // In production, this would update the database
      if (isHelpful) {
        review.helpfulCount++;
      }

      res.json({
        success: true,
        helpfulCount: review.helpfulCount,
        message: 'Thank you for your feedback'
      });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      res.status(500).json({ error: 'Failed to update review helpfulness' });
    }
  });

  // Report a review
  app.post('/api/reviews/:reviewId/report', async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { reason, description } = req.body;
      const userId = req.headers['user-id'] || '1'; // Mock auth

      const review = mockReviews.find(r => r.id === Number(reviewId));
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // In production, this would insert into review_flags table
      review.reportCount++;

      res.json({
        success: true,
        message: 'Review reported successfully. Our team will review it shortly.'
      });
    } catch (error) {
      console.error('Error reporting review:', error);
      res.status(500).json({ error: 'Failed to report review' });
    }
  });

  // Admin: Get flagged reviews for moderation
  app.get('/api/admin/flagged-reviews', async (req, res) => {
    try {
      const flaggedReviews = mockReviews.filter(r => r.reportCount > 0 || !r.isApproved);

      res.json({
        success: true,
        flaggedReviews,
        total: flaggedReviews.length
      });
    } catch (error) {
      console.error('Error fetching flagged reviews:', error);
      res.status(500).json({ error: 'Failed to fetch flagged reviews' });
    }
  });

  // Admin: Approve/reject review
  app.post('/api/admin/reviews/:reviewId/moderate', async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { action } = req.body; // 'approve' or 'reject'

      const review = mockReviews.find(r => r.id === Number(reviewId));
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      review.isApproved = action === 'approve';

      res.json({
        success: true,
        message: `Review ${action}d successfully`,
        review
      });
    } catch (error) {
      console.error('Error moderating review:', error);
      res.status(500).json({ error: 'Failed to moderate review' });
    }
  });

  // Get user's reviews
  app.get('/api/users/:userId/reviews', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const userReviews = mockReviews.filter(r => r.userId === userId);

      res.json({
        success: true,
        reviews: userReviews,
        total: userReviews.length
      });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({ error: 'Failed to fetch user reviews' });
    }
  });
}