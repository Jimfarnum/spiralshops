// SPIRAL Cloudant Status & Integration Routes
const express = require('express');
const router = express.Router();

// Route to check Cloudant integration status
router.get('/cloudant-status', (req, res) => {
  const requiredSecrets = [
    'CLOUDANT_URL',
    'CLOUDANT_APIKEY', 
    'CLOUDANT_HOST',
    'CLOUDANT_USERNAME',
    'CLOUDANT_DB',
    'IBM_CLOUDANT_URL',
    'IBM_CLOUDANT_API_KEY'
  ];

  const status = {
    timestamp: new Date().toISOString(),
    integration_ready: true,
    secrets_configured: {},
    missing_secrets: [],
    next_steps: []
  };

  // Check each required secret
  requiredSecrets.forEach(secret => {
    const exists = !!process.env[secret];
    status.secrets_configured[secret] = exists;
    if (!exists) {
      status.missing_secrets.push(secret);
      status.integration_ready = false;
    }
  });

  // Provide next steps
  if (status.missing_secrets.length > 0) {
    status.next_steps = [
      'Add missing secrets to Replit Secrets panel',
      'Use exact secret names and values provided',
      'SPIRAL will automatically restart after adding secrets',
      'Test connection with /api/cloudant-test endpoint'
    ];
  } else {
    status.next_steps = [
      'All secrets configured!',
      'Test connection with /api/cloudant-test',
      'Ready for production deployment'
    ];
  }

  res.json({
    success: true,
    cloudant_status: status
  });
});

// Route to test Cloudant connection
router.get('/cloudant-test', async (req, res) => {
  if (!process.env.CLOUDANT_URL || !process.env.CLOUDANT_APIKEY) {
    return res.status(400).json({
      success: false,
      error: 'Cloudant credentials not configured',
      message: 'Please add CLOUDANT_URL and CLOUDANT_APIKEY secrets'
    });
  }

  try {
    // Import and test Cloudant connection
    const SpiralCloudantManager = require('../cloudant-integration-test');
    const manager = new SpiralCloudantManager();
    
    const connected = await manager.initialize();
    
    if (connected) {
      const status = manager.getStatus();
      res.json({
        success: true,
        message: 'Cloudant connection successful',
        status: status,
        ready_for_production: true
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Connection failed',
        message: 'Check credentials and try again'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Cloudant connection error'
    });
  }
});

module.exports = router;