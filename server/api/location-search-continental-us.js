// SPIRAL Continental US Location Search API
// Comprehensive store database covering all continental US states

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Comprehensive SPIRAL store database covering all continental US states with distance options
const continentalUSStores = [
  // West Coast - California
  {
    id: 1,
    name: "Golden Gate Electronics",
    description: "Premium electronics and tech accessories in the heart of San Francisco",
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
    id: 2,
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
    id: 3,
    name: "Hollywood Vintage Records",
    description: "Rare vinyl records and music memorabilia collection",
    category: "Music",
    address: "789 Sunset Blvd, Hollywood, CA 90028",
    coordinates: { latitude: 34.0928, longitude: -118.3287 },
    city: "Hollywood",
    state: "CA",
    zipCode: "90028",
    rating: 4.8,
    reviewCount: 1456,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // Pacific Northwest - Washington
  {
    id: 4,
    name: "Seattle Coffee Co.",
    description: "Artisan coffee roasters with locally sourced beans",
    category: "Coffee",
    address: "101 Pine St, Seattle, WA 98101",
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    rating: 4.7,
    reviewCount: 3240,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 5,
    name: "Emerald City Books",
    description: "Independent bookstore featuring local authors and rare finds",
    category: "Books",
    address: "234 Capitol Hill, Seattle, WA 98122",
    coordinates: { latitude: 47.6205, longitude: -122.3212 },
    city: "Seattle",
    state: "WA",
    zipCode: "98122",
    rating: 4.5,
    reviewCount: 987,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Pacific Northwest - Oregon
  {
    id: 6,
    name: "Portland Artisan Market",
    description: "Handcrafted goods and local artisan products",
    category: "Crafts",
    address: "567 Hawthorne Blvd, Portland, OR 97214",
    coordinates: { latitude: 45.5152, longitude: -122.6784 },
    city: "Portland",
    state: "OR",
    zipCode: "97214",
    rating: 4.6,
    reviewCount: 1123,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Southwest - Texas (Major Cities)
  {
    id: 7,
    name: "Austin Music Store",
    description: "Musical instruments and live music venue supplies",
    category: "Music",
    address: "890 South Lamar, Austin, TX 78704",
    coordinates: { latitude: 30.2672, longitude: -97.7431 },
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    rating: 4.4,
    reviewCount: 2156,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 8,
    name: "Dallas Fashion District",
    description: "High-end fashion and designer clothing boutique",
    category: "Fashion",
    address: "123 Elm St, Dallas, TX 75202",
    coordinates: { latitude: 32.7767, longitude: -96.7970 },
    city: "Dallas",
    state: "TX",
    zipCode: "75202",
    rating: 4.2,
    reviewCount: 1834,
    isVerified: true,
    verificationTier: "Silver"
  },
  {
    id: 9,
    name: "Houston Tech Hub",
    description: "Computer repair and electronics sales",
    category: "Electronics",
    address: "456 Main St, Houston, TX 77002",
    coordinates: { latitude: 29.7604, longitude: -95.3698 },
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    rating: 4.3,
    reviewCount: 1567,
    isVerified: true,
    verificationTier: "Bronze"
  },

  // Southwest - Arizona
  {
    id: 10,
    name: "Phoenix Desert Outfitters",
    description: "Outdoor gear and desert hiking equipment",
    category: "Outdoor",
    address: "789 Central Ave, Phoenix, AZ 85004",
    coordinates: { latitude: 33.4484, longitude: -112.0740 },
    city: "Phoenix",
    state: "AZ",
    zipCode: "85004",
    rating: 4.5,
    reviewCount: 892,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Mountain West - Colorado
  {
    id: 11,
    name: "Denver Mountain Gear",
    description: "Skiing, hiking, and mountain sports equipment",
    category: "Sports",
    address: "321 16th St, Denver, CO 80202",
    coordinates: { latitude: 39.7392, longitude: -104.9903 },
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    rating: 4.7,
    reviewCount: 2341,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // Mountain West - Utah
  {
    id: 12,
    name: "Salt Lake City Bike Shop",
    description: "Bicycles and cycling accessories for all skill levels",
    category: "Sports",
    address: "654 State St, Salt Lake City, UT 84111",
    coordinates: { latitude: 40.7608, longitude: -111.8910 },
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84111",
    rating: 4.4,
    reviewCount: 1234,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Midwest - Illinois
  {
    id: 13,
    name: "Chicago Deep Dish Pizza Co.",
    description: "Authentic Chicago-style pizza and Italian specialties",
    category: "Food",
    address: "987 Michigan Ave, Chicago, IL 60611",
    coordinates: { latitude: 41.8781, longitude: -87.6298 },
    city: "Chicago",
    state: "IL",
    zipCode: "60611",
    rating: 4.6,
    reviewCount: 4567,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 14,
    name: "Windy City Electronics",
    description: "Latest gadgets and electronic devices",
    category: "Electronics",
    address: "147 State St, Chicago, IL 60604",
    coordinates: { latitude: 41.8843, longitude: -87.6279 },
    city: "Chicago",
    state: "IL",
    zipCode: "60604",
    rating: 4.2,
    reviewCount: 1876,
    isVerified: true,
    verificationTier: "Bronze"
  },

  // Midwest - Michigan
  {
    id: 15,
    name: "Detroit Auto Parts Plus",
    description: "Automotive parts and car accessories",
    category: "Automotive",
    address: "258 Woodward Ave, Detroit, MI 48226",
    coordinates: { latitude: 42.3314, longitude: -83.0458 },
    city: "Detroit",
    state: "MI",
    zipCode: "48226",
    rating: 4.1,
    reviewCount: 987,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Midwest - Ohio
  {
    id: 16,
    name: "Columbus Book Corner",
    description: "Used and new books, including rare collections",
    category: "Books",
    address: "369 High St, Columbus, OH 43215",
    coordinates: { latitude: 39.9612, longitude: -82.9988 },
    city: "Columbus",
    state: "OH",
    zipCode: "43215",
    rating: 4.3,
    reviewCount: 654,
    isVerified: true,
    verificationTier: "Bronze"
  },

  // Midwest - Minnesota
  {
    id: 17,
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
    id: 18,
    name: "Artisan Coffee Roasters",
    description: "Local coffee shop with freshly roasted beans and pastries",
    category: "Coffee",
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

  // Southeast - Florida
  {
    id: 19,
    name: "Miami Beach Fashion",
    description: "Tropical fashion and beachwear boutique",
    category: "Fashion",
    address: "741 Ocean Dr, Miami Beach, FL 33139",
    coordinates: { latitude: 25.7617, longitude: -80.1918 },
    city: "Miami Beach",
    state: "FL",
    zipCode: "33139",
    rating: 4.4,
    reviewCount: 1987,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 20,
    name: "Orlando Theme Park Supplies",
    description: "Souvenirs and theme park merchandise",
    category: "Gifts",
    address: "852 International Dr, Orlando, FL 32819",
    coordinates: { latitude: 28.5383, longitude: -81.3792 },
    city: "Orlando",
    state: "FL",
    zipCode: "32819",
    rating: 4.0,
    reviewCount: 2456,
    isVerified: true,
    verificationTier: "Bronze"
  },

  // Southeast - Georgia
  {
    id: 21,
    name: "Atlanta Music Exchange",
    description: "Vinyl records and musical instruments",
    category: "Music",
    address: "147 Peachtree St, Atlanta, GA 30309",
    coordinates: { latitude: 33.7490, longitude: -84.3880 },
    city: "Atlanta",
    state: "GA",
    zipCode: "30309",
    rating: 4.3,
    reviewCount: 876,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Northeast - New York
  {
    id: 22,
    name: "NYC Tech Store",
    description: "Latest technology and mobile devices",
    category: "Electronics",
    address: "852 5th Ave, New York, NY 10065",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    city: "New York",
    state: "NY",
    zipCode: "10065",
    rating: 4.1,
    reviewCount: 5432,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 23,
    name: "Brooklyn Artisan Bakery",
    description: "Artisan breads and pastries made fresh daily",
    category: "Food",
    address: "963 Smith St, Brooklyn, NY 11231",
    coordinates: { latitude: 40.6782, longitude: -73.9442 },
    city: "Brooklyn",
    state: "NY",
    zipCode: "11231",
    rating: 4.8,
    reviewCount: 1876,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Northeast - Massachusetts
  {
    id: 24,
    name: "Boston Tea & Coffee",
    description: "Premium teas, coffees, and historical reproductions",
    category: "Food",
    address: "147 Newbury St, Boston, MA 02116",
    coordinates: { latitude: 42.3601, longitude: -71.0589 },
    city: "Boston",
    state: "MA",
    zipCode: "02116",
    rating: 4.4,
    reviewCount: 2341,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Mountain West - Nevada
  {
    id: 25,
    name: "Las Vegas Electronics Mega Store",
    description: "24/7 electronics and gaming equipment",
    category: "Electronics",
    address: "369 Las Vegas Blvd, Las Vegas, NV 89101",
    coordinates: { latitude: 36.1699, longitude: -115.1398 },
    city: "Las Vegas",
    state: "NV",
    zipCode: "89101",
    rating: 4.1,
    reviewCount: 5432,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Great Plains - Kansas
  {
    id: 26,
    name: "Kansas City BBQ Supply",
    description: "Barbecue equipment and signature sauces",
    category: "Food",
    address: "147 Main St, Kansas City, KS 66101",
    coordinates: { latitude: 39.1012, longitude: -94.5783 },
    city: "Kansas City",
    state: "KS",
    zipCode: "66101",
    rating: 4.4,
    reviewCount: 1654,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Additional states for comprehensive continental coverage
  {
    id: 27,
    name: "Portland Lobster Roll Company",
    description: "Fresh Maine lobster and seafood specialties",
    category: "Food",
    address: "852 Commercial St, Portland, ME 04101",
    coordinates: { latitude: 43.6591, longitude: -70.2568 },
    city: "Portland",
    state: "ME",
    zipCode: "04101",
    rating: 4.7,
    reviewCount: 3456,
    isVerified: true,
    verificationTier: "Platinum"
  },
  {
    id: 28,
    name: "Jackson Hole Ski Shop",
    description: "Premium skiing and snowboarding equipment",
    category: "Sports",
    address: "147 Broadway, Jackson, WY 83001",
    coordinates: { latitude: 43.4799, longitude: -110.7624 },
    city: "Jackson",
    state: "WY",
    zipCode: "83001",
    rating: 4.7,
    reviewCount: 1543,
    isVerified: true,
    verificationTier: "Platinum"
  },
  {
    id: 29,
    name: "Milwaukee Brewery Tours",
    description: "Craft beer tours and brewing supplies",
    category: "Food",
    address: "741 Water St, Milwaukee, WI 53202",
    coordinates: { latitude: 43.0389, longitude: -87.9065 },
    city: "Milwaukee",
    state: "WI",
    zipCode: "53202",
    rating: 4.5,
    reviewCount: 1876,
    isVerified: true,
    verificationTier: "Gold"
  },
  {
    id: 30,
    name: "Nashville Guitar Center",
    description: "Guitars, amps, and music recording equipment",
    category: "Music",
    address: "741 Broadway, Nashville, TN 37203",
    coordinates: { latitude: 36.1627, longitude: -86.7816 },
    city: "Nashville",
    state: "TN",
    zipCode: "37203",
    rating: 4.7,
    reviewCount: 2987,
    isVerified: true,
    verificationTier: "Platinum"
  }
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100;
}

function toRad(value) {
  return value * Math.PI / 180;
}

// Enhanced Continental US Location Search with distance options: city, state, all
export const searchContinentalUSStores = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 25,
      query = '',
      category = '',
      city = '',
      state = '',
      scope = 'radius', // 'radius', 'city', 'state', 'all'
      sortBy = 'distance'
    } = req.query;

    console.log('SPIRAL Continental US Search:', { 
      latitude, longitude, radius, query, category, city, state, scope, sortBy 
    });

    let filteredStores = [...continentalUSStores];

    // Apply scope-based filtering for continental US coverage
    if (scope === 'city' && city) {
      // Search within specific city only
      filteredStores = filteredStores.filter(store => 
        store.city.toLowerCase().includes(city.toLowerCase())
      );
    } else if (scope === 'state' && state) {
      // Search within specific state only
      filteredStores = filteredStores.filter(store => 
        store.state.toLowerCase() === state.toLowerCase()
      );
    } else if (scope === 'all') {
      // Search all continental US stores (no location filtering)
      console.log('Searching all continental US stores:', filteredStores.length);
    } else if (scope === 'radius' && latitude && longitude) {
      // Traditional radius-based search
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      const searchRadius = parseFloat(radius);

      // Calculate distances and filter by radius
      filteredStores = filteredStores
        .map(store => ({
          ...store,
          distance: calculateDistance(userLat, userLng, store.coordinates.latitude, store.coordinates.longitude),
          distanceText: `${calculateDistance(userLat, userLng, store.coordinates.latitude, store.coordinates.longitude).toFixed(1)} mi`
        }))
        .filter(store => store.distance <= searchRadius);
    }

    // Apply additional filters
    if (category && category !== 'all') {
      filteredStores = filteredStores.filter(store => 
        store.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by city (additional to scope)
    if (city && scope !== 'city') {
      filteredStores = filteredStores.filter(store => 
        store.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter by state (additional to scope)
    if (state && scope !== 'state') {
      filteredStores = filteredStores.filter(store => 
        store.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    // Text search across all store fields
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      filteredStores = filteredStores.filter(store => {
        const searchableText = `${store.name} ${store.description} ${store.category} ${store.city} ${store.state}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
    }

    // Add distances for non-radius searches if coordinates provided
    if (scope !== 'radius' && latitude && longitude) {
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

    // AI Enhancement (if available)
    let aiResults = null;
    if (query && openai) {
      try {
        aiResults = await aiLocationSearch(query, { city, state });
      } catch (error) {
        console.log('AI search unavailable:', error.message);
      }
    }

    const response = {
      success: true,
      stores: filteredStores.slice(0, 50), // Limit to 50 results
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
      aiResults,
      coverage: 'Continental US',
      message: `Found ${filteredStores.length} stores across continental US`
    };

    console.log(`Continental US Search Results: ${filteredStores.length} stores found`);
    res.json(response);

  } catch (error) {
    console.error('Continental US search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message,
      stores: [],
      coverage: 'Continental US'
    });
  }
};

// AI-powered location search using GPT-4
async function aiLocationSearch(query, userLocation) {
  try {
    const prompt = `
You are a SPIRAL local business search assistant covering all continental US states. Help users find stores and businesses based on their location and preferences.

User Location: ${userLocation ? `${userLocation.city}, ${userLocation.state}` : 'Continental US'}
Search Query: "${query}"

Available store categories: Electronics, Fashion, Music, Coffee, Books, Crafts, Food, Outdoor, Sports, Department Store, Automotive, Gifts, Art, Business

Tasks:
1. Analyze the user's search intent
2. Recommend relevant categories and search terms
3. Provide helpful suggestions for finding stores across continental US
4. Consider location context if provided

Respond with a JSON object containing:
{
  "reasoning": "Analysis of what the user is looking for",
  "suggestions": ["Alternative search suggestions"],
  "categories": ["Recommended categories"],
  "searchIntent": "What the user is looking for"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a helpful local business search assistant for the SPIRAL platform covering continental US." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI search error:', error);
    return {
      reasoning: "AI search temporarily unavailable",
      suggestions: ["Try browsing by category", "Search by store name"],
      categories: ["All categories"],
      searchIntent: "general search"
    };
  }
}

// Export the search function for Continental US stores
export { searchContinentalUSStores };