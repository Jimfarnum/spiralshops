import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ShoppingCart, 
  MapPin, 
  Star, 
  Gift, 
  Truck, 
  Share2,
  Heart,
  Bell
} from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const cartItemCount = getTotalItems();
  const { toast } = useToast();

  const quickActions = [
    {
      icon: ShoppingCart,
      label: "Cart",
      href: "/cart",
      count: cartItemCount,
      color: "bg-[var(--spiral-coral)]",
      textColor: "text-white"
    },
    {
      icon: MapPin,
      label: "Near Me",
      action: () => {
        navigator.geolocation?.getCurrentPosition(
          (position) => {
            toast({
              title: "Location found",
              description: "Showing stores near you",
            });
            // In real app: navigate to products with location filter
            window.location.href = "/products?location=nearby";
          },
          () => {
            toast({
              title: "Location access denied",
              description: "Please enable location services",
              variant: "destructive"
            });
          }
        );
      },
      color: "bg-[var(--spiral-sage)]",
      textColor: "text-white"
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/wishlist",
      color: "bg-[var(--spiral-gold)]",
      textColor: "text-white"
    },
    {
      icon: Star,
      label: "Reviews",
      action: () => {
        toast({
          title: "Review Center",
          description: "Share your local shopping experiences",
        });
      },
      color: "bg-[var(--spiral-navy)]",
      textColor: "text-white"
    },
    {
      icon: Gift,
      label: "Rewards",
      href: "/spirals",
      color: "bg-gradient-to-r from-[var(--spiral-coral)] to-[var(--spiral-gold)]",
      textColor: "text-white"
    },
    {
      icon: Share2,
      label: "Share",
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'SPIRAL - Everything Local',
            text: 'Discover amazing local businesses in your area!',
            url: window.location.origin
          });
        } else {
          navigator.clipboard.writeText(window.location.origin);
          toast({
            title: "Link copied",
            description: "Share SPIRAL with your friends!",
          });
        }
      },
      color: "bg-[var(--spiral-cream)]",
      textColor: "text-[var(--spiral-navy)]"
    },
  ];

  const handleQuickAction = (action: any) => {
    if (action.action) {
      action.action();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickActions.map((action, index) => {
          const ActionButton = (
            <button
              onClick={() => handleQuickAction(action)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-lg ${action.color} ${action.textColor} hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md min-h-[80px]`}
            >
              <action.icon className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">{action.label}</span>
              
              {action.count !== undefined && action.count > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {action.count > 99 ? '99+' : action.count}
                </div>
              )}
            </button>
          );

          if (action.href) {
            return (
              <Link key={index} href={action.href}>
                {ActionButton}
              </Link>
            );
          }

          return <div key={index}>{ActionButton}</div>;
        })}
      </div>

      {/* Featured Notification */}
      <div className="mt-4 p-3 bg-gradient-to-r from-[var(--spiral-cream)] to-[var(--spiral-sage)]/20 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--spiral-navy)]">Enable Notifications</p>
            <p className="text-xs text-gray-600">Get alerts for local deals and new stores</p>
          </div>
        </div>
      </div>
    </div>
  );
}