import { Router } from "express";
import { storage } from "./storage";

const router = Router();

// Store invite trips in memory for now
const inviteTrips: any[] = [];
const inviteResponses: any[] = [];

// Create new shopping trip invite
router.post("/invite-trip", async (req, res) => {
  try {
    const { userId, shopperName, date, location, invitees, specialOffers } = req.body;

    if (!userId || !date || !location || !invitees?.length) {
      return res.status(400).json({ 
        error: "User ID, date, location, and at least one invitee required" 
      });
    }

    // Generate unique trip ID
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const trip = {
      tripId,
      hostUserId: userId,
      hostName: shopperName || "SPIRAL Shopper",
      date,
      location,
      invitees: invitees.filter((email: string) => email.trim()),
      specialOffers: specialOffers || [],
      status: "pending",
      createdAt: new Date(),
      responses: []
    };

    inviteTrips.push(trip);

    // Send invitations (simulate email notifications)
    const inviteResults = await sendInvitations(trip);

    res.json({
      tripId,
      message: "Shopping trip invites sent successfully!",
      invitesSent: inviteResults.sent,
      invitesFailed: inviteResults.failed,
      specialDeals: generateSpecialDeals(location, trip.invitees.length),
      tripDetails: {
        date: trip.date,
        location: trip.location,
        hostName: trip.hostName,
        totalInvites: trip.invitees.length
      }
    });
  } catch (error: any) {
    console.error("Invite trip error:", error);
    res.status(500).json({ 
      error: "Failed to create shopping trip invite",
      message: error.message 
    });
  }
});

// Respond to trip invitation
router.post("/respond-invite/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { guestName, guestEmail, response, message } = req.body;

    if (!tripId || !guestEmail || !response) {
      return res.status(400).json({ 
        error: "Trip ID, guest email, and response required" 
      });
    }

    const trip = inviteTrips.find(t => t.tripId === tripId);
    if (!trip) {
      return res.status(404).json({ error: "Shopping trip not found" });
    }

    // Check if guest was actually invited
    if (!trip.invitees.includes(guestEmail)) {
      return res.status(403).json({ error: "You were not invited to this trip" });
    }

    // Record response
    const responseRecord = {
      tripId,
      guestName: guestName || "Guest",
      guestEmail,
      response, // 'accept', 'decline', 'maybe'
      message: message || "",
      respondedAt: new Date()
    };

    inviteResponses.push(responseRecord);

    // Update trip responses
    const existingResponseIndex = trip.responses.findIndex((r: any) => r.guestEmail === guestEmail);
    if (existingResponseIndex >= 0) {
      trip.responses[existingResponseIndex] = responseRecord;
    } else {
      trip.responses.push(responseRecord);
    }

    // Generate guest benefits if accepted
    let guestBenefits = null;
    if (response === 'accept') {
      guestBenefits = {
        spiralBonus: 25, // Extra SPIRALs for joining
        sharedDeals: generateGuestDeals(trip.location),
        exclusiveOffers: [
          "Free shipping on orders over $25",
          "10% off local artisan products",
          "Priority checkout lane access"
        ],
        validUntil: trip.date
      };
    }

    res.json({
      message: `Response recorded: ${response}`,
      tripDetails: {
        date: trip.date,
        location: trip.location,
        hostName: trip.hostName
      },
      guestBenefits,
      responseStatus: response,
      totalAccepted: trip.responses.filter((r: any) => r.response === 'accept').length,
      totalResponded: trip.responses.length
    });
  } catch (error: any) {
    console.error("Respond invite error:", error);
    res.status(500).json({ 
      error: "Failed to process invitation response",
      message: error.message 
    });
  }
});

// Get trip details and status
router.get("/trip/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const trip = inviteTrips.find(t => t.tripId === tripId);
    if (!trip) {
      return res.status(404).json({ error: "Shopping trip not found" });
    }

    const tripStatus = {
      ...trip,
      summary: {
        totalInvited: trip.invitees.length,
        totalResponded: trip.responses.length,
        accepted: trip.responses.filter((r: any) => r.response === 'accept').length,
        declined: trip.responses.filter((r: any) => r.response === 'decline').length,
        pending: trip.invitees.length - trip.responses.length
      },
      upcomingBenefits: trip.date >= new Date().toISOString().split('T')[0] ? 
        generateTripBenefits(trip) : null
    };

    res.json(tripStatus);
  } catch (error: any) {
    console.error("Get trip error:", error);
    res.status(500).json({ 
      error: "Failed to retrieve trip details",
      message: error.message 
    });
  }
});

