import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Gift, Star, Trophy, Zap } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

const Spirals = () => {
  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--spiral-navy)] mb-6 font-['Poppins']">
            SPIRAL Loyalty Rewards
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 font-['Inter'] leading-relaxed">
            Earn SPIRALs every time you shop. Redeem them for perks, exclusive products, or shared experiences with your local community.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-[var(--spiral-navy)] text-center mb-12 font-['Poppins']">
            How SPIRAL Rewards Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Earning */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-sage)] to-[var(--spiral-navy)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
                Earn SPIRALs
              </h3>
              <div className="bg-[var(--spiral-sage)]/20 rounded-xl p-6 mb-4">
                <p className="text-3xl font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                  1 SPIRAL per $10 spent
                </p>
                <p className="text-gray-600 font-['Inter']">
                  Every purchase earns you SPIRALs automatically
                </p>
              </div>
              <p className="text-gray-600 font-['Inter'] leading-relaxed">
                Shop at any participating local business and watch your SPIRALs add up with every purchase.
              </p>
            </div>

            {/* Redeeming */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4 font-['Poppins']">
                Redeem Rewards
              </h3>
              <div className="bg-[var(--spiral-coral)]/20 rounded-xl p-6 mb-4">
                <p className="text-3xl font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                  25 SPIRALs = $5 reward
                </p>
                <p className="text-gray-600 font-['Inter']">
                  Or unlock exclusive partner benefits
                </p>
              </div>
              <p className="text-gray-600 font-['Inter'] leading-relaxed">
                Use your SPIRALs for discounts, exclusive products, or special community experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Reward Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
            <Trophy className="h-12 w-12 text-[var(--spiral-gold)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-3 font-['Poppins']">Store Discounts</h3>
            <p className="text-gray-600 font-['Inter']">Get money off your next purchase at participating stores</p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
            <Star className="h-12 w-12 text-[var(--spiral-coral)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-3 font-['Poppins']">Exclusive Products</h3>
            <p className="text-gray-600 font-['Inter']">Access limited-edition items only available to SPIRAL members</p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
            <Gift className="h-12 w-12 text-[var(--spiral-sage)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--spiral-navy)] mb-3 font-['Poppins']">Community Events</h3>
            <p className="text-gray-600 font-['Inter']">Join special events and experiences with fellow local shoppers</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link href="/">
            <Button className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white px-12 py-4 text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Shopping
            </Button>
          </Link>
          
          <p className="text-gray-600 mt-6 font-['Inter']">
            Join thousands of local shoppers earning SPIRALs every day
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Spirals;