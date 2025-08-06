// SPIRAL AI-Powered Location Search API

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Comprehensive SPIRAL store database covering all continental US states
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

  // Southwest - Texas
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
  {
    id: 21,
    name: "Tampa Bay Seafood Market",
    description: "Fresh seafood and coastal cuisine ingredients",
    category: "Food",
    address: "963 Bay Shore Blvd, Tampa, FL 33606",
    coordinates: { latitude: 27.9506, longitude: -82.4572 },
    city: "Tampa",
    state: "FL",
    zipCode: "33606",
    rating: 4.5,
    reviewCount: 1234,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Southeast - Georgia
  {
    id: 22,
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

  // Southeast - North Carolina
  {
    id: 23,
    name: "Charlotte Motor Speedway Shop",
    description: "Racing memorabilia and automotive accessories",
    category: "Automotive",
    address: "258 Trade St, Charlotte, NC 28202",
    coordinates: { latitude: 35.2271, longitude: -80.8431 },
    city: "Charlotte",
    state: "NC",
    zipCode: "28202",
    rating: 4.2,
    reviewCount: 1543,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Southeast - South Carolina
  {
    id: 24,
    name: "Charleston Antiques",
    description: "Historic antiques and Southern home decor",
    category: "Home",
    address: "369 King St, Charleston, SC 29401",
    coordinates: { latitude: 32.7765, longitude: -79.9311 },
    city: "Charleston",
    state: "SC",
    zipCode: "29401",
    rating: 4.6,
    reviewCount: 654,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // Southeast - Tennessee
  {
    id: 25,
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
  },

  // Northeast - New York
  {
    id: 26,
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
    id: 27,
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
    id: 28,
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

  // Northeast - Pennsylvania
  {
    id: 29,
    name: "Philadelphia Cheese Steaks",
    description: "Authentic Philly cheesesteaks and hoagies",
    category: "Food",
    address: "258 South St, Philadelphia, PA 19147",
    coordinates: { latitude: 39.9526, longitude: -75.1652 },
    city: "Philadelphia",
    state: "PA",
    zipCode: "19147",
    rating: 4.5,
    reviewCount: 3456,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Complete continental coverage - additional states
  // Northeast - New Jersey  
  {
    id: 30,
    name: "Jersey Shore Surf Shop",
    description: "Surfboards, swimwear, and beach accessories",
    category: "Sports",
    address: "369 Boardwalk, Atlantic City, NJ 08401",
    coordinates: { latitude: 39.3643, longitude: -74.4229 },
    city: "Atlantic City",
    state: "NJ",
    zipCode: "08401",
    rating: 4.2,
    reviewCount: 987,
    isVerified: true,
    verificationTier: "Bronze"
  },

  // More major states coverage
  // Midwest - Wisconsin
  {
    id: 31,
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

  // Midwest - Indiana
  {
    id: 32,
    name: "Indianapolis Motor Speedway Store",
    description: "Racing gear and Indianapolis 500 memorabilia",
    category: "Sports",
    address: "852 16th St, Indianapolis, IN 46202",
    coordinates: { latitude: 39.7684, longitude: -86.1581 },
    city: "Indianapolis",
    state: "IN",
    zipCode: "46202",
    rating: 4.3,
    reviewCount: 2134,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Midwest - Iowa
  {
    id: 33,
    name: "Iowa Farm Fresh Market",
    description: "Locally grown produce and farm goods",
    category: "Food",
    address: "963 Locust St, Des Moines, IA 50309",
    coordinates: { latitude: 41.5868, longitude: -93.6250 },
    city: "Des Moines",
    state: "IA",
    zipCode: "50309",
    rating: 4.7,
    reviewCount: 892,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // Great Plains - Kansas
  {
    id: 34,
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

  // Great Plains - Nebraska
  {
    id: 35,
    name: "Omaha Steakhouse Supply",
    description: "Premium beef cuts and grilling accessories", 
    category: "Food",
    address: "258 Dodge St, Omaha, NE 68102",
    coordinates: { latitude: 41.2565, longitude: -95.9345 },
    city: "Omaha",
    state: "NE",
    zipCode: "68102",
    rating: 4.6,
    reviewCount: 2987,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // Mountain West - Nevada
  {
    id: 36,
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

  // Mountain West - New Mexico
  {
    id: 37,
    name: "Santa Fe Artisan Gallery",
    description: "Native American art and Southwestern crafts",
    category: "Art",
    address: "741 Canyon Rd, Santa Fe, NM 87501",
    coordinates: { latitude: 35.6870, longitude: -105.9378 },
    city: "Santa Fe",
    state: "NM",
    zipCode: "87501", 
    rating: 4.8,
    reviewCount: 1234,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // Mountain West - Idaho
  {
    id: 38,
    name: "Boise Outdoor Adventures",
    description: "Camping, hiking, and outdoor recreation gear",
    category: "Outdoor",
    address: "852 State St, Boise, ID 83702",
    coordinates: { latitude: 43.6150, longitude: -116.2023 },
    city: "Boise",
    state: "ID",
    zipCode: "83702",
    rating: 4.5,
    reviewCount: 987,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Mountain West - Montana  
  {
    id: 39,
    name: "Billings Western Wear",
    description: "Authentic western clothing and cowboy gear",
    category: "Fashion",
    address: "963 1st Ave N, Billings, MT 59101",
    coordinates: { latitude: 45.7833, longitude: -108.5007 },
    city: "Billings",
    state: "MT",
    zipCode: "59101",
    rating: 4.3,
    reviewCount: 654,
    isVerified: true,
    verificationTier: "Bronze"
  },

  // Mountain West - Wyoming
  {
    id: 40,
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

  // Additional states coverage for complete continental US
  // Southeast - Virginia
  {
    id: 41,
    name: "Virginia Beach Surf & Turf",
    description: "Surfboards and seafood market combination",
    category: "Sports",
    address: "258 Atlantic Ave, Virginia Beach, VA 23451",
    coordinates: { latitude: 36.8529, longitude: -75.9780 },
    city: "Virginia Beach", 
    state: "VA",
    zipCode: "23451",
    rating: 4.2,
    reviewCount: 1876,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Southeast - Kentucky
  {
    id: 42,
    name: "Louisville Bourbon Distillery Store",
    description: "Bourbon whiskey and distilling supplies",
    category: "Food",
    address: "369 Bardstown Rd, Louisville, KY 40204", 
    coordinates: { latitude: 38.2527, longitude: -85.7585 },
    city: "Louisville",
    state: "KY",
    zipCode: "40204",
    rating: 4.6,
    reviewCount: 2987,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // Southeast - West Virginia
  {
    id: 43,
    name: "Charleston Coal Country Crafts",
    description: "Handmade Appalachian crafts and coal mining memorabilia",
    category: "Crafts", 
    address: "741 Capitol St, Charleston, WV 25301",
    coordinates: { latitude: 38.3498, longitude: -81.6326 },
    city: "Charleston",
    state: "WV",
    zipCode: "25301",
    rating: 4.4,
    reviewCount: 543,
    isVerified: true,
    verificationTier: "Silver"
  },

  // Southeast - Maryland
  {
    id: 44,
    name: "Baltimore Crab House Supplies",
    description: "Fresh seafood and crab cooking equipment",
    category: "Food",
    address: "852 Light St, Baltimore, MD 21202",
    coordinates: { latitude: 39.2904, longitude: -76.6122 },
    city: "Baltimore",
    state: "MD", 
    zipCode: "21202",
    rating: 4.5,
    reviewCount: 2134,
    isVerified: true,
    verificationTier: "Gold"
  },

  // Southeast - Delaware
  {
    id: 45,
    name: "Wilmington Tax-Free Shopping",
    description: "Electronics and luxury goods with no sales tax",
    category: "Electronics",
    address: "963 Market St, Wilmington, DE 19801",
    coordinates: { latitude: 39.7391, longitude: -75.5398 },
    city: "Wilmington", 
    state: "DE",
    zipCode: "19801",
    rating: 4.1,
    reviewCount: 1432,
    isVerified: true,
    verificationTier: "Bronze"
  },

  // New England - Connecticut
  {
    id: 46,
    name: "Hartford Insurance District Supplies",
    description: "Business supplies and professional services",
    category: "Business",
    address: "147 Asylum St, Hartford, CT 06103",
    coordinates: { latitude: 41.7658, longitude: -72.6734 },
    city: "Hartford",
    state: "CT",
    zipCode: "06103",
    rating: 4.0,
    reviewCount: 876,
    isVerified: true,
    verificationTier: "Silver"
  },

  // New England - Rhode Island
  {
    id: 47,
    name: "Newport Nautical Supplies",
    description: "Sailing equipment and marine accessories",
    category: "Sports",
    address: "258 Thames St, Newport, RI 02840",
    coordinates: { latitude: 41.4901, longitude: -71.3128 },
    city: "Newport",
    state: "RI", 
    zipCode: "02840",
    rating: 4.3,
    reviewCount: 987,
    isVerified: true,
    verificationTier: "Gold"
  },

  // New England - Vermont
  {
    id: 48,
    name: "Vermont Maple Syrup Co.",
    description: "Authentic Vermont maple syrup and products",
    category: "Food",
    address: "369 State St, Montpelier, VT 05602",
    coordinates: { latitude: 44.2601, longitude: -72.5806 },
    city: "Montpelier",
    state: "VT",
    zipCode: "05602",
    rating: 4.8,
    reviewCount: 1654,
    isVerified: true,
    verificationTier: "Platinum"
  },

  // New England - New Hampshire  
  {
    id: 49,
    name: "Concord Live Free Electronics",
    description: "Tax-free electronics and tech gadgets",
    category: "Electronics", 
    address: "741 Main St, Concord, NH 03301",
    coordinates: { latitude: 43.2081, longitude: -71.5376 },
    city: "Concord",
    state: "NH",
    zipCode: "03301",
    rating: 4.2,
    reviewCount: 1234,
    isVerified: true,
    verificationTier: "Silver"
  },

  // New England - Maine
  {
    id: 50,
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