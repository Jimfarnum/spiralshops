import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Advanced Logistics Mock Data for Same-Day and Last-Mile Delivery
const deliveryZones = [
  {
    id: 1,
    centerId: 1,
    zoneName: "Express Zone A",
    zipCodes: ["55401", "55402", "55403", "55404", "55405"],
    deliveryType: "2-hour",
    basePrice: "7.99",
    maxDistance: 5,
    estimatedTime: 120,
    priority: 1,
    isActive: true
  },
  {
    id: 2,
    centerId: 1,
    zoneName: "Same-Day Zone B", 
    zipCodes: ["55406", "55407", "55408", "55409", "55410"],
    deliveryType: "same-day",
    basePrice: "4.99",
    maxDistance: 10,
    estimatedTime: 240,
    priority: 2,
    isActive: true
  },
  {
    id: 3,
    centerId: 2,
    zoneName: "Premium Zone C",
    zipCodes: ["55101", "55102", "55103", "55104", "55105"],
    deliveryType: "4-hour",
    basePrice: "5.99",
    maxDistance: 8,
    estimatedTime: 180,
    priority: 1,
    isActive: true
  }
];

const drivers = [
  {
    id: 1,
    centerId: 1,
    driverName: "Alex Johnson",
    phone: "(612) 555-0101",
    email: "alex.johnson@spiral.com",
    vehicleType: "van",
    vehiclePlate: "SPR-001",
    status: "available",
    currentLocation: JSON.stringify({lat: 44.9778, lng: -93.2650, timestamp: Date.now()}),
    todayDeliveries: 12,
    totalDeliveries: 847,
    rating: "4.9",
    isActive: true
  },
  {
    id: 2,
    centerId: 1,
    driverName: "Maria Garcia",
    phone: "(612) 555-0102", 
    email: "maria.garcia@spiral.com",
    vehicleType: "car",
    vehiclePlate: "SPR-002",
    status: "busy",
    currentLocation: JSON.stringify({lat: 44.9537, lng: -93.0900, timestamp: Date.now()}),
    todayDeliveries: 8,
    totalDeliveries: 623,
    rating: "4.8",
    isActive: true
  },
  {
    id: 3,
    centerId: 2,
    driverName: "David Chen",
    phone: "(651) 555-0103",
    email: "david.chen@spiral.com", 
    vehicleType: "scooter",
    vehiclePlate: "SPR-003",
    status: "available",
    currentLocation: JSON.stringify({lat: 44.9537, lng: -93.0900, timestamp: Date.now()}),
    todayDeliveries: 15,
    totalDeliveries: 1204,
    rating: "5.0",
    isActive: true
  },
  {
    id: 4,
    centerId: 1,
    driverName: "Sarah Wilson",
    phone: "(612) 555-0104",
    email: "sarah.wilson@spiral.com",
    vehicleType: "bike",
    vehiclePlate: "SPR-004",
    status: "break",
    currentLocation: JSON.stringify({lat: 44.9778, lng: -93.2650, timestamp: Date.now()}),
    todayDeliveries: 6,
    totalDeliveries: 389,
    rating: "4.7",
    isActive: true
  }
];

