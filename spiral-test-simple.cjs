#!/usr/bin/env node

// SPIRAL Simple Endpoint Test - CommonJS (guaranteed to work in Replit)
const https = require('https');

const BASE_URL = 'https://27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev';

const ENDPOINTS = [
  // Core System Health
  { name: '🏥 Health Check', url: '/api/health' },
  { name: '⚡ Service Status', url: '/healthz' },
  
  // Key Business APIs
  { name: '🛒 Products API', url: '/api/products' },
  { name: '💳 Billing Plans', url: '/api/billing/plans' },
  { name: '🎯 SPIRALS Loyalty', url: '/api/spirals' },
  
  // AI & Enhanced APIs
  { name: '🤖 EJ AI Agent', url: '/api/ej' },
  { name: '🏪 Enhanced Malls', url: '/api/v2/malls' },
  { name: '🏢 Enhanced Retailers', url: '/api/v2/retailers' },
];

function testEndpoint(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, success: res.statusCode === 200 });
        } catch (e) {
          resolve({ status: res.statusCode, data: data.substring(0, 50), success: res.statusCode === 200 });
        }
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT', success: false });
    });
    
    req.on('error', () => {
      resolve({ status: 'ERROR', success: false });
    });
  });
}

async function runTests() {
  console.log('🚀 SPIRAL ENTERPRISE SYSTEM - QUICK ENDPOINT TEST');
  console.log('=' .repeat(50));
  console.log(`🌐 Testing: ${BASE_URL}\n`);
  
  let passed = 0;
  let total = 0;
  
  for (const endpoint of ENDPOINTS) {
    total++;
    process.stdout.write(`${endpoint.name.padEnd(25)} ... `);
    
    const result = await testEndpoint(`${BASE_URL}${endpoint.url}`);
    
    if (result.success) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log(`❌ FAIL (${result.status})`);
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📊 RESULTS: ${passed}/${total} endpoints working`);
  console.log(`🎯 SUCCESS RATE: ${Math.round((passed/total) * 100)}%`);
  
  if (passed === total) {
    console.log('🎉 ALL SYSTEMS OPERATIONAL! 🚀');
    console.log('✅ Your SPIRAL platform is ready for production!');
  } else if (passed >= total * 0.8) {
    console.log('🟡 MOSTLY OPERATIONAL - Minor issues detected');
  } else {
    console.log('🔴 SYSTEM NEEDS ATTENTION - Multiple failures detected');
  }
  
  console.log('=' .repeat(50));
}

runTests().catch(console.error);