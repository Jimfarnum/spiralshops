import React from 'react';

// Example React component to conditionally hide popup during onboarding
interface ReferralPopupProps {
  isOnboarding: boolean;
}

const ReferralPopup: React.FC<ReferralPopupProps> = ({ isOnboarding }) => {
  // Do not render during the onboarding flow
  if (isOnboarding) return null;
  
  return (
    <div className="share-on-x modal-popup">
      {/* existing popup content */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Share SPIRAL with Friends!</h3>
        <p className="text-gray-600 mb-4">
          Invite friends to discover local shopping rewards and earn bonus SPIRALs.
        </p>
        <div className="flex gap-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Share on X
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

// Conditional rendering pattern for popups during onboarding
interface SharePopupWrapperProps {
  isOnboarding: boolean;
  children?: React.ReactNode;
}

const SharePopupWrapper: React.FC<SharePopupWrapperProps> = ({ isOnboarding, children }) => {
  return (
    <>
      {!isOnboarding && children}
    </>
  );
};

// Hook to manage onboarding state
export const useSpiralshopsOnboarding = () => {
  const [isOnboarding, setIsOnboarding] = React.useState(false);
  
  const startOnboarding = () => setIsOnboarding(true);
  const endOnboarding = () => setIsOnboarding(false);
  
  return {
    isOnboarding,
    startOnboarding,
    endOnboarding
  };
};

export { ReferralPopup, SharePopupWrapper };