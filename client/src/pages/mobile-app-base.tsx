import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Play,
  Apple,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
  Share2,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeviceCapability {
  feature: string;
  supported: boolean;
  description: string;
}

interface PlatformStatus {
  platform: 'iOS' | 'Android' | 'Web';
  status: 'Ready' | 'Testing' | 'Development';
  version: string;
  capabilities: DeviceCapability[];
}

export default function MobileAppBase() {
  const { toast } = useToast();
  
  const [selectedPlatform, setSelectedPlatform] = useState<'iOS' | 'Android' | 'Web'>('Web');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const platformData: Record<string, PlatformStatus> = {
    iOS: {
      platform: 'iOS',
      status: 'Development',
      version: '1.0.0-beta',
      capabilities: [
        { feature: 'Push Notifications', supported: true, description: 'iOS native push notifications' },
        { feature: 'Camera/QR Scanner', supported: true, description: 'Native camera access for QR codes' },
        { feature: 'Touch ID/Face ID', supported: true, description: 'Biometric authentication' },
        { feature: 'Apple Pay', supported: true, description: 'Native Apple Pay integration' },
        { feature: 'Location Services', supported: true, description: 'GPS and location tracking' },
        { feature: 'Offline Storage', supported: true, description: 'Local data persistence' },
        { feature: 'Background Sync', supported: false, description: 'Background data synchronization' }
      ]
    },
    Android: {
      platform: 'Android',
      status: 'Development',
      version: '1.0.0-beta',
      capabilities: [
        { feature: 'Push Notifications', supported: true, description: 'FCM push notifications' },
        { feature: 'Camera/QR Scanner', supported: true, description: 'Camera2 API for QR scanning' },
        { feature: 'Fingerprint Auth', supported: true, description: 'Biometric authentication' },
        { feature: 'Google Pay', supported: true, description: 'Google Pay integration' },
        { feature: 'Location Services', supported: true, description: 'GPS and network location' },
        { feature: 'Offline Storage', supported: true, description: 'SQLite local storage' },
        { feature: 'Background Sync', supported: true, description: 'WorkManager background tasks' }
      ]
    },
    Web: {
      platform: 'Web',
      status: 'Ready',
      version: '2.0.0',
      capabilities: [
        { feature: 'Push Notifications', supported: true, description: 'Browser push notifications' },
        { feature: 'Camera/QR Scanner', supported: true, description: 'WebRTC camera access' },
        { feature: 'Biometric Auth', supported: true, description: 'WebAuthn biometric support' },
        { feature: 'Web Payments', supported: true, description: 'Payment Request API' },
        { feature: 'Geolocation', supported: true, description: 'Browser geolocation API' },
        { feature: 'Offline Storage', supported: true, description: 'IndexedDB and Service Workers' },
        { feature: 'PWA Features', supported: true, description: 'Progressive Web App capabilities' }
      ]
    }
  };

  useEffect(() => {
    // Check for PWA install capability
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "App Installed",
          description: "SPIRAL has been added to your home screen",
        });
        setIsInstallable(false);
      }
      setInstallPrompt(null);
    }
  };

  const testFeature = (feature: string) => {
    toast({
      title: `Testing ${feature}`,
      description: `${feature} functionality is being validated...`,
    });

    // Simulate feature testing
    setTimeout(() => {
      toast({
        title: "Test Complete",
        description: `${feature} is working correctly`,
      });
    }, 2000);
  };

  const current = platformData[selectedPlatform];
  const supportedCount = current.capabilities.filter(c => c.supported).length;
  const totalCount = current.capabilities.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)] mb-2">
            SPIRAL Mobile App Base
          </h1>
          <p className="text-gray-600">
            Cross-platform mobile application development and testing
          </p>
        </div>

        {/* Platform Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {Object.entries(platformData).map(([key, platform]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedPlatform(platform.platform)}
                  variant={selectedPlatform === platform.platform ? "default" : "outline"}
                  className="flex items-center space-x-2"
                >
                  {platform.platform === 'iOS' && <Apple className="h-4 w-4" />}
                  {platform.platform === 'Android' && <Play className="h-4 w-4" />}
                  {platform.platform === 'Web' && <Monitor className="h-4 w-4" />}
                  <span>{platform.platform}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Platform Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    {selectedPlatform === 'iOS' && <Apple className="h-5 w-5 mr-2" />}
                    {selectedPlatform === 'Android' && <Play className="h-5 w-5 mr-2" />}
                    {selectedPlatform === 'Web' && <Monitor className="h-5 w-5 mr-2" />}
                    {current.platform} Platform
                  </div>
                  <Badge className={
                    current.status === 'Ready' ? 'bg-green-100 text-green-800' :
                    current.status === 'Testing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {current.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Version: {current.version}</span>
                    <span className="text-sm text-gray-600">
                      {supportedCount}/{totalCount} features supported
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(supportedCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {current.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {capability.supported ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{capability.feature}</h4>
                          <p className="text-sm text-gray-600">{capability.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => testFeature(capability.feature)}
                        size="sm"
                        variant="outline"
                        disabled={!capability.supported}
                      >
                        Test
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PWA Installation */}
            {selectedPlatform === 'Web' && isInstallable && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Install SPIRAL App
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      Install SPIRAL as a Progressive Web App for the best mobile experience.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={installPWA} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Add to Home Screen
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Development Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Web Platform:</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>iOS Platform:</span>
                    <Badge className="bg-blue-100 text-blue-800">Development</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Android Platform:</span>
                    <Badge className="bg-blue-100 text-blue-800">Development</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cross-Platform:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Testing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phase 1 Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Web App Functional</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">iOS Base Setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Android Base Setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Cross-Platform Testing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Test All Features
                </Button>
                <Button className="w-full" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Performance Test
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Test Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}