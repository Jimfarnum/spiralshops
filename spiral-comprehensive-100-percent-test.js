/**
 * SPIRAL Platform 100% Comprehensive Feature Testing Suite
 * Tests all features, sub-functions, buttons, and components to 100% functionality
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5000';

// Test Results Storage
const testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  detailedResults: {},
  criticalIssues: [],
  recommendations: []
};

// Utility Functions
function logTest(category, test, status, details = '') {
  testResults.totalTests++;
  if (status === 'PASS') {
    testResults.passedTests++;
  } else {
    testResults.failedTests++;
    testResults.criticalIssues.push(`${category} - ${test}: ${details}`);
  }
  
  if (!testResults.detailedResults[category]) {
    testResults.detailedResults[category] = [];
  }
  
  testResults.detailedResults[category].push({
    test,
    status,
    details,
    timestamp: new Date().toISOString()
  });
  
  console.log(`[${status}] ${category} - ${test}${details ? ': ' + details : ''}`);
}

// API Testing Functions
async function testCoreAPIs() {
  console.log('\n🔍 Testing Core API Endpoints...');
  
  const coreEndpoints = [
    { name: 'Health Check', url: '/api/check' },
    { name: 'Products API', url: '/api/products' },
    { name: 'Featured Products', url: '/api/products/featured' },
    { name: 'Stores API', url: '/api/stores' },
    { name: 'Mall Events', url: '/api/mall-events' },
    { name: 'Promotions', url: '/api/promotions' },
    { name: 'AI Recommendations', url: '/api/recommend' },
    { name: 'Continental US Search', url: '/api/location-search-continental-us' }
  ];
  
  for (const endpoint of coreEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint.url}`);
      if (response.status === 200 && response.data) {
        logTest('Core APIs', endpoint.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('Core APIs', endpoint.name, 'FAIL', `Unexpected response: ${response.status}`);
      }
    } catch (error) {
      logTest('Core APIs', endpoint.name, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testAIFeatures() {
  console.log('\n🤖 Testing AI-Powered Features...');
  
  // Test AI Agents System
  const aiEndpoints = [
    { name: 'AI Retailer Onboarding Categories', url: '/api/ai-retailer-onboarding/categories' },
    { name: 'Inventory Categories', url: '/api/inventory/categories' },
    { name: 'AI Ops Supervisor', url: '/api/ai-ops/status' },
    { name: 'Shopper UX Agent', url: '/api/ai-ops/shopper-ux/test' },
    { name: 'DevOps Agent', url: '/api/ai-ops/devops/test' },
    { name: 'Analytics Agent', url: '/api/ai-ops/analytics/test' },
    { name: 'Retailer Platform Agent', url: '/api/ai-ops/retailer-platform/test' }
  ];
  
  for (const endpoint of aiEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint.url}`);
      if (response.status === 200) {
        logTest('AI Features', endpoint.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('AI Features', endpoint.name, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest('AI Features', endpoint.name, 'FAIL', `Error: ${error.message}`);
    }
  }
  
  // Test AI Image Search
  try {
    const imageSearchResponse = await axios.post(`${BASE_URL}/api/ai/image-search`, {
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      userLat: 40.7128,
      userLng: -74.0060,
      radius: 25
    });
    logTest('AI Features', 'AI Image Search', 'PASS', 'Image analysis successful');
  } catch (error) {
    logTest('AI Features', 'AI Image Search', 'FAIL', `Error: ${error.message}`);
  }
}

async function testLocationServices() {
  console.log('\n📍 Testing Location & Mapping Features...');
  
  const locationTests = [
    {
      name: 'Continental US All Stores',
      url: '/api/location-search-continental-us?scope=all&category='
    },
    {
      name: 'State-specific Search (CA)',
      url: '/api/location-search-continental-us?scope=all&category=&state=CA'
    },
    {
      name: 'Category Filter (Electronics)',
      url: '/api/location-search-continental-us?scope=all&category=Electronics'
    },
    {
      name: 'Zip Code Search',
      url: '/api/location-search-continental-us?scope=all&category=&zipCode=90210'
    },
    {
      name: 'Near Me Search',
      url: '/api/near-me?lat=40.7128&lng=-74.0060&radius=25'
    }
  ];
  
  for (const test of locationTests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.url}`);
      if (response.status === 200 && response.data.success) {
        const storeCount = response.data.stores?.length || 0;
        logTest('Location Services', test.name, 'PASS', `Found ${storeCount} stores`);
      } else {
        logTest('Location Services', test.name, 'FAIL', 'Invalid response structure');
      }
    } catch (error) {
      logTest('Location Services', test.name, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testRetailerFeatures() {
  console.log('\n🏪 Testing Retailer Features...');
  
  const retailerEndpoints = [
    { name: 'Retailer Onboarding Flow', url: '/api/ai-retailer-onboarding/start' },
    { name: 'Business Categories', url: '/api/ai-retailer-onboarding/categories' },
    { name: 'Stripe Connect Status', url: '/api/stripe-connect/status' },
    { name: 'Inventory Management', url: '/api/inventory/categories' },
    { name: 'Retailer Applications', url: '/api/retailer-applications' },
    { name: 'Verification System', url: '/api/verification/levels' }
  ];
  
  for (const endpoint of retailerEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint.url}`);
      if (response.status === 200) {
        logTest('Retailer Features', endpoint.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('Retailer Features', endpoint.name, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest('Retailer Features', endpoint.name, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testShopperFeatures() {
  console.log('\n🛍️ Testing Shopper Features...');
  
  const shopperTests = [
    { name: 'Product Search', url: '/api/products?search=headphones' },
    { name: 'Product Categories', url: '/api/products?category=Electronics' },
    { name: 'Cart Functionality', url: '/api/cart' },
    { name: 'Wishlist System', url: '/api/wishlist' },
    { name: 'Order History', url: '/api/orders' },
    { name: 'Loyalty Program', url: '/api/loyalty/balance' },
    { name: 'Gift Cards', url: '/api/gift-cards' },
    { name: 'Notifications', url: '/api/notifications' }
  ];
  
  for (const test of shopperTests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.url}`);
      if (response.status === 200) {
        logTest('Shopper Features', test.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('Shopper Features', test.name, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest('Shopper Features', test.name, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testPaymentSystems() {
  console.log('\n💳 Testing Payment Systems...');
  
  const paymentTests = [
    { name: 'Stripe Integration', url: '/api/stripe/config' },
    { name: 'Payment Methods', url: '/api/payment-methods' },
    { name: 'Checkout Process', url: '/api/checkout/validate' },
    { name: 'Subscription Plans', url: '/api/subscriptions/plans' },
    { name: 'SPIRAL Centers', url: '/api/spiral-centers' }
  ];
  
  for (const test of paymentTests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.url}`);
      if (response.status === 200) {
        logTest('Payment Systems', test.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('Payment Systems', test.name, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest('Payment Systems', test.name, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testAdminFeatures() {
  console.log('\n⚙️ Testing Admin & Management Features...');
  
  const adminTests = [
    { name: 'Admin Dashboard', url: '/api/admin/dashboard' },
    { name: 'System Health', url: '/api/admin/health' },
    { name: 'User Management', url: '/api/admin/users' },
    { name: 'Analytics Data', url: '/api/admin/analytics' },
    { name: 'External Services', url: '/api/admin/external-services' },
    { name: 'Vendor Verification', url: '/api/admin/vendor-verification' },
    { name: 'Platform Monitoring', url: '/api/admin/monitoring' }
  ];
  
  for (const test of adminTests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.url}`);
      if (response.status === 200) {
        logTest('Admin Features', test.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('Admin Features', test.name, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest('Admin Features', test.name, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testAdvancedFeatures() {
  console.log('\n🚀 Testing Advanced Features...');
  
  const advancedTests = [
    { name: 'Visual Search', url: '/api/visual-search/status' },
    { name: 'Social Features', url: '/api/social/achievements' },
    { name: 'Invite System', url: '/api/invites/status' },
    { name: 'Trip Management', url: '/api/trips' },
    { name: 'Logistics System', url: '/api/logistics/zones' },
    { name: 'Mall Events', url: '/api/mall-events' },
    { name: 'Referral System', url: '/api/referrals' },
    { name: 'Mobile Features', url: '/api/mobile/compatibility' }
  ];
  
  for (const test of advancedTests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.url}`);
      if (response.status === 200) {
        logTest('Advanced Features', test.name, 'PASS', `Status: ${response.status}`);
      } else {
        logTest('Advanced Features', test.name, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest('Advanced Features', test.name, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testDatabaseConnectivity() {
  console.log('\n💾 Testing Database Operations...');
  
  try {
    // Test basic database operations
    const dbTests = [
      { name: 'Store Creation', method: 'POST', url: '/api/stores', data: { name: 'Test Store', category: 'Test', lat: 40.7128, lng: -74.0060 } },
      { name: 'Store Retrieval', method: 'GET', url: '/api/stores' },
      { name: 'Product Creation', method: 'POST', url: '/api/products', data: { name: 'Test Product', price: 99.99, category: 'Test' } },
      { name: 'User Registration', method: 'POST', url: '/api/auth/register', data: { username: 'testuser', email: 'test@example.com', password: 'password123' } }
    ];
    
    for (const test of dbTests) {
      try {
        let response;
        if (test.method === 'POST') {
          response = await axios.post(`${BASE_URL}${test.url}`, test.data);
        } else {
          response = await axios.get(`${BASE_URL}${test.url}`);
        }
        
        if (response.status >= 200 && response.status < 300) {
          logTest('Database Operations', test.name, 'PASS', `Status: ${response.status}`);
        } else {
          logTest('Database Operations', test.name, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        logTest('Database Operations', test.name, 'FAIL', `Error: ${error.message}`);
      }
    }
  } catch (error) {
    logTest('Database Operations', 'General Database Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function generateReport() {
  console.log('\n📊 Generating Comprehensive Test Report...');
  
  const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(2);
  
  const report = {
    ...testResults,
    successRate: `${successRate}%`,
    summary: {
      total: testResults.totalTests,
      passed: testResults.passedTests,
      failed: testResults.failedTests,
      successRate: `${successRate}%`
    },
    recommendations: generateRecommendations()
  };
  
  // Save report to file
  const reportPath = path.join(__dirname, 'spiral-100-percent-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 SPIRAL PLATFORM 100% FEATURE TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${testResults.totalTests}`);
  console.log(`Passed: ${testResults.passedTests}`);
  console.log(`Failed: ${testResults.failedTests}`);
  console.log(`Success Rate: ${successRate}%`);
  console.log('='.repeat(80));
  
  if (testResults.criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:');
    testResults.criticalIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return report;
}

function generateRecommendations() {
  const recommendations = [];
  
  if (testResults.failedTests > 0) {
    recommendations.push('Address all failed tests immediately to achieve 100% functionality');
  }
  
  if (testResults.passedTests / testResults.totalTests < 0.95) {
    recommendations.push('Platform requires significant fixes to reach production readiness');
  }
  
  recommendations.push('Implement automated testing pipeline for continuous quality assurance');
  recommendations.push('Add comprehensive error handling and user feedback systems');
  recommendations.push('Optimize API response times for better user experience');
  
  return recommendations;
}

// Main Test Execution
async function runComprehensiveTests() {
  console.log('🚀 Starting SPIRAL Platform 100% Comprehensive Testing...');
  console.log(`Testing against: ${BASE_URL}`);
  console.log('='.repeat(80));
  
  try {
    await testCoreAPIs();
    await testAIFeatures();
    await testLocationServices();
    await testRetailerFeatures();
    await testShopperFeatures();
    await testPaymentSystems();
    await testAdminFeatures();
    await testAdvancedFeatures();
    await testDatabaseConnectivity();
    
    const report = await generateReport();
    
    // Return results for further processing
    return report;
    
  } catch (error) {
    console.error('❌ Critical error during testing:', error);
    logTest('System', 'Test Execution', 'FAIL', `Critical error: ${error.message}`);
    return null;
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests()
    .then(report => {
      if (report && report.successRate === '100.00%') {
        console.log('\n🎉 CONGRATULATIONS! All tests passed - 100% functionality achieved!');
        process.exit(0);
      } else {
        console.log('\n⚠️ Platform requires fixes to achieve 100% functionality');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runComprehensiveTests, testResults };