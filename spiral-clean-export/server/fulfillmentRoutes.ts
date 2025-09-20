import type { Express } from "express";
import { z } from "zod";

// Fulfillment & Delivery API Layer with multi-option delivery
export function registerFulfillmentRoutes(app: Express) {
  
  // Get available delivery options for order
  app.post("/api/fulfillment/delivery-options", async (req, res) => {
    try {
      const { items, zipCode, mallLocation } = req.body;
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Items array is required" });
      }

      // Mock delivery options calculation
      const deliveryOptions = [
        {
          id: "home_standard",
          name: "Home Delivery - Standard",
          description: "2-5 business days",
          price: 4.99,
          estimatedDays: "2-5",
          carrier: "FedEx",
          trackingAvailable: true,
          available: true
        },
        {
          id: "home_express",
          name: "Home Delivery - Express", 
          description: "1-2 business days",
          price: 12.99,
          estimatedDays: "1-2",
          carrier: "FedEx",
          trackingAvailable: true,
          available: true
        },
        {
          id: "store_pickup",
          name: "In-Store Pickup",
          description: "Ready today",
          price: 0,
          estimatedDays: "Today",
          location: "Store Location",
          availableStores: [
            {
              storeId: 1,
              storeName: "Target Store",
              address: "123 Main St",
              phone: "555-0123",
              hours: "8AM-10PM Daily",
              readyTime: "2 hours"
            }
          ],
          available: true
        },
        {
          id: "mall_pickup",
          name: "Mall SPIRAL Center",
          description: "Ready tomorrow",
          price: 0,
          estimatedDays: "1",
          location: mallLocation || "Downtown Mall SPIRAL Center",
          address: "Mall Level 1, Near Food Court",
          hours: "10AM-9PM Daily",
          benefits: ["Extended hours", "Gift wrapping", "Easy returns"],
          available: !!mallLocation
        },
        {
          id: "curbside",
          name: "Curbside Pickup",
          description: "Ready in 1 hour",
          price: 0,
          estimatedDays: "Today",
          instructions: "Call upon arrival",
          available: true
        }
      ];

      // Calculate shipping costs based on weight/distance
      const shippingCalculation = {
        totalWeight: items.reduce((weight, item) => weight + (item.weight || 1), 0),
        distance: zipCode ? calculateShippingDistance(zipCode) : 10,
        freeShippingThreshold: 50,
        totalItemValue: items.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      // Apply free shipping if threshold met
      const finalOptions = deliveryOptions.map(option => {
        if (option.id.includes('home') && shippingCalculation.totalItemValue >= shippingCalculation.freeShippingThreshold) {
          return { ...option, price: 0, freeShipping: true };
        }
        return option;
      });

      res.json({
        deliveryOptions: finalOptions,
        shippingCalculation,
        recommendations: [
          shippingCalculation.totalItemValue < shippingCalculation.freeShippingThreshold 
            ? `Add $${(shippingCalculation.freeShippingThreshold - shippingCalculation.totalItemValue).toFixed(2)} for free shipping`
            : "You qualify for free shipping!",
          "Mall pickup includes free gift wrapping",
          "Curbside pickup available for contactless delivery"
        ]
      });
      
    } catch (error) {
      console.error("Delivery options error:", error);
      res.status(500).json({ error: "Failed to calculate delivery options" });
    }
  });

  // Create shipment with chosen delivery method
  app.post("/api/fulfillment/create-shipment", async (req, res) => {
    try {
      const { 
        orderId, 
        deliveryOptionId, 
        shippingAddress, 
        items, 
        specialInstructions 
      } = req.body;
      
      if (!orderId || !deliveryOptionId || !items) {
        return res.status(400).json({ error: "Missing required shipment information" });
      }

      // Mock shipment creation
      const shipment = {
        shipmentId: `ship_${Date.now()}`,
        orderId,
        deliveryMethod: deliveryOptionId,
        status: "created",
        tracking: {
          trackingNumber: deliveryOptionId.includes('home') ? `1Z${Math.random().toString(36).substr(2, 12).toUpperCase()}` : null,
          carrier: deliveryOptionId.includes('home') ? "FedEx" : null,
          trackingUrl: deliveryOptionId.includes('home') ? `https://fedex.com/track?id=1Z${Math.random().toString(36).substr(2, 12).toUpperCase()}` : null
        },
        estimatedDelivery: calculateEstimatedDelivery(deliveryOptionId),
        shippingAddress: deliveryOptionId.includes('home') ? shippingAddress : null,
        pickupLocation: getPickupLocation(deliveryOptionId),
        notifications: {
          sms: true,
          email: true,
          push: true
        },
        specialInstructions,
        createdAt: new Date().toISOString(),
        updates: [
          {
            status: "shipment_created",
            timestamp: new Date().toISOString(),
            message: "Shipment created successfully",
            location: "Origin facility"
          }
        ]
      };

      res.json({
        success: true,
        shipment,
        nextSteps: getNextSteps(deliveryOptionId),
        customerActions: getCustomerActions(deliveryOptionId)
      });
      
    } catch (error) {
      console.error("Shipment creation error:", error);
      res.status(500).json({ error: "Failed to create shipment" });
    }
  });

  // Track shipment status
  app.get("/api/fulfillment/track/:shipmentId", async (req, res) => {
    try {
      const { shipmentId } = req.params;
      
      // Mock tracking information
      const trackingInfo = {
        shipmentId,
        status: "in_transit",
        currentLocation: "Distribution Center - Chicago, IL",
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 60,
        timeline: [
          {
            status: "order_received",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            location: "Merchant Location",
            message: "Order received and being prepared"
          },
          {
            status: "picked_up",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            location: "Local Pickup Facility",
            message: "Package picked up by carrier"
          },
          {
            status: "in_transit",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            location: "Distribution Center - Chicago, IL",
            message: "Package in transit to destination",
            current: true
          },
          {
            status: "out_for_delivery",
            estimated: true,
            estimatedTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            location: "Local Delivery Facility",
            message: "Out for delivery"
          },
          {
            status: "delivered",
            estimated: true,
            estimatedTime: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
            location: "Destination Address",
            message: "Package delivered"
          }
        ],
        carrier: "FedEx",
        trackingNumber: "1Z123456789012345678",
        deliverySignatureRequired: false,
        notifications: {
          emailUpdates: true,
          smsUpdates: true,
          pushNotifications: true
        }
      };

      res.json(trackingInfo);
      
    } catch (error) {
      console.error("Tracking error:", error);
      res.status(500).json({ error: "Failed to retrieve tracking information" });
    }
  });

  // Get delivery zones and pricing
  app.get("/api/fulfillment/delivery-zones", async (req, res) => {
    try {
      const deliveryZones = [
        {
          zone: "local",
          name: "Local Delivery (0-10 miles)",
          standardRate: 4.99,
          expressRate: 9.99,
          freeShippingThreshold: 35,
          estimatedDays: "1-2"
        },
        {
          zone: "regional",
          name: "Regional Delivery (10-100 miles)", 
          standardRate: 6.99,
          expressRate: 12.99,
          freeShippingThreshold: 50,
          estimatedDays: "2-3"
        },
        {
          zone: "national",
          name: "National Delivery (100+ miles)",
          standardRate: 8.99,
          expressRate: 15.99,
          freeShippingThreshold: 75,
          estimatedDays: "3-5"
        }
      ];

      res.json({
        zones: deliveryZones,
        specialOffers: [
          "Free shipping on orders over $50",
          "Express delivery available",
          "Same-day delivery in select areas"
        ]
      });
      
    } catch (error) {
      console.error("Delivery zones error:", error);
      res.status(500).json({ error: "Failed to retrieve delivery zones" });
    }
  });

  // Update delivery preferences
  app.post("/api/fulfillment/update-preferences", async (req, res) => {
    try {
      const { 
        userId, 
        defaultDeliveryMethod, 
        notificationPreferences,
        savedAddresses 
      } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Mock preferences update
      const updatedPreferences = {
        userId,
        defaultDeliveryMethod: defaultDeliveryMethod || "home_standard",
        notifications: {
          email: notificationPreferences?.email ?? true,
          sms: notificationPreferences?.sms ?? false,
          push: notificationPreferences?.push ?? true
        },
        savedAddresses: savedAddresses || [],
        preferredCarriers: ["FedEx", "UPS"],
        deliveryInstructions: "Leave at front door",
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        preferences: updatedPreferences,
        message: "Delivery preferences updated successfully"
      });
      
    } catch (error) {
      console.error("Preferences update error:", error);
      res.status(500).json({ error: "Failed to update delivery preferences" });
    }
  });
}

