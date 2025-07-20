import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cartStore';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: "Product has been removed from your cart.",
    });
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 8.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--spiral-cream)]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 font-['Inter']">Start shopping to add items to your cart.</p>
            <Link href="/products">
              <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-sage)] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
                Continue Shopping
              </Button>
            </Link>
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
            <li><Link href="/products" className="hover:text-[var(--spiral-coral)]">Products</Link></li>
            <li>/</li>
            <li className="text-[var(--spiral-navy)] font-semibold">Shopping Cart</li>
          </ol>
        </nav>

        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" className="mb-4 hover:bg-gray-100 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] font-['Poppins']">Shopping Cart</h1>
          <p className="text-gray-600 mt-2 text-lg font-['Inter']">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-8">
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-6 pb-8 border-b border-gray-200 last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-sm"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--spiral-navy)] text-lg font-['Poppins']">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize mb-2 font-['Inter']">{item.category}</p>
                        <p className="text-lg font-bold text-[var(--spiral-coral)] font-['Inter']">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0 rounded-lg border-gray-300 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="font-medium text-[var(--spiral-navy)] min-w-[2rem] text-center font-['Inter']">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 rounded-lg border-gray-300 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-[var(--spiral-navy)] text-lg font-['Poppins']">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-2 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
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
                  
                  {subtotal < 50 && (
                    <p className="text-sm text-[var(--spiral-coral)] font-['Inter']">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button 
                      size="lg" 
                      className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white h-14 text-lg font-semibold rounded-xl transition-all duration-300"
                      disabled={isCheckingOut}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Link href="/products" className="block">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)] hover:text-white h-12 rounded-xl transition-all duration-300"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center text-sm text-gray-500 font-['Inter']">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;