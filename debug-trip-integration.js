// Debug script to test trip integration
const baseUrl = 'http://localhost:5000';

async function debugIntegration() {
  console.log('🔍 Debugging Trip Integration\n');
  
  try {
    // Step 1: Create a trip
    console.log('1. Creating a test trip...');
    const createResponse = await fetch(`${baseUrl}/api/invite-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'debug_tester',
        cartItems: [
          { id: 1, name: 'Test Item 1', price: 29.99, quantity: 1 },
          { id: 2, name: 'Test Item 2', price: 49.99, quantity: 2 }
        ],
        tripName: 'Integration Test Trip',
        mallId: 'mall_1',
        storeId: 'store_1'
      })
    });
    
    const createResult = await createResponse.json();
    console.log('✅ Trip creation result:', JSON.stringify(createResult, null, 2));
    
    // Step 2: Wait and test retrieval
    console.log('\n2. Waiting 2 seconds then testing retrieval...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const retrieveResponse = await fetch(`${baseUrl}/api/trips-by-location?mallId=mall_1&storeId=store_1`);
    const retrieveText = await retrieveResponse.text();
    
    console.log('Raw response:', retrieveText.substring(0, 200));
    
    try {
      const retrieveResult = JSON.parse(retrieveText);
      console.log('✅ Retrieval result:', JSON.stringify(retrieveResult, null, 2));
    } catch (e) {
      console.log('❌ Failed to parse JSON response - likely HTML error page');
    }
    
    // Step 3: Test stats endpoint
    console.log('\n3. Testing trip stats...');
    const statsResponse = await fetch(`${baseUrl}/api/trip-stats?mallId=mall_1&storeId=store_1`);
    const statsText = await statsResponse.text();
    
    try {
      const statsResult = JSON.parse(statsText);
      console.log('✅ Stats result:', JSON.stringify(statsResult, null, 2));
    } catch (e) {
      console.log('❌ Failed to parse stats JSON - Response:', statsText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugIntegration();