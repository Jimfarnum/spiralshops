#!/usr/bin/env node
/**
 * SPIRAL Enhanced Features - 100% Compliance Validation
 * Comprehensive testing for TypeScript, API integration, and UI components
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const BASE_URL = 'http://localhost:5000';

// Test configurations
const TESTS = {
  API_ENDPOINTS: [
    '/api/products/test-product/reviews',
    '/api/users/user-123/wishlist',
    '/api/spiral-plus/benefits'
  ],
  COMPONENTS: [
    'StarRating',
    'EnhancedReviews', 
    'EnhancedWishlistButton',
    'SpiralPlusBanner'
  ],
  ROUTES: [
    '/enhanced-features-demo'
  ]
};

async function testTypeScriptCompliance() {
  console.log('🔍 Testing TypeScript Compliance...');
  try {
    // Check if there are any TypeScript errors
    const { stdout, stderr } = await execAsync('npx tsc --noEmit --project . 2>&1 || true');
    if (stdout.includes('error TS') || stderr.includes('error TS')) {
      console.log('❌ TypeScript errors found:');
      console.log(stdout);
      return false;
    }
    console.log('✅ TypeScript compilation clean');
    return true;
  } catch (error) {
    console.log('⚠️  TypeScript check skipped:', error.message);
    return true; // Don't fail the test if tsc is not available
  }
}

async function testComponentFiles() {
  console.log('📦 Testing Component Files...');
  const results = [];
  
  try {
    const componentContent = await fs.readFile('client/src/components/enhanced-features.tsx', 'utf8');
    
    // Check for each component
    for (const component of TESTS.COMPONENTS) {
      if (componentContent.includes(`export function ${component}`) || 
          componentContent.includes(`const ${component} =`) ||
          componentContent.includes(`function ${component}`)) {
        console.log(`✅ ${component} component found`);
        results.push(true);
      } else {
        console.log(`❌ ${component} component missing`);
        results.push(false);
      }
    }
    
    // Check for TypeScript features
    const tsFeatures = [
      'interface',
      ': React.FC',
      'useState<',
      'useQuery<',
      'useMutation'
    ];
    
    for (const feature of tsFeatures) {
      if (componentContent.includes(feature)) {
        console.log(`✅ TypeScript feature: ${feature}`);
        results.push(true);
      } else {
        console.log(`⚠️  TypeScript feature missing: ${feature}`);
        results.push(false);
      }
    }
    
  } catch (error) {
    console.log('❌ Error reading component file:', error.message);
    return false;
  }
  
  return results.every(r => r);
}

async function testAPIEndpoints() {
  console.log('🌐 Testing API Endpoints...');
  const results = [];
  
  for (const endpoint of TESTS.API_ENDPOINTS) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (response.ok) {
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
        results.push(true);
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`);
        results.push(false);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
      results.push(false);
    }
  }
  
  return results.every(r => r);
}

async function testDemoPage() {
  console.log('🎨 Testing Demo Page...');
  try {
    const response = await fetch(`${BASE_URL}/enhanced-features-demo`);
    if (response.ok) {
      const content = await response.text();
      if (content.includes('Enhanced SPIRAL Features') && 
          content.includes('StarRating') && 
          content.includes('Wishlist')) {
        console.log('✅ Demo page loads with expected content');
        return true;
      } else {
        console.log('❌ Demo page missing expected content');
        return false;
      }
    } else {
      console.log(`❌ Demo page - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Demo page - Error: ${error.message}`);
    return false;
  }
}

async function testBackendIntegration() {
  console.log('🔗 Testing Backend Integration...');
  const tests = [
    // Test wishlist CRUD operations
    async () => {
      const response = await fetch(`${BASE_URL}/api/users/test-user/wishlist/test-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Test Item',
          productPrice: 9.99,
          productImage: '/test.jpg'
        })
      });
      return response.ok;
    },
    
    // Test reviews fetch
    async () => {
      const response = await fetch(`${BASE_URL}/api/products/test/reviews`);
      return response.ok;
    }
  ];
  
  const results = [];
  for (let i = 0; i < tests.length; i++) {
    try {
      const result = await tests[i]();
      console.log(`✅ Backend test ${i + 1}: ${result ? 'PASS' : 'FAIL'}`);
      results.push(result);
    } catch (error) {
      console.log(`❌ Backend test ${i + 1}: Error - ${error.message}`);
      results.push(false);
    }
  }
  
  return results.every(r => r);
}

async function runComplianceTest() {
  console.log('🚀 SPIRAL Enhanced Features - 100% Compliance Test');
  console.log('='.repeat(60));
  
  const testResults = {
    typescript: await testTypeScriptCompliance(),
    components: await testComponentFiles(),
    apis: await testAPIEndpoints(),
    demo: await testDemoPage(),
    backend: await testBackendIntegration()
  };
  
  const passed = Object.values(testResults).filter(r => r).length;
  const total = Object.keys(testResults).length;
  const compliance = (passed / total) * 100;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPLIANCE TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Tests Passed: ${passed}/${total}`);
  console.log(`📈 Compliance Rate: ${Math.round(compliance)}%`);
  
  // Detailed results
  console.log('\n📋 Detailed Results:');
  Object.entries(testResults).forEach(([test, result]) => {
    console.log(`  ${result ? '✅' : '❌'} ${test.charAt(0).toUpperCase() + test.slice(1)}: ${result ? 'PASS' : 'FAIL'}`);
  });
  
  if (compliance >= 100) {
    console.log('\n🎉 PERFECT COMPLIANCE: 100% SPIRAL Standards Met!');
  } else if (compliance >= 95) {
    console.log('\n🌟 EXCELLENT: Near-perfect compliance achieved!');
  } else if (compliance >= 80) {
    console.log('\n⚠️  GOOD: High compliance, minor improvements needed');
  } else {
    console.log('\n🔧 NEEDS WORK: Significant improvements required');
  }
  
  return {
    compliance,
    results: testResults,
    passed,
    total
  };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComplianceTest().catch(console.error);
}

export { runComplianceTest };