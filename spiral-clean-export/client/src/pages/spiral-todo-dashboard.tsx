import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Shield, 
  Smartphone, 
  Brain, 
  Rocket, 
  TrendingUp,
  Settings,
  Lock,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  phase: string;
  assignedTo?: string;
  dueDate?: string;
  dependencies?: string[];
  notes?: string;
}

const todoItems: TodoItem[] = [
  // PHASE 1: CURRENT PLATFORM & MVP COMPLETION
  {
    id: 'nav-dashboards',
    title: 'Finalize Navigation for Dashboards',
    description: 'Complete navigation system for shopper and retailer dashboards',
    status: 'completed',
    priority: 'high',
    category: 'Core Platform',
    phase: 'Phase 1',
    assignedTo: 'SPIRAL Team'
  },
  {
    id: 'code-cleanup',
    title: 'Clean Up Duplicated Code',
    description: 'Remove duplicated functions and optimize codebase from Replit Agent development',
    status: 'in-progress',
    priority: 'medium',
    category: 'Core Platform',
    phase: 'Phase 1'
  },
  {
    id: 'shopper-dashboard-styling',
    title: 'Final Shopper Dashboard Styling',
    description: 'Polish verified stores, search, ZIP filter, large retailer toggle UI',
    status: 'completed',
    priority: 'high',
    category: 'Core Platform',
    phase: 'Phase 1'
  },
  {
    id: 'store-categories',
    title: 'Store Categories & Discovery Filters',
    description: 'Implement comprehensive store categories, tags, and discovery filters',
    status: 'completed',
    priority: 'high',
    category: 'Core Platform',
    phase: 'Phase 1'
  },
  {
    id: 'retailer-benefits',
    title: 'Business Benefits Section',
    description: 'Add comprehensive business benefits section on homepage for retailers',
    status: 'pending',
    priority: 'medium',
    category: 'Core Platform',
    phase: 'Phase 1'
  },
  {
    id: 'ui-polish',
    title: 'Final UI Polish & Accessibility',
    description: 'Complete buttons, typography, and accessibility compliance check',
    status: 'completed',
    priority: 'critical',
    category: 'Core Platform',
    phase: 'Phase 1'
  },
  {
    id: 'retailer-wallet',
    title: 'Retailer Wallet & Reward System',
    description: 'Complete SPIRAL wallet integration for retailers',
    status: 'completed',
    priority: 'critical',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'store-verification',
    title: 'Store Verification System',
    description: '5-tier store verification with approval workflows',
    status: 'completed',
    priority: 'critical',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'verified-filter',
    title: 'Shopper Verified Store Filter',
    description: 'Enable shoppers to filter for verified stores only',
    status: 'completed',
    priority: 'high',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'follow-retailers',
    title: 'Follow/Favorite Retailers',
    description: 'Complete retailer follow and favorite system',
    status: 'completed',
    priority: 'high',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'fee-calculator',
    title: 'Business Fee Calculator',
    description: 'Advanced business calculator for retailer fee analysis',
    status: 'completed',
    priority: 'high',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'large-retailer-tier',
    title: 'Large Retailer Tier & Fee System',
    description: 'Tiered fee system for large retailers with automated classification',
    status: 'completed',
    priority: 'high',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'document-upload',
    title: 'Document Upload History',
    description: 'Add support document upload history to retailer dashboard',
    status: 'pending',
    priority: 'medium',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'faq-help',
    title: 'FAQ/Help Section',
    description: 'Comprehensive FAQ and help sections for retailers and shoppers',
    status: 'pending',
    priority: 'medium',
    category: 'Store System',
    phase: 'Phase 1'
  },
  {
    id: 'ad-calculator',
    title: 'Base Ad Calculator',
    description: 'CPM/CTR advertising calculator implementation',
    status: 'completed',
    priority: 'high',
    category: 'Advertising',
    phase: 'Phase 1'
  },
  {
    id: 'campaign-creator',
    title: 'Campaign Creator',
    description: 'Implement campaign creator for sponsored posts and bundles',
    status: 'pending',
    priority: 'high',
    category: 'Advertising',
    phase: 'Phase 1'
  },
  {
    id: 'ad-dashboard',
    title: 'Admin Ad Performance Dashboard',
    description: 'Dashboard with billing data and campaign performance metrics',
    status: 'pending',
    priority: 'medium',
    category: 'Advertising',
    phase: 'Phase 1'
  },

  // PHASE 2: MOBILE APP DEPLOYMENT
  {
    id: 'mobile-wrapper',
    title: 'Mobile App Wrapper',
    description: 'Wrap platform in Capacitor or React Native for Android/iOS',
    status: 'pending',
    priority: 'critical',
    category: 'Mobile Deployment',
    phase: 'Phase 2'
  },
  {
    id: 'mobile-optimization',
    title: 'Mobile Layout Optimization',
    description: 'Optimize responsiveness and layout specifically for mobile devices',
    status: 'completed',
    priority: 'high',
    category: 'Mobile Deployment',
    phase: 'Phase 2'
  },
  {
    id: 'app-store-submission',
    title: 'App Store Submissions',
    description: 'Submit apps to Play Store & App Store with compliance preparation',
    status: 'pending',
    priority: 'critical',
    category: 'Mobile Deployment',
    phase: 'Phase 2'
  },
  {
    id: 'pwa-support',
    title: 'PWA Install Support',
    description: 'Add Progressive Web App install support for browsers',
    status: 'pending',
    priority: 'medium',
    category: 'Mobile Deployment',
    phase: 'Phase 2'
  },

  // PHASE 3: SPIRAL AGENT + FULL STACK GPT
  {
    id: 'agent-integration',
    title: 'SPIRAL Agent Integration',
    description: 'Complete Agent integration into business dashboard',
    status: 'completed',
    priority: 'high',
    category: 'SPIRAL Agent',
    phase: 'Phase 3'
  },
  {
    id: 'memory-cleanup',
    title: 'Replit Memory Cleanup',
    description: 'Refactor repeating output bugs and optimize Replit memory usage',
    status: 'in-progress',
    priority: 'high',
    category: 'SPIRAL Agent',
    phase: 'Phase 3'
  },
  {
    id: 'task-tracking',
    title: 'Agent Task Tracking Console',
    description: 'Create Agent task tracking console with checklists and flags',
    status: 'completed',
    priority: 'medium',
    category: 'SPIRAL Agent',
    phase: 'Phase 3'
  },
  {
    id: 'prompt-engine',
    title: 'Prompt-to-Post Engine',
    description: 'Develop automated social media post generation for retailers',
    status: 'pending',
    priority: 'high',
    category: 'SPIRAL GPT',
    phase: 'Phase 3'
  },
  {
    id: 'gpt-training',
    title: 'GPT-4 SPIRAL Training',
    description: 'Train GPT-4 on SPIRAL structure, FAQs, and business benefits',
    status: 'pending',
    priority: 'high',
    category: 'SPIRAL GPT',
    phase: 'Phase 3'
  },
  {
    id: 'marketing-gpt',
    title: 'Marketing GPT System',
    description: 'Create marketing GPT to generate custom campaigns',
    status: 'pending',
    priority: 'medium',
    category: 'SPIRAL GPT',
    phase: 'Phase 3'
  },
  {
    id: 'multilingual-gpt',
    title: 'Multilingual GPT Support',
    description: 'Add multilingual GPT for local translation assistance',
    status: 'completed',
    priority: 'medium',
    category: 'SPIRAL GPT',
    phase: 'Phase 3'
  },

  // PHASE 4: FINAL DEPLOYMENT & PARTNER PREP
  {
    id: 'deployment-prep',
    title: 'Clean Deployment Files',
    description: 'Clean and export deployment files for production',
    status: 'pending',
    priority: 'critical',
    category: 'Deployment',
    phase: 'Phase 4'
  },
  {
    id: 'vercel-deploy',
    title: 'Vercel Production Deployment',
    description: 'Deploy production version to Vercel with optimization',
    status: 'pending',
    priority: 'critical',
    category: 'Deployment',
    phase: 'Phase 4'
  },
  {
    id: 'ibm-watson',
    title: 'IBM Watson API Integration',
    description: 'Connect APIs for IBM Watson and advanced analytics',
    status: 'pending',
    priority: 'high',
    category: 'Deployment',
    phase: 'Phase 4'
  },
  {
    id: 'monitoring',
    title: 'Uptime & Log Monitoring',
    description: 'Implement comprehensive uptime and system log monitoring',
    status: 'completed',
    priority: 'high',
    category: 'Deployment',
    phase: 'Phase 4'
  },
  {
    id: 'investor-demo',
    title: 'Investor Demo Site',
    description: 'Create investor and venture-ready demonstration site',
    status: 'pending',
    priority: 'high',
    category: 'Partner Support',
    phase: 'Phase 4'
  },
  {
    id: 'partner-portal',
    title: 'Partner Onboarding Portal',
    description: 'Create partner portal for social media and payment partnerships',
    status: 'pending',
    priority: 'medium',
    category: 'Partner Support',
    phase: 'Phase 4'
  },
  {
    id: 'live-api',
    title: 'Live Data API',
    description: 'Prepare live data API for engagement statistics',
    status: 'pending',
    priority: 'medium',
    category: 'Partner Support',
    phase: 'Phase 4'
  },

  // PHASE 5: LAUNCH & SCALE
  {
    id: 'viral-signup',
    title: 'Viral Signup Page',
    description: 'Build viral signup page with referrals and tracking',
    status: 'completed',
    priority: 'high',
    category: 'User Onboarding',
    phase: 'Phase 5'
  },
  {
    id: 'main-street-campaign',
    title: 'Main Street Campaign',
    description: 'Run Main Street Campaign with #EarnSPIRALs hashtag',
    status: 'pending',
    priority: 'high',
    category: 'Marketing',
    phase: 'Phase 5'
  },
  {
    id: 'social-integration',
    title: 'Social Platform Integration',
    description: 'Integrate share-to-earn on TikTok, Instagram, X',
    status: 'completed',
    priority: 'high',
    category: 'Marketing',
    phase: 'Phase 5'
  },
  {
    id: 'onboarding-guide',
    title: 'Retailer Onboarding Guide',
    description: 'Support onboarding guide for new retailers',
    status: 'pending',
    priority: 'medium',
    category: 'User Onboarding',
    phase: 'Phase 5'
  },
  {
    id: 'admin-metrics',
    title: 'Admin Analytics Dashboard',
    description: 'Comprehensive dashboard for user/store/ad metrics',
    status: 'completed',
    priority: 'high',
    category: 'Backend Analytics',
    phase: 'Phase 5'
  },
  {
    id: 'realtime-tracking',
    title: 'Real-time Fee & Reward Tracking',
    description: 'Real-time tracking reports for fees and rewards',
    status: 'completed',
    priority: 'high',
    category: 'Backend Analytics',
    phase: 'Phase 5'
  },
  {
    id: 'payment-integration',
    title: 'Stripe Payment Integration',
    description: 'Add Stripe or payment integration for retailers',
    status: 'completed',
    priority: 'critical',
    category: 'Backend Analytics',
    phase: 'Phase 5'
  }
];

