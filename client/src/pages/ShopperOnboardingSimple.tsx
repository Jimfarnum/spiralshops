import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

const steps = [
  { title: "Welcome to SPIRAL", message: "Shop local. Earn SPIRALS. Support real stores near you." },
  { title: "Explore Easily", message: "Browse by ZIP code, store category, or product keywords." },
  { title: "Unified Cart", message: "Add items from different retailers and checkout in one go." },
  { title: "Perks & Rewards", message: "Earn SPIRALS with every purchase. Redeem for exclusive perks." },
];

export default function ShopperOnboardingSimple() {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (localStorage.getItem("spiralOnboardingComplete")) {
      navigate('/shopper-dashboard');
    }
  }, [navigate]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      localStorage.setItem("spiralOnboardingComplete", "true");
      navigate('/shopper-dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-3">{steps[step].title}</h1>
        <p className="text-gray-700 mb-6">{steps[step].message}</p>
        <button
          onClick={nextStep}
          className="bg-black text-white py-2 px-6 rounded-xl hover:bg-gray-800 transition"
        >
          {step === steps.length - 1 ? 'Start Shopping' : 'Next'}
        </button>
      </div>
    </div>
  );
}