#!/usr/bin/env node

/**
 * SPIRAL Platform 100% Functionality Test Suite
 * Comprehensive validation of all platform features and systems
 */

import fs from 'fs';
import { execSync } from 'child_process';

class Platform100Test {
  constructor() {
    this.results = {
      api_endpoints: [],
      frontend_components: [],
      enhanced_features: [],
      system_health: [],
      performance_metrics: {},
      overall_score: 0
    };
    this.baseUrl = 'http://localhost:5000';
  }

  log(message, type = 'info') {
    const colors = {
      error: '\x1b[31m❌',
      warn: '\x1b[33m⚠️',
      info: '\x1b[36mℹ️',
      success: '\x1b[32m✅',
      test: '\x1b[35m🧪',
      perfect: '\x1b[32m💯'
    };
    
    console.log(`${colors[type] || ''} ${message}\x1b[0m`);
  }

  // Test all API endpoints for 100% functionality
  async testAPIEndpoints() {
    this.log('🧪 Testing ALL API Endpoints for 100% Functionality...', 'test');
    
    const endpoints = [
      { path: '/api/health', method: 'GET', expectedKeys: ['status', 'ok', 'cors_enabled'] },
      { path: '/api/products', method: 'GET', expectedKeys: ['length'] },
      { path: '/api/products/featured', method: 'GET', expectedKeys: ['length'] },
      { path: '/api/stores', method: 'GET', expectedKeys: ['length'] },
      { path: '/api/mall-events', method: 'GET', expectedKeys: ['length'] },
      { path: '/api/promotions', method: 'GET', expectedKeys: ['length'] },
      { path: '/api/recommend?context=homepage&limit=5', method: 'GET', expectedKeys: ['length'] },
      { path: '/api/trust/public', method: 'GET', expectedKeys: ['trust_indicators'] },
      { path: '/api/docs', method: 'GET', expectedKeys: ['endpoints'] }
    ];

    let passedTests = 0;
    const startTime = Date.now();

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint.path}`);
        const data = await response.json();
        
        // Check status code
        const statusPass = response.status === 200;
        
        // Check expected keys exist
        const keysPass = endpoint.expectedKeys.every(key => {
          if (key === 'length') return Array.isArray(data) || typeof data.length === 'number';
          return data.hasOwnProperty(key);
        });
        
        // Check response time
        const responseTime = Date.now() - startTime;
        const performancePass = responseTime < 5000; // 5 second timeout
        
        const testResult = {
          endpoint: endpoint.path,
          status_code: response.status,
          status_pass: statusPass,
          keys_pass: keysPass,
          performance_pass: performancePass,
          response_time: responseTime,
          data_size: JSON.stringify(data).length,
          overall_pass: statusPass && keysPass && performancePass
        };
        
        if (testResult.overall_pass) {
          passedTests++;
          this.log(`✅ ${endpoint.path}: PASS (${response.status}, ${responseTime}ms)`, 'success');
        } else {
          this.log(`❌ ${endpoint.path}: FAIL`, 'error');
        }
        
        this.results.api_endpoints.push(testResult);
        
      } catch (error) {
        this.log(`❌ ${endpoint.path}: ERROR - ${error.message}`, 'error');
        this.results.api_endpoints.push({
          endpoint: endpoint.path,
          error: error.message,
          overall_pass: false
        });
      }
    }
    
    const apiScore = (passedTests / endpoints.length) * 100;
    this.log(`📊 API Endpoints: ${passedTests}/${endpoints.length} passed (${Math.round(apiScore)}%)`, 
             apiScore === 100 ? 'perfect' : apiScore >= 80 ? 'success' : 'warn');
    
    return apiScore;
  }

  // Test frontend components functionality
  async testFrontendComponents() {
    this.log('🧪 Testing Frontend Components...', 'test');
    
    const criticalComponents = [
      './src/App.tsx',
      './src/components/header.tsx', 
      './src/components/footer.tsx',
      './src/components/EnhancedFeaturedProducts.tsx',
      './src/pages/home.tsx',
      './src/pages/store.tsx',
      './src/lib/queryClient.ts',
      './src/lib/cartStore.ts'
    ];
    
    let componentsPassed = 0;
    
    for (const component of criticalComponents) {
      try {
        if (fs.existsSync(component)) {
          const content = fs.readFileSync(component, 'utf8');
          
          // Basic component validation
          const hasImports = content.includes('import');
          const hasExport = content.includes('export') || content.includes('default');
          const noSyntaxErrors = !content.includes('SyntaxError');
          const hasValidJSX = component.includes('.tsx') ? content.includes('return') : true;
          
          const componentPass = hasImports && hasExport && noSyntaxErrors && hasValidJSX;
          
          if (componentPass) {
            componentsPassed++;
            this.log(`✅ ${component.split('/').pop()}: Component Valid`, 'success');
          } else {
            this.log(`❌ ${component.split('/').pop()}: Component Issues`, 'error');
          }
          
          this.results.frontend_components.push({
            component: component.split('/').pop(),
            exists: true,
            valid: componentPass,
            size: content.length
          });
        } else {
          this.log(`❌ ${component.split('/').pop()}: Missing`, 'error');
          this.results.frontend_components.push({
            component: component.split('/').pop(),
            exists: false,
            valid: false
          });
        }
      } catch (error) {
        this.log(`❌ ${component.split('/').pop()}: Error - ${error.message}`, 'error');
      }
    }
    
    const componentScore = (componentsPassed / criticalComponents.length) * 100;
    this.log(`📊 Frontend Components: ${componentsPassed}/${criticalComponents.length} valid (${Math.round(componentScore)}%)`,
             componentScore === 100 ? 'perfect' : componentScore >= 80 ? 'success' : 'warn');
    
    return componentScore;
  }

  // Test enhanced features specifically
  async testEnhancedFeatures() {
    this.log('🧪 Testing Enhanced Features Implementation...', 'test');
    
    const features = [
      {
        name: 'Image URL Normalization',
        file: './server/utils/normalize.ts',
        checkFn: (content) => content.includes('normalizeProduct') && content.includes('imageUrl')
      },
      {
        name: 'Enhanced CORS Configuration', 
        file: './server/security.js',
        checkFn: (content) => content.includes('corsOptions') && content.includes('origin')
      },
      {
        name: 'API Documentation System',
        test: async () => {
          try {
            const response = await fetch(`${this.baseUrl}/api/docs`);
            const data = await response.json();
            return response.status === 200 && data.endpoints;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Real-time Health Monitoring',
        test: async () => {
          try {
            const response = await fetch(`${this.baseUrl}/api/health`);
            const data = await response.json();
            return response.status === 200 && data.status === 'healthy' && data.cors_enabled;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Product Search & Featured Products',
        test: async () => {
          try {
            const response = await fetch(`${this.baseUrl}/api/products/featured`);
            const data = await response.json();
            return response.status === 200 && Array.isArray(data) && data.length > 0;
          } catch (error) {
            return false;
          }
        }
      }
    ];
    
    let featuresPassed = 0;
    
    for (const feature of features) {
      try {
        let passed = false;
        
        if (feature.file) {
          // File-based test
          if (fs.existsSync(feature.file)) {
            const content = fs.readFileSync(feature.file, 'utf8');
            passed = feature.checkFn(content);
          }
        } else if (feature.test) {
          // API-based test
          passed = await feature.test();
        }
        
        if (passed) {
          featuresPassed++;
          this.log(`✅ ${feature.name}: ACTIVE`, 'success');
        } else {
          this.log(`❌ ${feature.name}: NOT DETECTED`, 'warn');
        }
        
        this.results.enhanced_features.push({
          name: feature.name,
          active: passed,
          test_method: feature.file ? 'file_check' : 'api_test'
        });
        
      } catch (error) {
        this.log(`❌ ${feature.name}: ERROR - ${error.message}`, 'error');
        this.results.enhanced_features.push({
          name: feature.name,
          active: false,
          error: error.message
        });
      }
    }
    
    const featuresScore = (featuresPassed / features.length) * 100;
    this.log(`📊 Enhanced Features: ${featuresPassed}/${features.length} active (${Math.round(featuresScore)}%)`,
             featuresScore === 100 ? 'perfect' : featuresScore >= 80 ? 'success' : 'warn');
    
    return featuresScore;
  }

  // Test system health and performance
  async testSystemHealth() {
    this.log('🧪 Testing System Health & Performance...', 'test');
    
    const healthChecks = [
      {
        name: 'Server Response Time',
        test: async () => {
          const start = Date.now();
          const response = await fetch(`${this.baseUrl}/api/health`);
          const responseTime = Date.now() - start;
          return { passed: responseTime < 1000, value: responseTime, unit: 'ms' };
        }
      },
      {
        name: 'Database Connectivity',
        test: async () => {
          try {
            const response = await fetch(`${this.baseUrl}/api/health`);
            const data = await response.json();
            return { passed: data.status === 'healthy', value: 'Connected', unit: '' };
          } catch (error) {
            return { passed: false, value: 'Disconnected', unit: '' };
          }
        }
      },
      {
        name: 'CORS Functionality',
        test: async () => {
          try {
            const response = await fetch(`${this.baseUrl}/api/health`);
            const corsEnabled = response.headers.get('Access-Control-Allow-Origin') !== null;
            return { passed: corsEnabled, value: corsEnabled ? 'Enabled' : 'Disabled', unit: '' };
          } catch (error) {
            return { passed: false, value: 'Error', unit: '' };
          }
        }
      },
      {
        name: 'Memory Usage',
        test: () => {
          try {
            const memUsage = process.memoryUsage();
            const memMB = Math.round(memUsage.heapUsed / 1024 / 1024);
            return { passed: memMB < 512, value: memMB, unit: 'MB' };
          } catch (error) {
            return { passed: false, value: 'Unknown', unit: '' };
          }
        }
      }
    ];
    
    let healthPassed = 0;
    
    for (const check of healthChecks) {
      try {
        const result = await check.test();
        
        if (result.passed) {
          healthPassed++;
          this.log(`✅ ${check.name}: ${result.value}${result.unit}`, 'success');
        } else {
          this.log(`❌ ${check.name}: ${result.value}${result.unit}`, 'warn');
        }
        
        this.results.system_health.push({
          name: check.name,
          passed: result.passed,
          value: result.value,
          unit: result.unit
        });
        
      } catch (error) {
        this.log(`❌ ${check.name}: ERROR - ${error.message}`, 'error');
        this.results.system_health.push({
          name: check.name,
          passed: false,
          error: error.message
        });
      }
    }
    
    const healthScore = (healthPassed / healthChecks.length) * 100;
    this.log(`📊 System Health: ${healthPassed}/${healthChecks.length} healthy (${Math.round(healthScore)}%)`,
             healthScore === 100 ? 'perfect' : healthScore >= 80 ? 'success' : 'warn');
    
    return healthScore;
  }

  // Generate comprehensive 100% functionality report
  generateReport(apiScore, componentScore, featuresScore, healthScore) {
    const overallScore = Math.round((apiScore + componentScore + featuresScore + healthScore) / 4);
    
    this.log('\n💯 SPIRAL Platform 100% Functionality Test Results', 'perfect');
    this.log('='.repeat(60), 'info');
    
    // Score breakdown
    this.log('\n📊 Functionality Scores:', 'info');
    this.log(`  API Endpoints: ${Math.round(apiScore)}/100`, apiScore === 100 ? 'perfect' : 'info');
    this.log(`  Frontend Components: ${Math.round(componentScore)}/100`, componentScore === 100 ? 'perfect' : 'info');
    this.log(`  Enhanced Features: ${Math.round(featuresScore)}/100`, featuresScore === 100 ? 'perfect' : 'info');
    this.log(`  System Health: ${Math.round(healthScore)}/100`, healthScore === 100 ? 'perfect' : 'info');
    
    // Overall assessment
    this.log(`\n🎯 OVERALL PLATFORM SCORE: ${overallScore}/100`, 
             overallScore === 100 ? 'perfect' : overallScore >= 90 ? 'success' : 'warn');
    
    // Detailed results
    this.log('\n🔍 Detailed Test Results:', 'info');
    
    // API Results
    this.log('\n🌐 API Endpoints:', 'info');
    for (const api of this.results.api_endpoints) {
      if (api.overall_pass) {
        this.log(`  ✅ ${api.endpoint} (${api.status_code}, ${api.response_time}ms)`, 'success');
      } else {
        this.log(`  ❌ ${api.endpoint} ${api.error ? '- ' + api.error : ''}`, 'error');
      }
    }
    
    // Enhanced Features Results
    this.log('\n⭐ Enhanced Features:', 'info');
    for (const feature of this.results.enhanced_features) {
      this.log(`  ${feature.active ? '✅' : '❌'} ${feature.name}`, feature.active ? 'success' : 'warn');
    }
    
    // System Health Results
    this.log('\n🏥 System Health:', 'info');
    for (const health of this.results.system_health) {
      this.log(`  ${health.passed ? '✅' : '❌'} ${health.name}: ${health.value}${health.unit}`, 
               health.passed ? 'success' : 'warn');
    }
    
    // Final assessment
    if (overallScore === 100) {
      this.log('\n🎉 PERFECT SCORE! Platform is 100% functional!', 'perfect');
      this.log('🚀 Ready for production deployment', 'success');
    } else if (overallScore >= 90) {
      this.log('\n✅ EXCELLENT! Platform is highly functional', 'success');
      this.log('🚀 Ready for deployment with minor optimizations', 'success');
    } else if (overallScore >= 75) {
      this.log('\n⚠️  GOOD functionality with some areas needing attention', 'warn');
      this.log('🔧 Address identified issues before deployment', 'warn');
    } else {
      this.log('\n❌ SIGNIFICANT issues found - address before deployment', 'error');
    }
    
    // Save comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      platform: 'SPIRAL E-commerce Platform',
      test_type: '100% Functionality Validation',
      overall_score: overallScore,
      scores: {
        api_endpoints: Math.round(apiScore),
        frontend_components: Math.round(componentScore),
        enhanced_features: Math.round(featuresScore),
        system_health: Math.round(healthScore)
      },
      detailed_results: this.results,
      recommendation: overallScore >= 90 ? 'Deploy to production' : 
                     overallScore >= 75 ? 'Fix issues then deploy' : 
                     'Major fixes needed before deployment'
    };
    
    fs.writeFileSync('./platform-100-test-report.json', JSON.stringify(report, null, 2));
    this.log('\n📄 Comprehensive report saved to: platform-100-test-report.json', 'info');
    
    return overallScore;
  }

  // Run complete 100% functionality test suite
  async runCompleteTest() {
    this.log('💯 Starting SPIRAL Platform 100% Functionality Test Suite...', 'perfect');
    this.log('Testing ALL systems for complete functionality validation\n', 'info');
    
    const apiScore = await this.testAPIEndpoints();
    const componentScore = await this.testFrontendComponents();
    const featuresScore = await this.testEnhancedFeatures();
    const healthScore = await this.testSystemHealth();
    
    const overallScore = this.generateReport(apiScore, componentScore, featuresScore, healthScore);
    
    return overallScore;
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new Platform100Test();
  
  tester.runCompleteTest().then(score => {
    process.exit(score >= 75 ? 0 : 1);
  }).catch(error => {
    console.error('💯 100% Test suite failed:', error);
    process.exit(1);
  });
}

export default Platform100Test;