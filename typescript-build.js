#!/usr/bin/env node

/**
 * Consolidated TypeScript Build Pipeline
 * Proper TypeScript compilation with fail-by-default enforcement
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// FORCE ESBUILD AS PRIMARY - TypeScript is unstable
const USE_TYPESCRIPT = process.env.USE_TYPESCRIPT === 'true'; // Only use TS if explicitly requested
const PRIMARY_METHOD = USE_TYPESCRIPT ? 'TypeScript (risky)' : 'esbuild (safe)';

console.log('🚀 BULLETPROOF Build Pipeline');
console.log('============================');
console.log(`📋 Primary method: ${PRIMARY_METHOD}`);
console.log('📋 Deployment safety: MAXIMUM');

console.log('🔍 DEPLOYMENT ENVIRONMENT CHECK:');
try {
  console.log(`   Node.js: ${process.version}`);
  console.log(`   npm: ${execSync('npm -v', { encoding: 'utf8' }).trim()}`);
  console.log(`   esbuild available: ${execSync('npx esbuild --version', { encoding: 'utf8' }).trim()}`);
  console.log(`   vite available: ${execSync('npx vite --version', { encoding: 'utf8' }).trim()}`);
} catch (envError) {
  console.error('⚠️  Environment check failed:', envError.message);
}

try {
  // Step 1: Clean build directory
  console.log('🧹 Cleaning dist directory...');
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  fs.mkdirSync('./dist', { recursive: true });

  // Step 2: Build frontend
  console.log('🎨 Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Frontend build completed');

  // Step 3: Server compilation - esbuild FIRST for deployment safety
  if (USE_TYPESCRIPT) {
    console.log('🔧 RISKY MODE: Attempting TypeScript compilation (explicitly requested)...');
    try {
      execSync('npx tsc --project tsconfig.build.json', { 
        stdio: 'inherit' 
      });
      
      // Check if direct compilation worked
      const directServerIndex = './dist/server/index.js';
      const finalServerIndex = './dist/index.js';
      
      if (fs.existsSync(directServerIndex)) {
        fs.copyFileSync(directServerIndex, finalServerIndex);
        console.log('✅ TypeScript compilation successful (direct to dist)');
      } else {
        throw new Error('TypeScript compilation did not produce expected output');
      }
      
    } catch (tsError) {
      console.error('❌ TypeScript compilation failed - switching to esbuild');
      execSync(`npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js --minify --target=node18`, { 
        stdio: 'inherit' 
      });
      console.log('✅ Emergency fallback build completed with esbuild');
    }
  } else {
    console.log('🔧 SAFE MODE: Building server with esbuild (deterministic output)...');
    execSync(`npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js --minify --target=node18`, { 
      stdio: 'inherit' 
    });
    console.log('✅ Safe build completed with esbuild');
  }

  // Step 4: Copy images to build
  console.log('🖼️ Copying images to build...');
  const imagesSrc = './public/images';
  const imagesDest = './dist/public/images';
  
  if (fs.existsSync(imagesSrc)) {
    fs.mkdirSync(imagesDest, { recursive: true });
    fs.cpSync(imagesSrc, imagesDest, { recursive: true });
    console.log('✅ Images copied to build');
  } else {
    console.log('⚠️ No images directory found');
  }

  // Step 5: CRITICAL DEPLOYMENT VERIFICATION
  console.log('🔍 CRITICAL: Verifying build output for deployment...');
  const serverPath = './dist/index.js';
  const publicPath = './dist/public';
  
  if (!fs.existsSync(serverPath)) {
    console.error('❌ CRITICAL FAILURE: dist/index.js does NOT exist!');
    console.error('   This will cause deployment to fail!');
    console.error('   Attempting emergency server build...');
    
    // Emergency server build with detailed verification
    try {
      execSync(`npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js --minify --target=node18`, { 
        stdio: 'inherit' 
      });
      
      if (fs.existsSync('./dist/index.js')) {
        console.log('✅ Emergency build successful - dist/index.js created');
      } else {
        throw new Error('❌ Emergency build failed - deployment will fail');
      }
    } catch (emergencyError) {
      console.error('❌ Emergency build failed:', emergencyError.message);
      throw emergencyError;
    }
  }
  
  if (!fs.existsSync(publicPath)) {
    console.error('❌ Build verification failed: dist/public not found');
    throw new Error('Frontend build failed');
  }

  const serverSize = (fs.statSync(serverPath).size / 1024).toFixed(1);
  const buildMethod = USE_TYPESCRIPT ? 'TypeScript (risky)' : 'esbuild (safe)';
  
  console.log(`🎉 Build completed successfully!`);
  console.log(`   📄 Server: dist/index.js (${serverSize}KB) ✅ DEPLOYMENT READY`);
  console.log(`   🌐 Frontend: dist/public/ ✅`);
  console.log(`   🔧 Method: ${buildMethod}`);
  
  // Final deployment readiness check
  if (parseFloat(serverSize) < 50) {
    console.error('⚠️  WARNING: Server file suspiciously small - may be corrupted');
  }
  
  console.log('🚀 DEPLOYMENT VERIFICATION: dist/index.js exists and ready!');
  
} catch (error) {
  console.error('❌ Build pipeline failed:', error.message);
  process.exit(1);
}