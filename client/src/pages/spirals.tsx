import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Gift, Star, Trophy, Zap } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SpiralsExplainer from '@/components/SpiralsExplainer';

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
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 font-['Inter'] leading-relaxed">
            Earn SPIRALs every time you shop. Redeem them for perks, exclusive products, or shared experiences with your local community.
          </p>
          
          <div className="bg-[var(--spiral-navy)]/10 rounded-2xl p-6 max-w-4xl mx-auto mb-12">
            <p className="text-lg text-[var(--spiral-navy)] font-['Inter'] text-center leading-relaxed">
              <strong>SPIRAL is powered by real stores and real people.</strong><br />
              You can shop local retailers across the U.S. and earn SPIRALs that are redeemable at your favorite hometown stores.<br />
              Together, we're helping keep local retailers, malls, and communities open and thriving.
            </p>
          </div>
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
                <div className="space-y-3 mb-4">
                  <div className="bg-[var(--spiral-sage)]/30 rounded-lg p-3">
                    <p className="text-xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                      5 SPIRALs per $100 online
                    </p>
                  </div>
                  <div className="bg-[var(--spiral-coral)]/30 rounded-lg p-3">
                    <p className="text-xl font-bold text-[var(--spiral-navy)] font-['Poppins']">
                      10 SPIRALs per $100 in-person
                    </p>
                  </div>
                  <div className="bg-[var(--spiral-gold)]/30 rounded-lg p-3">
                    <p className="text-lg font-bold text-[var(--spiral-navy)] font-['Poppins']">
                      +5 SPIRALs for sharing experiences
                    </p>
                  </div>
                  <div className="bg-[var(--spiral-gold)]/30 rounded-lg p-3">
                    <p className="text-lg font-bold text-[var(--spiral-navy)] font-['Poppins']">
                      +5 SPIRALs for bringing friends
                    </p>
                  </div>
                </div>
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
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-[var(--spiral-coral)]/30">
                    <p className="text-xl font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">
                      Redeemable at any SPIRAL network store
                    </p>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Local brick-and-mortar businesses nationwide
                    </p>
                  </div>
                  <div className="bg-[var(--spiral-gold)]/20 rounded-lg p-4 border border-[var(--spiral-gold)]/30">
                    <p className="text-lg font-bold text-[var(--spiral-navy)] mb-1 font-['Poppins']">
                      💰 Double Value In-Person
                    </p>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      SPIRALs earned online are worth 2x when redeemed in-store
                    </p>
                  </div>
                  <div className="bg-[var(--spiral-sage)]/20 rounded-lg p-4 border border-[var(--spiral-sage)]/30">
                    <p className="text-lg font-bold text-[var(--spiral-navy)] mb-1 font-['Poppins']">
                      🏪 Exclusive Mall Discounts
                    </p>
                    <p className="text-sm text-gray-600 font-['Inter']">
                      Special rates at participating mall retailers
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 font-['Inter'] leading-relaxed">
                Support local businesses while saving money. Your SPIRALs help keep communities thriving.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-[var(--spiral-navy)] text-center mb-12 font-['Poppins']">
            Why SPIRAL Loyalty?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--spiral-coral)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">Higher In-Person Rewards</h3>
                  <p className="text-gray-600 font-['Inter']">Earn 2x SPIRALs when you shop in local stores vs. online</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--spiral-sage)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">Double Value Redemption</h3>
                  <p className="text-gray-600 font-['Inter']">Online SPIRALs are worth 2x when redeemed in physical stores</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--spiral-gold)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">Community Building</h3>
                  <p className="text-gray-600 font-['Inter']">Earn bonus SPIRALs for sharing experiences and bringing friends</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--spiral-navy)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--spiral-navy)] mb-2 font-['Poppins']">Supporting Local</h3>
                  <p className="text-gray-600 font-['Inter']">Every SPIRAL spent helps keep local retailers and communities thriving</p>
                </div>
              </div>
            </div>
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