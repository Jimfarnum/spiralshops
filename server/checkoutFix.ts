// SPIRAL One-Click Checkout - Advanced Payment Processing Solution
import type { Express } from "express";
import Stripe from "stripe";

// Initialize Stripe with fallback for missing secret key
const stripeClient = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' })
  : null;

// In-memory storage for saved payment methods (in production, use database)
const savedPaymentMethods = new Map();
const savedAddresses = new Map();
const userProfiles = new Map();

export function registerCheckoutFixRoutes(app: Express) {
  // Enhanced payment intent creation with proper error handling
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      console.log('🔄 Processing payment intent request:', req.body);
      
      const { amount, currency = "usd", metadata = {} } = req.body;
      
      if (!amount || amount <= 0) {
        console.error('❌ Invalid amount:', amount);
        return res.status(400).json({ 
          success: false, 
          error: "Valid amount is required" 
        });
      }

      // Check if Stripe is properly configured
      if (!stripeClient) {
        console.warn('⚠️ Stripe not configured, using mock response');
        // Mock response for development
        return res.json({
          success: true,
          clientSecret: `pi_mock_${Date.now()}_secret_mock`,
          paymentIntentId: `pi_mock_${Date.now()}`,
          message: "Mock payment intent created (Stripe not configured)",
          amount: amount,
          currency: currency
        });
      }

      // Create real payment intent
      const paymentIntentData = {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          ...metadata,
          platform: "SPIRAL",
          timestamp: new Date().toISOString(),
          source: "checkout"
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      console.log('💳 Creating Stripe payment intent:', paymentIntentData);
      
      const paymentIntent = await stripeClient.paymentIntents.create(paymentIntentData);

      console.log('✅ Payment intent created successfully:', paymentIntent.id);

      res.json({ 
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        currency: currency
      });

    } catch (error: any) {
      console.error('❌ Payment intent creation error:', error);
      
      // Enhanced error response
      res.status(500).json({ 
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? `Payment processing error: ${error.message}` 
          : "Error creating payment intent. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Enhanced payment confirmation endpoint
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          error: "Payment intent ID is required"
        });
      }

      // Mock confirmation for development without Stripe
      if (!stripeClient) {
        return res.json({
          success: true,
          paymentStatus: "succeeded",
          paymentIntentId,
          message: "Mock payment confirmed (Stripe not configured)"
        });
      }

      const paymentIntent = await stripeClient.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      res.json({
        success: true,
        paymentStatus: paymentIntent.status,
        paymentIntentId: paymentIntent.id
      });

    } catch (error: any) {
      console.error('❌ Payment confirmation error:', error);
      res.status(500).json({
        success: false,
        error: "Error confirming payment: " + error.message
      });
    }
  });

  // Payment status check endpoint
  app.get("/api/payment-status/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      if (!stripeClient) {
        return res.json({
          success: true,
          status: "succeeded",
          paymentIntentId,
          message: "Mock payment status (Stripe not configured)"
        });
      }

      const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        success: true,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      });

    } catch (error: any) {
      console.error('❌ Payment status check error:', error);
      res.status(500).json({
        success: false,
        error: "Error checking payment status: " + error.message
      });
    }
  });

  // Save payment method for future one-click purchases
  app.post("/api/save-payment-method", async (req, res) => {
    try {
      const { userId, paymentMethodId, isDefault = false } = req.body;
      
      if (!userId || !paymentMethodId) {
        return res.status(400).json({
          success: false,
          error: "User ID and payment method ID are required"
        });
      }

      if (!stripeClient) {
        // Mock response for development
        return res.json({
          success: true,
          message: "Mock payment method saved (Stripe not configured)",
          paymentMethodId
        });
      }

      // Retrieve payment method from Stripe to validate
      const paymentMethod = await stripeClient.paymentMethods.retrieve(paymentMethodId);
      
      // Get user's existing payment methods
      const userMethods = savedPaymentMethods.get(userId) || [];
      
      // If this is set as default, remove default from others
      if (isDefault) {
        userMethods.forEach((method: any) => method.isDefault = false);
      }
      
      // Add new payment method
      const savedMethod = {
        id: paymentMethodId,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        } : null,
        isDefault,
        savedAt: new Date().toISOString()
      };
      
      userMethods.push(savedMethod);
      savedPaymentMethods.set(userId, userMethods);
      
      res.json({
        success: true,
        paymentMethod: savedMethod,
        message: "Payment method saved successfully"
      });
      
    } catch (error: any) {
      console.error('❌ Save payment method error:', error);
      res.status(500).json({
        success: false,
        error: "Error saving payment method: " + error.message
      });
    }
  });

  // Get user's saved payment methods
  app.get("/api/saved-payment-methods/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userMethods = savedPaymentMethods.get(userId) || [];
      
      res.json({
        success: true,
        paymentMethods: userMethods
      });
      
    } catch (error: any) {
      console.error('❌ Get payment methods error:', error);
      res.status(500).json({
        success: false,
        error: "Error retrieving payment methods: " + error.message
      });
    }
  });

  // Save shipping address
  app.post("/api/save-address", async (req, res) => {
    try {
      const { userId, address, isDefault = false } = req.body;
      
      if (!userId || !address) {
        return res.status(400).json({
          success: false,
          error: "User ID and address are required"
        });
      }

      // Get user's existing addresses
      const userAddresses = savedAddresses.get(userId) || [];
      
      // If this is set as default, remove default from others
      if (isDefault) {
        userAddresses.forEach((addr: any) => addr.isDefault = false);
      }
      
      // Add new address
      const savedAddress = {
        id: `addr_${Date.now()}`,
        ...address,
        isDefault,
        savedAt: new Date().toISOString()
      };
      
      userAddresses.push(savedAddress);
      savedAddresses.set(userId, userAddresses);
      
      res.json({
        success: true,
        address: savedAddress,
        message: "Address saved successfully"
      });
      
    } catch (error: any) {
      console.error('❌ Save address error:', error);
      res.status(500).json({
        success: false,
        error: "Error saving address: " + error.message
      });
    }
  });

  // Get user's saved addresses
  app.get("/api/saved-addresses/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userAddresses = savedAddresses.get(userId) || [];
      
      res.json({
        success: true,
        addresses: userAddresses
      });
      
    } catch (error: any) {
      console.error('❌ Get addresses error:', error);
      res.status(500).json({
        success: false,
        error: "Error retrieving addresses: " + error.message
      });
    }
  });

  // One-Click Checkout - Process instant payment
  app.post("/api/one-click-checkout", async (req, res) => {
    try {
      const { userId, cartItems, paymentMethodId, addressId, shippingOption = 'standard' } = req.body;
      
      if (!userId || !cartItems || !paymentMethodId || !addressId) {
        return res.status(400).json({
          success: false,
          error: "Missing required checkout information"
        });
      }

      // Calculate total
      const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const shippingCost = shippingOption === 'express' ? 9.99 : shippingOption === 'overnight' ? 19.99 : 0;
      const tax = subtotal * 0.0875; // 8.75% tax
      const total = subtotal + shippingCost + tax;
      const totalCents = Math.round(total * 100);

      if (!stripeClient) {
        // Mock response for development
        const mockOrderId = `order_${Date.now()}`;
        
        res.json({
          success: true,
          orderId: mockOrderId,
          paymentStatus: "succeeded",
          amount: total,
          processingTime: "< 2 seconds",
          message: "Mock one-click checkout completed (Stripe not configured)",
          spiralsEarned: Math.round(total * 20) // 20 spirals per dollar
        });
        
        return;
      }

      // Get saved payment method and address
      const userMethods = savedPaymentMethods.get(userId) || [];
      const userAddresses = savedAddresses.get(userId) || [];
      
      const paymentMethod = userMethods.find((m: any) => m.id === paymentMethodId);
      const shippingAddress = userAddresses.find((a: any) => a.id === addressId);
      
      if (!paymentMethod || !shippingAddress) {
        return res.status(400).json({
          success: false,
          error: "Saved payment method or address not found"
        });
      }

      // Create and confirm payment intent in one step
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: totalCents,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        metadata: {
          userId,
          orderType: 'one_click_checkout',
          itemCount: cartItems.length.toString(),
          platform: 'SPIRAL'
        },
        shipping: {
          name: shippingAddress.name,
          address: {
            line1: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zip,
            country: 'US'
          }
        },
        return_url: `${req.get('origin')}/payment-success`
      });

      const orderId = `order_${Date.now()}_${userId}`;
      const spiralsEarned = Math.round(total * 20); // 20 spirals per dollar

      res.json({
        success: true,
        orderId,
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
        amount: total,
        subtotal,
        shipping: shippingCost,
        tax,
        processingTime: "< 2 seconds",
        spiralsEarned,
        shippingAddress,
        estimatedDelivery: getEstimatedDelivery(shippingOption)
      });
      
    } catch (error: any) {
      console.error('❌ One-click checkout error:', error);
      
      // Handle specific Stripe errors
      if (error.type === 'StripeCardError') {
        return res.status(400).json({
          success: false,
          error: "Payment failed: " + error.message,
          code: error.code
        });
      }
      
      res.status(500).json({
        success: false,
        error: "Checkout failed: " + error.message
      });
    }
  });

  // Helper function for delivery estimates
  function getEstimatedDelivery(shippingOption: string): string {
    const today = new Date();
    let deliveryDate: Date;
    
    switch (shippingOption) {
      case 'overnight':
        deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 1);
        break;
      case 'express':
        deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 2);
        break;
      default: // standard
        deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 5);
        break;
    }
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }

  console.log('✅ One-Click Checkout routes registered successfully');
  console.log('🚀 Advanced payment processing with saved methods enabled');
}