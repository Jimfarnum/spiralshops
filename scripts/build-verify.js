#!/usr/bin/env node
// Enhanced build verification script for SPIRAL platform deployment

import { existsSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Starting comprehensive build verification...\n');

let allChecksPass = true;

// Required files for deployment
const requiredFiles = [
  { path: 'dist/index.js', name: 'Server entry point', critical: true },
  { path: 'dist/public/index.html', name: 'Frontend HTML', critical: true },
  { path: 'dist/public/assets', name: 'Frontend assets directory', critical: true }
];

// Check if dist directory exists
const distDir = join(rootDir, 'dist');
if (!existsSync(distDir)) {
  console.error('❌ CRITICAL: dist directory does not exist');
  console.log('💡 Run "npm run build" to generate build files');
  process.exit(1);
}

// Check all required files
console.log('📂 Checking required build files:');
for (const file of requiredFiles) {
  const fullPath = join(rootDir, file.path);
  
  if (!existsSync(fullPath)) {
    if (file.critical) {
      console.error(`❌ CRITICAL: ${file.name} missing (${file.path})`);
      allChecksPass = false;
    } else {
      console.log(`⚠️  WARNING: ${file.name} missing (${file.path})`);
    }
  } else {
    const stats = statSync(fullPath);
    const size = stats.isDirectory() ? 'directory' : `${(stats.size / 1024).toFixed(2)} KB`;
    console.log(`✅ ${file.name}: ${size}`);
  }
}

// Verify server entry point syntax
console.log('\n🔧 Verifying server entry point syntax:');
try {
  const serverPath = join(rootDir, 'dist/index.js');
  if (existsSync(serverPath)) {
    await execAsync(`node --check ${serverPath}`);
    console.log('✅ Server entry point syntax is valid');
    
    // Check for common patterns that indicate successful build
    const { readFileSync } = await import('fs');
    const content = readFileSync(serverPath, 'utf-8');
    
    if (content.includes('express') || content.includes('app.listen')) {
      console.log('✅ Server contains expected Express framework code');
    } else {
      console.log('⚠️  WARNING: Server entry point may not contain Express server code');
    }
  }
} catch (error) {
  console.error('❌ CRITICAL: Server entry point has syntax errors');
  console.error(`   Error: ${error.message}`);
  allChecksPass = false;
}

// Check TypeScript compilation output
console.log('\n📋 Build summary:');
const serverFile = join(distDir, 'index.js');
if (existsSync(serverFile)) {
  const stats = statSync(serverFile);
  console.log(`📦 Server bundle: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  if (stats.size < 1000) {
    console.log('⚠️  WARNING: Server bundle seems unusually small');
    allChecksPass = false;
  }
}

// Check frontend build
const frontendHtml = join(rootDir, 'dist/public/index.html');
if (existsSync(frontendHtml)) {
  console.log('✅ Frontend build present');
} else {
  console.log('⚠️  WARNING: Frontend HTML not found - may cause 404 errors');
}

// Final result
console.log('\n📊 Build Verification Summary:');
if (allChecksPass) {
  console.log('✅ All critical build checks passed');
  console.log('🚀 Build is ready for deployment');
  console.log('🔗 Server entry point: dist/index.js');
  process.exit(0);
} else {
  console.log('❌ Build verification failed - critical issues found');
  console.log('💡 Suggestions:');
  console.log('   1. Run "npm run build" to rebuild');
  console.log('   2. Check TypeScript compilation errors');
  console.log('   3. Verify esbuild configuration');
  console.log('   4. Ensure all source files are present');
  process.exit(1);
}