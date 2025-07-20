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
import { ProductsPage } from "@/pages/products";
import { ProductDetailPage } from "@/pages/product-detail";
import { ExploreSPIRALsPage, RedeemSPIRALsPage, LoyaltyProgramPage, DeliveryOptionsPage } from "@/pages/coming-soon";
import CartRestoreNotification from "@/components/cart-restore-notification";

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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
