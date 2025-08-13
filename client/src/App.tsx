import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy } from "react";

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { updateMetaTags } from "@/utils/metaTags";
// Removed non-existent imports that were causing LSP errors
// Performance optimization imports
import performanceOptimizations from "@/utils/performanceOptimizations";
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
import ProductDetailOld from "./ProductDetail";
import MallDirectory from "@/pages/mall-directory";
import MallsPage from "@/pages/malls";
import Account from "@/pages/account";
import RetailerLogin from "@/pages/retailer-login";
import RetailerDashboard from "@/pages/retailer-dashboard";
import RetailerDashboardNew from "@/components/RetailerDashboard";
import ShopperDashboardComponent from "@/components/ShopperDashboard";
import ShopperDashboardNew from "@/components/ShopperDashboardNew";
import ShopperDashboard from "@/pages/shopper-dashboard";
import Following from "@/pages/following";
import MarketingCenter from "@/pages/marketing-center";
import OldAnalyticsDashboard from "@/pages/analytics-dashboard";
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
import VisualSearchPage from "@/pages/visual-search";
import InventoryDashboard from "@/pages/inventory-dashboard";
import FeatureTesting from "@/pages/feature-testing";
import DynamicFeatureTesting from "@/pages/dynamic-feature-testing";
import MallTemplate from "@/pages/mall-template";
import MallStorePage from "@/pages/mall-store";
import ProductDetailNew from "@/pages/product-detail";
import EnhancedProductDetail from "@/pages/EnhancedProductDetail";
import GiftCards from "@/pages/gift-cards";
import AccountGiftCards from "@/pages/account-gift-cards";
import AdminGiftCards from "@/pages/admin-gift-cards";
import Events from "@/pages/events";
import MultiCart from "@/pages/multi-cart";
import SplitFulfillment from "@/pages/split-fulfillment";
import ExploreSPIRALsPage from "@/pages/ExploreSPIRALsPage";
import RedeemSPIRALsPage from "@/pages/RedeemSPIRALsPage";
import LoyaltyProgramPage from "@/pages/LoyaltyProgramPage";
import DeliveryOptionsPage from "@/pages/DeliveryOptionsPage";
import RetailerProfilePage from "@/pages/RetailerProfilePage";
import SEOLandingRoute from "@/pages/SEOLandingRoute";
import QRCodeHub from "@/pages/QRCodeHub";
import CrossRetailerHub from "@/pages/CrossRetailerHub";
import CrossRetailerCustomer from "@/pages/CrossRetailerCustomer";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";
import FulfillmentDashboard from "@/pages/admin/FulfillmentDashboard";
import BetaProgram from "@/pages/BetaProgram";
import StripeTestPage from "@/pages/StripeTestPage";
import InternalPlatformDashboard from "@/components/InternalPlatformDashboard";
import SiteTestingDashboard from "@/components/SiteTestingDashboard";
import ContinuousOptimizationDashboard from "@/components/ContinuousOptimizationDashboard";
import SEOHead from "@/components/SEOHead";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import RetailerOnboardAgentDemo from "@/pages/RetailerOnboardAgentDemo";
import StripeConnectSuccess from "@/pages/retailer/onboarding/success";
import ProductEntryAgentDemo from "@/pages/ProductEntryAgentDemo";
import RetailerAdminPanel from "@/pages/admin/RetailerAdminPanel";
import AgentDashboard from "@/pages/admin/AgentDashboard";
import WishlistPage from "@/pages/WishlistPage";
import OneClickCheckout from "@/pages/OneClickCheckout";
import InvitePage from "@/pages/InvitePage";
import InviteManagementPage from "@/pages/InviteManagementPage";
import ReferralSystemPage from "@/pages/ReferralSystemPage";
import NearMePage from "@/pages/NearMePage";
import ImageSearchPage from "@/pages/ImageSearchPage";
import AdvancedImageSearchPage from "./pages/AdvancedImageSearchPage";
import ShopperAIImagePage from "@/pages/ShopperAIImagePage";
import AIAgentsPage from "@/pages/AIAgentsPage";
import SearchResults from "@/pages/SearchResults";
import CartRestoreNotification from "@/components/cart-restore-notification";
import ShareReminder from "@/components/share-reminder";
import MallContextSync from "@/components/mall-context-sync";
import MallEventsDemo from "@/pages/mall-events-demo";
import Diagnostics from "./components/Diagnostics";
import P1FeaturesDemo from "@/pages/p1-features-demo";
import P1TestSuite from "@/pages/p1-test-suite";

