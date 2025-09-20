import type { Express } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import { orderTracking, orders, users } from "@shared/schema";
import { nanoid } from "nanoid";

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface TrackingUpdate {
  carrier: string;
  trackingNumber: string;
  status: 'label_created' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  lastUpdate: string;
  lastLocation: string;
  estimatedDeliveryDate: string;
  trackingEvents: TrackingEvent[];
}

// Mock EasyPost/Shippo API integration for demonstration
const mockTrackingAPI = {
  async getTrackingInfo(carrier: string, trackingNumber: string): Promise<TrackingUpdate | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock tracking data based on tracking number
    const mockData: { [key: string]: TrackingUpdate } = {
      '1Z999AA1234567890': {
        carrier: 'UPS',
        trackingNumber: '1Z999AA1234567890',
        status: 'in_transit',
        lastUpdate: new Date().toISOString(),
        lastLocation: 'Des Moines, IA',
        estimatedDeliveryDate: 'January 24, 2025',
        trackingEvents: [
          {
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            status: 'In Transit',
            location: 'Des Moines, IA',
            description: 'Package is in transit to the next facility'
          },
          {
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
            status: 'Departed Facility',
            location: 'Chicago, IL',
            description: 'Departed from Chicago Distribution Center'
          },
          {
            timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
            status: 'Arrived at Facility',
            location: 'Chicago, IL',
            description: 'Arrived at Chicago Distribution Center'
          },
          {
            timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(), // ~1.3 days ago
            status: 'In Transit',
            location: 'Minneapolis, MN',
            description: 'Package picked up from origin'
          },
          {
            timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(), // ~1.7 days ago
            status: 'Label Created',
            location: 'Minneapolis, MN',
            description: 'Shipping label created and ready for pickup'
          }
        ]
      },
      '9400111899562123456789': {
        carrier: 'USPS',
        trackingNumber: '9400111899562123456789',
        status: 'delivered',
        lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        lastLocation: 'Minneapolis, MN',
        estimatedDeliveryDate: 'January 22, 2025',
        trackingEvents: [
          {
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            status: 'Delivered',
            location: 'Minneapolis, MN',
            description: 'Package delivered to front porch'
          },
          {
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            status: 'Out for Delivery',
            location: 'Minneapolis, MN',
            description: 'Out for delivery'
          },
          {
            timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
            status: 'Arrived at Post Office',
            location: 'Minneapolis, MN',
            description: 'Arrived at local post office'
          }
        ]
      },
      '771234567890': {
        carrier: 'FedEx',
        trackingNumber: '771234567890',
        status: 'label_created',
        lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        lastLocation: 'Minneapolis, MN',
        estimatedDeliveryDate: 'January 26, 2025',
        trackingEvents: [
          {
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            status: 'Label Created',
            location: 'Minneapolis, MN',
            description: 'Shipping label created, package not yet picked up'
          }
        ]
      }
    };

    return mockData[trackingNumber] || null;
  },

  async validateTrackingNumber(carrier: string, trackingNumber: string): Promise<boolean> {
    // Simple validation patterns for different carriers
    const patterns = {
      'UPS': /^1Z[0-9A-Z]{16}$/,
      'FedEx': /^[0-9]{12,14}$/,
      'USPS': /^[0-9]{20,22}$/,
      'DHL': /^[0-9]{10,11}$/
    };

    const pattern = patterns[carrier as keyof typeof patterns];
    return pattern ? pattern.test(trackingNumber) : true;
  }
};