export default function SpiralTodoDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [todos, setTodos] = useState<TodoItem[]>(todoItems);
  const { toast } = useToast();

  const handleAdminLogin = () => {
    if (authPassword === 'Ashland8!') {
      setIsAuthenticated(true);
      setAuthError('');
      toast({
        title: "Admin Access Granted",
        description: "Welcome to SPIRAL Project TODO Dashboard",
      });
    } else {
      setAuthError('Invalid admin password');
    }
  };

  const toggleTodoStatus = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
        return { ...todo, status: newStatus };
      }
      return todo;
    }));
    
    toast({
      title: "Task Updated",
      description: "Task status has been updated successfully",
    });
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl">SPIRAL TODO Access</CardTitle>
            <p className="text-muted-foreground">
              Enter admin password to access the project tracking dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
              />
              {authError && (
                <p className="text-sm text-red-600">{authError}</p>
              )}
            </div>
            <Button 
              onClick={handleAdminLogin}
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Access TODO Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];
  const categories = [...new Set(todos.map(todo => todo.category))];
  
  const filteredTodos = todos.filter(todo => {
    const phaseMatch = selectedPhase === 'All' || todo.phase === selectedPhase;
    const categoryMatch = selectedCategory === 'All' || todo.category === selectedCategory;
    return phaseMatch && categoryMatch;
  });

  const getPhaseStats = (phase: string) => {
    const phaseTodos = todos.filter(todo => todo.phase === phase);
    const completed = phaseTodos.filter(todo => todo.status === 'completed').length;
    const total = phaseTodos.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const overallStats = {
    total: todos.length,
    completed: todos.filter(todo => todo.status === 'completed').length,
    inProgress: todos.filter(todo => todo.status === 'in-progress').length,
    pending: todos.filter(todo => todo.status === 'pending').length,
    blocked: todos.filter(todo => todo.status === 'blocked').length
  };

  const overallPercentage = Math.round((overallStats.completed / overallStats.total) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'blocked': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      'in-progress': 'secondary',
      pending: 'outline',
      blocked: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">SPIRAL Project TODO Dashboard</h1>
          </div>
          <p className="text-xl text-gray-600">
            Complete project monitoring for 100% functionality across all platforms
          </p>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Overall Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Project Completion</span>
                <span className="text-2xl font-bold text-blue-600">{overallPercentage}%</span>
              </div>
              <Progress value={overallPercentage} className="h-3" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{overallStats.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{overallStats.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{overallStats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{overallStats.blocked}</div>
                  <div className="text-sm text-gray-600">Blocked</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {phases.map(phase => {
            const stats = getPhaseStats(phase);
            return (
              <Card key={phase}>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold mb-2">{phase}</div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{stats.percentage}%</div>
                  <Progress value={stats.percentage} className="h-2 mb-2" />
                  <div className="text-sm text-gray-600">{stats.completed}/{stats.total} tasks</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phase Filter</label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="All">All Phases</option>
                  {phases.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Filter</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TODO Items */}
        <div className="space-y-4">
          {filteredTodos.map(todo => (
            <Card 
              key={todo.id} 
              className={`border-l-4 ${getPriorityColor(todo.priority)} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleTodoStatus(todo.id)}
                        className="flex-shrink-0"
                      >
                        {getStatusIcon(todo.status)}
                      </button>
                      <h3 className="text-lg font-semibold">{todo.title}</h3>
                      {getStatusBadge(todo.status)}
                    </div>
                    
                    <p className="text-gray-600">{todo.description}</p>
                    
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge variant="outline">{todo.phase}</Badge>
                      <Badge variant="outline">{todo.category}</Badge>
                      <Badge variant={todo.priority === 'critical' ? 'destructive' : 'secondary'}>
                        {todo.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {todo.assignedTo && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        Assigned to: {todo.assignedTo}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => {
                  const pending = todos.filter(t => t.status === 'pending').length;
                  toast({
                    title: "Pending Tasks",
                    description: `You have ${pending} pending tasks remaining`,
                  });
                }}
                variant="outline"
              >
                <Clock className="w-4 h-4 mr-2" />
                View Pending ({overallStats.pending})
              </Button>
              <Button 
                onClick={() => {
                  const critical = todos.filter(t => t.priority === 'critical' && t.status !== 'completed').length;
                  toast({
                    title: "Critical Tasks",
                    description: `${critical} critical tasks need attention`,
                    variant: critical > 0 ? "destructive" : "default"
                  });
                }}
                variant="outline"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Critical Tasks
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Export TODO List",
                    description: "TODO list export functionality coming soon",
                  });
                }}
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Export List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}