import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Store from "@/pages/store";
import NotFound from "@/pages/not-found";
import ProductSearch from "./ProductSearch";
import ProductDetail from "./ProductDetail";
import Cart from "@/pages/cart";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import Checkout from "@/pages/checkout";
import Mall from "@/pages/mall";
import Spirals from "@/pages/spirals";
import ProfileSettings from "@/pages/profile-settings";
import { ProductsPage } from "@/pages/products";
import { ProductDetailPage } from "@/pages/product-detail";
import MallDirectory from "@/pages/mall-directory";
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
import About from "@/pages/about";
import { ExploreSPIRALsPage, RedeemSPIRALsPage, LoyaltyProgramPage, DeliveryOptionsPage } from "@/pages/coming-soon";
import CartRestoreNotification from "@/components/cart-restore-notification";
import ShareReminder from "@/components/share-reminder";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/store/:id" component={Store} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/search" component={ProductSearch} />
      <Route path="/search/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/mall/:mallName" component={Mall} />
      <Route path="/mall" component={Mall} />
      <Route path="/spirals" component={Spirals} />
      <Route path="/profile" component={ProfileSettings} />
      <Route path="/mall-directory" component={MallDirectory} />
      <Route path="/account" component={Account} />
      <Route path="/retailer-login" component={RetailerLogin} />
      <Route path="/retailer-dashboard" component={RetailerDashboard} />
      <Route path="/marketing-center" component={MarketingCenter} />
      <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
      <Route path="/social-feed" component={SocialFeed} />
      <Route path="/order-confirmation/:orderId?" component={OrderConfirmation} />
      <Route path="/spiral-videos" component={SpiralVideos} />
      <Route path="/spiral-features" component={SpiralFeatures} />
      <Route path="/invite-friend" component={InviteFriend} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/retailer-testimonials" component={RetailerTestimonials} />
      <Route path="/about" component={About} />
      <Route path="/explore-spirals" component={ExploreSPIRALsPage} />
      <Route path="/redeem-spirals" component={RedeemSPIRALsPage} />
      <Route path="/loyalty-program" component={LoyaltyProgramPage} />
      <Route path="/delivery-options" component={DeliveryOptionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartRestoreNotification />
        <ShareReminder />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
