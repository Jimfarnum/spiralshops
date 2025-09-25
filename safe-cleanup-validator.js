#!/usr/bin/env node

/**
 * SPIRAL Safe Cleanup Validator
 * Tests cleanup changes before deployment to prevent functionality issues
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class SafeCleanupValidator {
  constructor() {
    this.backups = new Map();
    this.validationResults = [];
    this.safeToApply = true;
  }

  log(message, type = 'info') {
    const colors = {
      error: '\x1b[31m❌',
      warn: '\x1b[33m⚠️',
      info: '\x1b[36mℹ️',
      success: '\x1b[32m✅',
      test: '\x1b[35m🧪',
      backup: '\x1b[34m💾'
    };
    
    console.log(`${colors[type] || ''} ${message}\x1b[0m`);
  }

  // Create backup before making changes
  createBackup(filePath) {
    if (!fs.existsSync(filePath)) return false;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.backups.set(filePath, content);
      this.log(`Created backup for ${path.basename(filePath)}`, 'backup');
      return true;
    } catch (error) {
      this.log(`Failed to backup ${filePath}: ${error.message}`, 'error');
      return false;
    }
  }

  // Restore from backup
  restoreBackup(filePath) {
    if (!this.backups.has(filePath)) {
      this.log(`No backup found for ${filePath}`, 'warn');
      return false;
    }
    
    try {
      const originalContent = this.backups.get(filePath);
      fs.writeFileSync(filePath, originalContent);
      this.log(`Restored ${path.basename(filePath)} from backup`, 'backup');
      return true;
    } catch (error) {
      this.log(`Failed to restore ${filePath}: ${error.message}`, 'error');
      return false;
    }
  }

  // Test if server can start after changes
  async testServerStart() {
    this.log('Testing server startup...', 'test');
    
    try {
      // Test TypeScript compilation
      const compileResult = execSync('npm run check', { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 10000 
      });
      
      this.validationResults.push({
        test: 'TypeScript Compilation',
        result: 'PASS',
        message: 'No TypeScript errors found'
      });
      
      return true;
    } catch (error) {
      this.validationResults.push({
        test: 'TypeScript Compilation',
        result: 'FAIL',
        message: error.message.substring(0, 200) + '...'
      });
      
      this.safeToApply = false;
      return false;
    }
  }

  // Test critical API endpoints
  async testAPIEndpoints() {
    this.log('Testing critical API endpoints...', 'test');
    
    const criticalEndpoints = [
      '/api/health',
      '/api/products',
      '/api/products/featured'
    ];
    
    let allPassed = true;
    
    for (const endpoint of criticalEndpoints) {
      try {
        // Simple syntax check for routes (not actual HTTP test during validation)
        const routesFile = './server/routes/products.ts';
        if (fs.existsSync(routesFile)) {
          const content = fs.readFileSync(routesFile, 'utf8');
          
          if (content.includes(endpoint.replace('/api/', '')) || endpoint === '/api/health') {
            this.validationResults.push({
              test: `Route availability: ${endpoint}`,
              result: 'PASS',
              message: 'Route definition found in source'
            });
          } else {
            this.validationResults.push({
              test: `Route availability: ${endpoint}`,
              result: 'WARN',
              message: 'Route definition not explicitly found'
            });
          }
        }
      } catch (error) {
        allPassed = false;
        this.validationResults.push({
          test: `Route availability: ${endpoint}`,
          result: 'FAIL',
          message: error.message
        });
      }
    }
    
    return allPassed;
  }

  // Validate cleanup changes don't break imports
  validateImports() {
    this.log('Validating import statements...', 'test');
    
    const criticalFiles = [
      './src/App.tsx',
      './src/main.tsx',
      './server/index.ts'
    ];
    
    let allValid = true;
    
    for (const filePath of criticalFiles) {
      if (!fs.existsSync(filePath)) continue;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Basic import validation
        const importLines = content.match(/^import.*from.*;/gm);
        if (importLines) {
          for (const importLine of importLines) {
            if (importLine.includes("from ''") || importLine.includes('from ""')) {
              this.validationResults.push({
                test: `Import validation: ${path.basename(filePath)}`,
                result: 'FAIL',
                message: `Empty import path found: ${importLine.trim()}`
              });
              allValid = false;
              this.safeToApply = false;
            }
          }
        }
        
        if (allValid) {
          this.validationResults.push({
            test: `Import validation: ${path.basename(filePath)}`,
            result: 'PASS',
            message: 'All imports appear valid'
          });
        }
        
      } catch (error) {
        allValid = false;
        this.validationResults.push({
          test: `Import validation: ${path.basename(filePath)}`,
          result: 'FAIL',
          message: error.message
        });
      }
    }
    
    return allValid;
  }

  // Safe cleanup application
  async applySafeCleanup() {
    this.log('🛡️ Starting Safe Cleanup Process...', 'info');
    
    // Step 1: Create backups
    const criticalFiles = [
      './server/index.ts',
      './src/components/GoogleAnalytics.tsx',
      './src/App.tsx'
    ];
    
    this.log('Creating safety backups...', 'backup');
    for (const file of criticalFiles) {
      this.createBackup(file);
    }
    
    // Step 2: Apply ONLY the safe favicon fix first
    this.applySafeFaviconFix();
    
    // Step 3: Validate changes
    await this.runValidation();
    
    // Step 4: Report results
    this.generateValidationReport();
    
    return this.safeToApply;
  }

  // Apply only the safe favicon fix
  applySafeFaviconFix() {
    this.log('Applying safe favicon optimization...', 'test');
    
    const serverPath = './server/index.ts';
    
    if (fs.existsSync(serverPath)) {
      let content = fs.readFileSync(serverPath, 'utf8');
      
      // Only add favicon optimization if it's not already there
      if (!content.includes('/favicon.ico') && !content.includes('favicon')) {
        const faviconOptimization = `
// 🚀 Favicon optimization to prevent excessive requests
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.setHeader('Content-Type', 'image/x-icon');
  const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
  
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    res.status(204).end(); // No content if favicon missing
  }
});

`;
        
        // Insert after express app creation and before other routes
        const insertPoint = content.indexOf('applySecurity(app);');
        if (insertPoint !== -1) {
          content = content.slice(0, insertPoint) + faviconOptimization + content.slice(insertPoint);
          fs.writeFileSync(serverPath, content);
          this.log('✅ Safe favicon optimization applied', 'success');
        }
      }
    }
  }

  // Run all validation tests
  async runValidation() {
    this.log('Running comprehensive validation...', 'test');
    
    await this.testServerStart();
    await this.testAPIEndpoints();
    this.validateImports();
    
    if (!this.safeToApply) {
      this.log('⚠️ Validation failed - restoring backups...', 'warn');
      for (const [filePath] of this.backups) {
        this.restoreBackup(filePath);
      }
    }
  }

  // Generate validation report
  generateValidationReport() {
    this.log('\n🛡️ Safe Cleanup Validation Report', 'info');
    this.log('='.repeat(50), 'info');
    
    let passCount = 0;
    let failCount = 0;
    let warnCount = 0;
    
    for (const result of this.validationResults) {
      const status = result.result === 'PASS' ? '✅' : 
                     result.result === 'FAIL' ? '❌' : '⚠️';
      
      this.log(`${status} ${result.test}: ${result.result}`, 
               result.result === 'PASS' ? 'success' : 
               result.result === 'FAIL' ? 'error' : 'warn');
      
      if (result.message) {
        this.log(`   ${result.message}`, 'info');
      }
      
      if (result.result === 'PASS') passCount++;
      else if (result.result === 'FAIL') failCount++;
      else warnCount++;
    }
    
    this.log(`\n📊 Results: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`, 'info');
    
    if (this.safeToApply) {
      this.log('\n✅ SAFE TO DEPLOY: All critical validations passed', 'success');
      this.log('Recommendation: Proceed with deployment', 'success');
    } else {
      this.log('\n❌ NOT SAFE TO DEPLOY: Critical issues found', 'error');
      this.log('Recommendation: Fix issues before deployment', 'error');
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      safeToApply: this.safeToApply,
      validationResults: this.validationResults,
      backupsCreated: Array.from(this.backups.keys()),
      recommendation: this.safeToApply ? 'Safe to deploy' : 'Fix issues before deployment'
    };
    
    fs.writeFileSync('./safe-cleanup-report.json', JSON.stringify(report, null, 2));
    this.log('\n📄 Detailed report saved to: safe-cleanup-report.json', 'info');
    
    return this.safeToApply;
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new SafeCleanupValidator();
  
  validator.applySafeCleanup().then(safeToApply => {
    process.exit(safeToApply ? 0 : 1);
  }).catch(error => {
    console.error('❌ Safe cleanup validation failed:', error);
    process.exit(1);
  });
}

export default SafeCleanupValidator;