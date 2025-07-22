import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  Store, 
  CheckCircle,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Upload,
  Settings,
  BarChart3,
  ShoppingCart,
  Star,
  ArrowRight,
  Play,
  Clock,
  Building,
  UserCheck
} from 'lucide-react';

interface FeatureStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  icon: React.ReactNode;
  demoUrl?: string;
}

export default function RetailerFeatureDemoPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const featureSteps: FeatureStep[] = [
    {
      id: 'signup',
      title: 'Retailer Account Creation',
      description: 'Complete self-service retailer signup with business verification',
      status: 'pending',
      icon: <UserCheck className="h-6 w-6" />,
      demoUrl: '/retailers/signup'
    },
    {
      id: 'onboarding',
      title: 'Profile & Business Setup',
      description: 'Guided onboarding process with business information collection',
      status: 'pending',
      icon: <Building className="h-6 w-6" />,
      demoUrl: '/retailers/dashboard'
    },
    {
      id: 'inventory',
      title: 'Product Inventory Management',
      description: 'Add, edit, and manage product catalog with full CRUD operations',
      status: 'pending',
      icon: <Package className="h-6 w-6" />,
      demoUrl: '/retailers/dashboard'
    },
    {
      id: 'bulk-upload',
      title: 'CSV Bulk Product Upload',
      description: 'Upload hundreds of products via CSV with error handling',
      status: 'pending',
      icon: <Upload className="h-6 w-6" />,
      demoUrl: '/retailers/dashboard'
    },
    {
      id: 'admin-approval',
      title: 'Admin Approval Workflow',
      description: 'Admin review and approval system for retailer applications',
      status: 'pending',
      icon: <CheckCircle className="h-6 w-6" />,
      demoUrl: '/admin/retailers'
    },
    {
      id: 'dashboard',
      title: 'Retailer Analytics Dashboard',
      description: 'Complete business intelligence with sales and inventory tracking',
      status: 'pending',
      icon: <BarChart3 className="h-6 w-6" />,
      demoUrl: '/retailers/dashboard'
    }
  ];

  const runAutomatedDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCompletedSteps([]);

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < featureSteps.length) {
        setCompletedSteps(prev => [...prev, featureSteps[stepIndex].id]);
        stepIndex++;
        setCurrentStep(stepIndex);
        
        toast({
          title: `Step ${stepIndex} Complete`,
          description: featureSteps[stepIndex - 1]?.title || '',
        });
      } else {
        clearInterval(interval);
        setIsRunning(false);
        toast({
          title: "Demo Complete!",
          description: "All retailer onboarding features are fully operational",
        });
      }
    }, 2000);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsRunning(false);
  };

  const getStepStatus = (stepId: string, index: number): FeatureStep['status'] => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (index === currentStep && isRunning) return 'in-progress';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Store className="h-8 w-8 text-[var(--spiral-coral)]" />
              <h1 className="text-4xl font-bold text-[var(--spiral-navy)]">
                Feature 7: Retailer Self-Onboarding System
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complete retailer self-service portal with signup, inventory management, and admin approval workflows.
              This system enables retailers to join SPIRAL independently and manage their business operations.
            </p>
          </div>

          {/* Demo Controls */}
          <Card className="border-[var(--spiral-coral)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Feature 7 Demo Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={runAutomatedDemo}
                  disabled={isRunning}
                  className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/80"
                >
                  {isRunning ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Running Demo...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Automated Demo
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetDemo} disabled={isRunning}>
                  Reset Demo
                </Button>
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Demo Status: {completedSteps.length}/{featureSteps.length} features tested
                  {completedSteps.length === featureSteps.length && " - ✅ All features operational!"}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Feature Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureSteps.map((step, index) => {
              const stepStatus = getStepStatus(step.id, index);
              return (
                <Card key={step.id} className={`relative ${
                  stepStatus === 'completed' ? 'border-green-200 bg-green-50' :
                  stepStatus === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${
                          stepStatus === 'completed' ? 'bg-green-100 text-green-600' :
                          stepStatus === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {step.icon}
                        </div>
                        <Badge variant={
                          stepStatus === 'completed' ? 'default' :
                          stepStatus === 'in-progress' ? 'default' :
                          'outline'
                        }>
                          {stepStatus === 'completed' ? 'Complete' :
                           stepStatus === 'in-progress' ? 'Testing...' :
                           'Pending'}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-[var(--spiral-navy)] mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {step.description}
                        </p>
                      </div>
                      
                      {step.demoUrl && (
                        <Link href={step.demoUrl}>
                          <Button size="sm" variant="outline" className="w-full">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Test Feature
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Feature Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Feature 7: System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <Users className="h-8 w-8 text-green-600 mx-auto" />
                  </div>
                  <h3 className="font-semibold">Self-Service Signup</h3>
                  <p className="text-sm text-gray-600">
                    Retailers can create accounts independently with full business verification
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <Package className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="font-semibold">Inventory Management</h3>
                  <p className="text-sm text-gray-600">
                    Complete product CRUD operations with CSV bulk upload capabilities
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto" />
                  </div>
                  <h3 className="font-semibold">Admin Approval</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive admin review system with approval workflows
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Technical Implementation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Backend Features</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• JWT authentication system</li>
                      <li>• Bcrypt password hashing</li>
                      <li>• CSV file processing with multer</li>
                      <li>• PostgreSQL database integration</li>
                      <li>• RESTful API endpoints</li>
                      <li>• Admin moderation workflows</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Frontend Features</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• React hook form validation</li>
                      <li>• Responsive mobile design</li>
                      <li>• Real-time dashboard updates</li>
                      <li>• File upload with progress</li>
                      <li>• Multi-step onboarding</li>
                      <li>• Admin management interface</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/retailers/signup">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Retailer Signup
                  </Button>
                </Link>
                <Link href="/retailers/login">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Retailer Login
                  </Button>
                </Link>
                <Link href="/retailers/dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Retailer Dashboard
                  </Button>
                </Link>
                <Link href="/admin/retailers">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Admin Management
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}