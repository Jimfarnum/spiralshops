// Google Maps Integration API for SPIRAL Platform
import express from 'express';
const router = express.Router();

// Set the local storage reference for routes
router.use((req, res, next) => {
  // Get storage from app.locals or import directly
  if (req.app && req.app.locals && req.app.locals.storage) {
    req.storage = req.app.locals.storage;
  } else {
    // Import storage service directly as fallback
    import('../storage.js').then(({ storage }) => {
      req.storage = storage;
      next();
    }).catch(() => {
      req.storage = {
        getStore: async (id) => null,
        getStores: async () => []
      };
      next();
    });
    return;
  }
  next();
});

// Mock coordinates for demo stores (in production, these would be geocoded)
const storeCoordinates = {
  'Apple Store': { lat: 44.8548, lng: -93.2422 }, // Mall of America coordinates
  'Nike Store': { lat: 44.8548, lng: -93.2422 },
  'Target Store': { lat: 44.9537, lng: -93.0900 }, // Minneapolis coordinates
  'Best Buy Electronics': { lat: 44.9537, lng: -93.0900 },
  'Diamond Palace Jewelry': { lat: 44.9778, lng: -93.2650 },
  'Silver & Gold Gallery': { lat: 44.9778, lng: -93.2650 },
  'Local Coffee Shop': { lat: 44.9537, lng: -93.0900 }
};

// Mall coordinates database
const mallCoordinates = {
  'mall-of-america': {
    name: 'Mall of America',
    lat: 44.8548,
    lng: -93.2422,
    address: '60 E Broadway, Bloomington, MN 55425',
    zipCode: '55425'
  },
  'southdale-center': {
    name: 'Southdale Center',
    lat: 44.8794,
    lng: -93.3212,
    address: '6601 France Ave S, Edina, MN 55435',
    zipCode: '55435'
  },
  'rosedale-center': {
    name: 'Rosedale Center',
    lat: 45.0135, 
    lng: -93.1683,
    address: '1595 MN-36, Roseville, MN 55113',
    zipCode: '55113'
  }
};

// Get store coordinates and enhanced location data
router.get('/store-location/:storeId', async (req, res) => {
  const startTime = Date.now();
  try {
    const { storeId } = req.params;
    
    // Get store data from storage
    const store = await req.storage.getStore(parseInt(storeId));
    
    if (!store) {
      return res.status(404).json({
        success: false,
        data: null,
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now(),
        error: "Store not found"
      });
    }

    // Add coordinates if available
    const coordinates = storeCoordinates[store.name];
    const enhancedStore = {
      ...store,
      lat: coordinates?.lat || null,
      lng: coordinates?.lng || null,
      mapsUrl: coordinates ? 
        `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}` :
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`,
      directionsUrl: coordinates ?
        `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}` :
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`
    };

    res.json({
      success: true,
      data: { store: enhancedStore },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: null
    });

  } catch (error) {
    console.error('Error fetching store location:', error);
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: "Failed to fetch store location data"
    });
  }
});

