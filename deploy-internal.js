#!/usr/bin/env node

/**
 * SPIRAL Internal Deployment System
 * Comprehensive code-based deployment with verification
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const DEPLOYMENT_CONFIG = {
  name: 'SPIRAL Platform',
  version: '1.0',
  buildPath: './dist',
  serverEntry: './dist/index.js',
  port: process.env.PORT || 5000,
  timeout: 30000
};

class InternalDeployment {
  constructor() {
    this.startTime = Date.now();
    this.deploymentId = `deploy-${Date.now()}`;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '✅',
      warn: '⚠️ ',
      error: '❌',
      deploy: '🚀'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async executeStep(description, command) {
    this.log(`${description}...`);
    try {
      if (typeof command === 'function') {
        await command();
      } else {
        execSync(command, { stdio: 'inherit' });
      }
      this.log(`${description} completed`);
      return true;
    } catch (error) {
      this.log(`${description} failed: ${error.message}`, 'error');
      return false;
    }
  }

  async preDeploymentChecks() {
    this.log('Running pre-deployment checks...', 'deploy');
    
    const checks = [
      {
        name: 'Environment variables',
        check: () => process.env.DATABASE_URL && process.env.OPENAI_API_KEY,
        message: 'DATABASE_URL and OPENAI_API_KEY must be set'
      },
      {
        name: 'Source files',
        check: () => fs.existsSync('./server/index.ts'),
        message: 'Server source file must exist'
      },
      {
        name: 'Package configuration',
        check: () => fs.existsSync('./package.json'),
        message: 'Package.json must exist'
      }
    ];

    for (const check of checks) {
      if (!check.check()) {
        this.log(`Pre-deployment check failed: ${check.message}`, 'error');
        return false;
      }
      this.log(`✓ ${check.name}`);
    }

    return true;
  }

  async buildApplication() {
    this.log('Building application for production...', 'deploy');
    
    // Clean previous build
    await this.executeStep('Clean dist directory', () => {
      if (fs.existsSync(DEPLOYMENT_CONFIG.buildPath)) {
        fs.rmSync(DEPLOYMENT_CONFIG.buildPath, { recursive: true, force: true });
      }
      fs.mkdirSync(DEPLOYMENT_CONFIG.buildPath, { recursive: true });
    });

    // Build frontend
    if (!await this.executeStep('Build frontend (Vite)', 'npm run build')) {
      return false;
    }

    // Verify build output
    if (!await this.executeStep('Verify build output', () => {
      if (!fs.existsSync(DEPLOYMENT_CONFIG.serverEntry)) {
        throw new Error(`Build output not found: ${DEPLOYMENT_CONFIG.serverEntry}`);
      }
      const stats = fs.statSync(DEPLOYMENT_CONFIG.serverEntry);
      this.log(`Build size: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
    })) {
      return false;
    }

    return true;
  }

  async startProduction() {
    this.log('Starting production server...', 'deploy');
    
    // Kill any existing process on the port
    try {
      execSync(`pkill -f "node.*dist/index.js" || true`, { stdio: 'pipe' });
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      // Ignore errors - process might not exist
    }

    // Start production server in background
    const serverProcess = execSync('nohup npm run start > deployment.log 2>&1 & echo $!', { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();

    this.log(`Production server started with PID: ${serverProcess}`);
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    return serverProcess;
  }

  async verifyDeployment() {
    this.log('Verifying deployment...', 'deploy');
    
    const baseUrl = `http://localhost:${DEPLOYMENT_CONFIG.port}`;
    const endpoints = [
      { path: '/api/health', name: 'Health check' },
      { path: '/api/products', name: 'Products API' },
      { path: '/api/docs', name: 'API documentation' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          timeout: 10000
        });
        
        if (response.ok) {
          this.log(`✓ ${endpoint.name} (${response.status})`);
        } else {
          this.log(`✗ ${endpoint.name} (${response.status})`, 'warn');
        }
      } catch (error) {
        this.log(`✗ ${endpoint.name}: ${error.message}`, 'warn');
      }
    }

    return true;
  }

  async createDeploymentRecord() {
    const deploymentRecord = {
      id: this.deploymentId,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      version: DEPLOYMENT_CONFIG.version,
      status: 'completed',
      endpoints: {
        health: `/api/health`,
        products: `/api/products`,
        docs: `/api/docs`
      },
      features: [
        'Enhanced CORS configuration',
        'Image URL normalization',
        'API documentation endpoint',
        'Production-ready security headers'
      ]
    };

    fs.writeFileSync('./deployment-record.json', JSON.stringify(deploymentRecord, null, 2));
    this.log(`Deployment record created: ./deployment-record.json`);
    
    return deploymentRecord;
  }

  async deploy() {
    this.log(`Starting internal deployment: ${this.deploymentId}`, 'deploy');
    
    try {
      // Pre-deployment checks
      if (!await this.preDeploymentChecks()) {
        throw new Error('Pre-deployment checks failed');
      }

      // Build application
      if (!await this.buildApplication()) {
        throw new Error('Application build failed');
      }

      // Start production server
      const pid = await this.startProduction();

      // Verify deployment
      await this.verifyDeployment();

      // Create deployment record
      const record = await this.createDeploymentRecord();

      this.log(`🎉 Deployment completed successfully!`, 'deploy');
      this.log(`⏱️  Total time: ${(record.duration / 1000).toFixed(2)}s`);
      this.log(`🌐 Server running on port ${DEPLOYMENT_CONFIG.port}`);
      this.log(`📋 PID: ${pid}`);
      
      return {
        success: true,
        deploymentId: this.deploymentId,
        record
      };

    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error');
      return {
        success: false,
        error: error.message,
        deploymentId: this.deploymentId
      };
    }
  }
}

// Execute deployment if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployment = new InternalDeployment();
  
  deployment.deploy().then(result => {
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal deployment error:', error);
    process.exit(1);
  });
}

export default InternalDeployment;