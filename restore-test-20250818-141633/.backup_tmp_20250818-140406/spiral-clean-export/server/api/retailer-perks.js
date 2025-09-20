// Retailer Incentive Perks API
import express from 'express';
const router = express.Router();

// In-memory storage for perks (in production, use database)
let perksStorage = [];

// GET /api/retailer-perks - Get all perks for a retailer
router.get('/', (req, res) => {
  try {
    const { storeId, status, scheduleType } = req.query;
    
    let filteredPerks = perksStorage;
    
    // Filter by store if provided
    if (storeId) {
      filteredPerks = filteredPerks.filter(perk => perk.storeId === storeId);
    }
    
    // Filter by status
    if (status === 'active') {
      filteredPerks = filteredPerks.filter(perk => perk.isActive);
    } else if (status === 'inactive') {
      filteredPerks = filteredPerks.filter(perk => !perk.isActive);
    }
    
    // Filter by schedule type
    if (scheduleType) {
      filteredPerks = filteredPerks.filter(perk => perk.schedule.type === scheduleType);
    }
    
    // Sort by creation date, newest first
    filteredPerks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      perks: filteredPerks,
      count: filteredPerks.length
    });
  } catch (error) {
    console.error('Error fetching perks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch perks'
    });
  }
});

// POST /api/retailer-perks - Create a new perk
router.post('/', (req, res) => {
  try {
    const perkData = {
      ...req.body,
      id: req.body.id || `perk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      storeId: req.body.storeId || 'store_1', // Default store
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentUsage: 0
    };
    
    // Validate required fields
    if (!perkData.title || !perkData.type || !perkData.schedule) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, type, schedule'
      });
    }
    
    // Add to storage
    perksStorage.push(perkData);
    
    console.log('✅ Created new perk:', {
      id: perkData.id,
      title: perkData.title,
      type: perkData.type,
      value: perkData.value,
      schedule: perkData.schedule.type
    });
    
    res.json({
      success: true,
      perk: perkData,
      message: 'Perk created successfully'
    });
  } catch (error) {
    console.error('Error creating perk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create perk'
    });
  }
});

// PUT /api/retailer-perks - Update an existing perk
router.put('/', (req, res) => {
  try {
    const perkData = req.body;
    
    if (!perkData.id) {
      return res.status(400).json({
        success: false,
        error: 'Perk ID is required for updates'
      });
    }
    
    const perkIndex = perksStorage.findIndex(p => p.id === perkData.id);
    
    if (perkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Perk not found'
      });
    }
    
    // Update the perk
    perksStorage[perkIndex] = {
      ...perksStorage[perkIndex],
      ...perkData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Updated perk:', {
      id: perkData.id,
      title: perkData.title
    });
    
    res.json({
      success: true,
      perk: perksStorage[perkIndex],
      message: 'Perk updated successfully'
    });
  } catch (error) {
    console.error('Error updating perk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update perk'
    });
  }
});

// DELETE /api/retailer-perks/:id - Delete a perk
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const perkIndex = perksStorage.findIndex(p => p.id === id);
    
    if (perkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Perk not found'
      });
    }
    
    const deletedPerk = perksStorage.splice(perkIndex, 1)[0];
    
    console.log('✅ Deleted perk:', {
      id: deletedPerk.id,
      title: deletedPerk.title
    });
    
    res.json({
      success: true,
      message: 'Perk deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting perk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete perk'
    });
  }
});

// PATCH /api/retailer-perks/:id/toggle - Toggle perk active status
router.patch('/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const perkIndex = perksStorage.findIndex(p => p.id === id);
    
    if (perkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Perk not found'
      });
    }
    
    perksStorage[perkIndex].isActive = isActive;
    perksStorage[perkIndex].updatedAt = new Date().toISOString();
    
    console.log('✅ Toggled perk status:', {
      id: id,
      isActive: isActive
    });
    
    res.json({
      success: true,
      perk: perksStorage[perkIndex],
      message: `Perk ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling perk status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle perk status'
    });
  }
});

