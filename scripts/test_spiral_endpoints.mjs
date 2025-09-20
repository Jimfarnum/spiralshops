#!/usr/bin/env node

const REPLIT_DOMAIN = 'https://27d4f357-044c-4271-84d2-b2bf67be7115-00-18jv7lspv4am.janeway.replit.dev';

const testEndpoints = [
  // GET endpoints
  { method: 'GET', url: '/api/retailers/onboarding/questions', description: 'Retailer onboarding questions' },
  { method: 'GET', url: '/api/agents', description: 'AI Agents registry' },
  { method: 'GET', url: '/api/discounts/tier?volume=5000000', description: 'Discount tier calculation' },
  { method: 'GET', url: '/api/partnerships/list', description: 'Partnerships list' },
  { method: 'GET', url: '/api/retailers/apps', description: 'Retailer applications' },
  { method: 'GET', url: '/api/malls/apps', description: 'Mall applications' },

  // POST endpoints with sample data
  {
    method: 'POST',
    url: '/api/shipping/quote',
    description: 'Shipping quote',
    body: {
      destinationZip: '10001',
      weightOz: 16,
      speed: 'standard',
      mode: 'outbound'
    }
  },
  {
    method: 'POST',
    url: '/api/discounts/apply',
    description: 'Apply discounts',
    body: {
      subtotal: 100,
      shippingBase: 15,
      annualVolumeUSD: 5000000,
      parcelsPerMonth: 1500
    }
  },
  {
    method: 'POST',
    url: '/api/orders',
    description: 'Create order',
    body: {
      retailerId: 'test-retailer',
      items: [{ id: 1, name: 'Test Product', price: 29.99, quantity: 2 }],
      subtotal: 59.98,
      shippingFee: 9.99,
      shippingAddress: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' },
      mode: 'outbound'
    }
  },
  {
    method: 'POST',
    url: '/api/agents/run',
    description: 'Run AI agent',
    body: {
      name: 'ShopperAssistant',
      params: { query: 'recommend products' }
    }
  }
];

async function testEndpoint(test) {
  try {
    const url = `${REPLIT_DOMAIN}${test.url}`;
    const options = {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (test.body) {
      options.body = JSON.stringify(test.body);
    }

    const response = await fetch(url, options);
    const responseTime = Date.now();

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${test.method} ${test.url.split('?')[0]}`);
      console.log(`   ${test.description} - ${response.status} OK`);
      return { success: true, test: test.description };
    } else {
      console.log(`❌ ${test.method} ${test.url.split('?')[0]}`);
      console.log(`   ${test.description} - ${response.status} ${response.statusText}`);
      return { success: false, test: test.description, error: `${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.log(`❌ ${test.method} ${test.url.split('?')[0]}`);
    console.log(`   ${test.description} - Error: ${error.message}`);
    return { success: false, test: test.description, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing SPIRAL Backend API Endpoints...\n');

  const results = [];
  
  for (const test of testEndpoints) {
    const result = await testEndpoint(test);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
  }

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n🎯 SPIRAL Backend API Test Summary: ${passed} passed, ${failed} failed, ${results.length} total.`);
  console.log(`📊 Success Rate: ${Math.round((passed / results.length) * 100)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.test}: ${r.error}`);
    });
  }

  if (passed === results.length) {
    console.log('\n🎉 All SPIRAL Backend API endpoints are working perfectly!');
  }
}

runTests().catch(console.error);