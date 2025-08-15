// SPIRAL Admin Login Test with Credentials
const testAdminLogin = async () => {
  console.log("🔐 Testing SPIRAL Admin Login...");
  
  const credentials = {
    passphrase: 'Ashland8!',
    code: '',
    method: 'passphrase'
  };
  
  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log("✅ Admin login successful!");
      console.log(`   Access granted with passphrase: ${credentials.passphrase}`);
      console.log("   Admin dashboard is now accessible");
      
      // Test admin verification
      const verifyResponse = await fetch('http://localhost:5000/api/admin/verify', {
        credentials: 'include'
      });
      
      const verifyData = await verifyResponse.json();
      console.log("✅ Admin verification:", verifyData.isAdmin ? "Confirmed" : "Failed");
      
      return true;
    } else {
      console.log("❌ Admin login failed:");
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${data.message || 'Authentication failed'}`);
      return false;
    }
    
  } catch (error) {
    console.log("❌ Login error:", error.message);
    return false;
  }
};

// Test admin endpoints availability
const testAdminEndpoints = async () => {
  console.log("\n🔍 Testing admin endpoint availability...");
  
  const endpoints = [
    '/api/admin/login',
    '/api/admin/verify',
    '/api/admin/kpi',
    '/api/admin/agents'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`);
      console.log(`   ${endpoint}: ${response.status === 200 ? '✅ Available' : `⚠️ Status ${response.status}`}`);
    } catch (error) {
      console.log(`   ${endpoint}: ❌ Error`);
    }
  }
};

testAdminLogin().then(success => {
  if (success) {
    testAdminEndpoints();
    console.log("\n📱 To access admin on mobile:");
    console.log("   1. Navigate to Settings in mobile app");
    console.log("   2. Look for Admin Access option");
    console.log("   3. Or visit /spiral-admin-login on web browser");
    console.log("   4. Use passphrase: Ashland8!");
  }
});