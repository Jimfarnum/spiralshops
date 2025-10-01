#!/usr/bin/env node

// SPIRAL API Comprehensive Endpoint Test Script
// Tests all major endpoints and provides clear status report

import fetch from 'node-fetch';

const BASE_URL = process.env.REPLIT_URL || 'https://27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev';

// Test configuration
const ENDPOINTS = [
  // Health & Status
  { name: 'Health Check', url: '/api/health', method: 'GET', critical: true },
  { name: 'Service Health', url: '/healthz', method: 'GET', critical: true },
  
  // Core Products & Discovery
  { name: 'Products API', url: '/api/products', method: 'GET', critical: true },
  { name: 'Featured Products', url: '/api/products/featured', method: 'GET', critical: true },
  { name: 'Theme API', url: '/api/theme', method: 'GET', critical: false },
  
  // SPIRAL Loyalty System
  { name: 'SPIRALS System', url: '/api/spirals', method: 'GET', critical: true },
  
  // Stripe Billing System
  { name: 'Billing Plans', url: '/api/billing/plans', method: 'GET', critical: true },
  { name: 'Billing Status', url: '/api/billing/status', method: 'GET', critical: false },
  
  // Enhanced PostgreSQL APIs
  { name: 'Enhanced Malls', url: '/api/v2/malls', method: 'GET', critical: true },
  { name: 'Enhanced Retailers', url: '/api/v2/retailers', method: 'GET', critical: true },
  { name: 'Enhanced Compliance', url: '/api/v2/compliance', method: 'GET', critical: false },
  
  // EJ AI Agent
  { name: 'EJ AI Agent', url: '/api/ej', method: 'GET', critical: true },
  
  // Core SPIRAL APIs
  { name: 'Shopper API', url: '/api/shopper', method: 'GET', critical: true },
  { name: 'Malls API', url: '/api/malls', method: 'GET', critical: true },
  { name: 'Orders API', url: '/api/orders', method: 'GET', critical: true },
  { name: 'Retailer API', url: '/api/retailer', method: 'GET', critical: true },
  { name: 'Legal API', url: '/api/legal', method: 'GET', critical: false },
  
  // Admin & Management
  { name: 'Admin Promotions', url: '/api/admin/promotions', method: 'GET', critical: false },
  { name: 'Seasonal Promotions', url: '/api/seasonal', method: 'GET', critical: false },
  { name: 'Onboarding API', url: '/api/onboarding', method: 'GET', critical: false },
];

// Test runner
async function testEndpoint(endpoint) {
  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${endpoint.url}`, {
      method: endpoint.method,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SPIRAL-Test-Suite/1.0'
      }
    });
    
    const responseTime = Date.now() - startTime;
    const contentType = response.headers.get('content-type');
    
    let result = {
      name: endpoint.name,
      url: endpoint.url,
      status: response.status,
      ok: response.ok,
      responseTime,
      contentType,
      critical: endpoint.critical
    };
    
    // Try to parse JSON response
    try {
      const text = await response.text();
      if (contentType?.includes('application/json')) {
        result.data = JSON.parse(text);
        result.hasData = true;
      } else {
        result.text = text.substring(0, 100);
        result.hasData = false;
      }
    } catch (e) {
      result.parseError = e.message;
    }
    
    return result;
  } catch (error) {
    return {
      name: endpoint.name,
      url: endpoint.url,
      error: error.message,
      critical: endpoint.critical,
      failed: true
    };
  }
}

// Results formatter
function formatResults(results) {
  console.log('\n🚀 SPIRAL API ENDPOINT TEST RESULTS');
  console.log('═'.repeat(60));
  console.log(`📊 Base URL: ${BASE_URL}`);
  console.log(`🕐 Test Time: ${new Date().toISOString()}`);
  console.log('═'.repeat(60));
  
  const passed = results.filter(r => r.ok || (!r.failed && r.status < 400));
  const failed = results.filter(r => r.failed || r.status >= 400);
  const critical = results.filter(r => r.critical);
  const criticalPassed = critical.filter(r => r.ok || (!r.failed && r.status < 400));
  
  console.log(`\n📈 SUMMARY:`);
  console.log(`✅ Passed: ${passed.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  console.log(`🔥 Critical Passed: ${criticalPassed.length}/${critical.length}`);
  
  // Overall system health
  const systemHealth = (criticalPassed.length / critical.length) * 100;
  const healthStatus = systemHealth >= 80 ? '🟢 EXCELLENT' : 
                      systemHealth >= 60 ? '🟡 GOOD' : 
                      systemHealth >= 40 ? '🟠 FAIR' : '🔴 POOR';
  
  console.log(`\n🏥 SYSTEM HEALTH: ${systemHealth.toFixed(1)}% - ${healthStatus}`);
  
  // Detailed results
  console.log('\n📋 DETAILED RESULTS:');
  console.log('-'.repeat(60));
  
  results.forEach(result => {
    const icon = result.ok || (!result.failed && result.status < 400) ? '✅' : '❌';
    const critical = result.critical ? '🔥' : '  ';
    const time = result.responseTime ? `(${result.responseTime}ms)` : '';
    
    console.log(`${icon} ${critical} ${result.name.padEnd(20)} ${result.status || 'ERR'} ${time}`);
    
    if (result.error) {
      console.log(`    └─ Error: ${result.error}`);
    } else if (result.data && typeof result.data === 'object') {
      const keys = Object.keys(result.data);
      console.log(`    └─ JSON: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`);
    }
  });
  
  // Critical failures
  const criticalFailures = critical.filter(r => r.failed || r.status >= 400);
  if (criticalFailures.length > 0) {
    console.log('\n🚨 CRITICAL FAILURES:');
    criticalFailures.forEach(failure => {
      console.log(`❌ ${failure.name}: ${failure.error || failure.status}`);
    });
  }
  
  console.log('\n═'.repeat(60));
  console.log(`🎯 SPIRAL Platform Status: ${systemHealth >= 80 ? 'READY FOR PRODUCTION' : 'NEEDS ATTENTION'}`);
  console.log('═'.repeat(60));
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting SPIRAL API endpoint tests...');
  console.log(`📍 Testing: ${BASE_URL}`);
  
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    process.stdout.write(`Testing ${endpoint.name}... `);
    const result = await testEndpoint(endpoint);
    const status = result.ok || (!result.failed && result.status < 400) ? '✅' : '❌';
    console.log(status);
    results.push(result);
  }
  
  formatResults(results);
  
  // Exit with appropriate code
  const criticalFailures = results.filter(r => r.critical && (r.failed || r.status >= 400));
  process.exit(criticalFailures.length > 0 ? 1 : 0);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Test error:', error);
  process.exit(1);
});

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, testEndpoint };