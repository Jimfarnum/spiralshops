import { Express } from 'express';
import { z } from 'zod';

// Mock data for demonstration - replace with actual database calls
let reviews: any[] = [];
let wishlists: Record<string, any[]> = {};

const reviewSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000)
});

const wishlistItemSchema = z.object({
  productName: z.string(),
  productPrice: z.number(),
  productImage: z.string().optional()
});

export function registerEnhancedFeaturesRoutes(app: Express) {
  
  // Get reviews for a product
  app.get('/api/products/:productId/reviews', (req, res) => {
    const { productId } = req.params;
    const productReviews = reviews.filter(r => r.productId === productId);
    res.json(productReviews);
  });

  // Submit a review
  app.post('/api/products/:productId/reviews', (req, res) => {
    try {
      const { productId } = req.params;
      const validation = reviewSchema.parse(req.body);
      
      const newReview = {
        id: Date.now(),
        productId,
        ...validation,
        date: new Date().toISOString(),
        verified: Math.random() > 0.5 // Random verification for demo
      };
      
      reviews.push(newReview);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ error: 'Invalid review data' });
    }
  });

  // Get user's wishlist
  app.get('/api/users/:userId/wishlist', (req, res) => {
    const { userId } = req.params;
    const userWishlist = wishlists[userId] || [];
    res.json(userWishlist);
  });

  // Add item to wishlist
  app.post('/api/users/:userId/wishlist/:productId', (req, res) => {
    try {
      const { userId, productId } = req.params;
      const validation = wishlistItemSchema.parse(req.body);
      
      if (!wishlists[userId]) {
        wishlists[userId] = [];
      }
      
      // Check if item already exists
      const existingIndex = wishlists[userId].findIndex(item => item.id === productId);
      if (existingIndex >= 0) {
        return res.status(400).json({ error: 'Item already in wishlist' });
      }
      
      const wishlistItem = {
        id: productId,
        ...validation,
        addedAt: new Date().toISOString()
      };
      
      wishlists[userId].push(wishlistItem);
      res.status(201).json(wishlistItem);
    } catch (error) {
      res.status(400).json({ error: 'Invalid wishlist item data' });
    }
  });

  // Remove item from wishlist
  app.delete('/api/users/:userId/wishlist/:productId', (req, res) => {
    const { userId, productId } = req.params;
    
    if (!wishlists[userId]) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    
    const initialLength = wishlists[userId].length;
    wishlists[userId] = wishlists[userId].filter(item => item.id !== productId);
    
    if (wishlists[userId].length === initialLength) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }
    
    res.json({ message: 'Item removed from wishlist' });
  });

  // SPIRAL Plus membership endpoints
  app.get('/api/membership/spiral-plus/:userId', (req, res) => {
    const { userId } = req.params;
    // Mock membership status - replace with actual database lookup
    res.json({
      userId,
      isPlusMember: Math.random() > 0.7, // Random for demo
      memberSince: '2024-01-15',
      benefits: [
        'Free same-day delivery',
        'Double SPIRAL points',
        'Exclusive local deals',
        'Priority support'
      ]
    });
  });

  app.post('/api/membership/spiral-plus/subscribe', (req, res) => {
    const { userId, paymentMethod } = req.body;
    
    // Mock subscription process
    res.json({
      success: true,
      subscriptionId: `sub_${Date.now()}`,
      message: 'Successfully subscribed to SPIRAL Plus',
      trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  });
}