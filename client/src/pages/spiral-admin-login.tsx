import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Shield, Lock, Key, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SpiralAdminLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [credentials, setCredentials] = useState({
    passphrase: '',
    code: '',
    method: 'passphrase'
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.isAdmin && data.authenticated) {
        setIsAuthenticated(true);
        setAdminInfo(data);
      }
    } catch (error) {
      console.error('Admin status check failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setAdminInfo({
          isAdmin: true,
          authenticated: true,
          loginTime: new Date().toISOString(),
          method: credentials.method
        });
        
        toast({
          title: "Authentication Successful",
          description: "Welcome to SPIRAL Admin Area",
        });

        // Clear credentials for security
        setCredentials({ passphrase: '', code: '', method: 'passphrase' });
      } else {
        toast({
          title: "Authentication Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Could not connect to authentication system",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setAdminInfo(null);
        toast({
          title: "Logged Out",
          description: "SPIRAL Admin session ended",
        });
      }
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Could not complete logout",
        variant: "destructive"
      });
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-12 h-12 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">SPIRAL Admin Area</h1>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-4 h-4 mr-2" />
              Authenticated - Admin Access Granted
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Session Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Method:</span>
                    <span className="ml-2 capitalize">{adminInfo?.method || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Login Time:</span>
                    <span className="ml-2">
                      {adminInfo?.loginTime ? new Date(adminInfo.loginTime).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Protected Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Admin API Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>System Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Internal Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Sensitive Data</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open('/api/admin/system-status', '_blank')}
                >
                  System Status
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open('/api/analytics/internal', '_blank')}
                >
                  Internal Analytics
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SPIRAL Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">System Monitoring</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Route Protection</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">Multi-Layer</div>
                  <div className="text-sm text-gray-600">Security System</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">Real-Time</div>
                  <div className="text-sm text-gray-600">Threat Detection</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Security Features Active:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>• Route-based access control</div>
                  <div>• API request rate limiting</div>
                  <div>• Input sanitization</div>
                  <div>• CORS protection</div>
                  <div>• Session management</div>
                  <div>• Request logging</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-slate-600" />
            <CardTitle className="text-2xl">SPIRAL Admin</CardTitle>
          </div>
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600">Restricted Access</span>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={credentials.method} onValueChange={(value) => setCredentials(prev => ({ ...prev, method: value }))}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="passphrase" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Passphrase
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Code
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="mt-6">
              <TabsContent value="passphrase" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Admin Passphrase
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={credentials.passphrase}
                      onChange={(e) => setCredentials(prev => ({ ...prev, passphrase: e.target.value }))}
                      placeholder="Enter admin passphrase"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Admin Code
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={credentials.code}
                      onChange={(e) => setCredentials(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Enter admin code"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </TabsContent>

              <Button 
                type="submit" 
                className="w-full mt-6 bg-slate-800 hover:bg-slate-900" 
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Access SPIRAL Admin'}
              </Button>
            </form>
          </Tabs>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <div className="font-medium mb-1">Security Notice</div>
                <div>This area contains sensitive system controls and data. All access attempts are logged and monitored.</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}