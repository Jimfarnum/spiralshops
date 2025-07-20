import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bell, Share2, Store, Calendar, Star } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useLoyaltyStore } from '@/lib/loyaltyStore';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

const ProfileSettings = () => {
  const { user } = useAuthStore();
  const { spiralBalance, totalEarned, totalRedeemed } = useLoyaltyStore();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    retailerSuggestions: true,
    spiralExperiences: true,
    emailNotifications: true,
    pushNotifications: false,
    locationRadius: '10',
    preferredCategories: ['local-food', 'retail'],
  });

  const handleToggle = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSave = () => {
    // This would typically save to a backend API
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] font-['Poppins']">Profile & Settings</h1>
          <p className="text-gray-600 mt-2 text-lg font-['Inter']">Manage your SPIRAL experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-[var(--spiral-sage)]/20 to-[var(--spiral-coral)]/20">
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  SPIRAL Profile
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Your loyalty program status
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-[var(--spiral-navy)] font-['Poppins']">
                      {user?.name || 'SPIRAL Member'}
                    </h3>
                    <Badge variant="outline" className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] mt-2">
                      Active Member
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <div className="bg-[var(--spiral-sage)]/10 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[var(--spiral-coral)] font-['Poppins']">
                          {spiralBalance}
                        </p>
                        <p className="text-sm text-gray-600 font-['Inter']">Current SPIRALs</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                          {totalEarned}
                        </p>
                        <p className="text-xs text-gray-600 font-['Inter']">Total Earned</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-lg font-semibold text-[var(--spiral-navy)] font-['Poppins']">
                          {totalRedeemed}
                        </p>
                        <p className="text-xs text-gray-600 font-['Inter']">Total Redeemed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* SPIRAL Experience Settings */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  SPIRAL Experience Settings
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Customize how SPIRAL helps you discover local businesses and experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="retailer-suggestions" className="text-sm font-medium text-[var(--spiral-navy)] font-['Poppins']">
                      Retailer Suggestions
                    </Label>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Get personalized recommendations for nearby stores and businesses
                    </p>
                  </div>
                  <Switch
                    id="retailer-suggestions"
                    checked={settings.retailerSuggestions}
                    onCheckedChange={(checked) => handleToggle('retailerSuggestions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="spiral-experiences" className="text-sm font-medium text-[var(--spiral-navy)] font-['Poppins']">
                      SPIRAL Experiences
                    </Label>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Receive notifications about local events, pop-ups, and community experiences
                    </p>
                  </div>
                  <Switch
                    id="spiral-experiences"
                    checked={settings.spiralExperiences}
                    onCheckedChange={(checked) => handleToggle('spiralExperiences', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location-radius" className="text-sm font-medium text-[var(--spiral-navy)] font-['Poppins']">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Discovery Radius
                  </Label>
                  <Select value={settings.locationRadius} onValueChange={(value) => setSettings(prev => ({ ...prev, locationRadius: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 font-['Inter']">
                    How far to search for retailer suggestions and experiences
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Choose how you want to stay updated about your SPIRAL activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="email-notifications" className="text-sm font-medium text-[var(--spiral-navy)] font-['Poppins']">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Order confirmations, SPIRAL balance updates, and special offers
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="push-notifications" className="text-sm font-medium text-[var(--spiral-navy)] font-['Poppins']">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Real-time alerts for nearby deals and experiences
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins'] flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display-name" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Display Name
                    </Label>
                    <Input
                      id="display-name"
                      value={user?.name || ''}
                      className="mt-1 rounded-lg"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      className="mt-1 rounded-lg"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-8 py-3 rounded-xl"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileSettings;