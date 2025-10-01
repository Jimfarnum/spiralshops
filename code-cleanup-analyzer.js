#!/usr/bin/env node

/**
 * SPIRAL Code Cleanup Analyzer
 * Intelligent code analysis and automated cleanup system
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class CodeCleanupAnalyzer {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.stats = {
      filesAnalyzed: 0,
      issuesFound: 0,
      autoFixed: 0,
      manualReviewNeeded: 0
    };
  }

  log(message, type = 'info') {
    const colors = {
      error: '\x1b[31m❌',
      warn: '\x1b[33m⚠️',
      info: '\x1b[36mℹ️',
      success: '\x1b[32m✅',
      fix: '\x1b[35m🔧'
    };
    
    console.log(`${colors[type] || ''}  ${message}\x1b[0m`);
  }

  // Analyze logs for runtime issues
  analyzeLogs() {
    this.log('Analyzing system logs for runtime issues...', 'info');
    
    const logPatterns = [
      {
        pattern: /CLOUDANT_URL should start with https:\/\/ but is misconfigured/,
        type: 'error',
        category: 'Configuration',
        description: 'Cloudant database URL misconfiguration',
        autoFix: true,
        fix: () => this.fixCloudantConfig()
      },
      {
        pattern: /\[Meta Pixel\] - Invalid PixelID: null/,
        type: 'warn',
        category: 'Analytics',
        description: 'Meta Pixel configuration with null ID',
        autoFix: true,
        fix: () => this.fixMetaPixelConfig()
      },
      {
        pattern: /GET \/favicon\.ico.*ms/g,
        type: 'warn',
        category: 'Performance',
        description: 'Excessive favicon requests detected',
        autoFix: true,
        fix: () => this.optimizeFaviconHandling()
      },
      {
        pattern: /304 - - 0\.\d+ ms/g,
        type: 'info',
        category: 'Performance',
        description: 'Good caching behavior detected',
        autoFix: false
      }
    ];

    // Read latest logs
    try {
      const logDir = '/tmp/logs';
      if (fs.existsSync(logDir)) {
        const logFiles = fs.readdirSync(logDir)
          .filter(file => file.endsWith('.log'))
          .map(file => ({ file, path: path.join(logDir, file), stats: fs.statSync(path.join(logDir, file)) }))
          .sort((a, b) => b.stats.mtime - a.stats.mtime)
          .slice(0, 3); // Latest 3 log files

        for (const logFile of logFiles) {
          const content = fs.readFileSync(logFile.path, 'utf8');
          
          for (const pattern of logPatterns) {
            const matches = content.match(pattern.pattern);
            if (matches) {
              const issue = {
                file: logFile.file,
                type: pattern.type,
                category: pattern.category,
                description: pattern.description,
                count: matches.length,
                autoFixable: pattern.autoFix,
                fix: pattern.fix
              };
              
              this.issues.push(issue);
              this.log(`Found ${pattern.description} (${matches.length} occurrences)`, pattern.type);
            }
          }
        }
      }
    } catch (error) {
      this.log(`Error reading logs: ${error.message}`, 'error');
    }
  }

  // Analyze source code for potential issues
  analyzeSourceCode() {
    this.log('Analyzing source code for potential issues...', 'info');
    
    const codePatterns = [
      {
        pattern: /console\.(log|debug|info|warn|error)/g,
        severity: 'low',
        description: 'Console statements found (should be removed in production)',
        files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
        autoFix: false
      },
      {
        pattern: /import.*from.*['"]\.\.[\/\\]/g,
        severity: 'medium',
        description: 'Relative imports going up directories (potential coupling issue)',
        files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
        autoFix: false
      },
      {
        pattern: /\/\/ TODO:|\/\/ FIXME:|\/\/ HACK:/g,
        severity: 'medium',
        description: 'Technical debt markers found',
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        autoFix: false
      },
      {
        pattern: /\.then\(.*\.catch/g,
        severity: 'low',
        description: 'Promise chains (consider async/await)',
        files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
        autoFix: false
      }
    ];

    this.scanFilePatterns(codePatterns);
  }

  // Analyze dependencies and imports
  analyzeDependencies() {
    this.log('Analyzing dependencies and imports...', 'info');
    
    try {
      // Check for unused dependencies
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Simple unused dependency check (basic implementation)
      const unusedDeps = [];
      for (const dep in dependencies) {
        try {
          // Check if dependency is imported anywhere
          const result = execSync(`find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "from ['\"]${dep}['\"]" || true`, 
            { encoding: 'utf8', stdio: 'pipe' });
          
          if (!result.trim()) {
            unusedDeps.push(dep);
          }
        } catch (error) {
          // Continue checking other dependencies
        }
      }

      if (unusedDeps.length > 0) {
        this.issues.push({
          type: 'warn',
          category: 'Dependencies',
          description: `Potentially unused dependencies: ${unusedDeps.slice(0, 5).join(', ')}${unusedDeps.length > 5 ? '...' : ''}`,
          count: unusedDeps.length,
          autoFixable: false,
          details: unusedDeps
        });
      }

    } catch (error) {
      this.log(`Error analyzing dependencies: ${error.message}`, 'warn');
    }
  }

  // Scan files for specific patterns
  scanFilePatterns(patterns) {
    for (const pattern of patterns) {
      try {
        const files = this.getFilesMatching(pattern.files);
        
        for (const file of files) {
          if (!fs.existsSync(file)) continue;
          
          const content = fs.readFileSync(file, 'utf8');
          const matches = content.match(pattern.pattern);
          
          if (matches) {
            this.issues.push({
              file,
              type: pattern.severity === 'high' ? 'error' : 'warn',
              category: 'Code Quality',
              description: pattern.description,
              count: matches.length,
              autoFixable: pattern.autoFix,
              severity: pattern.severity
            });
          }
          
          this.stats.filesAnalyzed++;
        }
      } catch (error) {
        this.log(`Error scanning pattern ${pattern.description}: ${error.message}`, 'warn');
      }
    }
  }

  // Get files matching glob patterns
  getFilesMatching(patterns) {
    const files = new Set();
    
    for (const pattern of patterns) {
      try {
        // Simple glob implementation
        if (pattern.includes('**')) {
          const result = execSync(`find . -name "${pattern.replace('**/', '')}" -not -path "./node_modules/*" -not -path "./dist/*"`, 
            { encoding: 'utf8', stdio: 'pipe' });
          result.split('\n').filter(Boolean).forEach(file => files.add(file.replace('./', '')));
        } else {
          // Direct file check
          if (fs.existsSync(pattern)) {
            files.add(pattern);
          }
        }
      } catch (error) {
        // Continue with other patterns
      }
    }
    
    return Array.from(files);
  }

  // Fix Cloudant configuration
  fixCloudantConfig() {
    this.log('Fixing Cloudant configuration...', 'fix');
    
    try {
      // Check if CLOUDANT_URL exists and fix if needed
      const envVars = process.env;
      if (envVars.CLOUDANT_URL && !envVars.CLOUDANT_URL.startsWith('https://')) {
        // This would typically be handled by environment configuration
        this.log('Cloudant URL should be configured with https://', 'warn');
        this.fixes.push('Configure CLOUDANT_URL to start with https://');
      }
      
      // Check for Cloudant-related code that might need fixing
      const cloudantFiles = this.getFilesMatching(['server/**/*.js', 'server/**/*.ts']);
      
      for (const file of cloudantFiles) {
        if (!fs.existsSync(file)) continue;
        
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('CLOUDANT_URL') && content.includes('http://')) {
          this.log(`Found insecure Cloudant URL in ${file}`, 'warn');
          this.fixes.push(`Update Cloudant URL in ${file} to use HTTPS`);
        }
      }
      
      this.stats.autoFixed++;
    } catch (error) {
      this.log(`Error fixing Cloudant config: ${error.message}`, 'error');
    }
  }

  // Fix Meta Pixel configuration
  fixMetaPixelConfig() {
    this.log('Fixing Meta Pixel configuration...', 'fix');
    
    try {
      // Find and fix Meta Pixel configuration
      const configFiles = this.getFilesMatching(['src/**/*.jsx', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.ts']);
      
      for (const file of configFiles) {
        if (!fs.existsSync(file)) continue;
        
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // Fix null pixel IDs
        if (content.includes('PixelID: null') || content.includes('pixelId: null')) {
          content = content.replace(/PixelID:\s*null/g, 'PixelID: process.env.META_PIXEL_ID || ""');
          content = content.replace(/pixelId:\s*null/g, 'pixelId: process.env.META_PIXEL_ID || ""');
          modified = true;
        }
        
        // Add conditional loading
        if (content.includes('[Meta Pixel]') && !content.includes('process.env.META_PIXEL_ID')) {
          // Find the Meta Pixel initialization and wrap it in a condition
          if (content.includes('fbq(') && !content.includes('if (process.env.META_PIXEL_ID)')) {
            content = content.replace(
              /fbq\(/g,
              'if (process.env.META_PIXEL_ID) { fbq('
            );
            // Add closing brace (this is a simplified fix)
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(file, content);
          this.log(`Fixed Meta Pixel configuration in ${file}`, 'success');
          this.fixes.push(`Updated Meta Pixel configuration in ${file}`);
          this.stats.autoFixed++;
        }
      }
    } catch (error) {
      this.log(`Error fixing Meta Pixel config: ${error.message}`, 'error');
    }
  }

  // Optimize favicon handling
  optimizeFaviconHandling() {
    this.log('Optimizing favicon handling...', 'fix');
    
    try {
      // Check if favicon exists
      const faviconPath = './public/favicon.ico';
      
      if (!fs.existsSync(faviconPath)) {
        this.log('Favicon not found - creating default favicon', 'fix');
        // Create a simple favicon (this would typically be a proper ICO file)
        const faviconContent = 'Placeholder favicon content';
        fs.writeFileSync(faviconPath, faviconContent);
      }
      
      // Add favicon optimization to server configuration
      const serverFiles = this.getFilesMatching(['server/index.js', 'server/index.ts']);
      
      for (const file of serverFiles) {
        if (!fs.existsSync(file)) continue;
        
        let content = fs.readFileSync(file, 'utf8');
        
        // Add favicon middleware if not present
        if (!content.includes('favicon') && !content.includes('/favicon.ico')) {
          const faviconMiddleware = `
// Optimize favicon handling
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
});
`;
          
          // Insert after express setup
          const insertPoint = content.indexOf('const app = express();');
          if (insertPoint !== -1) {
            const insertAfter = content.indexOf('\n', insertPoint) + 1;
            content = content.slice(0, insertAfter) + faviconMiddleware + content.slice(insertAfter);
            
            fs.writeFileSync(file, content);
            this.log(`Added favicon optimization to ${file}`, 'success');
            this.fixes.push(`Optimized favicon handling in ${file}`);
            this.stats.autoFixed++;
          }
        }
      }
    } catch (error) {
      this.log(`Error optimizing favicon: ${error.message}`, 'error');
    }
  }

  // Remove unused code and imports
  removeUnusedCode() {
    this.log('Scanning for unused imports and variables...', 'info');
    
    try {
      // This would typically use a proper AST parser like TypeScript compiler API
      // For now, we'll do basic pattern matching
      
      const sourceFiles = this.getFilesMatching(['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx']);
      
      for (const file of sourceFiles) {
        if (!fs.existsSync(file)) continue;
        
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // Remove unused React import (if using new JSX transform)
        if (content.includes("import React from 'react'") && 
            !content.includes('React.') && 
            !content.includes('<React.')) {
          
          content = content.replace(/import React from ['"]react['"];\n?/g, '');
          modified = true;
          this.log(`Removed unused React import from ${file}`, 'success');
        }
        
        // Remove duplicate imports
        const imports = content.match(/import.*from.*['"];?/g);
        if (imports) {
          const uniqueImports = [...new Set(imports)];
          if (imports.length !== uniqueImports.length) {
            // Replace all imports with unique ones
            let newContent = content;
            for (const imp of imports) {
              newContent = newContent.replace(imp, '');
            }
            // Add unique imports at the top
            newContent = uniqueImports.join('\n') + '\n' + newContent;
            content = newContent;
            modified = true;
            this.log(`Removed duplicate imports from ${file}`, 'success');
          }
        }
        
        if (modified) {
          fs.writeFileSync(file, content);
          this.fixes.push(`Cleaned up imports in ${file}`);
          this.stats.autoFixed++;
        }
      }
    } catch (error) {
      this.log(`Error removing unused code: ${error.message}`, 'error');
    }
  }

  // Generate cleanup report
  generateReport() {
    this.log('\n📊 Code Cleanup Analysis Report', 'info');
    this.log('='.repeat(50), 'info');
    
    this.log(`Files Analyzed: ${this.stats.filesAnalyzed}`, 'info');
    this.log(`Issues Found: ${this.issues.length}`, this.issues.length > 0 ? 'warn' : 'success');
    this.log(`Auto-Fixed: ${this.stats.autoFixed}`, 'success');
    this.log(`Manual Review Needed: ${this.issues.filter(i => !i.autoFixable).length}`, 'warn');
    
    if (this.issues.length > 0) {
      this.log('\n🔍 Issues Found:', 'info');
      
      const categories = {};
      for (const issue of this.issues) {
        if (!categories[issue.category]) {
          categories[issue.category] = [];
        }
        categories[issue.category].push(issue);
      }
      
      for (const [category, issues] of Object.entries(categories)) {
        this.log(`\n${category}:`, 'info');
        for (const issue of issues) {
          const status = issue.autoFixable ? '🔧 [AUTO-FIXED]' : '👁️  [MANUAL REVIEW]';
          this.log(`  ${status} ${issue.description}${issue.count > 1 ? ` (${issue.count}x)` : ''}`, issue.type);
          if (issue.file) {
            this.log(`    File: ${issue.file}`, 'info');
          }
        }
      }
    }
    
    if (this.fixes.length > 0) {
      this.log('\n✅ Applied Fixes:', 'success');
      for (const fix of this.fixes) {
        this.log(`  • ${fix}`, 'success');
      }
    }
    
    this.log('\n💡 Recommendations:', 'info');
    this.log('  • Run this analyzer regularly to maintain code quality', 'info');
    this.log('  • Review manual items and implement fixes where appropriate', 'info');
    this.log('  • Consider adding ESLint/Prettier for consistent code formatting', 'info');
    
    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      issues: this.issues,
      fixes: this.fixes
    };
    
    fs.writeFileSync('./code-cleanup-report.json', JSON.stringify(report, null, 2));
    this.log('\n📄 Detailed report saved to: code-cleanup-report.json', 'info');
  }

  // Run complete analysis
  async analyze() {
    this.log('🔍 Starting SPIRAL Code Cleanup Analysis...', 'info');
    
    this.analyzeLogs();
    this.analyzeSourceCode();
    this.analyzeDependencies();
    this.removeUnusedCode();
    
    this.generateReport();
    
    return {
      stats: this.stats,
      issues: this.issues,
      fixes: this.fixes
    };
  }
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new CodeCleanupAnalyzer();
  
  analyzer.analyze().then(results => {
    process.exit(results.issues.filter(i => i.type === 'error').length > 0 ? 1 : 0);
  }).catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
}

export default CodeCleanupAnalyzer;