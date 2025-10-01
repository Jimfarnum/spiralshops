import { Router } from "express";
import { db } from "./db";
import { retailers, crossRetailerInventory, orderRouting, spiralCenters } from "@shared/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Haversine distance calculation in miles
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Validation schemas
const inventorySearchSchema = z.object({
  sku: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius: z.number().default(25),
  maxPrice: z.number().optional(),
  minQuantity: z.number().default(1)
});

const orderRoutingSchema = z.object({
  sku: z.string(),
  quantity: z.number().default(1),
  customerLat: z.number(),
  customerLng: z.number(),
  preferredRetailerId: z.number().optional(),
  maxDistance: z.number().default(25),
  prioritizePrice: z.boolean().default(false)
});

// GET /api/cross-retailer/search - Search inventory across all retailers
router.get('/search', async (req, res) => {
  try {
    const query = inventorySearchSchema.parse({
      sku: req.query.sku,
      title: req.query.title,
      category: req.query.category,
      lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
      lng: req.query.lng ? parseFloat(req.query.lng as string) : undefined,
      radius: req.query.radius ? parseFloat(req.query.radius as string) : 25,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minQuantity: req.query.minQuantity ? parseInt(req.query.minQuantity as string) : 1
    });

    // Build the SQL query
    let whereConditions = [
      eq(crossRetailerInventory.isActive, true),
      gte(crossRetailerInventory.quantity, query.minQuantity)
    ];

    if (query.sku) {
      whereConditions.push(sql`${crossRetailerInventory.sku} ILIKE ${`%${query.sku}%`}`);
    }
    if (query.title) {
      whereConditions.push(sql`${crossRetailerInventory.title} ILIKE ${`%${query.title}%`}`);
    }
    if (query.category) {
      whereConditions.push(eq(crossRetailerInventory.category, query.category));
    }
    if (query.maxPrice) {
      whereConditions.push(sql`${crossRetailerInventory.price} <= ${query.maxPrice}`);
    }

    const results = await db
      .select({
        inventoryId: crossRetailerInventory.id,
        retailerId: crossRetailerInventory.retailerId,
        retailerName: retailers.businessName,
        sku: crossRetailerInventory.sku,
        title: crossRetailerInventory.title,
        quantity: crossRetailerInventory.quantity,
        price: crossRetailerInventory.price,
        category: crossRetailerInventory.category,
        brand: crossRetailerInventory.brand,
        condition: crossRetailerInventory.condition,
        allowPartnerFulfillment: retailers.allowPartnerFulfillment,
        retailerLat: retailers.latitude,
        retailerLng: retailers.longitude,
        retailerAddress: retailers.address,
        retailerZip: retailers.zipCode
      })
      .from(crossRetailerInventory)
      .innerJoin(retailers, eq(crossRetailerInventory.retailerId, retailers.id))
      .where(and(...whereConditions));

    // Calculate distances if customer location provided
    const enrichedResults = results.map(item => {
      let distance = null;
      if (query.lat && query.lng && item.retailerLat && item.retailerLng) {
        distance = calculateDistance(
          query.lat, 
          query.lng, 
          parseFloat(item.retailerLat), 
          parseFloat(item.retailerLng)
        );
      }
      return { ...item, distance };
    });

    // Filter by radius if location provided
    const filteredResults = query.lat && query.lng 
      ? enrichedResults.filter(item => item.distance === null || item.distance <= query.radius)
      : enrichedResults;

    // Sort by distance (closest first), then by price (lowest first)
    filteredResults.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        if (a.distance !== b.distance) return a.distance - b.distance;
      }
      return parseFloat(a.price) - parseFloat(b.price);
    });

    res.json({
      success: true,
      query,
      totalResults: filteredResults.length,
      searchedArea: query.lat && query.lng ? `${query.radius} miles from (${query.lat}, ${query.lng})` : 'All locations',
      results: filteredResults.slice(0, 50) // Limit to 50 results
    });

  } catch (error) {
    console.error('Cross-retailer search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search inventory',
      message: error.message 
    });
  }
});

