import { Router } from 'express';
import { storage } from '../storage';
import { insertRetailerSchema, type InsertRetailer } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Enhanced retailer onboarding schema with plan selection
const retailerOnboardSchema = insertRetailerSchema.extend({
  plan: z.enum(['free', 'silver', 'gold']),
  mallName: z.string().optional(),
  stripeAccountId: z.string().optional(),
  onboardingStatus: z.enum(['pending', 'info_collected', 'payment_setup', 'completed']).default('pending'),
});

export type RetailerOnboardData = z.infer<typeof retailerOnboardSchema>;

// POST /api/retailer-onboard - Complete retailer onboarding
router.post('/retailer-onboard', async (req, res) => {
  try {
    const { plan, businessName, firstName, lastName, email, phone, address, category, description, zipCode, mallName, stripeAccountId } = req.body;

    // Validate required fields
    if (!plan || !businessName || !email || !phone || !address || !category) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        error: "Missing required fields: plan, businessName, email, phone, address, category" 
      });
    }

    // Validate plan type
    if (!['free', 'silver', 'gold'].includes(plan)) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        error: "Invalid plan. Must be 'free', 'silver', or 'gold'" 
      });
    }

    const retailerData: InsertRetailer = {
      plan,
      businessName,
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      phone,
      address,
      category,
      description: description || '',
      zipCode: zipCode || '',
      mallName: mallName || undefined,
      stripeAccountId: stripeAccountId || undefined,
      onboardingStatus: stripeAccountId ? 'payment_setup' : 'info_collected',
    };

    const newRetailer = await storage.createRetailer(retailerData);

    return res.json({ 
      success: true, 
      data: { 
        id: newRetailer.id,
        plan: newRetailer.plan || 'free',
        onboardingStatus: newRetailer.onboardingStatus || 'pending',
        nextSteps: getNextSteps(newRetailer.plan || 'free', newRetailer.onboardingStatus || 'pending')
      }, 
      error: null 
    });

  } catch (error: any) {
    console.error('Retailer onboarding error:', error);
    return res.status(500).json({ 
      success: false, 
      data: null, 
      error: error?.message || "Onboarding failed" 
    });
  }
});

// GET /api/retailer-onboard/plans - Get available plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0/month',
      features: [
        'Basic listing',
        '1 product',
        'Email support',
        'Basic analytics'
      ],
      recommended: false
    },
    {
      id: 'silver',
      name: 'Silver',
      price: '$29/month',
      features: [
        'Full listing',
        'Up to 50 products',
        'Priority support',
        'Advanced analytics',
        'Marketing tools'
      ],
      recommended: true
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '$99/month',
      features: [
        'Unlimited products',
        'Premium placement',
        'Dedicated support',
        'Custom branding',
        'API access',
        'White-label features'
      ],
      recommended: false
    }
  ];

  res.json({ success: true, data: { plans }, error: null });
});

// POST /api/retailer-onboard/stripe-connect - Setup Stripe Connect
router.post('/stripe-connect', async (req, res) => {
  try {
    const { retailerId, stripeAccountId } = req.body;

    if (!retailerId || !stripeAccountId) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        error: "Retailer ID and Stripe Account ID are required" 
      });
    }

    // In a real implementation, verify the Stripe account
    // For now, we'll update the retailer record
    const updatedRetailer = await storage.updateRetailer(retailerId, {
      stripeAccountId,
      onboardingStatus: 'payment_setup'
    });

    res.json({ 
      success: true, 
      data: { 
        retailerId,
        stripeAccountId,
        onboardingStatus: 'payment_setup',
        nextSteps: ['Upload inventory', 'Complete verification', 'Go live']
      }, 
      error: null 
    });

  } catch (error: any) {
    console.error('Stripe Connect error:', error);
    res.status(500).json({ 
      success: false, 
      data: null, 
      error: error?.message || "Stripe Connect setup failed" 
    });
  }
});

// Helper function to determine next steps
function getNextSteps(plan: string, status: string): string[] {
  const baseSteps = [];
  
  if (status === 'pending') {
    baseSteps.push('Complete business information');
  }
  
  if (status === 'info_collected') {
    baseSteps.push('Setup Stripe Connect for payments');
  }
  
  if (status === 'payment_setup') {
    baseSteps.push('Upload your product inventory');
    baseSteps.push('Complete business verification');
  }
  
  if (plan === 'silver' || plan === 'gold') {
    baseSteps.push('Access advanced marketing tools');
  }
  
  if (plan === 'gold') {
    baseSteps.push('Setup custom branding');
    baseSteps.push('Configure API access');
  }
  
  baseSteps.push('Launch your store on SPIRAL');
  
  return baseSteps;
}

export default router;