#!/usr/bin/env node

// TypeScript compilation check script
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';

const execAsync = promisify(exec);

console.log('🔧 Running TypeScript compilation check...');

async function checkTypeScriptConfig() {
  try {
    // Check if tsconfig.json exists
    if (!existsSync('tsconfig.json')) {
      console.error('❌ tsconfig.json not found');
      return false;
    }

    // Read and validate tsconfig.json
    const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf-8'));
    
    if (tsconfig.compilerOptions.noEmit === true) {
      console.error('❌ TypeScript config has noEmit: true, preventing compilation output');
      console.log('💡 Fix: Set "noEmit": false in tsconfig.json');
      return false;
    }
    
    if (!tsconfig.compilerOptions.outDir) {
      console.error('❌ TypeScript config missing outDir specification');
      console.log('💡 Fix: Add "outDir": "./dist" to compilerOptions');
      return false;
    }
    
    console.log(`✅ TypeScript config valid: outDir=${tsconfig.compilerOptions.outDir}, noEmit=${tsconfig.compilerOptions.noEmit || false}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error reading TypeScript config:', error.message);
    return false;
  }
}

async function checkTypeScriptCompilation() {
  try {
    console.log('🔍 Testing TypeScript compilation...');
    const { stdout, stderr } = await execAsync('npx tsc --noEmit --skipLibCheck');
    
    if (stderr && !stderr.includes('Found 0 errors')) {
      console.log('⚠️  TypeScript compilation warnings/errors:');
      console.log(stderr);
    } else {
      console.log('✅ TypeScript compilation check passed');
    }
    
    return true;
  } catch (error) {
    console.error('❌ TypeScript compilation failed:');
    console.error(error.stdout || error.message);
    return false;
  }
}

async function checkServerEntryPoint() {
  const serverTs = existsSync('server/index.ts');
  const serverJs = existsSync('server/index.js');
  
  console.log(`📂 Server entry points: TypeScript=${serverTs}, JavaScript=${serverJs}`);
  
  if (!serverTs && !serverJs) {
    console.error('❌ No server entry point found (server/index.ts or server/index.js)');
    return false;
  }
  
  console.log('✅ Server entry point exists');
  return true;
}

async function main() {
  console.log('📋 TypeScript Configuration Check');
  console.log('================================');
  
  const configValid = await checkTypeScriptConfig();
  const compilationValid = await checkTypeScriptCompilation();
  const entryPointValid = await checkServerEntryPoint();
  
  if (configValid && compilationValid && entryPointValid) {
    console.log('\n✅ All TypeScript checks passed');
    console.log('🚀 Ready for TypeScript compilation and build');
    process.exit(0);
  } else {
    console.log('\n❌ TypeScript check failed');
    console.log('💡 Fix the issues above before building');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ TypeScript check script failed:', error.message);
  process.exit(1);
});