// Utility functions
function calculateShippingDistance(zipCode: string): number {
  // Mock distance calculation
  return Math.random() * 100;
}

function calculateEstimatedDelivery(deliveryOptionId: string): string {
  const now = new Date();
  switch (deliveryOptionId) {
    case "home_express":
      return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();
    case "home_standard":
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    case "store_pickup":
    case "curbside":
      return new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours
    case "mall_pickup":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 1 day
    default:
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  }
}

function getPickupLocation(deliveryOptionId: string): any {
  if (deliveryOptionId === "store_pickup" || deliveryOptionId === "curbside") {
    return {
      type: "store",
      name: "Target Store",
      address: "123 Main St, City, State 12345",
      phone: "555-0123",
      hours: "8AM-10PM Daily",
      instructions: "Enter through main entrance"
    };
  }
  
  if (deliveryOptionId === "mall_pickup") {
    return {
      type: "mall_center",
      name: "Downtown Mall SPIRAL Center",
      address: "Mall Level 1, Near Food Court",
      phone: "555-0456",
      hours: "10AM-9PM Daily", 
      instructions: "Check in at SPIRAL service desk"
    };
  }
  
  return null;
}

function getNextSteps(deliveryOptionId: string): string[] {
  if (deliveryOptionId.includes("home")) {
    return [
      "Package will be picked up within 24 hours",
      "Tracking information will be provided",
      "Delivery confirmation will be sent"
    ];
  }
  
  if (deliveryOptionId.includes("pickup")) {
    return [
      "Notification will be sent when ready",
      "Bring ID for pickup verification",
      "Check store hours before visiting"
    ];
  }
  
  return ["Order is being processed"];
}

function getCustomerActions(deliveryOptionId: string): string[] {
  if (deliveryOptionId.includes("pickup")) {
    return [
      "Wait for ready notification",
      "Bring valid ID",
      "Check pickup location hours"
    ];
  }
  
  if (deliveryOptionId === "curbside") {
    return [
      "Call store upon arrival",
      "Stay in vehicle",
      "Have order confirmation ready"
    ];
  }
  
  return ["Track shipment progress"];
}