// Get mall location and directions
router.get('/mall-location/:mallId', async (req, res) => {
  const startTime = Date.now();
  try {
    const { mallId } = req.params;
    const mall = mallCoordinates[mallId.toLowerCase()];
    
    if (!mall) {
      return res.status(404).json({
        success: false,
        data: null,
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now(),
        error: "Mall not found"
      });
    }

    // Get stores at this mall
    const allStores = await req.storage.getStores();
    const mallStores = allStores.filter(store => {
      const storeAddress = (store.address || '').toLowerCase();
      return storeAddress.includes(mall.name.toLowerCase()) ||
             storeAddress.includes(mallId.replace('-', ' '));
    });

    // Add coordinates to mall stores
    const enhancedStores = mallStores.map(store => ({
      ...store,
      lat: storeCoordinates[store.name]?.lat || mall.lat,
      lng: storeCoordinates[store.name]?.lng || mall.lng
    }));

    const response = {
      mall: {
        ...mall,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mall.lat},${mall.lng}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${mall.lat},${mall.lng}`,
        storeCount: enhancedStores.length
      },
      stores: enhancedStores
    };

    res.json({
      success: true,
      data: response,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: null
    });

  } catch (error) {
    console.error('Error fetching mall location:', error);
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: "Failed to fetch mall location data"
    });
  }
});

// Generate directions URL with user location
router.post('/directions', async (req, res) => {
  const startTime = Date.now();
  try {
    const { storeId, userLat, userLng, mallId } = req.body;
    
    let destinationLat, destinationLng, destinationName;
    
    if (storeId) {
      // Get store location
      const store = await req.storage.getStore(parseInt(storeId));
      if (!store) {
        return res.status(404).json({
          success: false,
          data: null,
          duration: `${Date.now() - startTime}ms`,
          timestamp: Date.now(),
          error: "Store not found"
        });
      }
      
      const coordinates = storeCoordinates[store.name];
      destinationLat = coordinates?.lat;
      destinationLng = coordinates?.lng;
      destinationName = store.name;
      
    } else if (mallId) {
      // Get mall location
      const mall = mallCoordinates[mallId.toLowerCase()];
      if (!mall) {
        return res.status(404).json({
          success: false,
          data: null,
          duration: `${Date.now() - startTime}ms`,
          timestamp: Date.now(),
          error: "Mall not found"
        });
      }
      
      destinationLat = mall.lat;
      destinationLng = mall.lng;
      destinationName = mall.name;
    }
    
    // Generate directions URL
    let directionsUrl;
    if (userLat && userLng && destinationLat && destinationLng) {
      // Full coordinate-based directions
      directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${destinationLat},${destinationLng}`;
    } else if (destinationLat && destinationLng) {
      // Destination coordinates only
      directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
    } else {
      // Fallback to address-based search
      const address = storeId ? 
        (await req.storage.getStore(parseInt(storeId))).address :
        mallCoordinates[mallId].address;
      directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    }

    res.json({
      success: true,
      data: {
        directionsUrl,
        destination: destinationName,
        coordinates: destinationLat && destinationLng ? {
          lat: destinationLat,
          lng: destinationLng
        } : null
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: null
    });

  } catch (error) {
    console.error('Error generating directions:', error);
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: "Failed to generate directions"
    });
  }
});

// Get nearby stores based on coordinates
router.get('/nearby/:lat/:lng', async (req, res) => {
  const startTime = Date.now();
  try {
    const { lat, lng } = req.params;
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radius = parseFloat(req.query.radius) || 10; // Default 10 mile radius

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({
        success: false,
        data: null,
        duration: `${Date.now() - startTime}ms`,
        timestamp: Date.now(),
        error: "Invalid coordinates"
      });
    }

    // Get all stores and calculate distances
    const allStores = await req.storage.getStores();
    
    const nearbyStores = allStores.map(store => {
      const storeCoords = storeCoordinates[store.name];
      if (!storeCoords) return null;
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(userLat, userLng, storeCoords.lat, storeCoords.lng);
      
      return {
        ...store,
        lat: storeCoords.lat,
        lng: storeCoords.lng,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
        directionsUrl: `https://www.google.com/maps/dir/${userLat},${userLng}/${storeCoords.lat},${storeCoords.lng}`
      };
    }).filter(store => store && store.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: {
        stores: nearbyStores,
        userLocation: { lat: userLat, lng: userLng },
        radius: radius,
        total: nearbyStores.length
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: null
    });

  } catch (error) {
    console.error('Error finding nearby stores:', error);
    res.status(500).json({
      success: false,
      data: null,
      duration: `${Date.now() - startTime}ms`,
      timestamp: Date.now(),
      error: "Failed to find nearby stores"
    });
  }
});

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI/180);
}

export default router;