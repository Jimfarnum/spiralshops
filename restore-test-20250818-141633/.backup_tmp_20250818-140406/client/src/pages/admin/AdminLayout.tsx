import { Link, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Bot, BarChart3, Shield, Home } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'SPIRAL Home', icon: Home },
    { path: '/admin/retailers', label: 'Retailer Review', icon: Users },
    { path: '/admin/agents', label: 'Agent Monitor', icon: Bot },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-teal-600" />
              <div>
                <h1 className="text-xl font-bold text-teal-600">SPIRAL Admin Panel</h1>
                <p className="text-sm text-gray-600">Internal Operations Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Admin User</span>
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-teal-600">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r min-h-screen p-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive ? 'bg-teal-600 text-white' : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Admin Stats Card */}
          <Card className="mt-8">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">System Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Agents:</span>
                  <span className="text-blue-600 font-medium">4 Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Retailers:</span>
                  <span className="text-purple-600 font-medium">12 Total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}