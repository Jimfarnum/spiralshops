import { Switch, Route } from "wouter";

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Store from "@/pages/store";
import NotFound from "@/pages/not-found";
import ProductSearch from "./ProductSearch";
import Cart from "@/pages/cart";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import Checkout from "@/pages/checkout";
import Mall from "@/pages/mall";
import Spirals from "@/pages/spirals";
import ProfileSettings from "@/pages/profile-settings";
import { ProductsPage } from "@/pages/products";
import ProductDetailOld from "./ProductDetail";
import MallDirectory from "@/pages/mall-directory";
import MallsPage from "@/pages/malls";
import Account from "@/pages/account";
import RetailerLogin from "@/pages/retailer-login";
import RetailerDashboard from "@/pages/retailer-dashboard";
import RetailerDashboardNew from "@/components/RetailerDashboard";
import ShopperDashboardComponent from "@/components/ShopperDashboard";
import ShopperDashboard from "@/pages/shopper-dashboard";
import Following from "@/pages/following";
import MarketingCenter from "@/pages/marketing-center";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import SocialFeed from "@/pages/social-feed";
import OrderConfirmation from "@/pages/order-confirmation";
import SpiralVideos from "@/pages/spiral-videos";
import SpiralFeatures from "@/pages/spiral-features";
import InviteFriend from "@/pages/invite-friend";
import Leaderboard from "@/pages/leaderboard";
import RetailerTestimonials from "@/pages/retailer-testimonials";
import RetailerAnalytics from "@/pages/retailer-analytics";
import MallAnalytics from "@/pages/mall-analytics";
import EnhancedRetailerAnalytics from "@/pages/enhanced-retailer-analytics";
import EnhancedMallAnalytics from "@/pages/enhanced-mall-analytics";
import Feature10Demo from "@/pages/feature-10-demo";
import OrdersReturns from "@/pages/orders-returns";
import AdminReturns from "@/pages/admin-returns";
import Feature11Demo from "@/pages/feature-11-demo";
import RetailerInsights from "@/pages/retailer-insights";
import TestFlow from "@/pages/test-flow";
import About from "@/pages/about";
import Wishlist from "@/pages/wishlist";
import InventoryDashboard from "@/pages/inventory-dashboard";
import FeatureTesting from "@/pages/feature-testing";
import DynamicFeatureTesting from "@/pages/dynamic-feature-testing";
import MallTemplate from "@/pages/mall-template";
import MallStorePage from "@/pages/mall-store";
import ProductDetailNew from "@/pages/product-detail";
import GiftCards from "@/pages/gift-cards";
import AccountGiftCards from "@/pages/account-gift-cards";
import AdminGiftCards from "@/pages/admin-gift-cards";
import Events from "@/pages/events";
import MultiCart from "@/pages/multi-cart";
import SplitFulfillment from "@/pages/split-fulfillment";
import { ExploreSPIRALsPage, RedeemSPIRALsPage, LoyaltyProgramPage, DeliveryOptionsPage } from "@/pages/coming-soon";
import CartRestoreNotification from "@/components/cart-restore-notification";
import ShareReminder from "@/components/share-reminder";
import MallContextSync from "@/components/mall-context-sync";
import MallEventsDemo from "@/pages/mall-events-demo";
import P1FeaturesDemo from "@/pages/p1-features-demo";
import P1TestSuite from "@/pages/p1-test-suite";

