import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { updateMetaTags } from "@/utils/metaTags";
import performanceOptimizations from "@/utils/performanceOptimizations";

// Loading component for suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-4">
      <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">Failed to load page component</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Lazy load core pages (immediate priority)
const Home = lazy(() => import("@/pages/home"));
const ProductsPage = lazy(() => import("@/pages/products"));
const ProductSearch = lazy(() => import("./ProductSearch"));
const Store = lazy(() => import("@/pages/store"));
const Cart = lazy(() => import("@/pages/cart"));
const Login = lazy(() => import("@/pages/login"));
const SignUp = lazy(() => import("@/pages/signup"));
const Checkout = lazy(() => import("@/pages/checkout"));

// Lazy load secondary pages
const Mall = lazy(() => import("@/pages/mall"));
const MallsPage = lazy(() => import("@/pages/malls"));
const Spirals = lazy(() => import("@/pages/spirals"));
const Account = lazy(() => import("@/pages/account"));
const ProfileSettings = lazy(() => import("@/pages/profile-settings"));
const Wishlist = lazy(() => import("@/pages/wishlist"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));

// Lazy load retailer features
const RetailerLogin = lazy(() => import("@/pages/retailer-login"));
const RetailerDashboard = lazy(() => import("@/pages/retailer-dashboard"));
const RetailerOnboarding = lazy(() => import("@/pages/retailer-onboarding"));

// Lazy load admin features
const AdminLogin = lazy(() => import("@/pages/spiral-admin-login"));
const AdminDashboard = lazy(() => import("@/pages/spiral-admin-dashboard"));

// Lazy load AI features
const AIAgentsPage = lazy(() => import("@/pages/AIAgentsPage"));
const VisualSearchPage = lazy(() => import("@/pages/visual-search"));
const ImageSearchPage = lazy(() => import("@/pages/ImageSearchPage"));
const NearMePage = lazy(() => import("@/pages/NearMePage"));

// Lazy load product and store pages
const ProductDetailNew = lazy(() => import("@/pages/product-detail"));
const EnhancedProductDetail = lazy(() => import("@/pages/EnhancedProductDetail"));
const StoreDetails = lazy(() => import("@/pages/store-details"));

// Lazy load other features
const Events = lazy(() => import("@/pages/events"));
const About = lazy(() => import("@/pages/about"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Static imports for essential components
import SEOHead from "@/components/SEOHead";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CartRestoreNotification from "@/components/cart-restore-notification";
import ShareReminder from "@/components/share-reminder";
import MallContextSync from "@/components/mall-context-sync";
import WishlistNotifications from "@/components/wishlist-notifications";
import Diagnostics from "./components/Diagnostics";

function App() {
  const [location] = useLocation();

  useEffect(() => {
    updateMetaTags();
    // Initialize performance optimizations
    if (performanceOptimizations?.init) {
      performanceOptimizations.init();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SEOHead />
        <PerformanceOptimizer />
        <GoogleAnalytics />
        
        {/* Essential notifications and context */}
        <CartRestoreNotification />
        <ShareReminder />
        <MallContextSync />
        <WishlistNotifications />
        
        <div className="min-h-screen bg-background">
          <Suspense fallback={<LoadingSpinner />}>
            <Switch>
              {/* Core routes - highest priority */}
              <Route path="/" component={Home} />
              <Route path="/products" component={ProductsPage} />
              <Route path="/search" component={ProductSearch} />
              <Route path="/cart" component={Cart} />
              <Route path="/checkout" component={Checkout} />
              
              {/* User authentication */}
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route path="/account" component={Account} />
              <Route path="/profile" component={ProfileSettings} />
              
              {/* Store and mall routes */}
              <Route path="/stores" component={Store} />
              <Route path="/store/:id" component={StoreDetails} />
              <Route path="/malls" component={MallsPage} />
              <Route path="/mall/:id" component={Mall} />
              
              {/* Product routes */}
              <Route path="/product/:id" component={ProductDetailNew} />
              <Route path="/product-detail/:id" component={EnhancedProductDetail} />
              
              {/* Wishlist and loyalty */}
              <Route path="/wishlist" component={WishlistPage} />
              <Route path="/spirals" component={Spirals} />
              
              {/* AI and search features */}
              <Route path="/ai-agents" component={AIAgentsPage} />
              <Route path="/visual-search" component={VisualSearchPage} />
              <Route path="/image-search" component={ImageSearchPage} />
              <Route path="/near-me" component={NearMePage} />
              
              {/* Retailer routes */}
              <Route path="/retailer-login" component={RetailerLogin} />
              <Route path="/retailer-dashboard" component={RetailerDashboard} />
              <Route path="/retailer-onboarding" component={RetailerOnboarding} />
              
              {/* Admin routes */}
              <Route path="/spiral-admin-login" component={AdminLogin} />
              <Route path="/admin" component={AdminDashboard} />
              
              {/* Other pages */}
              <Route path="/events" component={Events} />
              <Route path="/about" component={About} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              
              {/* Diagnostics - for testing only */}
              <Route path="/diagnostics" component={Diagnostics} />
              
              {/* Catch all */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;