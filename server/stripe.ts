import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set, using placeholder');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});

export interface CreatePaymentIntentOptions {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
  automatic_payment_methods?: {
    enabled: boolean;
  };
}

export async function createPaymentIntent(options: CreatePaymentIntentOptions) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: options.amount,
      currency: options.currency,
      customer: options.customerId,
      metadata: options.metadata || {},
      automatic_payment_methods: options.automatic_payment_methods || {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw error;
  }
}

export async function createCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
}

export async function processRefund(paymentIntentId: string, amount?: number) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });

    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}

export async function createCheckoutSession(options: {
  customer_email?: string;
  line_items: Array<{
    price_data?: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    price?: string;
    quantity: number;
  }>;
  mode: 'payment' | 'subscription' | 'setup';
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create(options);
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Webhook signature verification
export function verifyWebhookSignature(payload: string | Buffer, signature: string, endpointSecret: string) {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}