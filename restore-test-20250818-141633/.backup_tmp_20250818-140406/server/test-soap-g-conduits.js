#!/usr/bin/env node
// SPIRAL Admin KPI Test Suite - SOAP G Information Conduit Verification
// Tests reliable information flow between all agents, features, and functions

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
const SOAP_G_URL = `${BASE_URL}/soap-g`;

// Test configuration
const TEST_SUITE = {
  name: "SPIRAL Admin KPI Information Conduit Test",
  version: "1.0.0",
  timestamp: new Date().toISOString(),
  agents: [
    'mallManager',
    'retailer', 
    'shopperEngagement',
    'socialMedia',
    'marketingPartnerships',
    'admin'
  ]
};

// Test Results Storage
let testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  details: [],
  kpiResults: {},
  conduitStatus: {}
};

// Utility Functions
function logTest(testName, status, details = '') {
  testResults.totalTests++;
  if (status === 'PASS') {
    testResults.passedTests++;
    console.log(`✅ ${testName}: ${details}`);
  } else {
    testResults.failedTests++;
    console.log(`❌ ${testName}: ${details}`);
  }
  testResults.details.push({ testName, status, details, timestamp: new Date().toISOString() });
}

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

// Test 1: SOAP G System Health & Agent Registration
async function testSystemHealth() {
  try {
    const status = await makeRequest('/soap-g/status');
    
    if (status.success && status.systemHealthy) {
      logTest('SOAP G System Health', 'PASS', `System operational with ${status.agents.length} agents`);
    } else {
      logTest('SOAP G System Health', 'FAIL', `System unhealthy: ${status.alerts?.join(', ')}`);
    }
    
    // Verify all 6 agents are registered
    const expectedAgents = TEST_SUITE.agents;
    const registeredAgents = status.agents || [];
    const allAgentsPresent = expectedAgents.every(agent => registeredAgents.includes(agent));
    
    if (allAgentsPresent) {
      logTest('Agent Registration', 'PASS', `All 6 agents registered: ${registeredAgents.join(', ')}`);
    } else {
      const missing = expectedAgents.filter(agent => !registeredAgents.includes(agent));
      logTest('Agent Registration', 'FAIL', `Missing agents: ${missing.join(', ')}`);
    }
    
    testResults.kpiResults.systemHealth = status.systemHealthy;
    testResults.kpiResults.agentCount = registeredAgents.length;
    testResults.kpiResults.performance = status.performance;
    
  } catch (error) {
    logTest('SOAP G System Health', 'FAIL', error.message);
  }
}

// Test 2: Individual Agent Communication Conduits
async function testIndividualAgentConduits() {
  const agentEndpoints = [
    { name: 'mallManager', endpoint: '/soap-g/mall-manager', task: 'Analyze tenant performance and occupancy rates' },
    { name: 'retailer', endpoint: '/soap-g/retailer', task: 'Optimize inventory levels and pricing strategy' },
    { name: 'shopperEngagement', endpoint: '/soap-g/shopper-engagement', task: 'Generate personalized shopping recommendations' },
    { name: 'socialMedia', endpoint: '/soap-g/social-media', task: 'Create viral marketing campaign for local stores' },
    { name: 'marketingPartnerships', endpoint: '/soap-g/marketing-partnerships', task: 'Identify strategic partnership opportunities' },
    { name: 'admin', endpoint: '/soap-g/admin', task: 'Generate comprehensive platform KPI report' }
  ];
  
  for (const agent of agentEndpoints) {
    try {
      const result = await makeRequest(agent.endpoint, {
        method: 'POST',
        body: { task: agent.task, priority: 'high' }
      });
      
      if (result.success && result.taskId) {
        logTest(`${agent.name} Conduit`, 'PASS', `Task assigned: ${result.taskId}`);
        testResults.conduitStatus[agent.name] = 'operational';
      } else {
        logTest(`${agent.name} Conduit`, 'FAIL', 'Task assignment failed');
        testResults.conduitStatus[agent.name] = 'failed';
      }
      
    } catch (error) {
      logTest(`${agent.name} Conduit`, 'FAIL', error.message);
      testResults.conduitStatus[agent.name] = 'error';
    }
  }
}

