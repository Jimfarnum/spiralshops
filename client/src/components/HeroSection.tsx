import React from "react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center w-full bg-white text-gray-900">
      {/* Hero Section - Mobile Optimized */}
      <section className="w-full bg-gradient-to-br from-yellow-100 to-orange-100 text-center py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
          Your Main Street isn't gone—it's waiting to come back
        </h1>
        <p className="section-description text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
          SPIRAL connects shoppers with real local stores, rewarding every purchase that supports a real place and real people.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <Link href="/shopper-dashboard">
            <button className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full text-base sm:text-lg hover:bg-gray-800 transition-colors">
              Shopper Dashboard
            </button>
          </Link>
          <Link href="/retailer-dashboard-new">
            <button className="w-full sm:w-auto border border-black px-6 py-3 rounded-full text-base sm:text-lg hover:bg-gray-200 transition-colors">
              Retailer Dashboard
            </button>
          </Link>
        </div>
      </section>

      {/* How It Works - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center w-full max-w-5xl">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 md:mb-10">How SPIRAL Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-3xl mb-3">🛍️</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Shop Local</h3>
            <p className="section-description text-sm sm:text-base">Discover and shop from local retailers near you or across the country.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Earn SPIRALs</h3>
            <p className="section-description text-sm sm:text-base">Earn rewards on every purchase—doubled when redeemed in person.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border sm:col-span-2 md:col-span-1">
            <div className="text-3xl mb-3">🏘️</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Fuel Community</h3>
            <p className="section-description text-sm sm:text-base">Your purchases power real jobs, local places, and Main Street revival.</p>
          </div>
        </div>
      </section>

      {/* Wallet Preview */}
      <section className="py-20 px-6 bg-gray-50 w-full text-center">
        <h2 className="text-3xl font-semibold mb-6">SPIRAL Wallet</h2>
        <p className="section-description mb-6 max-w-xl mx-auto">
          Track your earnings, see your impact, and redeem rewards easily—all in one place.
        </p>
        <Link href="/shopper-dashboard" className="text-blue-600 underline text-lg">
          Access Your Wallet
        </Link>
      </section>

      {/* Join Section */}
      <section className="py-20 px-6 text-center bg-yellow-50">
        <h2 className="text-3xl font-semibold mb-4">Be Part of the Movement</h2>
        <p className="section-description mb-6 max-w-xl mx-auto">
          Whether you're a shopper or a retailer—SPIRAL makes every local connection count.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/shopper-dashboard">
            <button className="bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800">
              Start Your SPIRAL Journey
            </button>
          </Link>
          <Link href="/retailer-dashboard-new">
            <button className="bg-white text-black border border-black px-6 py-3 rounded-full text-lg hover:bg-gray-100">
              Join as Retailer
            </button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">#EarnSPIRALs #MainStreetRevival</p>
      </section>
    </div>
  );
}