// Get user's trips (as host or guest)
router.get("/user-trips/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Trips where user is the host
    const hostedTrips = inviteTrips.filter(trip => trip.hostUserId === userId);
    
    // Trips where user was invited (need email lookup)
    const user = await storage.getUser(userId);
    const guestTrips = user?.email ? 
      inviteTrips.filter(trip => trip.invitees.includes(user.email)) : [];

    res.json({
      hostedTrips: hostedTrips.map(trip => ({
        ...trip,
        responseCount: trip.responses.length,
        acceptedCount: trip.responses.filter((r: any) => r.response === 'accept').length
      })),
      guestTrips: guestTrips.map(trip => {
        const userResponse = trip.responses.find((r: any) => r.guestEmail === user.email);
        return {
          ...trip,
          userResponse: userResponse?.response || 'pending',
          userMessage: userResponse?.message || null
        };
      })
    });
  } catch (error: any) {
    console.error("Get user trips error:", error);
    res.status(500).json({ 
      error: "Failed to retrieve user trips",
      message: error.message 
    });
  }
});

// Helper Functions

async function sendInvitations(trip: any) {
  const results = { sent: [], failed: [] };
  
  for (const email of trip.invitees) {
    try {
      // Simulate sending email invitation
      const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/invite/${trip.tripId}`;
      
      // In production, this would send real emails
      console.log(`📧 Invitation sent to ${email} for trip to ${trip.location} on ${trip.date}`);
      console.log(`📧 Invite link: ${inviteLink}`);
      
      results.sent.push({
        email,
        inviteLink,
        sentAt: new Date()
      });
    } catch (error) {
      results.failed.push({
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

function generateSpecialDeals(location: string, inviteCount: number) {
  const baseDeals = [
    {
      title: "Group Shopping Bonus",
      description: `Extra ${inviteCount * 5} SPIRALs for bringing friends`,
      code: `GROUP${inviteCount}`,
      discount: inviteCount * 5,
      type: "spiral_bonus"
    },
    {
      title: "Social Shopper Discount",
      description: "15% off when shopping with friends",
      code: "SOCIAL15",
      discount: 15,
      type: "percentage"
    }
  ];

  // Location-specific deals
  if (location.toLowerCase().includes('mall')) {
    baseDeals.push({
      title: "Mall Explorer Special",
      description: "Free food court item with $50+ purchase",
      code: "MALLEXPLORE",
      discount: 0,
      type: "freebie"
    });
  }

  return baseDeals;
}

function generateGuestDeals(location: string) {
  return [
    {
      title: "Friend's Discount",
      description: "10% off your first purchase today",
      code: "FRIEND10",
      discount: 10,
      type: "percentage"
    },
    {
      title: "Welcome SPIRALs",
      description: "Earn double SPIRALs on today's purchases",
      code: "WELCOME2X",
      discount: 100,
      type: "spiral_multiplier"
    },
    {
      title: "Group Perks",
      description: "Free gift wrapping on any purchase",
      code: "GROUPGIFT",
      discount: 0,
      type: "service"
    }
  ];
}

function generateTripBenefits(trip: any) {
  const acceptedCount = trip.responses.filter((r: any) => r.response === 'accept').length;
  
  return {
    groupSize: acceptedCount + 1, // +1 for host
    bonusMultiplier: Math.min(2.0, 1 + (acceptedCount * 0.2)), // Up to 2x multiplier
    exclusiveAccess: acceptedCount >= 2 ? [
      "VIP checkout lane",
      "Personal shopping assistant",
      "Complimentary gift wrapping"
    ] : [
      "Priority customer service",
      "Extended return policy"
    ],
    totalSavingsEstimate: `$${(acceptedCount + 1) * 12}-${(acceptedCount + 1) * 25}`
  };
}

export default router;