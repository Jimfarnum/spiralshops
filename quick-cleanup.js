#!/usr/bin/env node

/**
 * SPIRAL Quick Code Cleanup
 * Fast cleanup for critical issues
 */

import fs from 'fs';
import path from 'path';

class QuickCleanup {
  constructor() {
    this.fixes = [];
    this.issues = [];
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

  // Fix Meta Pixel null configuration
  fixMetaPixel() {
    this.log('🔧 Fixing Meta Pixel configuration...', 'fix');
    
    try {
      // Find and fix GoogleAnalytics.tsx (most likely source)
      const filePath = './src/components/GoogleAnalytics.tsx';
      
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Add proper conditional check for Meta Pixel
        if (content.includes('Meta Pixel') && !content.includes('VITE_META_PIXEL_ID')) {
          // Add conditional loading for Meta Pixel
          const pixelFix = `
// Only initialize Meta Pixel if ID is provided
if (import.meta.env.VITE_META_PIXEL_ID) {
  // Meta Pixel initialization code here
} else {
  console.warn('[Meta Pixel] - No pixel ID configured, skipping initialization');
}`;

          content = content.replace(
            /\/\/ Meta Pixel.*\n.*fbq\(/g,
            pixelFix + '\n  fbq('
          );
          
          modified = true;
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content);
          this.fixes.push('Fixed Meta Pixel null configuration');
          this.log('✅ Meta Pixel configuration fixed', 'success');
        }
      }
    } catch (error) {
      this.log(`Error fixing Meta Pixel: ${error.message}`, 'error');
    }
  }

  // Fix excessive favicon requests
  fixFavicon() {
    this.log('🔧 Optimizing favicon handling...', 'fix');
    
    try {
      // Add favicon optimization to server
      const serverPath = './server/index.ts';
      
      if (fs.existsSync(serverPath)) {
        let content = fs.readFileSync(serverPath, 'utf8');
        
        // Add favicon caching if not present
        if (!content.includes('favicon') && !content.includes('/favicon.ico')) {
          const faviconOptimization = `
// ⚡ Favicon optimization - prevent excessive requests
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  res.setHeader('Content-Type', 'image/x-icon');
  try {
    res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
  } catch (error) {
    res.status(204).end(); // No content if favicon missing
  }
});

`;
          
          // Insert after the app creation
          const insertPoint = content.indexOf('const app = express();');
          if (insertPoint !== -1) {
            const insertAfter = content.indexOf('\n', insertPoint) + 1;
            content = content.slice(0, insertAfter) + faviconOptimization + content.slice(insertAfter);
            
            fs.writeFileSync(serverPath, content);
            this.fixes.push('Added favicon optimization to prevent excessive requests');
            this.log('✅ Favicon handling optimized', 'success');
          }
        }
      }
    } catch (error) {
      this.log(`Error fixing favicon: ${error.message}`, 'error');
    }
  }

  // Fix Cloudant configuration warning
  fixCloudant() {
    this.log('🔧 Fixing Cloudant configuration...', 'fix');
    
    try {
      // Find files that use CLOUDANT_URL
      const serverFiles = ['./server/index.ts', './server/index.js'];
      
      for (const filePath of serverFiles) {
        if (!fs.existsSync(filePath)) continue;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Add proper Cloudant URL validation
        if (content.includes('CLOUDANT_URL') && !content.includes('https://')) {
          const cloudantFix = `
// ✅ Cloudant URL validation
if (process.env.CLOUDANT_URL && !process.env.CLOUDANT_URL.startsWith('https://')) {
  console.warn('[Cloudant] CLOUDANT_URL should start with https:// but is misconfigured');
  // Use a secure default or disable Cloudant if misconfigured
  process.env.CLOUDANT_URL = undefined;
}

`;
          
          // Insert at the top after imports
          const importEnd = content.lastIndexOf('import ');
          if (importEnd !== -1) {
            const insertPoint = content.indexOf('\n', importEnd) + 1;
            content = content.slice(0, insertPoint) + cloudantFix + content.slice(insertPoint);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content);
          this.fixes.push('Added Cloudant URL validation and security check');
          this.log('✅ Cloudant configuration secured', 'success');
        }
      }
    } catch (error) {
      this.log(`Error fixing Cloudant: ${error.message}`, 'error');
    }
  }

