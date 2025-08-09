import { Router } from 'express';

const router = Router();

// Test Stripe checkout with 4242 card
router.post('/api/stripe/test-checkout', async (req, res) => {
  try {
    const isTestMode = process.env.STRIPE_MODE === 'test';
    const liveSafetyOff = process.env.LIVE_SAFETY_ON !== '1';
    
    if (!isTestMode || !liveSafetyOff) {
      return res.status(400).json({
        error: 'Test checkout only available in test mode with safety on',
        current_mode: process.env.STRIPE_MODE,
        safety_status: process.env.LIVE_SAFETY_ON
      });
    }

    // Mock successful test transaction
    const mockOrderId = `test_order_${Date.now()}`;
    const mockStripePaymentId = `pi_test_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      success: true,
      test_mode: true,
      order_id: mockOrderId,
      stripe_payment_id: mockStripePaymentId,
      amount: 2999, // $29.99 test
      currency: 'usd',
      card_last4: '4242',
      status: 'succeeded',
      created: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Test checkout failed',
      details: error.message
    });
  }
});

// Stripe configuration status
router.get('/api/stripe/status', (req, res) => {
  res.json({
    mode: process.env.STRIPE_MODE || 'not_configured',
    live_safety: process.env.LIVE_SAFETY_ON === '1' ? 'ON' : 'OFF',
    test_keys_present: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY),
    live_keys_present: !!(process.env.STRIPE_LIVE_SECRET_KEY && process.env.STRIPE_LIVE_PUBLISHABLE_KEY)
  });
});

export default router;