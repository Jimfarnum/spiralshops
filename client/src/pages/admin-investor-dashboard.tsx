import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import InvestorDashboard from "@/components/InvestorDashboard";

const AdminInvestorDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  SPIRAL Admin - Investor Dashboard
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Notice */}
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  🔒 Administrative Access
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  You are accessing the Investor Dashboard with administrative privileges. 
                  This system allows you to generate mock investor reports for pre-launch testing 
                  and validation. All generated reports include SPIRAL branding and comprehensive 
                  platform metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investor Dashboard Component */}
        <InvestorDashboard />
      </div>
    </div>
  );
};

export default AdminInvestorDashboardPage;