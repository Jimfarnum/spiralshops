import type { Express } from "express";

interface MallEventWithDetails {
  id: number;
  mallId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  imageUrl: string | null;
  eventType: string;
  location: string;
  maxRsvp: number;
  currentRsvp: number;
  rewardPoints: number;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
  mall: {
    name: string;
    location: string;
    rating: number;
  };
  userRsvpStatus?: string | null;
}

interface EventRsvpWithUser {
  id: number;
  eventId: number;
  userId: string;
  status: string;
  rsvpedAt: string;
  attendedAt: string | null;
  rewardClaimed: boolean;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}

// Mock events data for demonstration
const mockEvents: MallEventWithDetails[] = [
  {
    id: 1,
    mallId: "1",
    title: "Holiday Fashion Show & Styling Workshop",
    description: "Join local designers and stylists for an exclusive fashion show featuring winter collections from our boutique retailers. Get personalized styling tips, enjoy complimentary refreshments, and discover the latest trends. Special discounts available for attendees from participating stores.",
    startTime: "2025-01-25T18:00:00Z",
    endTime: "2025-01-25T20:00:00Z",
    imageUrl: "/api/placeholder/600/400",
    eventType: "Fashion",
    location: "Main Plaza",
    maxRsvp: 80,
    currentRsvp: 23,
    rewardPoints: 15,
    isApproved: true,
    isPublished: true,
    createdAt: "2025-01-18T10:00:00Z",
    mall: {
      name: "Downtown Shopping Center",
      location: "Downtown District",
      rating: 4.6
    }
  },
  {
    id: 2,
    mallId: "2",
    title: "Kids' Science Discovery Day",
    description: "An interactive science adventure for children ages 5-12! Hands-on experiments, meet local educators, and explore STEM activities designed to spark curiosity. Parents can enjoy coffee and networking while kids learn and play in a safe, supervised environment.",
    startTime: "2025-01-26T14:00:00Z",
    endTime: "2025-01-26T16:00:00Z",
    imageUrl: "/api/placeholder/600/400",
    eventType: "Kids",
    location: "Community Center",
    maxRsvp: 60,
    currentRsvp: 45,
    rewardPoints: 12,
    isApproved: true,
    isPublished: true,
    createdAt: "2025-01-16T14:30:00Z",
    mall: {
      name: "Family Plaza Mall",
      location: "Suburbs",
      rating: 4.8
    }
  },
  {
    id: 3,
    mallId: "1",
    title: "Tech Innovation Showcase",
    description: "Discover the latest in consumer technology with demonstrations from local tech retailers. See cutting-edge gadgets, smart home solutions, and get expert advice on digital lifestyle upgrades. Special launch discounts and door prizes throughout the event.",
    startTime: "2025-01-28T16:00:00Z",
    endTime: "2025-01-28T19:00:00Z",
    imageUrl: "/api/placeholder/600/400",
    eventType: "Technology",
    location: "Tech Hub Wing",
    maxRsvp: 100,
    currentRsvp: 67,
    rewardPoints: 20,
    isApproved: true,
    isPublished: true,
    createdAt: "2025-01-15T09:15:00Z",
    mall: {
      name: "Downtown Shopping Center",
      location: "Downtown District",
      rating: 4.6
    }
  },
  {
    id: 4,
    mallId: "3",
    title: "Local Food & Wine Tasting",
    description: "Sample artisanal foods and wines from our local restaurant partners and specialty food stores. Meet the chefs, learn about locally-sourced ingredients, and enjoy an evening of culinary discovery. Must be 21+ for wine tastings.",
    startTime: "2025-01-30T19:00:00Z",
    endTime: "2025-01-30T21:30:00Z",
    imageUrl: "/api/placeholder/600/400",
    eventType: "Food & Beverage",
    location: "Food Court",
    maxRsvp: 50,
    currentRsvp: 32,
    rewardPoints: 25,
    isApproved: false, // Pending approval
    isPublished: false,
    createdAt: "2025-01-20T11:00:00Z",
    mall: {
      name: "Westside Marketplace",
      location: "West End",
      rating: 4.4
    }
  },
  {
    id: 5,
    mallId: "2",
    title: "Live Music & Local Artists Night",
    description: "Enjoy live performances from local musicians and artists while exploring our unique retail shops. Support local talent, discover new music, and shop with special evening discounts. Light refreshments will be available.",
    startTime: "2025-02-01T18:30:00Z",
    endTime: "2025-02-01T21:00:00Z",
    imageUrl: "/api/placeholder/600/400",
    eventType: "Music & Arts",
    location: "Main Atrium",
    maxRsvp: 120,
    currentRsvp: 8,
    rewardPoints: 18,
    isApproved: true,
    isPublished: true,
    createdAt: "2025-01-19T16:45:00Z",
    mall: {
      name: "Family Plaza Mall",
      location: "Suburbs",
      rating: 4.8
    }
  }
];

