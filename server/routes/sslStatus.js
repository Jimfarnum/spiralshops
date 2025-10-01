// SSL Status and Environment Health Check Routes
import express from 'express';
import { detectEnvironment, getSSLConfig, validateDomain } from '../config/domains.js';
import { sslManager } from '../middleware/sslManager.js';

const router = express.Router();

// SSL status endpoint
router.get('/ssl-status', (req, res) => {
  const hostname = req.get('host') || req.hostname;
  const environment = detectEnvironment(hostname);
  const sslConfig = getSSLConfig(environment);
  const certStatus = sslManager.getCertificateStatus(hostname);
  
  res.json({
    success: true,
    hostname,
    environment,
    ssl: {
      requiresSSL: sslConfig.requireSSL,
      hsts: sslConfig.hsts,
      certificate: sslConfig.certificate,
      isSecure: req.secure || req.header('x-forwarded-proto') === 'https',
      status: certStatus || 'not-monitored'
    },
    timestamp: new Date().toISOString()
  });
});

// Environment status endpoint  
router.get('/environment-status', (req, res) => {
  const hostname = req.get('host') || req.hostname;
  const environment = detectEnvironment(hostname);
  const sslConfig = getSSLConfig(environment);
  const domainValidation = validateDomain(hostname);
  
  res.json({
    success: true,
    hostname,
    environment,
    domain: domainValidation,
    ssl: sslConfig,
    request: {
      secure: req.secure,
      protocol: req.protocol,
      'x-forwarded-proto': req.header('x-forwarded-proto'),
      host: req.get('host'),
      origin: req.get('origin')
    },
    timestamp: new Date().toISOString()
  });
});

// SSL certificate health report
router.get('/ssl-health', async (req, res) => {
  const hostname = req.get('host') || req.hostname;
  const report = sslManager.generateSSLReport();
  
  res.json({
    success: true,
    hostname,
    report,
    timestamp: new Date().toISOString()
  });
});

// Trigger SSL certificate check
router.post('/ssl-check', async (req, res) => {
  try {
    const hostname = req.body.hostname || req.get('host') || req.hostname;
    const certInfo = await sslManager.validateCertificate(hostname);
    
    res.json({
      success: true,
      hostname,
      certificate: certInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;