/**
 * Near Me API Endpoint
 * Provides standardized proximity-based store search with proper response structure
 */

import { Router } from 'express';

const router = Router();

// Distance calculation using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
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

function formatDistance(distance) {
  return distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`;
}

// Mock store data for testing
const mockStores = [
  {
    id: 1,
    name: "Downtown Electronics",
    category: "Electronics",
    address: "123 Main St, New York, NY 10001",
    lat: 40.7505,
    lng: -73.9934,
    rating: 4.5,
    reviewCount: 234,
    isVerified: true
  },
  {
    id: 2,
    name: "Fashion Forward",
    category: "Fashion",
    address: "456 Broadway, New York, NY 10013",
    lat: 40.7289,
    lng: -74.0033,
    rating: 4.3,
    reviewCount: 167,
    isVerified: true
  },
  {
    id: 3,
    name: "Brooklyn Bookstore",
    category: "Books",
    address: "789 Court St, Brooklyn, NY 11201",
    lat: 40.6892,
    lng: -73.9900,
    rating: 4.7,
    reviewCount: 456,
    isVerified: true
  }
];

// Near Me endpoint with standardized response
router.get('/near-me', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { lat, lng, radius = 25 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        data: null,
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now(),
        error: 'Latitude and longitude are required'
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    if (isNaN(userLat) || isNaN(userLng) || isNaN(searchRadius)) {
      return res.status(400).json({
        success: false,
        data: null,
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now(),
        error: 'Invalid coordinates or radius'
      });
    }

    // Calculate distances and filter by radius
    const storesWithDistance = mockStores.map(store => {
      const distance = calculateDistance(userLat, userLng, store.lat, store.lng);
      return {
        ...store,
        distance: parseFloat(distance.toFixed(2)),
        distanceText: formatDistance(distance)
      };
    }).filter(store => store.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    // Return standardized response structure
    res.status(200).json({
      success: true,
      data: {
        stores: storesWithDistance,
        total: storesWithDistance.length,
        userLocation: { lat: userLat, lng: userLng },
        radius: searchRadius
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: null
    });

  } catch (error) {
    console.error('Near Me API error:', error);
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: 'Failed to search nearby stores'
    });
  }
});

export default router;