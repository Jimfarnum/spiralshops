import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import { Menu, Home, Package, Building2, Users, User, ShoppingCart, LogOut, Heart, MapPin, Truck } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import SpiralBalance from "./spiral-balance";
import { useToast } from "@/hooks/use-toast";

interface MobileNavProps {
  className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const cartItemCount = getTotalItems();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      duration: 2000,
    });
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const navItems = [
    { href: "/", icon: Home, label: "Discover", description: "Explore local businesses" },
    { href: "/products", icon: Package, label: "Products", description: "Browse all products" },
    { href: "/malls", icon: Building2, label: "Malls", description: "Shopping centers" },
    { href: "/subscriptions", icon: Package, label: "Subscriptions", description: "Subscription services" },
    { href: "/spiral-centers", icon: MapPin, label: "SPIRAL Centers", description: "Logistics network" },
    { href: "/advanced-logistics", icon: Truck, label: "Advanced Logistics", description: "Delivery management" },
    { href: "/following", icon: Heart, label: "Following", description: "Stores you follow" },
    { href: "/social-feed", icon: Users, label: "Community", description: "Connect with locals" },
  ];

  return (
    <div className={`lg:hidden ${className}`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/10">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
              <img 
                src="@assets/mqy7md_1753122664873.jpg" 
                alt="SPIRAL Logo" 
                className="w-10 h-10 object-contain rounded-md"
              />
              <div>
                <h2 className="text-xl font-bold text-[var(--spiral-navy)]">SPIRAL</h2>
                <p className="text-sm text-gray-600">Everything Local. Just for You.</p>
              </div>
            </div>

            {/* SPIRAL Balance */}
            {isAuthenticated && (
              <div className="py-4 border-b border-gray-200">
                <SpiralBalance />
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-6">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={handleNavClick}>
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--spiral-cream)] transition-colors group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-[var(--spiral-coral)]/10 flex items-center justify-center group-hover:bg-[var(--spiral-coral)]/20 transition-colors">
                        <item.icon className="h-5 w-5 text-[var(--spiral-coral)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--spiral-navy)] group-hover:text-[var(--spiral-coral)] transition-colors">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              {/* Cart */}
              <Link href="/cart" onClick={handleNavClick}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--spiral-cream)] hover:bg-[var(--spiral-coral)]/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-[var(--spiral-coral)]" />
                    <span className="font-semibold text-[var(--spiral-navy)]">Shopping Cart</span>
                  </div>
                  {cartItemCount > 0 && (
                    <span className="bg-[var(--spiral-coral)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* User Actions */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link href="/account" onClick={handleNavClick}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--spiral-cream)] transition-colors cursor-pointer">
                      <User className="h-5 w-5 text-[var(--spiral-sage)]" />
                      <span className="font-semibold text-[var(--spiral-navy)]">My Account</span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span className="font-semibold text-red-500">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={handleNavClick}>
                    <Button className="w-full bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={handleNavClick}>
                    <Button variant="outline" className="w-full border-[var(--spiral-navy)] text-[var(--spiral-navy)]">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}