import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, User, ShoppingBag, Store, Eye, EyeOff, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  userType: 'shopper' | 'retailer';
  firstName: string;
  lastName: string;
  name: string;
  socialHandle?: string;
  spiralBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  isEmailVerified: boolean;
  isActive: boolean;
}

export default function UserAuthDemo() {
  const [activeTab, setActiveTab] = useState('register');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 'shopper' as 'shopper' | 'retailer',
    socialHandle: ''
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: '', // Can be email or username
    password: ''
  });

  // Validation states
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [socialHandleAvailable, setSocialHandleAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok && data.user) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // User not authenticated
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      setUsernameAvailable(null);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email.includes('@')) {
      setEmailAvailable(null);
      return;
    }

    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setEmailAvailable(data.available);
    } catch (error) {
      setEmailAvailable(null);
    }
  };

  const checkSocialHandleAvailability = async (handle: string) => {
    if (!handle || handle.length < 3) {
      setSocialHandleAvailable(null);
      return;
    }

    try {
      const response = await fetch(`/api/auth/check-social-handle?handle=${encodeURIComponent(handle)}`);
      const data = await response.json();
      setSocialHandleAvailable(data.available);
    } catch (error) {
      setSocialHandleAvailable(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: registerForm.email,
          username: registerForm.username,
          password: registerForm.password,
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
          userType: registerForm.userType,
          socialHandle: registerForm.socialHandle || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        toast({
          title: "Registration Successful",
          description: `Welcome to SPIRAL, ${data.user.firstName}!`
        });
        
        // Clear form
        setRegisterForm({
          email: '', username: '', password: '', confirmPassword: '',
          firstName: '', lastName: '', userType: 'shopper', socialHandle: ''
        });
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Could not create account",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "Could not connect to registration service",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.firstName}!`
        });
        
        // Clear form
        setLoginForm({ identifier: '', password: '' });
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Could not connect to authentication service",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Could not complete logout",
        variant: "destructive"
      });
    }
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <UserCheck className="w-12 h-12 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">Welcome to SPIRAL</h1>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-4 h-4 mr-2" />
              Authenticated as {currentUser.userType}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Username:</span>
                    <span className="ml-2">@{currentUser.username}</span>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{currentUser.email}</span>
                  </div>
                  {currentUser.socialHandle && (
                    <div>
                      <span className="font-medium">Social Handle:</span>
                      <span className="ml-2">@{currentUser.socialHandle}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Account Type:</span>
                    <Badge className="ml-2" variant={currentUser.userType === 'retailer' ? 'default' : 'secondary'}>
                      {currentUser.userType === 'retailer' ? (
                        <><Store className="w-3 h-3 mr-1" /> Retailer</>
                      ) : (
                        <><ShoppingBag className="w-3 h-3 mr-1" /> Shopper</>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SPIRAL Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#006d77]">{currentUser.spiralBalance}</div>
                    <div className="text-sm text-gray-600">Current Balance</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-green-600">{currentUser.totalEarned}</div>
                      <div className="text-gray-600">Total Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-blue-600">{currentUser.totalRedeemed}</div>
                      <div className="text-gray-600">Total Redeemed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  {currentUser.isEmailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Active</span>
                  {currentUser.isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <Button 
                  variant="outline" 
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
              <CardTitle>User Authentication System Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Authentication Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Unique username system with availability checking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Email-based authentication with uniqueness validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Secure password hashing with bcrypt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>JWT-based session management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Separate shopper and retailer account types</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Social Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Optional social handles for SPIRAL experiences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Username uniqueness across entire platform</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Login with either email or username</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Integrated SPIRAL rewards tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Role-based access control</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SPIRAL User Authentication
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Unique usernames and secure authentication for shoppers and retailers
          </p>
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-800 border-blue-200">
            Demo authentication system with username uniqueness
          </Badge>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">Join SPIRAL Community</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="register">Create Account</TabsTrigger>
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                </TabsList>

                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => {
                            setRegisterForm(prev => ({ ...prev, email: e.target.value }));
                            if (e.target.value.includes('@')) {
                              checkEmailAvailability(e.target.value);
                            }
                          }}
                          className={emailAvailable === false ? 'border-red-500' : emailAvailable === true ? 'border-green-500' : ''}
                          required
                        />
                        {emailAvailable !== null && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {emailAvailable ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        )}
                      </div>
                      {emailAvailable === false && (
                        <p className="text-xs text-red-600 mt-1">Email already taken</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <Input
                          id="username"
                          value={registerForm.username}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                            setRegisterForm(prev => ({ ...prev, username: value }));
                            if (value.length >= 3) {
                              checkUsernameAvailability(value);
                            }
                          }}
                          className={usernameAvailable === false ? 'border-red-500' : usernameAvailable === true ? 'border-green-500' : ''}
                          placeholder="3-20 characters, letters/numbers/_/-"
                          required
                        />
                        {usernameAvailable !== null && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {usernameAvailable ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        )}
                      </div>
                      {usernameAvailable === false && (
                        <p className="text-xs text-red-600 mt-1">Username already taken</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="socialHandle">Social Handle (Optional)</Label>
                      <div className="relative">
                        <Input
                          id="socialHandle"
                          value={registerForm.socialHandle}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            setRegisterForm(prev => ({ ...prev, socialHandle: value }));
                            if (value.length >= 3) {
                              checkSocialHandleAvailability(value);
                            }
                          }}
                          className={socialHandleAvailable === false ? 'border-red-500' : socialHandleAvailable === true ? 'border-green-500' : ''}
                          placeholder="For sharing SPIRAL experiences"
                        />
                        {socialHandleAvailable !== null && registerForm.socialHandle && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {socialHandleAvailable ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="userType">Account Type</Label>
                      <Select value={registerForm.userType} onValueChange={(value: 'shopper' | 'retailer') => setRegisterForm(prev => ({ ...prev, userType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shopper">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4" />
                              Shopper - Browse and purchase from local stores
                            </div>
                          </SelectItem>
                          <SelectItem value="retailer">
                            <div className="flex items-center gap-2">
                              <Store className="w-4 h-4" />
                              Retailer - Sell products and manage store
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
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

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={registerForm.password && registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword ? 'border-red-500' : ''}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#006d77] hover:bg-[#005a5f]" 
                      disabled={loading || usernameAvailable === false || emailAvailable === false}
                    >
                      {loading ? 'Creating Account...' : 'Create SPIRAL Account'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="identifier">Email or Username</Label>
                      <Input
                        id="identifier"
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                        placeholder="Enter your email or username"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="loginPassword">Password</Label>
                      <div className="relative">
                        <Input
                          id="loginPassword"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
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

                    <Button 
                      type="submit" 
                      className="w-full bg-[#006d77] hover:bg-[#005a5f]" 
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In to SPIRAL'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-1">Demo System</div>
                    <div>This is a demonstration of SPIRAL's user authentication system with unique usernames, secure passwords, and separate account types for shoppers and retailers.</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}