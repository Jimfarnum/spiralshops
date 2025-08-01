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
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-white text-center">
      <h1 className="text-2xl font-bold mb-4">{steps[step].title}</h1>
      <p className="mb-8 text-lg">{steps[step].message}</p>
      <button
        className="px-6 py-2 bg-black text-white rounded-lg"
        onClick={nextStep}
      >
        {step === steps.length - 1 ? 'Start Shopping' : 'Next'}
      </button>
    </div>
  );
}