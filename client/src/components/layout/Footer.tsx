import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        
        <div>
          <h4 className="font-semibold mb-2">About SPIRAL</h4>
          <p className="text-sm">The Local Shopping Platform – bridging retailers, malls, and communities.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/products">Products</a></li>
            <li><a href="/stores">Stores</a></li>
            <li><a href="/malls">Malls</a></li>
            <li><a href="/features">Features</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Community</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/community">Events</a></li>
            <li><a href="/trusted-local">Trusted Local</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">info@spiralshops.com</p>
          <p className="text-sm">© 2025 SPIRAL</p>
        </div>

      </div>
    </footer>
  );
}
