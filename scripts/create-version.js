#!/usr/bin/env node
// Create version.json file for deployment tracking

import { writeFileSync } from 'fs';
import { join } from 'path';

const version = {
  version: process.env.npm_package_version || '1.0.0',
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  arch: process.arch,
  deploymentId: Date.now().toString(),
  environment: process.env.NODE_ENV || 'production'
};

const versionPath = join(process.cwd(), 'dist', 'version.json');
writeFileSync(versionPath, JSON.stringify(version, null, 2));

console.log('✅ Version file created at dist/version.json');
console.log(`📋 Deployment ID: ${version.deploymentId}`);
console.log(`🕐 Build Time: ${version.buildTime}`);