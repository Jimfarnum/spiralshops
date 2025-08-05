// SPIRAL AI-Powered Location Search API

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Sample store data with coordinates (in production, this would come from database)
const sampleStores = [
  {
    id: 1,
    name: "Target Store",
    description: "Large retail chain offering clothing, electronics, home goods",
    category: "Department Store",
    address: "123 Main St, Minneapolis, MN 55401",
    coordinates: { latitude: 44.9778, longitude: -93.2650 },
    city: "Minneapolis",
    state: "MN",
    zipCode: "55401",
    rating: 4.2,
    reviewCount: 1250,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 2,
    name: "Artisan Coffee Roasters",
    description: "Local coffee shop with freshly roasted beans and pastries",
    category: "Coffee Shop",
    address: "456 Oak Ave, Minneapolis, MN 55402",
    coordinates: { latitude: 44.9537, longitude: -93.2650 },
    city: "Minneapolis",
    state: "MN",
    zipCode: "55402",
    rating: 4.8,
    reviewCount: 342,
    isVerified: true,
    verificationTier: "Silver"
  },
  {
    id: 3,
    name: "Green Valley Grocery",
    description: "Organic grocery store with locally sourced produce",
    category: "Grocery",
    address: "789 Elm St, Saint Paul, MN 55101",
    coordinates: { latitude: 44.9537, longitude: -93.0900 },
    city: "Saint Paul",
    state: "MN",
    zipCode: "55101",
    rating: 4.6,
    reviewCount: 892,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 4,
    name: "Tech Hub Electronics",
    description: "Electronics store specializing in computers and mobile devices",
    category: "Electronics",
    address: "321 Pine St, Bloomington, MN 55420",
    coordinates: { latitude: 44.8408, longitude: -93.2982 },
    city: "Bloomington",
    state: "MN",
    zipCode: "55420",
    rating: 4.3,
    reviewCount: 567,
    isVerified: true,
    verificationTier: "Bronze"
  },
  {
    id: 5,
    name: "Fashion Forward Boutique",
    description: "Trendy clothing boutique featuring local designers",
    category: "Fashion",
    address: "654 Maple Dr, Edina, MN 55436",
    coordinates: { latitude: 44.8896, longitude: -93.3502 },
    city: "Edina",
    state: "MN",
    zipCode: "55436",
    rating: 4.7,
    reviewCount: 234,
    isVerified: true,
    verificationTier: "Silver"
  }
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1, coord2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) * Math.cos(toRad(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100;
}

function toRad(value) {
  return value * Math.PI / 180;
}

// AI-powered location search using GPT-4
async function aiLocationSearch(query, userLocation) {
  try {
    const prompt = `
You are a SPIRAL local business search assistant. Help users find stores and businesses based on their location and preferences.

User Location: ${userLocation ? `${userLocation.city}, ${userLocation.state}` : 'Not provided'}
Search Query: "${query}"

Available stores in the area:
${JSON.stringify(sampleStores, null, 2)}

Tasks:
1. Analyze the user's search intent
2. Match relevant stores based on category, name, description, or location
3. Consider distance if user location is provided
4. Provide helpful recommendations with reasoning

Respond with a JSON object containing:
{
  "matches": [array of matching store IDs],
  "reasoning": "Why these stores match the search",
  "suggestions": ["Alternative search suggestions"],
  "searchIntent": "What the user is looking for"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a helpful local business search assistant for the SPIRAL platform." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI search error:', error);
    return {
      matches: [],
      reasoning: "AI search temporarily unavailable",
      suggestions: ["Try browsing by category", "Search by store name"],
      searchIntent: "general search"
    };
  }
}

// Location-based store search endpoint
export async function searchStoresByLocation(req, res) {
  try {
    const { 
      query = '', 
      latitude, 
      longitude, 
      radius = 10, // miles
      category = 'all',
      sortBy = 'distance',
      city,
      state,
      zipCode
    } = req.query;

    let userLocation = null;
    
    // Parse user location
    if (latitude && longitude) {
      userLocation = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        city,
        state,
        zipCode
      };
    }

    // Get all stores with distance calculations
    let stores = sampleStores.map(store => {
      const storeData = { ...store };
      
      if (userLocation && store.coordinates) {
        storeData.distance = calculateDistance(userLocation, store.coordinates);
        storeData.distanceText = `${storeData.distance} mi`;
      }
      
      return storeData;
    });

    // Filter by radius if location provided
    if (userLocation && radius) {
      stores = stores.filter(store => 
        !store.distance || store.distance <= parseFloat(radius)
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      stores = stores.filter(store => 
        store.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by city/state if provided
    if (city) {
      stores = stores.filter(store => 
        store.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (state) {
      stores = stores.filter(store => 
        store.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    // AI-powered search if query provided
    let aiResults = null;
    if (query.trim()) {
      aiResults = await aiLocationSearch(query, userLocation);
      
      // Filter stores based on AI matches
      if (aiResults.matches && aiResults.matches.length > 0) {
        stores = stores.filter(store => aiResults.matches.includes(store.id));
      } else {
        // Fallback text search
        stores = stores.filter(store =>
          store.name.toLowerCase().includes(query.toLowerCase()) ||
          store.description.toLowerCase().includes(query.toLowerCase()) ||
          store.category.toLowerCase().includes(query.toLowerCase())
        );
      }
    }

    // Sort results
    switch (sortBy) {
      case 'distance':
        stores.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        break;
      case 'rating':
        stores.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        stores.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    res.json({
      success: true,
      stores,
      total: stores.length,
      userLocation,
      searchRadius: radius,
      aiResults,
      filters: {
        query,
        category,
        city,
        state,
        radius,
        sortBy
      }
    });

  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stores: []
    });
  }
}

// Mall directory with location search
export async function searchMallsByLocation(req, res) {
  try {
    const { 
      latitude, 
      longitude, 
      radius = 25,
      category = 'all',
      city,
      state
    } = req.query;

    // Sample mall data with coordinates
    const malls = [
      {
        id: 'downtown-plaza',
        name: 'Downtown SPIRAL Plaza',
        location: 'Downtown District',
        address: '123 Main Street, Minneapolis, MN 55401',
        coordinates: { latitude: 44.9778, longitude: -93.2650 },
        city: 'Minneapolis',
        state: 'MN',
        tenantCount: 45,
        categories: ['fashion', 'food', 'home', 'gifts', 'beauty'],
        rating: 4.8,
        featured: true
      },
      {
        id: 'artisan-quarter',
        name: 'Artisan Quarter Mall',
        location: 'Historic Arts District',
        address: '456 Craft Lane, Saint Paul, MN 55101',
        coordinates: { latitude: 44.9537, longitude: -93.0900 },
        city: 'Saint Paul',
        state: 'MN',
        tenantCount: 28,
        categories: ['crafts', 'art', 'home', 'gifts'],
        rating: 4.9,
        featured: true
      }
    ];

    let userLocation = null;
    if (latitude && longitude) {
      userLocation = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    // Calculate distances and filter
    let filteredMalls = malls.map(mall => {
      const mallData = { ...mall };
      
      if (userLocation && mall.coordinates) {
        mallData.distance = calculateDistance(userLocation, mall.coordinates);
        mallData.distanceText = `${mallData.distance} mi`;
      }
      
      return mallData;
    });

    // Filter by radius
    if (userLocation && radius) {
      filteredMalls = filteredMalls.filter(mall => 
        !mall.distance || mall.distance <= parseFloat(radius)
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      filteredMalls = filteredMalls.filter(mall => 
        mall.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
      );
    }

    // Sort by distance
    filteredMalls.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

    res.json({
      success: true,
      malls: filteredMalls,
      total: filteredMalls.length,
      userLocation
    });

  } catch (error) {
    console.error('Mall search error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      malls: []
    });
  }
}