const mockRsvps: EventRsvpWithUser[] = [
  {
    id: 1,
    eventId: 1,
    userId: "1",
    status: "confirmed",
    rsvpedAt: "2025-01-20T10:30:00Z",
    attendedAt: null,
    rewardClaimed: false,
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com"
    }
  },
  {
    id: 2,
    eventId: 1,
    userId: "2",
    status: "confirmed",
    rsvpedAt: "2025-01-21T14:15:00Z",
    attendedAt: null,
    rewardClaimed: false,
    user: {
      firstName: "Mike",
      lastName: "Chen",
      email: "mike.chen@example.com"
    }
  },
  {
    id: 3,
    eventId: 2,
    userId: "1",
    status: "attended",
    rsvpedAt: "2025-01-18T09:20:00Z",
    attendedAt: "2025-01-26T14:00:00Z",
    rewardClaimed: true,
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com"
    }
  }
];

export function registerEventsRoutes(app: Express) {
  // Get all published events with filtering
  app.get('/api/events', async (req, res) => {
    try {
      const { 
        eventType, 
        mallId, 
        location, 
        upcoming = 'true',
        sort = 'date',
        limit = 20,
        search 
      } = req.query;
      
      let filteredEvents = mockEvents.filter(event => 
        event.isApproved && event.isPublished
      );
      
      // Filter by event type
      if (eventType) {
        filteredEvents = filteredEvents.filter(event => 
          event.eventType.toLowerCase().includes((eventType as string).toLowerCase())
        );
      }
      
      // Filter by mall
      if (mallId) {
        filteredEvents = filteredEvents.filter(event => 
          event.mallId === mallId
        );
      }
      
      // Filter by location
      if (location) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.toLowerCase().includes((location as string).toLowerCase()) ||
          event.mall.location.toLowerCase().includes((location as string).toLowerCase())
        );
      }
      
      // Filter upcoming events
      if (upcoming === 'true') {
        const now = new Date();
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startTime) > now
        );
      }
      
      // Search functionality
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.eventType.toLowerCase().includes(searchTerm) ||
          event.mall.name.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort events
      if (sort === 'date') {
        filteredEvents.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      } else if (sort === 'popular') {
        filteredEvents.sort((a, b) => b.currentRsvp - a.currentRsvp);
      } else if (sort === 'rewards') {
        filteredEvents.sort((a, b) => b.rewardPoints - a.rewardPoints);
      }
      
      const limitedEvents = filteredEvents.slice(0, Number(limit));
      
      res.json({
        success: true,
        events: limitedEvents,
        total: filteredEvents.length
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  // Get single event by ID
  app.get('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.headers['user-id']; // Mock auth
      
      const event = mockEvents.find(e => 
        e.id === Number(id) && e.isApproved && e.isPublished
      );
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      // Check user RSVP status
      let userRsvpStatus = null;
      if (userId) {
        const userRsvp = mockRsvps.find(r => 
          r.eventId === Number(id) && r.userId === userId
        );
        userRsvpStatus = userRsvp?.status || null;
      }
      
      res.json({
        success: true,
        event: {
          ...event,
          userRsvpStatus
        }
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  });

  // RSVP to an event
  app.post('/api/events/:id/rsvp', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.headers['user-id'] || '1'; // Mock auth
      
      const event = mockEvents.find(e => 
        e.id === Number(id) && e.isApproved && e.isPublished
      );
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      // Check if event is full
      if (event.currentRsvp >= event.maxRsvp) {
        return res.status(400).json({ error: 'Event is full' });
      }
      
      // Check if user already has RSVP
      const existingRsvp = mockRsvps.find(r => 
        r.eventId === Number(id) && r.userId === userId
      );
      
      if (existingRsvp && existingRsvp.status !== 'cancelled') {
        return res.status(400).json({ error: 'Already RSVP\'d to this event' });
      }
      
      // Create new RSVP
      const newRsvp: EventRsvpWithUser = {
        id: mockRsvps.length + 1,
        eventId: Number(id),
        userId,
        status: 'confirmed',
        rsvpedAt: new Date().toISOString(),
        attendedAt: null,
        rewardClaimed: false,
        user: {
          firstName: "Current",
          lastName: "User",
          email: "user@example.com"
        }
      };
      
      mockRsvps.push(newRsvp);
      event.currentRsvp++;
      
      res.json({
        success: true,
        rsvp: newRsvp,
        message: 'Successfully RSVP\'d to event!'
      });
    } catch (error) {
      console.error('Error creating RSVP:', error);
      res.status(500).json({ error: 'Failed to RSVP to event' });
    }
  });

  // Cancel RSVP
  app.delete('/api/events/:id/rsvp', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.headers['user-id'] || '1'; // Mock auth
      
      const rsvp = mockRsvps.find(r => 
        r.eventId === Number(id) && r.userId === userId
      );
      
      if (!rsvp || rsvp.status === 'cancelled') {
        return res.status(404).json({ error: 'RSVP not found' });
      }
      
      // Update RSVP status
      rsvp.status = 'cancelled';
      
      // Update event count
      const event = mockEvents.find(e => e.id === Number(id));
      if (event) {
        event.currentRsvp = Math.max(0, event.currentRsvp - 1);
      }
      
      res.json({
        success: true,
        message: 'RSVP cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling RSVP:', error);
      res.status(500).json({ error: 'Failed to cancel RSVP' });
    }
  });

  // Get user's RSVPs
  app.get('/api/users/:userId/rsvps', async (req, res) => {
    try {
      const { userId } = req.params;
      const { status = 'all' } = req.query;
      
      let userRsvps = mockRsvps.filter(r => r.userId === userId);
      
      if (status !== 'all') {
        userRsvps = userRsvps.filter(r => r.status === status);
      }
      
      // Add event details to each RSVP
      const rsvpsWithEvents = userRsvps.map(rsvp => {
        const event = mockEvents.find(e => e.id === rsvp.eventId);
        return {
          ...rsvp,
          event
        };
      });
      
      res.json({
        success: true,
        rsvps: rsvpsWithEvents
      });
    } catch (error) {
      console.error('Error fetching user RSVPs:', error);
      res.status(500).json({ error: 'Failed to fetch user RSVPs' });
    }
  });

  // Admin: Create new event
  app.post('/api/admin/events', async (req, res) => {
    try {
      const {
        mallId,
        title,
        description,
        startTime,
        endTime,
        imageUrl,
        eventType,
        location,
        maxRsvp,
        rewardPoints
      } = req.body;
      
      // Validate required fields
      if (!mallId || !title || !description || !startTime || !endTime || !eventType || !location) {
        return res.status(400).json({ 
          error: 'Mall ID, title, description, times, event type, and location are required' 
        });
      }
      
      // Create new event
      const newEvent: MallEventWithDetails = {
        id: mockEvents.length + 1,
        mallId,
        title,
        description,
        startTime,
        endTime,
        imageUrl: imageUrl || null,
        eventType,
        location,
        maxRsvp: maxRsvp || 100,
        currentRsvp: 0,
        rewardPoints: rewardPoints || 10,
        isApproved: false, // Requires approval
        isPublished: false,
        createdAt: new Date().toISOString(),
        mall: {
          name: "New Mall", // Would fetch from malls table
          location: "Various",
          rating: 4.5
        }
      };
      
      mockEvents.push(newEvent);
      
      res.json({
        success: true,
        event: newEvent,
        message: 'Event created successfully and is awaiting approval'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  // Admin: Get pending events
  app.get('/api/admin/events/pending', async (req, res) => {
    try {
      const pendingEvents = mockEvents.filter(event => !event.isApproved);
      
      res.json({
        success: true,
        events: pendingEvents,
        total: pendingEvents.length
      });
    } catch (error) {
      console.error('Error fetching pending events:', error);
      res.status(500).json({ error: 'Failed to fetch pending events' });
    }
  });

  // Admin: Approve/reject event
  app.post('/api/admin/events/:id/moderate', async (req, res) => {
    try {
      const { id } = req.params;
      const { action, published } = req.body; // 'approve' or 'reject'
      
      const event = mockEvents.find(e => e.id === Number(id));
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      if (action === 'approve') {
        event.isApproved = true;
        if (published) {
          event.isPublished = true;
        }
      } else if (action === 'reject') {
        event.isApproved = false;
        event.isPublished = false;
      }
      
      res.json({
        success: true,
        message: `Event ${action}d successfully`,
        event
      });
    } catch (error) {
      console.error('Error moderating event:', error);
      res.status(500).json({ error: 'Failed to moderate event' });
    }
  });

  // Admin: Get event RSVPs
  app.get('/api/admin/events/:id/rsvps', async (req, res) => {
    try {
      const { id } = req.params;
      
      const eventRsvps = mockRsvps.filter(r => 
        r.eventId === Number(id) && r.status !== 'cancelled'
      );
      
      res.json({
        success: true,
        rsvps: eventRsvps,
        total: eventRsvps.length
      });
    } catch (error) {
      console.error('Error fetching event RSVPs:', error);
      res.status(500).json({ error: 'Failed to fetch event RSVPs' });
    }
  });

  // Admin: Mark attendance and award SPIRALs
  app.post('/api/admin/events/:eventId/attendance/:userId', async (req, res) => {
    try {
      const { eventId, userId } = req.params;
      
      const rsvp = mockRsvps.find(r => 
        r.eventId === Number(eventId) && r.userId === userId
      );
      
      if (!rsvp) {
        return res.status(404).json({ error: 'RSVP not found' });
      }
      
      const event = mockEvents.find(e => e.id === Number(eventId));
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      // Mark as attended and award SPIRALs
      rsvp.status = 'attended';
      rsvp.attendedAt = new Date().toISOString();
      rsvp.rewardClaimed = true;
      
      res.json({
        success: true,
        spiralsAwarded: event.rewardPoints,
        message: `Attendance confirmed! ${event.rewardPoints} SPIRALs awarded.`
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
      res.status(500).json({ error: 'Failed to mark attendance' });
    }
  });
}