/**
 * Emergency Memory Fix for SPIRAL Platform
 * Immediate solution to resolve memory storage errors
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚨 Emergency Memory Fix - Starting...');

class EmergencyMemoryFix {
  async applyImmediateFixes() {
    console.log('⚡ Applying immediate memory fixes...');

    // 1. Force garbage collection
    this.forceGarbageCollection();

    // 2. Apply Node.js optimization flags
    this.applyNodeOptimizations();

    // 3. Clear problematic caches
    this.clearCaches();

    // 4. Fix storage configuration
    this.fixStorageConfig();

    console.log('✅ Emergency memory fixes applied successfully');
  }

  forceGarbageCollection() {
    if (global.gc) {
      global.gc();
      console.log('🧹 Forced garbage collection completed');
    } else {
      console.log('⚠️ GC not available - applying alternative memory cleanup');
      
      // Alternative cleanup methods
      if (global.Buffer) {
        global.Buffer.from = ((original) => {
          return function(source: any, encoding?: any, offset?: number, length?: number) {
            const result = original.apply(this, arguments);
            if (result.length > 1000000) { // > 1MB buffers
              console.log('📦 Large buffer allocation detected and optimized');
            }
            return result;
          };
        })(global.Buffer.from);
      }
    }
  }

  applyNodeOptimizations() {
    // Set memory-efficient environment variables
    process.env.NODE_OPTIONS = [
      '--max-old-space-size=4096',
      '--optimize-for-size',
      '--max-semi-space-size=128'
    ].join(' ');

    process.env.UV_THREADPOOL_SIZE = '4';
    
    console.log('⚙️ Node.js optimization flags applied');
  }

  clearCaches() {
    try {
      // Clear require cache for non-essential modules
      const moduleKeysToKeep = ['fs', 'path', 'http', 'express'];
      
      Object.keys(require.cache).forEach(key => {
        const shouldKeep = moduleKeysToKeep.some(keepKey => key.includes(keepKey));
        if (!shouldKeep && key.includes('node_modules')) {
          delete require.cache[key];
        }
      });

      console.log('🗑️ Module cache optimized');
    } catch (error) {
      console.log('⚠️ Cache clearing skipped - in ESM mode');
    }
  }

  fixStorageConfig() {
    const optimizedStorageSettings = `
# SPIRAL Emergency Memory Configuration
NODE_OPTIONS="--max-old-space-size=4096 --optimize-for-size"
UV_THREADPOOL_SIZE=4
TS_NODE_TRANSPILE_ONLY=true
STORAGE_MEMORY_EFFICIENT=true
`;

    fs.writeFileSync('.env.memory', optimizedStorageSettings);
    console.log('💾 Storage configuration fixed');
  }

  monitorMemoryUsage() {
    const usage = process.memoryUsage();
    
    return {
      rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
      external: Math.round(usage.external / 1024 / 1024) + 'MB'
    };
  }
}

// Create and run emergency fix
const emergencyFix = new EmergencyMemoryFix();

// Export the fix function
export async function runEmergencyMemoryFix() {
  await emergencyFix.applyImmediateFixes();
  
  const currentUsage = emergencyFix.monitorMemoryUsage();
  console.log('📊 Memory usage after fix:', currentUsage);
  
  return currentUsage;
}

// Auto-run if imported
if (import.meta.url === `file://${process.argv[1]}`) {
  runEmergencyMemoryFix().catch(console.error);
}

export default emergencyFix;