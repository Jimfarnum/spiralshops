import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
    
    // Test account retrieval
    const account = await stripe.accounts.retrieve();
    
    // Check publishable key availability
    const hasPublishableKey = !!process.env.STRIPE_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    
    const configuration = {
      account_id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      has_publishable_key: hasPublishableKey,
      has_secret_key: hasSecretKey,
      publishable_key_prefix: hasPublishableKey ? 
        process.env.STRIPE_PUBLISHABLE_KEY!.substring(0, 12) + '...' : 
        'Not configured',
      country: account.country,
      default_currency: account.default_currency,
      business_type: account.business_type
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