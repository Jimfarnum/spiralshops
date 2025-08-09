import { Router } from 'express';

const router = Router();

// Watson/WatsonX disabled by default - stub endpoint
router.get('/api/recommendations/wx', (req, res) => {
  const watsonxEnabled = process.env.WATSONX_ENABLED === '1';
  
  if (!watsonxEnabled) {
    return res.json({
      disabled: true,
      message: 'Watson/WatsonX features are disabled',
      flag: 'WATSONX_ENABLED=0'
    });
  }
  
  // If enabled, this would contain actual Watson integration
  res.json({
    enabled: true,
    recommendations: [],
    message: 'WatsonX integration active'
  });
});

export default router;