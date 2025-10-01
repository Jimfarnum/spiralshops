// SPIRAL Comprehensive API Standardization Testing Suite
// Tests all high-priority endpoints for standard response format compliance

import fs from 'fs';

const BASE_URL = 'http://localhost:5000';

const testEndpoints = [
  // Authentication endpoints (High Priority)
  {
    url: '/api/auth/check-username?username=testuser',
    method: 'GET',
    category: 'Authentication',
    description: 'Username availability check'
  },
  {
    url: '/api/auth/check-email?email=test@example.com',
    method: 'GET', 
    category: 'Authentication',
    description: 'Email availability check'
  },
  {
    url: '/api/auth/check-social-handle?handle=testhandle',
    method: 'GET',
    category: 'Authentication', 
    description: 'Social handle availability check'
  },

  // Retailer endpoints (High Priority)
  {
    url: '/api/retailers',
    method: 'GET',
    category: 'Retailers',
    description: 'Retailer listings'
  },
  {
    url: '/api/retailers/search?query=electronics',
    method: 'GET',
    category: 'Retailers',
    description: 'Retailer search'
  },

  // SPIRALS/Loyalty endpoints (High Priority)  
  {
    url: '/api/spirals/balance?userId=1',
    method: 'GET',
    category: 'Loyalty',
    description: 'User SPIRALS balance'
  },
  {
    url: '/api/loyalty/tiers',
    method: 'GET',
    category: 'Loyalty',
    description: 'Loyalty tier information'
  },

  // Wishlist endpoints (Medium Priority)
  {
    url: '/api/wishlist/items?userId=1',
    method: 'GET',
    category: 'Wishlist',
    description: 'User wishlist items'
  },

  // Notifications endpoints (Medium Priority)
  {
    url: '/api/notifications?userId=1',
    method: 'GET', 
    category: 'Notifications',
    description: 'User notifications'
  },

  // Already standardized endpoints for comparison
  {
    url: '/api/recommend?category=electronics',
    method: 'GET',
    category: 'AI Recommendations',
    description: 'AI product recommendations'
  },
  {
    url: '/api/categories',
    method: 'GET',
    category: 'Products',
    description: 'Product categories'
  },
  {
    url: '/api/stores',
    method: 'GET',
    category: 'Stores',
    description: 'Store listings'
  }
];

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint.url}`, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // Check for SPIRAL standard format
    const hasStandardFormat = (
      typeof data.success === 'boolean' &&
      data.hasOwnProperty('data') &&
      data.hasOwnProperty('error') &&
      data.hasOwnProperty('duration') &&
      data.hasOwnProperty('timestamp')
    );

    const result = {
      endpoint: endpoint.url,
      method: endpoint.method,
      category: endpoint.category,
      description: endpoint.description,
      status: response.status,
      success: data.success || false,
      hasStandardFormat,
      duration: data.duration || 'N/A',
      timestamp: data.timestamp || 'N/A',
      responseKeys: Object.keys(data),
      dataType: data.data ? typeof data.data : 'null',
      errorPresent: data.error !== undefined
    };

    return result;
  } catch (error) {
    return {
      endpoint: endpoint.url,
      method: endpoint.method,
      category: endpoint.category,
      description: endpoint.description,
      status: 'ERROR',
      success: false,
      hasStandardFormat: false,
      error: error.message,
      responseKeys: [],
      dataType: 'error',
      errorPresent: true
    };
  }
}

async function runComprehensiveTests() {
  console.log('🔍 SPIRAL Comprehensive API Standardization Test\n');
  
  const results = [];
  const categories = {};

  for (const endpoint of testEndpoints) {
    console.log(`Testing ${endpoint.category}: ${endpoint.description}...`);
    const result = await testEndpoint(endpoint);
    results.push(result);

    if (!categories[endpoint.category]) {
      categories[endpoint.category] = { total: 0, standardized: 0, working: 0 };
    }
    
    categories[endpoint.category].total++;
    if (result.hasStandardFormat) categories[endpoint.category].standardized++;
    if (result.status === 200 || result.success) categories[endpoint.category].working++;
  }

  // Generate summary report
  console.log('\n📊 COMPREHENSIVE TEST SUMMARY:\n');
  
  Object.entries(categories).forEach(([category, stats]) => {
    const standardPercentage = Math.round((stats.standardized / stats.total) * 100);
    const workingPercentage = Math.round((stats.working / stats.total) * 100);
    
    console.log(`${category}:`);
    console.log(`  - Total Endpoints: ${stats.total}`);
    console.log(`  - Standardized: ${stats.standardized}/${stats.total} (${standardPercentage}%)`);
    console.log(`  - Working: ${stats.working}/${stats.total} (${workingPercentage}%)`);
    console.log('');
  });

  const totalEndpoints = results.length;
  const totalStandardized = results.filter(r => r.hasStandardFormat).length;
  const totalWorking = results.filter(r => r.status === 200 || r.success).length;

  console.log('🎯 OVERALL STATISTICS:');
  console.log(`  - Total Endpoints Tested: ${totalEndpoints}`);
  console.log(`  - Standardized Format: ${totalStandardized}/${totalEndpoints} (${Math.round((totalStandardized/totalEndpoints)*100)}%)`);
  console.log(`  - Working Endpoints: ${totalWorking}/${totalEndpoints} (${Math.round((totalWorking/totalEndpoints)*100)}%)`);

  // Detailed results
  console.log('\n📋 DETAILED RESULTS:\n');
  results.forEach(result => {
    const statusIcon = result.hasStandardFormat ? '✅' : '❌';
    const workingIcon = (result.status === 200 || result.success) ? '🟢' : '🔴';
    console.log(`${statusIcon} ${workingIcon} ${result.endpoint}`);
    console.log(`    Category: ${result.category}`);
    console.log(`    Status: ${result.status}`);
    console.log(`    Standard Format: ${result.hasStandardFormat}`);
    console.log(`    Duration: ${result.duration}`);
    console.log('');
  });

  // Priority recommendations
  console.log('📈 PRIORITY RECOMMENDATIONS:\n');
  
  const needsStandardization = results.filter(r => !r.hasStandardFormat && (r.status === 200 || r.success));
  if (needsStandardization.length > 0) {
    console.log('HIGH PRIORITY - Working endpoints that need standardization:');
    needsStandardization.forEach(endpoint => {
      console.log(`  - ${endpoint.endpoint} (${endpoint.category})`);
    });
    console.log('');
  }

  const brokenEndpoints = results.filter(r => r.status !== 200 && !r.success);
  if (brokenEndpoints.length > 0) {
    console.log('MEDIUM PRIORITY - Endpoints that need fixes:');
    brokenEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.endpoint} (${endpoint.category}) - ${endpoint.error || 'Non-200 status'}`);
    });
    console.log('');
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalEndpoints,
      totalStandardized,
      totalWorking,
      standardizationPercentage: Math.round((totalStandardized/totalEndpoints)*100),
      workingPercentage: Math.round((totalWorking/totalEndpoints)*100)
    },
    categories,
    results,
    recommendations: {
      needsStandardization: needsStandardization.map(r => ({ endpoint: r.endpoint, category: r.category })),
      needsFixes: brokenEndpoints.map(r => ({ endpoint: r.endpoint, category: r.category, error: r.error }))
    }
  };

  fs.writeFileSync('spiral-comprehensive-api-report.json', JSON.stringify(report, null, 2));
  console.log('📁 Detailed report saved to: spiral-comprehensive-api-report.json');

  if (totalStandardized === totalEndpoints && totalWorking === totalEndpoints) {
    console.log('\n🎉 ALL ENDPOINTS FULLY STANDARDIZED AND WORKING!');
  } else {
    console.log(`\n⚠️  Progress: ${totalStandardized}/${totalEndpoints} standardized, ${totalWorking}/${totalEndpoints} working`);
  }
}

// Run the comprehensive test
runComprehensiveTests().catch(console.error);