import { useEffect } from 'react';

export default function BrandThemeApplier() {
  useEffect(() => {
    // STOP COLOR CYCLING + APPLY SPIRAL BRAND THEME
    if (typeof window !== "undefined") {
      // 1. Stop any active color cycling
      const highestInterval = setInterval(() => {}, 0);
      clearInterval(highestInterval);
      // Clear potential intervals from 1 to 10000 (covers most cases)
      for (let i = 1; i <= 10000; i++) {
        clearInterval(i);
      }

      // 2. Define brand colors
      const brandColor = "#007B8A";   // SPIRAL teal-blue
      const textColor = "#FFFFFF";    // White text
      const accentGold = "#FFD700";   // Gold CTA accent
      const mutedGray = "#F0F0F0";    // Secondary text

      // 3. Apply background
      document.body.style.backgroundColor = brandColor;
      document.body.style.color = textColor;

      // 4. Style headers
      document.querySelectorAll("header, .header, h1, h2, h3").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = brandColor;
        element.style.color = textColor;
      });

      // 5. Style normal buttons
      document.querySelectorAll("button, .btn").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = brandColor;
        element.style.border = `1px solid ${brandColor}`;
        element.style.color = textColor;
        element.style.transition = "all 0.3s ease";
        
        const handleMouseOver = () => {
          element.style.backgroundColor = mutedGray;
          element.style.color = brandColor;
        };
        
        const handleMouseOut = () => {
          element.style.backgroundColor = brandColor;
          element.style.color = textColor;
        };
        
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseout", handleMouseOut);
        element.addEventListener("mouseover", handleMouseOver);
        element.addEventListener("mouseout", handleMouseOut);
      });

      // 6. Style CTA buttons (checkout, primary)
      document.querySelectorAll(".btn-primary, input[type=submit]").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = brandColor;
        element.style.border = `2px solid ${accentGold}`;
        element.style.color = textColor;
        element.style.fontWeight = "bold";
        element.style.transition = "all 0.3s ease";
        
        const handleMouseOver = () => {
          element.style.backgroundColor = accentGold;
          element.style.color = brandColor;
        };
        
        const handleMouseOut = () => {
          element.style.backgroundColor = brandColor;
          element.style.color = textColor;
        };
        
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseout", handleMouseOut);
        element.addEventListener("mouseover", handleMouseOver);
        element.addEventListener("mouseout", handleMouseOut);
      });

      // 7. Apply to navigation and other key elements
      document.querySelectorAll("nav, .nav, .navbar").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = brandColor;
        element.style.borderColor = accentGold;
      });

      // 8. Style links
      document.querySelectorAll("a").forEach(el => {
        const element = el as HTMLElement;
        element.style.color = textColor;
        element.style.textDecoration = "underline";
        
        const handleMouseOver = () => {
          element.style.color = accentGold;
        };
        
        const handleMouseOut = () => {
          element.style.color = textColor;
        };
        
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseout", handleMouseOut);
        element.addEventListener("mouseover", handleMouseOver);
        element.addEventListener("mouseout", handleMouseOut);
      });

      // 9. Style form elements
      document.querySelectorAll("input, textarea, select").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = mutedGray;
        element.style.border = `1px solid ${brandColor}`;
        element.style.color = brandColor;
        element.style.padding = "8px";
        element.style.borderRadius = "4px";
      });

      // 10. Style cards and containers
      document.querySelectorAll(".card, .container, .content").forEach(el => {
        const element = el as HTMLElement;
        element.style.backgroundColor = brandColor;
        element.style.border = `1px solid ${accentGold}`;
        element.style.color = textColor;
      });
    }
  }, []);

  return null;
}