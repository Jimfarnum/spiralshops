import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccessibilityStore, announceToScreenReader } from '@/lib/accessibility';
import { Accessibility, Zap, Settings, Eye, Volume2 } from 'lucide-react';
import { Link } from 'wouter';

interface AccessibilityToggleProps {
  compact?: boolean;
  showLabel?: boolean;
}

export default function AccessibilityToggle({ 
  compact = false, 
  showLabel = true 
}: AccessibilityToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const accessibilityStore = useAccessibilityStore();
  
  const handleQuickEnable = () => {
    accessibilityStore.enableAccessibilityMode();
    announceToScreenReader('Accessibility mode enabled. Enhanced features are now active.');
    setIsOpen(false);
  };
  
  const handleQuickDisable = () => {
    accessibilityStore.disableAccessibilityMode();
    announceToScreenReader('Accessibility mode disabled.');
    setIsOpen(false);
  };
  
  const enabledCount = Object.entries(accessibilityStore)
    .filter(([key, value]) => 
      typeof value === 'boolean' && 
      value === true && 
      !['accessibilityMode'].includes(key)
    ).length;
  
  if (compact) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 p-0"
            aria-label="Accessibility settings"
          >
            <Accessibility className="h-4 w-4" />
            {accessibilityStore.accessibilityMode && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--spiral-coral)] rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Accessibility
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {accessibilityStore.accessibilityMode ? (
            <DropdownMenuItem onClick={handleQuickDisable} className="text-green-600">
              <Eye className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">Mode Active</div>
                <div className="text-xs text-gray-500">Click to disable</div>
              </div>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleQuickEnable}>
              <Zap className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">Enable Accessibility Mode</div>
                <div className="text-xs text-gray-500">One-click optimization</div>
              </div>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/accessibility-settings">
              <Settings className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">Detailed Settings</div>
                <div className="text-xs text-gray-500">{enabledCount} features enabled</div>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Accessibility className="h-5 w-5 text-[var(--spiral-coral)]" />
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            Accessibility
          </span>
        )}
        {enabledCount > 0 && (
          <Badge variant="secondary" className="h-5 text-xs">
            {enabledCount}
          </Badge>
        )}
      </div>
      
      {accessibilityStore.accessibilityMode ? (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            Mode Active
          </Badge>
          <Button
            onClick={handleQuickDisable}
            variant="outline"
            size="sm"
            className="h-8"
          >
            Disable
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleQuickEnable}
          size="sm"
          className="h-8 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white"
        >
          <Zap className="mr-1 h-3 w-3" />
          Enable Mode
        </Button>
      )}
      
      <Link href="/accessibility-settings">
        <Button variant="ghost" size="sm" className="h-8">
          <Settings className="h-3 w-3" />
        </Button>
      </Link>
    </div>
  );
}