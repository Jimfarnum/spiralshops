// SPIRAL Continental US Store Search API - Fixed Version
// Provides comprehensive store search across all continental US states

// Simplified Continental US store database for testing
const continentalUSStores = [
  {
    id: 101,
    name: "Golden Gate Electronics",
    description: "Premium electronics and tech accessories in San Francisco",
    category: "Electronics",
    address: "123 Market St, San Francisco, CA 94102",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    rating: 4.6,
    reviewCount: 2340,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 102,
    name: "Venice Beach Boutique",
    description: "Trendy beachware and California lifestyle clothing",
    category: "Fashion",
    address: "456 Ocean Front Walk, Venice, CA 90291",
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    city: "Venice",
    state: "CA",
    zipCode: "90291",
    rating: 4.3,
    reviewCount: 892,
    isVerified: true,
    verificationTier: "Silver"
  },
  {
    id: 103,
    name: "NYC Coffee Roasters",
    description: "Artisan coffee in the heart of Manhattan",
    category: "Coffee",
    address: "789 Broadway, New York, NY 10003",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    city: "New York",
    state: "NY",
    zipCode: "10003",
    rating: 4.8,
    reviewCount: 1234,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 104,
    name: "Austin Music Store",
    description: "Vinyl records and musical instruments",
    category: "Music",
    address: "456 South Lamar, Austin, TX 78704",
    coordinates: { latitude: 30.2672, longitude: -97.7431 },
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    rating: 4.5,
    reviewCount: 567,
    isVerified: true,
    verificationTier: "Silver"
  },
  {
    id: 105,
    name: "Miami Beach Sports",
    description: "Sporting goods and beach equipment",
    category: "Sports",
    address: "789 Ocean Drive, Miami Beach, FL 33139",
    coordinates: { latitude: 25.7617, longitude: -80.1918 },
    city: "Miami Beach",
    state: "FL",
    zipCode: "33139",
    rating: 4.2,
    reviewCount: 432,
    isVerified: true,
    verificationTier: "Silver"
  }
];

// Calculate distance between coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}

// Continental US Store Search Handler
export const searchContinentalStores = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 25,
      query = '',
      category = '',
      city = '',
      state = '',
      scope = 'all',
      sortBy = 'distance'
    } = req.query;

    console.log('Continental US Search Request:', { scope, category, city, state, query });

    let filteredStores = [...continentalUSStores];

    // Apply scope-based filtering
    if (scope === 'city' && city) {
      filteredStores = filteredStores.filter(store => 
        store.city.toLowerCase().includes(city.toLowerCase())
      );
    } else if (scope === 'state' && state) {
      filteredStores = filteredStores.filter(store => 
        store.state.toLowerCase() === state.toLowerCase()
      );
    } else if (scope === 'radius' && latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      const searchRadius = parseInt(radius);
      
      filteredStores = filteredStores
        .map(store => ({
          ...store,
          distance: calculateDistance(userLat, userLng, store.coordinates.latitude, store.coordinates.longitude)
        }))
        .filter(store => store.distance <= searchRadius);
    }

    // Apply category filter
    if (category && category !== 'all') {
      filteredStores = filteredStores.filter(store => 
        store.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Apply text search
    if (query) {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      filteredStores = filteredStores.filter(store => {
        const searchableText = `${store.name} ${store.description} ${store.category}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
    }

    // Add distance calculations if not already done
    if (latitude && longitude && scope !== 'radius') {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      
      filteredStores = filteredStores.map(store => ({
        ...store,
        distance: calculateDistance(userLat, userLng, store.coordinates.latitude, store.coordinates.longitude),
        distanceText: `${calculateDistance(userLat, userLng, store.coordinates.latitude, store.coordinates.longitude).toFixed(1)} mi`
      }));
    }

    // Sort results
    if (sortBy === 'distance' && filteredStores.some(s => s.distance !== undefined)) {
      filteredStores.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } else if (sortBy === 'rating') {
      filteredStores.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filteredStores.sort((a, b) => a.name.localeCompare(b.name));
    }

    const response = {
      success: true,
      stores: filteredStores.slice(0, 50),
      totalCount: filteredStores.length,
      searchParams: {
        scope,
        city,
        state,
        radius: scope === 'radius' ? radius : null,
        query,
        category,
        sortBy
      },
      coverage: 'Continental US',
      message: `Found ${filteredStores.length} stores`
    };

    console.log(`Continental US Search: ${filteredStores.length} stores found`);
    return res.status(200).json(response);

  } catch (error) {
    console.error('Continental US search error:', error);
    return res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message,
      stores: [],
      coverage: 'Continental US'
    });
  }
};