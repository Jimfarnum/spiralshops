import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, User, LogOut, Package, Star, Wallet } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import SpiralBalance from "./spiral-balance";
import MobileNav from "./mobile-nav";
import MobileHeader from "./MobileHeader";
import LanguageSelector from "./language-selector";
import AccessibilityToggle from "./accessibility-toggle";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const cartItemCount = getTotalItems();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      duration: 2000,
    });
  };

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img 
              src="/spiral-blue.svg" 
              alt="SPIRAL Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[var(--spiral-navy)] leading-none">SPIRAL</span>
              <span className="text-xs text-gray-500 leading-none hidden sm:block">Everything Local. Just for You.</span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              Discover
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              Products
            </Link>
            <Link to="/malls" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              Malls
            </Link>
            <Link to="/subscriptions" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              Subscriptions
            </Link>
            <Link to="/spiral-centers" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              SPIRAL Centers
            </Link>
            <Link to="/advanced-logistics" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              Advanced Logistics
            </Link>
            <div className="relative group">
              <button className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
                AI Retailers ↓
              </button>
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 space-y-1">
                  <Link to="/ai-retailer-signup" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🤖 AI Retailer Signup
                  </Link>
                  <Link to="/admin/retailer-applications" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    👥 Admin Applications
                  </Link>
                  <Link to="/ai-retailer-demo" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🧪 AI Review Demo
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-1 text-xs text-gray-500">AI-Powered Onboarding</div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
                Features ▾
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 space-y-1">
                  <Link to="/shopper-onboarding" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🎯 Shopper Onboarding
                  </Link>
                  <Link to="/enhanced-profile-settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    ⚙️ Enhanced Profile Settings
                  </Link>
                  <Link to="/mall-gift-card-system" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🎁 Mall Gift Card System
                  </Link>
                  <Link to="/multi-mall-cart" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🛒 Multi-Mall Cart
                  </Link>
                  <Link to="/mobile-responsive-test" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    📱 Mobile Testing
                  </Link>
                  <Link to="/spiral-todo-progress" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    📊 Progress Dashboard
                  </Link>
                  <Link to="/comprehensive-feature-testing" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🧪 Feature Testing
                  </Link>
                  <Link to="/wishlist-alerts-system" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🔔 Wishlist Alerts
                  </Link>
                  <Link to="/tiered-spirals-engine" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    ⭐ Tiered SPIRALS
                  </Link>
                  <Link to="/qr-pickup-system" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    📱 QR Pickup
                  </Link>
                  <Link to="/retailer-automation-flow" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🏪 Retailer Setup
                  </Link>
                  <Link to="/gift-card-balance-checker" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    💳 Gift Card Balance
                  </Link>
                  <Link to="/push-notification-settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🔔 Notifications
                  </Link>
                  <Link to="/admin-test-dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🔧 Admin Tests
                  </Link>
                  <Link to="/mobile-app-base" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    📱 Mobile App Base
                  </Link>
                  <Link to="/gpt-integration-demo" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    🧠 GPT Integration
                  </Link>
                  <Link to="/vercel-ibm-integration" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    ☁️ Vercel & IBM
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/trusted-local-stores" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              Trusted Local
            </Link>
            <Link to="/social-feed" className="text-gray-600 hover:text-[var(--spiral-coral)] px-2 py-1 rounded-md text-sm font-medium transition-colors">
              Community
            </Link>
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* SPIRAL Balance - Hidden on small screens */}
            <div className="hidden sm:block">
              <SpiralBalance />
            </div>
            
            {/* Language Selector - Desktop */}
            <div className="hidden lg:block">
              <LanguageSelector compact={true} showProgress={false} />
            </div>
            
            {/* Accessibility Toggle - Desktop */}
            <div className="hidden lg:block">
              <AccessibilityToggle compact={true} showLabel={false} />
            </div>
            
            {/* Mobile Navigation */}
            <MobileNav className="lg:hidden" />
            
            {/* Cart - Desktop */}
            <Link to="/cart" className="hidden lg:block">
              <Button variant="outline" size="sm" className="relative border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/10">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--spiral-coral)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold z-10">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-1">
                <Link to="/orders">
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                    <Package className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm">Orders</span>
                  </Button>
                </Link>
                <Link to="/loyalty">
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1 text-[var(--spiral-coral)] hover:text-[var(--spiral-coral)]/80">
                    <Star className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm">Loyalty</span>
                  </Button>
                </Link>
                <Link to="/wallet">
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1 text-purple-600 hover:text-purple-800">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm">Wallet</span>
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm">{user?.name}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline ml-1 text-sm">Log Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Button 
                  onClick={() => navigate('/onboarding')}
                  variant="outline"
                  size="sm"
                  className="text-[var(--spiral-coral)] border-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)] hover:text-white text-sm"
                >
                  Get Started
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white px-3 py-1.5 rounded-full font-medium text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button handled by MobileNav component */}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
