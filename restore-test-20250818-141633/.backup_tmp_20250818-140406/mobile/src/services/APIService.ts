import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = __DEV__ 
  ? 'http://localhost:5000' 
  : 'https://your-spiral-domain.replit.app';

class APIServiceClass {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = BASE_URL;
    this.loadAuthToken();
  }

  private async loadAuthToken() {
    try {
      this.authToken = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to load auth token:', error);
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: { username: string; password: string }) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.authToken = response.token;
      await AsyncStorage.setItem('auth_token', response.token);
    }

    return response;
  }

  async logout() {
    this.authToken = null;
    await AsyncStorage.removeItem('auth_token');
  }

  // System Health
  async getSystemHealth() {
    return await this.request('/api/check');
  }

  // Stores
  async getStores() {
    return await this.request('/api/stores');
  }

  // Funnel Analyses
  async getFunnelAnalyses() {
    return await this.request('/admin/techwatch/funnels/latest');
  }

  async runFunnelAnalysis() {
    return await this.request('/admin/techwatch/funnels/run-now', {
      method: 'POST',
    });
  }

  // Products
  async getProducts() {
    return await this.request('/api/products');
  }

  async getFeaturedProducts() {
    return await this.request('/api/products/featured');
  }

  // Mall Events
  async getMallEvents() {
    return await this.request('/api/mall-events');
  }

  // Promotions
  async getPromotions() {
    return await this.request('/api/promotions');
  }

  // AI Recommendations
  async getRecommendations() {
    return await this.request('/api/recommend');
  }

  // Location Search
  async searchLocations(params: {
    zip?: string;
    state?: string;
    scope?: string;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return await this.request(`/api/location-search-continental-us?${queryParams.toString()}`);
  }

  // AI Agents
  async getAgentStatus() {
    return await this.request('/api/ai-ops/status');
  }

  // Analytics
  async getAnalytics(timeframe: string = '7d') {
    return await this.request(`/api/analytics?timeframe=${timeframe}`);
  }

  // Notifications
  async getNotifications() {
    return await this.request('/api/notifications');
  }

  async markNotificationRead(notificationId: string) {
    return await this.request(`/api/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  // Settings
  async getSettings() {
    return await this.request('/api/settings');
  }

  async updateSettings(settings: Record<string, any>) {
    return await this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Real-time monitoring endpoints
  async getSystemMetrics() {
    return await this.request('/api/metrics');
  }

  async getPerformanceData() {
    return await this.request('/api/performance');
  }

  // Competitor analysis
  async getCompetitorInsights() {
    return await this.request('/api/competitor-insights');
  }

  // SPIRAL-specific endpoints
  async getSpiralCenters() {
    return await this.request('/api/spiral-centers');
  }

  async getLoyaltyBalance(userId: string) {
    return await this.request(`/api/loyalty/balance/${userId}`);
  }

  async getShippingOptions(zipCode: string) {
    return await this.request(`/api/shipping/options?zip=${zipCode}`);
  }
}

export const APIService = new APIServiceClass();