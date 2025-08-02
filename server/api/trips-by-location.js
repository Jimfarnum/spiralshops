import express from 'express';
const router = express.Router();

// Import the trips data from invite-trip module
// Note: In production, this would be a database query
async function getSharedTripsData() {
  try {
    const { getTripsData } = await import('./invite-trip.js');
    return getTripsData();
  } catch (error) {
    console.error('Error importing trips data:', error);
    return new Map();
  }
}

router.get("/trips-by-location", async (req, res) => {
  try {
    const { mallId, storeId } = req.query;
    const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    
    // Get all trips from the shared storage
    const tripsData = await getSharedTripsData();
    const allTrips = Array.from(tripsData.values());
    
    console.log('DEBUG: Total trips in storage:', allTrips.length);
    console.log('DEBUG: Filter params - mallId:', mallId, 'storeId:', storeId, 'today:', today);
    
    if (allTrips.length > 0) {
      console.log('DEBUG: Sample trip:', JSON.stringify(allTrips[0], null, 2));
    }
    
    // Filter trips by location and date
    const filtered = allTrips.filter(trip => {
      const tripDate = trip.createdAt ? trip.createdAt.slice(0, 10) : '';
      const matchesDate = tripDate === today;
      const matchesMall = !mallId || trip.mallId === mallId;
      const matchesStore = !storeId || trip.storeId === storeId;
      
      return matchesDate && matchesMall && matchesStore && trip.status === 'active';
    });

    // Add additional trip details for retailer dashboard
    const enrichedTrips = filtered.map(trip => {
      console.log('Processing trip:', trip.tripId, 'cartItems type:', typeof trip.cartItems, 'cartItems:', trip.cartItems);
      
      return {
        tripId: trip.tripId,
        tripName: trip.tripName,
        hostUserId: trip.hostUserId,
        participants: Array.isArray(trip.participants) ? trip.participants.length : 1,
        maxParticipants: trip.maxParticipants,
        cartItems: trip.cartItems || [],
        status: trip.status,
        createdAt: trip.createdAt,
        expiresAt: trip.expiresAt,
        estimatedValue: trip.cartItems ? Object.values(trip.cartItems).reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 1;
          return sum + (price * quantity);
        }, 0) : 0,
        potentialCustomers: Array.isArray(trip.participants) ? trip.participants.length : 1,
        isActive: new Date() < new Date(trip.expiresAt)
      };
    });

    res.json({ 
      success: true,
      trips: enrichedTrips,
      total: enrichedTrips.length,
      date: today,
      filters: { mallId, storeId }
    });
    
  } catch (error) {
    console.error('Error fetching trips by location:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trips by location',
      trips: []
    });
  }
});

// Get trip statistics for retailer dashboard
router.get("/trip-stats", async (req, res) => {
  try {
    const { mallId, storeId } = req.query;
    const today = new Date().toISOString().slice(0, 10);
    
    const tripsData = await getSharedTripsData();
    const allTrips = Array.from(tripsData.values());
    const todayTrips = allTrips.filter(trip => {
      const tripDate = trip.createdAt ? trip.createdAt.slice(0, 10) : '';
      const matchesDate = tripDate === today;
      const matchesMall = !mallId || trip.mallId === mallId;
      const matchesStore = !storeId || trip.storeId === storeId;
      
      return matchesDate && matchesMall && matchesStore;
    });

    const stats = {
      totalTrips: todayTrips.length,
      activeTrips: todayTrips.filter(t => t.status === 'active').length,
      totalParticipants: todayTrips.reduce((sum, t) => sum + t.participants.length, 0),
      estimatedRevenue: todayTrips.reduce((sum, t) => 
        sum + (t.cartItems ? Object.values(t.cartItems).reduce((itemSum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 1;
          return itemSum + (price * quantity);
        }, 0) : 0), 0
      ),
      averageCartValue: todayTrips.length > 0 ? 
        todayTrips.reduce((sum, t) => sum + (t.cartItems ? Object.values(t.cartItems).reduce((itemSum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 1;
          return itemSum + (price * quantity);
        }, 0) : 0), 0) / todayTrips.length : 0
    };

    res.json({
      success: true,
      stats,
      date: today
    });
    
  } catch (error) {
    console.error('Error fetching trip stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trip statistics'
    });
  }
});

export default router;