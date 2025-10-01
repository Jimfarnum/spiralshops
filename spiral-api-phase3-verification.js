// SPIRAL API Standardization Phase 3 Verification
// Tests the global middleware implementation and standardized responses

import fs from 'fs';

const BASE_URL = 'http://localhost:5000';

async function verifyGlobalMiddleware() {
  console.log('🔍 SPIRAL API Phase 3 - Global Middleware Verification\n');

  const testEndpoints = [
    '/api/auth/check-username?username=testuser',
    '/api/auth/check-email?email=test@example.com', 
    '/api/auth/check-social-handle?handle=testhandle',
    '/api/recommend?category=electronics',
    '/api/categories',
    '/api/retailers'
  ];

  const results = [];

  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const data = await response.json();
      
      const hasStandardFormat = (
        typeof data.success === 'boolean' &&
        data.hasOwnProperty('data') &&
        data.hasOwnProperty('error') &&
        data.hasOwnProperty('duration') &&
        data.hasOwnProperty('timestamp')
      );

      results.push({
        endpoint,
        status: response.status,
        standardFormat: hasStandardFormat,
        duration: data.duration,
        success: data.success,
        hasData: data.data !== null,
        hasError: data.error !== null
      });

      const icon = hasStandardFormat ? '✅' : '❌';
      console.log(`${icon} ${endpoint}: ${hasStandardFormat ? 'STANDARD' : 'NON-STANDARD'} (${data.duration || 'N/A'})`);
      
    } catch (error) {
      console.log(`❌ ${endpoint}: ERROR - ${error.message}`);
    }
  }

  const standardCount = results.filter(r => r.standardFormat).length;
  const successRate = Math.round((standardCount / results.length) * 100);

  console.log(`\n📊 PHASE 3 RESULTS:`);
  console.log(`   Standardized: ${standardCount}/${results.length} (${successRate}%)`);
  console.log(`   Global Middleware: ${successRate > 80 ? 'WORKING' : 'NEEDS FIXES'}`);
  
  if (successRate === 100) {
    console.log('\n🎉 PHASE 3 COMPLETE - All endpoints using global middleware!');
  } else {
    console.log(`\n⚠️  Phase 3 Progress: ${successRate}% complete`);
  }

  return { successRate, results };
}

verifyGlobalMiddleware().catch(console.error);