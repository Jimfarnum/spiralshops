import express from 'express';
import { setSeasonalPromotion, getSeasonalPromotion, deactivateSeasonalPromotion, calculateSpiralsEarned } from '../services/spiralsService.js';

const router = express.Router();

// Activate seasonal promotion
router.post('/activate', async (req, res) => {
  try {
    const { type, multiplier } = req.body;
    
    if (!type || !multiplier) {
      return res.status(400).json({
        success: false,
        error: 'Type and multiplier are required'
      });
    }

    setSeasonalPromotion(type, Number(multiplier));
    
    res.json({
      success: true,
      message: `Seasonal promotion activated: ${type} with ${multiplier}x multiplier`,
      promotion: { type, multiplier, active: true }
    });
  } catch (error) {
    console.error('Error activating seasonal promotion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get current seasonal promotion
router.get('/current', async (req, res) => {
  try {
    const promotion = getSeasonalPromotion();
    
    res.json({
      success: true,
      promotion: promotion || null
    });
  } catch (error) {
    console.error('Error getting seasonal promotion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Deactivate seasonal promotion
router.post('/deactivate', async (req, res) => {
  try {
    deactivateSeasonalPromotion();
    
    res.json({
      success: true,
      message: 'Seasonal promotion deactivated'
    });
  } catch (error) {
    console.error('Error deactivating seasonal promotion:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test SPIRALS calculation endpoint
router.post('/test-calculation', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required'
      });
    }

    const earned = await calculateSpiralsEarned(Number(amount));
    const promotion = getSeasonalPromotion();
    
    res.json({
      success: true,
      testAmount: amount,
      spiralsEarned: earned,
      activePromotion: promotion
    });
  } catch (error) {
    console.error('Error testing SPIRALS calculation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;