// GET /api/retailer-perks/check-eligibility - Check if trip is eligible for perks
router.get('/check-eligibility', (req, res) => {
  try {
    const { tripId, cartValue, participants, storeId } = req.query;
    
    if (!tripId || !cartValue || !participants) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: tripId, cartValue, participants'
      });
    }
    
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    // Find eligible perks
    const eligiblePerks = perksStorage.filter(perk => {
      // Must be active
      if (!perk.isActive) return false;
      
      // Store match
      if (storeId && perk.storeId !== storeId) return false;
      
      // Usage limit check
      if (perk.usageLimit && perk.currentUsage >= perk.usageLimit) return false;
      
      // Date range check
      const startDate = new Date(perk.schedule.startDate);
      const endDate = perk.schedule.endDate ? new Date(perk.schedule.endDate) : null;
      
      if (now < startDate || (endDate && now > endDate)) return false;
      
      // Schedule type check
      if (perk.schedule.type === 'weekly' && perk.schedule.daysOfWeek) {
        if (!perk.schedule.daysOfWeek.includes(dayOfWeek)) return false;
      }
      
      // Trigger checks
      if (perk.triggers.minCartValue && parseFloat(cartValue) < perk.triggers.minCartValue) {
        return false;
      }
      
      if (perk.triggers.minParticipants && parseInt(participants) < perk.triggers.minParticipants) {
        return false;
      }
      
      return true;
    });
    
    console.log('🎯 Checked perk eligibility:', {
      tripId,
      cartValue,
      participants,
      eligiblePerks: eligiblePerks.length
    });
    
    res.json({
      success: true,
      tripId,
      eligiblePerks: eligiblePerks.map(perk => ({
        id: perk.id,
        title: perk.title,
        description: perk.description,
        type: perk.type,
        value: perk.value,
        unit: perk.unit
      })),
      count: eligiblePerks.length
    });
  } catch (error) {
    console.error('Error checking perk eligibility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check perk eligibility'
    });
  }
});

// POST /api/retailer-perks/apply - Apply a perk to a trip
router.post('/apply', (req, res) => {
  try {
    const { perkId, tripId, cartValue } = req.body;
    
    if (!perkId || !tripId || !cartValue) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: perkId, tripId, cartValue'
      });
    }
    
    const perkIndex = perksStorage.findIndex(p => p.id === perkId);
    
    if (perkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Perk not found'
      });
    }
    
    const perk = perksStorage[perkIndex];
    
    // Check if perk is still eligible
    if (!perk.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Perk is no longer active'
      });
    }
    
    if (perk.usageLimit && perk.currentUsage >= perk.usageLimit) {
      return res.status(400).json({
        success: false,
        error: 'Perk usage limit reached'
      });
    }
    
    // Calculate discount/benefit
    let discountAmount = 0;
    let spiralBonus = 0;
    
    switch (perk.type) {
      case 'discount':
        if (perk.unit === 'percent') {
          discountAmount = (parseFloat(cartValue) * perk.value) / 100;
        } else if (perk.unit === 'dollar') {
          discountAmount = perk.value;
        }
        break;
      case 'cashback':
        discountAmount = perk.value;
        break;
      case 'spiralBonus':
        spiralBonus = perk.value;
        break;
    }
    
    // Update usage count
    perksStorage[perkIndex].currentUsage += 1;
    perksStorage[perkIndex].updatedAt = new Date().toISOString();
    
    console.log('✅ Applied perk to trip:', {
      perkId,
      tripId,
      discountAmount,
      spiralBonus,
      usage: perksStorage[perkIndex].currentUsage
    });
    
    res.json({
      success: true,
      perk: {
        id: perk.id,
        title: perk.title,
        type: perk.type
      },
      benefit: {
        discountAmount: discountAmount.toFixed(2),
        spiralBonus,
        originalCartValue: cartValue,
        finalCartValue: (parseFloat(cartValue) - discountAmount).toFixed(2)
      },
      message: 'Perk applied successfully'
    });
  } catch (error) {
    console.error('Error applying perk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to apply perk'
    });
  }
});

// GET /api/retailer-perks/analytics - Get perk analytics
router.get('/analytics', (req, res) => {
  try {
    const { storeId, startDate, endDate } = req.query;
    
    let analyticsPerks = perksStorage;
    
    // Filter by store
    if (storeId) {
      analyticsPerks = analyticsPerks.filter(perk => perk.storeId === storeId);
    }
    
    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      analyticsPerks = analyticsPerks.filter(perk => {
        const created = new Date(perk.createdAt);
        return created >= start && created <= end;
      });
    }
    
    const analytics = {
      totalPerks: analyticsPerks.length,
      activePerks: analyticsPerks.filter(p => p.isActive).length,
      totalUsage: analyticsPerks.reduce((sum, perk) => sum + perk.currentUsage, 0),
      avgUsagePerPerk: analyticsPerks.length > 0 
        ? (analyticsPerks.reduce((sum, perk) => sum + perk.currentUsage, 0) / analyticsPerks.length).toFixed(1)
        : 0,
      perksByType: analyticsPerks.reduce((acc, perk) => {
        acc[perk.type] = (acc[perk.type] || 0) + 1;
        return acc;
      }, {}),
      mostUsedPerks: analyticsPerks
        .sort((a, b) => b.currentUsage - a.currentUsage)
        .slice(0, 5)
        .map(perk => ({
          id: perk.id,
          title: perk.title,
          usage: perk.currentUsage,
          type: perk.type
        }))
    };
    
    res.json({
      success: true,
      analytics,
      period: { startDate, endDate }
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate analytics'
    });
  }
});

export default router;