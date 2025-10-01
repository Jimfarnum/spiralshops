import { useEffect, useState } from 'react';

// SPIRAL Brand Theme System - replaces color cycling with consistent branding
const SPIRAL_BRAND = {
  name: 'SPIRAL Brand',
  brandColor: '#007B8A',     // SPIRAL teal-blue
  textColor: '#FFFFFF',      // White text
  accentGold: '#FFD700',     // Gold CTA accent
  mutedGray: '#F0F0F0',      // Secondary text
  darkTeal: '#005662',       // Darker teal for depth
  lightTeal: '#E6F7F9'       // Light teal for backgrounds
};

export default function SpiralBrandTheme() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // CSS file now handles instant branding - this is just for cleanup
    console.log('⚡ SPIRAL Brand: CSS instant branding active');

    // STEP 2: Unregister all service workers to stop background style injections
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => {
          reg.unregister();
          console.log('🧹 Service worker unregistered to prevent style interference');
        });
      });
    }

    // Show the brand indicator after a brief delay
    const showTimer = setTimeout(() => setIsVisible(true), 1000);

    // STOP COLOR CYCLING + APPLY SPIRAL BRAND THEME
    console.log('🎨 SPIRAL Brand Theme: Color cycling disabled');
    
    // 1. Stop any active color cycling
    for (let i = 1; i < 99999; i++) clearInterval(i);

    // 2. Apply SPIRAL brand theme - STREAMLINED
    const applyBrandTheme = () => {
      const root = document.documentElement;
      const { brandColor, textColor, accentGold, mutedGray, darkTeal, lightTeal } = SPIRAL_BRAND;

      console.log('🎨 Applying SPIRAL brand theme...');

      // Apply to CSS custom properties
      root.style.setProperty('--dynamic-background', lightTeal);
      root.style.setProperty('--dynamic-light-background', '#FFFFFF');
      root.style.setProperty('--dynamic-text-primary', brandColor);
      root.style.setProperty('--dynamic-text-secondary', darkTeal);
      root.style.setProperty('--dynamic-accent', accentGold);

      // Update page colors
      root.style.setProperty('--page-background', lightTeal);
      root.style.setProperty('--page-foreground', brandColor);
      root.style.setProperty('--page-muted', '#FFFFFF');
      root.style.setProperty('--page-muted-foreground', darkTeal);
      
      // Update general layout colors
      root.style.setProperty('--background', lightTeal);
      root.style.setProperty('--foreground', brandColor);
      root.style.setProperty('--muted', '#FFFFFF');
      root.style.setProperty('--muted-foreground', darkTeal);

      // Update card and navigation backgrounds
      root.style.setProperty('--card', '#FFFFFF');
      root.style.setProperty('--card-foreground', brandColor);
      root.style.setProperty('--popover', '#FFFFFF');
      root.style.setProperty('--popover-foreground', brandColor);

      // 3. Apply background - NO TRANSITIONS (INSTANT BRANDING)
      document.body.style.backgroundColor = brandColor;
      document.body.style.color = textColor;
      // No transitions - instant SPIRAL branding always

      // 4. Style headers
      document.querySelectorAll("header, .header, h1, h2, h3").forEach(el => {
        (el as HTMLElement).style.backgroundColor = brandColor;
        (el as HTMLElement).style.color = textColor;
      });

      // 5. Style normal buttons
      document.querySelectorAll("button, .btn").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = brandColor;
        element.style.border = `1px solid ${brandColor}`;
        element.style.color = textColor;
        element.style.transition = "all 0.3s ease";
        
        element.addEventListener("mouseover", () => {
          element.style.backgroundColor = mutedGray;
          element.style.color = brandColor;
        });
        element.addEventListener("mouseout", () => {
          element.style.backgroundColor = brandColor;
          element.style.color = textColor;
        });
      });

      // 6. Style CTA buttons (checkout, primary)
      document.querySelectorAll(".btn-primary, input[type=submit]").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = brandColor;
        element.style.border = `2px solid ${accentGold}`;
        element.style.color = textColor;
        element.style.fontWeight = "bold";
        element.style.transition = "all 0.3s ease";
        
        element.addEventListener("mouseover", () => {
          element.style.backgroundColor = accentGold;
          element.style.color = brandColor;
        });
        element.addEventListener("mouseout", () => {
          element.style.backgroundColor = brandColor;
          element.style.color = textColor;
        });
      });

      console.log('✅ SPIRAL brand theme applied successfully');
    };

    // STEP 2.5: Force static SPIRAL theme (no repaints, no flashing)
    const staticTheme = document.createElement("style");
    staticTheme.innerHTML = `
      * {
        animation: none !important;
        transition: none !important;
      }
      body {
        background-color: #007B8A !important;   /* SPIRAL teal-blue */
        color: #FFFFFF !important;
        overflow-x: hidden !important;          /* prevent bottom streaming */
      }
      header, .header, h1, h2, h3 {
        background-color: #007B8A !important;
        color: #FFFFFF !important;
      }
      button, .btn, input[type=submit] {
        background-color: #007B8A !important;
        border: 2px solid #FFD700 !important;   /* gold accent */
        color: #FFFFFF !important;
        font-weight: bold !important;
      }
      button:hover, .btn:hover, input[type=submit]:hover {
        background-color: #FFD700 !important;
        color: #007B8A !important;
      }
    `;
    document.head.appendChild(staticTheme);

    // Apply theme immediately
    applyBrandTheme();

    // Reapply theme when DOM changes or page becomes visible
    const observer = new MutationObserver(() => {
      setTimeout(applyBrandTheme, 100); // Small delay to let new elements render
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📱 Page visible - reapplying SPIRAL brand theme');
        applyBrandTheme();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', applyBrandTheme);
    window.addEventListener('pageshow', applyBrandTheme);

    return () => {
      clearTimeout(showTimer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', applyBrandTheme);
      window.removeEventListener('pageshow', applyBrandTheme);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border-2"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: SPIRAL_BRAND.accentGold,
          color: SPIRAL_BRAND.brandColor
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: SPIRAL_BRAND.brandColor }}
          />
          <span className="text-xs font-bold">
            {SPIRAL_BRAND.name}
          </span>
        </div>
      </div>
    </div>
  );
}