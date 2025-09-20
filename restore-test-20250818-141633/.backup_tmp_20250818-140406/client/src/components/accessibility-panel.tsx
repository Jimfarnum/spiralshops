import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useAccessibilityStore, 
  announceToScreenReader, 
  getAccessibilityLevel,
  getKeyboardNavigationHelp 
} from '@/lib/accessibility';
import { 
  Eye, 
  Hand, 
  Brain, 
  Volume2, 
  Zap, 
  RotateCcw, 
  Info,
  Keyboard,
  CheckCircle,
  Settings
} from 'lucide-react';

export default function AccessibilityPanel() {
  const [activeTab, setActiveTab] = useState('quick');
  const accessibilityStore = useAccessibilityStore();
  const accessibilityLevel = getAccessibilityLevel(accessibilityStore);
  
  const handleOneClickEnable = () => {
    accessibilityStore.enableAccessibilityMode();
    announceToScreenReader('Accessibility mode enabled. High contrast, large text, and enhanced focus indicators are now active.');
  };
  
  const handleOneClickDisable = () => {
    accessibilityStore.disableAccessibilityMode();
    announceToScreenReader('Accessibility mode disabled. Settings have been reset to default.');
  };
  
  const handleReset = () => {
    accessibilityStore.resetSettings();
    announceToScreenReader('All accessibility settings have been reset to default values.');
  };
  
  const settingSections = [
    {
      key: 'vision',
      title: 'Vision Support',
      icon: Eye,
      description: 'Enhance visual accessibility',
      settings: [
        { key: 'highContrast', label: 'High Contrast Colors', description: 'Increase color contrast for better visibility' },
        { key: 'largeText', label: 'Large Text Size', description: 'Increase font size by 20%' },
        { key: 'dyslexiaFont', label: 'Dyslexia-Friendly Font', description: 'Use OpenDyslexic font family' },
        { key: 'reducedMotion', label: 'Reduce Motion', description: 'Minimize animations and transitions' },
      ],
    },
    {
      key: 'motor',
      title: 'Motor Support',
      icon: Hand,
      description: 'Improve interaction accessibility',
      settings: [
        { key: 'largerClickTargets', label: 'Larger Click Targets', description: 'Increase button and link sizes' },
        { key: 'stickyHover', label: 'Sticky Hover Effects', description: 'Hover effects persist longer' },
        { key: 'slowAnimations', label: 'Slower Animations', description: 'Extend animation duration' },
      ],
    },
    {
      key: 'cognitive',
      title: 'Cognitive Support',
      icon: Brain,
      description: 'Simplify interface complexity',
      settings: [
        { key: 'simplifiedLayout', label: 'Simplified Layout', description: 'Reduce visual complexity' },
        { key: 'focusIndicators', label: 'Enhanced Focus', description: 'Stronger focus indicators' },
        { key: 'autoplayDisabled', label: 'Disable Autoplay', description: 'Stop automatic media playback' },
      ],
    },
    {
      key: 'hearing',
      title: 'Hearing Support',
      icon: Volume2,
      description: 'Audio and sound alternatives',
      settings: [
        { key: 'visualAlerts', label: 'Visual Alerts', description: 'Replace sound alerts with visual cues' },
        { key: 'captionsEnabled', label: 'Enable Captions', description: 'Show captions when available' },
      ],
    },
  ];
  
  const enabledCount = Object.values(accessibilityStore).filter((value, index) => 
    index < Object.keys(accessibilityStore).length - 4 && value === true
  ).length;
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Settings className="h-8 w-8 text-[var(--spiral-coral)]" />
          <h1 className="text-3xl font-bold text-[var(--spiral-navy)]">
            Accessibility Settings
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Customize SPIRAL to work better for your needs. Use One-Click Accessibility Mode for instant optimization.
        </p>
      </div>
      
      {/* Current Status */}
      <Card className="border-[var(--spiral-sage)]/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Current Accessibility Level
              </CardTitle>
              <CardDescription>
                {enabledCount} of 13 accessibility features enabled
              </CardDescription>
            </div>
            <Badge 
              variant={accessibilityLevel === 'maximum' ? 'default' : 'secondary'}
              className={`text-sm ${
                accessibilityLevel === 'maximum' ? 'bg-green-100 text-green-800' :
                accessibilityLevel === 'enhanced' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {accessibilityLevel === 'maximum' ? 'Maximum' :
               accessibilityLevel === 'enhanced' ? 'Enhanced' : 'Basic'}
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            One-Click Mode
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Detailed Settings
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Help & Info
          </TabsTrigger>
        </TabsList>
        
        {/* One-Click Mode Tab */}
        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-[var(--spiral-coral)]" />
                One-Click Accessibility Mode
              </CardTitle>
              <CardDescription>
                Instantly enable comprehensive accessibility features optimized for most users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!accessibilityStore.accessibilityMode ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Activate accessibility mode to enable high contrast, large text, enhanced focus indicators, 
                    reduced motion, and other helpful features all at once.
                  </p>
                  <Button 
                    onClick={handleOneClickEnable}
                    size="lg"
                    className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white font-semibold px-8"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Enable Accessibility Mode
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Accessibility Mode Active</span>
                  </div>
                  <p className="text-gray-600">
                    Enhanced accessibility features are currently enabled. You can customize individual 
                    settings in the Detailed Settings tab or disable accessibility mode below.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={handleOneClickDisable}
                      variant="outline"
                      className="border-[var(--spiral-coral)] text-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/10"
                    >
                      Disable Accessibility Mode
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('detailed')}
                      variant="outline"
                    >
                      Customize Settings
                    </Button>
                  </div>
                </div>
              )}
              
              <Separator />
              
              {/* Features Overview */}
              <div>
                <h3 className="font-semibold text-[var(--spiral-navy)] mb-3">
                  Features Included in Accessibility Mode:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'High contrast colors for better visibility',
                    'Large text size (20% increase)',
                    'Enhanced focus indicators',
                    'Reduced motion and animations',
                    'Larger click targets',
                    'Visual alerts instead of sounds',
                    'Slower animation speeds',
                    'Disabled autoplay content'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Detailed Settings Tab */}
        <TabsContent value="detailed" className="space-y-6">
          {settingSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[var(--spiral-coral)]" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between space-x-4">
                      <div className="flex-1">
                        <label 
                          htmlFor={setting.key}
                          className="text-sm font-medium text-[var(--spiral-navy)] cursor-pointer"
                        >
                          {setting.label}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          {setting.description}
                        </p>
                      </div>
                      <Switch
                        id={setting.key}
                        checked={accessibilityStore[setting.key as keyof typeof accessibilityStore] as boolean}
                        onCheckedChange={(checked) => 
                          accessibilityStore.updateSetting(setting.key as any, checked)
                        }
                        aria-describedby={`${setting.key}-description`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
          
          {/* Reset Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All Settings
            </Button>
          </div>
        </TabsContent>
        
        {/* Help & Info Tab */}
        <TabsContent value="help" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-[var(--spiral-coral)]" />
                  Keyboard Navigation
                </CardTitle>
                <CardDescription>
                  Essential keyboard shortcuts for navigating SPIRAL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getKeyboardNavigationHelp().map((shortcut, index) => (
                    <div key={index} className="flex gap-3">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {shortcut.split(':')[0]}
                      </code>
                      <span className="text-sm text-gray-700">
                        {shortcut.split(':')[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[var(--spiral-coral)]" />
                  About Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">Vision Support</h4>
                  <p className="text-sm text-gray-600">
                    Features designed for users with visual impairments, low vision, or color blindness. 
                    Includes high contrast modes, text scaling, and motion reduction.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">Motor Support</h4>
                  <p className="text-sm text-gray-600">
                    Accommodations for users with motor impairments or dexterity challenges. 
                    Provides larger click targets and extended hover states.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">Cognitive Support</h4>
                  <p className="text-sm text-gray-600">
                    Simplifications for users with cognitive disabilities, attention disorders, or learning differences. 
                    Reduces complexity and provides clearer focus indicators.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--spiral-navy)] mb-2">Hearing Support</h4>
                  <p className="text-sm text-gray-600">
                    Alternatives for users who are deaf or hard of hearing. 
                    Replaces audio cues with visual indicators.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}