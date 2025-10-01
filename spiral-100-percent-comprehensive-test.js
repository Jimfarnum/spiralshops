// SPIRAL 100% Comprehensive Platform Test Suite
// Tests all functionality including new tiered access subscription system

import axios from 'axios';
const BASE_URL = 'http://localhost:5000';

class SpiralComprehensiveTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runTest(name, testFn) {
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS' });
      console.log(`✅ ${name} - PASSED`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', error: error.message });
      console.log(`❌ ${name} - FAILED: ${error.message}`);
    }
  }

  async testCoreAPIs() {
    await this.runTest('Health Check API', async () => {
      const response = await axios.get(`${BASE_URL}/api/check`);
      if (response.status !== 200) throw new Error('Health check failed');
    });

    await this.runTest('Stores API', async () => {
      const response = await axios.get(`${BASE_URL}/api/stores`);
      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error('Stores API returned no data');
      }
    });

    await this.runTest('Products API', async () => {
      const response = await axios.get(`${BASE_URL}/api/products`);
      if (!response.data.products || response.data.products.length === 0) {
        throw new Error('Products API returned no data');
      }
    });

    await this.runTest('Featured Products API', async () => {
      const response = await axios.get(`${BASE_URL}/api/products/featured`);
      if (!response.data.success || !response.data.products) {
        throw new Error('Featured products API failed');
      }
    });
  }

  async testTieredAccessSystem() {
    await this.runTest('Free Plan Status', async () => {
      const response = await axios.get(`${BASE_URL}/api/plan-status/cus_demo_free`);
      if (response.data.plan !== 'Free' || response.data.features.productListings !== 10) {
        throw new Error(`Expected Free plan with 10 listings, got ${response.data.plan} with ${response.data.features.productListings}`);
      }
    });

    await this.runTest('Silver Plan Status', async () => {
      const response = await axios.get(`${BASE_URL}/api/plan-status/cus_demo_silver`);
      if (response.data.plan !== 'Silver' || response.data.features.productListings !== 100) {
        throw new Error(`Expected Silver plan with 100 listings, got ${response.data.plan} with ${response.data.features.productListings}`);
      }
    });

    await this.runTest('Gold Plan Status', async () => {
      const response = await axios.get(`${BASE_URL}/api/plan-status/cus_demo_gold`);
      if (response.data.plan !== 'Gold' || response.data.features.productListings !== 500) {
        throw new Error(`Expected Gold plan with 500 listings, got ${response.data.plan} with ${response.data.features.productListings}`);
      }
      if (!response.data.features.advancedAnalytics || !response.data.features.prioritySupport) {
        throw new Error('Gold plan missing expected premium features');
      }
    });

    await this.runTest('Premium Plan Status', async () => {
      const response = await axios.get(`${BASE_URL}/api/plan-status/cus_demo_premium`);
      if (response.data.plan !== 'Premium' || response.data.features.productListings !== -1) {
        throw new Error(`Expected Premium plan with unlimited listings, got ${response.data.plan} with ${response.data.features.productListings}`);
      }
    });

    await this.runTest('Subscription Creation API', async () => {
      const response = await axios.post(`${BASE_URL}/api/create-subscription`, {
        planTier: 'gold',
        retailerEmail: 'test@spiral.com'
      });
      if (!response.data.success || !response.data.url.includes('retailer-dashboard')) {
        throw new Error('Subscription creation failed or returned wrong redirect URL');
      }
    });
  }

  async testSocialFeatures() {
    await this.runTest('Social Achievements API', async () => {
      const response = await axios.get(`${BASE_URL}/api/social-achievements/user123`);
      if (response.status !== 200) throw new Error('Social achievements API failed');
    });

    await this.runTest('Share Tracking API', async () => {
      const response = await axios.post(`${BASE_URL}/api/social-achievements/track`, {
        userId: 'user123',
        platform: 'facebook',
        shareType: 'product'
      });
      if (response.status !== 200) throw new Error('Share tracking API failed');
    });
  }

  async testRetailerFeatures() {
    await this.runTest('Retailer Inventory API', async () => {
      const response = await axios.get(`${BASE_URL}/api/retailer/inventory/store123`);
      if (response.status !== 200) throw new Error('Retailer inventory API failed');
    });

    await this.runTest('Retailer Analytics API', async () => {
      const response = await axios.get(`${BASE_URL}/api/retailer/analytics/store123`);
      if (response.status !== 200) throw new Error('Retailer analytics API failed');
    });
  }

  async testAdvancedFeatures() {
    await this.runTest('AI Recommendations API', async () => {
      const response = await axios.get(`${BASE_URL}/api/recommend`);
      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error('AI recommendations returned no data');
      }
    });

    await this.runTest('Mall Events API', async () => {
      const response = await axios.get(`${BASE_URL}/api/mall-events`);
      if (response.status !== 200) throw new Error('Mall events API failed');
    });

    await this.runTest('Promotions API', async () => {
      const response = await axios.get(`${BASE_URL}/api/promotions`);
      if (response.status !== 200) throw new Error('Promotions API failed');
    });
  }

  async testInviteSystem() {
    await this.runTest('Create Invite Trip', async () => {
      const response = await axios.post(`${BASE_URL}/api/invite-trips`, {
        inviterName: 'Test User',
        inviterEmail: 'test@example.com',
        invitees: ['friend@example.com'],
        message: 'Test invite'
      });
      if (response.status !== 200) throw new Error('Create invite trip failed');
    });

    await this.runTest('Get Invite Trips', async () => {
      const response = await axios.get(`${BASE_URL}/api/invite-trips/user123`);
      if (response.status !== 200) throw new Error('Get invite trips failed');
    });
  }

  async testStripeConnect() {
    await this.runTest('Stripe Connect Account Creation', async () => {
      const response = await axios.post(`${BASE_URL}/api/stripe-connect/create-account`, {
        retailerId: 'store123',
        email: 'retailer@test.com',
        businessName: 'Test Store'
      });
      if (response.data.mock !== true) {
        throw new Error('Expected mock response when Stripe not configured');
      }
    });

    await this.runTest('Stripe Connect Account Status', async () => {
      const response = await axios.get(`${BASE_URL}/api/stripe-connect/account-status/store123`);
      if (response.status !== 200) throw new Error('Stripe Connect account status failed');
    });
  }

  async runAllTests() {
    console.log('🚀 Starting SPIRAL 100% Comprehensive Platform Test');
    console.log('================================================');

    await this.testCoreAPIs();
    await this.testTieredAccessSystem();
    await this.testSocialFeatures();
    await this.testRetailerFeatures();
    await this.testAdvancedFeatures();  
    await this.testInviteSystem();
    await this.testStripeConnect();

    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.tests.filter(t => t.status === 'FAIL').forEach(test => {
        console.log(`  - ${test.name}: ${test.error}`);
      });
    }

    const isFullyFunctional = this.results.failed === 0;
    console.log(`\n🎯 SPIRAL Platform Status: ${isFullyFunctional ? '100% FUNCTIONAL ✅' : 'NEEDS ATTENTION ⚠️'}`);
    
    return {
      success: isFullyFunctional,
      results: this.results
    };
  }
}

// Run the comprehensive test
async function runComprehensiveTest() {
  try {
    const tester = new SpiralComprehensiveTest();
    await tester.runAllTests();
  } catch (error) {
    console.error('Test suite failed to initialize:', error.message);
  }
}

// Execute if run directly
runComprehensiveTest();

export default SpiralComprehensiveTest;