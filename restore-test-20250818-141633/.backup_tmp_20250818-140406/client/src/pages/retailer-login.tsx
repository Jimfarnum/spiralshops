import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Store, Mail, Lock, User, Building2 } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

const RetailerLogin = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    address: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app would authenticate with backend
    if (loginData.email && loginData.password) {
      toast({
        title: "Login successful!",
        description: "Welcome to your SPIRAL retailer dashboard.",
      });
      setLocation('/retailer-dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Mock signup - in real app would create account
    toast({
      title: "Account created!",
      description: "Your retailer application has been submitted for review.",
    });
    setLocation('/retailer-dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
            SPIRAL Retailer Portal
          </h1>
          <p className="text-xl text-gray-600 mb-2 font-['Inter']">
            Join the local commerce revolution
          </p>
          <p className="text-[var(--spiral-coral)] font-semibold font-['Inter']">
            Built for real stores. Powered by real people.
          </p>
        </div>

        {/* Login/Signup Tabs */}
        <Card className="shadow-xl border-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-t-xl">
              <TabsTrigger value="login" className="rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">Join SPIRAL</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  Welcome Back
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Sign in to your retailer dashboard to manage your store and products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 rounded-xl"
                        placeholder="your.email@business.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 rounded-xl"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href="/retailer-forgot-password" className="text-sm text-[var(--spiral-coral)] hover:underline font-['Inter']">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white py-3 rounded-xl font-['Inter']"
                  >
                    Sign In to Dashboard
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 font-['Inter']">
                    Demo credentials: retailer@spiral.com / password123
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-[var(--spiral-navy)] font-['Poppins']">
                  Join SPIRAL Network
                </CardTitle>
                <CardDescription className="font-['Inter']">
                  Connect your business with local customers and grow your community presence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business-name" className="text-sm font-medium text-gray-700 font-['Inter']">
                        Business Name
                      </Label>
                      <div className="relative mt-1">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="business-name"
                          value={signupData.businessName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, businessName: e.target.value }))}
                          className="pl-10 rounded-xl"
                          placeholder="Your Store Name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="owner-name" className="text-sm font-medium text-gray-700 font-['Inter']">
                        Owner Name
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="owner-name"
                          value={signupData.ownerName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, ownerName: e.target.value }))}
                          className="pl-10 rounded-xl"
                          placeholder="Your Full Name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700 font-['Inter']">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 rounded-xl"
                        placeholder="business@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700 font-['Inter']">
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="signup-password"
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 rounded-xl"
                          placeholder="Create password"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 font-['Inter']">
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="confirm-password"
                          type="password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 rounded-xl"
                          placeholder="Confirm password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white py-3 rounded-xl font-['Inter']"
                  >
                    Create Retailer Account
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-[var(--spiral-sage)]/10 rounded-xl">
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2 font-['Inter']">
                    Why Join SPIRAL?
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 font-['Inter']">
                    <li>• Connect directly with local customers</li>
                    <li>• Boost sales through community loyalty rewards</li>
                    <li>• Manage inventory and promotions easily</li>
                    <li>• Access valuable customer insights</li>
                  </ul>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 font-['Inter']">
            Need help getting started? 
            <Link href="/retailer-support" className="text-[var(--spiral-coral)] hover:underline ml-1">
              Contact our team
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RetailerLogin;