const deliveries = [
  {
    id: 1,
    trackingNumber: "SPR-DEL-001",
    centerId: 1,
    driverId: 1,
    zoneId: 1,
    customerName: "Jennifer Smith",
    customerPhone: "(612) 555-1001",
    deliveryAddress: "123 Main St, Minneapolis, MN",
    deliveryZipCode: "55401",
    deliveryType: "2-hour",
    packageCount: 2,
    totalWeight: "3.5",
    deliveryFee: "7.99",
    status: "in-transit",
    scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    pickedUpTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimatedTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    deliveryInstructions: "Leave at front door, ring doorbell",
    photoProof: null,
    customerSignature: null
  },
  {
    id: 2,
    trackingNumber: "SPR-DEL-002",
    centerId: 1,
    driverId: 2,
    zoneId: 2,
    customerName: "Michael Brown",
    customerPhone: "(612) 555-1002",
    deliveryAddress: "456 Oak Ave, Minneapolis, MN",
    deliveryZipCode: "55407",
    deliveryType: "same-day",
    packageCount: 1,
    totalWeight: "1.2",
    deliveryFee: "4.99",
    status: "delivered",
    scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    pickedUpTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    deliveredTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimatedTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    deliveryInstructions: "Hand to customer directly",
    photoProof: "/api/delivery-photos/SPR-DEL-002.jpg",
    customerSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
];

const deliveryRoutes = [
  {
    id: 1,
    driverId: 1,
    routeName: "Route A - Morning Express",
    deliveryIds: ["1", "3", "5"],
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: null,
    totalDistance: "12.8",
    totalDuration: 85,
    status: "active",
    waypoints: JSON.stringify([
      {lat: 44.9778, lng: -93.2650},
      {lat: 44.9537, lng: -93.0900},
      {lat: 44.9537, lng: -93.0900}
    ]),
    currentStop: 1,
    completedDeliveries: 1
  },
  {
    id: 2,
    driverId: 2,
    routeName: "Route B - Same-Day Standard",
    deliveryIds: ["2", "4", "6", "7"],
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    totalDistance: "18.3",
    totalDuration: 142,
    status: "completed",
    waypoints: JSON.stringify([
      {lat: 44.9778, lng: -93.2650},
      {lat: 44.9537, lng: -93.0900}
    ]),
    currentStop: 4,
    completedDeliveries: 4
  }
];

// Delivery Zones Management
router.get('/delivery-zones', (req, res) => {
  const { centerId, deliveryType, isActive } = req.query;
  
  let filteredZones = deliveryZones;
  
  if (centerId) {
    filteredZones = filteredZones.filter(zone => zone.centerId === parseInt(centerId as string));
  }
  
  if (deliveryType) {
    filteredZones = filteredZones.filter(zone => zone.deliveryType === deliveryType);
  }
  
  if (isActive !== undefined) {
    filteredZones = filteredZones.filter(zone => zone.isActive === (isActive === 'true'));
  }
  
  res.json({
    zones: filteredZones,
    totalZones: filteredZones.length,
    activeZones: filteredZones.filter(zone => zone.isActive).length
  });
});

router.post('/delivery-zones', (req, res) => {
  const zoneSchema = z.object({
    centerId: z.number(),
    zoneName: z.string(),
    zipCodes: z.array(z.string()),
    deliveryType: z.enum(['same-day', '2-hour', '4-hour', 'next-day']),
    basePrice: z.string(),
    maxDistance: z.number(),
    estimatedTime: z.number(),
    priority: z.number()
  });

  try {
    const validatedData = zoneSchema.parse(req.body);
    const newZone = {
      id: Math.max(...deliveryZones.map(z => z.id)) + 1,
      ...validatedData,
      isActive: true
    };
    
    deliveryZones.push(newZone);
    res.status(201).json({ zone: newZone, message: 'Delivery zone created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid zone data', details: error });
  }
});

// Driver Management
router.get('/drivers', (req, res) => {
  const { centerId, status, vehicleType } = req.query;
  
  let filteredDrivers = drivers;
  
  if (centerId) {
    filteredDrivers = filteredDrivers.filter(driver => driver.centerId === parseInt(centerId as string));
  }
  
  if (status) {
    filteredDrivers = filteredDrivers.filter(driver => driver.status === status);
  }
  
  if (vehicleType) {
    filteredDrivers = filteredDrivers.filter(driver => driver.vehicleType === vehicleType);
  }
  
  // Calculate driver statistics
  const driverStats = {
    total: filteredDrivers.length,
    available: filteredDrivers.filter(d => d.status === 'available').length,
    busy: filteredDrivers.filter(d => d.status === 'busy').length,
    offDuty: filteredDrivers.filter(d => d.status === 'off-duty').length,
    avgRating: (filteredDrivers.reduce((sum, d) => sum + parseFloat(d.rating), 0) / filteredDrivers.length).toFixed(1),
    totalDeliveriesToday: filteredDrivers.reduce((sum, d) => sum + d.todayDeliveries, 0)
  };
  
  res.json({
    drivers: filteredDrivers,
    stats: driverStats
  });
});

router.put('/drivers/:id/status', (req, res) => {
  const driverId = parseInt(req.params.id);
  const { status, location } = req.body;
  
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  driver.status = status;
  if (location) {
    driver.currentLocation = JSON.stringify(location);
  }
  
  res.json({ driver, message: 'Driver status updated successfully' });
});

// Delivery Management
router.get('/deliveries', (req, res) => {
  const { centerId, status, deliveryType, driverId } = req.query;
  
  let filteredDeliveries = deliveries;
  
  if (centerId) {
    filteredDeliveries = filteredDeliveries.filter(delivery => delivery.centerId === parseInt(centerId as string));
  }
  
  if (status) {
    filteredDeliveries = filteredDeliveries.filter(delivery => delivery.status === status);
  }
  
  if (deliveryType) {
    filteredDeliveries = filteredDeliveries.filter(delivery => delivery.deliveryType === deliveryType);
  }
  
  if (driverId) {
    filteredDeliveries = filteredDeliveries.filter(delivery => delivery.driverId === parseInt(driverId as string));
  }
  
  // Calculate delivery statistics
  const deliveryStats = {
    total: filteredDeliveries.length,
    scheduled: filteredDeliveries.filter(d => d.status === 'scheduled').length,
    inTransit: filteredDeliveries.filter(d => d.status === 'in-transit').length,
    delivered: filteredDeliveries.filter(d => d.status === 'delivered').length,
    failed: filteredDeliveries.filter(d => d.status === 'failed').length,
    avgDeliveryTime: 72, // minutes
    onTimeRate: "94.2%",
    totalRevenue: filteredDeliveries.reduce((sum, d) => sum + parseFloat(d.deliveryFee), 0).toFixed(2)
  };
  
  res.json({
    deliveries: filteredDeliveries,
    stats: deliveryStats
  });
});

router.post('/deliveries', (req, res) => {
  const deliverySchema = z.object({
    centerId: z.number(),
    zoneId: z.number(),
    customerName: z.string(),
    customerPhone: z.string(),
    deliveryAddress: z.string(),
    deliveryZipCode: z.string(),
    deliveryType: z.enum(['same-day', '2-hour', '4-hour']),
    packageCount: z.number(),
    totalWeight: z.string(),
    deliveryFee: z.string(),
    scheduledTime: z.string(),
    deliveryInstructions: z.string().optional()
  });

  try {
    const validatedData = deliverySchema.parse(req.body);
    const newDelivery = {
      id: Math.max(...deliveries.map(d => d.id)) + 1,
      trackingNumber: `SPR-DEL-${String(Math.max(...deliveries.map(d => d.id)) + 1).padStart(3, '0')}`,
      ...validatedData,
      driverId: null,
      status: 'scheduled',
      estimatedTime: new Date(new Date(validatedData.scheduledTime).getTime() + 4 * 60 * 60 * 1000).toISOString(),
      pickedUpTime: null,
      deliveredTime: null,
      photoProof: null,
      customerSignature: null
    };
    
    deliveries.push(newDelivery);
    res.status(201).json({ delivery: newDelivery, message: 'Delivery scheduled successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid delivery data', details: error });
  }
});

router.put('/deliveries/:id/status', (req, res) => {
  const deliveryId = parseInt(req.params.id);
  const { status, driverId, photoProof, customerSignature } = req.body;
  
  const delivery = deliveries.find(d => d.id === deliveryId);
  if (!delivery) {
    return res.status(404).json({ error: 'Delivery not found' });
  }
  
  delivery.status = status;
  if (driverId) delivery.driverId = driverId;
  if (photoProof) delivery.photoProof = photoProof;
  if (customerSignature) delivery.customerSignature = customerSignature;
  
  // Update timestamps based on status
  const now = new Date().toISOString();
  if (status === 'picked-up') {
    delivery.pickedUpTime = now;
  } else if (status === 'delivered') {
    delivery.deliveredTime = now;
  }
  
  res.json({ delivery, message: 'Delivery status updated successfully' });
});

// Route Optimization
router.get('/routes', (req, res) => {
  const { driverId, status } = req.query;
  
  let filteredRoutes = deliveryRoutes;
  
  if (driverId) {
    filteredRoutes = filteredRoutes.filter(route => route.driverId === parseInt(driverId as string));
  }
  
  if (status) {
    filteredRoutes = filteredRoutes.filter(route => route.status === status);
  }
  
  res.json({
    routes: filteredRoutes,
    totalRoutes: filteredRoutes.length,
    activeRoutes: filteredRoutes.filter(r => r.status === 'active').length
  });
});

router.post('/routes/optimize', (req, res) => {
  const { deliveryIds, driverId, startTime } = req.body;
  
  // Simulate route optimization algorithm
  const optimizedRoute = {
    id: Math.max(...deliveryRoutes.map(r => r.id)) + 1,
    driverId,
    routeName: `Optimized Route ${Date.now()}`,
    deliveryIds,
    startTime,
    endTime: null,
    totalDistance: (Math.random() * 20 + 5).toFixed(1),
    totalDuration: Math.floor(Math.random() * 120 + 60),
    status: 'planned',
    waypoints: JSON.stringify([
      {lat: 44.9778, lng: -93.2650},
      {lat: 44.9537, lng: -93.0900}
    ]),
    currentStop: 0,
    completedDeliveries: 0
  };
  
  deliveryRoutes.push(optimizedRoute);
  
  res.json({
    route: optimizedRoute,
    optimization: {
      totalDistance: optimizedRoute.totalDistance + ' miles',
      estimatedDuration: optimizedRoute.totalDuration + ' minutes',
      fuelSavings: '$' + (Math.random() * 15 + 5).toFixed(2),
      efficiency: (85 + Math.random() * 10).toFixed(1) + '%'
    },
    message: 'Route optimized successfully'
  });
});

// Real-time Analytics
router.get('/analytics/real-time', (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const analytics = {
    deliveryMetrics: {
      todayDeliveries: 47,
      inTransit: 12,
      completed: 35,
      avgDeliveryTime: 72,
      onTimeRate: 94.2,
      customerSatisfaction: 4.8
    },
    driverMetrics: {
      activeDrivers: drivers.filter(d => d.status !== 'off-duty').length,
      avgDriverRating: 4.85,
      totalDeliveriesToday: drivers.reduce((sum, d) => sum + d.todayDeliveries, 0),
      utilizationRate: 87.3
    },
    zonePerformance: deliveryZones.map(zone => ({
      zoneName: zone.zoneName,
      deliveryType: zone.deliveryType,
      todayVolume: Math.floor(Math.random() * 20 + 5),
      avgTime: zone.estimatedTime + Math.floor(Math.random() * 30 - 15),
      successRate: 90 + Math.random() * 8
    })),
    revenueMetrics: {
      todayRevenue: '$' + (Math.random() * 500 + 200).toFixed(2),
      avgOrderValue: '$' + (Math.random() * 20 + 30).toFixed(2),
      costPerDelivery: '$' + (Math.random() * 5 + 8).toFixed(2),
      profitMargin: (15 + Math.random() * 10).toFixed(1) + '%'
    }
  };
  
  res.json(analytics);
});

// Zone Coverage Check
router.post('/zones/coverage-check', (req, res) => {
  const { zipCode, deliveryType } = req.body;
  
  const availableZones = deliveryZones.filter(zone => 
    zone.zipCodes.includes(zipCode) && 
    zone.isActive && 
    (!deliveryType || zone.deliveryType === deliveryType)
  );
  
  if (availableZones.length === 0) {
    return res.json({
      covered: false,
      message: `No ${deliveryType || 'delivery'} service available for ${zipCode}`,
      suggestedAlternatives: [
        {
          deliveryType: 'next-day',
          estimatedTime: 1440,
          basePrice: '2.99'
        }
      ]
    });
  }
  
  const bestZone = availableZones.sort((a, b) => a.priority - b.priority)[0];
  
  res.json({
    covered: true,
    zone: bestZone,
    estimatedDelivery: new Date(Date.now() + bestZone.estimatedTime * 60 * 1000).toISOString(),
    deliveryFee: bestZone.basePrice,
    availableSlots: Math.floor(Math.random() * 8 + 2)
  });
});

export default router;