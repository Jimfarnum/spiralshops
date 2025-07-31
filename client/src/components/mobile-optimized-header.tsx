import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { Menu, ShoppingCart, User, LogOut, X, Home, Package, Building2, Users, Info, Store, Heart, Calendar, MessageCircle, Map, Settings, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MobileOptimizedHeaderProps {
  className?: string;
}

export default function MobileOptimizedHeader({ className = '' }: MobileOptimizedHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { spiralBalance } = useLoyaltyStore();
  const { toast } = useToast();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const navigationItems = [
    { href: '/', label: 'Discover', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/malls', label: 'Shopping Malls', icon: Building2 },
    { href: '/following', label: 'Following', icon: Heart },
    { href: '/social-feed', label: 'Community', icon: Users },
    { href: '/about', label: 'About', icon: Info },
    { href: '/retailer-login', label: 'For Retailers', icon: Store },
    { href: '/verify-store', label: 'Verify Store', icon: Store },
    { href: '/retailer-follow-demo', label: 'Follow System', icon: Heart },
    { href: '/admin/verifications', label: 'Admin Panel', icon: Settings },
    // Feature 17 Enhancement Bundle
    { href: '/feature-17-demo', label: 'Feature 17 Demo', icon: Settings, divider: true },
    { href: '/pickup-scheduler', label: 'Pickup Scheduling', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/mall/1/map', label: 'Mall Maps', icon: Map },
    { href: '/large-retailer-settings', label: 'Retailer Preferences', icon: Settings },
    // AI Retailer Features
    { href: '/ai-retailer-signup', label: 'AI Retailer Signup', icon: Bot, divider: true },
    { href: '/admin/retailer-applications', label: 'Admin Applications', icon: Users }
  ];

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 ${className}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img 
              src="@assets/5f2ddb9c-bed6-466a-a305-c06542e7cf4b.png (1)_1752624555680.PNG" 
              alt="SPIRAL Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3 object-contain"
            />
            <div className="min-w-0">
              <span className="text-lg sm:text-xl font-bold text-[var(--spiral-navy)]">SPIRAL</span>
              <p className="text-xs text-gray-500 -mt-1 whitespace-nowrap hidden sm:block">Everything Local. Just for You.</p>
            </div>
          </Link>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-gray-600 hover:text-[var(--spiral-coral)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* SPIRAL Balance - Desktop only */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center bg-[var(--spiral-gold)]/10 rounded-full px-3 py-1 border border-[var(--spiral-gold)]/20">
                <div className="w-2 h-2 bg-[var(--spiral-gold)] rounded-full mr-2"></div>
                <span className="text-sm font-bold text-[var(--spiral-navy)]">{spiralBalance}</span>
                <span className="text-xs text-gray-600 ml-1">SPIRALs</span>
              </div>
            )}
            
            {/* Cart - Always visible */}
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/10 p-2 sm:px-3">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--spiral-coral)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
                <span className="ml-1 hidden lg:inline text-sm">Cart</span>
              </Button>
            </Link>
            
            {/* Desktop Auth - Hidden on mobile */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/profile">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700 max-w-20 truncate">{user?.name}</span>
                  </div>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-gray-100 text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white px-4 py-2 rounded-full font-medium text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button - Only on mobile */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden p-2" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <SheetHeader className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src="@assets/5f2ddb9c-bed6-466a-a305-c06542e7cf4b.png (1)_1752624555680.PNG" 
                          alt="SPIRAL Logo" 
                          className="w-8 h-8 mr-2 object-contain"
                        />
                        <div>
                          <SheetTitle className="text-lg font-bold text-[var(--spiral-navy)]">SPIRAL</SheetTitle>
                          <SheetDescription className="text-xs text-gray-500">Everything Local. Just for You.</SheetDescription>
                        </div>
                      </div>
                    </div>
                  </SheetHeader>
                  
                  {/* User Info - Mobile only */}
                  {isAuthenticated && (
                    <div className="p-4 bg-[var(--spiral-gold)]/5 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[var(--spiral-navy)] rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--spiral-navy)]">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-[var(--spiral-gold)]/10 rounded-full px-3 py-1 border border-[var(--spiral-gold)]/20">
                          <div className="w-2 h-2 bg-[var(--spiral-gold)] rounded-full mr-2"></div>
                          <span className="text-sm font-bold text-[var(--spiral-navy)]">{spiralBalance}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation */}
                  <div className="flex-1 overflow-y-auto">
                    <nav className="p-4 space-y-2">
                      {navigationItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <div key={item.href}>
                            {item.divider && (
                              <div className="py-2">
                                <div className="border-t border-gray-200 mb-2"></div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2">
                                  Feature 17 Enhancement Bundle
                                </p>
                              </div>
                            )}
                            <Link href={item.href}>
                              <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                                  item.divider ? 'bg-blue-50 border border-blue-200' : ''
                                }`}
                              >
                                <IconComponent className={`h-5 w-5 ${item.divider ? 'text-blue-600' : 'text-gray-600'}`} />
                                <span className={`font-medium ${item.divider ? 'text-blue-900' : 'text-gray-900'}`}>
                                  {item.label}
                                </span>
                              </button>
                            </Link>
                          </div>
                        );
                      })}
                    </nav>
                    
                    {/* User Actions */}
                    {isAuthenticated && (
                      <div className="p-4 border-t space-y-2">
                        <Link href="/profile">
                          <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100 transition-colors"
                          >
                            <User className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">Profile Settings</span>
                          </button>
                        </Link>
                        <Link href="/wishlist">
                          <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100 transition-colors"
                          >
                            <Users className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">My Wishlist</span>
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer Actions */}
                  <div className="p-4 border-t bg-gray-50">
                    {isAuthenticated ? (
                      <Button 
                        onClick={handleLogout}
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/login" className="block">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/signup" className="block">
                          <Button 
                            className="w-full bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}