// POST /api/cross-retailer/route-order - AI-powered order routing
router.post('/route-order', async (req, res) => {
  try {
    const orderData = orderRoutingSchema.parse(req.body);

    // Find all retailers with the requested SKU
    const availableInventory = await db
      .select({
        inventoryId: crossRetailerInventory.id,
        retailerId: crossRetailerInventory.retailerId,
        retailerName: retailers.businessName,
        sku: crossRetailerInventory.sku,
        title: crossRetailerInventory.title,
        quantity: crossRetailerInventory.quantity,
        price: crossRetailerInventory.price,
        allowPartnerFulfillment: retailers.allowPartnerFulfillment,
        latitude: retailers.latitude,
        longitude: retailers.longitude,
        address: retailers.address
      })
      .from(crossRetailerInventory)
      .innerJoin(retailers, eq(crossRetailerInventory.retailerId, retailers.id))
      .where(and(
        eq(crossRetailerInventory.sku, orderData.sku),
        eq(crossRetailerInventory.isActive, true),
        gte(crossRetailerInventory.quantity, orderData.quantity)
      ));

    if (availableInventory.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not available',
        message: `SKU ${orderData.sku} not available in sufficient quantity from any retailer`
      });
    }

    // Calculate distances and apply business logic
    const candidates = availableInventory.map(item => {
      const distance = calculateDistance(
        orderData.customerLat,
        orderData.customerLng,
        parseFloat(item.latitude!),
        parseFloat(item.longitude!)
      );
      
      // Calculate routing score (lower is better)
      let score = distance; // Base score on distance
      if (orderData.prioritizePrice) {
        score += parseFloat(item.price) / 10; // Factor in price
      }
      
      return { ...item, distance, score };
    });

    // Filter by max distance
    const eligibleCandidates = candidates.filter(c => c.distance <= orderData.maxDistance);

    if (eligibleCandidates.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No retailers within range',
        message: `No retailers with ${orderData.sku} found within ${orderData.maxDistance} miles`
      });
    }

    // Check for preferred retailer first
    let selectedRetailer = null;
    let routingReason = '';

    if (orderData.preferredRetailerId) {
      const preferredCandidate = eligibleCandidates.find(c => c.retailerId === orderData.preferredRetailerId);
      if (preferredCandidate) {
        selectedRetailer = preferredCandidate;
        routingReason = 'preferred_retailer';
      }
    }

    // If no preferred retailer or preferred not available, use AI routing
    if (!selectedRetailer) {
      // Only consider retailers that allow partner fulfillment for cross-retailer orders
      const partnerEligible = eligibleCandidates.filter(c => c.allowPartnerFulfillment);
      
      if (partnerEligible.length > 0) {
        // Sort by routing score and select best option
        partnerEligible.sort((a, b) => a.score - b.score);
        selectedRetailer = partnerEligible[0];
        routingReason = orderData.prioritizePrice ? 'best_price_and_distance' : 'closest_distance';
      } else {
        // Fallback to closest available retailer (even if not partner-enabled)
        eligibleCandidates.sort((a, b) => a.score - b.score);
        selectedRetailer = eligibleCandidates[0];
        routingReason = 'closest_available';
      }
    }

    // Create order routing record
    const routingRecord = await db.insert(orderRouting).values({
      orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: req.body.customerId || null,
      requestedSku: orderData.sku,
      requestedQuantity: orderData.quantity,
      customerLatitude: orderData.customerLat.toString(),
      customerLongitude: orderData.customerLng.toString(),
      selectedRetailerId: selectedRetailer.retailerId,
      routingReason,
      alternatives: eligibleCandidates.filter(c => c.retailerId !== selectedRetailer.retailerId).slice(0, 3),
      estimatedDeliveryTime: Math.ceil(selectedRetailer.distance * 3 + 30) // Rough estimate: 3 min/mile + 30 min prep
    }).returning();

    res.json({
      success: true,
      routing: {
        orderId: routingRecord[0].orderId,
        selectedRetailer: {
          id: selectedRetailer.retailerId,
          name: selectedRetailer.retailerName,
          address: selectedRetailer.address,
          distance: selectedRetailer.distance,
          price: selectedRetailer.price,
          estimatedDeliveryTime: routingRecord[0].estimatedDeliveryTime
        },
        routingReason,
        alternatives: eligibleCandidates.filter(c => c.retailerId !== selectedRetailer.retailerId).slice(0, 3)
      }
    });

  } catch (error) {
    console.error('Order routing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to route order',
      message: error.message 
    });
  }
});

