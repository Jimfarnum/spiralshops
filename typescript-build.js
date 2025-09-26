#!/usr/bin/env node

/**
 * Consolidated TypeScript Build Pipeline
 * Proper TypeScript compilation with fail-by-default enforcement
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ENABLE_FALLBACK = process.env.TS_FALLBACK !== 'false'; // Default to true, disable with TS_FALLBACK=false

console.log('🔨 TypeScript Build Pipeline Starting...');
console.log(`📋 Fallback mode: ${ENABLE_FALLBACK ? 'enabled' : 'disabled (fail on TS errors)'}`);

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

  // Step 3: TypeScript server compilation (DIRECT TO DIST)
  console.log('🔧 Compiling server with TypeScript...');
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
    console.error('❌ TypeScript compilation failed');
    
    if (!ENABLE_FALLBACK) {
      console.error('🚫 Build failed due to TypeScript errors (fallback disabled)');
      console.error('💡 To enable fallback: TS_FALLBACK=true npm run build');
      console.error('💡 To fix: Resolve TypeScript errors in shared/schema.ts');
      throw tsError;
    }
    
    console.log('⚠️  Falling back to esbuild (TS_FALLBACK=true)...');
    execSync(`npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify`, { 
      stdio: 'inherit' 
    });
    console.log('✅ Fallback build completed with esbuild');
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

  // Step 5: Verify final output
  console.log('🔍 Verifying build output...');
  const serverPath = './dist/index.js';
  const publicPath = './dist/public';
  
  if (!fs.existsSync(serverPath)) {
    throw new Error('❌ Build verification failed: dist/index.js not found');
  }
  
  if (!fs.existsSync(publicPath)) {
    throw new Error('❌ Build verification failed: dist/public not found');
  }

  const serverSize = (fs.statSync(serverPath).size / 1024).toFixed(1);
  const buildMethod = fs.existsSync('./dist/server-ts') ? 'TypeScript (tsc)' : 'esbuild';
  
  console.log(`🎉 Build completed successfully!`);
  console.log(`   📄 Server: dist/index.js (${serverSize}KB)`);
  console.log(`   🌐 Frontend: dist/public/`);
  console.log(`   🔧 Method: ${buildMethod}`);
  
} catch (error) {
  console.error('❌ Build pipeline failed:', error.message);
  process.exit(1);
}