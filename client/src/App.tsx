import "./styles/theme.css";
import { isAndroid } from "./utils/isAndroid";
import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { updateMetaTags } from "@/utils/metaTags";
import performanceOptimizations from "@/utils/performanceOptimizations";
import SpiralBrandTheme from "@/components/DynamicColorSystem";

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

// Lazy load billing features  
const Plans = lazy(() => import("@/pages/Plans"));

// Lazy load beta features
const BetaDashboard = lazy(() => import("@/pages/BetaDashboard"));

// Lazy load retailer features
const RetailerLogin = lazy(() => import("@/pages/retailer-login"));
const RetailerDashboard = lazy(() => import("@/pages/retailer-dashboard"));
const RetailerOnboarding = lazy(() => import("@/pages/retailer-onboarding"));
const RetailerBusinessProfile = lazy(() => import("@/pages/retailer-business-profile"));
const RetailerToolkit = lazy(() => import("@/pages/RetailerToolkit"));
const RetailerInventory = lazy(() => import("@/pages/retailer-inventory"));
const RecognitionDemo = lazy(() => import("@/pages/RecognitionDemo"));

// Lazy load admin features
const AdminLogin = lazy(() => import("@/pages/spiral-admin-login"));
const AdminDashboard = lazy(() => import("@/pages/spiral-admin-dashboard"));
const AdminReportsPage = lazy(() => import("@/pages/admin-reports"));
const AdminReview = lazy(() => import("@/components/AdminReview"));
const MallDashboardPage = lazy(() => import("@/pages/mall-dashboard"));

// Lazy load AI features
const AIAgentsPage = lazy(() => import("@/pages/AIAgentsPage"));
const StaffRoster = lazy(() => import("@/pages/StaffRoster"));
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

// SPIRAL value proposition pages
const Community = lazy(() => import("@/pages/community"));
const LocalFirst = lazy(() => import("@/pages/local-first"));
const LoyaltyProgram = lazy(() => import("@/pages/loyalty-program"));

// Social features
const SocialFeed = lazy(() => import("@/pages/social-feed"));
const SocialRewards = lazy(() => import("@/pages/social-rewards"));

