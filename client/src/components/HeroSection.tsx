import React from "react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-6">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Amazon took your Main Street.<br className="hidden sm:inline" />
          <span className="text-blue-600"> SPIRAL is bringing it back.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-700">
          Shop local. Earn SPIRALs. Support real stores in your community and across the country.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow transition-colors">
              Join the Movement
            </button>
          </Link>
          
          <Link href="/spiral-features">
            <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-2xl shadow transition-colors">
              Learn How It Works
            </button>
          </Link>
        </div>
        
        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            #SPIRALMovement #ShopLocal #MainStreetRevival
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border">
              <div className="font-semibold text-blue-600">Local Discovery</div>
              <div className="text-gray-600">Find stores in your community</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border">
              <div className="font-semibold text-blue-600">SPIRAL Rewards</div>
              <div className="text-gray-600">Earn points for every purchase</div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border">
              <div className="font-semibold text-blue-600">Community Impact</div>
              <div className="text-gray-600">Support Main Street businesses</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link href="/spiral-wallet-demo">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all transform hover:scale-105">
                🔥 Try SPIRAL Wallet Demo
              </button>
            </Link>
            <p className="text-xs text-gray-500 mt-2">
              Experience the complete wallet system with real-time transaction tracking
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}