#!/usr/bin/env node

/**
 * SPIRAL Code Cleanup Runner
 * Interactive cleanup execution and scheduling
 */

import CodeCleanupAnalyzer from './code-cleanup-analyzer.js';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

class CodeCleanupRunner {
  constructor() {
    this.analyzer = new CodeCleanupAnalyzer();
    this.configPath = './cleanup-config.json';
    this.defaultConfig = {
      autoFix: true,
      schedule: null,
      excludePatterns: ['node_modules/', 'dist/', '.git/'],
      severity: {
        high: true,
        medium: true,
        low: false
      },
      notifications: {
        onComplete: true,
        onErrors: true
      }
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      error: '\x1b[31m❌',
      warn: '\x1b[33m⚠️',
      info: '\x1b[36mℹ️',
      success: '\x1b[32m✅',
      runner: '\x1b[35m🏃'
    };
    
    console.log(`${colors[type] || ''} [${timestamp}] ${message}\x1b[0m`);
  }

  // Load configuration
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        return { ...this.defaultConfig, ...config };
      }
      return this.defaultConfig;
    } catch (error) {
      this.log(`Error loading config: ${error.message}`, 'warn');
      return this.defaultConfig;
    }
  }

  // Save configuration
  saveConfig(config) {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      this.log('Configuration saved', 'success');
    } catch (error) {
      this.log(`Error saving config: ${error.message}`, 'error');
    }
  }

  // Run quick cleanup
  async runQuick() {
    this.log('Running quick code cleanup...', 'runner');
    
    try {
      const results = await this.analyzer.analyze();
      
      if (results.stats.autoFixed > 0) {
        this.log(`Quick cleanup completed - ${results.stats.autoFixed} issues fixed`, 'success');
      } else {
        this.log('Quick cleanup completed - no issues to auto-fix', 'info');
      }
      
      return results;
    } catch (error) {
      this.log(`Quick cleanup failed: ${error.message}`, 'error');
      throw error;
    }
  }

  // Run deep analysis
  async runDeep() {
    this.log('Running deep code analysis...', 'runner');
    
    try {
      // Enhanced analysis with additional checks
      this.analyzer.analyzeLogs();
      this.analyzer.analyzeSourceCode();
      this.analyzer.analyzeDependencies();
      
      // Additional deep analysis
      await this.analyzePerformance();
      await this.analyzeSecurity();
      await this.analyzeAccessibility();
      
      this.analyzer.removeUnusedCode();
      this.analyzer.generateReport();
      
      this.log('Deep analysis completed', 'success');
      
      return {
        stats: this.analyzer.stats,
        issues: this.analyzer.issues,
        fixes: this.analyzer.fixes
      };
    } catch (error) {
      this.log(`Deep analysis failed: ${error.message}`, 'error');
      throw error;
    }
  }

  // Analyze performance issues
  async analyzePerformance() {
    this.log('Analyzing performance issues...', 'info');
    
    const performanceChecks = [
      {
        pattern: /useEffect.*\[\]/g,
        description: 'Empty dependency arrays in useEffect (potential performance issue)',
        severity: 'medium'
      },
      {
        pattern: /console\.(log|debug|info)/g,
        description: 'Console statements (should be removed in production)',
        severity: 'low'
      },
      {
        pattern: /import.*\*.*from/g,
        description: 'Wildcard imports (tree-shaking opportunity)',
        severity: 'low'
      }
    ];

    for (const check of performanceChecks) {
      // Add to analyzer issues
      this.analyzer.scanFilePatterns([{
        pattern: check.pattern,
        severity: check.severity,
        description: check.description,
        files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
        autoFix: false
      }]);
    }
  }

  // Analyze security issues
  async analyzeSecurity() {
    this.log('Analyzing security issues...', 'info');
    
    const securityChecks = [
      {
        pattern: /eval\s*\(/g,
        description: 'Usage of eval() - security risk',
        severity: 'high'
      },
      {
        pattern: /innerHTML\s*=/g,
        description: 'Usage of innerHTML - potential XSS risk',
        severity: 'medium'
      },
      {
        pattern: /process\.env\.[A-Z_]+/g,
        description: 'Environment variables usage - verify security',
        severity: 'low'
      }
    ];

    for (const check of securityChecks) {
      this.analyzer.scanFilePatterns([{
        pattern: check.pattern,
        severity: check.severity,
        description: check.description,
        files: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', 'server/**/*.js', 'server/**/*.ts'],
        autoFix: false
      }]);
    }
  }

  // Analyze accessibility issues
  async analyzeAccessibility() {
    this.log('Analyzing accessibility issues...', 'info');
    
    const a11yChecks = [
      {
        pattern: /<img(?![^>]*alt=)/g,
        description: 'Images without alt attributes',
        severity: 'medium'
      },
      {
        pattern: /<button[^>]*>(?!</button>)/g,
        description: 'Buttons without accessible text content',
        severity: 'low'
      },
      {
        pattern: /onClick.*div|onClick.*span/g,
        description: 'Non-interactive elements with click handlers',
        severity: 'medium'
      }
    ];

    for (const check of a11yChecks) {
      this.analyzer.scanFilePatterns([{
        pattern: check.pattern,
        severity: check.severity,
        description: check.description,
        files: ['src/**/*.jsx', 'src/**/*.tsx'],
        autoFix: false
      }]);
    }
  }

  // Watch for file changes and run cleanup
  async watch() {
    this.log('Starting file watcher for automatic cleanup...', 'runner');
    
    try {
      // Simple file watcher implementation without external dependencies
      this.log('File watching would be implemented here', 'info');
      this.log('For now, run "node code-cleanup-runner.js quick" manually', 'info');
    } catch (error) {
      this.log(`Watch setup failed: ${error.message}`, 'error');
    }
  }

  // Generate cleanup report
  generateHTMLReport(results) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPIRAL Code Cleanup Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 8px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { background: #e9ecef; padding: 15px; border-radius: 5px; text-align: center; }
        .issues { margin: 20px 0; }
        .issue { background: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ffc107; }
        .issue.error { background: #f8d7da; border-color: #dc3545; }
        .issue.fixed { background: #d4edda; border-color: #28a745; }
        .fixes { margin: 20px 0; }
        .fix { background: #d4edda; padding: 10px; margin: 5px 0; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔧 SPIRAL Code Cleanup Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="stats">
        <div class="stat">
            <h3>${results.stats.filesAnalyzed}</h3>
            <p>Files Analyzed</p>
        </div>
        <div class="stat">
            <h3>${results.issues.length}</h3>
            <p>Issues Found</p>
        </div>
        <div class="stat">
            <h3>${results.stats.autoFixed}</h3>
            <p>Auto-Fixed</p>
        </div>
    </div>
    
    <div class="issues">
        <h2>🔍 Issues Found</h2>
        ${results.issues.map(issue => `
            <div class="issue ${issue.type} ${issue.autoFixable ? 'fixed' : ''}">
                <strong>${issue.category}: ${issue.description}</strong>
                ${issue.count > 1 ? ` (${issue.count}x)` : ''}
                ${issue.file ? `<br><small>File: ${issue.file}</small>` : ''}
                <br><small>${issue.autoFixable ? '✅ Auto-fixed' : '👁️ Manual review needed'}</small>
            </div>
        `).join('')}
    </div>
    
    <div class="fixes">
        <h2>✅ Applied Fixes</h2>
        ${results.fixes.map(fix => `
            <div class="fix">• ${fix}</div>
        `).join('')}
    </div>
</body>
</html>`;
    
    fs.writeFileSync('./code-cleanup-report.html', html);
    this.log('HTML report generated: code-cleanup-report.html', 'success');
  }

  // CLI interface
  async run(command = 'quick') {
    const config = this.loadConfig();
    
    switch (command) {
      case 'quick':
        const quickResults = await this.runQuick();
        this.generateHTMLReport(quickResults);
        break;
        
      case 'deep':
        const deepResults = await this.runDeep();
        this.generateHTMLReport(deepResults);
        break;
        
      case 'watch':
        await this.watch();
        break;
        
      case 'config':
        console.log('Current configuration:', JSON.stringify(config, null, 2));
        break;
        
      default:
        this.log(`Unknown command: ${command}`, 'error');
        this.log('Available commands: quick, deep, watch, config', 'info');
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new CodeCleanupRunner();
  const command = process.argv[2] || 'quick';
  
  runner.run(command).catch(error => {
    console.error('❌ Cleanup runner failed:', error);
    process.exit(1);
  });
}

export default CodeCleanupRunner;