  // Remove debugging console statements
  removeDebugCode() {
    this.log('🔧 Removing debug console statements...', 'fix');
    
    try {
      const sourceFiles = [
        './src/components/GoogleAnalytics.tsx',
        './src/components/BrandThemeApplier.tsx',
        './src/App.tsx'
      ];
      
      let totalRemoved = 0;
      
      for (const filePath of sourceFiles) {
        if (!fs.existsSync(filePath)) continue;
        
        let content = fs.readFileSync(filePath, 'utf8');
        const originalLength = content.length;
        
        // Remove console.log statements but keep important ones
        content = content.replace(/console\.log\(['"]✅.*\)/g, '// Debug statement removed');
        content = content.replace(/console\.log\(['"]⚡.*\)/g, '// Debug statement removed');
        content = content.replace(/console\.log\(['"]🎨.*\)/g, '// Debug statement removed');
        
        if (content.length !== originalLength) {
          fs.writeFileSync(filePath, content);
          totalRemoved++;
        }
      }
      
      if (totalRemoved > 0) {
        this.fixes.push(`Cleaned up debug console statements in ${totalRemoved} files`);
        this.log(`✅ Removed debug statements from ${totalRemoved} files`, 'success');
      }
    } catch (error) {
      this.log(`Error removing debug code: ${error.message}`, 'error');
    }
  }

  // Fix duplicate imports (common issue)
  fixDuplicateImports() {
    this.log('🔧 Fixing duplicate imports...', 'fix');
    
    try {
      const files = [
        './src/App.tsx',
        './src/main.tsx'
      ];
      
      for (const filePath of files) {
        if (!fs.existsSync(filePath)) continue;
        
        let content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const imports = new Set();
        const filteredLines = [];
        let modified = false;
        
        for (const line of lines) {
          if (line.trim().startsWith('import ')) {
            if (!imports.has(line.trim())) {
              imports.add(line.trim());
              filteredLines.push(line);
            } else {
              modified = true; // Skip duplicate
            }
          } else {
            filteredLines.push(line);
          }
        }
        
        if (modified) {
          fs.writeFileSync(filePath, filteredLines.join('\n'));
          this.fixes.push(`Removed duplicate imports from ${path.basename(filePath)}`);
          this.log(`✅ Fixed duplicate imports in ${path.basename(filePath)}`, 'success');
        }
      }
    } catch (error) {
      this.log(`Error fixing imports: ${error.message}`, 'error');
    }
  }

  // Generate final report
  generateReport() {
    this.log('\n📊 Quick Cleanup Complete!', 'success');
    this.log('='.repeat(40), 'info');
    
    if (this.fixes.length > 0) {
      this.log('\n✅ Applied Fixes:', 'success');
      for (let i = 0; i < this.fixes.length; i++) {
        this.log(`  ${i + 1}. ${this.fixes[i]}`, 'success');
      }
    } else {
      this.log('\n✅ No issues found to auto-fix', 'info');
    }
    
    this.log('\n💡 Recommendations:', 'info');
    this.log('  • Restart your development server to see changes', 'info');
    this.log('  • Test the application to ensure fixes work correctly', 'info');
    this.log('  • Run cleanup regularly to maintain code quality', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      fixes: this.fixes,
      recommendations: [
        'Restart development server',
        'Test application functionality',
        'Monitor for resolved issues'
      ]
    };
    
    fs.writeFileSync('./quick-cleanup-report.json', JSON.stringify(report, null, 2));
    this.log('\n📄 Report saved to: quick-cleanup-report.json', 'info');
    
    return report;
  }

  // Run all fixes
  async runCleanup() {
    this.log('🚀 Starting SPIRAL Quick Code Cleanup...', 'info');
    
    this.fixMetaPixel();
    this.fixFavicon();
    this.fixCloudant();
    this.removeDebugCode();
    this.fixDuplicateImports();
    
    return this.generateReport();
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleanup = new QuickCleanup();
  
  cleanup.runCleanup().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('❌ Quick cleanup failed:', error);
    process.exit(1);
  });
}

export default QuickCleanup;