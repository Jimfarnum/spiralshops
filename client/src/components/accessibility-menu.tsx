import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Type, 
  Palette, 
  MousePointer,
  ZoomIn
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusOutline: boolean;
  colorAdjustment: string;
}

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>('spiral-accessibility', {
    fontSize: 100,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    focusOutline: true,
    colorAdjustment: 'normal'
  });

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Apply accessibility settings to document
  const applySettings = () => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${settings.fontSize}%`;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0ms');
      root.classList.add('reduced-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduced-motion');
    }
    
    // Focus outline
    if (settings.focusOutline) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  };

  // Apply settings when they change
  useEffect(() => {
    applySettings();
  }, [settings]);

  const accessibilityOptions = [
    {
      id: 'fontSize',
      label: 'Text Size',
      icon: Type,
      type: 'slider',
      value: settings.fontSize,
      min: 75,
      max: 150,
      step: 25,
      description: 'Adjust text size for better readability'
    },
    {
      id: 'highContrast',
      label: 'High Contrast',
      icon: Palette,
      type: 'switch',
      value: settings.highContrast,
      description: 'Increase contrast for better visibility'
    },
    {
      id: 'reducedMotion',
      label: 'Reduce Motion',
      icon: MousePointer,
      type: 'switch', 
      value: settings.reducedMotion,
      description: 'Minimize animations and transitions'
    },
    {
      id: 'focusOutline',
      label: 'Focus Indicators',
      icon: ZoomIn,
      type: 'switch',
      value: settings.focusOutline,
      description: 'Show focus outlines for keyboard navigation'
    },
    {
      id: 'screenReader',
      label: 'Screen Reader Optimized',
      icon: Volume2,
      type: 'switch',
      value: settings.screenReader,
      description: 'Optimize for screen reader users'
    }
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 left-4 z-50 bg-white border-2 border-[var(--spiral-navy)] text-[var(--spiral-navy)] hover:bg-[var(--spiral-cream)] shadow-lg"
            aria-label="Accessibility Settings"
          >
            <Accessibility className="h-4 w-4" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-80 bg-white">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-[var(--spiral-navy)]">
              <Accessibility className="h-5 w-5" />
              Accessibility Settings
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {accessibilityOptions.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--spiral-coral)]/10 flex items-center justify-center">
                    <option.icon className="h-4 w-4 text-[var(--spiral-coral)]" />
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold text-[var(--spiral-navy)]">
                      {option.label}
                    </label>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>

                {option.type === 'switch' && (
                  <div className="pl-11">
                    <Switch
                      checked={option.value}
                      onCheckedChange={(checked) => updateSetting(option.id as keyof AccessibilitySettings, checked)}
                    />
                  </div>
                )}

                {option.type === 'slider' && (
                  <div className="pl-11 space-y-2">
                    <Slider
                      value={[option.value]}
                      onValueChange={([value]) => updateSetting(option.id as keyof AccessibilitySettings, value)}
                      min={option.min}
                      max={option.max}
                      step={option.step}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{option.min}%</span>
                      <span className="font-semibold">{option.value}%</span>
                      <span>{option.max}%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Reset Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  setSettings({
                    fontSize: 100,
                    highContrast: false,
                    reducedMotion: false,
                    screenReader: false,
                    focusOutline: true,
                    colorAdjustment: 'normal'
                  });
                }}
                variant="outline"
                className="w-full"
              >
                Reset to Default
              </Button>
            </div>

            {/* Info */}
            <div className="p-3 bg-[var(--spiral-cream)] rounded-lg">
              <p className="text-xs text-gray-600">
                SPIRAL is committed to accessibility. These settings are saved automatically and will persist across sessions.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add accessibility CSS */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(150%) saturate(150%);
        }
        
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .focus-visible *:focus {
          outline: 2px solid var(--spiral-coral) !important;
          outline-offset: 2px !important;
        }
      `}</style>
    </>
  );
}