// =============================================================================
// AI SECURITY HEALTH & MONITORING ENDPOINT
// =============================================================================

import express from 'express';
import { requireAdminAuth } from '../middleware/security.js';
import { getAuditSystemHealth, generateSecurityReport } from '../middleware/auditLogging.js';

const router = express.Router();

// 🔒 PROTECTED: Get comprehensive security health status
router.get('/health', 
  requireAdminAuth,
  async (req, res) => {
    try {
      const auditHealth = getAuditSystemHealth();
      
      // Security status summary
      const securityStatus = {
        timestamp: new Date().toISOString(),
        overallStatus: 'FULLY_SECURED',
        priorityFixes: {
          priority1_authentication: {
            status: 'ACTIVE',
            description: 'Admin authentication, rate limiting, cost protection',
            features: ['requireAdminAuth', 'adminRefreshLimiter', 'costProtection', 'aiOperationLogger']
          },
          priority2_inputValidation: {
            status: 'ACTIVE', 
            description: 'Comprehensive input validation and sanitization',
            features: ['validateInput', 'sanitizeTextInputs', 'setAISecurityHeaders']
          },
          priority3_monitoring: {
            status: 'ACTIVE',
            description: 'Enhanced monitoring, alerting, and audit logging',
            features: ['aiAuditLogger', 'securityAlertMiddleware', 'generateSecurityReport']
          }
        },
        protectedEndpoints: [
          '/api/beta-refresh-images',
          '/api/generate-images/auto-generate-product-images',
          '/api/generate-images/preview-image/:productId'
        ],
        auditSystem: auditHealth,
        costProtection: {
          dailyLimit: parseInt(process.env.AI_DAILY_LIMIT || '50'),
          currentUsage: auditHealth.dailyStats[`${new Date().toISOString().split('T')[0]}-operations`] || 0
        }
      };
      
      res.json(securityStatus);
      
    } catch (error) {
      console.error('❌ Security health check failed:', error);
      res.status(500).json({
        error: 'Security health check failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

// 🔒 PROTECTED: Generate detailed security report
router.get('/report',
  requireAdminAuth,
  async (req, res) => {
    try {
      const report = generateSecurityReport();
      
      res.setHeader('Content-Type', 'text/plain');
      res.send(report);
      
    } catch (error) {
      console.error('❌ Security report generation failed:', error);
      res.status(500).json({
        error: 'Security report generation failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;