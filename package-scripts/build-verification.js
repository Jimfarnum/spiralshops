#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Verifying build output...');

const distDir = path.join(process.cwd(), 'dist');
const serverFile = path.join(distDir, 'index.js');
const publicDir = path.join(distDir, 'public');
const publicIndexFile = path.join(publicDir, 'index.html');

let hasErrors = false;

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory does not exist');
  hasErrors = true;
} else {
  console.log('✅ dist directory exists');
}

// Check if server entry point exists
if (!fs.existsSync(serverFile)) {
  console.error('❌ dist/index.js does not exist - server build failed');
  hasErrors = true;
} else {
  const stats = fs.statSync(serverFile);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ dist/index.js exists (${sizeInMB} MB)`);
}

// Check if frontend build exists
if (!fs.existsSync(publicDir)) {
  console.error('❌ dist/public directory does not exist - frontend build failed');
  hasErrors = true;
} else {
  console.log('✅ dist/public directory exists');
}

if (!fs.existsSync(publicIndexFile)) {
  console.error('❌ dist/public/index.html does not exist - frontend build failed');
  hasErrors = true;
} else {
  console.log('✅ dist/public/index.html exists');
}

// Check for assets directory in public
const assetsDir = path.join(publicDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  console.log(`✅ dist/public/assets directory contains ${assetFiles.length} files`);
} else {
  console.warn('⚠️ dist/public/assets directory not found');
}

// Create version file for deployment tracking
const versionFile = path.join(distDir, 'version.json');
const versionData = {
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  serverBundle: fs.existsSync(serverFile),
  frontendBundle: fs.existsSync(publicDir)
};

try {
  fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));
  console.log('✅ version.json created for deployment tracking');
} catch (error) {
  console.warn('⚠️ Could not create version.json:', error.message);
}

if (hasErrors) {
  console.error('\n❌ Build verification failed! Check the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ Build verification passed! All required files exist.');
  console.log('Ready for deployment with npm start');
}