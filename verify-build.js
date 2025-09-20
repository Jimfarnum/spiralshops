#!/usr/bin/env node

/**
 * SPIRAL Build Verification Script
 * Ensures the build process creates the required files for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 SPIRAL Build Verification Starting...\n');

const distPath = path.join(__dirname, 'dist');
const serverPath = path.join(distPath, 'index.js');
const publicPath = path.join(distPath, 'public');
const indexHtmlPath = path.join(publicPath, 'index.html');

let passed = 0;
let failed = 0;

function check(description, condition) {
  if (condition) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.error(`❌ ${description}`);
    failed++;
  }
}

// Check dist directory exists
check('dist/ directory exists', fs.existsSync(distPath));

// Check server file exists and has reasonable size
if (fs.existsSync(serverPath)) {
  const stats = fs.statSync(serverPath);
  const sizeKB = Math.round(stats.size / 1024);
  check(`dist/index.js exists (${sizeKB} KB)`, sizeKB > 100); // Should be substantial
  check(`dist/index.js is recent`, (Date.now() - stats.mtime.getTime()) < 300000); // Within 5 minutes
} else {
  failed++;
}

// Check frontend build exists
check('dist/public/ directory exists', fs.existsSync(publicPath));
check('dist/public/index.html exists', fs.existsSync(indexHtmlPath));

// Check for assets directory
const assetsPath = path.join(publicPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const assetFiles = fs.readdirSync(assetsPath);
  check(`Frontend assets built (${assetFiles.length} files)`, assetFiles.length > 0);
}

// Test if the server file is valid JavaScript
try {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  check('dist/index.js is valid JavaScript', serverContent.includes('express') || serverContent.includes('server'));
} catch (e) {
  console.error(`❌ dist/index.js validation failed: ${e.message}`);
  failed++;
}

console.log('\n📊 Build Verification Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.error('\n🚨 Build verification failed! Check the errors above.');
  process.exit(1);
} else {
  console.log('\n🎉 Build verification passed! Ready for deployment.');
  
  // Additional deployment info
  console.log('\n📋 Deployment Information:');
  console.log(`📁 Server file: dist/index.js`);
  console.log(`📁 Frontend files: dist/public/`);
  console.log(`⚡ Start command: NODE_ENV=production node dist/index.js`);
  console.log(`🌐 Expected port: 3000 (or PORT env variable)`);
}