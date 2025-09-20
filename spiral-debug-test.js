#!/usr/bin/env node

/**
 * 🛠 SPIRAL All-In-One Debug + Test Script
 * Tests: Products, Discover, Subscriptions APIs
 * Usage: node spiral-debug-test.js
 */

const BASE_URL = process.env.REPLIT_URL || 'http://localhost:5000';

console.log('🚀 SPIRAL Debug + Test Flow Starting...');
console.log(`📍 Testing against: ${BASE_URL}`);
console.log('=' .repeat(60));

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🧪 Testing ${description}:`);
    console.log(`📡 GET ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const status = response.status;
    
    console.log(`📊 Status: ${status} ${response.statusText}`);
    
    if (status === 200) {
      const data = await response.json();
      console.log(`✅ SUCCESS: ${description}`);
      console.log(`📦 Data count: ${Array.isArray(data) ? data.length : 'Object'}`);
      
      // Show sample data
      if (Array.isArray(data) && data.length > 0) {
        console.log(`🔍 Sample item:`, JSON.stringify(data[0], null, 2));
      } else if (typeof data === 'object') {
        console.log(`🔍 Response:`, JSON.stringify(data, null, 2));
      }
      
      return { success: true, data, status };
    } else {
      const text = await response.text();
      console.log(`❌ FAILED: ${description}`);
      console.log(`💬 Response: ${text}`);
      return { success: false, error: text, status };
    }
  } catch (error) {
    console.log(`💥 ERROR: ${description}`);
    console.log(`🚨 Details: ${error.message}`);
    return { success: false, error: error.message, status: 'network_error' };
  }
}

async function validateProductImages(products) {
  if (!Array.isArray(products) || products.length === 0) {
    console.log(`⚠️  No products to validate images`);
    return false;
  }
  
  console.log(`\n🖼️  PRODUCT IMAGES VALIDATION:`);
  let validImages = 0;
  
  products.slice(0, 3).forEach((product, idx) => {
    const hasImage = product.image || product.imageUrl || product.img;
    console.log(`   ${idx + 1}. "${product.name || product.id}": ${hasImage ? '✅ HAS IMAGE' : '❌ NO IMAGE'}`);
    if (hasImage) {
      console.log(`      🔗 ${hasImage}`);
      validImages++;
    }
  });
  
  const percentage = Math.round((validImages / Math.min(3, products.length)) * 100);
  console.log(`📈 Image Coverage: ${percentage}% (${validImages}/${Math.min(3, products.length)} checked)`);
  
  return percentage >= 80;
}

async function validateSubscriptionPlans(plans) {
  if (!Array.isArray(plans) || plans.length === 0) {
    console.log(`⚠️  No subscription plans found`);
    return false;
  }
  
  console.log(`\n💳 SUBSCRIPTION PLANS VALIDATION:`);
  let validPlans = 0;
  
  plans.forEach((plan, idx) => {
    const hasValidPriceId = plan.id && plan.id.startsWith('price_');
    console.log(`   ${idx + 1}. "${plan.name || 'Unnamed'}": ${hasValidPriceId ? '✅ VALID PRICE ID' : '❌ INVALID PRICE ID'}`);
    if (hasValidPriceId) {
      console.log(`      💰 ${plan.price || 'No price'} | ID: ${plan.id}`);
      validPlans++;
    } else {
      console.log(`      🚨 ID: ${plan.id} (should start with 'price_')`);
    }
  });
  
  const percentage = Math.round((validPlans / plans.length) * 100);
  console.log(`📈 Valid Plans: ${percentage}% (${validPlans}/${plans.length})`);
  
  return percentage >= 80;
}

async function runFullTest() {
  const results = {};
  
  // Test 1: Products API
  results.products = await testAPI('/api/products', '📦 Products API');
  if (!results.products.success) {
    // Try v2 endpoint
    results.products = await testAPI('/api/v2/products', '📦 Products API (v2)');
  }
  
  // Test 2: Discover API  
  results.discover = await testAPI('/api/discover', '🔍 Discover API');
  
  // Test 3: Subscription Plans API
  results.plans = await testAPI('/api/plans', '💳 Subscription Plans API');
  if (!results.plans.success) {
    // Try billing endpoint
    results.plans = await testAPI('/api/billing/plans', '💳 Subscription Plans API (billing)');
  }
  
  // Validation Tests
  console.log('\n' + '=' .repeat(60));
  console.log('🔬 VALIDATION TESTS');
  console.log('=' .repeat(60));
  
  let productImagesValid = false;
  let subscriptionPlansValid = false;
  
  if (results.products.success) {
    productImagesValid = await validateProductImages(results.products.data);
  }
  
  if (results.plans.success) {
    subscriptionPlansValid = await validateSubscriptionPlans(results.plans.data);
  }
  
  // Final Report
  console.log('\n' + '🏁 FINAL SPIRAL DEBUG REPORT');
  console.log('=' .repeat(60));
  
  const tests = [
    { name: '📦 Products API', success: results.products.success },
    { name: '🔍 Discover API', success: results.discover.success },
    { name: '💳 Plans API', success: results.plans.success },
    { name: '🖼️  Product Images', success: productImagesValid },
    { name: '💰 Valid Price IDs', success: subscriptionPlansValid }
  ];
  
  tests.forEach(test => {
    console.log(`${test.success ? '✅' : '❌'} ${test.name}: ${test.success ? 'PASS' : 'FAIL'}`);
  });
  
  const passCount = tests.filter(t => t.success).length;
  const percentage = Math.round((passCount / tests.length) * 100);
  
  console.log('\n📊 SPIRAL SYSTEM STATUS:');
  console.log(`🎯 Overall Score: ${percentage}% (${passCount}/${tests.length} tests passing)`);
  
  if (percentage === 100) {
    console.log('🎉 SPIRAL is 100% ready! All systems operational!');
  } else if (percentage >= 80) {
    console.log('🚀 SPIRAL is mostly ready! Minor fixes needed.');
  } else if (percentage >= 60) {
    console.log('⚠️  SPIRAL needs attention. Several issues to fix.');
  } else {
    console.log('🚨 SPIRAL needs significant work. Multiple systems down.');
  }
  
  console.log('\n💡 NEXT STEPS:');
  tests.filter(t => !t.success).forEach(test => {
    console.log(`   🔧 Fix: ${test.name}`);
  });
  
  console.log('\n' + '=' .repeat(60));
  console.log('🏁 SPIRAL Debug Test Complete');
}

// Run the test
runFullTest().catch(console.error);