#!/usr/bin/env node

// Comprehensive SPIRAL System Testing Suite
// Tests all major features and API endpoints for 100% functionality

const fs = require('fs');
const path = require('path');

class SPIRALSystemTester {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async test(name, testFn) {
    this.results.total++;
    console.log(`Testing: ${name}...`);
    
    try {
      await testFn();
      this.results.passed++;
      this.results.details.push({ name, status: 'PASS', error: null });
      console.log(`✅ ${name} - PASSED`);
    } catch (error) {
      this.results.failed++;
      this.results.details.push({ name, status: 'FAIL', error: error.message });
      console.log(`❌ ${name} - FAILED: ${error.message}`);
    }
  }

  async apiTest(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async runAllTests() {
    console.log('🚀 Starting SPIRAL Comprehensive System Test\n');

    // Core API Tests
    await this.test('Core Stores API', async () => {
      const stores = await this.apiTest('/api/stores');
      if (!Array.isArray(stores) || stores.length === 0) {
        throw new Error('No stores data returned');
      }
    });

    await this.test('Products API', async () => {
      const products = await this.apiTest('/api/products');
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error('No products data returned');
      }
    });

    await this.test('Categories API', async () => {
      const categories = await this.apiTest('/api/categories');
      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error('No categories data returned');
      }
    });

    // AI Features Tests
    await this.test('AI Retailer Review API', async () => {
      const testApplication = {
        name: 'Test Store',
        address: '123 Main St, City, State',
        category: 'Electronics',
        hours: 'Mon-Fri 9AM-6PM',
        storePhotoURL: 'https://example.com/photo.jpg',
        licenseDocURL: 'https://example.com/license.pdf'
      };
      
      const result = await this.apiTest('/api/ai-retailer-onboarding/review-application', 'POST', testApplication);
      if (!result.decision || !result.decision.status || !result.decision.feedback) {
        throw new Error('Invalid AI review response format');
      }
    });

    await this.test('AI Application Submission', async () => {
      const testData = {
        businessName: 'Test Business',
        ownerName: 'John Doe',
        email: 'test@example.com',
        phone: '555-1234',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        category: 'Retail',
        description: 'Test store description',
        website: 'https://test.com',
        hours: 'Mon-Fri 9-5'
      };
      
      const result = await this.apiTest('/api/ai-retailer-onboarding/submit-application', 'POST', testData);
      if (!result.applicationId) {
        throw new Error('No application ID returned');
      }
    });

    // Advanced Features Tests
    await this.test('SPIRAL Centers API', async () => {
      const centers = await this.apiTest('/api/spiral-centers/centers');
      if (!Array.isArray(centers)) {
        throw new Error('Invalid centers data format');
      }
    });

    await this.test('Advanced Logistics API', async () => {
      const zones = await this.apiTest('/api/advanced-logistics/zones');
      if (!Array.isArray(zones)) {
        throw new Error('Invalid logistics zones data');
      }
    });

    await this.test('Subscription Services API', async () => {
      const services = await this.apiTest('/api/subscription-services/available');
      if (!Array.isArray(services)) {
        throw new Error('Invalid subscription services data');
      }
    });

    // Enhanced Features Tests
    await this.test('Enhanced Features API', async () => {
      const features = await this.apiTest('/api/enhanced-features/reviews/1');
      if (!features) {
        throw new Error('Enhanced features API not responding');
      }
    });

    await this.test('Smart Search API', async () => {
      const results = await this.apiTest('/api/feature-improvements/smart-search', 'POST', {
        query: 'electronics',
        location: 'Minneapolis'
      });
      if (!results.results || !Array.isArray(results.results)) {
        throw new Error('Invalid smart search results');
      }
    });

    await this.test('Enhanced Wallet API', async () => {
      const wallet = await this.apiTest('/api/feature-improvements/enhanced-wallet/balance/user123');
      if (typeof wallet.spiralBalance !== 'number') {
        throw new Error('Invalid wallet balance format');
      }
    });

