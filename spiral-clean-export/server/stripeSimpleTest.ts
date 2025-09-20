import Stripe from 'stripe';

export async function simpleStripeTest(): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> {
  try {
    console.log('🧪 Running simple Stripe connectivity test...');
    
    // Check environment variables
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasPublishableKey = !!process.env.STRIPE_PUBLISHABLE_KEY;
    
    if (!hasSecretKey) {
      return {
        success: false,
        message: 'Missing Stripe secret key',
        error: 'STRIPE_SECRET_KEY environment variable not configured'
      };
    }
    
    if (!hasPublishableKey) {
      return {
        success: false,
        message: 'Missing Stripe publishable key',
        error: 'STRIPE_PUBLISHABLE_KEY environment variable not configured'
      };
    }
    
    // Initialize Stripe with minimal configuration
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      timeout: 15000,
      maxNetworkRetries: 1
    });
    
    // Test the simplest possible API call
    console.log('📡 Testing Stripe API connection...');
    const paymentMethods = await stripe.paymentMethods.list({
      limit: 1
    });
    
    console.log('✅ Stripe connection successful!');
    
    return {
      success: true,
      message: 'Stripe connection verified successfully',
      data: {
        secret_key_configured: true,
        publishable_key_configured: true,
        api_connection: 'successful',
        test_timestamp: new Date().toISOString(),
        payment_methods_accessible: true
      }
    };
    
  } catch (error: any) {
    console.error('❌ Stripe test failed:', error.message);
    
    return {
      success: false,
      message: 'Stripe connection failed',
      error: error.message,
      data: {
        secret_key_configured: !!process.env.STRIPE_SECRET_KEY,
        publishable_key_configured: !!process.env.STRIPE_PUBLISHABLE_KEY,
        api_connection: 'failed',
        test_timestamp: new Date().toISOString()
      }
    };
  }
}

export async function createTestPaymentIntent(): Promise<{
  success: boolean;
  paymentIntent?: any;
  clientSecret?: string;
  error?: string;
}> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      timeout: 15000,
      maxNetworkRetries: 1
    });
    
    console.log('💳 Creating test PaymentIntent...');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00
      currency: 'usd',
      description: 'SPIRAL Beta Test - $1.00',
      metadata: {
        platform: 'SPIRAL',
        test: 'beta_validation',
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('✅ PaymentIntent created:', paymentIntent.id);
    
    return {
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created
      },
      clientSecret: paymentIntent.client_secret || undefined
    };
    
  } catch (error: any) {
    console.error('❌ PaymentIntent creation failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}