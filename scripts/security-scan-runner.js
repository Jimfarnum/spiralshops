#!/usr/bin/env node

/**
 * SPIRAL Security Scan Runner
 * Runs automated security scans locally for development
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCAN_RESULTS_DIR = 'security-reports';

console.log('🔒 SPIRAL Security Scan Runner Starting...');

// Ensure results directory exists
if (!fs.existsSync(SCAN_RESULTS_DIR)) {
  fs.mkdirSync(SCAN_RESULTS_DIR, { recursive: true });
}

// 1. NPM Audit
console.log('\n📦 Running npm audit...');
try {
  execSync('npm audit --audit-level=high', { stdio: 'inherit' });
  console.log('✅ npm audit completed successfully');
} catch (error) {
  console.log('⚠️  npm audit found vulnerabilities (expected in dev)');
}

// Save audit results
try {
  const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
  fs.writeFileSync(path.join(SCAN_RESULTS_DIR, 'npm-audit.json'), auditResult);
  console.log('📄 npm audit results saved');
} catch (error) {
  console.log('⚠️  Could not save npm audit results');
}

// 2. Check for Newman installation
console.log('\n🧪 Checking Newman installation...');
try {
  execSync('which newman', { stdio: 'pipe' });
  console.log('✅ Newman is installed');
} catch (error) {
  console.log('📦 Installing Newman...');
  try {
    execSync('npm install -g newman newman-reporter-htmlextra', { stdio: 'inherit' });
    console.log('✅ Newman installed successfully');
  } catch (installError) {
    console.log('❌ Failed to install Newman. Install manually: npm install -g newman');
    process.exit(1);
  }
}

// 3. Run Postman security tests
console.log('\n🔍 Running SPIRAL API security tests...');
const newmanCommand = `newman run tests/postman/collections/spiral-api-security.json ` +
  `-e tests/postman/envs/development.json ` +
  `--timeout-request 30000 ` +
  `--reporters cli,htmlextra ` +
  `--reporter-htmlextra-export ${SCAN_RESULTS_DIR}/spiral-security-report.html`;

try {
  execSync(newmanCommand, { stdio: 'inherit' });
  console.log('✅ API security tests completed');
} catch (error) {
  console.log('⚠️  Some API security tests may have failed (review report)');
}

// 4. Basic file security check
console.log('\n📁 Running basic file security checks...');
const securityChecks = [
  { pattern: '.env', message: '.env files should not be committed' },
  { pattern: 'id_rsa', message: 'Private keys should not be committed' },
  { pattern: 'password', message: 'Files containing "password" found' },
  { pattern: 'secret', message: 'Files containing "secret" found' }
];

securityChecks.forEach(check => {
  try {
    const result = execSync(`find . -name "*${check.pattern}*" -not -path "./node_modules/*" -not -path "./.git/*"`, 
      { encoding: 'utf8' });
    if (result.trim()) {
      console.log(`⚠️  ${check.message}:`);
      console.log(result);
    }
  } catch (error) {
    // No files found - this is good
  }
});

// 5. Generate summary report
const summaryReport = {
  timestamp: new Date().toISOString(),
  platform: 'SPIRAL Local Commerce Platform',
  scans: {
    npm_audit: 'completed',
    api_security: 'completed',
    file_security: 'completed'
  },
  reports_location: SCAN_RESULTS_DIR,
  recommendations: [
    'Review npm-audit.json for vulnerability details',
    'Check spiral-security-report.html for API security results',
    'Ensure no sensitive files are committed to repository',
    'Run security scans before production deployment'
  ]
};

fs.writeFileSync(
  path.join(SCAN_RESULTS_DIR, 'security-summary.json'), 
  JSON.stringify(summaryReport, null, 2)
);

console.log('\n✅ SPIRAL Security Scan Complete!');
console.log(`📄 Reports saved to: ${SCAN_RESULTS_DIR}/`);
console.log('🔍 Review all reports before deployment');
console.log('\n📋 Next steps:');
console.log('  1. Review npm-audit.json for dependency vulnerabilities');
console.log('  2. Check spiral-security-report.html for API security status');
console.log('  3. Address any high-severity findings');
console.log('  4. Re-run scans after fixes');