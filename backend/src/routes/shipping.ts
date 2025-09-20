import express from 'express';
import { z } from 'zod';
import { quoteShipping, trackShipment } from '../lib/shippingService.js';

const router = express.Router();

// Validation schemas
const ShippingZoneSchema = z.object({
  name: z.string().min(1),
  zipCodes: z.array(z.string()),
  deliveryFee: z.number().min(0),
  freeShippingThreshold: z.number().min(0).optional(),
  estimatedDays: z.object({
    min: z.number().min(1),
    max: z.number().min(1)
  })
});

const ShippingRateSchema = z.object({
  carrierId: z.string(),
  serviceName: z.string(),
  rate: z.number().min(0),
  estimatedDays: z.number().min(1),
  trackingIncluded: z.boolean()
});

const ShippingCalculationSchema = z.object({
  fromZip: z.string().length(5),
  toZip: z.string().length(5),
  weight: z.number().min(0),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0)
  }),
  value: z.number().min(0)
});

const ShippingQuoteSchema = z.object({
  destinationZip: z.string().min(5),
  weightOz: z.number().min(0),
  dimensionsIn: z.object({
    l: z.number().min(0),
    w: z.number().min(0),
    h: z.number().min(0)
  }).optional(),
  speed: z.enum(['economy', 'standard', 'expedited']),
  mode: z.enum(['outbound', 'inbound'])
});

// Mock data - replace with actual database/service calls
const shippingZones: any[] = [
  {
    id: '1',
    name: 'Local Delivery Zone',
    zipCodes: ['10001', '10002', '10003'],
    deliveryFee: 5.99,
    freeShippingThreshold: 50,
    estimatedDays: { min: 1, max: 2 }
  },
  {
    id: '2',
    name: 'Regional Zone',
    zipCodes: ['10004', '10005', '10006'],
    deliveryFee: 9.99,
    freeShippingThreshold: 75,
    estimatedDays: { min: 2, max: 4 }
  }
];

// GET /api/shipping/zones
router.get('/zones', (req, res) => {
  try {
    res.json({
      success: true,
      data: shippingZones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shipping zones'
    });
  }
});

// POST /api/shipping/zones
router.post('/zones', (req, res) => {
  try {
    const validatedData = ShippingZoneSchema.parse(req.body);
    
    const newZone = {
      id: `${Date.now()}`,
      ...validatedData
    };
    
    shippingZones.push(newZone);
    
    res.status(201).json({
      success: true,
      data: newZone
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create shipping zone'
    });
  }
});

// POST /api/shipping/calculate
router.post('/calculate', (req, res) => {
  try {
    const validatedData = ShippingCalculationSchema.parse(req.body);
    
    // Mock shipping calculation logic
    const { fromZip, toZip, weight, value } = validatedData;
    
    // Check if destination is in a delivery zone
    const zone = shippingZones.find(z => z.zipCodes.includes(toZip));
    
    const rates: any[] = [];
    
    if (zone) {
      // Local/Regional delivery
      const fee = value >= (zone.freeShippingThreshold || 0) ? 0 : zone.deliveryFee;
      rates.push({
        carrierId: 'spiral-delivery',
        serviceName: `SPIRAL ${zone.name}`,
        rate: fee,
        estimatedDays: zone.estimatedDays.max,
        trackingIncluded: true,
        isRecommended: true
      });
    }
    
    // Standard shipping options (mock data)
    const standardRates = [
      {
        carrierId: 'fedex',
        serviceName: 'FedEx Ground',
        rate: weight * 2.5 + 8.99,
        estimatedDays: 5,
        trackingIncluded: true
      },
      {
        carrierId: 'ups',
        serviceName: 'UPS Ground',
        rate: weight * 2.3 + 9.49,
        estimatedDays: 5,
        trackingIncluded: true
      },
      {
        carrierId: 'usps',
        serviceName: 'USPS Priority Mail',
        rate: weight * 1.8 + 7.99,
        estimatedDays: 3,
        trackingIncluded: true
      }
    ];
    
    rates.push(...standardRates);
    
    // Sort by rate (cheapest first)
    rates.sort((a, b) => a.rate - b.rate);
    
    res.json({
      success: true,
      data: {
        fromZip,
        toZip,
        rates,
        calculatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to calculate shipping rates'
    });
  }
});

// POST /api/shipping/quote - Get shipping quote
router.post('/quote', async (req, res) => {
  try {
    const validatedData = ShippingQuoteSchema.parse(req.body);
    
    const quote = await quoteShipping(validatedData);
    
    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to get shipping quote'
    });
  }
});

// GET /api/shipping/tracking/:trackingNumber
router.get('/tracking/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    
    const trackingInfo = await trackShipment(trackingNumber);
    
    res.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tracking information'
    });
  }
});

// POST /api/shipping/label
router.post('/label', (req, res) => {
  try {
    const { orderId, carrierId, serviceType, fromAddress, toAddress } = req.body;
    
    // Mock label generation
    const label = {
      labelId: `LBL_${Date.now()}`,
      trackingNumber: `1Z${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      labelUrl: `https://api.spiralmalls.com/labels/${Date.now()}.pdf`,
      cost: 9.99,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: label
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate shipping label'
    });
  }
});

export default router;