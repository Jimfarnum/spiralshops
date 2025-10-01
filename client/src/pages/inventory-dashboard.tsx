import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import Footer from '@/components/footer';
import InventoryAlerts from '@/components/inventory-alerts';
import LanguageSelector from '@/components/language-selector';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Settings, Globe, Bell, Package, TrendingUp, AlertTriangle } from 'lucide-react';

export default function InventoryDashboard() {
  const [, navigate] = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { toast } = useToast();

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    // In a real app, this would trigger a re-render with translated content
    console.log('Language changed to:', language);
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,99.6%)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 font-['Inter']">
            <li><Link href="/" className="hover:text-[hsl(183,100%,23%)]">Home</Link></li>
            <li>/</li>
            <li><Link href="/account" className="hover:text-[hsl(183,100%,23%)]">Account</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">Inventory & Settings</li>
          </ol>
        </nav>

        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/account')}
            className="mb-4 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Poppins'] mb-4">
            Inventory & Settings
          </h1>
          <p className="text-xl text-gray-600 font-['Inter']">
            Monitor your saved items and customize your experience
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory Alerts</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Language</span>
              <span className="sm:hidden">Lang</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notify</span>
            </TabsTrigger>
          </TabsList>

          {/* Inventory Alerts Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-2">
                  Real-Time Inventory Monitoring
                </h2>
                <p className="text-gray-600 font-['Inter']">
                  Track availability of your saved items and get notified when stock levels change.
                </p>
              </div>
              
              <InventoryAlerts className="w-full" />
            </div>
          </TabsContent>

          {/* Language Settings Tab */}
          <TabsContent value="language" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-2">
                  Language & Localization
                </h2>
                <p className="text-gray-600 font-['Inter']">
                  Choose your preferred language for the SPIRAL interface and shopping experience.
                </p>
              </div>

              <div className="max-w-2xl">
                <LanguageSelector 
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  className="w-full"
                />
              </div>

              {/* Language Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Full Interface Translation</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Navigation, buttons, forms, and all user interface elements are translated to your selected language.
                  </p>
                </div>

                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">Localized Content</h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    Product descriptions, store information, and promotional content adapted to your region and language.
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Translation Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">English (US)</span>
                    <Badge className="bg-green-100 text-green-800">100% Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Spanish (ES)</span>
                    <Badge className="bg-green-100 text-green-800">95% Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">French (FR)</span>
                    <Badge className="bg-yellow-100 text-yellow-800">60% Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">German (DE)</span>
                    <Badge className="bg-yellow-100 text-yellow-800">45% Complete</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-2">
                  Notification Preferences
                </h2>
                <p className="text-gray-600 font-['Inter']">
                  Control how and when you receive updates about your saved items and SPIRAL activity.
                </p>
              </div>

              {/* Notification Settings */}
              <div className="space-y-6">
                <div className="p-6 border rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Get notified when items in your wishlist are running low in stock.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Browser notifications</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email alerts</span>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS notifications</span>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Order Updates</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Receive updates about your orders, shipments, and deliveries.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Order confirmations</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Shipping updates</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Delivery notifications</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Marketing & Promotions</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Stay informed about special offers, new products, and SPIRAL updates.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly deals newsletter</span>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New store notifications</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SPIRAL program updates</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button 
                  className="bg-[hsl(183,100%,23%)] hover:bg-[hsl(183,60%,40%)]"
                  onClick={() => {
                    toast({
                      title: "Settings Saved",
                      description: "Your notification preferences have been updated.",
                      duration: 2000
                    });
                  }}
                >
                  Save Preferences
                </Button>
                <Button variant="outline">
                  Reset to Default
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}