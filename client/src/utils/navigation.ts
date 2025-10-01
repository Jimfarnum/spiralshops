/**
 * Navigation utilities for SPIRAL platform
 */

export const navigateToOnboarding = () => {
  window.location.href = '/onboarding';
};

export const checkAndRedirectToOnboarding = () => {
  const hasCompletedOnboarding = localStorage.getItem('spiralOnboardingComplete');
  
  if (!hasCompletedOnboarding) {
    navigateToOnboarding();
    return true;
  }
  
  return false;
};

export const completeOnboarding = () => {
  localStorage.setItem('spiralOnboardingComplete', 'true');
};

export const resetOnboarding = () => {
  localStorage.removeItem('spiralOnboardingComplete');
};