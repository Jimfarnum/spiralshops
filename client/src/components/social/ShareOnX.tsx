import React from "react";

interface ShareOnXProps {
  url?: string;
  productName?: string;
  customText?: string;
}

export default function ShareOnX({ url, productName, customText }: ShareOnXProps) {
  async function handleShare() {
    try {
      // Compose share text via API or use default
      let shareText = customText;
      
      if (!shareText) {
        if (url) {
          const response = await fetch("/api/share/compose", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              productUrl: url,
              productName: productName 
            })
          });
          
          if (response.ok) {
            const { composed } = await response.json();
            shareText = composed;
          }
        }
        
        // Fallback share text
        if (!shareText) {
          shareText = `Check out this amazing find on SPIRAL! Supporting local retailers has never been easier. ${url || 'https://spiralshops.com'} #SpiralShops #ShopLocal`;
        }
      }

      // Create Twitter/X intent URL
      const intent = new URL("https://x.com/intent/tweet");
      intent.searchParams.set("text", shareText);
      
      // Open in new window optimized for mobile
      const popup = window.open(
        intent.toString(), 
        "_blank", 
        "noopener,noreferrer,width=550,height=420,scrollbars=yes,resizable=yes"
      );
      
      // Focus the popup if it was blocked
      if (popup) popup.focus();
      
    } catch (error) {
      console.error("Share error:", error);
      
      // Fallback - direct share with simple text
      const fallbackText = `Check out SPIRAL - the local shopping platform! ${url || 'https://spiralshops.com'}`;
      const fallbackIntent = new URL("https://x.com/intent/tweet");
      fallbackIntent.searchParams.set("text", fallbackText);
      
      window.open(fallbackIntent.toString(), "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button 
      className="tap rounded-lg border-2 border-[#1DA1F2] bg-white hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white transition-colors px-4 py-2 font-medium flex items-center gap-2"
      onClick={handleShare}
      data-testid="button-share-x"
    >
      <span className="text-lg">🐦</span>
      Share on X
    </button>
  );
}