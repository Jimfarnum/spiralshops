import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
import SpiralBalance from "./spiral-balance";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const cartItemCount = getTotalItems();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      duration: 2000,
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center min-w-0 flex-1">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="@assets/5f2ddb9c-bed6-466a-a305-c06542e7cf4b.png (1)_1752624555680.PNG" 
                alt="SPIRAL Logo" 
                className="w-12 h-12 mr-3 object-contain"
              />
              <div className="min-w-0">
                <span className="text-xl font-bold text-[var(--spiral-navy)]">SPIRAL</span>
                <p className="text-xs text-gray-500 -mt-1 whitespace-nowrap">Everything Local. Just for You.</p>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="text-gray-600 hover:text-[var(--spiral-coral)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Discover
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-[var(--spiral-coral)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Products
              </Link>
              <Link href="/malls" className="text-gray-600 hover:text-[var(--spiral-coral)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Malls
              </Link>
              <Link href="/social-feed" className="text-gray-600 hover:text-[var(--spiral-coral)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Community
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-[var(--spiral-coral)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/retailer-login" className="text-gray-600 hover:text-[var(--spiral-coral)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                For Retailers
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0">
            <SpiralBalance />
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/10">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--spiral-coral)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
                <span className="ml-1 hidden lg:inline text-sm">Cart</span>
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{user?.name}</span>
                  </div>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Log Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)] text-white px-4 py-2 rounded-full font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
