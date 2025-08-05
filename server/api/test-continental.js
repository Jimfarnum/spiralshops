// Simple Continental US Test API
export function testContinentalSearch(req, res) {
  return res.json({
    success: true,
    message: "Continental US search working",
    stores: [
      {
        id: 1,
        name: "Test Store CA",
        category: "Electronics",
        city: "San Francisco",
        state: "CA",
        rating: 4.5
      },
      {
        id: 2,
        name: "Test Store NY", 
        category: "Fashion",
        city: "New York",
        state: "NY",
        rating: 4.2
      }
    ]
  });
}