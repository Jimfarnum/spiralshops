import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--spiral-cream)] border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="@assets/5f2ddb9c-bed6-466a-a305-c06542e7cf4b.png (1)_1752624555680.PNG" 
                alt="SPIRAL Logo" 
                className="w-8 h-8 mr-3 static"
              />
              <span className="text-2xl font-bold text-[var(--spiral-navy)]">SPIRAL</span>
            </div>
            <p className="text-lg text-[var(--spiral-navy)] mb-2 font-medium">
              Everything Local. Just for You.
            </p>
            <p className="text-gray-600 mb-6 max-w-md">
              Connecting local shoppers with amazing businesses in their community. 
              Support local, shop modern, think global.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-[var(--spiral-coral)] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[var(--spiral-coral)] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[var(--spiral-coral)] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[var(--spiral-coral)] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--spiral-navy)]">For Shoppers</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/" className="hover:text-[var(--spiral-coral)] transition-colors">Find Stores</a></li>
              <li><a href="/products" className="hover:text-[var(--spiral-coral)] transition-colors">Browse Categories</a></li>
              <li><a href="/spirals" className="hover:text-[var(--spiral-coral)] transition-colors">SPIRAL Rewards</a></li>
              <li><a href="/social-feed" className="hover:text-[var(--spiral-coral)] transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--spiral-navy)]">Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/retailer-login" className="hover:text-[var(--spiral-coral)] transition-colors">For Retailers</a></li>
              <li><a href="/spiral-features" className="hover:text-[var(--spiral-coral)] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[var(--spiral-coral)] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[var(--spiral-coral)] transition-colors">Help</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 SPIRAL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
