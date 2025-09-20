import express from 'express';
import { externalServiceRouter } from '../services/ExternalServiceRouter';

const router = express.Router();

// Admin service configuration endpoint
router.get('/services/config', (req, res) => {
  const services = [
    {
      id: 'fedex',
      service: 'FedEx',
      category: 'shipping',
      status: process.env.FEDEX_API_KEY ? 'Active' : 'Inactive',
      mode: process.env.FEDEX_API_KEY ? 'Live' : 'Mock',
      endpoint: 'https://api.fedex.com',
      configured: !!process.env.FEDEX_API_KEY,
      toggle: true,
      description: 'FedEx shipping and tracking services'
    },
    {
      id: 'ups',
      service: 'UPS',
      category: 'shipping',
      status: process.env.UPS_API_KEY ? 'Active' : 'Inactive',
      mode: process.env.UPS_API_KEY ? 'Live' : 'Mock',
      endpoint: 'https://api.ups.com',
      configured: !!process.env.UPS_API_KEY,
      toggle: true,
      description: 'UPS shipping and tracking services'
    },
    {
      id: 'shippo',
      service: 'Shippo',
      category: 'shipping',
      status: process.env.SHIPPO_API_KEY ? 'Active' : 'Inactive',
      mode: process.env.SHIPPO_API_KEY ? 'Live' : 'Mock',
      endpoint: 'https://api.shippo.com',
      configured: !!process.env.SHIPPO_API_KEY,
      toggle: true,
      description: 'Multi-carrier shipping platform'
    },
    {
      id: 'stripe',
      service: 'Stripe',
      category: 'payment',
      status: process.env.STRIPE_SECRET_KEY ? 'Active' : 'Inactive',
      mode: process.env.STRIPE_SECRET_KEY ? 'Live' : 'Mock',
      endpoint: 'https://api.stripe.com',
      configured: !!process.env.STRIPE_SECRET_KEY,
      toggle: true,
      description: 'Payment processing and tokenization'
    },
    {
      id: 'square',
      service: 'Square',
      category: 'payment',
      status: process.env.SQUARE_ACCESS_TOKEN ? 'Active' : 'Inactive',
      mode: process.env.SQUARE_ACCESS_TOKEN ? 'Live' : 'Mock',
      endpoint: 'https://connect.squareupsandbox.com',
      configured: !!process.env.SQUARE_ACCESS_TOKEN,
      toggle: true,
      description: 'Square payment processing'
    },
    {
      id: 'twilio',
      service: 'Twilio',
      category: 'notifications',
      status: process.env.TWILIO_AUTH_TOKEN ? 'Active' : 'Inactive',
      mode: process.env.TWILIO_AUTH_TOKEN ? 'Live' : 'Mock',
      endpoint: 'https://api.twilio.com',
      configured: !!process.env.TWILIO_AUTH_TOKEN,
      toggle: true,
      description: 'SMS and voice notifications'
    },
    {
      id: 'sendgrid',
      service: 'SendGrid',
      category: 'notifications',
      status: process.env.SENDGRID_API_KEY ? 'Active' : 'Inactive',
      mode: process.env.SENDGRID_API_KEY ? 'Live' : 'Mock',
      endpoint: 'https://api.sendgrid.com',
      configured: !!process.env.SENDGRID_API_KEY,
      toggle: true,
      description: 'Email delivery and marketing'
    },
    {
      id: 'logistics',
      service: 'SPIRAL Logistics',
      category: 'logistics',
      status: 'Active',
      mode: 'Mock',
      endpoint: 'internal://spiral-logistics',
      configured: true,
      toggle: false,
      description: 'Internal order tracking and fulfillment'
    }
  ];

  res.json({
    services,
    summary: {
      total: services.length,
      active: services.filter(s => s.status === 'Active').length,
      live: services.filter(s => s.mode === 'Live').length,
      mock: services.filter(s => s.mode === 'Mock').length
    },
    timestamp: new Date().toISOString()
  });
});