import RetailerOnboarding from "@/pages/retailer-onboarding";
import WishlistNotifications from "@/components/wishlist-notifications";
import InventoryAlertsDemo from "@/pages/inventory-alerts-demo";
import LanguageDemo from "@/pages/language-demo";
import AccessibilitySettings from "@/pages/accessibility-settings";
import AccessibilityDemo from "@/pages/accessibility-demo";
import SocialRewards from "@/pages/social-rewards";
import ShopperOnboardingWalkthrough from "@/pages/shopper-onboarding-walkthrough";
import RetailerApply from "@/pages/retailer-apply";
import ExternalServicesDemo from "@/pages/ExternalServicesDemo";
import AdminExternalServices from "@/pages/AdminExternalServices";
import AdminVerification from "@/pages/AdminVerification";
import ShopperOnboarding from "@/pages/shopper-onboarding";
import ShopperOnboardingSimple from "@/pages/ShopperOnboardingSimple";
import EnhancedProfileSettings from "@/pages/enhanced-profile-settings";
import MallGiftCardSystem from "@/pages/mall-gift-card-system";
import MultiMallCart from "@/pages/multi-mall-cart";
import MobileResponsiveTest from "@/pages/mobile-responsive-test";
import SpiralTodoProgress from "@/pages/spiral-todo-progress";
import ComprehensiveFeatureTesting from "@/pages/comprehensive-feature-testing";
import AdminDeepTest from "@/pages/admin-deep-test";
import WishlistAlertsSystem from "@/pages/wishlist-alerts-system";
import WishlistAlerts from "./components/WishlistAlerts";
import WishlistDemo from "@/pages/wishlist-demo";
import TieredSpiralsEngine from "@/pages/tiered-spirals-engine";
import QRPickupSystem from "@/pages/qr-pickup-system";
import RetailerAutomationFlow from "@/pages/retailer-automation-flow";
import GiftCardBalanceChecker from "@/pages/gift-card-balance-checker";
import RetailerStripeSetup from "@/pages/retailer-stripe-setup";
import PushNotificationSettings from "@/pages/push-notification-settings";
import AdminTestDashboard from "@/pages/admin-test-dashboard";
import MobileAppBase from "@/pages/mobile-app-base";
import RetailerDataManagement from "@/pages/RetailerDataManagement";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import PaymentDemo from "@/pages/PaymentDemo";
import PaymentSystemDemo from "@/pages/PaymentSystemDemo";
import FunctionalityTestPage from "@/pages/FunctionalityTestPage";
import GPTIntegrationDemo from "@/pages/gpt-integration-demo";
import VercelIBMIntegration from "@/pages/vercel-ibm-integration";
import EnhancedCheckout from "@/pages/checkout-enhanced";
import PaymentSuccess from "@/pages/payment-success";
import PaymentFeaturesDemo from "@/pages/payment-features-demo";
import AdvancedFeaturesHub from "@/pages/advanced-features-hub";
import EnterpriseDashboard from "@/pages/enterprise-dashboard";
import RealTimeMonitoring from "@/pages/real-time-monitoring";
import InviteToShop from "@/pages/invite-to-shop";
import InviteResponse from "@/pages/invite-response";
import MyTrips from "@/pages/my-trips";
import RetailerIncentiveScheduler from "@/pages/retailer-incentive-scheduler";
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
import OrdersTestPage from "@/pages/orders-test";
import OrdersSimplePage from "@/pages/orders-simple";
import PrivacyPolicy from "@/pages/Privacy";
import TermsOfService from "@/pages/Terms";
import DMCAPage from "@/pages/DMCA";
import OrderDetailPage from "@/pages/order-detail";
import RetailerLoyaltyPage from "@/pages/loyalty-retailers";
import MallPerksPage from "@/pages/loyalty-mall-perks";
import AdminReviewsPage from "@/pages/admin-reviews";
import ReviewsDemoPage from "@/pages/reviews-demo";
import AdminTestimonialsPage from "@/pages/admin-testimonials";
import AdvancedPaymentHub from "@/pages/advanced-payment-hub";
import AIBusinessIntelligence from "@/pages/ai-business-intelligence";
import MobilePayments from "@/pages/mobile-payments";
import SpiralLoggingDemo from "@/pages/spiral-logging-demo";
import ButtonTestingSuite from "@/pages/button-testing-suite";
import SpiralAdminDashboard from "@/pages/spiral-admin-dashboard";
import SpiralTodoDashboard from "@/pages/spiral-todo-dashboard";
import AIOpsPage from "@/pages/ai-ops";
import AdminTestDashboardExisting from "@/pages/admin-test-dashboard";
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
import IntelligentWishlistPage from "@/pages/intelligent-wishlist";
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
import ProductCategoryTest from "@/pages/product-category-test";
import EnhancedFeaturesDemo from "@/pages/enhanced-features-demo";
import Subscriptions from "@/pages/subscriptions";
import SpiralCenters from "@/pages/spiral-centers";
import SpiralCentersSubscriptionDemo from "@/pages/spiral-centers-subscription-demo";
import AdvancedLogistics from "@/pages/advanced-logistics";
import Spiral100CompatibilityTest from "@/pages/spiral-100-compatibility-test";
import AiRetailerSignup from "@/pages/ai-retailer-signup";
import PendingApplication from "@/pages/pending-application";
import StoresPage from "@/pages/stores";
import AdminRetailerApplications from "@/pages/admin-retailer-applications";
import AiRetailerDemo from "@/pages/ai-retailer-demo";
import AdminLogin from "@/pages/AdminLogin";
import CloudantAdminDashboard from "@/pages/AdminDashboard";
import RetailerInventoryDashboard from "@/components/RetailerInventoryDashboard";
import ProductsPage from "@/pages/products";
import ProductsPageNew from "@/pages/ProductsPage";
import MallsPageNew from "@/pages/MallsPage";
import NavigationTest from "@/pages/navigation-test";
import CompleteFunctionalityTest from "@/pages/complete-functionality-test";
import CodeContinuityTest from "@/pages/code-continuity-test";
import InviteFriends from "@/pages/invite-friends";
import UpgradeSuccess from "@/pages/upgrade-success";
import AIShoppingPage from "@/pages/AIShoppingPage";


