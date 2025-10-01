import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  Store, 
  User, 
  Settings,
  Heart,
  Search,
  MapPin,
  Gift,
  CreditCard,
  Bell,
  Star,
  Truck,
  Phone,
  Shield,
  Rocket,
  Activity
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onToggle, onClose }) => {
  const [location] = useLocation();

  const navItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Home', 
      path: '/',
      description: 'Back to homepage'
    },
    { 
      icon: <ShoppingBag className="w-5 h-5" />, 
      label: 'Shop', 
      path: '/products',
      description: 'Browse products'
    },
    { 
      icon: <Store className="w-5 h-5" />, 
      label: 'Stores', 
      path: '/stores',
      description: 'Local businesses'
    },
    { 
      icon: <MapPin className="w-5 h-5" />, 
      label: 'Mall Directory', 
      path: '/mall-directory',
      description: 'Find nearby stores'
    },
    { 
      icon: <Gift className="w-5 h-5" />, 
      label: 'Loyalty', 
      path: '/loyalty',
      description: 'Loyalty rewards & SPIRALs'
    },
    { 
      icon: <CreditCard className="w-5 h-5" />, 
      label: 'Wallet', 
      path: '/wallet',
      description: 'SPIRAL Wallet'
    },
    { 
      icon: <Star className="w-5 h-5" />, 
      label: 'Social Rewards', 
      path: '/social-rewards',
      description: 'Earn by sharing',
      badge: 'NEW'
    },
    { 
      icon: <Truck className="w-5 h-5" />, 
      label: 'Orders', 
      path: '/orders',
      description: 'Track purchases'
    },
    { 
      icon: <User className="w-5 h-5" />, 
      label: 'Profile', 
      path: '/profile',
      description: 'Account settings'
    },
    { 
      icon: <Rocket className="w-5 h-5" />, 
      label: 'Function Agent', 
      path: '/platform-demo',
      description: 'Platform demo',
      badge: 'DEMO'
    },
    { 
      icon: <Shield className="w-5 h-5" />, 
      label: 'Trust', 
      path: '/trust',
      description: 'Security & reliability'
    },
    { 
      icon: <Activity className="w-5 h-5" />, 
      label: 'Admin', 
      path: '/spiral-admin-login',
      description: 'Admin dashboard'
    }
  ];

  const quickActions = [
    {
      icon: <Search className="w-4 h-4" />,
      label: 'Search',
      path: '/products',
      color: 'bg-blue-500'
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: 'Alerts',
      path: '/alerts',
      color: 'bg-orange-500'
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Payment',
      path: '/payment-methods',
      color: 'bg-green-500'
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Trust',
      path: '/trust',
      color: 'bg-green-500'
    }
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="md:hidden touch-target p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Content */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[var(--spiral-navy)] to-[var(--spiral-coral)] text-white">
          <div>
            <h2 className="text-lg font-bold">SPIRAL</h2>
            <p className="text-sm text-white/80">Local Shopping Platform</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 touch-target"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b">
          <p className="text-sm font-medium text-gray-600 mb-3">Quick Actions</p>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link 
                key={action.path}
                to={action.path}
                onClick={onClose}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`${action.color} text-white p-2 rounded-lg mb-1`}>
                  {action.icon}
                </div>
                <span className="text-xs text-gray-600">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => {
                    console.log(`MobileNav: Navigating to ${item.path} (${item.label})`);
                    onClose();
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg mb-1 transition-all duration-200 touch-target
                    ${isActive 
                      ? 'bg-[var(--spiral-coral)]/10 text-[var(--spiral-coral)] border-l-4 border-[var(--spiral-coral)]' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`${isActive ? 'text-[var(--spiral-coral)]' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-yellow-400 text-black text-xs px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-2">
            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-800 transition-colors touch-target"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </Link>
            <Link
              to="/help"
              onClick={onClose}
              className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-800 transition-colors touch-target"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">Help & Support</span>
            </Link>
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-gray-500 text-center">
              SPIRAL v2.0 • Local Commerce Platform
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;