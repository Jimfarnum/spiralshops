#!/usr/bin/env node

/**
 * Build Verification Script for SPIRAL Platform
 * 
 * This script verifies that the build process creates all necessary files
 * for successful deployment and production execution.
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 SPIRAL Platform - Build Verification');
console.log('=====================================\n');

// Check if dist/index.js exists and has reasonable size
const serverFile = 'dist/index.js';
let buildSuccess = true;

if (!fs.existsSync(serverFile)) {
  console.error('❌ CRITICAL: Server build failed - dist/index.js not found');
  buildSuccess = false;
} else {
  const stats = fs.statSync(serverFile);
  const sizeKB = Math.round(stats.size / 1024);
  
  if (stats.size < 10000) {
    console.error(`❌ CRITICAL: Server build incomplete - dist/index.js too small (${sizeKB}KB)`);
    buildSuccess = false;
  } else {
    console.log(`✅ Server build successful: dist/index.js created (${sizeKB}KB)`);
  }
}

// Check if frontend assets exist
const publicDir = 'dist/public';
if (!fs.existsSync(publicDir)) {
  console.error('❌ CRITICAL: Frontend build failed - dist/public directory not found');
  buildSuccess = false;
} else {
  const indexHtml = path.join(publicDir, 'index.html');
  const assetsDir = path.join(publicDir, 'assets');
  
  if (!fs.existsSync(indexHtml)) {
    console.error('❌ Frontend build incomplete - index.html not found');
    buildSuccess = false;
  } else {
    console.log('✅ Frontend build successful: index.html found');
  }
  
  if (!fs.existsSync(assetsDir)) {
    console.error('❌ Frontend build incomplete - assets directory not found');
    buildSuccess = false;
  } else {
    const assetFiles = fs.readdirSync(assetsDir);
    console.log(`✅ Frontend assets built: ${assetFiles.length} asset files`);
  }
}

// Test server file syntax (basic check)
if (fs.existsSync(serverFile)) {
  try {
    const serverContent = fs.readFileSync(serverFile, 'utf8');
    if (serverContent.includes('express') && serverContent.length > 50000) {
      console.log('✅ Server file appears valid (contains Express and has reasonable size)');
    } else {
      console.error('❌ Server file validation failed - may be incomplete');
      buildSuccess = false;
    }
  } catch (error) {
    console.error(`❌ Server file validation failed: ${error.message}`);
    buildSuccess = false;
  }
}

console.log('\n=====================================');
if (buildSuccess) {
  console.log('🎉 BUILD VERIFICATION SUCCESSFUL');
  console.log('📦 Ready for production deployment');
  console.log('🚀 Can safely run: npm start');
  process.exit(0);
} else {
  console.log('💥 BUILD VERIFICATION FAILED');
  console.log('🔧 Fix build issues before deployment');
  process.exit(1);
}