import RetailerOnboarding from "@/components/retailer-onboarding";
import WishlistNotifications from "@/components/wishlist-notifications";
import InventoryAlertsDemo from "@/pages/inventory-alerts-demo";
import LanguageDemo from "@/pages/language-demo";
import AccessibilitySettings from "@/pages/accessibility-settings";
import AccessibilityDemo from "@/pages/accessibility-demo";
import EnhancedCheckout from "@/pages/checkout-enhanced";
import PaymentSuccess from "@/pages/payment-success";
import PaymentFeaturesDemo from "@/pages/payment-features-demo";
import AdvancedFeaturesHub from "@/pages/advanced-features-hub";
import EnterpriseDashboard from "@/pages/enterprise-dashboard";
import RealTimeMonitoring from "@/pages/real-time-monitoring";
import InviteToShop from "@/pages/invite-to-shop";
import InviteResponse from "@/pages/invite-response";
import MyTrips from "@/pages/my-trips";
import AccessibilityInitialization from "@/components/accessibility-initialization";
import PerformanceOptimization from "@/pages/performance-optimization";
import FeatureShowcase from "@/pages/feature-showcase";
import GuestCheckout from "@/pages/guest-checkout";
import SavedAddresses from "@/components/saved-addresses";
import Feature12Demo from "@/pages/feature-12-demo";
import SavedAddressesPage from "@/pages/saved-addresses";
import NotificationsPage from "@/pages/notifications";
import ReturnsPage from "@/pages/returns";
import TrackingPage from "@/pages/tracking";
import PerformanceOptimizationDemo from "@/pages/performance-optimization-demo";
import Phase11Demo from "@/pages/phase-11-demo";
import SystemAudit from "@/pages/system-audit";
import LoyaltyDashboard from "@/pages/loyalty";
import OrdersPage from "@/pages/orders";
import OrderDetailPage from "@/pages/order-detail";
import RetailerLoyaltyPage from "@/pages/loyalty-retailers";
import MallPerksPage from "@/pages/loyalty-mall-perks";
import AdminReviewsPage from "@/pages/admin-reviews";
import ReviewsDemoPage from "@/pages/reviews-demo";
import AdminTestimonialsPage from "@/pages/admin-testimonials";
import ShowcasePage from "@/pages/showcase";
import TestimonialsDemoPage from "@/pages/testimonials-demo";
import EventsPage from "@/pages/events";
import EventDetailPage from "@/pages/event-detail";
import AdminEventsPage from "@/pages/admin-events";
import EventsDemoPage from "@/pages/events-demo";
import RetailersSignupPage from "@/pages/retailers-signup";
import RetailersLoginPage from "@/pages/retailers-login";
import RetailersDashboardPage from "@/pages/retailers-dashboard";
import AdminRetailersPage from "@/pages/admin-retailers";
import RetailerFeatureDemoPage from "@/pages/retailer-feature-demo";
import WishlistSettingsPage from "@/pages/wishlist-settings";
import AdminWishlistAlertsPage from "@/pages/admin-wishlist-alerts";
import WalletPage from "@/pages/wallet";
import WalletMallCredits from "@/pages/wallet-mall-credits";
import Feature14Demo from "@/pages/feature-14-demo";
import Feature13Demo from "@/pages/feature-13-demo";
import BusinessCalculator from "@/pages/business-calculator";
import InviteLeaderboard from "@/pages/invite-leaderboard";
import Feature15Demo from "@/pages/feature-15-demo";
import MVPTest from "@/pages/mvp-test";
import SpiralWalletDemo from "@/pages/spiral-wallet-demo";
import PickupScheduler from "@/pages/pickup-scheduler";
import Messages from "@/pages/messages";
import MallMap from "@/pages/mall-map";
import LargeRetailerSettings from "@/pages/large-retailer-settings";
import Feature17Demo from "@/pages/feature-17-demo";
import RetailerFollowDemo from "@/pages/retailer-follow-demo";
import VerifyStore from "@/pages/verify-store";
import AdminVerifications from "@/pages/admin-verifications";
import VerificationDemo from "@/pages/verification-demo";
import VerificationLevels from "@/pages/verification-levels";
import TrustedLocalStores from "@/pages/trusted-local-stores";
import DiscoverStores from "@/pages/discover-stores";
import VerifiedLookup from "@/pages/verified-lookup";
import ContactSupport from "@/pages/contact-support";
import FeeExplorer from "@/pages/fee-explorer";
import SmartSearchDemo from "@/pages/smart-search-demo";
import EnhancedWalletDemo from "@/pages/enhanced-wallet-demo";
import FeatureImprovementHub from "@/pages/feature-improvement-hub";
import ComprehensiveFeatureTest from "@/pages/comprehensive-feature-test";
import RetailerOnboardingDemo from "@/pages/retailer-onboarding-demo";
import FulfillmentDemo from "@/pages/fulfillment-demo";
import NotificationsDemo from "@/pages/notifications-demo";
import LiveSupportDemo from "@/pages/live-support-demo";
import EnhancedFunctionalityTest from "@/pages/enhanced-functionality-test";
import CompetitiveAnalysis from "@/pages/competitive-analysis";
import CompleteSystemValidation from "@/pages/complete-system-validation";
import ProductCatalogDemo from "@/pages/product-catalog-demo";
import ProductCatalogTest from "@/pages/product-catalog-test";
import MultiRetailerCheckout from "@/pages/multi-retailer-checkout";
import CompleteCheckoutTest from "@/pages/complete-checkout-test";
import CheckoutDemo from "@/pages/checkout-demo";
import AdvancedShippingDemo from "@/pages/advanced-shipping-demo";
import ShippingOptimizationDemo from "@/pages/shipping-optimization-demo";
import SpiralAdminLogin from "@/pages/spiral-admin-login";
import UserAuthDemo from "@/pages/user-auth-demo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/store/:id" component={Store} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/product/:id" component={ProductDetailOld} />
      <Route path="/search" component={ProductSearch} />
      <Route path="/search/:id" component={ProductDetailOld} />
      <Route path="/cart" component={Cart} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/mall/:mallName" component={Mall} />
      <Route path="/mall" component={Mall} />
      <Route path="/spirals" component={Spirals} />
      <Route path="/profile" component={ProfileSettings} />
      <Route path="/mall-directory" component={MallDirectory} />
      <Route path="/malls" component={MallsPage} />
      <Route path="/account" component={Account} />
      <Route path="/retailer-login" component={RetailerLogin} />
      <Route path="/retailer-dashboard" component={RetailerDashboard} />
      <Route path="/retailer-portal" component={() => import('@/components/retailer-portal').then(m => m.default)} />
      <Route path="/marketing-center" component={MarketingCenter} />
      <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
      <Route path="/social-feed" component={SocialFeed} />
      <Route path="/order-confirmation/:orderId?" component={OrderConfirmation} />
      <Route path="/spiral-videos" component={SpiralVideos} />
      <Route path="/spiral-features" component={SpiralFeatures} />
      <Route path="/invite-friend" component={InviteFriend} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/retailer-testimonials" component={RetailerTestimonials} />
      <Route path="/retailer-analytics" component={RetailerAnalytics} />

      <Route path="/retailer-insights" component={RetailerInsights} />
      <Route path="/test-flow" component={TestFlow} />
      <Route path="/about" component={About} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/inventory-dashboard" component={InventoryDashboard} />
      <Route path="/wallet" component={WalletPage} />
      <Route path="/wallet/mall-credits" component={WalletMallCredits} />
      <Route path="/feature-14-demo" component={Feature14Demo} />
      <Route path="/feature-testing" component={FeatureTesting} />
      <Route path="/dynamic-testing" component={DynamicFeatureTesting} />
      <Route path="/explore-spirals" component={ExploreSPIRALsPage} />
      <Route path="/redeem-spirals" component={RedeemSPIRALsPage} />
      <Route path="/loyalty-program" component={LoyaltyProgramPage} />
      <Route path="/delivery-options" component={DeliveryOptionsPage} />
      <Route path="/mall/:id" component={MallTemplate} />
      <Route path="/mall/:mallId/store/:storeId" component={MallStorePage} />
      <Route path="/product-new/:productId" component={ProductDetailNew} />
      <Route path="/gift-cards" component={GiftCards} />
      <Route path="/account/gift-cards" component={AccountGiftCards} />
      <Route path="/admin/gift-cards" component={AdminGiftCards} />
      <Route path="/events" component={Events} />
      <Route path="/multi-cart" component={MultiCart} />
      <Route path="/split-fulfillment" component={SplitFulfillment} />
      <Route path="/feature-audit" component={() => import('@/components/feature-parity-audit').then(m => m.default)} />
      <Route path="/competitive-analysis" component={() => import('@/components/competitive-analysis').then(m => m.default)} />
      <Route path="/gift-card-system" component={() => import('@/components/gift-card-system').then(m => m.default)} />
      <Route path="/retailer-demo" component={() => import('@/components/retailer-demo-dashboard').then(m => m.default)} />
      <Route path="/store/:storeId/reviews" component={() => import('@/pages/store-reviews').then(m => m.default)} />
      <Route path="/gift-cards" component={() => import('@/pages/gift-cards').then(m => m.default)} />
      <Route path="/p0-features-demo" component={() => import('@/pages/p0-features-demo').then(m => m.default)} />
      <Route path="/p1-features-demo" component={P1FeaturesDemo} />
      <Route path="/p1-test-suite" component={P1TestSuite} />
      <Route path="/loyalty-dashboard" component={LoyaltyDashboard} />
      <Route path="/mall-events-demo" component={MallEventsDemo} />
      <Route path="/retailer-onboarding" component={RetailerOnboarding} />
      <Route path="/wishlist-notifications" component={WishlistNotifications} />
      <Route path="/inventory-alerts-demo" component={InventoryAlertsDemo} />
      <Route path="/language-demo" component={LanguageDemo} />
      <Route path="/accessibility-settings" component={AccessibilitySettings} />
      <Route path="/accessibility-demo" component={AccessibilityDemo} />
      <Route path="/performance-optimization" component={PerformanceOptimization} />
      <Route path="/feature-showcase" component={FeatureShowcase} />
      <Route path="/guest-checkout" component={GuestCheckout} />
      <Route path="/saved-addresses" component={SavedAddressesPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/returns" component={ReturnsPage} />
      <Route path="/tracking" component={TrackingPage} />
      <Route path="/language-demo" component={LanguageDemo} />
      <Route path="/performance-optimization-demo" component={PerformanceOptimizationDemo} />
      <Route path="/phase-11-demo" component={Phase11Demo} />
      <Route path="/system-audit" component={SystemAudit} />
      <Route path="/loyalty" component={LoyaltyDashboard} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/order/:id" component={OrderDetailPage} />
      <Route path="/loyalty/retailers" component={RetailerLoyaltyPage} />
      <Route path="/loyalty/mall-perks" component={MallPerksPage} />
      <Route path="/admin/reviews" component={AdminReviewsPage} />
      <Route path="/reviews-demo" component={ReviewsDemoPage} />
      <Route path="/admin/testimonials" component={AdminTestimonialsPage} />
      <Route path="/showcase" component={ShowcasePage} />
      <Route path="/testimonials-demo" component={TestimonialsDemoPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailPage} />
      <Route path="/admin/events" component={AdminEventsPage} />
      <Route path="/events-demo" component={EventsDemoPage} />
      <Route path="/retailers/signup" component={RetailersSignupPage} />
      <Route path="/retailers/login" component={RetailersLoginPage} />
      <Route path="/retailers/dashboard" component={RetailersDashboardPage} />
      <Route path="/admin/retailers" component={AdminRetailersPage} />
      <Route path="/retailer-feature-demo" component={RetailerFeatureDemoPage} />
      <Route path="/wishlist/settings" component={WishlistSettingsPage} />
      <Route path="/admin/wishlist-alerts" component={AdminWishlistAlertsPage} />
      <Route path="/orders/returns" component={OrdersReturns} />
      <Route path="/admin/returns" component={AdminReturns} />
      <Route path="/feature-11-demo" component={Feature11Demo} />
      <Route path="/feature-12-demo" component={Feature12Demo} />
      <Route path="/feature-13-demo" component={Feature13Demo} />
      <Route path="/business-calculator" component={BusinessCalculator} />
      <Route path="/invite-leaderboard" component={InviteLeaderboard} />
      <Route path="/feature-15-demo" component={Feature15Demo} />
      <Route path="/mvp-test" component={MVPTest} />
      <Route path="/spiral-wallet-demo" component={SpiralWalletDemo} />
      <Route path="/retailer-dashboard-new" component={RetailerDashboardNew} />
      <Route path="/shopper-dashboard" component={ShopperDashboard} />
      <Route path="/following" component={Following} />
      <Route path="/pickup-scheduler" component={PickupScheduler} />
      <Route path="/messages" component={Messages} />
      <Route path="/mall/:id/map" component={MallMap} />
      <Route path="/large-retailer-settings" component={LargeRetailerSettings} />
      <Route path="/feature-17-demo" component={Feature17Demo} />
      <Route path="/retailer-follow-demo" component={RetailerFollowDemo} />
      <Route path="/verify-store" component={VerifyStore} />
      <Route path="/admin/verifications" component={AdminVerifications} />
      <Route path="/verification-demo" component={VerificationDemo} />
      <Route path="/verification-levels" component={VerificationLevels} />
      <Route path="/trusted-local-stores" component={TrustedLocalStores} />
      <Route path="/discover-stores" component={DiscoverStores} />
      <Route path="/verified-lookup" component={VerifiedLookup} />
      <Route path="/contact-support" component={ContactSupport} />
      <Route path="/fee-explorer" component={FeeExplorer} />
      <Route path="/smart-search-demo" component={SmartSearchDemo} />
      <Route path="/enhanced-wallet-demo" component={EnhancedWalletDemo} />
      <Route path="/feature-improvement-hub" component={FeatureImprovementHub} />
      <Route path="/comprehensive-feature-test" component={ComprehensiveFeatureTest} />
      <Route path="/retailer-onboarding-demo" component={RetailerOnboardingDemo} />
      <Route path="/fulfillment-demo" component={FulfillmentDemo} />
      <Route path="/notifications-demo" component={NotificationsDemo} />
      <Route path="/live-support-demo" component={LiveSupportDemo} />
      <Route path="/enhanced-functionality-test" component={EnhancedFunctionalityTest} />
      <Route path="/competitive-analysis" component={CompetitiveAnalysis} />
      <Route path="/complete-system-validation" component={CompleteSystemValidation} />
      <Route path="/product-catalog-demo" component={ProductCatalogDemo} />
      <Route path="/product-catalog-test" component={ProductCatalogTest} />
      <Route path="/multi-retailer-checkout" component={MultiRetailerCheckout} />
      <Route path="/complete-checkout-test" component={CompleteCheckoutTest} />
      <Route path="/checkout-demo" component={CheckoutDemo} />
      <Route path="/advanced-shipping-demo" component={AdvancedShippingDemo} />
      <Route path="/shipping-optimization-demo" component={ShippingOptimizationDemo} />
      <Route path="/spiral-admin" component={SpiralAdminLogin} />
      <Route path="/user-auth-demo" component={UserAuthDemo} />
      <Route path="/checkout-enhanced" component={EnhancedCheckout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment-features-demo" component={PaymentFeaturesDemo} />
      <Route path="/advanced-features-hub" component={AdvancedFeaturesHub} />
      <Route path="/enterprise-dashboard" component={EnterpriseDashboard} />
      <Route path="/real-time-monitoring" component={RealTimeMonitoring} />
      <Route path="/invite-to-shop" component={InviteToShop} />
      <Route path="/invite/:tripId" component={InviteResponse} />
      <Route path="/my-trips" component={MyTrips} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityInitialization />
        <MallContextSync />
        <CartRestoreNotification />
        <ShareReminder />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
