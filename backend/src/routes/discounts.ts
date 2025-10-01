import express from 'express';
import { z } from 'zod';
import { getDiscountTier, getAllTiers, calculateDiscountAmount, getTierBenefits } from '../lib/discountTiers.js';

const router = express.Router();

// Validation schemas
const DiscountSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y']),
  value: z.number().min(0),
  description: z.string().min(1),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  usageLimit: z.number().min(1).optional(),
  usagePerCustomer: z.number().min(1).optional(),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  excludedProducts: z.array(z.string()).optional(),
  isActive: z.boolean().default(true)
});

const ApplyDiscountSchema = z.object({
  code: z.string(),
  orderTotal: z.number().min(0),
  customerId: z.string().optional(),
  products: z.array(z.object({
    id: z.string(),
    price: z.number().min(0),
    quantity: z.number().min(1),
    categoryId: z.string().optional()
  }))
});

const VolumeDiscountSchema = z.object({
  volumeAnnualUSD: z.number().min(0),
  baseAmount: z.number().min(0).optional()
});

// Mock data - replace with actual database
const discounts: any[] = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: 'Welcome discount for new customers',
    minimumOrderAmount: 25,
    maximumDiscount: 50,
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    usageLimit: 1000,
    usagePerCustomer: 1,
    usedCount: 45,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    description: 'Free shipping on orders over $50',
    minimumOrderAmount: 50,
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    usageLimit: 5000,
    usedCount: 234,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'SPIRAL25',
    type: 'fixed_amount',
    value: 25,
    description: 'SPIRAL loyalty member discount',
    minimumOrderAmount: 100,
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    usedCount: 67,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
];

const discountUsage = new Map<string, number>(); // Track usage per customer

// GET /api/discounts
router.get('/', (req, res) => {
  try {
    const { active, code } = req.query;
    
    let filteredDiscounts = discounts;
    
    if (active !== undefined) {
      filteredDiscounts = filteredDiscounts.filter(d => d.isActive === (active === 'true'));
    }
    
    if (code) {
      filteredDiscounts = filteredDiscounts.filter(d => 
        d.code.toLowerCase().includes((code as string).toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: filteredDiscounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discounts'
    });
  }
});

// POST /api/discounts
router.post('/', (req, res) => {
  try {
    const validatedData = DiscountSchema.parse(req.body);
    
    // Check if code already exists
    const existingDiscount = discounts.find(d => d.code === validatedData.code);
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        error: 'Discount code already exists'
      });
    }
    
    const newDiscount = {
      id: `${Date.now()}`,
      ...validatedData,
      usedCount: 0,
      createdAt: new Date().toISOString()
    };
    
    discounts.push(newDiscount);
    
    res.status(201).json({
      success: true,
      data: newDiscount
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create discount'
    });
  }
});