function Router() {
  const [location] = useLocation();
  
  // Update meta tags and track page views when route changes
  useEffect(() => {
    updateMetaTags(location);
    
    // Track page views with Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: location
      });
    }
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/store/:id" component={Store} />
      <Route path="/stores" component={StoresPage} />
      <Route path="/retailers/:storeSlug" component={RetailerProfilePage} />
      <Route path="/products" component={ProductsPageNew} />
      <Route path="/product/:id" component={EnhancedProductDetail} />
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
      <Route path="/malls" component={MallsPageNew} />
      <Route path="/account" component={Account} />
      <Route path="/retailer-login" component={RetailerLogin} />
      <Route path="/retailer-dashboard" component={RetailerDashboard} />
      <Route path="/shopper-dashboard" component={ShopperDashboardNew} />
      <Route path="/retailer-portal" component={RetailerDashboardNew} />
      <Route path="/retailer-stripe-setup" component={RetailerStripeSetup} />
      <Route path="/marketing-center" component={MarketingCenter} />
      <Route path="/analytics-dashboard" component={OldAnalyticsDashboard} />
      <Route path="/social-feed" component={SocialFeed} />
      <Route path="/order-confirmation/:orderId?" component={OrderConfirmation} />
      <Route path="/spiral-videos" component={SpiralVideos} />
      <Route path="/spiral-features" component={SpiralFeatures} />
      <Route path="/invite-friend" component={InviteFriend} />
      <Route path="/invite-friends" component={InviteFriends} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/retailer-testimonials" component={RetailerTestimonials} />
      <Route path="/retailer-analytics" component={RetailerAnalytics} />

      <Route path="/retailer-insights" component={RetailerInsights} />
      <Route path="/test-flow" component={TestFlow} />
      <Route path="/about" component={About} />
      <Route path="/orders" component={OrdersSimplePage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/about-spiral" component={About} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/visual-search" component={VisualSearchPage} />
      <Route path="/intelligent-wishlist" component={IntelligentWishlistPage} />
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
      <Route path="/feature-audit" component={Feature14Demo} />
      <Route path="/competitive-analysis" component={CompetitiveAnalysis} />
      <Route path="/gift-card-system" component={GiftCards} />
      <Route path="/retailer-demo" component={RetailerDashboardNew} />
      <Route path="/store/:storeId/reviews" component={ReviewsDemoPage} />
      <Route path="/p0-features-demo" component={P1FeaturesDemo} />
      <Route path="/p1-features-demo" component={P1FeaturesDemo} />
      <Route path="/p1-test-suite" component={P1TestSuite} />
      <Route path="/qr-hub" component={QRCodeHub} />
      <Route path="/cross-retailer" component={CrossRetailerHub} />
      <Route path="/cross-retailer-customer" component={CrossRetailerCustomer} />
      <Route path="/admin/analytics" component={AnalyticsDashboard} />
      <Route path="/admin/fulfillment" component={FulfillmentDashboard} />
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
      <Route path="/retailer/data-management" component={RetailerDataManagement} />
      <Route path="/checkout-new" component={CheckoutPage} />
      <Route path="/payment-success" component={PaymentSuccessPage} />
      <Route path="/payment-demo" component={PaymentDemo} />
      <Route path="/payment-system" component={PaymentSystemDemo} />
      <Route path="/functionality-test" component={FunctionalityTestPage} />
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
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/dmca" component={DMCAPage} />
      <Route path="/comprehensive-feature-test" component={ComprehensiveFeatureTest} />
      <Route path="/retailer-onboarding-demo" component={RetailerOnboardingDemo} />
      <Route path="/retailer-onboard-agent" component={RetailerOnboardAgentDemo} />
      <Route path="/retailer/onboarding/success" component={StripeConnectSuccess} />
      <Route path="/product-entry-agent" component={ProductEntryAgentDemo} />
      <Route path="/admin/retailers" component={RetailerAdminPanel} />
      <Route path="/admin/agents" component={AgentDashboard} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/checkout" component={OneClickCheckout} />
      <Route path="/invite/:inviteId" component={InvitePage} />
      <Route path="/invites" component={InviteManagementPage} />
      <Route path="/referrals" component={ReferralSystemPage} />
      <Route path="/near-me" component={NearMePage} />
      <Route path="/image-search" component={ImageSearchPage} />
      <Route path="/advanced-image-search" component={AdvancedImageSearchPage} />
      <Route path="/shopper-ai-image" component={ShopperAIImagePage} />
      <Route path="/ai-shopping" component={AIShoppingPage} />
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
      <Route path="/user-auth-demo" component={UserAuthDemo} />
      <Route path="/product-category-test" component={ProductCategoryTest} />
      <Route path="/checkout-enhanced" component={EnhancedCheckout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment-features-demo" component={PaymentFeaturesDemo} />
      <Route path="/advanced-features-hub" component={AdvancedFeaturesHub} />
      <Route path="/enterprise-dashboard" component={EnterpriseDashboard} />
      <Route path="/real-time-monitoring" component={RealTimeMonitoring} />
      <Route path="/invite-to-shop" component={InviteToShop} />
      <Route path="/invite/:tripId" component={InviteResponse} />
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/retailer-incentive-scheduler" component={RetailerIncentiveScheduler} />
      <Route path="/social-rewards" component={SocialRewards} />
      <Route path="/shopper-onboarding-walkthrough" component={ShopperOnboardingWalkthrough} />
      <Route path="/retailer-apply" component={RetailerApply} />
      <Route path="/advanced-payment-hub" component={AdvancedPaymentHub} />
      <Route path="/ai-business-intelligence" component={AIBusinessIntelligence} />
      <Route path="/mobile-payments" component={MobilePayments} />
      <Route path="/spiral-logging-demo" component={SpiralLoggingDemo} />
      <Route path="/spiral-admin" component={SpiralAdminDashboard} />
      <Route path="/spiral-admin/button-testing" component={ButtonTestingSuite} />
      <Route path="/spiral-todo" component={SpiralTodoDashboard} />
      <Route path="/ai-ops" component={AIOpsPage} />
      <Route path="/external-services" component={ExternalServicesDemo} />
      <Route path="/admin/external-services" component={AdminExternalServices} />
      <Route path="/admin/verification" component={AdminVerification} />
      <Route path="/shopper-onboarding" component={ShopperOnboarding} />
      <Route path="/shopper-onboarding-simple" component={ShopperOnboardingSimple} />
      <Route path="/onboarding" component={ShopperOnboarding} />
      <Route path="/shopper-dashboard" component={ShopperDashboard} />
      <Route path="/enhanced-profile-settings" component={EnhancedProfileSettings} />
      <Route path="/mall-gift-card-system" component={MallGiftCardSystem} />
      <Route path="/multi-mall-cart" component={MultiMallCart} />
      <Route path="/mobile-responsive-test" component={MobileResponsiveTest} />
      <Route path="/mobile-test" component={MobileResponsiveTest} />
      <Route path="/spiral-todo-progress" component={SpiralTodoProgress} />
      <Route path="/comprehensive-feature-testing" component={ComprehensiveFeatureTesting} />
      <Route path="/admin/spiral-agent/deep-test" component={AdminDeepTest} />
      <Route path="/wishlist-alerts-system" component={WishlistAlertsSystem} />
      <Route path="/wishlist-alerts" component={WishlistAlerts} />
      <Route path="/wishlist-demo" component={WishlistDemo} />
      <Route path="/tiered-spirals-engine" component={TieredSpiralsEngine} />
      <Route path="/qr-pickup-system" component={QRPickupSystem} />
      <Route path="/retailer-automation-flow" component={RetailerAutomationFlow} />
      <Route path="/gift-card-balance-checker" component={GiftCardBalanceChecker} />
      <Route path="/push-notification-settings" component={PushNotificationSettings} />
      <Route path="/mobile-app-base" component={MobileAppBase} />
      <Route path="/gpt-integration-demo" component={GPTIntegrationDemo} />
      <Route path="/vercel-ibm-integration" component={VercelIBMIntegration} />
      <Route path="/enhanced-features-demo" component={EnhancedFeaturesDemo} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/spiral-centers" component={SpiralCenters} />
      <Route path="/spiral-centers-subscription-demo" component={SpiralCentersSubscriptionDemo} />
      <Route path="/advanced-logistics" component={AdvancedLogistics} />
      <Route path="/spiral-100-compatibility-test" component={Spiral100CompatibilityTest} />
      <Route path="/ai-retailer-signup" component={AiRetailerSignup} />
      <Route path="/pending-application/:id" component={PendingApplication} />
      <Route path="/admin/retailer-applications" component={AdminRetailerApplications} />
      <Route path="/ai-retailer-demo" component={AiRetailerDemo} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-dashboard" component={SpiralAdminDashboard} />
      <Route path="/cloudant-admin" component={CloudantAdminDashboard} />
      <Route path="/retailer-inventory" component={RetailerInventoryDashboard} />
      <Route path="/retailer-dashboard" component={RetailerInventoryDashboard} />
      <Route path="/admin-test-dashboard" component={AdminTestDashboardExisting} />
      <Route path="/navigation-test" component={NavigationTest} />
      <Route path="/complete-functionality-test" component={CompleteFunctionalityTest} />
      <Route path="/code-continuity-test" component={CodeContinuityTest} />
      <Route path="/upgrade-success" component={UpgradeSuccess} />
      <Route path="/ai-agents" component={AIAgentsPage} />
      <Route path="/dashboard-hub" component={lazy(() => import("./pages/DashboardHubPage"))} />
      <Route path="/soap-g-dashboard" component={lazy(() => import("./pages/SOAPGDashboardPage"))} />
      <Route path="/soap-g-test" component={lazy(() => import("./pages/SOAPGTestPage"))} />
      <Route path="/mall-manager-dashboard" component={lazy(() => import("./pages/MallManagerPage"))} />
      <Route path="/retailer-ai-assistant" component={lazy(() => import("./pages/RetailerAIPage"))} />
      <Route path="/shopper-ai-agent" component={lazy(() => import("./pages/ShopperAIPage"))} />
      <Route path="/beta" component={BetaProgram} />
      <Route path="/stripe-test" component={StripeTestPage} />
      <Route path="/internal-platform-monitor" component={InternalPlatformDashboard} />
      <Route path="/site-testing-dashboard" component={SiteTestingDashboard} />
      <Route path="/continuous-optimization-dashboard" component={ContinuousOptimizationDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityInitialization />
        <MallContextSync />
        <CartRestoreNotification />
        <ShareReminder />
        
        {/* SPIRAL Platform Optimization Components */}
        <SEOHead />
        <PerformanceOptimizer />
        <GoogleAnalytics />
        
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <>
      <MainRouter />
      <Diagnostics />
    </>
  );
}

export default App;
