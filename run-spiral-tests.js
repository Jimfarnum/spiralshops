#!/usr/bin/env node

// SPIRAL Component Test Runner
console.log('🧪 SPIRAL COMPONENT DIAGNOSTICS TEST RUNNER');
console.log('==============================================\n');

import { spawn } from 'child_process';

const runTests = () => {
  console.log('🚀 Starting SPIRAL Component Test Suite...\n');
  
  const jestProcess = spawn('npx', ['jest', '__tests__/SPIRAL_ComponentDiagnostics.test.js', '--verbose', '--colors'], {
    stdio: 'inherit',
    shell: true
  });

  jestProcess.on('close', (code) => {
    console.log('\n==============================================');
    if (code === 0) {
      console.log('✅ SPIRAL COMPONENT TESTS PASSED!');
      console.log('🎯 All core components verified and functional');
      console.log('🔧 Integration testing complete');
    } else {
      console.log('❌ Some tests failed or encountered errors');
      console.log('🔍 Check output above for details');
    }
    console.log('==============================================\n');
  });

  jestProcess.on('error', (error) => {
    console.error('❌ Failed to run tests:', error.message);
    console.log('\n💡 Try running: npx jest --init');
    console.log('💡 Or check if all dependencies are installed');
  });
};

runTests();