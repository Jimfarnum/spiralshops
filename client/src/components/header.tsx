import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

export default function Header() {
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const cartItemCount = getTotalItems();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-spiral-blue rounded-full flex items-center justify-center mr-2">
                <div className="w-6 h-6 border-2 border-white rounded-full animate-spin" 
                     style={{ borderTopColor: 'transparent' }} />
              </div>
              <span className="text-xl font-bold text-gray-900">SPIRAL</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Discover
              </Link>
              <Link href="/products" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Products
              </Link>
              <a href="#retailer-signup" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                For Retailers
              </a>
              <a href="#about" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                About
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button className="bg-spiral-blue text-white hover:bg-spiral-blue-dark">
              Sign In
            </Button>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
