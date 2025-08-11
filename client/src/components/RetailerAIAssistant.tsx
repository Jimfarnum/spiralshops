import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Store, Package, DollarSign, TrendingUp, MessageSquare, 
  Calendar, Users, Brain, ShoppingCart, BarChart3, 
  Camera, FileText, Zap, Target
} from 'lucide-react'

interface RetailerAIAssistantProps {
  retailerId?: string;
}

export default function RetailerAIAssistant({ retailerId = "retailer-001" }: RetailerAIAssistantProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [aiActive, setAiActive] = useState(false)
  const [businessData, setBusinessData] = useState({
    monthlySales: 0,
    inventoryItems: 0,
    customerSatisfaction: 0,
    marketingReach: 0
  })

  // Comprehensive AI Task Options for Retailers
  const aiTaskOptions = [
    // Inventory Management
    { id: 'inventory-optimization', label: 'Optimize inventory levels and reorder points', category: 'Inventory Management', priority: 'High' },
    { id: 'product-photography', label: 'Take and edit professional product photos', category: 'Inventory Management', priority: 'Medium' },
    { id: 'product-descriptions', label: 'Write compelling product descriptions and SEO tags', category: 'Inventory Management', priority: 'Medium' },
    { id: 'price-optimization', label: 'Analyze and optimize pricing strategies', category: 'Inventory Management', priority: 'High' },
    { id: 'seasonal-planning', label: 'Plan seasonal inventory and promotions', category: 'Inventory Management', priority: 'Medium' },

    // Sales & Marketing
    { id: 'social-media-posts', label: 'Create and schedule social media content', category: 'Sales & Marketing', priority: 'High' },
    { id: 'email-campaigns', label: 'Design and send email marketing campaigns', category: 'Sales & Marketing', priority: 'High' },
    { id: 'customer-promotions', label: 'Create targeted promotions and discounts', category: 'Sales & Marketing', priority: 'Medium' },
    { id: 'loyalty-program', label: 'Manage customer loyalty and rewards program', category: 'Sales & Marketing', priority: 'Medium' },
    { id: 'competitor-analysis', label: 'Monitor competitors and market trends', category: 'Sales & Marketing', priority: 'Low' },

    // Customer Service
    { id: 'customer-inquiries', label: 'Respond to customer questions and reviews', category: 'Customer Service', priority: 'High' },
    { id: 'order-processing', label: 'Process orders and update customers', category: 'Customer Service', priority: 'High' },
    { id: 'return-handling', label: 'Manage returns and refunds', category: 'Customer Service', priority: 'Medium' },
    { id: 'feedback-analysis', label: 'Analyze customer feedback and implement improvements', category: 'Customer Service', priority: 'Medium' },

    // Operations & Analytics
    { id: 'sales-reports', label: 'Generate sales reports and analytics', category: 'Operations & Analytics', priority: 'Medium' },
    { id: 'financial-tracking', label: 'Track expenses and calculate profits', category: 'Operations & Analytics', priority: 'High' },
    { id: 'performance-insights', label: 'Provide business performance insights', category: 'Operations & Analytics', priority: 'Medium' },
    { id: 'tax-preparation', label: 'Organize documents for tax preparation', category: 'Operations & Analytics', priority: 'Low' },

    // SPIRAL Platform Optimization
    { id: 'spiral-profile', label: 'Optimize SPIRAL store profile and listings', category: 'SPIRAL Platform', priority: 'High' },
    { id: 'spiral-rewards', label: 'Maximize SPIRAL rewards and loyalty benefits', category: 'SPIRAL Platform', priority: 'Medium' },
    { id: 'mall-events', label: 'Participate in and promote mall events', category: 'SPIRAL Platform', priority: 'Medium' },
    { id: 'cross-promotion', label: 'Collaborate with other mall retailers', category: 'SPIRAL Platform', priority: 'Low' }
  ]

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const activateAI = async () => {
    setAiActive(true)
    // Send selected tasks to AI agent
    try {
      await fetch('/api/retailer-ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailerId,
          tasks: selectedTasks,
          timestamp: Date.now()
        })
      })
    } catch (error) {
      console.error('Failed to activate AI assistant:', error)
    }
  }

  useEffect(() => {
    // Load business data
    setBusinessData({
      monthlySales: 28500,
      inventoryItems: 347,
      customerSatisfaction: 4.3,
      marketingReach: 2840
    })
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Retailer AI Assistant</h1>
            <p className="text-gray-600">Fashion Forward Boutique - ID: {retailerId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              <Store className="w-4 h-4 mr-1" />
              SPIRAL Gold Member
            </Badge>
            <Button 
              onClick={activateAI}
              disabled={selectedTasks.length === 0}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Activate AI Assistant ({selectedTasks.length})
            </Button>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${businessData.monthlySales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessData.inventoryItems}</div>
              <p className="text-xs text-muted-foreground">23 low stock alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessData.customerSatisfaction}★</div>
              <Progress value={businessData.customerSatisfaction * 20} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marketing Reach</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessData.marketingReach.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Followers across platforms</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="ai-tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-tasks">AI Task Manager</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="insights">Business Insights</TabsTrigger>
            <TabsTrigger value="spiral-benefits">SPIRAL Benefits</TabsTrigger>
          </TabsList>

          {/* AI Tasks Tab */}
          <TabsContent value="ai-tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-orange-600" />
                  Retailer AI Assistant - Task Manager
                </CardTitle>
                <CardDescription>
                  Select the business tasks you need help with. Our specialized Retailer AI will handle them efficiently, 
                  saving you time and improving your business operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(
                    aiTaskOptions.reduce((acc, task) => {
                      if (!acc[task.category]) acc[task.category] = []
                      acc[task.category].push(task)
                      return acc
                    }, {} as Record<string, typeof aiTaskOptions>)
                  ).map(([category, tasks]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center">
                        {category === 'Inventory Management' && <Package className="w-4 h-4 mr-2" />}
                        {category === 'Sales & Marketing' && <TrendingUp className="w-4 h-4 mr-2" />}
                        {category === 'Customer Service' && <MessageSquare className="w-4 h-4 mr-2" />}
                        {category === 'Operations & Analytics' && <BarChart3 className="w-4 h-4 mr-2" />}
                        {category === 'SPIRAL Platform' && <Zap className="w-4 h-4 mr-2" />}
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-start space-x-2 p-3 hover:bg-gray-50 rounded-lg border">
                            <Checkbox
                              id={task.id}
                              checked={selectedTasks.includes(task.id)}
                              onCheckedChange={() => handleTaskToggle(task.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={task.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {task.label}
                              </label>
                              <Badge 
                                className={`ml-2 text-xs ${getPriorityColor(task.priority)}`}
                                variant="outline"
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTasks.length > 0 && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">
                      Selected Tasks ({selectedTasks.length})
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">
                      AI will start working on these tasks immediately. You'll see progress updates and completed work 
                      in your dashboard within 15-30 minutes.
                    </p>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={activateAI}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Start AI Assistant
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedTasks([])}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}

                {aiActive && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-green-800 mb-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      AI Assistant is now working on your selected tasks...
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <div>✓ Analyzing your current business data</div>
                      <div>⏳ Processing selected tasks</div>
                      <div>⏳ Preparing actionable recommendations</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Actions Tab */}
          <TabsContent value="quick-actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Instant Actions</CardTitle>
                  <CardDescription>Common tasks you can delegate to AI right now</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTasks(['social-media-posts'])
                      activateAI()
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Create today's social media posts
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTasks(['customer-inquiries'])
                      activateAI()
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Respond to pending customer messages
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTasks(['inventory-optimization'])
                      activateAI()
                    }}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Check inventory and reorder alerts
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTasks(['sales-reports'])
                      activateAI()
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate today's sales report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Smart suggestions based on your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Optimize pricing for 12 slow-moving items', urgency: 'High', savings: '$340/week' },
                    { title: 'Create Valentine\'s Day promotion campaign', urgency: 'Medium', savings: '+15% sales' },
                    { title: 'Update product photos for top 20 items', urgency: 'Medium', savings: '+8% conversion' },
                    { title: 'Send loyalty rewards to inactive customers', urgency: 'Low', savings: '+5% retention' }
                  ].map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium">{rec.title}</h4>
                        <Badge variant={rec.urgency === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                          {rec.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs text-green-600 font-medium">{rec.savings}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Why SPIRAL Makes Economic Sense</CardTitle>
                <CardDescription>Your business benefits from using the SPIRAL platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$2,840</div>
                    <p className="text-sm text-green-700">Monthly Revenue Increase</p>
                    <p className="text-xs text-gray-600">Since joining SPIRAL</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">35%</div>
                    <p className="text-sm text-blue-700">Cost Reduction</p>
                    <p className="text-xs text-gray-600">Through AI automation</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">22 hrs</div>
                    <p className="text-sm text-purple-700">Time Saved Weekly</p>
                    <p className="text-xs text-gray-600">With AI assistance</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Your SPIRAL Success Story</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { metric: 'Customer Discovery', before: '45 new customers/month', after: '127 new customers/month', improvement: '+182%' },
                      { metric: 'Operating Costs', before: '$3,200/month', after: '$2,080/month', improvement: '-35%' },
                      { metric: 'Marketing Reach', before: '890 followers', after: '2,840 followers', improvement: '+219%' },
                      { metric: 'Customer Retention', before: '68%', after: '85%', improvement: '+25%' }
                    ].map((stat, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{stat.metric}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Before SPIRAL:</span>
                            <span className="font-medium">{stat.before}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">With SPIRAL:</span>
                            <span className="font-medium">{stat.after}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-gray-600">Improvement:</span>
                            <span className="font-bold text-green-600">{stat.improvement}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SPIRAL Benefits Tab */}
          <TabsContent value="spiral-benefits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  Your SPIRAL Membership Benefits
                </CardTitle>
                <CardDescription>Maximize your return on investment with these exclusive features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Included in Your Plan</h3>
                      {[
                        { feature: 'AI Business Assistant', value: '$299/month value', status: 'active' },
                        { feature: 'Professional Photography AI', value: '$150/month value', status: 'active' },
                        { feature: 'Social Media Management', value: '$200/month value', status: 'active' },
                        { feature: 'Customer Service AI', value: '$180/month value', status: 'active' },
                        { feature: 'Analytics & Insights', value: '$120/month value', status: 'active' }
                      ].map((benefit, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <h4 className="font-medium text-green-900">{benefit.feature}</h4>
                            <p className="text-sm text-green-700">{benefit.value}</p>
                          </div>
                          <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Available Upgrades</h3>
                      {[
                        { feature: 'Premium AI Analytics', price: '+$49/month', benefit: 'Advanced forecasting' },
                        { feature: 'Multi-Location Management', price: '+$29/month', benefit: 'Manage 5+ stores' },
                        { feature: 'Custom AI Training', price: '+$99/month', benefit: 'Industry-specific AI' }
                      ].map((upgrade, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div>
                            <h4 className="font-medium text-blue-900">{upgrade.feature}</h4>
                            <p className="text-sm text-blue-700">{upgrade.benefit}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-600">{upgrade.price}</p>
                            <Button size="sm" variant="outline" className="mt-1">Upgrade</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-900 mb-2">Your ROI Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">$949</div>
                        <p className="text-orange-700">Total Value Received</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">$97</div>
                        <p className="text-orange-700">Your Monthly Payment</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">978%</div>
                        <p className="text-green-700">Return on Investment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}