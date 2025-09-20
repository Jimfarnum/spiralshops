#!/usr/bin/env node

// Enhanced build verification with TypeScript compilation check
import { existsSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🚀 Enhanced Build Verification');
console.log('==============================');

let allChecksPass = true;

// Step 1: TypeScript Configuration Check
async function checkTypeScriptConfig() {
  console.log('\n📋 Step 1: TypeScript Configuration');
  
  try {
    if (!existsSync('tsconfig.json')) {
      console.error('❌ tsconfig.json not found');
      return false;
    }

    const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf-8'));
    
    if (tsconfig.compilerOptions.noEmit === true) {
      console.error('❌ CRITICAL: noEmit is true, preventing compilation output');
      console.log('💡 Fix: Change "noEmit": true to "noEmit": false');
      return false;
    }
    
    if (!tsconfig.compilerOptions.outDir || tsconfig.compilerOptions.outDir !== './dist') {
      console.error('❌ CRITICAL: outDir not set to ./dist');
      console.log(`   Current: ${tsconfig.compilerOptions.outDir || 'not set'}`);
      console.log('💡 Fix: Set "outDir": "./dist"');
      return false;
    }
    
    console.log('✅ TypeScript config valid for compilation output');
    return true;
  } catch (error) {
    console.error('❌ Error reading tsconfig.json:', error.message);
    return false;
  }
}

// Step 2: Build Output Check
function checkBuildOutput() {
  console.log('\n📦 Step 2: Build Output Verification');
  
  const requiredFiles = [
    { path: 'dist/index.js', name: 'Server entry point', critical: true },
    { path: 'dist/public/index.html', name: 'Frontend HTML', critical: true },
    { path: 'dist/public/assets', name: 'Frontend assets', critical: true }
  ];

  let outputValid = true;
  
  for (const file of requiredFiles) {
    const fullPath = join(process.cwd(), file.path);
    
    if (!existsSync(fullPath)) {
      console.error(`❌ CRITICAL: ${file.name} missing (${file.path})`);
      outputValid = false;
    } else {
      const stats = statSync(fullPath);
      const size = stats.isDirectory() ? 'directory' : `${(stats.size / 1024 / 1024).toFixed(2)} MB`;
      console.log(`✅ ${file.name}: ${size}`);
      
      // Check server bundle size
      if (file.path === 'dist/index.js' && stats.size < 100000) {
        console.error('❌ CRITICAL: Server bundle too small, likely empty or incomplete');
        outputValid = false;
      }
    }
  }
  
  return outputValid;
}

// Step 3: Server Entry Point Validation
async function checkServerEntryPoint() {
  console.log('\n🔧 Step 3: Server Entry Point Validation');
  
  const distIndexPath = join(process.cwd(), 'dist/index.js');
  
  if (!existsSync(distIndexPath)) {
    console.error('❌ CRITICAL: dist/index.js does not exist');
    return false;
  }
  
  // Syntax check
  try {
    await execAsync(`node --check ${distIndexPath}`);
    console.log('✅ Server entry point syntax valid');
  } catch (error) {
    console.error('❌ CRITICAL: Server entry point has syntax errors');
    console.error(`   Error: ${error.message}`);
    return false;
  }
  
  // Content check
  const content = readFileSync(distIndexPath, 'utf-8');
  if (!content.includes('express') && !content.includes('app.listen')) {
    console.error('❌ WARNING: Server entry point may not contain Express server code');
    console.log('   This may indicate incomplete bundling');
  } else {
    console.log('✅ Server entry point contains expected server code');
  }
  
  return true;
}

// Step 4: Production Readiness Check
function checkProductionReadiness() {
  console.log('\n🚀 Step 4: Production Readiness');
  
  // Check package.json scripts
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
  
  if (!packageJson.scripts.start) {
    console.error('❌ CRITICAL: No start script in package.json');
    return false;
  }
  
  if (!packageJson.scripts.start.includes('dist/index.js')) {
    console.error('❌ CRITICAL: Start script does not reference dist/index.js');
    console.log(`   Current: ${packageJson.scripts.start}`);
    return false;
  }
  
  console.log('✅ Production start script configured correctly');
  return true;
}

async function main() {
  const tsConfigValid = await checkTypeScriptConfig();
  const buildOutputValid = checkBuildOutput();
  const serverEntryValid = await checkServerEntryPoint();
  const productionReady = checkProductionReadiness();
  
  allChecksPass = tsConfigValid && buildOutputValid && serverEntryValid && productionReady;
  
  console.log('\n📊 Build Verification Summary');
  console.log('=============================');
  
  if (allChecksPass) {
    console.log('✅ All build verification checks passed');
    console.log('🚀 Build is ready for deployment');
    console.log('🔗 Server entry point: dist/index.js');
    console.log('📦 Frontend assets: dist/public/');
    process.exit(0);
  } else {
    console.log('❌ Build verification failed - critical issues found');
    console.log('\n💡 Suggested fixes:');
    console.log('   1. Run "npm run build" to rebuild');
    console.log('   2. Check TypeScript configuration (noEmit, outDir)');
    console.log('   3. Verify build script includes both vite and esbuild steps');
    console.log('   4. Ensure server/index.ts exists and compiles correctly');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Build verification script failed:', error.message);
  process.exit(1);
});