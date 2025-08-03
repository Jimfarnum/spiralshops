import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Menu, X, Search, Home, Package, MapPin } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import SpiralBalance from "./spiral-balance";
import MobileNav from "./MobileNav";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const cartItemCount = getTotalItems();
  const { user, isAuthenticated } = useAuthStore();
  const [, navigate] = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 md:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/spiral-blue.svg" 
              alt="SPIRAL Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold text-[var(--spiral-navy)]">SPIRAL</span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/search')}
              className="p-2"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--spiral-coral)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Integration */}
            <MobileNav 
              isOpen={isMenuOpen} 
              onToggle={toggleMenu} 
              onClose={() => setIsMenuOpen(false)} 
            />
          </div>
        </div>

        {/* SPIRAL Balance Bar */}
        {isAuthenticated && (
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            <SpiralBalance />
          </div>
        )}
      </header>

    </>
  );
}