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
import Events from "@/pages/events";
import MultiCart from "@/pages/multi-cart";
import SplitFulfillment from "@/pages/split-fulfillment";
import { ExploreSPIRALsPage, RedeemSPIRALsPage, LoyaltyProgramPage, DeliveryOptionsPage } from "@/pages/coming-soon";
import CartRestoreNotification from "@/components/cart-restore-notification";
import ShareReminder from "@/components/share-reminder";
import MallContextSync from "@/components/mall-context-sync";

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
      <Route path="/events" component={Events} />
      <Route path="/multi-cart" component={MultiCart} />
      <Route path="/split-fulfillment" component={SplitFulfillment} />
      <Route path="/feature-audit" component={() => import('@/components/feature-parity-audit').then(m => m.default)} />
      <Route path="/competitive-analysis" component={() => import('@/components/competitive-analysis').then(m => m.default)} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
