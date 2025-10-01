import express from 'express';
const router = express.Router();

// In-memory storage for invite trips (in production, use database)
const inviteTrips = new Map();

// Export trips data for sharing with other modules
export function getTripsData() {
  return inviteTrips;
}

// Create a new invite trip
router.post('/invite-trip', (req, res) => {
  try {
    const { userId, cartItems, tripName } = req.body;
    
    if (!userId || !cartItems) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId and cartItems' 
      });
    }

    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const inviteCode = `inv_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    const trip = {
      tripId,
      inviteCode,
      hostUserId: userId,
      tripName: tripName || 'Shopping Trip',
      cartItems,
      participants: [userId],
      maxParticipants: 3, // Host + 2 friends
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      inviteLink: `https://spiralshops.com/invite/${tripId}`,
      mallId: req.body.mallId || 'mall_1', // Default mall for testing
      storeId: req.body.storeId || 'store_1', // Default store for testing
      rewards: {
        spiralsPerInvite: 5,
        totalEarned: 0
      }
    };

    inviteTrips.set(tripId, trip);

    res.json({
      success: true,
      trip: {
        tripId: trip.tripId,
        inviteCode: trip.inviteCode,
        inviteLink: trip.inviteLink,
        expiresAt: trip.expiresAt,
        maxParticipants: trip.maxParticipants,
        currentParticipants: trip.participants.length
      }
    });

  } catch (error) {
    console.error('Error creating invite trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invite trip details
router.get('/invite-trip/:tripId', (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = inviteTrips.get(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if trip has expired
    if (new Date() > new Date(trip.expiresAt)) {
      return res.status(410).json({ error: 'Trip has expired' });
    }

    res.json({
      success: true,
      trip: {
        tripId: trip.tripId,
        tripName: trip.tripName,
        hostUserId: trip.hostUserId,
        participants: trip.participants,
        maxParticipants: trip.maxParticipants,
        status: trip.status,
        cartItems: trip.cartItems,
        createdAt: trip.createdAt,
        expiresAt: trip.expiresAt,
        rewards: trip.rewards
      }
    });

  } catch (error) {
    console.error('Error fetching invite trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join an invite trip
router.post('/invite-trip/:tripId/join', (req, res) => {
  try {
    const { tripId } = req.params;
    const { userId, username } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const trip = inviteTrips.get(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if trip has expired
    if (new Date() > new Date(trip.expiresAt)) {
      return res.status(410).json({ error: 'Trip has expired' });
    }

    // Check if user is already a participant
    if (trip.participants.includes(userId)) {
      return res.status(400).json({ error: 'User already joined this trip' });
    }

    // Check if trip is full
    if (trip.participants.length >= trip.maxParticipants) {
      return res.status(400).json({ error: 'Trip is full' });
    }

    // Add user to participants
    trip.participants.push(userId);
    
    // Award SPIRALs to host
    trip.rewards.totalEarned += trip.rewards.spiralsPerInvite;

    res.json({
      success: true,
      message: 'Successfully joined the trip!',
      trip: {
        tripId: trip.tripId,
        tripName: trip.tripName,
        participants: trip.participants,
        cartItems: trip.cartItems,
        rewards: {
          hostEarned: trip.rewards.totalEarned,
          yourBonus: 'Welcome bonus: 2 SPIRALs for joining!'
        }
      }
    });

  } catch (error) {
    console.error('Error joining invite trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's invite trips
router.get('/user/:userId/invite-trips', (req, res) => {
  try {
    const { userId } = req.params;
    const userTrips = [];

    for (const [tripId, trip] of inviteTrips.entries()) {
      if (trip.hostUserId === userId || trip.participants.includes(userId)) {
        userTrips.push({
          tripId: trip.tripId,
          tripName: trip.tripName,
          isHost: trip.hostUserId === userId,
          participants: trip.participants.length,
          maxParticipants: trip.maxParticipants,
          status: trip.status,
          createdAt: trip.createdAt,
          expiresAt: trip.expiresAt,
          totalEarned: trip.hostUserId === userId ? trip.rewards.totalEarned : 0
        });
      }
    }

    res.json({
      success: true,
      trips: userTrips
    });

  } catch (error) {
    console.error('Error fetching user trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send invite notifications
router.post('/invite-trip/:tripId/send-invites', (req, res) => {
  try {
    const { tripId } = req.params;
    const { emails, socialPlatforms } = req.body;

    const trip = inviteTrips.get(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // In production, integrate with email service and social media APIs
    const invitesSent = {
      emails: emails ? emails.length : 0,
      social: socialPlatforms ? socialPlatforms.length : 0,
      inviteLink: trip.inviteLink,
      message: `You've been invited to join a shopping trip on SPIRAL! Use code: ${trip.inviteCode}`
    };

    res.json({
      success: true,
      invitesSent,
      trip: {
        tripId: trip.tripId,
        inviteLink: trip.inviteLink,
        inviteCode: trip.inviteCode
      }
    });

  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;