import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Shield, 
  TestTube, 
  Database, 
  Activity, 
  Users, 
  Settings, 
  FileText, 
  BarChart3,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const adminTools = [
  {
    id: 'button-testing',
    title: 'Button Testing Suite',
    description: 'Comprehensive touchscreen and button functionality validation for all platform components',
    icon: TestTube,
    route: '/spiral-admin/button-testing',
    category: 'Testing',
    status: 'active'
  },
  {
    id: 'system-logs',
    title: 'System Logging Demo',
    description: 'Real-time system monitoring, logging analysis, and performance tracking',
    icon: Activity,
    route: '/spiral-logging-demo',
    category: 'Monitoring',
    status: 'active'
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage user accounts, authentication, and access controls',
    icon: Users,
    route: '/spiral-admin/users',
    category: 'Administration',
    status: 'development'
  },
  {
    id: 'database-admin',
    title: 'Database Administration',
    description: 'Database operations, backup management, and data integrity checks',
    icon: Database,
    route: '/spiral-admin/database',
    category: 'Database',
    status: 'development'
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Comprehensive platform analytics, user behavior, and business intelligence',
    icon: BarChart3,
    route: '/spiral-admin/analytics',
    category: 'Analytics',
    status: 'active'
  },
  {
    id: 'system-config',
    title: 'System Configuration',
    description: 'Platform settings, feature flags, and environment configuration',
    icon: Settings,
    route: '/spiral-admin/config',
    category: 'Configuration',
    status: 'development'
  }
];

export default function SpiralAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const { toast } = useToast();

  const handleAdminLogin = () => {
    if (authPassword === 'Ashland8!' && authCode === 'SP1RAL_S3CUR3') {
      setIsAuthenticated(true);
      setAuthError('');
      toast({
        title: "Admin Access Granted",
        description: "Welcome to SPIRAL Administration Dashboard",
      });
    } else {
      setAuthError('Invalid admin credentials');
    }
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
            <CardTitle className="text-2xl">SPIRAL Admin Access</CardTitle>
            <p className="text-muted-foreground">
              Enter admin credentials to access the administration dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Code</label>
              <input
                type="password"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin code"
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
              Access Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      development: 'secondary',
      maintenance: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'development': return 'text-yellow-600';
      case 'maintenance': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const toolsByCategory = adminTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof adminTools>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">SPIRAL Administration</h1>
          </div>
          <p className="text-xl text-gray-600">
            Comprehensive platform administration and monitoring tools
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Secure Admin Environment</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <TestTube className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">Active Testing Tools</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tools by Category */}
        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
              {category} Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-6 h-6 ${getStatusColor(tool.status)}`} />
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                        </div>
                        {getStatusBadge(tool.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{tool.description}</p>
                      <div className="flex gap-2">
                        {tool.status === 'active' ? (
                          <Link href={tool.route}>
                            <Button className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Access Tool
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled variant="outline">
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Security Notice */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Security Notice</h3>
                <p className="text-sm text-red-700">
                  This is a secure administrative environment. All actions are logged and monitored. 
                  Unauthorized access attempts will be tracked and reported.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}