// GET /api/cross-retailer/availability/:sku - Quick availability check
router.get('/availability/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    const { lat, lng, radius = 25 } = req.query;

    const results = await db
      .select({
        retailerId: crossRetailerInventory.retailerId,
        retailerName: retailers.businessName,
        quantity: crossRetailerInventory.quantity,
        price: crossRetailerInventory.price,
        latitude: retailers.latitude,
        longitude: retailers.longitude,
        allowPartnerFulfillment: retailers.allowPartnerFulfillment
      })
      .from(crossRetailerInventory)
      .innerJoin(retailers, eq(crossRetailerInventory.retailerId, retailers.id))
      .where(and(
        eq(crossRetailerInventory.sku, sku),
        eq(crossRetailerInventory.isActive, true),
        gte(crossRetailerInventory.quantity, 1)
      ));

    let availabilityData = results;

    // Filter by location if provided
    if (lat && lng) {
      const customerLat = parseFloat(lat as string);
      const customerLng = parseFloat(lng as string);
      const maxRadius = parseFloat(radius as string);

      availabilityData = results.filter(item => {
        if (!item.latitude || !item.longitude) return false;
        const distance = calculateDistance(
          customerLat, customerLng,
          parseFloat(item.latitude), parseFloat(item.longitude)
        );
        return distance <= maxRadius;
      });
    }

    const summary = {
      sku,
      totalRetailers: availabilityData.length,
      totalQuantity: availabilityData.reduce((sum, item) => sum + item.quantity, 0),
      priceRange: availabilityData.length > 0 ? {
        min: Math.min(...availabilityData.map(item => parseFloat(item.price))),
        max: Math.max(...availabilityData.map(item => parseFloat(item.price)))
      } : null,
      partnerFulfillmentAvailable: availabilityData.some(item => item.allowPartnerFulfillment)
    };

    res.json({
      success: true,
      summary,
      retailers: availabilityData
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check availability',
      message: error.message 
    });
  }
});

// POST /api/cross-retailer/inventory/bulk-upload - Bulk inventory upload for retailers
router.post('/inventory/bulk-upload', async (req, res) => {
  try {
    const { retailerId, items } = req.body;

    if (!retailerId || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'retailerId and items array required'
      });
    }

    // Verify retailer exists
    const retailer = await db.select().from(retailers).where(eq(retailers.id, retailerId)).limit(1);
    if (retailer.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Retailer not found'
      });
    }

    // Remove existing inventory for uploaded SKUs (replace, don't duplicate)
    const uploadedSkus = items.map(item => item.sku);
    if (uploadedSkus.length > 0) {
      await db.delete(crossRetailerInventory)
        .where(and(
          eq(crossRetailerInventory.retailerId, retailerId),
          sql`${crossRetailerInventory.sku} = ANY(${uploadedSkus})`
        ));
    }

    // Insert new inventory items
    const inventoryData = items.map(item => ({
      retailerId,
      sku: item.sku,
      title: item.title || item.sku,
      quantity: Math.max(0, parseInt(item.quantity) || 0),
      price: parseFloat(item.price) || 0,
      category: item.category || null,
      brand: item.brand || null,
      condition: item.condition || 'new'
    }));

    await db.insert(crossRetailerInventory).values(inventoryData);

    res.json({
      success: true,
      message: `Successfully uploaded ${items.length} inventory items`,
      retailerId,
      itemsProcessed: items.length
    });

  } catch (error) {
    console.error('Bulk inventory upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload inventory',
      message: error.message 
    });
  }
});

export default router;