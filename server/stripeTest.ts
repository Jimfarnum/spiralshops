import Stripe from 'stripe';

// Validate Stripe secret key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  timeout: 10000, // 10 second timeout
});

export async function testStripePayment(amount: number = 100): Promise<{
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
  clientSecret?: string;
}> {
  try {
    console.log('🧪 Testing Stripe payment integration...');
    
    // Create a PaymentIntent for $1.00 test transaction
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      description: 'SPIRAL Beta Test Transaction',
      metadata: {
        platform: 'SPIRAL',
        test_type: 'beta_validation',
        timestamp: new Date().toISOString()
      }
    });

    console.log('✅ Stripe PaymentIntent created successfully:', paymentIntent.id);
    
    return {
      success: true,
      paymentIntent,
      clientSecret: paymentIntent.client_secret
    };
    
  } catch (error: any) {
    console.error('❌ Stripe payment test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function validateStripeConfiguration(): Promise<{
  success: boolean;
  configuration: any;
  error?: string;
}> {
  try {
    console.log('🔍 Validating Stripe configuration...');
    
    // Test simple balance retrieval instead of account (more reliable)
    const balance = await stripe.balance.retrieve();
    
    // Check publishable key availability
    const hasPublishableKey = !!process.env.STRIPE_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    
    const configuration = {
      balance_available: balance.available,
      balance_pending: balance.pending,
      has_publishable_key: hasPublishableKey,
      has_secret_key: hasSecretKey,
      publishable_key_prefix: hasPublishableKey ? 
        process.env.STRIPE_PUBLISHABLE_KEY!.substring(0, 12) + '...' : 
        'Not configured',
      secret_key_prefix: hasSecretKey ?
        process.env.STRIPE_SECRET_KEY!.substring(0, 12) + '...' :
        'Not configured',
      api_connection: 'successful'
    };
    
    console.log('✅ Stripe configuration validated:', configuration);
    
    return {
      success: true,
      configuration
    };
    
  } catch (error: any) {
    console.error('❌ Stripe configuration validation failed:', error.message);
    return {
      success: false,
      configuration: {},
      error: error.message
    };
  }
}

export async function createBetaTestCustomer(email: string, name: string): Promise<{
  success: boolean;
  customer?: Stripe.Customer;
  error?: string;
}> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      description: 'SPIRAL Beta Test Customer',
      metadata: {
        program: 'beta_testing',
        platform: 'SPIRAL',
        created_date: new Date().toISOString()
      }
    });
    
    console.log('✅ Beta test customer created:', customer.id);
    
    return {
      success: true,
      customer
    };
    
  } catch (error: any) {
    console.error('❌ Beta test customer creation failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test the complete payment flow
export async function runCompletePaymentTest(): Promise<{
  success: boolean;
  results: any;
  error?: string;
}> {
  try {
    console.log('🚀 Running complete Stripe payment test...');
    
    const results = {
      configuration: {},
      paymentIntent: {},
      testCustomer: {},
      timestamp: new Date().toISOString()
    };
    
    // 1. Validate configuration
    const configTest = await validateStripeConfiguration();
    results.configuration = configTest;
    
    if (!configTest.success) {
      throw new Error(`Configuration validation failed: ${configTest.error}`);
    }
    
    // 2. Test payment intent creation
    const paymentTest = await testStripePayment(100); // $1.00 test
    results.paymentIntent = paymentTest;
    
    if (!paymentTest.success) {
      throw new Error(`Payment intent creation failed: ${paymentTest.error}`);
    }
    
    // 3. Create test customer
    const customerTest = await createBetaTestCustomer(
      'beta-test@spiralmalls.com',
      'SPIRAL Beta Tester'
    );
    results.testCustomer = customerTest;
    
    if (!customerTest.success) {
      console.warn('⚠️ Customer creation failed, but payment flow still functional');
    }
    
    console.log('✅ Complete payment test successful!');
    
    return {
      success: true,
      results
    };
    
  } catch (error: any) {
    console.error('❌ Complete payment test failed:', error.message);
    return {
      success: false,
      results: {},
      error: error.message
    };
  }
}