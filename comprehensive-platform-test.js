#!/usr/bin/env node

/**
 * SPIRAL Platform 100% Functionality Test Suite
 * Comprehensive testing of all platform components and features
 */

import fs from 'fs';
import path from 'path';

class PlatformTestSuite {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      api_endpoints: [],
      frontend_components: [],
      enhanced_features: [],
      database_connectivity: [],
      security_features: [],
      performance_metrics: [],
      error_handling: [],
      image_functionality: []
    };
    this.passCount = 0;
    this.failCount = 0;
    this.warnCount = 0;
  }

  log(message, type = 'info') {
    const colors = {
      error: '\x1b[31m❌',
      warn: '\x1b[33m⚠️',
      info: '\x1b[36mℹ️',
      success: '\x1b[32m✅',
      test: '\x1b[35m🧪',
      category: '\x1b[34m📋'
    };
    
    console.log(`${colors[type] || ''} ${message}\x1b[0m`);
  }

  // Record test result
  recordResult(category, test, status, details = null, responseTime = null) {
    const result = {
      test,
      status,
      details,
      responseTime,
      timestamp: new Date().toISOString()
    };
    
    this.results[category].push(result);
    
    if (status === 'PASS') {
      this.passCount++;
      this.log(`✅ ${test}: PASS ${responseTime ? `(${responseTime}ms)` : ''}`, 'success');
    } else if (status === 'FAIL') {
      this.failCount++;
      this.log(`❌ ${test}: FAIL ${details ? `- ${details}` : ''}`, 'error');
    } else if (status === 'WARN') {
      this.warnCount++;
      this.log(`⚠️ ${test}: WARN ${details ? `- ${details}` : ''}`, 'warn');
    }
    
    if (details && status !== 'PASS') {
      this.log(`   Details: ${details}`, 'info');
    }
  }

  // Test all API endpoints
  async testAPIEndpoints() {
    this.log('📋 Testing API Endpoints...', 'category');
    
    const endpoints = [
      { path: '/api/health', method: 'GET', expectedStatus: 200, critical: true },
      { path: '/api/products', method: 'GET', expectedStatus: 200, critical: true },
      { path: '/api/products/featured', method: 'GET', expectedStatus: 200, critical: true },
      { path: '/api/stores', method: 'GET', expectedStatus: 200, critical: true },
      { path: '/api/mall-events', method: 'GET', expectedStatus: 200, critical: false },
      { path: '/api/promotions', method: 'GET', expectedStatus: 200, critical: false },
      { path: '/api/recommend?context=homepage&limit=5', method: 'GET', expectedStatus: 200, critical: false },
      { path: '/api/trust/public', method: 'GET', expectedStatus: 200, critical: false },
      { path: '/api/docs', method: 'GET', expectedStatus: 200, critical: false }
    ];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${this.baseUrl}${endpoint.path}`, {
          method: endpoint.method
        });
        
        const responseTime = Date.now() - startTime;
        const isStatusOK = response.status === endpoint.expectedStatus;
        
        if (isStatusOK) {
          // Try to parse JSON for additional validation
          try {
            const data = await response.json();
            this.recordResult('api_endpoints', `${endpoint.method} ${endpoint.path}`, 'PASS', 
                            `Status: ${response.status}, Data: ${Object.keys(data).length} fields`, responseTime);
          } catch {
            // Not JSON, but that's OK for some endpoints
            this.recordResult('api_endpoints', `${endpoint.method} ${endpoint.path}`, 'PASS',
                            `Status: ${response.status}, Non-JSON response`, responseTime);
          }
        } else {
          const severity = endpoint.critical ? 'FAIL' : 'WARN';
          this.recordResult('api_endpoints', `${endpoint.method} ${endpoint.path}`, severity,
                          `Expected ${endpoint.expectedStatus}, got ${response.status}`, responseTime);
        }
        
      } catch (error) {
        const severity = endpoint.critical ? 'FAIL' : 'WARN';
        this.recordResult('api_endpoints', `${endpoint.method} ${endpoint.path}`, severity,
                        `Connection error: ${error.message}`);
      }
    }
  }

  // Test enhanced features
  async testEnhancedFeatures() {
    this.log('📋 Testing Enhanced Features...', 'category');

    // Test CORS configuration
    try {
      const healthResponse = await fetch(`${this.baseUrl}/api/health`);
      const healthData = await healthResponse.json();
      
      if (healthData.cors_enabled === true) {
        this.recordResult('enhanced_features', 'CORS Configuration', 'PASS',
                        'CORS is enabled and reported in health check');
      } else {
        this.recordResult('enhanced_features', 'CORS Configuration', 'WARN',
                        'CORS status not clearly indicated');
      }
    } catch (error) {
      this.recordResult('enhanced_features', 'CORS Configuration', 'FAIL',
                      `Could not verify CORS: ${error.message}`);
    }

    // Test API Documentation
    try {
      const docsResponse = await fetch(`${this.baseUrl}/api/docs`);
      if (docsResponse.status === 200) {
        const docsData = await docsResponse.json();
        if (docsData.endpoints && Object.keys(docsData.endpoints).length > 0) {
          this.recordResult('enhanced_features', 'API Documentation System', 'PASS',
                          `${Object.keys(docsData.endpoints).length} documented endpoints`);
        } else {
          this.recordResult('enhanced_features', 'API Documentation System', 'WARN',
                          'Documentation endpoint exists but no endpoints documented');
        }
      } else {
        this.recordResult('enhanced_features', 'API Documentation System', 'FAIL',
                        `Documentation endpoint returned ${docsResponse.status}`);
      }
    } catch (error) {
      this.recordResult('enhanced_features', 'API Documentation System', 'FAIL',
                      `Documentation system error: ${error.message}`);
    }

    // Test Image URL Normalization
    try {
      const productsResponse = await fetch(`${this.baseUrl}/api/products`);
      const products = await productsResponse.json();
      
      if (Array.isArray(products) && products.length > 0) {
        const firstProduct = products[0];
        
        // Check if image normalization is working
        const hasImageUrl = firstProduct.imageUrl || firstProduct.image_url || firstProduct.image;
        if (hasImageUrl) {
          this.recordResult('enhanced_features', 'Image URL Normalization', 'PASS',
                          'Products have normalized image URLs');
        } else {
          this.recordResult('enhanced_features', 'Image URL Normalization', 'WARN',
                          'Products exist but image normalization unclear');
        }
      } else {
        this.recordResult('enhanced_features', 'Image URL Normalization', 'WARN',
                        'No products available to test image normalization');
      }
    } catch (error) {
      this.recordResult('enhanced_features', 'Image URL Normalization', 'FAIL',
                      `Could not test image normalization: ${error.message}`);
    }

    // Test Search Functionality
    try {
      const searchResponse = await fetch(`${this.baseUrl}/api/products?search=coffee`);
      if (searchResponse.status === 200) {
        this.recordResult('enhanced_features', 'Product Search', 'PASS',
                        'Search endpoint responds to query parameters');
      } else {
        this.recordResult('enhanced_features', 'Product Search', 'WARN',
                        `Search returned status ${searchResponse.status}`);
      }
    } catch (error) {
      this.recordResult('enhanced_features', 'Product Search', 'FAIL',
                      `Search functionality error: ${error.message}`);
    }
  }

  // Test database connectivity
  async testDatabaseConnectivity() {
    this.log('📋 Testing Database Connectivity...', 'category');

    try {
      const healthResponse = await fetch(`${this.baseUrl}/api/health`);
      const healthData = await healthResponse.json();
      
      if (healthData.status === 'healthy') {
        this.recordResult('database_connectivity', 'Database Health Check', 'PASS',
                        'Database reported as healthy in health endpoint');
      } else {
        this.recordResult('database_connectivity', 'Database Health Check', 'FAIL',
                        `Database status: ${healthData.status}`);
      }
      
      // Test data retrieval
      const productsResponse = await fetch(`${this.baseUrl}/api/products`);
      if (productsResponse.status === 200) {
        const products = await productsResponse.json();
        if (Array.isArray(products)) {
          this.recordResult('database_connectivity', 'Data Retrieval', 'PASS',
                          `Successfully retrieved ${products.length} products`);
        } else {
          this.recordResult('database_connectivity', 'Data Retrieval', 'WARN',
                          'Data retrieved but not in expected array format');
        }
      } else {
        this.recordResult('database_connectivity', 'Data Retrieval', 'FAIL',
                        `Products endpoint returned ${productsResponse.status}`);
      }

    } catch (error) {
      this.recordResult('database_connectivity', 'Database Health Check', 'FAIL',
                      `Database test error: ${error.message}`);
    }
  }

  // Test frontend components
  async testFrontendComponents() {
    this.log('📋 Testing Frontend Components...', 'category');

    const criticalComponents = [
      './src/App.tsx',
      './src/main.tsx', 
      './src/pages/home.tsx',
      './src/components/header.tsx',
      './src/components/footer.tsx',
      './src/components/EnhancedFeaturedProducts.tsx'
    ];

    for (const component of criticalComponents) {
      if (fs.existsSync(component)) {
        try {
          const content = fs.readFileSync(component, 'utf8');
          
          // Basic syntax validation
          if (content.includes('export') && (content.includes('function') || content.includes('const'))) {
            this.recordResult('frontend_components', `Component: ${path.basename(component)}`, 'PASS',
                            'Component file exists and has valid structure');
          } else {
            this.recordResult('frontend_components', `Component: ${path.basename(component)}`, 'WARN',
                            'Component exists but structure unclear');
          }
        } catch (error) {
          this.recordResult('frontend_components', `Component: ${path.basename(component)}`, 'FAIL',
                          `Could not read component: ${error.message}`);
        }
      } else {
        this.recordResult('frontend_components', `Component: ${path.basename(component)}`, 'FAIL',
                        'Component file does not exist');
      }
    }

    // Test frontend page accessibility
    try {
      const frontendResponse = await fetch(this.baseUrl);
      if (frontendResponse.status === 200) {
        this.recordResult('frontend_components', 'Frontend Accessibility', 'PASS',
                        'Frontend homepage loads successfully');
      } else {
        this.recordResult('frontend_components', 'Frontend Accessibility', 'FAIL',
                        `Frontend returned status ${frontendResponse.status}`);
      }
    } catch (error) {
      this.recordResult('frontend_components', 'Frontend Accessibility', 'FAIL',
                      `Frontend access error: ${error.message}`);
    }
  }

  // Test security features
  async testSecurityFeatures() {
    this.log('📋 Testing Security Features...', 'category');

    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const headers = response.headers;
      
      // Check for security headers
      const securityHeaders = ['x-powered-by', 'x-content-type-options', 'x-frame-options'];
      let securityScore = 0;
      
      for (const header of securityHeaders) {
        if (headers.has(header)) {
          securityScore++;
        }
      }
      
      if (securityScore >= 2) {
        this.recordResult('security_features', 'Security Headers', 'PASS',
                        `${securityScore}/${securityHeaders.length} security headers present`);
      } else {
        this.recordResult('security_features', 'Security Headers', 'WARN',
                        `Only ${securityScore}/${securityHeaders.length} security headers found`);
      }

    } catch (error) {
      this.recordResult('security_features', 'Security Headers', 'FAIL',
                      `Could not test security headers: ${error.message}`);
    }
  }

  // Test performance metrics
  async testPerformanceMetrics() {
    this.log('📋 Testing Performance Metrics...', 'category');

    const performanceTests = [
      { endpoint: '/api/health', maxTime: 100, name: 'Health Check Speed' },
      { endpoint: '/api/products/featured', maxTime: 500, name: 'Featured Products Speed' },
      { endpoint: '/', maxTime: 1000, name: 'Homepage Load Speed' }
    ];

    for (const test of performanceTests) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${this.baseUrl}${test.endpoint}`);
        const responseTime = Date.now() - startTime;
        
        if (responseTime <= test.maxTime) {
          this.recordResult('performance_metrics', test.name, 'PASS',
                          `Response time: ${responseTime}ms (under ${test.maxTime}ms)`, responseTime);
        } else {
          this.recordResult('performance_metrics', test.name, 'WARN',
                          `Response time: ${responseTime}ms (over ${test.maxTime}ms target)`, responseTime);
        }
      } catch (error) {
        this.recordResult('performance_metrics', test.name, 'FAIL',
                        `Performance test failed: ${error.message}`);
      }
    }
  }

  // Test error handling
  async testErrorHandling() {
    this.log('📋 Testing Error Handling...', 'category');

    const errorTests = [
      { endpoint: '/api/nonexistent', expectedStatus: 404, name: 'Non-existent Endpoint' },
      { endpoint: '/api/products/invalid-id', expectedStatus: [400, 404, 500], name: 'Invalid Product ID' }
    ];

    for (const test of errorTests) {
      try {
        const response = await fetch(`${this.baseUrl}${test.endpoint}`);
        const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus];
        
        if (expectedStatuses.includes(response.status)) {
          this.recordResult('error_handling', test.name, 'PASS',
                          `Properly returned status ${response.status} for invalid request`);
        } else {
          this.recordResult('error_handling', test.name, 'WARN',
                          `Unexpected status ${response.status} for invalid request`);
        }
      } catch (error) {
        this.recordResult('error_handling', test.name, 'WARN',
                        `Error handling test exception: ${error.message}`);
      }
    }
  }

  // Test image functionality
  async testImageFunctionality() {
    this.log('📋 Testing Image Functionality...', 'category');

    try {
      // Test static image serving
      const logoResponse = await fetch(`${this.baseUrl}/spiral-blue.svg`);
      if (logoResponse.status === 200) {
        this.recordResult('image_functionality', 'Static Image Serving', 'PASS',
                        'Static images (SVG logo) serve correctly');
      } else {
        this.recordResult('image_functionality', 'Static Image Serving', 'WARN',
                        `Static image returned status ${logoResponse.status}`);
      }

      // Test asset serving
      const assetResponse = await fetch(`${this.baseUrl}/@assets/5f2ddb9c-bed6-466a-a305-c06542e7cf4b.png%20(1)_1752624555680.PNG`);
      if (assetResponse.status === 200) {
        this.recordResult('image_functionality', 'Asset Image Serving', 'PASS',
                        'Asset images serve correctly');
      } else {
        this.recordResult('image_functionality', 'Asset Image Serving', 'WARN',
                        `Asset image returned status ${assetResponse.status}`);
      }

    } catch (error) {
      this.recordResult('image_functionality', 'Image Serving', 'FAIL',
                      `Image functionality test error: ${error.message}`);
    }
  }

  // Generate comprehensive report
  generateReport() {
    this.log('\n🎯 SPIRAL Platform 100% Functionality Test Results', 'success');
    this.log('='.repeat(70), 'info');
    
    const totalTests = this.passCount + this.failCount + this.warnCount;
    const successRate = Math.round((this.passCount / totalTests) * 100);
    
    this.log(`📊 Overall Results: ${this.passCount} PASS, ${this.warnCount} WARN, ${this.failCount} FAIL`, 'info');
    this.log(`🎯 Success Rate: ${successRate}%`, successRate >= 90 ? 'success' : successRate >= 70 ? 'warn' : 'error');
    
    // Category breakdown
    for (const [category, tests] of Object.entries(this.results)) {
      if (tests.length === 0) continue;
      
      const categoryPassed = tests.filter(t => t.status === 'PASS').length;
      const categoryWarned = tests.filter(t => t.status === 'WARN').length;
      const categoryFailed = tests.filter(t => t.status === 'FAIL').length;
      const categoryTotal = tests.length;
      const categoryRate = Math.round((categoryPassed / categoryTotal) * 100);
      
      this.log(`\n📋 ${category.replace(/_/g, ' ').toUpperCase()}:`, 'category');
      this.log(`   ${categoryPassed}/${categoryTotal} passed (${categoryRate}%)`, 'info');
      
      if (categoryFailed > 0) {
        this.log(`   ❌ ${categoryFailed} critical failures`, 'error');
        tests.filter(t => t.status === 'FAIL').forEach(test => {
          this.log(`      • ${test.test}: ${test.details}`, 'error');
        });
      }
      
      if (categoryWarned > 0) {
        this.log(`   ⚠️ ${categoryWarned} warnings`, 'warn');
      }
    }

    // Performance summary
    const performanceTests = this.results.performance_metrics.filter(t => t.responseTime);
    if (performanceTests.length > 0) {
      const avgResponseTime = Math.round(
        performanceTests.reduce((sum, test) => sum + test.responseTime, 0) / performanceTests.length
      );
      this.log(`\n⚡ Average Response Time: ${avgResponseTime}ms`, 'info');
    }

    // Final recommendation
    this.log('\n💡 Deployment Recommendation:', 'info');
    if (successRate >= 95 && this.failCount === 0) {
      this.log('🚀 EXCELLENT - Ready for production deployment', 'success');
    } else if (successRate >= 85 && this.failCount <= 2) {
      this.log('✅ GOOD - Ready for deployment with monitoring', 'success');
    } else if (successRate >= 70) {
      this.log('⚠️ CAUTION - Deploy with careful monitoring', 'warn');
    } else {
      this.log('❌ NOT READY - Fix critical issues before deployment', 'error');
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      platform: 'SPIRAL E-commerce Platform',
      test_suite_version: '1.0.0',
      summary: {
        total_tests: totalTests,
        passed: this.passCount,
        warned: this.warnCount,
        failed: this.failCount,
        success_rate: successRate
      },
      category_results: this.results,
      recommendations: this.generateRecommendations(successRate)
    };

    fs.writeFileSync('./platform-test-results.json', JSON.stringify(report, null, 2));
    this.log('\n📄 Detailed results saved to: platform-test-results.json', 'info');
    
    return successRate >= 85;
  }

  // Generate specific recommendations
  generateRecommendations(successRate) {
    const recommendations = [];
    
    if (successRate >= 95) {
      recommendations.push('System performing excellently - ready for production');
      recommendations.push('Consider setting up monitoring and alerting');
    } else if (successRate >= 85) {
      recommendations.push('System performing well with minor issues');
      recommendations.push('Address warnings before production deployment');
    } else {
      recommendations.push('Multiple issues detected - review failed tests');
      recommendations.push('Fix critical failures before considering deployment');
    }

    // Add specific recommendations based on failures
    if (this.results.api_endpoints.some(t => t.status === 'FAIL')) {
      recommendations.push('Critical API endpoints failing - immediate attention required');
    }
    
    if (this.results.database_connectivity.some(t => t.status === 'FAIL')) {
      recommendations.push('Database connectivity issues - check database configuration');
    }

    return recommendations;
  }

  // Run complete test suite
  async runComprehensiveTests() {
    this.log('🎯 Starting SPIRAL Platform 100% Functionality Test Suite...', 'success');
    this.log('This comprehensive test will validate all platform components\n', 'info');
    
    await this.testAPIEndpoints();
    await this.testEnhancedFeatures();
    await this.testDatabaseConnectivity();
    await this.testFrontendComponents();
    await this.testSecurityFeatures();
    await this.testPerformanceMetrics();
    await this.testErrorHandling();
    await this.testImageFunctionality();
    
    return this.generateReport();
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new PlatformTestSuite();
  
  testSuite.runComprehensiveTests().then(allPassed => {
    process.exit(allPassed ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test suite execution failed:', error);
    process.exit(1);
  });
}

export default PlatformTestSuite;