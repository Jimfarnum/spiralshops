import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-spiral-blue rounded-full flex items-center justify-center mr-2">
                <div className="w-6 h-6 border-2 border-white rounded-full animate-spin" 
                     style={{ borderTopColor: 'transparent' }} />
              </div>
              <span className="text-2xl font-bold">SPIRAL</span>
            </div>
            <p className="text-lg text-gray-300 mb-2 font-['Inter'] font-medium">
              Everything Local. Just for You.
            </p>
            <p className="text-gray-400 mb-6 max-w-md font-['Inter']">
              Connecting local shoppers with amazing businesses in their community. 
              Support local, shop modern, think global.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Shoppers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Find Stores</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Browse Categories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Perks & Rewards</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Retailers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Join SPIRAL</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Manage Store</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SPIRAL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
