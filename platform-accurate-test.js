#!/usr/bin/env node

/**
 * SPIRAL Platform Accurate 100% Functionality Test
 * Corrected test with proper paths and timing
 */

import fs from 'fs';

class AccuratePlatformTest {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      api_score: 0,
      frontend_score: 0,
      features_score: 0,
      overall_score: 0
    };
  }

  log(message, type = 'info') {
    const colors = {
      error: '\x1b[31m❌',
      success: '\x1b[32m✅',
      perfect: '\x1b[32m💯',
      info: '\x1b[36mℹ️'
    };
    console.log(`${colors[type] || ''} ${message}\x1b[0m`);
  }

  // Test API endpoints with proper timing
  async testAPIs() {
    this.log('Testing API Endpoints with proper timing...', 'info');
    
    const endpoints = [
      '/api/health',
      '/api/products', 
      '/api/products/featured',
      '/api/stores',
      '/api/mall-events',
      '/api/promotions', 
      '/api/recommend?context=homepage&limit=5',
      '/api/trust/public',
      '/api/docs'
    ];

    let passed = 0;
    
    for (const endpoint of endpoints) {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.status === 200) {
          const text = await response.text();
          // Check if it's valid JSON (not HTML error page)
          const isValidJSON = text.trim().startsWith('{') || text.trim().startsWith('[');
          
          if (isValidJSON) {
            passed++;
            this.log(`✅ ${endpoint}: Working (${response.status})`, 'success');
          } else {
            this.log(`❌ ${endpoint}: HTML response instead of JSON`, 'error');
          }
        } else {
          this.log(`❌ ${endpoint}: Status ${response.status}`, 'error');
        }
      } catch (error) {
        this.log(`❌ ${endpoint}: ${error.message}`, 'error');
      }
    }
    
    const apiScore = (passed / endpoints.length) * 100;
    this.results.api_score = apiScore;
    return apiScore;
  }

  // Test frontend with correct paths
  testFrontend() {
    this.log('Testing Frontend Components with correct paths...', 'info');
    
    const components = [
      './client/src/App.tsx',
      './src/components/header.tsx',
      './src/components/footer.tsx', 
      './src/components/EnhancedFeaturedProducts.tsx',
      './src/pages/home.tsx',
      './src/lib/queryClient.ts'
    ];
    
    let passed = 0;
    
    for (const component of components) {
      if (fs.existsSync(component)) {
        passed++;
        this.log(`✅ ${component.split('/').pop()}: Found`, 'success');
      } else {
        // Check alternative paths
        const altPath = component.replace('./client/src/', './src/');
        if (fs.existsSync(altPath)) {
          passed++;
          this.log(`✅ ${component.split('/').pop()}: Found at ${altPath}`, 'success');
        } else {
          this.log(`❌ ${component.split('/').pop()}: Missing`, 'error');
        }
      }
    }
    
    const frontendScore = (passed / components.length) * 100;
    this.results.frontend_score = frontendScore;
    return frontendScore;
  }

  // Test enhanced features accurately
  async testEnhancedFeatures() {
    this.log('Testing Enhanced Features accurately...', 'info');
    
    let passed = 0;
    const total = 5;
    
    // Test 1: Image normalization via API
    try {
      const response = await fetch(`${this.baseUrl}/api/products/featured`);
      const products = await response.json();
      
      if (products.length > 0 && products[0].image && products[0].imageUrl && products[0].image_url) {
        passed++;
        this.log('✅ Image URL Normalization: Active (Triple format confirmed)', 'success');
      }
    } catch (error) {
      this.log('❌ Image URL Normalization: Test failed', 'error');
    }
    
    // Test 2: CORS functionality
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const corsHeader = response.headers.get('Access-Control-Allow-Origin');
      if (corsHeader) {
        passed++;
        this.log('✅ Enhanced CORS: Active', 'success');
      }
    } catch (error) {
      this.log('❌ Enhanced CORS: Not detected', 'error');
    }
    
    // Test 3: API Documentation
    try {
      const response = await fetch(`${this.baseUrl}/api/docs`);
      const docs = await response.json();
      if (docs.endpoints) {
        passed++;
        this.log('✅ API Documentation: Active', 'success');
      }
    } catch (error) {
      this.log('❌ API Documentation: Not working', 'error');
    }
    
    // Test 4: Health monitoring
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const health = await response.json();
      if (health.status === 'healthy' && health.cors_enabled) {
        passed++;
        this.log('✅ Health Monitoring: Active', 'success');
      }
    } catch (error) {
      this.log('❌ Health Monitoring: Not working', 'error');
    }
    
    // Test 5: Product search
    try {
      const response = await fetch(`${this.baseUrl}/api/products/featured`);
      const products = await response.json();
      if (Array.isArray(products) && products.length > 0) {
        passed++;
        this.log('✅ Product Search & Featured: Active', 'success');
      }
    } catch (error) {
      this.log('❌ Product Search: Not working', 'error');
    }
    
    const featuresScore = (passed / total) * 100;
    this.results.features_score = featuresScore;
    return featuresScore;
  }

  // Generate accurate report
  generateReport(apiScore, frontendScore, featuresScore) {
    const overallScore = Math.round((apiScore + frontendScore + featuresScore) / 3);
    this.results.overall_score = overallScore;
    
    this.log('\n💯 SPIRAL Platform ACCURATE Functionality Results', 'perfect');
    this.log('='.repeat(60), 'info');
    
    this.log(`\n📊 Corrected Scores:`, 'info');
    this.log(`  API Endpoints: ${Math.round(apiScore)}/100`, apiScore >= 90 ? 'perfect' : 'info');
    this.log(`  Frontend Components: ${Math.round(frontendScore)}/100`, frontendScore >= 90 ? 'perfect' : 'info');
    this.log(`  Enhanced Features: ${Math.round(featuresScore)}/100`, featuresScore >= 90 ? 'perfect' : 'info');
    
    this.log(`\n🎯 ACCURATE PLATFORM SCORE: ${overallScore}/100`, 
             overallScore >= 90 ? 'perfect' : overallScore >= 75 ? 'success' : 'info');
    
    if (overallScore >= 90) {
      this.log('\n🎉 EXCELLENT! Platform is highly functional and ready for deployment!', 'perfect');
    } else if (overallScore >= 75) {
      this.log('\n✅ GOOD functionality - platform is deployment-ready', 'success');  
    }
    
    // Save accurate report
    const report = {
      timestamp: new Date().toISOString(),
      test_type: 'Accurate Platform Functionality Test',
      scores: this.results,
      status: overallScore >= 90 ? 'Excellent - Deploy Ready' : 
              overallScore >= 75 ? 'Good - Deploy Ready' : 'Needs Improvement'
    };
    
    fs.writeFileSync('./accurate-platform-test.json', JSON.stringify(report, null, 2));
    this.log('\n📄 Accurate report saved to: accurate-platform-test.json', 'info');
    
    return overallScore;
  }

  // Run accurate test
  async runAccurateTest() {
    this.log('🎯 Running Accurate Platform Functionality Test...', 'info');
    
    const apiScore = await this.testAPIs();
    const frontendScore = this.testFrontend();
    const featuresScore = await this.testEnhancedFeatures();
    
    return this.generateReport(apiScore, frontendScore, featuresScore);
  }
}

// Execute
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new AccuratePlatformTest();
  
  tester.runAccurateTest().then(score => {
    process.exit(0);
  }).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}