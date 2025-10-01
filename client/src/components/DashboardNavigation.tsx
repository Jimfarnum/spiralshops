import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Store, ShoppingBag, Brain, Users, TrendingUp } from 'lucide-react'

export default function DashboardNavigation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SPIRAL AI Dashboard Hub</h1>
          <p className="text-lg text-gray-600">
            Choose your role to access specialized AI-powered management tools
          </p>
          <div className="mt-6">
            <Link href="/soap-g-dashboard">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Brain className="w-5 h-5 mr-2" />
                SOAP G Central Brain
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mall Manager Dashboard */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900">Mall Manager</CardTitle>
              <CardDescription>
                Comprehensive mall management with AI-powered tenant recruitment and performance optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Tenant recruitment & retention
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                  Performance analytics
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-blue-600" />
                  AI business optimization
                </div>
              </div>
              <Link href="/mall-manager-dashboard">
                <Button className="w-full bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700">
                  Access Mall Manager Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Retailer AI Assistant */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900">Retailer</CardTitle>
              <CardDescription>
                AI-powered business assistant for inventory, marketing, and operations automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Store className="w-4 h-4 mr-2 text-orange-600" />
                  Inventory optimization
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                  Marketing automation
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-orange-600" />
                  Customer service AI
                </div>
              </div>
              <Link href="/retailer-ai-assistant">
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  Access Retailer AI Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Shopper AI Agent */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900">Shopper</CardTitle>
              <CardDescription>
                Personal AI shopping assistant for deals, recommendations, and smart purchasing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2 text-purple-600" />
                  Smart deal hunting
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
                  Personalized recommendations
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-600" />
                  Budget optimization
                </div>
              </div>
              <Link href="/shopper-ai-agent">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Access Shopping AI Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600">94%</div>
            <p className="text-sm text-gray-600">Mall Occupancy Rate</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600">$2.1M</div>
            <p className="text-sm text-gray-600">Monthly Platform Revenue</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600">47%</div>
            <p className="text-sm text-gray-600">Average Shopper Savings</p>
          </div>
        </div>

        {/* AI Features Highlight */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Powered by Advanced AI</h2>
          <p className="text-lg opacity-90">
            Each dashboard features specialized GPT agents trained for maximum efficiency and results
          </p>
        </div>
      </div>
    </div>
  )
}