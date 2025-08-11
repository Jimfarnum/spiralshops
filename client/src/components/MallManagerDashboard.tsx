import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Building2, Store, Users, TrendingUp, MessageSquare, Calendar, Target, Brain } from 'lucide-react'

interface MallManagerDashboardProps {
  mallId?: string;
}

export default function MallManagerDashboard({ mallId = "mall-001" }: MallManagerDashboardProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [aiAssistance, setAiAssistance] = useState(false)
  const [dashboardData, setDashboardData] = useState<{
    totalStores: number;
    occupancyRate: number;
    pendingApplications: number;
    monthlyRevenue: number;
    recentActivity: Array<{ type: string; text: string }>;
  }>({
    totalStores: 0,
    occupancyRate: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    recentActivity: []
  })

  // AI Task Options for Mall Managers
  const aiTaskOptions = [
    { id: 'recruit-retailers', label: 'Find and recruit new retailers for empty spaces', category: 'Business Development' },
    { id: 'analyze-performance', label: 'Analyze mall performance and identify optimization opportunities', category: 'Analytics' },
    { id: 'process-applications', label: 'Review and process retailer applications', category: 'Operations' },
    { id: 'marketing-campaigns', label: 'Create targeted marketing campaigns for tenant acquisition', category: 'Marketing' },
    { id: 'tenant-communications', label: 'Draft and send communications to existing tenants', category: 'Communications' },
    { id: 'lease-negotiations', label: 'Assist with lease terms and pricing strategies', category: 'Legal' },
    { id: 'event-planning', label: 'Plan and coordinate mall events to drive foot traffic', category: 'Events' },
    { id: 'financial-reports', label: 'Generate financial reports and ROI analysis', category: 'Finance' },
    { id: 'competitor-analysis', label: 'Monitor competitor malls and market trends', category: 'Strategy' },
    { id: 'maintenance-scheduling', label: 'Schedule and coordinate maintenance activities', category: 'Facility Management' }
  ]

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const activateAI = async () => {
    setAiAssistance(true)
    // In a real implementation, this would send the selected tasks to the AI agent
    console.log('Activating AI assistance for tasks:', selectedTasks)
  }

  useEffect(() => {
    // Simulate loading dashboard data
    setDashboardData({
      totalStores: 87,
      occupancyRate: 94,
      pendingApplications: 12,
      monthlyRevenue: 245000,
      recentActivity: [
        { type: 'new_application', text: 'New retailer application: Urban Threads Boutique' },
        { type: 'lease_signed', text: 'Lease signed: TechGear Electronics' },
        { type: 'performance_alert', text: 'Store performance alert: Fashion Corner needs support' }
      ]
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mall Manager Dashboard</h1>
            <p className="text-gray-600">Westfield Shopping Center - ID: {mallId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-700 border-green-300">
              <Building2 className="w-4 h-4 mr-1" />
              {dashboardData.occupancyRate}% Occupied
            </Badge>
            <Button 
              onClick={activateAI}
              disabled={selectedTasks.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Activate AI Assistant
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalStores}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.occupancyRate}%</div>
              <Progress value={dashboardData.occupancyRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Needs review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardData.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="ai-tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-tasks">AI Task Manager</TabsTrigger>
            <TabsTrigger value="retailers">Retailer Management</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            <TabsTrigger value="opportunities">Growth Opportunities</TabsTrigger>
          </TabsList>

          {/* AI Tasks Tab */}
          <TabsContent value="ai-tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  AI Assistant Task Manager
                </CardTitle>
                <CardDescription>
                  Select tasks you'd like AI assistance with. Our specialized Mall Management AI will handle these efficiently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(
                    aiTaskOptions.reduce((acc, task) => {
                      if (!acc[task.category]) acc[task.category] = []
                      acc[task.category].push(task)
                      return acc
                    }, {} as Record<string, typeof aiTaskOptions>)
                  ).map(([category, tasks]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-semibold text-gray-800 border-b pb-2">{category}</h3>
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={task.id}
                              checked={selectedTasks.includes(task.id)}
                              onCheckedChange={() => handleTaskToggle(task.id)}
                            />
                            <label
                              htmlFor={task.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {task.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTasks.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Selected Tasks ({selectedTasks.length})</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      AI will begin working on these tasks immediately and provide updates within 15 minutes.
                    </p>
                    <Button 
                      onClick={activateAI}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Start AI Assistant
                    </Button>
                  </div>
                )}

                {aiAssistance && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-green-800">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      AI Assistant is now working on your selected tasks...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retailers Tab */}
          <TabsContent value="retailers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Retailers</CardTitle>
                  <CardDescription>Current tenants and their performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Fashion Forward', category: 'Clothing', performance: 'Excellent', revenue: '$12,400' },
                      { name: 'TechGear Pro', category: 'Electronics', performance: 'Good', revenue: '$8,900' },
                      { name: 'Gourmet Bites', category: 'Food', performance: 'Fair', revenue: '$6,200' }
                    ].map((retailer, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{retailer.name}</h4>
                          <p className="text-sm text-gray-600">{retailer.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={retailer.performance === 'Excellent' ? 'default' : 'secondary'}>
                            {retailer.performance}
                          </Badge>
                          <p className="text-sm font-medium">{retailer.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Applications</CardTitle>
                  <CardDescription>New retailers awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Urban Threads', category: 'Clothing', applied: '2 days ago', score: 85 },
                      { name: 'Coffee Corner', category: 'Food & Beverage', applied: '1 week ago', score: 92 },
                      { name: 'Digital Hub', category: 'Electronics', applied: '3 days ago', score: 78 }
                    ].map((application, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{application.name}</h4>
                          <p className="text-sm text-gray-600">{application.category}</p>
                          <p className="text-xs text-gray-500">{application.applied}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{application.score}%</div>
                          <p className="text-xs text-gray-600">Match Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key metrics and trends for your mall</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+15%</div>
                    <p className="text-sm text-green-700">Foot Traffic Growth</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$2.1M</div>
                    <p className="text-sm text-blue-700">Quarterly Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">4.2★</div>
                    <p className="text-sm text-purple-700">Customer Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
                <CardDescription>AI-identified opportunities to maximize mall success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      title: 'Premium Food Court Expansion', 
                      potential: 'High',
                      description: 'Add 3 gourmet food vendors to increase dwell time and revenue',
                      roi: '+$180K annually'
                    },
                    { 
                      title: 'Tech & Gaming Zone', 
                      potential: 'Medium',
                      description: 'Create interactive gaming area to attract younger demographics',
                      roi: '+$95K annually'
                    },
                    { 
                      title: 'Wellness & Beauty Hub', 
                      potential: 'High',
                      description: 'Group spa, salon, and wellness retailers in dedicated area',
                      roi: '+$220K annually'
                    }
                  ].map((opportunity, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                        <Badge variant={opportunity.potential === 'High' ? 'default' : 'secondary'}>
                          {opportunity.potential} Potential
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                      <p className="text-sm font-medium text-green-600">{opportunity.roi}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}