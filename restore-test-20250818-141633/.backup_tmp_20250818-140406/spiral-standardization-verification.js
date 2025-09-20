// SPIRAL API Standardization Verification Script
// Tests all standardized endpoints for correct format compliance

import fs from 'fs';

const testEndpoints = [
  { url: '/api/auth/check-username?username=testuser', name: 'Username Check' },
  { url: '/api/auth/check-email?email=test@example.com', name: 'Email Check' },
  { url: '/api/retailers', name: 'Retailers List' },
  { url: '/api/stores/search?zipCode=12345', name: 'Store Search' },
  { url: '/api/categories', name: 'Categories' },
  { url: '/api/recommend', name: 'AI Recommendations' }
];

async function testStandardFormat(url, name) {
  try {
    const response = await fetch(`http://localhost:5000${url}`);
    const data = await response.json();
    
    const hasStandardFormat = 
      data.hasOwnProperty('success') &&
      data.hasOwnProperty('data') &&
      data.hasOwnProperty('error') &&
      data.hasOwnProperty('timestamp') &&
      data.hasOwnProperty('duration');
    
    return {
      endpoint: name,
      url,
      status: response.status,
      hasStandardFormat,
      success: data.success,
      hasData: data.data !== null,
      duration: data.duration,
      timestamp: data.timestamp
    };
  } catch (error) {
    return {
      endpoint: name,
      url,
      error: error.message,
      hasStandardFormat: false
    };
  }
}

async function runVerification() {
  console.log('🔍 SPIRAL API Standardization Verification\n');
  
  const results = [];
  
  for (const endpoint of testEndpoints) {
    const result = await testStandardFormat(endpoint.url, endpoint.name);
    results.push(result);
    
    const status = result.hasStandardFormat ? '✅' : '❌';
    console.log(`${status} ${result.endpoint}: ${result.hasStandardFormat ? 'STANDARD FORMAT' : 'LEGACY FORMAT'}`);
    
    if (result.hasStandardFormat) {
      console.log(`   - Success: ${result.success}`);
      console.log(`   - Duration: ${result.duration}`);
      console.log(`   - Has Data: ${result.hasData}`);
    }
    console.log('');
  }
  
  const passCount = results.filter(r => r.hasStandardFormat).length;
  const successRate = Math.round((passCount / results.length) * 100);
  
  console.log(`\n📊 VERIFICATION SUMMARY:`);
  console.log(`   - Endpoints Tested: ${results.length}`);
  console.log(`   - Standard Format: ${passCount}`);
  console.log(`   - Success Rate: ${successRate}%`);
  
  if (successRate === 100) {
    console.log(`\n🎉 ALL ENDPOINTS USING SPIRAL STANDARD FORMAT!`);
  } else {
    console.log(`\n⚠️  ${results.length - passCount} endpoints still need standardization`);
  }
  
  // Save detailed results
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalEndpoints: results.length,
      standardized: passCount,
      successRate: successRate
    },
    results: results
  };
  
  fs.writeFileSync('spiral-standardization-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Detailed report saved to: spiral-standardization-report.json');
}

// Run verification
runVerification().catch(console.error);