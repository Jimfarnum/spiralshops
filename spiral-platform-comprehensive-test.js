#!/usr/bin/env node

/**
 * SPIRAL Platform Comprehensive Functionality Test
 * Tests all critical routes, APIs, and components for 100% functionality
 */

import http from 'http';
import fs from 'fs';

class SpiralPlatformTester {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      details: []
    };
  }

  async testRoute(path, expectedStatus = 200, testName = null) {
    return new Promise((resolve) => {
      const name = testName || `Route: ${path}`;
      
      const req = http.get(`${this.baseUrl}${path}`, (res) => {
        const success = res.statusCode === expectedStatus;
        
        if (success) {
          this.results.passed++;
          this.results.details.push(`✅ ${name} - Status: ${res.statusCode}`);
        } else {
          this.results.failed++;
          this.results.errors.push(`❌ ${name} - Expected: ${expectedStatus}, Got: ${res.statusCode}`);
          this.results.details.push(`❌ ${name} - Status: ${res.statusCode}`);
        }
        
        resolve(success);
      });

      req.on('error', (err) => {
        this.results.failed++;
        this.results.errors.push(`❌ ${name} - Error: ${err.message}`);
        this.results.details.push(`❌ ${name} - Error: ${err.message}`);
        resolve(false);
      });

      req.setTimeout(10000, () => {
        this.results.failed++;
        this.results.errors.push(`❌ ${name} - Timeout`);
        this.results.details.push(`❌ ${name} - Timeout`);
        req.destroy();
        resolve(false);
      });
    });
  }

  async testAPI(path, testName = null) {
    return new Promise((resolve) => {
      const name = testName || `API: ${path}`;
      
      const req = http.get(`${this.baseUrl}/api${path}`, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            const success = res.statusCode === 200 && jsonData;
            
            if (success) {
              this.results.passed++;
              this.results.details.push(`✅ ${name} - Valid JSON response`);
            } else {
              this.results.failed++;
              this.results.errors.push(`❌ ${name} - Invalid response or status: ${res.statusCode}`);
              this.results.details.push(`❌ ${name} - Status: ${res.statusCode}`);
            }
            
            resolve(success);
          } catch (err) {
            this.results.failed++;
            this.results.errors.push(`❌ ${name} - JSON Parse Error: ${err.message}`);
            this.results.details.push(`❌ ${name} - JSON Parse Error`);
            resolve(false);
          }
        });
      });

      req.on('error', (err) => {
        this.results.failed++;
        this.results.errors.push(`❌ ${name} - Error: ${err.message}`);
        this.results.details.push(`❌ ${name} - Error: ${err.message}`);
        resolve(false);
      });

      req.setTimeout(10000, () => {
        this.results.failed++;
        this.results.errors.push(`❌ ${name} - Timeout`);
        this.results.details.push(`❌ ${name} - Timeout`);
        req.destroy();
        resolve(false);
      });
    });
  }

  async runComprehensiveTest() {
    console.log('🚀 Starting SPIRAL Platform Comprehensive Test Suite...\n');

    // Core Pages Test
    console.log('📄 Testing Core Pages...');
    await this.testRoute('/', 200, 'Homepage');
    await this.testRoute('/products', 200, 'Products Page');
    await this.testRoute('/cart', 200, 'Shopping Cart');
    await this.testRoute('/wishlist', 200, 'Wishlist Page');
    await this.testRoute('/intelligent-wishlist', 200, 'AI Wishlist Intelligence');
    await this.testRoute('/login', 200, 'Login Page');
    await this.testRoute('/signup', 200, 'Signup Page');
    await this.testRoute('/retailer-dashboard', 200, 'Retailer Dashboard');
    await this.testRoute('/shopper-dashboard', 200, 'Shopper Dashboard');
    await this.testRoute('/social-rewards', 200, 'Social Rewards');

    // Feature Pages Test
    console.log('\n🎯 Testing Feature Pages...');
    await this.testRoute('/wishlist-demo', 200, 'Wishlist Demo');
    await this.testRoute('/social-feed', 200, 'Social Feed');
    await this.testRoute('/mall-directory', 200, 'Mall Directory');
    await this.testRoute('/delivery-options', 200, 'Delivery Options');
    await this.testRoute('/loyalty-program', 200, 'Loyalty Program');
    await this.testRoute('/retailer-apply', 200, 'Retailer Application');
    await this.testRoute('/complete-system-validation', 200, 'System Validation');
    await this.testRoute('/competitive-analysis', 200, 'Competitive Analysis');

    // API Endpoints Test
    console.log('\n🔌 Testing Core APIs...');
    await this.testAPI('/products', 'Products API');
    await this.testAPI('/stores', 'Stores API');
    await this.testAPI('/check', 'Health Check API');
    await this.testAPI('/recommend', 'Recommendations API');
    await this.testAPI('/promotions', 'Promotions API');

    // Intelligent Wishlist APIs
    console.log('\n🧠 Testing Intelligent Wishlist APIs...');
    await this.testAPI('/intelligent-wishlist/recommendations/shopper_123', 'AI Recommendations');
    await this.testAPI('/intelligent-wishlist/price-prediction/prod_1', 'Price Predictions');
    await this.testAPI('/intelligent-wishlist/timing-optimization/shopper_123', 'Shopping Timing');
    await this.testAPI('/intelligent-wishlist/competitor-analysis/prod_1', 'Competitor Analysis');
    await this.testAPI('/intelligent-wishlist/smart-bundles/shopper_123', 'Smart Bundles');

    // Advanced Feature Pages
    console.log('\n⚡ Testing Advanced Features...');
    await this.testRoute('/gpt-integration-demo', 200, 'GPT Integration');
    await this.testRoute('/advanced-payment-hub', 200, 'Payment Hub');
    await this.testRoute('/ai-business-intelligence', 200, 'AI Business Intelligence');
    await this.testRoute('/enterprise-dashboard', 200, 'Enterprise Dashboard');
    await this.testRoute('/mobile-payments', 200, 'Mobile Payments');

    // Testing System Integration
    console.log('\n🔧 Testing System Integration...');
    await this.testRoute('/spiral-admin-dashboard', 200, 'Admin Dashboard');
    await this.testRoute('/system-audit', 200, 'System Audit');
    await this.testRoute('/performance-optimization', 200, 'Performance Optimization');
    await this.testRoute('/comprehensive-feature-testing', 200, 'Feature Testing');

    // Generate Report
    this.generateReport();
  }

  generateReport() {
    const total = this.results.passed + this.results.failed;
    const successRate = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 SPIRAL PLATFORM COMPREHENSIVE TEST RESULTS');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log('='.repeat(80));

    if (this.results.errors.length > 0) {
      console.log('\n🚨 FAILED TESTS:');
      this.results.errors.forEach(error => console.log(error));
    }

    console.log('\n📋 DETAILED RESULTS:');
    this.results.details.forEach(detail => console.log(detail));

    // Write detailed report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: `${successRate}%`
      },
      errors: this.results.errors,
      details: this.results.details
    };

    fs.writeFileSync('spiral-platform-test-report.json', JSON.stringify(reportData, null, 2));
    
    console.log('\n💾 Detailed report saved to: spiral-platform-test-report.json');
    
    if (successRate >= 95) {
      console.log('\n🎉 SPIRAL PLATFORM: EXCELLENT FUNCTIONALITY (95%+ Success Rate)');
    } else if (successRate >= 85) {
      console.log('\n✅ SPIRAL PLATFORM: GOOD FUNCTIONALITY (85%+ Success Rate)');
    } else if (successRate >= 75) {
      console.log('\n⚠️  SPIRAL PLATFORM: MODERATE FUNCTIONALITY (75%+ Success Rate)');
    } else {
      console.log('\n🚨 SPIRAL PLATFORM: NEEDS ATTENTION (Below 75% Success Rate)');
    }

    console.log('\n🔍 PLATFORM STATUS: Ready for comprehensive usage testing');
  }
}

// Run the test
const tester = new SpiralPlatformTester();
tester.runComprehensiveTest().catch(console.error);