#!/usr/bin/env node

/**
 * SPIRAL Deployment Health Check
 * Verifies the server started correctly for Replit deployment
 */

import fetch from 'node-fetch';

const PORT = process.env.PORT || 5000;
const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // 2 seconds

async function checkHealth() {
  console.log('🏥 SPIRAL Health Check Starting...');
  console.log(`📍 Checking server at http://localhost:${PORT}`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔍 Attempt ${attempt}/${MAX_RETRIES}...`);
      
      const response = await fetch(`http://localhost:${PORT}/api/check`, {
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Health Check PASSED!');
        console.log(`📊 Server Status: ${data.status}`);
        console.log(`💬 Message: ${data.message}`);
        console.log(`🕐 Timestamp: ${data.timestamp}`);
        console.log(`📦 Version: ${data.version}`);
        
        if (data.services) {
          console.log('🔧 Services:');
          Object.entries(data.services).forEach(([service, status]) => {
            console.log(`   ${status === 'connected' || status === 'active' || status === 'configured' ? '✅' : '❌'} ${service}: ${status}`);
          });
        }
        
        console.log('🚀 SPIRAL platform is deployment-ready!');
        process.exit(0);
      } else {
        console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
    }
    
    if (attempt < MAX_RETRIES) {
      console.log(`⏳ Waiting ${RETRY_DELAY/1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  console.error('🚨 Health Check FAILED!');
  console.error(`❌ Server did not respond after ${MAX_RETRIES} attempts`);
  process.exit(1);
}

checkHealth().catch(error => {
  console.error('🚨 Health Check Error:', error.message);
  process.exit(1);
});