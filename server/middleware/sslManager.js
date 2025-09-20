// SPIRAL SSL Certificate Manager
// Comprehensive SSL certificate management and validation

import https from 'https';
import { detectEnvironment, getSSLConfig } from '../config/domains.js';

export class SSLManager {
  constructor() {
    this.certificates = new Map();
    this.certStatus = new Map();
  }

  // Check SSL certificate validity
  async validateCertificate(hostname) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname,
        port: 443,
        method: 'HEAD',
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        const cert = res.socket.getPeerCertificate();
        
        if (cert && cert.subject) {
          const now = new Date();
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          
          const isValid = now >= validFrom && now <= validTo;
          const daysToExpiry = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));
          
          resolve({
            valid: isValid,
            subject: cert.subject,
            issuer: cert.issuer,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            daysToExpiry,
            serialNumber: cert.serialNumber,
            fingerprint: cert.fingerprint
          });
        } else {
          resolve({ valid: false, error: 'No certificate found' });
        }
      });

      req.on('error', (err) => {
        resolve({ valid: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ valid: false, error: 'Connection timeout' });
      });

      req.end();
    });
  }

  // Monitor certificate expiration
  async monitorCertificates(domains = []) {
    const results = {};
    
    for (const domain of domains) {
      try {
        const certInfo = await this.validateCertificate(domain);
        results[domain] = certInfo;
        
        // Store in cache
        this.certStatus.set(domain, {
          ...certInfo,
          lastChecked: new Date()
        });
        
        // Warn if certificate expires soon
        if (certInfo.valid && certInfo.daysToExpiry < 30) {
          console.warn(`⚠️ SSL certificate for ${domain} expires in ${certInfo.daysToExpiry} days`);
        }
        
      } catch (error) {
        results[domain] = { valid: false, error: error.message };
      }
    }
    
    return results;
  }

  // Get certificate status from cache
  getCertificateStatus(domain) {
    return this.certStatus.get(domain) || null;
  }

  // Generate SSL health report
  generateSSLReport() {
    const report = {
      timestamp: new Date().toISOString(),
      certificates: {},
      warnings: [],
      errors: []
    };

    for (const [domain, status] of this.certStatus.entries()) {
      report.certificates[domain] = status;
      
      if (!status.valid) {
        report.errors.push(`${domain}: ${status.error || 'Invalid certificate'}`);
      } else if (status.daysToExpiry < 30) {
        report.warnings.push(`${domain}: Certificate expires in ${status.daysToExpiry} days`);
      }
    }

    return report;
  }

  // Setup automatic certificate monitoring
  startMonitoring(domains, intervalMinutes = 60) {
    console.log(`🔒 Starting SSL monitoring for: ${domains.join(', ')}`);
    
    // Initial check
    this.monitorCertificates(domains);
    
    // Setup periodic monitoring
    setInterval(() => {
      this.monitorCertificates(domains);
    }, intervalMinutes * 60 * 1000);
  }
}

// Global SSL manager instance
export const sslManager = new SSLManager();

// SSL status middleware
export function sslStatusMiddleware(req, res, next) {
  const hostname = req.get('host') || req.hostname;
  const environment = detectEnvironment(hostname);
  const sslConfig = getSSLConfig(environment);
  
  // Add SSL info to request
  req.sslInfo = {
    environment,
    requiresSSL: sslConfig.requireSSL,
    hsts: sslConfig.hsts,
    certificate: sslConfig.certificate,
    isSecure: req.secure || req.header('x-forwarded-proto') === 'https'
  };
  
  next();
}

// SSL health check endpoint
export function sslHealthCheck(req, res) {
  const hostname = req.get('host') || req.hostname;
  const certStatus = sslManager.getCertificateStatus(hostname);
  const report = sslManager.generateSSLReport();
  
  res.json({
    success: true,
    hostname,
    ssl: req.sslInfo,
    certificate: certStatus,
    report: report,
    timestamp: new Date().toISOString()
  });
}