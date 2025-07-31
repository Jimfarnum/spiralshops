// SPIRAL Centers Network API Routes
// Provides logistics hub management, network routing, and shipment tracking

import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc, asc } from 'drizzle-orm';
import { storage } from '../storage.js';
import { spiralCenters, spiralCenterRoutes, spiralShipments, spiralCenterInventory, orders } from '../../shared/schema.js';
import { nanoid } from 'nanoid';

const router = Router();

// Validation schemas
const createCenterSchema = z.object({
  name: z.string().min(1, "Center name is required"),
  code: z.string().length(3, "Center code must be 3 characters").toUpperCase(),
  type: z.enum(['mall', 'mainstreet', 'hub', 'distribution']),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().min(5, "Valid ZIP code required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  mallId: z.number().optional(),
  capacity: z.number().min(100).default(1000),
  operatingHours: z.string().default("8AM-8PM"),
  services: z.array(z.string()).default(['pickup', 'delivery']),
  managerName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const createShipmentSchema = z.object({
  orderId: z.number(),
  fromCenterId: z.number(),
  toCenterId: z.number(),
  shipmentType: z.enum(['standard', 'express', 'same-day']).default('standard'),
  finalDeliveryMethod: z.enum(['pickup', 'local-delivery', 'same-day']).default('pickup'),
  recipientAddress: z.string().optional(),
  recipientName: z.string(),
  packageCount: z.number().min(1).default(1),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  specialInstructions: z.string().optional(),
});

// GET /api/spiral-centers - Get all SPIRAL Centers with filtering
router.get('/', async (req, res) => {
  try {
    const { type, city, state, status, mallId } = req.query;
    
    // Mock SPIRAL Centers data for demo
    const mockCenters = [
      {
        id: 1,
        name: "SPIRAL Center Minneapolis",
        code: "MSP",
        type: "mall",
        address: "900 Nicollet Mall",
        city: "Minneapolis",
        state: "MN",
        zipCode: "55402",
        latitude: "44.9778",
        longitude: "-93.2650",
        mallId: 1,
        capacity: 1500,
        operatingHours: "8AM-9PM",
        services: ["pickup", "delivery", "returns", "same-day"],
        status: "active",
        managerName: "Sarah Johnson",
        phone: "(612) 555-0123",
        email: "sarah.johnson@spiral.com",
        currentInventory: 87,
        weeklyShipments: 245,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "SPIRAL Hub St. Paul",
        code: "STP",
        type: "mainstreet",
        address: "345 Main Street",
        city: "St. Paul",
        state: "MN",
        zipCode: "55101",
        latitude: "44.9537",
        longitude: "-93.0900",
        mallId: null,
        capacity: 800,
        operatingHours: "9AM-7PM",
        services: ["pickup", "delivery", "returns"],
        status: "active",
        managerName: "Mike Chen",
        phone: "(651) 555-0456",
        email: "mike.chen@spiral.com",
        currentInventory: 43,
        weeklyShipments: 156,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "SPIRAL Distribution Bloomington",
        code: "BLM",
        type: "distribution",
        address: "8100 24th Avenue South",
        city: "Bloomington",
        state: "MN",
        zipCode: "55425",
        latitude: "44.8548",
        longitude: "-93.2496",
        mallId: 2,
        capacity: 2500,
        operatingHours: "6AM-10PM",
        services: ["pickup", "delivery", "returns", "same-day", "express"],
        status: "active",
        managerName: "Lisa Rodriguez",
        phone: "(952) 555-0789",
        email: "lisa.rodriguez@spiral.com",
        currentInventory: 156,
        weeklyShipments: 389,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "SPIRAL Center Chicago Loop",
        code: "CHI",
        type: "mall",
        address: "835 N Michigan Ave",
        city: "Chicago",
        state: "IL",
        zipCode: "60611",
        latitude: "41.8989",
        longitude: "-87.6247",
        mallId: 3,
        capacity: 2000,
        operatingHours: "8AM-9PM",
        services: ["pickup", "delivery", "returns", "same-day"],
        status: "active",
        managerName: "David Park",
        phone: "(312) 555-0321",
        email: "david.park@spiral.com",
        currentInventory: 201,
        weeklyShipments: 567,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date(),
      }
    ];

    // Apply filters
    let filteredCenters = mockCenters;
    if (type) filteredCenters = filteredCenters.filter(center => center.type === type);
    if (city) filteredCenters = filteredCenters.filter(center => center.city.toLowerCase().includes((city as string).toLowerCase()));
    if (state) filteredCenters = filteredCenters.filter(center => center.state === state);
    if (status) filteredCenters = filteredCenters.filter(center => center.status === status);
    if (mallId) filteredCenters = filteredCenters.filter(center => center.mallId === parseInt(mallId as string));

    res.json({
      success: true,
      centers: filteredCenters,
      totalCount: filteredCenters.length,
      networkStats: {
        totalCenters: mockCenters.length,
        activeCenters: mockCenters.filter(c => c.status === 'active').length,
        totalCapacity: mockCenters.reduce((sum, c) => sum + c.capacity, 0),
        averageUtilization: "67%",
        weeklyShipments: mockCenters.reduce((sum, c) => sum + c.weeklyShipments, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching SPIRAL Centers:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch SPIRAL Centers' 
    });
  }
});

// GET /api/spiral-centers/:id - Get specific center details
router.get('/:id', async (req, res) => {
  try {
    const centerId = parseInt(req.params.id);
    
    // Mock detailed center data
    const centerDetails = {
      id: centerId,
      name: "SPIRAL Center Minneapolis",
      code: "MSP",
      type: "mall",
      address: "900 Nicollet Mall",
      city: "Minneapolis",
      state: "MN",
      zipCode: "55402",
      latitude: "44.9778",
      longitude: "-93.2650",
      mallId: 1,
      mallName: "Nicollet Mall",
      capacity: 1500,
      currentInventory: 87,
      operatingHours: "8AM-9PM",
      services: ["pickup", "delivery", "returns", "same-day"],
      status: "active",
      managerName: "Sarah Johnson",
      phone: "(612) 555-0123",
      email: "sarah.johnson@spiral.com",
      recentShipments: [
        {
          id: 1,
          trackingNumber: "SP2025013100001",
          status: "delivered",
          destination: "St. Paul Hub",
          deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 2,
          trackingNumber: "SP2025013100002", 
          status: "in-transit",
          destination: "Chicago Loop",
          estimatedArrival: new Date(Date.now() + 4 * 60 * 60 * 1000)
        },
        {
          id: 3,
          trackingNumber: "SP2025013100003",
          status: "pickup-ready",
          customerName: "John Smith",
          readyAt: new Date(Date.now() - 30 * 60 * 1000)
        }
      ],
      weeklyStats: {
        packagesProcessed: 245,
        deliveriesCompleted: 198,
        pickupsCompleted: 47,
        averageProcessingTime: "2.3 hours",
        customerSatisfaction: "96%"
      }
    };

    res.json({
      success: true,
      center: centerDetails
    });
  } catch (error) {
    console.error('Error fetching center details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch center details' 
    });
  }
});

// GET /api/spiral-centers/routes/:fromId/:toId - Get route between centers
router.get('/routes/:fromId/:toId', async (req, res) => {
  try {
    const fromId = parseInt(req.params.fromId);
    const toId = parseInt(req.params.toId);
    
    // Mock route data
    const routeData = {
      id: 1,
      fromCenterId: fromId,
      toCenterId: toId,
      fromCenter: "SPIRAL Center Minneapolis",
      toCenter: "SPIRAL Hub St. Paul",
      distance: "12.4",
      transportTime: "2.5 hours",
      method: "ground",
      frequency: "daily",
      cost: "25.50",
      status: "active",
      nextScheduledTransport: new Date(Date.now() + 6 * 60 * 60 * 1000),
      weeklyFrequency: 7,
      averagePackages: 45
    };

    res.json({
      success: true,
      route: routeData
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch route information' 
    });
  }
});

// POST /api/spiral-centers/shipments - Create new shipment
router.post('/shipments', async (req, res) => {
  try {
    const validatedData = createShipmentSchema.parse(req.body);
    const trackingNumber = `SP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${nanoid(5).toUpperCase()}`;
    
    // Mock shipment creation
    const newShipment = {
      id: Math.floor(Math.random() * 10000),
      trackingNumber,
      ...validatedData,
      status: 'pending',
      estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      shipment: newShipment,
      message: `Shipment ${trackingNumber} created successfully`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error creating shipment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create shipment' 
    });
  }
});

// GET /api/spiral-centers/shipments/track/:trackingNumber - Track shipment
router.get('/shipments/track/:trackingNumber', async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    
    // Mock tracking data
    const trackingData = {
      trackingNumber,
      orderId: 12345,
      status: "in-transit",
      shipmentType: "standard",
      fromCenter: {
        id: 1,
        name: "SPIRAL Center Minneapolis",
        code: "MSP",
        city: "Minneapolis",
        state: "MN"
      },
      toCenter: {
        id: 2,
        name: "SPIRAL Hub St. Paul", 
        code: "STP",
        city: "St. Paul",
        state: "MN"
      },
      finalDeliveryMethod: "pickup",
      recipientName: "John Smith",
      packageCount: 2,
      weight: "3.5",
      estimatedArrival: new Date(Date.now() + 4 * 60 * 60 * 1000),
      trackingHistory: [
        {
          status: "pending",
          description: "Shipment created and assigned to network",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          location: "Minneapolis, MN"
        },
        {
          status: "processing",
          description: "Package prepared for transport",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          location: "SPIRAL Center Minneapolis"
        },
        {
          status: "in-transit",
          description: "In transit to destination center",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          location: "Highway 94 East"
        }
      ]
    };

    res.json({
      success: true,
      tracking: trackingData
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track shipment' 
    });
  }
});

// GET /api/spiral-centers/network-map - Get network visualization data
router.get('/network-map', async (req, res) => {
  try {
    // Mock network map data
    const networkData = {
      centers: [
        { id: 1, name: "Minneapolis", code: "MSP", lat: 44.9778, lng: -93.2650, type: "mall", packages: 87 },
        { id: 2, name: "St. Paul", code: "STP", lat: 44.9537, lng: -93.0900, type: "mainstreet", packages: 43 },
        { id: 3, name: "Bloomington", code: "BLM", lat: 44.8548, lng: -93.2496, type: "distribution", packages: 156 },
        { id: 4, name: "Chicago", code: "CHI", lat: 41.8989, lng: -87.6247, type: "mall", packages: 201 }
      ],
      routes: [
        { from: 1, to: 2, distance: 12.4, frequency: "daily", activeShipments: 5 },
        { from: 1, to: 3, distance: 15.8, frequency: "daily", activeShipments: 8 },
        { from: 2, to: 3, distance: 18.2, frequency: "daily", activeShipments: 3 },
        { from: 3, to: 4, distance: 408.5, frequency: "daily", activeShipments: 12 }
      ],
      activeShipments: 28,
      networkHealth: "excellent",
      averageDeliveryTime: "18.5 hours",
      onTimePercentage: "96.2%"
    };

    res.json({
      success: true,
      network: networkData
    });
  } catch (error) {
    console.error('Error fetching network map:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch network map' 
    });
  }
});

export default router;