    // System Health Tests
    await this.test('GPT Integration Health', async () => {
      const gpt = await this.apiTest('/api/gpt-integration/health');
      if (!gpt.status) {
        throw new Error('GPT integration health check failed');
      }
    });

    await this.test('Security Verification', async () => {
      const security = await this.apiTest('/api/launch-verification/security-status');
      if (!security.csp || !security.jwt || !security.rateLimiting) {
        throw new Error('Security verification incomplete');
      }
    });

    await this.test('Admin Test Routes', async () => {
      const adminTests = await this.apiTest('/api/admin-test/run-comprehensive-test');
      if (!adminTests.results) {
        throw new Error('Admin test suite not responding');
      }
    });

    await this.test('SPIRAL 100% Compatibility', async () => {
      const compatibility = await this.apiTest('/api/spiral-100-compatibility/system-info');
      if (!compatibility.platform) {
        throw new Error('Compatibility test system not responding');
      }
    });

    this.generateReport();
  }

  generateReport() {
    console.log('\n🏁 SPIRAL System Test Complete\n');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%\n`);

    if (this.results.failed > 0) {
      console.log('❌ Failed Tests:');
      this.results.details
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }

    // Save results to file
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / this.results.total) * 100).toFixed(1)
      },
      details: this.results.details
    };

    fs.writeFileSync('spiral-system-test-results.json', JSON.stringify(reportData, null, 2));
    console.log('\n📊 Test results saved to spiral-system-test-results.json');

    if (this.results.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED - SPIRAL System is 100% Functional!');
    } else {
      console.log('\n⚠️  Some tests failed - Review and fix issues above');
    }
  }
}

// Frontend Route Testing
class FrontendTester {
  constructor() {
    this.routes = [];
    this.issues = [];
  }

  checkAppRoutes() {
    console.log('\n🔍 Checking Frontend Routes...');
    
    try {
      const appContent = fs.readFileSync('./client/src/App.tsx', 'utf8');
      
      // Extract all routes
      const routeMatches = appContent.match(/<Route[^>]*path="([^"]*)"[^>]*component=\{([^}]*)\}/g) || [];
      
      routeMatches.forEach(route => {
        const pathMatch = route.match(/path="([^"]*)"/);
        const componentMatch = route.match(/component=\{([^}]*)\}/);
        
        if (pathMatch && componentMatch) {
          const path = pathMatch[1];
          const component = componentMatch[1];
          
          // Check if component is imported
          const importRegex = new RegExp(`import\\s+${component}\\s+from`, 'g');
          if (appContent.match(importRegex)) {
            this.routes.push({ path, component, status: 'VALID' });
            console.log(`✅ Route: ${path} -> ${component}`);
          } else {
            this.routes.push({ path, component, status: 'INVALID' });
            this.issues.push(`Missing import for component: ${component} (route: ${path})`);
            console.log(`❌ Route: ${path} -> ${component} (missing import)`);
          }
        }
      });
    } catch (error) {
      this.issues.push(`Failed to read App.tsx: ${error.message}`);
    }
  }

  generateFrontendReport() {
    const validRoutes = this.routes.filter(r => r.status === 'VALID').length;
    const totalRoutes = this.routes.length;
    const successRate = totalRoutes > 0 ? ((validRoutes / totalRoutes) * 100).toFixed(1) : 0;
    
    console.log(`\n📊 Frontend Routes: ${validRoutes}/${totalRoutes} valid (${successRate}%)`);
    
    if (this.issues.length > 0) {
      console.log('\n❌ Frontend Issues:');
      this.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
  }
}

// Run comprehensive testing
async function runComprehensiveTest() {
  const systemTester = new SPIRALSystemTester();
  const frontendTester = new FrontendTester();
  
  // Test backend functionality
  await systemTester.runAllTests();
  
  // Test frontend routes
  frontendTester.checkAppRoutes();
  frontendTester.generateFrontendReport();
  
  console.log('\n🎯 SPIRAL Platform Testing Complete');
}

runComprehensiveTest().catch(console.error);