import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Cloud,
  Rocket,
  Server,
  Database,
  Settings,
  Monitor,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Activity,
  Globe,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeploymentResponse {
  id: string;
  url: string;
  state: string;
  deployment?: any;
  service?: any;
}

export default function VercelIBMIntegration() {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('vercel-deploy');
  const [loading, setLoading] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResponse | null>(null);
  
  // Vercel Deployment State
  const [projectName, setProjectName] = useState('spiral-platform');
  const [framework, setFramework] = useState('react');
  const [branch, setBranch] = useState('main');
  const [envVars, setEnvVars] = useState('DATABASE_URL=postgres://...\nAPI_KEY=...');
  
  // IBM Cloud State
  const [serviceType, setServiceType] = useState('watson-assistant');
  const [region, setRegion] = useState('us-south');
  const [plan, setPlan] = useState('standard');

  const handleVercelDeploy = async () => {
    setLoading(true);
    try {
      const envVariables = envVars.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      }, {} as Record<string, string>);

      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          framework,
          branch,
          environmentVariables: envVariables
        })
      });
      
      const data = await res.json();
      setDeploymentResult(data);
      
      toast({
        title: "Deployment Initiated",
        description: `${projectName} deployment started successfully`,
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Unable to initiate Vercel deployment",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleIBMCloudService = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vercel/ibm-cloud/create-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          region,
          plan
        })
      });
      
      const data = await res.json();
      setDeploymentResult(data);
      
      toast({
        title: "Service Created",
        description: `${serviceType} service created in ${region}`,
      });
    } catch (error) {
      toast({
        title: "Service Creation Failed",
        description: "Unable to create IBM Cloud service",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const checkDeploymentStatus = async (deploymentId: string) => {
    try {
      const res = await fetch(`/api/vercel/deploy/${deploymentId}/status`);
      const data = await res.json();
      
      toast({
        title: "Status Updated",
        description: `Deployment is ${data.state.toLowerCase()} (${data.progress}% complete)`,
      });
      
      setDeploymentResult(prev => ({
        ...prev!,
        ...data
      }));
    } catch (error) {
      toast({
        title: "Status Check Failed",
        description: "Unable to fetch deployment status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2 flex items-center">
            <Cloud className="h-8 w-8 mr-3" />
            Vercel & IBM Cloud Integration
          </h1>
          <p className="text-gray-600">
            Advanced deployment and cloud service management for SPIRAL Platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vercel-deploy" className="flex items-center space-x-2">
              <Rocket className="h-4 w-4" />
              <span>Vercel Deploy</span>
            </TabsTrigger>
            <TabsTrigger value="ibm-cloud" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>IBM Cloud</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Monitoring</span>
            </TabsTrigger>
          </TabsList>

          {/* Vercel Deployment Tab */}
          <TabsContent value="vercel-deploy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="h-5 w-5 mr-2" />
                    Vercel Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Name</label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="spiral-platform"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Framework</label>
                    <Select value={framework} onValueChange={setFramework}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="nextjs">Next.js</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="static">Static Site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Git Branch</label>
                    <Input
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Environment Variables</label>
                    <Textarea
                      value={envVars}
                      onChange={(e) => setEnvVars(e.target.value)}
                      placeholder="DATABASE_URL=postgres://..."
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleVercelDeploy}
                    disabled={loading || !projectName}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Deploy to Vercel
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {deploymentResult && deploymentResult.deployment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Deployment Status
                      <Badge className={
                        deploymentResult.deployment.state === 'READY' ? 'bg-green-100 text-green-800' :
                        deploymentResult.deployment.state === 'BUILDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {deploymentResult.deployment.state}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Project:</span>
                        <span className="text-sm">{deploymentResult.deployment.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Framework:</span>
                        <span className="text-sm">{deploymentResult.deployment.projectSettings?.framework}</span>
                      </div>
                      
                      {deploymentResult.url && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">URL:</span>
                          <a 
                            href={deploymentResult.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            View Site <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      )}
                      
                      <div className="border-t pt-3">
                        <h5 className="font-medium mb-2">Functions:</h5>
                        <div className="space-y-1">
                          {Object.entries(deploymentResult.deployment.functions || {}).map(([path, config]: [string, any]) => (
                            <div key={path} className="flex justify-between text-xs">
                              <span>{path}</span>
                              <span className="text-gray-500">{config.runtime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => checkDeploymentStatus(deploymentResult.deployment.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Check Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* IBM Cloud Tab */}
          <TabsContent value="ibm-cloud">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    IBM Cloud Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Service Type</label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="watson-assistant">Watson Assistant</SelectItem>
                        <SelectItem value="watson-discovery">Watson Discovery</SelectItem>
                        <SelectItem value="cloudant">Cloudant Database</SelectItem>
                        <SelectItem value="redis">Redis Cache</SelectItem>
                        <SelectItem value="kubernetes">Kubernetes Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Region</label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-south">US South (Dallas)</SelectItem>
                        <SelectItem value="us-east">US East (Washington DC)</SelectItem>
                        <SelectItem value="eu-gb">UK South (London)</SelectItem>
                        <SelectItem value="eu-de">EU Central (Frankfurt)</SelectItem>
                        <SelectItem value="ap-north">Asia Pacific (Tokyo)</SelectItem>
                        <SelectItem value="ap-south">Asia Pacific (Sydney)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Service Plan</label>
                    <Select value={plan} onValueChange={setPlan}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lite">Lite (Free)</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleIBMCloudService}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Service...
                      </>
                    ) : (
                      <>
                        <Cloud className="h-4 w-4 mr-2" />
                        Create IBM Cloud Service
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {deploymentResult && deploymentResult.service && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Service Details
                      <Badge className="bg-green-100 text-green-800">
                        {deploymentResult.service.state}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Service:</span>
                        <span className="text-sm">{deploymentResult.service.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Type:</span>
                        <span className="text-sm">{deploymentResult.service.type}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Region:</span>
                        <span className="text-sm">{region}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Plan:</span>
                        <span className="text-sm capitalize">{plan}</span>
                      </div>
                      
                      {deploymentResult.service.url && (
                        <div className="border-t pt-3">
                          <span className="text-sm font-medium block mb-2">Service URL:</span>
                          <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                            {deploymentResult.service.url}
                          </code>
                        </div>
                      )}
                      
                      {deploymentResult.service.credentials && (
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            Service credentials have been generated. Store them securely in your environment variables.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Vercel Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Deployments:</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Functions:</span>
                      <span className="text-sm">8 running</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bandwidth:</span>
                      <span className="text-sm">2.3 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Requests:</span>
                      <span className="text-sm">156.2K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    IBM Cloud Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Services:</span>
                      <Badge className="bg-green-100 text-green-800">3 Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Watson Assistant:</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cloudant DB:</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Discovery:</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Uptime:</span>
                      <span className="text-sm text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time:</span>
                      <span className="text-sm">127ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate:</span>
                      <span className="text-sm text-green-600">0.02%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cost (Monthly):</span>
                      <span className="text-sm">$127.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}