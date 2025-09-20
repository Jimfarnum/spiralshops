import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc, asc } from 'drizzle-orm';
import { storage } from '../storage.js';
import { subscriptions, subscriptionItems, subscriptionOrders, orders, orderItems, spiralTransactions, users } from '../../shared/schema.js';
import { nanoid } from 'nanoid';

const router = Router();

// Validation schemas
const createSubscriptionSchema = z.object({
  userId: z.number(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    storeId: z.number(),
    storeName: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    fulfillmentMethod: z.enum(['ship-to-me', 'in-store-pickup', 'ship-to-mall'])
  })).min(1)
});

const updateSubscriptionSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']).optional(),
  status: z.enum(['active', 'paused', 'cancelled']).optional(),
});

// Helper function to calculate next delivery date
function calculateNextDelivery(frequency: string, lastDelivery?: Date): Date {
  const now = lastDelivery || new Date();
  const nextDelivery = new Date(now);
  
  switch (frequency) {
    case 'weekly':
      nextDelivery.setDate(now.getDate() + 7);
      break;
    case 'biweekly':
      nextDelivery.setDate(now.getDate() + 14);
      break;
    case 'monthly':
      nextDelivery.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      nextDelivery.setMonth(now.getMonth() + 3);
      break;
  }
  
  return nextDelivery;
}

// Helper function to calculate subscription discount and SPIRAL bonus
function calculateSubscriptionBenefits(frequency: string) {
  const benefits = {
    weekly: { discount: 5, spiralMultiplier: 1.5 },
    biweekly: { discount: 8, spiralMultiplier: 1.6 },
    monthly: { discount: 10, spiralMultiplier: 1.7 },
    quarterly: { discount: 15, spiralMultiplier: 2.0 }
  };
  
  return benefits[frequency as keyof typeof benefits] || { discount: 0, spiralMultiplier: 1.0 };
}

// GET /api/subscriptions/user/:userId - Get user's subscriptions
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Mock subscription data for demo purposes
    const userSubscriptions = [
      {
        id: 1,
        userId: userId,
        title: "Weekly Farmers Market Box",
        description: "Fresh local produce delivered every week",
        frequency: "weekly",
        nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
        totalPrice: "39.99",
        discountPercentage: 5,
        spiralBonusMultiplier: "1.5",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];

    // Mock subscription items for demo
    const subscriptionsWithItems = userSubscriptions.map(subscription => ({
      ...subscription,
      items: [
        {
          id: 1,
          subscriptionId: subscription.id,
          productId: "prod-001",
          productName: "Organic Mixed Vegetables",
          storeId: 1,
          storeName: "Green Valley Farm",
          quantity: 1,
          price: "15.99",
          fulfillmentMethod: "ship-to-me"
        },
        {
          id: 2,
          subscriptionId: subscription.id,
          productId: "prod-002",
          productName: "Farm Fresh Eggs",
          storeId: 2,
          storeName: "Sunrise Poultry",
          quantity: 2,
          price: "8.99",
          fulfillmentMethod: "ship-to-me"
        },
        {
          id: 3,
          subscriptionId: subscription.id,
          productId: "prod-003",
          productName: "Artisan Sourdough Bread",
          storeId: 3,
          storeName: "Main Street Bakery",
          quantity: 1,
          price: "6.99",
          fulfillmentMethod: "in-store-pickup"
        }
      ],
      nextDeliveryFormatted: subscription.nextDelivery.toLocaleDateString(),
      savings: `${subscription.discountPercentage}% off + ${subscription.spiralBonusMultiplier}x SPIRAL points`
    }));

    res.json({
      success: true,
      subscriptions: subscriptionsWithItems
    });
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch subscriptions' 
    });
  }
});

