import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Menu, X, Search, Home, Package, MapPin } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import SpiralBalance from "./spiral-balance";

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

            {/* Menu Button */}
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-2">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* SPIRAL Balance Bar */}
        {isAuthenticated && (
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            <SpiralBalance />
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMenu} />
          <div className="fixed top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-96 overflow-y-auto">
            <nav className="py-4">
              {/* Main Navigation */}
              <div className="space-y-1 px-4">
                <Link href="/" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link href="/products" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Package className="w-5 h-5" />
                  <span>Products</span>
                </Link>
                <Link href="/malls" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5" />
                  <span>Malls</span>
                </Link>
                <Link href="/spiral-centers" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5" />
                  <span>SPIRAL Centers</span>
                </Link>
              </div>

              {/* User Section */}
              <div className="border-t border-gray-200 mt-4 pt-4 px-4">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <Link href="/spirals" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                      <span className="w-5 h-5 text-center">⭐</span>
                      <span>My SPIRALs</span>
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                      <span className="w-5 h-5 text-center">❤️</span>
                      <span>Wishlist</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="block w-full">
                      <Button className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="block w-full">
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Retailer Section */}
              <div className="border-t border-gray-200 mt-4 pt-4 px-4">
                <p className="text-sm font-medium text-gray-500 mb-2">For Retailers</p>
                <div className="space-y-1">
                  <Link href="/retailer-login" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                    <span>Retailer Login</span>
                  </Link>
                  <Link href="/ai-retailer-signup" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                    <span>Join SPIRAL</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}