// Test 3: Multi-Agent Coordination Conduit
async function testMultiAgentCoordination() {
  try {
    // Test complex multi-agent coordination
    const complexTask = {
      task: "Launch comprehensive holiday marketing campaign with mall optimization",
      agents: ['mallManager', 'socialMedia', 'marketingPartnerships', 'retailer'],
      priority: 'high'
    };
    
    const result = await makeRequest('/soap-g/coordinate', {
      method: 'POST',
      body: complexTask
    });
    
    if (result.success && result.result && result.result.coordinationId) {
      logTest('Multi-Agent Coordination', 'PASS', 
        `Coordination ID: ${result.result.coordinationId}, Agents: ${result.result.involvedAgents.length}`);
      testResults.kpiResults.multiAgentCoordination = true;
    } else {
      logTest('Multi-Agent Coordination', 'FAIL', 'Coordination request failed');
      testResults.kpiResults.multiAgentCoordination = false;
    }
    
  } catch (error) {
    logTest('Multi-Agent Coordination', 'FAIL', error.message);
    testResults.kpiResults.multiAgentCoordination = false;
  }
}

// Test 4: Core Platform API Integration
async function testCorePlatformIntegration() {
  const coreEndpoints = [
    { name: 'Products API', endpoint: '/products' },
    { name: 'Stores API', endpoint: '/stores' },
    { name: 'Mall Events API', endpoint: '/mall-events' },
    { name: 'Promotions API', endpoint: '/promotions' },
    { name: 'Location Search', endpoint: '/location-search-continental-us' },
    { name: 'AI Recommendations', endpoint: '/recommend' }
  ];
  
  for (const api of coreEndpoints) {
    try {
      const result = await makeRequest(api.endpoint);
      
      if (result && (result.success !== false)) {
        logTest(`${api.name} Integration`, 'PASS', 'API responsive and returning data');
        testResults.kpiResults[api.name.toLowerCase().replace(/\s/g, '')] = true;
      } else {
        logTest(`${api.name} Integration`, 'FAIL', 'API not returning expected data');
        testResults.kpiResults[api.name.toLowerCase().replace(/\s/g, '')] = false;
      }
      
    } catch (error) {
      logTest(`${api.name} Integration`, 'FAIL', error.message);
      testResults.kpiResults[api.name.toLowerCase().replace(/\s/g, '')] = false;
    }
  }
}

// Test 5: Admin KPI Data Collection
async function testAdminKPICollection() {
  try {
    // Test comprehensive admin data collection
    const adminTask = {
      agentName: 'admin',
      task: 'Collect comprehensive KPI report including system health, agent performance, user engagement, and revenue metrics',
      priority: 'high'
    };
    
    const result = await makeRequest('/soap-g/assign', {
      method: 'POST',
      body: adminTask
    });
    
    if (result.success && result.taskId) {
      logTest('Admin KPI Collection', 'PASS', `KPI collection task assigned: ${result.taskId}`);
      testResults.kpiResults.adminKPICollection = true;
    } else {
      logTest('Admin KPI Collection', 'FAIL', 'KPI collection task failed');
      testResults.kpiResults.adminKPICollection = false;
    }
    
    // Test heartbeat registration for admin monitoring
    const heartbeatResult = await makeRequest('/soap-g/heartbeat', {
      method: 'POST',
      body: {
        agentName: 'admin',
        stats: {
          status: 'active',
          pendingTasks: 3,
          completedTasks: 157,
          errorRate: 0.02,
          averageResponseTime: 1200
        }
      }
    });
    
    if (heartbeatResult.success) {
      logTest('Admin Heartbeat Registration', 'PASS', 'Admin monitoring heartbeat successful');
    } else {
      logTest('Admin Heartbeat Registration', 'FAIL', 'Heartbeat registration failed');
    }
    
  } catch (error) {
    logTest('Admin KPI Collection', 'FAIL', error.message);
    testResults.kpiResults.adminKPICollection = false;
  }
}

