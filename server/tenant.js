// Multi-tenant host mapping for SPIRAL platform
// Maps incoming host headers to mall configurations

/**
 * @typedef {Object} MallConfig
 * @property {string} mallId - Unique mall identifier
 * @property {string} name - Display name
 * @property {string} theme - Theme identifier
 * @property {string[]} allowedHosts - List of allowed hostnames
 * @property {Object} [branding] - Custom branding overrides
 */

/** @type {Record<string, MallConfig>} */
const MALL_CONFIGS = {
  "rosedale-mn": {
    mallId: "rosedale-mn",
    name: "Rosedale Center",
    theme: "rosedale",
    allowedHosts: [
      "rosedalecenter.com",
      "www.rosedalecenter.com", 
      "rosedale.spiralmalls.com"
    ],
    branding: {
      primaryColor: "#2563eb",
      logoUrl: "/assets/rosedale-logo.png"
    }
  },
  "southdale-mn": {
    mallId: "southdale-mn", 
    name: "Southdale Center",
    theme: "southdale",
    allowedHosts: [
      "southdale.com",
      "www.southdale.com",
      "southdale.spiralmalls.com"
    ],
    branding: {
      primaryColor: "#059669",
      logoUrl: "/assets/southdale-logo.png"
    }
  },
  "ridgedale-mn": {
    mallId: "ridgedale-mn",
    name: "Ridgedale Center", 
    theme: "ridgedale",
    allowedHosts: [
      "ridgedale.com",
      "www.ridgedale.com",
      "ridgedale.spiralmalls.com"
    ],
    branding: {
      primaryColor: "#dc2626",
      logoUrl: "/assets/ridgedale-logo.png"
    }
  }
};

// Default fallback config
const DEFAULT_MALL = {
  mallId: "spiral-demo",
  name: "SPIRAL Demo Mall",
  theme: "default",
  allowedHosts: ["localhost", "127.0.0.1", "*.replit.dev", "*.vercel.app"],
  branding: {
    primaryColor: "#0f172a",
    logoUrl: "/assets/spiral-logo.png"
  }
};

/**
 * Extract mall configuration from request host
 * @param {string} host - Request host header
 * @returns {MallConfig} Mall configuration
 */
export function getMallFromHost(host) {
  if (!host) return DEFAULT_MALL;
  
  // Strip port and protocol
  const cleanHost = host.replace(/:\d+$/, '').replace(/^https?:\/\//, '');
  
  // Find matching mall config
  for (const config of Object.values(MALL_CONFIGS)) {
    if (config.allowedHosts.some(allowed => {
      // Support wildcard matching
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(cleanHost);
      }
      return cleanHost === allowed;
    })) {
      return config;
    }
  }
  
  return DEFAULT_MALL;
}

/**
 * Middleware to add mall context to requests
 * @param {import('express').Request} req
 * @param {import('express').Response} res  
 * @param {import('express').NextFunction} next
 */
export function tenantMiddleware(req, res, next) {
  const mall = getMallFromHost(req.get('host'));
  req.mall = mall;
  res.locals.mall = mall;
  next();
}

/**
 * Get all configured malls
 * @returns {MallConfig[]} Array of mall configurations
 */
export function getAllMalls() {
  return Object.values(MALL_CONFIGS);
}

export { MALL_CONFIGS, DEFAULT_MALL };