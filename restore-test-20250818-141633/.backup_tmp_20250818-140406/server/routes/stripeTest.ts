import express from 'express';
import { testStripePayment, validateStripeConfiguration, runCompletePaymentTest } from '../stripeTest.js';
import { simpleStripeTest, createTestPaymentIntent } from '../stripeSimpleTest.js';

const router = express.Router();

// Test Stripe payment creation
router.post('/test-payment', async (req, res) => {
  try {
    const { amount = 100 } = req.body; // Default $1.00 test
    const result = await testStripePayment(amount);
    
    res.json({
      success: result.success,
      data: result.success ? {
        payment_intent_id: result.paymentIntent?.id,
        client_secret: result.clientSecret,
        amount: amount,
        currency: 'usd',
        status: result.paymentIntent?.status
      } : null,
      error: result.error
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Validate Stripe configuration
router.get('/validate-config', async (req, res) => {
  try {
    const result = await validateStripeConfiguration();
    
    res.json({
      success: result.success,
      configuration: result.configuration,
      ready_for_beta: result.success && result.configuration.has_publishable_key && result.configuration.has_secret_key,
      error: result.error
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Run complete payment system test
router.post('/complete-test', async (req, res) => {
  try {
    const result = await runCompletePaymentTest();
    
    res.json({
      success: result.success,
      test_results: result.results,
      beta_ready: result.success && result.results.configuration?.success && result.results.paymentIntent?.success,
      timestamp: new Date().toISOString(),
      error: result.error
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simple connectivity test
router.get('/simple-test', async (req, res) => {
  try {
    const result = await simpleStripeTest();
    
    res.json({
      success: result.success,
      message: result.message,
      data: result.data,
      error: result.error,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Test execution failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Create test payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const result = await createTestPaymentIntent();
    
    res.json({
      success: result.success,
      payment_intent: result.paymentIntent,
      client_secret: result.clientSecret,
      error: result.error,
      ready_for_frontend: result.success && !!result.clientSecret,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get payment system status for beta program
router.get('/beta-status', async (req, res) => {
  try {
    const hasPublishableKey = !!process.env.STRIPE_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    
    const status = {
      payment_system_ready: hasPublishableKey && hasSecretKey,
      publishable_key_configured: hasPublishableKey,
      secret_key_configured: hasSecretKey,
      next_steps: []
    };
    
    if (!hasPublishableKey) {
      status.next_steps.push('Configure STRIPE_PUBLISHABLE_KEY environment variable');
    }
    
    if (!hasSecretKey) {
      status.next_steps.push('Configure STRIPE_SECRET_KEY environment variable');
    }
    
    if (hasPublishableKey && hasSecretKey) {
      status.next_steps.push('Ready to begin beta testing with live payments');
    }
    
    res.json({
      success: true,
      status,
      ready_for_launch: status.payment_system_ready,
      configuration_complete: status.payment_system_ready
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;