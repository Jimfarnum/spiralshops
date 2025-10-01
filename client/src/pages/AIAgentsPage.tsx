import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAgentInterface } from '@/components/AIAgentInterface';
import { 
  Bot, 
  ShoppingCart, 
  Heart, 
  Camera, 
  MapPin, 
  BarChart3, 
  Store, 
  Package,
  Brain,
  Users,
  TrendingUp
} from 'lucide-react';

const agentConfigs = {
  'shopper-assist': {
    title: 'Shopper Assistant',
    description: 'AI-powered shopping guidance and product discovery',
    icon: ShoppingCart,
    color: 'bg-blue-500',
    placeholder: 'Ask me to help you find products, compare prices, or get shopping advice...'
  },
  'wishlist': {
    title: 'Wishlist Manager',
    description: 'Smart wishlist organization and price predictions',
    icon: Heart,
    color: 'bg-pink-500',
    placeholder: 'Tell me about your wishlist items and I\'ll help organize them...'
  },
  'image-search': {
    title: 'Visual Search',
    description: 'Find products using image recognition and visual discovery',
    icon: Camera,
    color: 'bg-purple-500',
    placeholder: 'Describe a product you saw or want to find similar items to...'
  },
  'mall-directory': {
    title: 'Mall Navigator',
    description: 'Smart mall navigation and store discovery',
    icon: MapPin,
    color: 'bg-green-500',
    placeholder: 'Ask me about stores, events, or help planning your mall visit...'
  },
  'admin-audit': {
    title: 'Platform Analytics',
    description: 'Business insights and performance optimization',
    icon: BarChart3,
    color: 'bg-orange-500',
    placeholder: 'Ask about platform performance, user insights, or optimization recommendations...'
  },
  'retailer-onboard': {
    title: 'Retailer Onboarding',
    description: 'AI-guided business setup and tier recommendations',
    icon: Store,
    color: 'bg-indigo-500',
    placeholder: 'Let me help you set up your business profile and choose the right tier...'
  },
  'product-entry': {
    title: 'Inventory Assistant',
    description: 'Smart product management and optimization',
    icon: Package,
    color: 'bg-teal-500',
    placeholder: 'Describe your products and I\'ll help optimize descriptions and categories...'
  }
};

export default function AIAgentsPage() {
  const [activeAgent, setActiveAgent] = useState<keyof typeof agentConfigs>('shopper-assist');

  const stats = {
    totalAgents: Object.keys(agentConfigs).length,
    activeUsers: '1.2K',
    dailyInteractions: '8.4K',
    successRate: '94%'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">SPIRAL AI Agents</h1>
          </div>
          <p className="text-gray-600">
            Conversational AI assistants for every aspect of the SPIRAL platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold">{stats.totalAgents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily Interactions</p>
                  <p className="text-2xl font-bold">{stats.dailyInteractions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Available AI Agents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(agentConfigs).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = activeAgent === key;
                  
                  return (
                    <Button
                      key={key}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${isActive ? '' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveAgent(key as keyof typeof agentConfigs)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">{config.title}</p>
                          <p className="text-xs text-gray-600 line-clamp-1">{config.description}</p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Active Agent Interface */}
          <div className="lg:col-span-2">
            <AIAgentInterface
              agentType={activeAgent}
              title={agentConfigs[activeAgent].title}
              description={agentConfigs[activeAgent].description}
              placeholder={agentConfigs[activeAgent].placeholder}
            />
          </div>
        </div>

        {/* Agent Capabilities */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Capabilities Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(agentConfigs).map(([key, config]) => {
                  const Icon = config.icon;
                  
                  return (
                    <div key={key} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold">{config.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}