import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2 } from "lucide-react";
import RetailerOnboardingFlow from "@/components/RetailerOnboardingFlow";

const RetailerOnboardingNewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/retailer-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Join SPIRAL Network
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Welcome to SPIRAL Retailer Network
              </h2>
              <p className="text-blue-800 dark:text-blue-200 max-w-2xl mx-auto">
                Join thousands of retailers connecting with shoppers across multiple malls. 
                Our platform provides everything you need to grow your business, from inventory 
                management to loyalty program integration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">42+</div>
                  <div className="text-sm text-blue-700">Active Retailers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">3,500+</div>
                  <div className="text-sm text-blue-700">Active Shoppers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$450K+</div>
                  <div className="text-sm text-blue-700">Platform Sales</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Flow */}
        <RetailerOnboardingFlow />

        {/* Help Section */}
        <Card className="mt-8 border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Need Help?
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Our onboarding specialists are here to help you get started. 
                Contact us at <strong>retailers@spiralshops.com</strong> or call <strong>(555) 123-SPIRAL</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RetailerOnboardingNewPage;