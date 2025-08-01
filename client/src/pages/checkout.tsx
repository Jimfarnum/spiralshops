import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { ArrowLeft, CreditCard, Shield, CheckCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SocialSharingEngine from '@/components/social-sharing-engine';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SplitShipping from '@/components/split-shipping';
import SocialShare from '@/components/social-share';
import PaymentForm from '@/components/payment-form';

const Checkout = () => {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { calculateSpiralsEarned, addTransaction } = useLoyaltyStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fulfillmentMethod: 'ship-to-me',
    itemFulfillmentMethods: {} as Record<string, string>,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    selectedMall: '',
    selectedStore: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = subtotal + tax + shipping;
  
  // Calculate SPIRALs earned based on fulfillment method
  const spiralsSource = formData.fulfillmentMethod === 'in-store-pickup' ? 'in_person_purchase' : 'online_purchase';
  const spiralsEarned = calculateSpiralsEarned(total, spiralsSource);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">Please Sign In</h1>
            <p className="text-gray-600 mb-8 font-['Inter']">You need to be logged in to proceed with checkout.</p>
            <Link href="/login">
              <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-8 py-3 rounded-xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 font-['Inter']">Add some items to your cart before checking out.</p>
            <Link href="/products">
              <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-8 py-3 rounded-xl">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Conditional validation based on fulfillment method
    if (formData.fulfillmentMethod === 'ship-to-me') {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    } else if (formData.fulfillmentMethod === 'ship-to-mall') {
      if (!formData.selectedMall.trim()) newErrors.selectedMall = 'Please select a mall';
    }
    
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!formData.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Card number validation (basic length check)
    if (formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOrderProcessing = async () => {
    try {
      // Generate order number
      const newOrderNumber = 'SPR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Add SPIRAL transaction
      addTransaction({
        amount: total,
        type: "earned",
        description: `Order ${newOrderNumber}`,
        spiralsEarned
      });

      // Clear cart
      clearCart();
      
      // Set order completion
      setOrderNumber(newOrderNumber);
      setOrderComplete(true);

      toast({
        title: "Order Placed Successfully!",
        description: `Order ${newOrderNumber} has been placed. You earned ${spiralsEarned} SPIRALs!`,
      });

      // Navigate to confirmation page after delay
      setTimeout(() => {
        setLocation(`/order-confirmation/${newOrderNumber}`);
      }, 2000);

    } catch (error) {
      console.error('Order processing error:', error);
      toast({
        title: "Order Processing Failed",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    handleOrderProcessing();
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    toast({
      title: "Payment Failed",
      description: "There was an issue processing your payment. Please try again.",
      variant: "destructive"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate order number
      const newOrderNumber = 'SPR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setOrderNumber(newOrderNumber);

      // Add SPIRALs earned to user's account
      if (spiralsEarned > 0) {
        addTransaction({
          type: 'earned',
          amount: spiralsEarned,
          source: spiralsSource,
          description: `Earned from order ${newOrderNumber}`,
          orderId: newOrderNumber,
        });
      }

      // Clear cart and show success
      clearCart();
      setOrderComplete(true);

      toast({
        title: "Order placed successfully!",
        description: `Your order #${newOrderNumber} has been confirmed. You earned ${spiralsEarned} SPIRALs!`,
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Order success page
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-2 font-['Inter']">Thank you for your purchase</p>
            <p className="text-lg text-[var(--spiral-coral)] font-semibold mb-4 font-['Inter']">Order #{orderNumber}</p>
            
            {/* SPIRALs Earned Display */}
            <div className="bg-gradient-to-r from-[var(--spiral-sage)]/20 to-[var(--spiral-coral)]/20 rounded-xl p-6 mb-8 max-w-md mx-auto border border-[var(--spiral-sage)]/30">
              <div className="text-center">
                <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-3 font-['Poppins']">
                  🎉 SPIRALs Earned!
                </h3>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <span className="text-3xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                    {spiralsEarned} SPIRALs
                  </span>
                </div>
                <p className="text-sm text-[var(--spiral-navy)] font-['Inter'] mb-2">
                  Added to your loyalty account
                </p>
                <p className="text-xs text-gray-600 font-['Inter']">
                  Use them at any SPIRAL network store for exclusive discounts and rewards
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto mb-8">
              <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4 font-['Poppins']">What's Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-gray-600 font-['Inter']">
                  <Package className="h-5 w-5 mr-3 text-[var(--spiral-coral)]" />
                  You'll receive an email confirmation shortly
                </div>
                <div className="flex items-center text-gray-600 font-['Inter']">
                  <Package className="h-5 w-5 mr-3 text-[var(--spiral-coral)]" />
                  Your order will be processed within 1-2 business days
                </div>
                <div className="flex items-center text-gray-600 font-['Inter']">
                  <Package className="h-5 w-5 mr-3 text-[var(--spiral-coral)]" />
                  Track your order status in your account
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center">
              <SocialShare 
                context="order" 
                orderNumber={orderNumber}
              />
              <Link href="/products">
                <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-8 py-3 rounded-xl">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/spirals">
                <Button variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white px-8 py-3 rounded-xl">
                  View SPIRALs
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 font-['Inter']">
            <li><Link href="/" className="hover:text-[var(--spiral-coral)]">Home</Link></li>
            <li>/</li>
            <li><Link href="/cart" className="hover:text-[var(--spiral-coral)]">Cart</Link></li>
            <li>/</li>
            <li className="text-[var(--spiral-navy)] font-semibold">Checkout</li>
          </ol>
        </nav>

        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mb-4 hover:bg-gray-100 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] font-['Poppins']">Checkout</h1>
          <p className="text-gray-600 mt-2 text-lg font-['Inter']">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 font-['Inter']">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`mt-1 rounded-lg ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 font-['Inter']">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`mt-1 rounded-lg ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-['Inter']">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`mt-1 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 font-['Inter']">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`mt-1 rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Fulfillment Method */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">Fulfillment Method</h2>
                
                {/* Split Shipping Component */}
                <SplitShipping 
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4 font-['Poppins']">Default Method for New Items</h3>
                  <div className="mb-6">
                  <Label htmlFor="fulfillmentMethod" className="text-sm font-medium text-gray-700 font-['Inter']">How would you like to receive your order? *</Label>
                  <Select value={formData.fulfillmentMethod} onValueChange={(value) => handleInputChange('fulfillmentMethod', value)}>
                    <SelectTrigger className="mt-1 rounded-lg">
                      <SelectValue placeholder="Choose fulfillment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ship-to-me">Ship to Me</SelectItem>
                      <SelectItem value="in-store-pickup">In-Store Pickup</SelectItem>
                      <SelectItem value="ship-to-mall">Ship to Mall for Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>

                {/* Conditional fields based on fulfillment method */}
                {formData.fulfillmentMethod === 'ship-to-me' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700 font-['Inter']">Street Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={`mt-1 rounded-lg ${errors.address ? 'border-red-500' : ''}`}
                          placeholder="Enter your street address"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-sm font-medium text-gray-700 font-['Inter']">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={`mt-1 rounded-lg ${errors.city ? 'border-red-500' : ''}`}
                            placeholder="City"
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.city}</p>}
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-sm font-medium text-gray-700 font-['Inter']">State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className={`mt-1 rounded-lg ${errors.state ? 'border-red-500' : ''}`}
                            placeholder="State"
                          />
                          {errors.state && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.state}</p>}
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700 font-['Inter']">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                            className={`mt-1 rounded-lg ${errors.zipCode ? 'border-red-500' : ''}`}
                            placeholder="ZIP"
                          />
                          {errors.zipCode && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.zipCode}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formData.fulfillmentMethod === 'ship-to-mall' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">Select Mall Location</h3>
                    <div>
                      <Label htmlFor="selectedMall" className="text-sm font-medium text-gray-700 font-['Inter']">Mall Location *</Label>
                      <Select value={formData.selectedMall} onValueChange={(value) => handleInputChange('selectedMall', value)}>
                        <SelectTrigger className={`mt-1 rounded-lg ${errors.selectedMall ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Choose a mall" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="westfield-valley">Westfield Valley Fair</SelectItem>
                          <SelectItem value="santana-row">Santana Row</SelectItem>
                          <SelectItem value="hillsdale-mall">Hillsdale Mall</SelectItem>
                          <SelectItem value="stanford-shopping">Stanford Shopping Center</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.selectedMall && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.selectedMall}</p>}
                    </div>
                    <div className="bg-[var(--spiral-sage)]/20 rounded-lg p-4 border border-[var(--spiral-sage)]/30">
                      <p className="text-sm text-[var(--spiral-navy)] font-['Inter']">
                        <strong>Ship to Mall Benefits:</strong> Free shipping, secure pickup, earn extra SPIRALs, and combine with other mall purchases!
                      </p>
                    </div>
                  </div>
                )}

                {formData.fulfillmentMethod === 'in-store-pickup' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">In-Store Pickup</h3>
                    <div className="bg-[var(--spiral-coral)]/20 rounded-lg p-4 border border-[var(--spiral-coral)]/30">
                      <p className="text-sm text-[var(--spiral-navy)] font-['Inter'] mb-2">
                        <strong>Ready for pickup in 2-4 hours!</strong>
                      </p>
                      <p className="text-sm text-gray-600 font-['Inter']">
                        We'll send you a notification when your order is ready. Show your order confirmation at the store to collect your items.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 font-['Inter']">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className={`mt-1 rounded-lg ${errors.cardNumber ? 'border-red-500' : ''}`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 font-['Inter']">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className={`mt-1 rounded-lg ${errors.expiryDate ? 'border-red-500' : ''}`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-medium text-gray-700 font-['Inter']">CVV *</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className={`mt-1 rounded-lg ${errors.cvv ? 'border-red-500' : ''}`}
                        placeholder="123"
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.cvv}</p>}
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard" className="text-sm font-medium text-gray-700 font-['Inter']">Name on Card *</Label>
                      <Input
                        id="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                        className={`mt-1 rounded-lg ${errors.nameOnCard ? 'border-red-500' : ''}`}
                        placeholder="Full name"
                      />
                      {errors.nameOnCard && <p className="text-red-500 text-sm mt-1 font-['Inter']">{errors.nameOnCard}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">Order Summary</h2>
                  
                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--spiral-navy)] text-sm font-['Poppins']">{item.name}</h4>
                          <p className="text-xs text-gray-500 font-['Inter']">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-[var(--spiral-navy)] font-['Inter']">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 font-['Inter']">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-['Inter']">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-['Inter']">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* SPIRAL Earnings */}
                  {spiralsEarned > 0 && (
                    <div className="bg-gradient-to-r from-[var(--spiral-sage)]/20 to-[var(--spiral-coral)]/20 rounded-xl p-4 mb-6 border border-[var(--spiral-sage)]/30">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                          🎉 You'll Earn SPIRALs!
                        </h3>
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <span className="text-2xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                            {spiralsEarned} SPIRALs
                          </span>
                        </div>
                        <p className="text-sm text-[var(--spiral-navy)] font-['Inter']">
                          {formData.fulfillmentMethod === 'in-store-pickup' 
                            ? "Extra SPIRALs for shopping in-person!"
                            : "Redeem for double value in local stores!"
                          }
                        </p>
                        {formData.fulfillmentMethod !== 'in-store-pickup' && (
                          <p className="text-xs text-gray-600 mt-1 font-['Inter']">
                            Worth ${(spiralsEarned * 2 * 0.20).toFixed(2)} when redeemed in-store
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white h-14 text-lg font-semibold rounded-xl transition-all duration-300"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3 font-['Inter']">Share your SPIRAL purchase and earn 5 bonus points!</p>
                      <SocialSharingEngine
                        type="checkout"
                        title="I just shopped local with SPIRAL!"
                        description={`Just completed a purchase earning ${spiralsEarned} SPIRALs! Supporting local businesses feels amazing.`}
                        spiralEarnings={spiralsEarned}
                        showEarningsPreview={true}
                      />
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-500 font-['Inter']">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Secure SSL encrypted checkout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;