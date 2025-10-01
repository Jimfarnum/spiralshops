import express from 'express';
import { externalServiceRouter } from '../services/ExternalServiceRouter';

const router = express.Router();

// Main external service handler endpoint
router.post('/handle/:action', async (req, res) => {
  try {
    const { action } = req.params;
    const payload = req.body;

    // Validate action format
    if (!action.includes('.')) {
      return res.status(400).json({
        error: 'Invalid action format. Expected: service.operation',
        example: 'shipping.quote',
        timestamp: new Date().toISOString()
      });
    }

    const result = await externalServiceRouter.handleExternalService(action, payload);
    
    res.json({
      action,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      action: req.params.action,
      timestamp: new Date().toISOString()
    });
  }
});

// Service status endpoint
router.get('/status', (req, res) => {
  const status = externalServiceRouter.getServiceStatus();
  res.json(status);
});

// Individual service endpoints for convenience

// Shipping endpoints
router.post('/shipping/quote', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('shipping.quote', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/shipping/track', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('shipping.track', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/shipping/create', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('shipping.create', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment endpoints
router.post('/payment/token', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('payment.token', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payment/charge', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('payment.charge', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payment/refund', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('payment.refund', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logistics endpoints
router.post('/logistics/track', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('logistics.track', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logistics/update', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('logistics.update', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notification endpoints
router.post('/notifications/sms', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('notification.sms', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/notifications/email', async (req, res) => {
  try {
    const result = await externalServiceRouter.handleExternalService('notification.email', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk operations
router.post('/bulk', async (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!Array.isArray(operations)) {
      return res.status(400).json({
        error: 'operations must be an array',
        timestamp: new Date().toISOString()
      });
    }

    const results = await Promise.allSettled(
      operations.map(({ action, payload }) => 
        externalServiceRouter.handleExternalService(action, payload)
      )
    );

    const response = results.map((result, index) => ({
      index,
      action: operations[index].action,
      status: result.status,
      result: result.status === 'fulfilled' ? result.value : { error: result.reason.message }
    }));

    res.json({
      operations: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;