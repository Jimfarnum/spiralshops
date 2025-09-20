// AI Retailer Onboarding API for SPIRAL Platform
import express from 'express';

const router = express.Router();

const retailerCategories = [
  { id: 1, name: "Electronics", description: "Electronics and technology products" },
  { id: 2, name: "Fashion", description: "Clothing, accessories, and footwear" },
  { id: 3, name: "Home & Garden", description: "Home goods and gardening supplies" },
  { id: 4, name: "Food & Beverage", description: "Restaurants and food services" },
  { id: 5, name: "Health & Beauty", description: "Health and beauty products" },
  { id: 6, name: "Sports & Recreation", description: "Sports equipment and recreational items" },
  { id: 7, name: "Automotive", description: "Auto parts and vehicle services" },
  { id: 8, name: "Books & Media", description: "Books, music, and entertainment" }
];

// Get AI retailer onboarding categories
router.get('/ai-retailer-onboarding/categories', (req, res) => {
  try {
    res.json({
      success: true,
      categories: retailerCategories,
      totalCategories: retailerCategories.length,
      message: "AI retailer onboarding categories retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving AI retailer onboarding categories",
      error: error.message
    });
  }
});

export default router;