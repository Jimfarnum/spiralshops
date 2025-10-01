// SPIRAL Environment Configuration
// Centralized environment detection and configuration

interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiUrl: string;
  wsUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isStaging: boolean;
  requiresSSL: boolean;
  features: {
    analytics: boolean;
    debugging: boolean;
    hotReload: boolean;
    errorReporting: boolean;
  };
}

export class EnvironmentManager {
  private config: EnvironmentConfig;
  
  constructor() {
    this.config = this.detectEnvironment();
  }
  
  private detectEnvironment(): EnvironmentConfig {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    const port = typeof window !== 'undefined' ? window.location.port : '5000';
    
    // Development environment
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
      return {
        name: 'development',
        baseUrl,
        apiUrl: baseUrl,
        wsUrl: `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${port ? `:${port}` : ''}`,
        isDevelopment: true,
        isProduction: false,
        isStaging: false,
        requiresSSL: false,
        features: {
          analytics: false,
          debugging: true,
          hotReload: true,
          errorReporting: false
        }
      };
    }
    
    // Replit environment
    if (hostname.includes('.replit.') || hostname.includes('.repl.co')) {
      const baseUrl = `https://${hostname}`;
      return {
        name: 'replit',
        baseUrl,
        apiUrl: baseUrl,
        wsUrl: `wss://${hostname}`,
        isDevelopment: false,
        isProduction: false,
        isStaging: true,
        requiresSSL: true,
        features: {
          analytics: true,
          debugging: true,
          hotReload: true,
          errorReporting: true
        }
      };
    }
    
    // Staging environment
    if (hostname.includes('staging.') || hostname.includes('beta.')) {
      const baseUrl = `https://${hostname}`;
      return {
        name: 'staging',
        baseUrl,
        apiUrl: baseUrl,
        wsUrl: `wss://${hostname}`,
        isDevelopment: false,
        isProduction: false,
        isStaging: true,
        requiresSSL: true,
        features: {
          analytics: true,
          debugging: true,
          hotReload: false,
          errorReporting: true
        }
      };
    }
    
    // Production environment
    if (hostname.includes('spiralmalls.com') || hostname.includes('spiralshops.com')) {
      const baseUrl = `https://${hostname}`;
      return {
        name: 'production',
        baseUrl,
        apiUrl: baseUrl,
        wsUrl: `wss://${hostname}`,
        isDevelopment: false,
        isProduction: true,
        isStaging: false,
        requiresSSL: true,
        features: {
          analytics: true,
          debugging: false,
          hotReload: false,
          errorReporting: true
        }
      };
    }
    
    // Unknown/fallback environment
    const baseUrl = `${protocol}//${hostname}`;
    return {
      name: 'unknown',
      baseUrl,
      apiUrl: baseUrl,
      wsUrl: `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}`,
      isDevelopment: false,
      isProduction: false,
      isStaging: false,
      requiresSSL: protocol === 'https:',
      features: {
        analytics: false,
        debugging: true,
        hotReload: false,
        errorReporting: false
      }
    };
  }
  
  get current(): EnvironmentConfig {
    return this.config;
  }
  
  getApiUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.config.apiUrl}${cleanEndpoint}`;
  }
  
  getAssetUrl(asset: string): string {
    const cleanAsset = asset.startsWith('/') ? asset : `/${asset}`;
    return `${this.config.baseUrl}${cleanAsset}`;
  }
  
  getWebSocketUrl(path: string = '/ws'): string {
    return `${this.config.wsUrl}${path}`;
  }
  
  shouldUseAnalytics(): boolean {
    return this.config.features.analytics;
  }
  
  shouldShowDebugInfo(): boolean {
    return this.config.features.debugging;
  }
  
  isSecureContext(): boolean {
    return this.config.requiresSSL;
  }
}

// Global environment instance
export const Environment = new EnvironmentManager();

// Convenience exports
export const { current: env } = Environment;
export const isDev = env.isDevelopment;
export const isProd = env.isProduction;
export const isStaging = env.isStaging;