// POST /api/subscriptions - Create new subscription
router.post('/', async (req, res) => {
  try {
    const validatedData = createSubscriptionSchema.parse(req.body);
    
    // Calculate total price
    const totalPrice = validatedData.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    // Calculate subscription benefits
    const benefits = calculateSubscriptionBenefits(validatedData.frequency);
    const discountedPrice = totalPrice * (1 - benefits.discount / 100);
    
    // Calculate next delivery
    const nextDelivery = calculateNextDelivery(validatedData.frequency);
    
    // Create subscription
    const [newSubscription] = await db
      .insert(subscriptions)
      .values({
        userId: validatedData.userId,
        title: validatedData.title,
        description: validatedData.description,
        frequency: validatedData.frequency,
        nextDelivery,
        totalPrice: discountedPrice.toFixed(2),
        discountPercentage: benefits.discount,
        spiralBonusMultiplier: benefits.spiralMultiplier.toFixed(2),
        status: 'active'
      })
      .returning();

    // Create subscription items
    const subscriptionItemsData = validatedData.items.map(item => ({
      subscriptionId: newSubscription.id,
      productId: item.productId,
      productName: item.productName,
      storeId: item.storeId,
      storeName: item.storeName,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      fulfillmentMethod: item.fulfillmentMethod
    }));

    await db.insert(subscriptionItems).values(subscriptionItemsData);

    // Award welcome SPIRAL bonus for creating subscription
    const welcomeBonus = Math.floor(totalPrice * 0.1); // 10% of order value as welcome bonus
    await db.insert(spiralTransactions).values({
      userId: validatedData.userId,
      type: 'earned',
      amount: welcomeBonus,
      source: 'subscription_signup',
      description: `Welcome bonus for ${validatedData.title} subscription`,
      multiplier: '1.00'
    });

    res.json({
      success: true,
      subscription: {
        ...newSubscription,
        items: subscriptionItemsData,
        welcomeBonus,
        savings: `${benefits.discount}% discount + ${benefits.spiralMultiplier}x SPIRAL points`,
        nextDeliveryFormatted: nextDelivery.toLocaleDateString()
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription data',
        details: error.errors
      });
    }
    
    console.error('Error creating subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create subscription' 
    });
  }
});

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const validatedData = updateSubscriptionSchema.parse(req.body);
    
    // Check if subscription exists
    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, subscriptionId));
    
    if (!existingSubscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    // Calculate new next delivery if frequency changed
    let updateData: any = { ...validatedData };
    if (validatedData.frequency && validatedData.frequency !== existingSubscription.frequency) {
      updateData.nextDelivery = calculateNextDelivery(validatedData.frequency);
      
      // Update discount and SPIRAL multiplier based on new frequency
      const benefits = calculateSubscriptionBenefits(validatedData.frequency);
      updateData.discountPercentage = benefits.discount;
      updateData.spiralBonusMultiplier = benefits.spiralMultiplier.toFixed(2);
    }

    // Update subscription
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();

    res.json({
      success: true,
      subscription: updatedSubscription,
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: error.errors
      });
    }
    
    console.error('Error updating subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update subscription' 
    });
  }
});

// DELETE /api/subscriptions/:id - Cancel subscription
router.delete('/:id', async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    
    // Update subscription status to cancelled instead of deleting
    const [cancelledSubscription] = await db
      .update(subscriptions)
      .set({ 
        status: 'cancelled', 
        updatedAt: new Date() 
      })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();

    if (!cancelledSubscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: cancelledSubscription
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel subscription' 
    });
  }
});