// Legal framework pages
const LegalTerms = lazy(() => import("@/pages/legal/Terms"));
const LegalPrivacy = lazy(() => import("@/pages/legal/Privacy"));
const LegalRefunds = lazy(() => import("@/pages/legal/Refunds"));
const LegalGuarantee = lazy(() => import("@/pages/legal/Guarantee"));
const OneClickCheckout = lazy(() => import("@/pages/OneClickCheckout"));
const EasyReturns = lazy(() => import("@/pages/EasyReturns"));
const OrdersReturns = lazy(() => import("@/pages/orders-returns"));
const OrderDetails = lazy(() => import("@/pages/order-details"));
const PurchaseDetails = lazy(() => import("@/pages/purchase-details"));
const RetailerLoyaltyDetails = lazy(() => import("@/pages/retailer-loyalty-details"));
const FunctionAgentDashboard = lazy(() => import("@/pages/FunctionAgentDashboard"));
const FunctionAgentTest = lazy(() => import("@/pages/FunctionAgentTest"));
const SimpleFunction = lazy(() => import("@/pages/SimpleFunction"));
const PlatformDemo = lazy(() => import("@/pages/PlatformDemo"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Promotion system pages
const PromotionAdminPage = lazy(() => import("@/pages/promotion-admin"));
const PromotionRequestPage = lazy(() => import("@/pages/promotion-request"));
const PromotionDemoPage = lazy(() => import("@/pages/promotion-demo"));
const CheckoutSpiralsDemo = lazy(() => import("@/pages/checkout-spirals-demo"));
const InvestorsPage = lazy(() => import("@/pages/investors"));
const AdminInvestorDashboardPage = lazy(() => import("@/pages/admin-investor-dashboard"));
const RetailerOnboardingNewPage = lazy(() => import("@/pages/retailer-onboarding-new"));
const PureTest = lazy(() => import("@/pages/PureTest"));
const TrustPage = lazy(() => import("@/pages/TrustPage"));

// Static imports for essential components
import SEOHead from "@/components/SEOHead";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CartRestoreNotification from "@/components/cart-restore-notification";
import ShareReminder from "@/components/share-reminder";
import MallContextSync from "@/components/mall-context-sync";
import WishlistNotifications from "@/components/wishlist-notifications";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BrandThemeApplier from "@/components/BrandThemeApplier";
import Diagnostics from "./components/Diagnostics";

// Test components  
const ApiTest = lazy(() => import("@/components/ApiTest"));

// Phase 2 Dashboard - import without extension
const Phase2Dashboard = lazy(() => import("../../frontend/Dashboard"));

function App() {
  const [location] = useLocation();

  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        if (isAndroid()) document.body.classList.add("android"); else document.body.classList.remove("android");
        let fb = document.querySelector(".footer-bar");
        if (!fb) { fb = document.createElement("div"); fb.className = "footer-bar"; document.body.appendChild(fb); }
      }
    } catch(e) { /* no-op */ }
  }, []);

  useEffect(() => {
    updateMetaTags(location);
    // Initialize performance optimizations  
    performanceOptimizations.preloadCriticalComponents();
    performanceOptimizations.performanceMonitor.logPerformance('App initialization');
  }, [location]);

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
        <BreadcrumbSchema />
        <BrandThemeApplier />
        
        <div className="min-h-screen bg-background">
          <Suspense fallback={<LoadingSpinner />}>
            <Switch>
              {/* Core routes - highest priority */}
              <Route path="/" component={Home} />
              <Route path="/products" component={ProductsPage} />
              <Route path="/search" component={ProductSearch} />
              <Route path="/cart" component={Cart} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/one-click-checkout" component={OneClickCheckout} />
              
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
              
              {/* Billing and subscription plans */}
              <Route path="/plans" component={Plans} />
              
              {/* Returns and orders */}
              <Route path="/orders-returns" component={OrdersReturns} />
              <Route path="/order-details" component={OrderDetails} />
              <Route path="/purchase-details" component={PurchaseDetails} />
              <Route path="/loyalty/retailer/:id" component={RetailerLoyaltyDetails} />
              <Route path="/easy-returns" component={EasyReturns} />
              
              {/* AI and search features */}
              <Route path="/ai-agents" component={AIAgentsPage} />
              <Route path="/staff" component={StaffRoster} />
              <Route path="/visual-search" component={VisualSearchPage} />
              <Route path="/image-search" component={ImageSearchPage} />
              <Route path="/near-me" component={NearMePage} />
              
              {/* Retailer routes */}
              <Route path="/retailer-login" component={RetailerLogin} />
              <Route path="/retailer-dashboard" component={RetailerDashboard} />
              <Route path="/retailer-onboarding" component={RetailerOnboarding} />
              <Route path="/retailer-onboarding-new" component={RetailerOnboardingNewPage} />
              <Route path="/retailer-business-profile" component={RetailerBusinessProfile} />
              <Route path="/retailer-toolkit" component={RetailerToolkit} />
              <Route path="/retailer-inventory" component={RetailerInventory} />
              <Route path="/recognition-demo" component={RecognitionDemo} />
              
              {/* Admin routes */}
              <Route path="/spiral-admin-login" component={AdminLogin} />
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/reports" component={AdminReportsPage} />
              <Route path="/admin/reviews" component={AdminReview} />
              <Route path="/admin/investor-dashboard" component={AdminInvestorDashboardPage} />
              <Route path="/mall-dashboard" component={MallDashboardPage} />
              <Route path="/investors" component={InvestorsPage} />
              
              {/* Beta dashboard for demos & investor presentations */}
              <Route path="/beta-dashboard" component={BetaDashboard} />
              
              {/* Promotion system routes */}
              <Route path="/promotion-admin" component={PromotionAdminPage} />
              <Route path="/promotion-request" component={PromotionRequestPage} />
              <Route path="/promotion-demo" component={PromotionDemoPage} />
              <Route path="/checkout-spirals-demo" component={CheckoutSpiralsDemo} />
              
              {/* Function Agent */}
              <Route path="/function-agent" component={FunctionAgentDashboard} />
              <Route path="/function-test" component={FunctionAgentTest} />
              <Route path="/demo" component={SimpleFunction} />
              <Route path="/platform-demo" component={PlatformDemo} />
              
              {/* SPIRAL value proposition pages */}
              <Route path="/community" component={Community} />
              <Route path="/local-first" component={LocalFirst} />
              <Route path="/loyalty-program" component={LoyaltyProgram} />

              {/* Social features */}
              <Route path="/social-feed" component={SocialFeed} />
              <Route path="/social-rewards" component={SocialRewards} />

              {/* Other pages */}
              <Route path="/events" component={Events} />
              <Route path="/about" component={About} />
              <Route path="/trust" component={TrustPage} />
              <Route path="/pure-test" component={PureTest} />
              
              {/* Legal framework routes */}
              <Route path="/legal/terms" component={LegalTerms} />
              <Route path="/legal/privacy" component={LegalPrivacy} />
              <Route path="/legal/refunds" component={LegalRefunds} />
              <Route path="/legal/guarantee" component={LegalGuarantee} />
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/privacy" component={LegalPrivacy} />
              <Route path="/terms" component={LegalTerms} />
              
              {/* Phase 2 Dashboard - for testing */}
              <Route path="/phase2-dashboard" component={Phase2Dashboard} />
              
              {/* Diagnostics - for testing only */}
              <Route path="/diagnostics" component={Diagnostics} />
              <Route path="/api-test" component={ApiTest} />
              
              {/* Catch all */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </div>
        <Toaster />
        <SpiralBrandTheme />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;