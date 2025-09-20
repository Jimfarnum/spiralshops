// Domain configuration utility for SPIRAL platform
// Handles dynamic domain resolution for different environments

export interface DomainConfig {
  baseUrl: string;
  apiUrl: string;
  wsUrl: string;
  isDev: boolean;
  isProduction: boolean;
}

export function getDomainConfig(): DomainConfig {
  // Get current domain information
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const port = typeof window !== 'undefined' ? window.location.port : '5000';
  
  // Determine environment
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
  const isReplit = hostname.includes('.replit.') || hostname.includes('.repl.co');
  const isProduction = !isDev && !isReplit;
  
  // Configure base URL based on environment
  let baseUrl: string;
  let apiUrl: string;
  let wsUrl: string;
  
  if (isDev) {
    baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    apiUrl = baseUrl;
    wsUrl = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${port ? `:${port}` : ''}`;
  } else if (isReplit) {
    baseUrl = `${protocol}//${hostname}`;
    apiUrl = baseUrl;
    wsUrl = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}`;
  } else {
    // Production or custom domain
    baseUrl = `${protocol}//${hostname}`;
    apiUrl = baseUrl;
    wsUrl = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}`;
  }
  
  return {
    baseUrl,
    apiUrl,
    wsUrl,
    isDev,
    isProduction
  };
}

// Export current configuration
export const currentDomain = getDomainConfig();

// Helper function for API requests
export function getApiUrl(endpoint: string): string {
  const config = getDomainConfig();
  return `${config.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

// Helper function for WebSocket connections
export function getWebSocketUrl(path: string = '/ws'): string {
  const config = getDomainConfig();
  return `${config.wsUrl}${path}`;
}