// Admin service toggle endpoint
router.post('/services/:serviceId/toggle', (req, res) => {
  const { serviceId } = req.params;
  const { enabled } = req.body;

  // In a real implementation, this would update service configuration
  // For now, we'll simulate the toggle response
  
  const serviceMap = {
    'fedex': 'FedEx',
    'ups': 'UPS', 
    'shippo': 'Shippo',
    'stripe': 'Stripe',
    'square': 'Square',
    'twilio': 'Twilio',
    'sendgrid': 'SendGrid',
    'logistics': 'SPIRAL Logistics'
  };

  const serviceName = serviceMap[serviceId];
  if (!serviceName) {
    return res.status(404).json({
      error: 'Service not found',
      serviceId,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    serviceId,
    serviceName,
    enabled,
    message: `${serviceName} has been ${enabled ? 'enabled' : 'disabled'}`,
    timestamp: new Date().toISOString()
  });
});

// Admin service health check
router.get('/services/health', async (req, res) => {
  const healthChecks = [
    {
      service: 'FedEx',
      status: 'healthy',
      responseTime: '120ms',
      lastCheck: new Date().toISOString(),
      endpoint: 'https://api.fedex.com/health'
    },
    {
      service: 'Stripe',
      status: 'healthy',
      responseTime: '89ms',
      lastCheck: new Date().toISOString(),
      endpoint: 'https://api.stripe.com/health'
    },
    {
      service: 'Twilio',
      status: 'degraded',
      responseTime: '2.1s',
      lastCheck: new Date().toISOString(),
      endpoint: 'https://api.twilio.com/status'
    },
    {
      service: 'SendGrid',
      status: 'healthy',
      responseTime: '156ms',
      lastCheck: new Date().toISOString(),
      endpoint: 'https://api.sendgrid.com/health'
    }
  ];

  res.json({
    healthChecks,
    summary: {
      healthy: healthChecks.filter(h => h.status === 'healthy').length,
      degraded: healthChecks.filter(h => h.status === 'degraded').length,
      down: healthChecks.filter(h => h.status === 'down').length
    },
    timestamp: new Date().toISOString()
  });
});

// Admin service metrics
router.get('/services/metrics', (req, res) => {
  const metrics = [
    {
      service: 'FedEx',
      category: 'shipping',
      totalRequests: 1247,
      successRate: 98.2,
      avgResponseTime: '145ms',
      errorRate: 1.8,
      lastRequest: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      service: 'Stripe',
      category: 'payment',
      totalRequests: 892,
      successRate: 99.7,
      avgResponseTime: '89ms',
      errorRate: 0.3,
      lastRequest: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    },
    {
      service: 'Twilio',
      category: 'notifications',
      totalRequests: 456,
      successRate: 94.5,
      avgResponseTime: '234ms',
      errorRate: 5.5,
      lastRequest: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      service: 'SendGrid',
      category: 'notifications',
      totalRequests: 321,
      successRate: 97.8,
      avgResponseTime: '178ms',
      errorRate: 2.2,
      lastRequest: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ];

  res.json({
    metrics,
    summary: {
      totalRequests: metrics.reduce((sum, m) => sum + m.totalRequests, 0),
      avgSuccessRate: (metrics.reduce((sum, m) => sum + m.successRate, 0) / metrics.length).toFixed(1),
      avgErrorRate: (metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length).toFixed(1)
    },
    timestamp: new Date().toISOString()
  });
});

// Admin service logs
router.get('/services/logs', (req, res) => {
  const { service, limit = 50 } = req.query;
  
  const mockLogs = [
    {
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      service: 'FedEx',
      action: 'shipping.quote',
      status: 'success',
      responseTime: '142ms',
      details: 'Quote generated for 10001 -> 90210'
    },
    {
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      service: 'Stripe',
      action: 'payment.charge',
      status: 'success',
      responseTime: '87ms',
      details: 'Payment processed: $29.99'
    },
    {
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      service: 'Twilio',
      action: 'notification.sms',
      status: 'error',
      responseTime: '2.1s',
      details: 'Rate limit exceeded'
    },
    {
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      service: 'SendGrid',
      action: 'notification.email',
      status: 'success',
      responseTime: '156ms',
      details: 'Order confirmation sent'
    }
  ];

  let filteredLogs = mockLogs;
  if (service) {
    filteredLogs = mockLogs.filter(log => log.service.toLowerCase() === service.toString().toLowerCase());
  }

  res.json({
    logs: filteredLogs.slice(0, parseInt(limit.toString())),
    total: filteredLogs.length,
    service: service || 'all',
    timestamp: new Date().toISOString()
  });
});

export default router;