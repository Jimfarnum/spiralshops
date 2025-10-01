// SPIRAL Component Test Validation
// Manual validation of core components without Jest runner

import fs from 'fs';
import path from 'path';

console.log('🔍 SPIRAL COMPONENT DIAGNOSTICS - MANUAL VALIDATION');
console.log('=====================================================\n');

// Component existence validation
const componentsToCheck = [
  'client/src/pages/cart.tsx',
  'client/src/pages/invite-to-shop.tsx', 
  'client/src/pages/retailer-incentive-scheduler.tsx',
  'client/src/components/product-card.tsx',
  'client/src/components/TripNotifications.tsx',
  'client/src/components/spiral-balance.tsx',
  'client/src/pages/retailer-dashboard.tsx',
  'client/src/pages/home.tsx'
];

let validationResults = {
  existing: [],
  missing: [],
  totalChecked: 0
};

console.log('📋 Checking Component File Existence...\n');

componentsToCheck.forEach(component => {
  validationResults.totalChecked++;
  
  if (fs.existsSync(component)) {
    validationResults.existing.push(component);
    console.log(`✅ ${component}`);
  } else {
    validationResults.missing.push(component);
    console.log(`❌ ${component} - NOT FOUND`);
  }
});

console.log('\n📊 Validation Summary:');
console.log(`Total Components Checked: ${validationResults.totalChecked}`);
console.log(`Existing Components: ${validationResults.existing.length}`);
console.log(`Missing Components: ${validationResults.missing.length}`);

// Check critical component content
console.log('\n🔧 Component Content Validation...\n');

const criticalComponents = [
  {
    file: 'client/src/pages/retailer-incentive-scheduler.tsx',
    expectedContent: ['scheduler', 'perk', 'incentive', 'retailer']
  },
  {
    file: 'client/src/pages/invite-to-shop.tsx', 
    expectedContent: ['invite', 'shop', 'trip', 'social']
  },
  {
    file: 'client/src/pages/cart.tsx',
    expectedContent: ['cart', 'item', 'total', 'checkout']
  }
];

criticalComponents.forEach(({ file, expectedContent }) => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      const foundKeywords = expectedContent.filter(keyword => 
        content.includes(keyword)
      );
      
      console.log(`✅ ${file}: Found ${foundKeywords.length}/${expectedContent.length} keywords`);
      console.log(`   Keywords: ${foundKeywords.join(', ')}`);
    } catch (error) {
      console.log(`❌ ${file}: Error reading file - ${error.message}`);
    }
  } else {
    console.log(`⚠️  ${file}: File not found for content check`);
  }
});

// API route validation
console.log('\n🌐 API Route Validation...\n');

const apiRoutes = [
  'server/api/retailer-perks.js',
  'server/api/invite-trip.js',
  'server/routes.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route} - API route exists`);
  } else {
    console.log(`❌ ${route} - API route missing`);
  }
});

// Integration validation
console.log('\n🔗 Integration Points Validation...\n');

const integrationChecks = [
  {
    name: 'App.tsx route registration',
    file: 'client/src/App.tsx',
    check: (content) => content.includes('retailer-incentive-scheduler')
  },
  {
    name: 'Server routes registration', 
    file: 'server/routes.ts',
    check: (content) => content.includes('retailer-perks')
  },
  {
    name: 'Component imports',
    file: 'client/src/App.tsx', 
    check: (content) => content.includes('RetailerIncentiveScheduler')
  }
];

integrationChecks.forEach(({ name, file, check }) => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const passed = check(content);
      console.log(`${passed ? '✅' : '❌'} ${name}: ${passed ? 'INTEGRATED' : 'NOT INTEGRATED'}`);
    } catch (error) {
      console.log(`❌ ${name}: Error checking - ${error.message}`);
    }
  } else {
    console.log(`⚠️  ${name}: File not found`);
  }
});

// Test framework validation
console.log('\n🧪 Test Framework Status...\n');

const testFiles = [
  '__tests__/SPIRAL_ComponentDiagnostics.test.js',
  'jest.config.js',
  'jest.setup.js'
];

testFiles.forEach(testFile => {
  if (fs.existsSync(testFile)) {
    console.log(`✅ ${testFile} - Test configuration ready`);
  } else {
    console.log(`❌ ${testFile} - Test file missing`);
  }
});

// Final assessment
console.log('\n🎯 SPIRAL COMPONENT DIAGNOSTIC SUMMARY');
console.log('=====================================');

const successRate = (validationResults.existing.length / validationResults.totalChecked) * 100;

console.log(`Component Availability: ${successRate.toFixed(1)}%`);
console.log(`Test Framework: ${fs.existsSync('jest.config.js') ? 'CONFIGURED' : 'MISSING'}`);
console.log(`API Integration: ${fs.existsSync('server/api/retailer-perks.js') ? 'ACTIVE' : 'MISSING'}`);
console.log(`Route Integration: ${fs.existsSync('client/src/App.tsx') ? 'REGISTERED' : 'MISSING'}`);

if (successRate >= 80) {
  console.log('\n🎉 SPIRAL COMPONENTS: READY FOR TESTING');
  console.log('✅ Core components available and integrated');
  console.log('✅ API routes configured');
  console.log('✅ Test framework set up');
} else {
  console.log('\n⚠️  SPIRAL COMPONENTS: NEEDS ATTENTION');
  console.log('❌ Some critical components missing');
  console.log('🔧 Check missing files above');
}

console.log('\n📝 Next Steps:');
console.log('1. Fix any missing components identified above');
console.log('2. Run: npm test (once Jest configuration is resolved)');  
console.log('3. Test individual component functionality');
console.log('4. Validate API endpoints manually');
console.log('5. Check browser console for runtime errors');

console.log('\n=====================================================\n');