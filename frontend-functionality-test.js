#!/usr/bin/env node

// Frontend Route and Component Functionality Test
// Validates all frontend routes and components are properly configured

const fs = require('fs');
const path = require('path');

class FrontendTester {
  constructor() {
    this.results = {
      routes: { total: 0, valid: 0, invalid: 0 },
      components: { total: 0, valid: 0, invalid: 0 },
      imports: { total: 0, valid: 0, invalid: 0 }
    };
    this.issues = [];
  }

  // Check if App.tsx routes are properly configured
  checkRoutes() {
    console.log('🔍 Checking Frontend Routes...');
    
    try {
      const appContent = fs.readFileSync('./client/src/App.tsx', 'utf8');
      
      // Extract all routes
      const routeMatches = appContent.match(/<Route[^>]*path="([^"]*)"[^>]*component=\{([^}]*)\}/g) || [];
      
      this.results.routes.total = routeMatches.length;
      
      routeMatches.forEach(route => {
        const pathMatch = route.match(/path="([^"]*)"/);
        const componentMatch = route.match(/component=\{([^}]*)\}/);
        
        if (pathMatch && componentMatch) {
          const path = pathMatch[1];
          const component = componentMatch[1];
          
          // Check if component is imported
          const importRegex = new RegExp(`import\\s+${component}\\s+from`, 'g');
          if (appContent.match(importRegex)) {
            this.results.routes.valid++;
            console.log(`✅ Route: ${path} -> ${component}`);
          } else {
            this.results.routes.invalid++;
            this.issues.push(`Missing import for component: ${component} (route: ${path})`);
            console.log(`❌ Route: ${path} -> ${component} (missing import)`);
          }
        }
      });
    } catch (error) {
      this.issues.push(`Failed to read App.tsx: ${error.message}`);
    }
  }

  // Check component files exist
  checkComponents() {
    console.log('\n🔍 Checking Component Files...');
    
    const pagesDir = './client/src/pages';
    const componentsDir = './client/src/components';
    
    try {
      // Check pages directory
      const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.tsx'));
      this.results.components.total += pageFiles.length;
      
      pageFiles.forEach(file => {
        const filePath = path.join(pagesDir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Basic validation - check for export default
          if (content.includes('export default')) {
            this.results.components.valid++;
            console.log(`✅ Page: ${file}`);
          } else {
            this.results.components.invalid++;
            this.issues.push(`Page ${file} missing export default`);
            console.log(`❌ Page: ${file} (missing export default)`);
          }
        } catch (error) {
          this.results.components.invalid++;
          this.issues.push(`Cannot read page ${file}: ${error.message}`);
          console.log(`❌ Page: ${file} (read error)`);
        }
      });
      
      // Check key component files
      const keyComponents = [
        'header.tsx',
        'mobile-optimized-header.tsx',
        'spiral-balance.tsx',
        'mobile-nav.tsx'
      ];
      
      keyComponents.forEach(file => {
        const filePath = path.join(componentsDir, file);
        this.results.components.total++;
        
        if (fs.existsSync(filePath)) {
          this.results.components.valid++;
          console.log(`✅ Component: ${file}`);
        } else {
          this.results.components.invalid++;
          this.issues.push(`Missing key component: ${file}`);
          console.log(`❌ Component: ${file} (missing)`);
        }
      });
      
    } catch (error) {
      this.issues.push(`Failed to check components: ${error.message}`);
    }
  }

  // Check critical imports and dependencies
  checkImports() {
    console.log('\n🔍 Checking Critical Imports...');
    
    const criticalFiles = [
      './client/src/lib/cartStore.ts',
      './client/src/lib/authStore.ts', 
      './client/src/lib/loyaltyStore.ts',
      './shared/schema.ts'
    ];
    
    criticalFiles.forEach(file => {
      this.results.imports.total++;
      
      if (fs.existsSync(file)) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Basic validation based on file type
          let isValid = false;
          
          if (file.includes('Store.ts')) {
            isValid = content.includes('create') && content.includes('export');
          } else if (file.includes('schema.ts')) {
            isValid = content.includes('export') && content.includes('table');
          }
          
          if (isValid) {
            this.results.imports.valid++;
            console.log(`✅ Import: ${file}`);
          } else {
            this.results.imports.invalid++;
            this.issues.push(`Invalid content in ${file}`);
            console.log(`❌ Import: ${file} (invalid content)`);
          }
        } catch (error) {
          this.results.imports.invalid++;
          this.issues.push(`Cannot read ${file}: ${error.message}`);
          console.log(`❌ Import: ${file} (read error)`);
        }
      } else {
        this.results.imports.invalid++;
        this.issues.push(`Missing critical file: ${file}`);
        console.log(`❌ Import: ${file} (missing)`);
      }
    });
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n📊 Frontend Functionality Test Results\n');
    
    console.log('Routes:');
    console.log(`  Total: ${this.results.routes.total}`);
    console.log(`  Valid: ${this.results.routes.valid}`);
    console.log(`  Invalid: ${this.results.routes.invalid}`);
    
    console.log('\nComponents:');
    console.log(`  Total: ${this.results.components.total}`);
    console.log(`  Valid: ${this.results.components.valid}`);
    console.log(`  Invalid: ${this.results.components.invalid}`);
    
    console.log('\nImports:');
    console.log(`  Total: ${this.results.imports.total}`);
    console.log(`  Valid: ${this.results.imports.valid}`);
    console.log(`  Invalid: ${this.results.imports.invalid}`);
    
    const totalTests = this.results.routes.total + this.results.components.total + this.results.imports.total;
    const totalValid = this.results.routes.valid + this.results.components.valid + this.results.imports.valid;
    const successRate = totalTests > 0 ? ((totalValid / totalTests) * 100).toFixed(1) : 0;
    
    console.log(`\nOverall Success Rate: ${successRate}%\n`);
    
    if (this.issues.length > 0) {
      console.log('❌ Issues Found:');
      this.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        totalValid,
        successRate: parseFloat(successRate)
      },
      details: this.results,
      issues: this.issues
    };
    
    fs.writeFileSync('frontend-test-results.json', JSON.stringify(report, null, 2));
    console.log('\n📁 Frontend test results saved to frontend-test-results.json');
    
    if (this.issues.length === 0) {
      console.log('\n🎉 All Frontend Components are Functional!');
    } else {
      console.log('\n⚠️  Frontend issues found - Review and fix above');
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Frontend Functionality Test\n');
    
    this.checkRoutes();
    this.checkComponents();
    this.checkImports();
    this.generateReport();
  }
}

// Run the frontend test
const tester = new FrontendTester();
tester.runAllTests().catch(console.error);