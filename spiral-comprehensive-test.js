#!/usr/bin/env node

// SPIRAL All-In-One Debug + Test Script
// Tests: Product Pictures, Discover Tab, Subscriptions Tab, Stripe Config

const REPLIT_URL = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
  : 'http://localhost:5000';

console.log('🚀 SPIRAL Comprehensive Test Starting...');
console.log(`📡 Testing: ${REPLIT_URL}\n`);

async function testEndpoint(name, endpoint, expectedFields = []) {
  try {
    console.log(`🧪 Testing: ${name}`);
    console.log(`📡 URL: ${endpoint}`);
    
    const response = await fetch(`${REPLIT_URL}${endpoint}`);
    const status = response.status;
    
    if (status === 200) {
      const data = await response.json();
      console.log(`✅ ${name}: ${status} (${JSON.stringify(data).length} bytes)`);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`📊 Sample: ${JSON.stringify(data[0], null, 2)}`);
        
        // Check required fields
        expectedFields.forEach(field => {
          if (data[0][field]) {
            console.log(`  ✅ Has ${field}: ${data[0][field]}`);
          } else {
            console.log(`  ❌ Missing ${field}`);
          }
        });
      } else if (Array.isArray(data)) {
        console.log(`⚠️  Empty array returned`);
      } else {
        console.log(`📄 Data: ${JSON.stringify(data, null, 2)}`);
      }
    } else {
      console.log(`❌ ${name}: ${status} - ENDPOINT MISSING`);
    }
    
    console.log('─'.repeat(50));
    return { name, status, working: status === 200 };
    
  } catch (error) {
    console.log(`💥 ${name}: ERROR - ${error.message}`);
    console.log('─'.repeat(50));
    return { name, status: 'ERROR', working: false, error: error.message };
  }
}

async function runAllTests() {
  const results = [];
  
  // 1️⃣ Product Pictures Test
  results.push(await testEndpoint(
    'Product Pictures', 
    '/api/products', 
    ['id', 'name', 'price', 'image']
  ));
  
  // 2️⃣ Discover Tab Test  
  results.push(await testEndpoint(
    'Discover Tab', 
    '/api/discover', 
    ['id', 'name', 'image']
  ));
  
  // 3️⃣ Subscriptions Tab Test
  results.push(await testEndpoint(
    'Subscription Plans', 
    '/api/plans', 
    ['id', 'name', 'price']
  ));
  
  // Alternative billing endpoint
  results.push(await testEndpoint(
    'Billing Plans', 
    '/api/billing/plans', 
    ['id', 'name', 'price']
  ));
  
  // 4️⃣ Stripe Configuration Test
  console.log('🔐 Stripe Configuration Test:');
  console.log(`STRIPE_PRICE_SILVER: ${process.env.STRIPE_PRICE_SILVER ? 'SET ✅' : 'MISSING ❌'}`);
  console.log(`STRIPE_PRICE_GOLD: ${process.env.STRIPE_PRICE_GOLD ? 'SET ✅' : 'MISSING ❌'}`);
  console.log(`STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? 'SET ✅' : 'MISSING ❌'}`);
  
  if (process.env.STRIPE_PRICE_SILVER) {
    const silverFormat = process.env.STRIPE_PRICE_SILVER.startsWith('price_');
    console.log(`Silver Format: ${silverFormat ? '✅ price_xxx' : '❌ Wrong format'}`);
  }
  if (process.env.STRIPE_PRICE_GOLD) {
    const goldFormat = process.env.STRIPE_PRICE_GOLD.startsWith('price_');
    console.log(`Gold Format: ${goldFormat ? '✅ price_xxx' : '❌ Wrong format'}`);
  }
  
  console.log('─'.repeat(50));
  
  // 📊 Final Summary
  console.log('📊 SPIRAL TEST SUMMARY:');
  const working = results.filter(r => r.working).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.working ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status}`);
  });
  
  console.log(`\n🎯 Score: ${working}/${total} endpoints working`);
  
  if (working === total) {
    console.log('🎉 SPIRAL is 100% operational!');
  } else {
    console.log('🔧 Issues found - need to fix missing endpoints');
  }
}

// Run the comprehensive test
runAllTests().catch(console.error);