#!/usr/bin/env node
// build-script.js - Production build helper for SPIRAL Platform

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Starting SPIRAL Platform production build...');

// Function to copy directory recursively
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Function to copy a single file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied: ${src} -> ${dest}`);
}

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Copy data directory to dist
  const dataDir = path.join(__dirname, 'data');
  const distDataDir = path.join(__dirname, 'dist', 'data');
  
  if (fs.existsSync(dataDir)) {
    copyDir(dataDir, distDataDir);
    console.log('✅ Data directory copied to dist/data/');
  }

  // Copy client/public directory to dist for production serving
  const publicDir = path.join(__dirname, 'client', 'public');
  const distPublicDir = path.join(__dirname, 'dist', 'public');
  
  if (fs.existsSync(publicDir)) {
    copyDir(publicDir, distPublicDir);
    console.log('✅ Public directory copied to dist/public/');
  }

  // Copy client/public directory to dist/client/public for backend compatibility
  const distClientPublicDir = path.join(__dirname, 'dist', 'client', 'public');
  
  if (fs.existsSync(publicDir)) {
    copyDir(publicDir, distClientPublicDir);
    console.log('✅ Public directory copied to dist/client/public/');
  }

  // Copy specific critical files
  const criticalFiles = [
    { src: 'data/spiral_sample_products.json', dest: 'dist/spiral_sample_products.json' },
    { src: 'data/spiral_sample_products.json', dest: 'dist/data/spiral_sample_products.json' },
    { src: 'client/public/spiral_sample_products.json', dest: 'dist/client/public/spiral_sample_products.json' }
  ];

  criticalFiles.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    }
  });

  console.log('🎉 Build preparation completed successfully!');
  console.log('📁 Data files available at multiple paths for production compatibility:');
  console.log('   - dist/data/spiral_sample_products.json');
  console.log('   - dist/client/public/spiral_sample_products.json');
  console.log('   - dist/spiral_sample_products.json');

} catch (error) {
  console.error('❌ Build preparation failed:', error);
  process.exit(1);
}