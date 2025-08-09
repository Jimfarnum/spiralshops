import { Router } from 'express';

const router = Router();

// Demo reset with security key
router.post('/api/admin/demo-reset', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check demo reset key
    const providedKey = req.headers['x-demo-reset-key'] || req.body.resetKey;
    const requiredKey = process.env.DEMO_RESET_KEY;
    
    if (!requiredKey) {
      return res.status(500).json({
        error: 'Demo reset not configured',
        message: 'DEMO_RESET_KEY not set'
      });
    }
    
    if (providedKey !== requiredKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid demo reset key'
      });
    }
    
    // Mock reset operations (replace with actual DB operations)
    const operations = [
      { name: 'Clear orders', count: 25 },
      { name: 'Clear cart items', count: 15 },
      { name: 'Reset user sessions', count: 8 },
      { name: 'Seed demo data', count: 50 }
    ];
    
    const results = [];
    
    for (const op of operations) {
      // Simulate operation time
      await new Promise(resolve => setTimeout(resolve, 100));
      results.push({
        operation: op.name,
        documents_affected: op.count,
        status: 'completed'
      });
    }
    
    const duration = Date.now() - startTime;
    
    res.json({
      success: true,
      duration_ms: duration,
      operations: results,
      total_affected: results.reduce((sum, op) => sum + op.documents_affected, 0),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Demo reset failed',
      details: error.message,
      duration_ms: Date.now() - startTime
    });
  }
});

// Demo reset status
router.get('/api/admin/demo-reset/status', (req, res) => {
  res.json({
    configured: !!process.env.DEMO_RESET_KEY,
    security: 'x-demo-reset-key header required',
    max_duration: '15 seconds',
    operations: [
      'Clear orders',
      'Clear cart items', 
      'Reset user sessions',
      'Seed demo data'
    ]
  });
});

export default router;