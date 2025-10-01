// Beta Mode Configuration
export const isBeta = process.env.MODE === "beta";
export const currentMode = process.env.MODE || "prod";

// Database URL selection based on mode
export function getDatabaseUrl(): string {
  if (isBeta && process.env.DB_URL_BETA) {
    console.log("🧪 Running in BETA mode with separate database");
    return process.env.DB_URL_BETA;
  }
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  
  console.log(`✅ Running in ${currentMode.toUpperCase()} mode`);
  return process.env.DATABASE_URL;
}

// Beta-specific configurations
export const betaConfig = {
  // Stripe in test mode for beta
  stripeMode: isBeta ? "test" : (process.env.STRIPE_MODE || "live"),
  
  // Simulation flags
  simulateCharges: isBeta,
  simulateEmails: isBeta,
  
  // Rate limiting (more lenient for beta testing)
  rateLimits: {
    general: isBeta ? 1000 : 100, // requests per 15 minutes
    api: isBeta ? 500 : 50,
    upload: isBeta ? 50 : 10
  },
  
  // Analytics tracking
  trackAnalytics: !isBeta, // Disable real analytics during beta
  
  // Feature flags
  features: {
    socialSharing: true,
    inviteSystem: true,
    pickupSpecials: true,
    multiStoreCheckout: true,
    spiralsRedemption: true
  }
};

export default { isBeta, currentMode, getDatabaseUrl, betaConfig };