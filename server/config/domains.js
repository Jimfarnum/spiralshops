// SPIRAL Domain Configuration Management
// Comprehensive domain handling for all environments

export const DOMAIN_CONFIG = {
  // Production domains
  production: {
    primary: 'spiralmalls.com',
    alternatives: ['www.spiralmalls.com', 'spiralshops.com', 'www.spiralshops.com'],
    protocol: 'https'
  },
  
  // Development domains
  development: {
    primary: 'localhost',
    ports: [3000, 5000, 8080],
    protocol: 'http'
  },
  
  // Replit domains
  replit: {
    patterns: ['.replit.app', '.repl.co', '.replit.dev'],
    protocol: 'https'
  },
  
  // Staging domains
  staging: {
    primary: 'staging.spiralmalls.com',
    alternatives: ['beta.spiralmalls.com'],
    protocol: 'https'
  }
};

export function detectEnvironment(hostname = '') {
  if (!hostname && typeof window !== 'undefined') {
    hostname = window.location.hostname;
  }
  
  // Handle hostname with port
  const cleanHostname = hostname.split(':')[0];
  
  // Development detection
  if (cleanHostname === 'localhost' || cleanHostname === '127.0.0.1' || cleanHostname.startsWith('192.168.') || hostname.includes('localhost:')) {
    return 'development';
  }
  
  // Replit detection
  if (DOMAIN_CONFIG.replit.patterns.some(pattern => hostname.includes(pattern))) {
    return 'replit';
  }
  
  // Staging detection
  if (hostname.includes('staging.') || hostname.includes('beta.')) {
    return 'staging';
  }
  
  // Production detection
  const prodDomains = [DOMAIN_CONFIG.production.primary, ...DOMAIN_CONFIG.production.alternatives];
  if (prodDomains.some(domain => hostname.includes(domain.replace('www.', '')))) {
    return 'production';
  }
  
  return 'unknown';
}

export function getCanonicalDomain(environment, hostname = '') {
  const config = DOMAIN_CONFIG[environment];
  if (!config) return hostname;
  
  switch (environment) {
    case 'production':
      return config.primary;
    case 'staging':
      return config.primary;
    case 'development':
      return `${config.primary}:${process.env.PORT || 5000}`;
    case 'replit':
      return hostname; // Use actual Replit domain
    default:
      return hostname;
  }
}

export function buildUrl(path = '', environment = null, hostname = '') {
  if (!environment) {
    environment = detectEnvironment(hostname);
  }
  
  const config = DOMAIN_CONFIG[environment];
  const protocol = config?.protocol || 'https';
  const domain = getCanonicalDomain(environment, hostname);
  
  return `${protocol}://${domain}${path.startsWith('/') ? path : `/${path}`}`;
}

export function validateDomain(hostname) {
  const environment = detectEnvironment(hostname);
  const config = DOMAIN_CONFIG[environment];
  
  if (!config) {
    return { valid: false, environment: 'unknown', reason: 'Unrecognized domain' };
  }
  
  return { valid: true, environment, canonical: getCanonicalDomain(environment, hostname) };
}

// SSL Certificate validation
export function getSSLConfig(environment) {
  switch (environment) {
    case 'production':
    case 'staging':
      return {
        requireSSL: true,
        hsts: true,
        certificate: 'letsencrypt' // Or custom certificate path
      };
    case 'replit':
      return {
        requireSSL: true,
        hsts: true,
        certificate: 'replit-managed'
      };
    case 'development':
      return {
        requireSSL: false,
        hsts: false,
        certificate: 'none'
      };
    default:
      return {
        requireSSL: false,
        hsts: false,
        certificate: 'unknown'
      };
  }
}