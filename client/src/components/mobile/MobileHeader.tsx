import React, { useState } from "react";

interface MobileHeaderProps {
  onOpenCart: () => void;
}

export default function MobileHeader({ onOpenCart }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-screen-xl mx-auto px-3 py-2 flex items-center justify-between">
        <button 
          className="tap flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100" 
          aria-label="Menu" 
          onClick={() => setOpen(!open)}
          data-testid="button-menu"
        >
          <span className="text-xl">☰</span>
        </button>
        
        <a 
          className="font-bold text-lg text-[#007B8A] hover:text-[#005a66] transition-colors" 
          href="/"
          data-testid="link-home"
        >
          SPIRAL
        </a>
        
        <button 
          className="tap flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100 relative" 
          aria-label="Cart" 
          onClick={onOpenCart}
          data-testid="button-cart"
        >
          <span className="text-xl">🛒</span>
        </button>
      </div>
      
      {open && (
        <nav className="border-t bg-white/95 backdrop-blur">
          <ul className="flex flex-col p-3 text-base">
            <li>
              <a 
                className="py-3 block hover:text-[#007B8A] transition-colors border-b border-gray-100 last:border-0" 
                href="/malls"
                data-testid="link-malls"
                onClick={() => setOpen(false)}
              >
                Malls
              </a>
            </li>
            <li>
              <a 
                className="py-3 block hover:text-[#007B8A] transition-colors border-b border-gray-100 last:border-0" 
                href="/retailers"
                data-testid="link-retailers"
                onClick={() => setOpen(false)}
              >
                Retailers
              </a>
            </li>
            <li>
              <a 
                className="py-3 block hover:text-[#007B8A] transition-colors border-b border-gray-100 last:border-0" 
                href="/discover"
                data-testid="link-discover" 
                onClick={() => setOpen(false)}
              >
                Discover
              </a>
            </li>
            <li>
              <a 
                className="py-3 block hover:text-[#007B8A] transition-colors" 
                href="/account"
                data-testid="link-account"
                onClick={() => setOpen(false)}
              >
                Account
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}