// POST /api/subscriptions/:id/process - Process subscription order (automated system)
router.post('/:id/process', async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    
    // Get subscription with items
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.id, subscriptionId),
        eq(subscriptions.status, 'active')
      ));

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Active subscription not found'
      });
    }

    // Check if it's time for next delivery
    if (subscription.nextDelivery > new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Not yet time for next delivery',
        nextDelivery: subscription.nextDelivery
      });
    }

    // Get subscription items
    const items = await db
      .select()
      .from(subscriptionItems)
      .where(eq(subscriptionItems.subscriptionId, subscriptionId));

    // Create new order
    const orderNumber = `SUB-${nanoid(8)}`;
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: subscription.userId,
        total: subscription.totalPrice,
        status: 'confirmed',
        spiralsEarned: Math.floor(parseFloat(subscription.totalPrice) * parseFloat(subscription.spiralBonusMultiplier))
      })
      .returning();

    // Create order items
    const orderItemsData = items.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      productName: item.productName,
      productPrice: item.price,
      quantity: item.quantity,
      storeId: item.storeId,
      storeName: item.storeName,
      fulfillmentMethod: item.fulfillmentMethod,
      fulfillmentStatus: 'processing',
      estimatedDelivery: item.fulfillmentMethod === 'ship-to-me' ? 'Ships in 2-3 days' : 'Ready for pickup today'
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Create subscription order record
    await db.insert(subscriptionOrders).values({
      subscriptionId: subscription.id,
      orderId: newOrder.id,
      deliveryDate: new Date(),
      status: 'processed',
      spiralsEarned: newOrder.spiralsEarned
    });

    // Award SPIRAL points
    await db.insert(spiralTransactions).values({
      userId: subscription.userId,
      type: 'earned',
      amount: newOrder.spiralsEarned,
      source: 'subscription_order',
      description: `SPIRAL points for ${subscription.title} delivery`,
      orderId: newOrder.orderNumber,
      multiplier: subscription.spiralBonusMultiplier
    });

    // Update subscription next delivery
    const nextDelivery = calculateNextDelivery(subscription.frequency);
    await db
      .update(subscriptions)
      .set({ 
        nextDelivery, 
        updatedAt: new Date() 
      })
      .where(eq(subscriptions.id, subscriptionId));

    res.json({
      success: true,
      order: newOrder,
      items: orderItemsData,
      spiralsEarned: newOrder.spiralsEarned,
      nextDelivery: nextDelivery.toLocaleDateString(),
      message: 'Subscription order processed successfully'
    });
  } catch (error) {
    console.error('Error processing subscription order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process subscription order' 
    });
  }
});

// GET /api/subscriptions/popular - Get popular subscription templates
router.get('/popular', async (req, res) => {
  try {
    const popularSubscriptions = [
      {
        id: 'farmers-market-weekly',
        title: 'Weekly Farmers Market Box',
        description: 'Fresh local produce delivered every week',
        frequency: 'weekly',
        estimatedPrice: '$35-45',
        discount: '5% off regular prices',
        spiralBonus: '1.5x SPIRAL points',
        items: [
          'Seasonal vegetables (5-7 varieties)',
          'Fresh fruits (3-4 varieties)', 
          'Artisan bread from local bakery',
          'Free-range eggs'
        ],
        stores: ['Green Valley Farm', 'Main Street Bakery', 'Sunrise Eggs']
      },
      {
        id: 'coffee-monthly',
        title: 'Local Coffee Roasters Monthly',
        description: 'Freshly roasted coffee from local artisans',
        frequency: 'monthly',
        estimatedPrice: '$25-35',
        discount: '10% off regular prices',
        spiralBonus: '1.7x SPIRAL points',
        items: [
          '2 bags of freshly roasted coffee',
          'Tasting notes and brewing guide',
          'Local pastry or treat'
        ],
        stores: ['Riverside Roasters', 'Mountain View Coffee', 'Downtown Brew']
      },
      {
        id: 'artisan-quarterly',
        title: 'Local Artisan Quarterly Box',
        description: 'Handcrafted goods from local makers',
        frequency: 'quarterly',
        estimatedPrice: '$60-80',
        discount: '15% off regular prices',
        spiralBonus: '2.0x SPIRAL points',
        items: [
          'Handmade pottery or home goods',
          'Artisan food products',
          'Local art or crafts',
          'Meet the maker stories'
        ],
        stores: ['Craftworks Studio', 'Local Makers Market', 'Heritage Arts']
      },
      {
        id: 'pet-supplies-monthly',
        title: 'Pet Essentials Monthly',
        description: 'Quality pet supplies delivered monthly',
        frequency: 'monthly',
        estimatedPrice: '$40-60',
        discount: '10% off regular prices',
        spiralBonus: '1.7x SPIRAL points',
        items: [
          'Premium pet food',
          'Toys and treats',
          'Health and grooming supplies'
        ],
        stores: ['Happy Paws Pet Store', 'Natural Pet Supplies', 'Companion Care']
      }
    ];

    res.json({
      success: true,
      templates: popularSubscriptions,
      benefits: {
        savings: 'Save 5-15% on every delivery',
        spiralBonus: 'Earn 1.5-2.0x SPIRAL points',
        convenience: 'Never run out of essentials',
        community: 'Support local businesses consistently'
      }
    });
  } catch (error) {
    console.error('Error fetching popular subscriptions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch popular subscriptions' 
    });
  }
});

export default router;