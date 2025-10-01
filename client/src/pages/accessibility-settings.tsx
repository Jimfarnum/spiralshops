import { useEffect } from 'react';
import Header from "@/components/header";
import AccessibilityPanel from "@/components/accessibility-panel";
import { useAccessibilityStore } from '@/lib/accessibility';

export default function AccessibilitySettings() {
  const { applySettingsToDOM } = useAccessibilityStore();
  
  // Ensure settings are applied when component mounts
  useEffect(() => {
    applySettingsToDOM();
  }, [applySettingsToDOM]);
  
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AccessibilityPanel />
      </div>
    </div>
  );
}