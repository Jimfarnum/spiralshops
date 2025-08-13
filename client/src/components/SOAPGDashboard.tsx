import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Building2, 
  Store, 
  Users, 
  Share2, 
  TrendingUp, 
  Settings,
  Activity,
  Zap,
  MessageCircle,
  BarChart3,
  CheckCircle
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  icon: any
  status: 'active' | 'idle' | 'processing'
  lastActivity: string
  tasks: number
}

export default function SOAPGDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState('operational')
  
  const agents: Agent[] = [
    {
      id: 'mall-manager',
      name: 'Mall Manager AI',
      description: 'Tenant recruitment, space optimization, performance analytics',
      icon: Building2,
      status: 'active',
      lastActivity: '2 minutes ago',
      tasks: 12
    },
    {
      id: 'retailer',
      name: 'Retailer AI',
      description: 'Inventory optimization, pricing strategies, customer acquisition',
      icon: Store,
      status: 'active',
      lastActivity: '5 minutes ago',
      tasks: 8
    },
    {
      id: 'shopper-engagement',
      name: 'Shopper Engagement AI',
      description: 'Personalized recommendations, deal hunting, loyalty optimization',
      icon: Users,
      status: 'processing',
      lastActivity: 'Just now',
      tasks: 15
    },
    {
      id: 'social-media',
      name: 'Social Media AI',
      description: 'Content creation, community engagement, viral campaigns',
      icon: Share2,
      status: 'active',
      lastActivity: '1 minute ago',
      tasks: 6
    },
    {
      id: 'marketing-partnerships',
      name: 'Marketing & Partnerships AI',
      description: 'Strategic partnerships, cross-promotions, growth strategies',
      icon: TrendingUp,
      status: 'idle',
      lastActivity: '10 minutes ago',
      tasks: 4
    },
    {
      id: 'admin',
      name: 'Admin AI',
      description: 'System monitoring, analytics, security, platform optimization',
      icon: Settings,
      status: 'active',
      lastActivity: '3 minutes ago',
      tasks: 7
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'idle': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'processing': return 'Processing'
      case 'idle': return 'Idle'
      default: return 'Unknown'
    }
  }

  useEffect(() => {
    // Check system status and update agent data
    const fetchStatus = () => {
      fetch('/api/soap-g/status')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSystemStatus(data.status)
            // Update agents with real-time data from backend
            if (data.agentDetails) {
              // Update agent statuses based on backend heartbeat data
              Object.keys(data.agentDetails).forEach(agentId => {
                const backendAgent = data.agentDetails[agentId];
                // Find and update corresponding agent in our local state
                const agentIndex = agents.findIndex(a => a.id === agentId);
                if (agentIndex !== -1) {
                  agents[agentIndex].status = backendAgent.status === 'active' ? 'active' : 
                                             backendAgent.status === 'processing' ? 'processing' : 'idle';
                  agents[agentIndex].tasks = backendAgent.pendingTasks || 0;
                  agents[agentIndex].lastActivity = backendAgent.lastHeartbeat ? 
                    `${Math.floor((new Date().getTime() - new Date(backendAgent.lastHeartbeat).getTime()) / 1000)} seconds ago` : 
                    agents[agentIndex].lastActivity;
                }
              });
            }
          }
        })
        .catch(err => console.log('Status check failed:', err))
    };

    // Initial fetch
    fetchStatus();
    
    // Set up interval for real-time updates
    const interval = setInterval(fetchStatus, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                SOAP G Central Brain
              </h1>
              <p className="text-lg text-gray-600">
                AI Agent Orchestration System for SPIRAL Platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={systemStatus === 'operational' ? 'default' : 'destructive'}
                className="text-sm"
              >
                <Activity className="w-4 h-4 mr-1" />
                {systemStatus}
              </Badge>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agents.filter(a => a.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agents.filter(a => a.status === 'processing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agents.reduce((sum, agent) => sum + agent.tasks, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">94.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Grid */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Agent Overview</TabsTrigger>
            <TabsTrigger value="coordination">Multi-Agent Coordination</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => {
                const IconComponent = agent.icon
                return (
                  <Card 
                    key={agent.id} 
                    className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                              <span className="text-xs text-gray-500">
                                {getStatusText(agent.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{agent.tasks}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-gray-600 mb-4">
                        {agent.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Last activity: {agent.lastActivity}
                        </span>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="coordination" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Agent Coordination</CardTitle>
                <CardDescription>
                  Orchestrate multiple AI agents for complex tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Active Coordination: Mall Launch Campaign</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Coordinating Mall Manager, Marketing, and Social Media agents for new mall opening
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant="outline">Mall Manager AI</Badge>
                      <Badge variant="outline">Marketing AI</Badge>
                      <Badge variant="outline">Social Media AI</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Scheduled: Retailer Optimization Suite</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Retailer and Shopper Engagement agents optimizing customer experience
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant="outline">Retailer AI</Badge>
                      <Badge variant="outline">Shopper Engagement AI</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Create New Coordination Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Central Brain Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Central Brain Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">98.5%</p>
                  <p className="text-sm text-gray-600">System Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">247ms</p>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">1,247</p>
                  <p className="text-sm text-gray-600">Tasks Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}