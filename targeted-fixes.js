#!/usr/bin/env node

/**
 * SPIRAL Targeted Issue Fixes
 * Addresses specific identified issues without breaking functionality
 */

import fs from 'fs';
import path from 'path';

class TargetedFixes {
  constructor() {
    this.fixes = [];
    this.backups = new Map();
  }

  log(message, type = 'info') {
    const colors = {
      error: '\x1b[31m❌',
      warn: '\x1b[33m⚠️',
      info: '\x1b[36mℹ️',
      success: '\x1b[32m✅',
      fix: '\x1b[35m🔧'
    };
    
    console.log(`${colors[type] || ''} ${message}\x1b[0m`);
  }

  // Create backup before changes
  backup(filePath) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      this.backups.set(filePath, content);
      return true;
    }
    return false;
  }

  // Restore from backup if needed
  restore(filePath) {
    if (this.backups.has(filePath)) {
      fs.writeFileSync(filePath, this.backups.get(filePath));
      return true;
    }
    return false;
  }

  // Fix 1: Add favicon optimization to prevent excessive requests
  fixFaviconRequests() {
    this.log('🔧 Adding favicon optimization...', 'fix');
    
    const serverPath = './server/index.ts';
    
    if (!this.backup(serverPath)) {
      this.log('Could not backup server file', 'warn');
      return false;
    }

    try {
      let content = fs.readFileSync(serverPath, 'utf8');
      
      // Only add if not already present
      if (!content.includes('/favicon.ico')) {
        const faviconHandler = `
// 🚀 Favicon optimization - prevent excessive requests
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
  res.setHeader('Content-Type', 'image/x-icon');
  
  const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    res.status(204).end(); // No content
  }
});

`;
        // Insert before applySecurity to ensure it's handled early
        const insertPoint = content.indexOf('applySecurity(app);');
        if (insertPoint !== -1) {
          content = content.slice(0, insertPoint) + faviconHandler + content.slice(insertPoint);
          fs.writeFileSync(serverPath, content);
          this.fixes.push('Added favicon optimization to prevent excessive requests');
          this.log('✅ Favicon optimization added', 'success');
          return true;
        }
      } else {
        this.log('Favicon handler already exists', 'info');
        return true;
      }
    } catch (error) {
      this.log(`Error fixing favicon: ${error.message}`, 'error');
      this.restore(serverPath);
      return false;
    }
    
    return false;
  }

  // Fix 2: Add conditional Meta Pixel loading
  fixMetaPixel() {
    this.log('🔧 Fixing Meta Pixel configuration...', 'fix');
    
    const analyticsPath = './src/components/GoogleAnalytics.tsx';
    
    if (!fs.existsSync(analyticsPath)) {
      this.log('GoogleAnalytics.tsx not found', 'warn');
      return true; // Not critical
    }

    if (!this.backup(analyticsPath)) {
      this.log('Could not backup analytics file', 'warn');
      return false;
    }

    try {
      let content = fs.readFileSync(analyticsPath, 'utf8');
      
      // Add conditional loading for Meta Pixel
      if (content.includes('Meta Pixel') && !content.includes('VITE_META_PIXEL_ID')) {
        const pixelCheck = `
  // Only initialize Meta Pixel if ID is provided
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (metaPixelId) {`;

        const pixelEnd = `
  } else {
    console.warn('[Meta Pixel] - No pixel ID configured, skipping initialization');
  }`;

        // Wrap existing Meta Pixel code
        content = content.replace(
          /(\/\* Meta Pixel.*?\*\/)/s,
          pixelCheck + '\n    $1' + pixelEnd
        );

        fs.writeFileSync(analyticsPath, content);
        this.fixes.push('Added conditional Meta Pixel loading');
        this.log('✅ Meta Pixel configuration improved', 'success');
        return true;
      } else {
        this.log('Meta Pixel configuration already handled', 'info');
        return true;
      }
    } catch (error) {
      this.log(`Error fixing Meta Pixel: ${error.message}`, 'error');
      this.restore(analyticsPath);
      return false;
    }
  }

  // Fix 3: Add Cloudant URL validation
  fixCloudantConfig() {
    this.log('🔧 Adding Cloudant URL validation...', 'fix');
    
    const serverPath = './server/index.ts';
    
    try {
      let content = fs.readFileSync(serverPath, 'utf8');
      
      // Add validation after imports
      if (content.includes('CLOUDANT_URL') && !content.includes('Cloudant URL validation')) {
        const validation = `
// 🛡️ Cloudant URL validation
if (process.env.CLOUDANT_URL) {
  if (!process.env.CLOUDANT_URL.startsWith('https://')) {
    console.warn('[Cloudant] CLOUDANT_URL should start with https:// - using secure fallback');
    // Set to undefined to disable insecure connection
    process.env.CLOUDANT_URL = undefined;
  }
}

`;
        
        // Insert after the last import
        const lastImport = content.lastIndexOf('import ');
        const insertPoint = content.indexOf('\n', lastImport) + 1;
        content = content.slice(0, insertPoint) + validation + content.slice(insertPoint);
        
        fs.writeFileSync(serverPath, content);
        this.fixes.push('Added Cloudant URL security validation');
        this.log('✅ Cloudant configuration secured', 'success');
        return true;
      } else {
        this.log('Cloudant validation already handled', 'info');
        return true;
      }
    } catch (error) {
      this.log(`Error fixing Cloudant: ${error.message}`, 'error');
      return false;
    }
  }

  // Test that server can still compile
  async testCompilation() {
    this.log('🧪 Testing TypeScript compilation...', 'info');
    
    try {
      const { execSync } = await import('child_process');
      execSync('npx tsc --noEmit --project tsconfig.json', { 
        stdio: 'pipe',
        timeout: 15000
      });
      
      this.log('✅ TypeScript compilation successful', 'success');
      return true;
    } catch (error) {
      this.log('❌ TypeScript compilation failed', 'error');
      this.log('Rolling back all changes...', 'warn');
      
      // Restore all backups
      for (const [filePath] of this.backups) {
        this.restore(filePath);
      }
      
      return false;
    }
  }

  // Apply all targeted fixes
  async applyFixes() {
    this.log('🎯 Applying targeted fixes for identified issues...', 'info');
    
    let allSuccessful = true;
    
    // Apply fixes
    if (!this.fixFaviconRequests()) allSuccessful = false;
    if (!this.fixMetaPixel()) allSuccessful = false;
    if (!this.fixCloudantConfig()) allSuccessful = false;
    
    if (!allSuccessful) {
      this.log('Some fixes failed - restoring backups', 'error');
      for (const [filePath] of this.backups) {
        this.restore(filePath);
      }
      return false;
    }

    // Test compilation
    if (!(await this.testCompilation())) {
      return false;
    }

    // Generate report
    this.log('\n🎯 Targeted Fixes Applied Successfully!', 'success');
    this.log('='.repeat(50), 'info');
    
    for (let i = 0; i < this.fixes.length; i++) {
      this.log(`✅ ${i + 1}. ${this.fixes[i]}`, 'success');
    }
    
    this.log('\n💡 Next Steps:', 'info');
    this.log('• Restart the development server to apply changes', 'info');
    this.log('• Test functionality to ensure everything works', 'info');
    this.log('• Monitor logs for resolved issues', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      status: 'success',
      fixes: this.fixes,
      filesModified: Array.from(this.backups.keys()),
      nextSteps: [
        'Restart development server',
        'Test application functionality', 
        'Monitor resolved issues'
      ]
    };
    
    fs.writeFileSync('./targeted-fixes-report.json', JSON.stringify(report, null, 2));
    this.log('\n📄 Report saved to: targeted-fixes-report.json', 'info');
    
    return true;
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixes = new TargetedFixes();
  
  fixes.applyFixes().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Targeted fixes failed:', error);
    process.exit(1);
  });
}

export default TargetedFixes;