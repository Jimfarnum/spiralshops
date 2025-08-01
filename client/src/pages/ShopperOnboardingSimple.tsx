import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

const steps = [
  { title: "Welcome to SPIRAL", message: "Shop local. Earn rewards. Support real stores." },
  { title: "Browse & Discover", message: "Explore nearby shops, search by zip, or find hidden gems." },
  { title: "Earn SPIRALS", message: "Earn loyalty points at every store. Redeem for perks." },
  { title: "One Cart. All Stores.", message: "Shop across stores with one simple checkout." },
];

export default function ShopperOnboardingSimple() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (localStorage.getItem("onboardingComplete")) {
      setLocation('/');
    }
  }, [setLocation]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("onboardingComplete", "true");
      setLocation('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gradient-to-br from-teal-50 to-blue-50 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">{step + 1}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{steps[step].title}</h1>
          <p className="text-lg text-gray-600 mb-8">{steps[step].message}</p>
        </div>
        
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Step {step + 1} of {steps.length}</p>
        </div>

        <button
          className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-200"
          onClick={nextStep}
        >
          {step === steps.length - 1 ? 'Start Shopping' : 'Next'}
        </button>
      </div>
    </div>
  );
}