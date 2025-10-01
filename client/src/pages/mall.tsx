import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store, Users } from 'lucide-react';
import SocialSharingEngine from '@/components/social-sharing-engine';
import Header from '@/components/header';
import Footer from '@/components/footer';

const Mall = () => {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--spiral-navy)] to-[var(--spiral-coral)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
            SPIRAL Mall Mode
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-[var(--spiral-coral)] mb-6 font-['Poppins']">
            Easily shop multiple stores in one place
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-['Inter'] leading-relaxed">
            Browse, earn SPIRALs, and combine carts from participating mall stores. Experience seamless shopping across multiple retailers with unified rewards and checkout.
          </p>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <ShoppingBag className="h-8 w-8 text-[var(--spiral-coral)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">Combined Carts</h3>
              <p className="text-gray-600 text-sm font-['Inter']">Shop from multiple stores and checkout once</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Users className="h-8 w-8 text-[var(--spiral-coral)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">Unified Rewards</h3>
              <p className="text-gray-600 text-sm font-['Inter']">Earn SPIRALs across all participating stores</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Store className="h-8 w-8 text-[var(--spiral-coral)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--spiral-navy)] mb-2 font-['Poppins']">Mall Directory</h3>
              <p className="text-gray-600 text-sm font-['Inter']">Discover stores and navigate easily</p>
            </div>
          </div>

          {/* CTA Button and Social Sharing */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/mall-directory">
              <Button size="lg" className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-8 py-3 rounded-xl text-lg font-semibold font-['Poppins']">
                Explore Malls
              </Button>
            </Link>
            <SocialSharingEngine
              type="mall"
              title="Check out SPIRAL Mall Mode!"
              description="Amazing way to shop multiple local stores in one place. Unified rewards and checkout!"
              mallName="SPIRAL Mall Mode"
              showEarningsPreview={true}
            />
          </div>

          <Link href="/">
            <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Return to Homepage
            </Button>
          </Link>

          {/* Coming Soon Notice */}
          <div className="mt-8 p-4 bg-[var(--spiral-gold)]/20 rounded-xl border border-[var(--spiral-gold)]/30">
            <p className="text-[var(--spiral-navy)] font-medium font-['Inter']">
              🚧 This feature is coming soon! We're working hard to bring you the best mall shopping experience.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Mall;