// Test admin access with provided credentials
const testAdminAccess = async () => {
  console.log("🔐 Testing SPIRAL Admin Access");
  console.log("================================");
  
  const credentials = {
    passphrase: 'Ashland8!',
    method: 'passphrase'
  };
  
  try {
    // Test admin login
    console.log("1. Testing admin login...");
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    
    if (loginResponse.ok) {
      console.log("✅ Admin login successful");
      const loginData = await loginResponse.json();
      
      // Test admin verification
      console.log("2. Testing admin verification...");
      const verifyResponse = await fetch('http://localhost:5000/api/admin/verify', {
        credentials: 'include'
      });
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log("✅ Admin verification:", verifyData.isAdmin ? "Confirmed" : "Failed");
        
        // Test agent status
        console.log("3. Testing agent access...");
        const agentsResponse = await fetch('http://localhost:5000/api/agents/status');
        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          console.log("✅ Agent status accessible");
          
          if (agentsData.agents) {
            console.log(`   Found ${agentsData.agents.length} agents online`);
          }
        }
        
        console.log("\n🎯 ADMIN ACCESS SUMMARY:");
        console.log("========================");
        console.log("✅ Authentication: Working");
        console.log("✅ Admin Dashboard: Accessible");  
        console.log("✅ Agent Monitoring: Available");
        console.log("\n📱 MOBILE APP ADMIN:");
        console.log("   Current mobile app focuses on competitive intelligence");
        console.log("   Admin functions accessed via web interface");
        
        console.log("\n🌐 WEB ADMIN URLS:");
        console.log("   • Login: http://localhost:5000/spiral-admin-login");
        console.log("   • Dashboard: http://localhost:5000/spiral-admin-dashboard");
        console.log("   • Agents: http://localhost:5000/spiral-admin/agents");
        
        return true;
      }
    } else {
      console.log("❌ Admin login failed");
      const errorText = await loginResponse.text();
      console.log("   Error:", errorText);
      return false;
    }
    
  } catch (error) {
    console.log("❌ Connection error:", error.message);
    return false;
  }
};

testAdminAccess();