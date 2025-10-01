#!/usr/bin/env node

/**
 * SPIRAL Deployment API
 * RESTful API for managing internal deployments
 */

import express from 'express';
import InternalDeployment from './deploy-internal.js';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

// Store active deployments
const activeDeployments = new Map();

// Middleware for deployment API authentication
const authenticateDeployment = (req, res, next) => {
  const token = req.headers['x-deployment-token'] || process.env.DEPLOYMENT_TOKEN;
  if (!token || token !== process.env.DEPLOYMENT_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized - deployment token required' });
  }
  next();
};

// GET /deploy/status - Get deployment status
app.get('/deploy/status', (req, res) => {
  try {
    const deployments = Array.from(activeDeployments.entries()).map(([id, deployment]) => ({
      id,
      status: deployment.status,
      startTime: deployment.startTime,
      progress: deployment.progress || 0
    }));

    // Check if current server is running
    const isRunning = fs.existsSync('./dist/index.js');
    const deploymentRecord = fs.existsSync('./deployment-record.json') 
      ? JSON.parse(fs.readFileSync('./deployment-record.json', 'utf8'))
      : null;

    res.json({
      server_status: isRunning ? 'running' : 'stopped',
      current_deployment: deploymentRecord,
      active_deployments: deployments,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /deploy/start - Start new deployment
app.post('/deploy/start', authenticateDeployment, async (req, res) => {
  try {
    const deployment = new InternalDeployment();
    const deploymentId = deployment.deploymentId;
    
    // Store deployment reference
    activeDeployments.set(deploymentId, {
      status: 'starting',
      startTime: Date.now(),
      progress: 0
    });

    // Start deployment asynchronously
    deployment.deploy().then(result => {
      activeDeployments.set(deploymentId, {
        ...activeDeployments.get(deploymentId),
        status: result.success ? 'completed' : 'failed',
        result,
        progress: 100
      });
    }).catch(error => {
      activeDeployments.set(deploymentId, {
        ...activeDeployments.get(deploymentId),
        status: 'error',
        error: error.message,
        progress: 0
      });
    });

    res.json({
      message: 'Deployment started',
      deployment_id: deploymentId,
      status: 'starting',
      monitor_url: `/deploy/status/${deploymentId}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /deploy/status/:id - Get specific deployment status
app.get('/deploy/status/:id', (req, res) => {
  const deployment = activeDeployments.get(req.params.id);
  
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }

  res.json({
    deployment_id: req.params.id,
    ...deployment,
    duration: Date.now() - deployment.startTime
  });
});

// POST /deploy/rollback - Rollback to previous deployment
app.post('/deploy/rollback', authenticateDeployment, async (req, res) => {
  try {
    // This would implement rollback logic
    // For now, we'll return a placeholder
    res.json({
      message: 'Rollback functionality would be implemented here',
      status: 'not_implemented'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /deploy/stop - Stop current deployment
app.post('/deploy/stop', authenticateDeployment, async (req, res) => {
  try {
    const { execSync } = await import('child_process');
    execSync('pkill -f "node.*dist/index.js" || true', { stdio: 'pipe' });
    
    res.json({
      message: 'Deployment stopped',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /deploy/logs - Get deployment logs
app.get('/deploy/logs', (req, res) => {
  try {
    const logFile = './deployment.log';
    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, 'utf8');
      res.json({
        logs: logs.split('\n').slice(-100), // Last 100 lines
        file: logFile
      });
    } else {
      res.json({ logs: [], message: 'No logs found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start deployment API server
const PORT = process.env.DEPLOY_API_PORT || 3001;

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`🚀 SPIRAL Deployment API running on port ${PORT}`);
    console.log(`📋 Endpoints:`);
    console.log(`   GET  /deploy/status         - Overall status`);
    console.log(`   POST /deploy/start          - Start deployment`);
    console.log(`   GET  /deploy/status/:id     - Deployment progress`);
    console.log(`   POST /deploy/stop           - Stop deployment`);
    console.log(`   GET  /deploy/logs           - View logs`);
    console.log(`🔐 Authentication: X-Deployment-Token header required`);
  });
}

export default app;