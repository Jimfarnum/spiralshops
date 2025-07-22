import { useEffect } from 'react';
import { useAccessibilityStore } from '@/lib/accessibility';

export default function AccessibilityInitialization() {
  const { applySettingsToDOM } = useAccessibilityStore();
  
  useEffect(() => {
    // Apply accessibility settings on app initialization
    applySettingsToDOM();
    
    // Add skip link to the document
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.id = 'skip-link';
    
    // Only add if it doesn't already exist
    if (!document.getElementById('skip-link')) {
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Add main content id to the first main element or create one
    const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainElement && !mainElement.id) {
      mainElement.id = 'main-content';
    } else if (!mainElement) {
      // Add main-content id to a wrapper div if no main element exists
      const wrapper = document.querySelector('#root > div');
      if (wrapper && !wrapper.id) {
        wrapper.id = 'main-content';
      }
    }
    
    // Cleanup function
    return () => {
      const existingSkipLink = document.getElementById('skip-link');
      if (existingSkipLink) {
        existingSkipLink.remove();
      }
    };
  }, [applySettingsToDOM]);
  
  return null; // This component doesn't render anything
}