// POST /api/discounts/apply
router.post('/apply', (req, res) => {
  try {
    const validatedData = ApplyDiscountSchema.parse(req.body);
    const { code, orderTotal, customerId, products } = validatedData;
    
    // Find discount
    const discount = discounts.find(d => d.code === code.toUpperCase() && d.isActive);
    if (!discount) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired discount code'
      });
    }
    
    // Check date validity
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    
    if (now < startDate || now > endDate) {
      return res.status(400).json({
        success: false,
        error: 'Discount code is not valid at this time'
      });
    }
    
    // Check usage limits
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({
        success: false,
        error: 'Discount code usage limit exceeded'
      });
    }
    
    // Check per-customer usage
    if (customerId && discount.usagePerCustomer) {
      const customerUsage = discountUsage.get(`${discount.id}_${customerId}`) || 0;
      if (customerUsage >= discount.usagePerCustomer) {
        return res.status(400).json({
          success: false,
          error: 'You have already used this discount code'
        });
      }
    }
    
    // Check minimum order amount
    if (discount.minimumOrderAmount && orderTotal < discount.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of $${discount.minimumOrderAmount} required`
      });
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    let freeShipping = false;
    
    switch (discount.type) {
      case 'percentage':
        discountAmount = (orderTotal * discount.value) / 100;
        if (discount.maximumDiscount) {
          discountAmount = Math.min(discountAmount, discount.maximumDiscount);
        }
        break;
        
      case 'fixed_amount':
        discountAmount = Math.min(discount.value, orderTotal);
        break;
        
      case 'free_shipping':
        freeShipping = true;
        discountAmount = 0; // Shipping discount handled separately
        break;
        
      case 'buy_x_get_y':
        // Simplified buy X get Y logic
        const eligibleProducts = products.filter(p => 
          !discount.excludedProducts?.includes(p.id) &&
          (!discount.applicableProducts?.length || discount.applicableProducts.includes(p.id))
        );
        
        if (eligibleProducts.length >= 2) {
          // Get cheapest product free
          const cheapestProduct = eligibleProducts.reduce((min, p) => 
            p.price < min.price ? p : min
          );
          discountAmount = cheapestProduct.price;
        }
        break;
    }
    
    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;
    
    res.json({
      success: true,
      data: {
        discountId: discount.id,
        code: discount.code,
        description: discount.description,
        type: discount.type,
        discountAmount,
        freeShipping,
        finalTotal: Math.max(0, orderTotal - discountAmount),
        applied: true
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to apply discount'
    });
  }
});

// POST /api/discounts/confirm-usage
router.post('/confirm-usage', (req, res) => {
  try {
    const { discountId, customerId } = req.body;
    
    const discount = discounts.find(d => d.id === discountId);
    if (!discount) {
      return res.status(404).json({
        success: false,
        error: 'Discount not found'
      });
    }
    
    // Increment usage count
    discount.usedCount++;
    
    // Track customer usage
    if (customerId) {
      const usageKey = `${discountId}_${customerId}`;
      const currentUsage = discountUsage.get(usageKey) || 0;
      discountUsage.set(usageKey, currentUsage + 1);
    }
    
    res.json({
      success: true,
      message: 'Discount usage confirmed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to confirm discount usage'
    });
  }
});

// PUT /api/discounts/:id
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = DiscountSchema.parse(req.body);
    
    const discountIndex = discounts.findIndex(d => d.id === id);
    if (discountIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Discount not found'
      });
    }
    
    // Check if new code conflicts with existing codes (except current one)
    const existingDiscount = discounts.find(d => d.code === validatedData.code && d.id !== id);
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        error: 'Discount code already exists'
      });
    }
    
    const updatedDiscount = {
      ...discounts[discountIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    discounts[discountIndex] = updatedDiscount;
    
    res.json({
      success: true,
      data: updatedDiscount
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update discount'
    });
  }
});

// DELETE /api/discounts/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const discountIndex = discounts.findIndex(d => d.id === id);
    if (discountIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Discount not found'
      });
    }
    
    discounts.splice(discountIndex, 1);
    
    res.json({
      success: true,
      message: 'Discount deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete discount'
    });
  }
});

// GET /api/discounts/analytics
router.get('/analytics', (req, res) => {
  try {
    const analytics = {
      totalDiscounts: discounts.length,
      activeDiscounts: discounts.filter(d => d.isActive).length,
      totalUsage: discounts.reduce((sum, d) => sum + d.usedCount, 0),
      topPerformingCodes: discounts
        .sort((a, b) => b.usedCount - a.usedCount)
        .slice(0, 5)
        .map(d => ({
          code: d.code,
          usageCount: d.usedCount,
          type: d.type
        }))
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discount analytics'
    });
  }
});

// GET /api/discounts/tiers - Get all volume discount tiers
router.get('/tiers', (req, res) => {
  try {
    const tiers = getAllTiers();
    
    res.json({
      success: true,
      data: {
        tiers,
        description: 'Volume-based discount tiers for partner retailers'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discount tiers'
    });
  }
});

// POST /api/discounts/calculate-tier - Calculate tier and discount for given volume
router.post('/calculate-tier', (req, res) => {
  try {
    const validatedData = VolumeDiscountSchema.parse(req.body);
    const { volumeAnnualUSD, baseAmount } = validatedData;
    
    const tierInfo = getDiscountTier(volumeAnnualUSD);
    const benefits = getTierBenefits(tierInfo.tier);
    
    let discountAmount = 0;
    if (baseAmount) {
      discountAmount = calculateDiscountAmount(baseAmount, volumeAnnualUSD);
    }
    
    res.json({
      success: true,
      data: {
        volumeAnnualUSD,
        tierInfo,
        benefits,
        ...(baseAmount && {
          baseAmount,
          discountAmount,
          finalAmount: baseAmount - discountAmount
        })
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to calculate tier discount'
    });
  }
});

// GET /api/discounts/tier/:tier/benefits - Get benefits for specific tier
router.get('/tier/:tier/benefits', (req, res) => {
  try {
    const tier = parseInt(req.params.tier);
    
    if (isNaN(tier) || tier < 1 || tier > 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tier number. Must be 1, 2, or 3.'
      });
    }
    
    const benefits = getTierBenefits(tier);
    
    res.json({
      success: true,
      data: {
        tier,
        benefits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tier benefits'
    });
  }
});

export default router;