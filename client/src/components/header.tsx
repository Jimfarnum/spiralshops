import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/authStore";
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/5f2ddb9c-bed6-466a-a305-c06542e7cf4b.png (1).PNG" 
                alt="SPIRAL Logo" 
                className="w-10 h-10 mr-3"
              />
              <div>
                <span className="text-xl font-bold text-gray-900 font-['Poppins']">SPIRAL</span>
                <p className="text-xs text-gray-500 font-['Inter'] -mt-1">Everything Local. Just for You.</p>
              </div>
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
              <Button variant="outline" className="relative border-[hsl(183,100%,23%)] text-[hsl(183,100%,23%)] hover:bg-[hsl(183,100%,96%)]">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[hsl(32,98%,56%)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
                <span className="ml-2 hidden md:inline">Cart</span>
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
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