// Test 6: Information Flow Reliability Test
async function testInformationFlowReliability() {
  try {
    // Simulate high load with rapid sequential requests
    const rapidTests = [];
    for (let i = 0; i < 10; i++) {
      rapidTests.push(
        makeRequest('/soap-g/status').catch(err => ({ error: err.message }))
      );
    }
    
    const results = await Promise.all(rapidTests);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => r.error).length;
    
    if (successful >= 8) { // 80% success rate threshold
      logTest('Information Flow Reliability', 'PASS', 
        `${successful}/10 requests successful (${(successful/10*100).toFixed(1)}% success rate)`);
      testResults.kpiResults.reliabilityScore = successful / 10;
    } else {
      logTest('Information Flow Reliability', 'FAIL', 
        `Only ${successful}/10 requests successful (${failed} failures)`);
      testResults.kpiResults.reliabilityScore = successful / 10;
    }
    
  } catch (error) {
    logTest('Information Flow Reliability', 'FAIL', error.message);
    testResults.kpiResults.reliabilityScore = 0;
  }
}

// Main Test Execution
async function runFullTestSuite() {
  console.log('🧪 Starting SPIRAL Admin KPI Information Conduit Test Suite');
  console.log(`📋 Testing ${TEST_SUITE.agents.length} agents across ${TEST_SUITE.name}`);
  console.log('=' * 80);
  
  await testSystemHealth();
  await testIndividualAgentConduits();
  await testMultiAgentCoordination();
  await testCorePlatformIntegration();
  await testAdminKPICollection();
  await testInformationFlowReliability();
  
  // Generate Final Report
  console.log('\n' + '=' * 80);
  console.log('📊 FINAL TEST RESULTS');
  console.log('=' * 80);
  console.log(`✅ Total Tests: ${testResults.totalTests}`);
  console.log(`✅ Passed: ${testResults.passedTests}`);
  console.log(`❌ Failed: ${testResults.failedTests}`);
  console.log(`📈 Success Rate: ${(testResults.passedTests / testResults.totalTests * 100).toFixed(1)}%`);
  
  console.log('\n📋 AGENT CONDUIT STATUS:');
  Object.entries(testResults.conduitStatus).forEach(([agent, status]) => {
    const icon = status === 'operational' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${agent}: ${status.toUpperCase()}`);
  });
  
  console.log('\n📊 KEY PERFORMANCE INDICATORS:');
  Object.entries(testResults.kpiResults).forEach(([kpi, value]) => {
    const icon = typeof value === 'boolean' ? (value ? '✅' : '❌') : '📊';
    console.log(`${icon} ${kpi}: ${value}`);
  });
  
  const overallHealth = testResults.passedTests / testResults.totalTests >= 0.8 ? 'HEALTHY' : 'NEEDS_ATTENTION';
  console.log(`\n🎯 OVERALL SYSTEM HEALTH: ${overallHealth}`);
  
  // Save detailed results to file
  const detailedResults = {
    ...TEST_SUITE,
    results: testResults,
    conclusion: overallHealth,
    recommendations: generateRecommendations()
  };
  
  console.log('\n💾 Saving detailed results to spiral_admin_kpi_test_results.json');
  return detailedResults;
}

function generateRecommendations() {
  const recommendations = [];
  
  if (testResults.kpiResults.reliabilityScore < 0.9) {
    recommendations.push("Consider implementing request retry logic for improved reliability");
  }
  
  if (testResults.failedTests > 0) {
    recommendations.push("Review and fix failed test cases for optimal performance");
  }
  
  if (testResults.kpiResults.multiAgentCoordination === false) {
    recommendations.push("Multi-agent coordination needs debugging for complex workflows");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("All systems operational - ready for production deployment");
  }
  
  return recommendations;
}

// Export for module usage or run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullTestSuite()
    .then(results => {
      require('fs').writeFileSync(
        'spiral_admin_kpi_test_results.json', 
        JSON.stringify(results, null, 2)
      );
      console.log('\n🎉 Test suite completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

export { runFullTestSuite, testResults };