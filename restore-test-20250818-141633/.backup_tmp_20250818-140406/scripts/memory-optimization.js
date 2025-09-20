#!/usr/bin/env node

/**
 * SPIRAL Memory Optimization Suite
 * Comprehensive memory management and storage optimization
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🧠 SPIRAL Memory Optimization Suite - Starting...');

class MemoryOptimizer {
  constructor() {
    this.optimizationLog = [];
  }

  log(message) {
    console.log(message);
    this.optimizationLog.push(`${new Date().toISOString()}: ${message}`);
  }

  async checkSystemMemory() {
    this.log('📊 Checking system memory...');
    
    try {
      const memInfo = execSync('free -h', { encoding: 'utf8' });
      const memLines = memInfo.split('\n');
      const memData = memLines[1].split(/\s+/);
      
      this.log(`Memory Total: ${memData[1]}`);
      this.log(`Memory Used: ${memData[2]}`);
      this.log(`Memory Free: ${memData[3]}`);
      this.log(`Memory Available: ${memData[6]}`);
      
      return {
        total: memData[1],
        used: memData[2],
        free: memData[3],
        available: memData[6]
      };
    } catch (error) {
      this.log(`⚠️ Could not read system memory: ${error.message}`);
      return null;
    }
  }

  async optimizeNodeMemory() {
    this.log('⚡ Optimizing Node.js memory settings...');
    
    // Apply aggressive memory optimization
    process.env.NODE_OPTIONS = [
      '--max-old-space-size=4096',
      '--optimize-for-size',
      '--max-semi-space-size=128',
      '--gc-interval=100'
    ].join(' ');
    
    // Reduce thread pool size for lower memory footprint
    process.env.UV_THREADPOOL_SIZE = '4';
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      this.log('✅ Forced garbage collection completed');
    } else {
      this.log('⚠️ Garbage collection not available (run with --expose-gc)');
    }
    
    this.log('✅ Node.js memory optimization applied');
  }

  async cleanupLargeFiles() {
    this.log('🧹 Cleaning up large files and caches...');
    
    const cleanupTargets = [
      'node_modules/.cache',
      '.cache/typescript',
      '.cache/vite',
      'dist/temp',
      'uploads/temp',
      '.tmp',
      '.turbo',
      '*.log'
    ];
    
    for (const target of cleanupTargets) {
      try {
        if (fs.existsSync(target)) {
          const stats = fs.statSync(target);
          if (stats.isDirectory()) {
            fs.rmSync(target, { recursive: true, force: true });
            this.log(`✅ Removed directory: ${target}`);
          } else if (target.includes('*')) {
            // Handle glob patterns
            const files = execSync(`find . -name "${target}" -type f 2>/dev/null || true`, { encoding: 'utf8' });
            if (files.trim()) {
              execSync(`find . -name "${target}" -type f -delete 2>/dev/null || true`);
              this.log(`✅ Removed files matching: ${target}`);
            }
          }
        }
      } catch (error) {
        this.log(`⚠️ Could not clean ${target}: Protected or in use`);
      }
    }
  }

  async optimizeTypeScript() {
    this.log('🔧 Optimizing TypeScript configuration...');
    
    // Create optimized tsconfig for production
    const tsConfigOptimized = {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "node",
        strict: false,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        incremental: true,
        tsBuildInfoFile: ".cache/typescript/tsbuildinfo"
      },
      include: ["server/**/*", "shared/**/*"],
      exclude: ["node_modules", "dist", ".cache", "**/*.test.*"]
    };
    
    fs.writeFileSync('tsconfig.memory.json', JSON.stringify(tsConfigOptimized, null, 2));
    this.log('✅ Created optimized TypeScript configuration');
  }

  async createMemoryProfile() {
    this.log('📈 Creating memory profile...');
    
    const memUsage = process.memoryUsage();
    const profile = {
      timestamp: new Date().toISOString(),
      nodeMemory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        arrayBuffers: `${Math.round(memUsage.arrayBuffers / 1024 / 1024)}MB`
      },
      optimization: this.optimizationLog
    };
    
    fs.writeFileSync('memory-profile.json', JSON.stringify(profile, null, 2));
    this.log('✅ Memory profile saved to memory-profile.json');
    
    return profile;
  }

  async fixStorageIssues() {
    this.log('💾 Fixing storage configuration issues...');
    
    // Create optimized storage configuration
    const storageConfig = `# SPIRAL Storage Optimization
# Memory-efficient storage settings

# Node.js Memory Limits
NODE_OPTIONS="--max-old-space-size=4096 --optimize-for-size --gc-interval=100"
UV_THREADPOOL_SIZE=4

# TypeScript Performance
TS_NODE_TRANSPILE_ONLY=true
TS_NODE_SKIP_IGNORE=true

# Vite Optimization
VITE_LEGACY=false
VITE_BUILD_CHUNK_SIZE_LIMIT=1000

# Storage Optimization
STORAGE_CACHE_SIZE=100
STORAGE_MEMORY_LIMIT=512

# Database Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=30000
`;

    fs.writeFileSync('.env.storage', storageConfig);
    this.log('✅ Storage configuration optimized');
  }

  async run() {
    try {
      await this.checkSystemMemory();
      await this.optimizeNodeMemory();
      await this.cleanupLargeFiles();
      await this.optimizeTypeScript();
      await this.fixStorageIssues();
      
      const profile = await this.createMemoryProfile();
      
      this.log('\n🎉 Memory optimization complete!');
      this.log(`📊 Current heap usage: ${profile.nodeMemory.heapUsed}`);
      this.log(`📊 Total memory RSS: ${profile.nodeMemory.rss}`);
      this.log('\n📋 Next steps:');
      this.log('1. Restart the application to apply memory settings');
      this.log('2. Monitor memory usage with: node --expose-gc scripts/memory-monitor.js');
      this.log('3. Check memory-profile.json for detailed analysis');
      
      return true;
    } catch (error) {
      this.log(`❌ Optimization failed: ${error.message}`);
      throw error;
    }
  }
}

// Export for use in other modules
export { MemoryOptimizer };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new MemoryOptimizer();
  optimizer.run().catch(console.error);
}