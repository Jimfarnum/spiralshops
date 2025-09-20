// ✅ Test Stripe Connect API Integration
const BASE_URL = 'http://localhost:5000';

async function testStripeConnectAPI() {
  console.log('🧪 Testing SPIRAL Stripe Connect Integration...\n');

  // Test 1: Create Connect Account
  console.log('1️⃣ Creating Stripe Connect Account...');
  try {
    const response = await fetch(`${BASE_URL}/api/stripe/create-connect-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        retailerId: 'test_retailer_demo',
        email: 'demo@spiralshops.com',
        businessName: 'SPIRAL Demo Electronics',
        businessType: 'company'
      })
    });

    const result = await response.json();
    console.log('✅ Account Creation Result:', result);

    if (result.success && result.mock) {
      console.log('✅ Mock mode working correctly\n');
    } else {
      console.log('❌ Mock mode not working properly\n');
    }
  } catch (error) {
    console.error('❌ Account creation failed:', error.message);
  }

  // Test 2: Check Account Status
  console.log('2️⃣ Checking Account Status...');
  try {
    const response = await fetch(`${BASE_URL}/api/stripe/account-status/acct_mock_test_123`);
    const result = await response.json();
    console.log('✅ Account Status Result:', result);

    if (result.success && result.mock) {
      console.log('✅ Account status mock working correctly\n');
    } else {
      console.log('❌ Account status mock not working\n');
    }
  } catch (error) {
    console.error('❌ Account status check failed:', error.message);
  }

  // Test 3: Create Marketplace Payment
  console.log('3️⃣ Creating Marketplace Payment...');
  try {
    const response = await fetch(`${BASE_URL}/api/create-marketplace-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 129.99,
        connectedAccountId: 'acct_mock_retailer_test',
        applicationFeePercent: 3,
        metadata: { orderId: 'test_order_123', source: 'SPIRAL_demo' }
      })
    });

    const result = await response.json();
    console.log('✅ Marketplace Payment Result:', result);

    if (result.success && result.mock) {
      console.log(`✅ Fee calculation: $${result.applicationFee} platform fee, $${result.retailerAmount} to retailer\n`);
    } else {
      console.log('❌ Marketplace payment mock not working\n');
    }
  } catch (error) {
    console.error('❌ Marketplace payment failed:', error.message);
  }

  console.log('🎯 SPIRAL Stripe Connect Integration Test Complete!');
}

// Run the test
testStripeConnectAPI().catch(console.error);