export function registerTrackingRoutes(app: Express) {
  // Get all orders with tracking for a user
  app.get('/api/orders', async (req, res) => {
    try {
      // Mock authentication - replace with real auth
      const userId = 1;

      // Mock order data since we don't have full order system yet
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'SPIRAL-2025-001',
          total: '$127.45',
          status: 'shipped',
          createdAt: '2025-01-20',
          itemCount: 3,
          trackingNumber: '1Z999AA1234567890',
          carrier: 'UPS',
          shippingStatus: 'in_transit',
          estimatedDelivery: 'January 24, 2025',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 2,
          orderNumber: 'SPIRAL-2025-002',
          total: '$89.99',
          status: 'delivered',
          createdAt: '2025-01-18',
          itemCount: 2,
          trackingNumber: '9400111899562123456789',
          carrier: 'USPS',
          shippingStatus: 'delivered',
          estimatedDelivery: 'January 22, 2025',
          lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          orderNumber: 'SPIRAL-2025-003',
          total: '$234.67',
          status: 'processing',
          createdAt: '2025-01-22',
          itemCount: 5,
          trackingNumber: '771234567890',
          carrier: 'FedEx',
          shippingStatus: 'label_created',
          estimatedDelivery: 'January 26, 2025',
          lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ];

      res.json(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Get detailed order information with full tracking
  app.get('/api/order/:id', async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = 1; // Mock authentication

      // Mock detailed order data
      const mockOrderDetails: { [key: number]: any } = {
        1: {
          id: 1,
          orderNumber: 'SPIRAL-2025-001',
          total: '$127.45',
          subtotal: '$115.97',
          tax: '$6.98',
          shipping: '$4.50',
          status: 'shipped',
          createdAt: '2025-01-20T10:30:00Z',
          items: [
            {
              id: 'item-1',
              name: 'Organic Coffee Beans - Dark Roast',
              price: '$24.99',
              quantity: 2,
              image: '/api/placeholder/80/80',
              store: 'Local Coffee Roasters'
            },
            {
              id: 'item-2',
              name: 'Ceramic Coffee Mug Set',
              price: '$32.99',
              quantity: 1,
              image: '/api/placeholder/80/80',
              store: 'Local Coffee Roasters'
            },
            {
              id: 'item-3',
              name: 'Artisan Honey',
              price: '$32.99',
              quantity: 2,
              image: '/api/placeholder/80/80',
              store: 'Farmers Market Co-op'
            }
          ],
          shippingAddress: {
            name: 'John Smith',
            address: '123 Main Street',
            city: 'Minneapolis',
            state: 'MN',
            zipCode: '55401'
          }
        }
      };

      const orderDetail = mockOrderDetails[orderId];
      if (!orderDetail) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Get tracking information
      const trackingInfo = await mockTrackingAPI.getTrackingInfo('UPS', '1Z999AA1234567890');
      if (trackingInfo) {
        orderDetail.tracking = {
          ...trackingInfo,
          progress: trackingInfo.status === 'delivered' ? 100 : 
                  trackingInfo.status === 'out_for_delivery' ? 90 :
                  trackingInfo.status === 'in_transit' ? 65 :
                  trackingInfo.status === 'label_created' ? 15 : 0
        };
      }

      res.json(orderDetail);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Failed to fetch order details' });
    }
  });

  // Create tracking record for new order
  app.post('/api/tracking', async (req, res) => {
    try {
      const { orderId, orderNumber, carrier, trackingNumber, deliveryAddress } = req.body;

      // Validate tracking number format
      const isValid = await mockTrackingAPI.validateTrackingNumber(carrier, trackingNumber);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid tracking number format' });
      }

      // Get initial tracking info from carrier API
      const trackingInfo = await mockTrackingAPI.getTrackingInfo(carrier, trackingNumber);
      if (!trackingInfo) {
        return res.status(400).json({ error: 'Tracking number not found with carrier' });
      }

      // Create tracking record in database
      const [trackingRecord] = await db
        .insert(orderTracking)
        .values({
          orderId,
          orderNumber,
          carrier,
          trackingNumber,
          status: trackingInfo.status,
          lastLocation: trackingInfo.lastLocation,
          deliveryAddress,
          estimatedDeliveryDate: trackingInfo.estimatedDeliveryDate,
          trackingEvents: JSON.stringify(trackingInfo.trackingEvents),
        })
        .returning();

      res.json({ 
        success: true, 
        trackingId: trackingRecord.id,
        status: trackingInfo.status,
        estimatedDelivery: trackingInfo.estimatedDeliveryDate
      });
    } catch (error) {
      console.error('Error creating tracking record:', error);
      res.status(500).json({ error: 'Failed to create tracking record' });
    }
  });

  // Update tracking information (webhook endpoint or manual refresh)
  app.post('/api/tracking/update/:trackingId', async (req, res) => {
    try {
      const trackingId = parseInt(req.params.trackingId);

      // Get existing tracking record
      const [existingRecord] = await db
        .select()
        .from(orderTracking)
        .where(eq(orderTracking.id, trackingId));

      if (!existingRecord) {
        return res.status(404).json({ error: 'Tracking record not found' });
      }

      // Fetch latest tracking info from carrier
      const updatedInfo = await mockTrackingAPI.getTrackingInfo(
        existingRecord.carrier,
        existingRecord.trackingNumber
      );

      if (!updatedInfo) {
        return res.status(400).json({ error: 'Unable to fetch tracking updates' });
      }

      // Update tracking record
      await db
        .update(orderTracking)
        .set({
          status: updatedInfo.status,
          lastLocation: updatedInfo.lastLocation,
          estimatedDeliveryDate: updatedInfo.estimatedDeliveryDate,
          trackingEvents: JSON.stringify(updatedInfo.trackingEvents),
          lastUpdate: new Date(),
          updatedAt: new Date(),
          actualDeliveryDate: updatedInfo.status === 'delivered' ? new Date() : null,
        })
        .where(eq(orderTracking.id, trackingId));

      res.json({
        success: true,
        status: updatedInfo.status,
        lastUpdate: new Date().toISOString(),
        estimatedDelivery: updatedInfo.estimatedDeliveryDate
      });
    } catch (error) {
      console.error('Error updating tracking information:', error);
      res.status(500).json({ error: 'Failed to update tracking information' });
    }
  });

  // Bulk update all active tracking records (background job)
  app.post('/api/tracking/bulk-update', async (req, res) => {
    try {
      // Get all active tracking records (not delivered)
      const activeTrackingRecords = await db
        .select()
        .from(orderTracking)
        .where(and(
          eq(orderTracking.status, 'in_transit'),
          eq(orderTracking.status, 'out_for_delivery'),
          eq(orderTracking.status, 'label_created')
        ));

      let updated = 0;
      let errors = 0;

      for (const record of activeTrackingRecords) {
        try {
          const updatedInfo = await mockTrackingAPI.getTrackingInfo(
            record.carrier,
            record.trackingNumber
          );

          if (updatedInfo && updatedInfo.status !== record.status) {
            await db
              .update(orderTracking)
              .set({
                status: updatedInfo.status,
                lastLocation: updatedInfo.lastLocation,
                estimatedDeliveryDate: updatedInfo.estimatedDeliveryDate,
                trackingEvents: JSON.stringify(updatedInfo.trackingEvents),
                lastUpdate: new Date(),
                updatedAt: new Date(),
                actualDeliveryDate: updatedInfo.status === 'delivered' ? new Date() : null,
              })
              .where(eq(orderTracking.id, record.id));

            updated++;
          }
        } catch (error) {
          console.error(`Error updating tracking for ${record.trackingNumber}:`, error);
          errors++;
        }
      }

      res.json({
        success: true,
        message: `Bulk update completed: ${updated} records updated, ${errors} errors`,
        updated,
        errors
      });
    } catch (error) {
      console.error('Error in bulk tracking update:', error);
      res.status(500).json({ error: 'Failed to perform bulk update' });
    }
  });

  // Get tracking by tracking number (public endpoint for customer service)
  app.get('/api/tracking/:carrier/:trackingNumber', async (req, res) => {
    try {
      const { carrier, trackingNumber } = req.params;

      // Validate tracking number
      const isValid = await mockTrackingAPI.validateTrackingNumber(carrier, trackingNumber);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid tracking number format' });
      }

      // Get tracking info from carrier
      const trackingInfo = await mockTrackingAPI.getTrackingInfo(carrier, trackingNumber);
      if (!trackingInfo) {
        return res.status(404).json({ error: 'Tracking information not found' });
      }

      res.json({
        success: true,
        tracking: trackingInfo
      });
    } catch (error) {
      console.error('Error fetching tracking by number:', error);
      res.status(500).json({ error: 'Failed to fetch tracking information' });
    }
  });
}