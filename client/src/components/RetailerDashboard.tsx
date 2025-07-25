import React, { useState } from "react";
import { Link } from "wouter";
import { Calculator, Trophy, Megaphone, Settings, BarChart3, Store } from "lucide-react";
import BusinessCalculator from "@/pages/business-calculator";
import Feature15Demo from "@/pages/feature-15-demo";

const RetailerDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "calculator":
        return <BusinessCalculator />;
      case "referrals":
        return <Feature15Demo />;
      case "ads":
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Ad Planner</h2>
            <p className="text-gray-600 mb-4">Manage your advertising campaigns and track performance.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">🚀 Coming Soon: Advanced advertising tools for social media campaigns, targeted promotions, and performance analytics.</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Your Business Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input type="email" className="w-full p-2 border border-gray-300 rounded-md" placeholder="contact@yourbusiness.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Category</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Select Category</option>
                  <option>Retail</option>
                  <option>Restaurant</option>
                  <option>Services</option>
                  <option>Health & Beauty</option>
                </select>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Save Changes
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Welcome to SPIRAL Retailer Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Use these powerful tools to grow your business, calculate fees, track referrals, and manage your SPIRAL presence.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <Calculator className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-purple-900">Fee Calculator</h3>
                  <p className="text-sm text-purple-700">Calculate transaction fees and profit margins</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Trophy className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-blue-900">Viral Referrals</h3>
                  <p className="text-sm text-blue-700">Track referrals and earn SPIRAL rewards</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-green-900">Analytics</h3>
                  <p className="text-sm text-green-700">View performance and customer insights</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-semibold">$12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SPIRAL Earnings</span>
                    <span className="font-semibold text-purple-600">2,490 SPIRALs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referrals</span>
                    <span className="font-semibold text-blue-600">15 Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/retailer-portal" className="block w-full bg-purple-600 text-white text-center py-2 rounded-md hover:bg-purple-700">
                    Manage Products
                  </Link>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200">
                    View Orders
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200">
                    Customer Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        <div className="p-6">
          <Link href="/" className="font-bold text-xl text-purple-700 hover:text-purple-800">
            SPIRAL
          </Link>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <button
            onClick={() => setActiveSection("overview")}
            className={`flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 ${
              activeSection === "overview" ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600" : "text-gray-700"
            }`}
          >
            <Store className="w-5 h-5" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveSection("calculator")}
            className={`flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 ${
              activeSection === "calculator" ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600" : "text-gray-700"
            }`}
          >
            <Calculator className="w-5 h-5" />
            Fee Calculator
          </button>
          
          <button
            onClick={() => setActiveSection("referrals")}
            className={`flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 ${
              activeSection === "referrals" ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600" : "text-gray-700"
            }`}
          >
            <Trophy className="w-5 h-5" />
            Referrals & Rewards
          </button>
          
          <button
            onClick={() => setActiveSection("ads")}
            className={`flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 ${
              activeSection === "ads" ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600" : "text-gray-700"
            }`}
          >
            <Megaphone className="w-5 h-5" />
            Ad Planner
          </button>
          
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 ${
              activeSection === "settings" ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600" : "text-gray-700"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="mt-8 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Quick Links</div>
          <div className="space-y-1">
            <Link href="/retailer-analytics" className="block text-sm text-gray-600 hover:text-purple-600">
              Advanced Analytics
            </Link>
            <Link href="/marketing-center" className="block text-sm text-gray-600 hover:text-purple-600">
              Marketing Center
            </Link>
            <Link href="/retailer-insights" className="block text-sm text-gray-600 hover:text-purple-600">
              Business Insights
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default RetailerDashboard;