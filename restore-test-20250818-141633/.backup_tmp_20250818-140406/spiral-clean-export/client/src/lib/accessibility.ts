import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccessibilitySettings {
  // Vision
  highContrast: boolean;
  largeText: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  
  // Motor
  largerClickTargets: boolean;
  stickyHover: boolean;
  slowAnimations: boolean;
  
  // Cognitive
  simplifiedLayout: boolean;
  focusIndicators: boolean;
  autoplayDisabled: boolean;
  
  // Hearing
  visualAlerts: boolean;
  captionsEnabled: boolean;
  
  // Quick modes
  accessibilityMode: boolean; // Master toggle for one-click mode
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  dyslexiaFont: false,
  reducedMotion: false,
  largerClickTargets: false,
  stickyHover: false,
  slowAnimations: false,
  simplifiedLayout: false,
  focusIndicators: false,
  autoplayDisabled: false,
  visualAlerts: false,
  captionsEnabled: false,
  accessibilityMode: false,
};

export interface AccessibilityStore extends AccessibilitySettings {
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  enableAccessibilityMode: () => void;
  disableAccessibilityMode: () => void;
  resetSettings: () => void;
  applySettingsToDOM: () => void;
}

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      updateSetting: (key, value) => {
        set({ [key]: value });
        // Apply changes to DOM immediately
        setTimeout(() => get().applySettingsToDOM(), 0);
      },
      
      enableAccessibilityMode: () => {
        const accessibilitySettings = {
          accessibilityMode: true,
          highContrast: true,
          largeText: true,
          reducedMotion: true,
          largerClickTargets: true,
          focusIndicators: true,
          slowAnimations: true,
          autoplayDisabled: true,
          visualAlerts: true,
        };
        set(accessibilitySettings);
        setTimeout(() => get().applySettingsToDOM(), 0);
      },
      
      disableAccessibilityMode: () => {
        set(defaultSettings);
        setTimeout(() => get().applySettingsToDOM(), 0);
      },
      
      resetSettings: () => {
        set(defaultSettings);
        setTimeout(() => get().applySettingsToDOM(), 0);
      },
      
      applySettingsToDOM: () => {
        const settings = get();
        const root = document.documentElement;
        
        // Apply CSS classes and attributes
        root.classList.toggle('accessibility-high-contrast', settings.highContrast);
        root.classList.toggle('accessibility-large-text', settings.largeText);
        root.classList.toggle('accessibility-dyslexia-font', settings.dyslexiaFont);
        root.classList.toggle('accessibility-reduced-motion', settings.reducedMotion);
        root.classList.toggle('accessibility-larger-targets', settings.largerClickTargets);
        root.classList.toggle('accessibility-sticky-hover', settings.stickyHover);
        root.classList.toggle('accessibility-slow-animations', settings.slowAnimations);
        root.classList.toggle('accessibility-simplified-layout', settings.simplifiedLayout);
        root.classList.toggle('accessibility-focus-indicators', settings.focusIndicators);
        root.classList.toggle('accessibility-mode', settings.accessibilityMode);
        
        // Apply CSS custom properties
        root.style.setProperty('--accessibility-font-scale', settings.largeText ? '1.2' : '1');
        root.style.setProperty('--accessibility-target-size', settings.largerClickTargets ? '48px' : '40px');
        root.style.setProperty('--accessibility-animation-duration', settings.slowAnimations ? '0.8s' : '0.3s');
        
        // Set motion preferences
        if (settings.reducedMotion) {
          root.style.setProperty('--motion-preference', 'reduce');
        } else {
          root.style.setProperty('--motion-preference', 'no-preference');
        }
        
        // Set prefers-reduced-motion for CSS media queries
        const style = document.getElementById('accessibility-styles') || document.createElement('style');
        style.id = 'accessibility-styles';
        if (!document.head.contains(style)) {
          document.head.appendChild(style);
        }
        
        style.textContent = `
          ${settings.reducedMotion ? `
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          ` : ''}
          
          ${settings.autoplayDisabled ? `
            video, audio {
              autoplay: none !important;
            }
          ` : ''}
        `;
      },
    }),
    {
      name: 'spiral-accessibility-settings',
      onRehydrateStorage: () => (state) => {
        // Apply settings after rehydration
        if (state) {
          setTimeout(() => state.applySettingsToDOM(), 100);
        }
      },
    }
  )
);

// Accessibility utility functions
export const getAccessibilityLevel = (settings: AccessibilitySettings): 'basic' | 'enhanced' | 'maximum' => {
  const enabledCount = Object.values(settings).filter(Boolean).length;
  if (enabledCount >= 8) return 'maximum';
  if (enabledCount >= 4) return 'enhanced';
  return 'basic';
};

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const getKeyboardNavigationHelp = () => [
  'Tab: Navigate to next interactive element',
  'Shift + Tab: Navigate to previous interactive element',
  'Enter/Space: Activate buttons and links',
  'Escape: Close dialogs and menus',
  'Arrow keys: Navigate within menus and lists',
  'Home/End: Jump to first/last item in lists',
];