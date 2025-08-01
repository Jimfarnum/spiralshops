import { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface SEOLandingPageProps {
  showAsLanding?: boolean;
}

export default function SEOLandingPage({ showAsLanding = false }: SEOLandingPageProps) {
  
  // Update page meta tags for SEO
  useEffect(() => {
    if (showAsLanding) {
      document.title = 'SPIRAL – Local Shopping Rewards Platform | Support Real Stores';
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Discover SPIRAL—earn rewards for shopping at local stores. Support real places & real people while earning discounts and benefits. Sign up free.');
      }
      
      // Update canonical URL
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', 'https://www.spiralshops.com/');
      }
      
      // Add structured data
      const existingStructuredData = document.querySelector('script[type="application/ld+json"]');
      if (!existingStructuredData) {
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "SPIRAL",
          "url": "https://www.spiralshops.com/",
          "description": "Local shopping rewards platform supporting real stores and communities.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.spiralshops.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
  }, [showAsLanding]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Header */}
      <header className="bg-[var(--spiral-navy)] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Local Shopping Rewards with SPIRAL
          </h1>
          <h2 className="text-xl md:text-2xl font-light mb-8 text-gray-200">
            Support Real Places, Earn Real Benefits
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white px-8 py-3">
                Start Shopping & Earning
              </Button>
            </Link>
            <Link href="/retailers/red-wing-shoes">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[var(--spiral-navy)] px-8 py-3">
                View Store Example
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6">
        <section className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-[var(--spiral-navy)] mb-6 text-center">
            Why Shop with SPIRAL?
          </h3>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
            SPIRAL helps you earn rewards while supporting neighborhood businesses. 
            Every purchase supports real places, real jobs, and real communities.
          </p>
          
          {/* Local Store Image Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 mb-12 text-center">
            <div className="w-full h-64 bg-gradient-to-r from-[var(--spiral-teal)] to-[var(--spiral-sage)] rounded-lg mb-4 flex items-center justify-center">
              <div className="text-white text-center">
                <h4 className="text-2xl font-bold mb-2">Local Store Network</h4>
                <p className="text-lg">Supporting brick-and-mortar retailers nationwide</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic">
              Shoppers supporting a local neighborhood store through SPIRAL rewards
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[var(--spiral-teal)] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🏪</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Real Local Stores</h4>
              <p className="text-gray-600">Shop from verified local retailers in your community</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[var(--spiral-coral)] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🌀</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Earn SPIRALs</h4>
              <p className="text-gray-600">Get rewards for every purchase that supports local business</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[var(--spiral-sage)] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Real Benefits</h4>
              <p className="text-gray-600">Redeem rewards for discounts and exclusive offers</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-[var(--spiral-cream)] p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Supporting Local?</h3>
            <p className="text-gray-700 mb-6">Join thousands of shoppers earning rewards while supporting their communities</p>
            <Link href="/onboarding">
              <Button size="lg" className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-navy)]/90 text-white px-8 py-3">
                Sign Up Free Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-[var(--spiral-navy)] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">For Shoppers</h4>
              <nav className="space-y-2">
                <Link href="/onboarding" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Get Started
                </Link>
                <Link href="/products" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Browse Products
                </Link>
                <Link href="/spirals" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Loyalty Program
                </Link>
                <Link href="/shopper-dashboard" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Shopper Dashboard
                </Link>
              </nav>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Retailers</h4>
              <nav className="space-y-2">
                <Link href="/retailer-onboarding" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Join SPIRAL
                </Link>
                <Link href="/retailer-login" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Retailer Login
                </Link>
                <Link href="/retailer-portal" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Retailer Portal
                </Link>
              </nav>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <nav className="space-y-2">
                <Link href="/about" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  About SPIRAL
                </Link>
                <Link href="/mall-directory" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Mall Directory
                </Link>
                <Link href="/social-feed" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Community
                </Link>
              </nav>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <nav className="space-y-2">
                <Link href="/help" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Help Center
                </Link>
                <Link href="/contact" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Contact Us
                </Link>
                <Link href="/privacy" className="block hover:text-[var(--spiral-coral)] transition-colors">
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 SPIRAL Inc. Supporting local retailers nationwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}