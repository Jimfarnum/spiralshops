// Business Categories API for SPIRAL Platform
import express from 'express';

const router = express.Router();

const businessCategories = [
  {
    id: 1,
    name: "Electronics",
    subcategories: ["Smartphones", "Laptops", "Tablets", "Audio", "Gaming"],
    icon: "📱"
  },
  {
    id: 2,
    name: "Fashion & Apparel",
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry"],
    icon: "👕"
  },
  {
    id: 3,
    name: "Home & Garden",
    subcategories: ["Furniture", "Home Decor", "Appliances", "Garden", "Tools"],
    icon: "🏠"
  },
  {
    id: 4,
    name: "Food & Beverages",
    subcategories: ["Restaurants", "Cafes", "Grocery", "Bakery", "Specialty Foods"],
    icon: "🍕"
  },
  {
    id: 5,
    name: "Health & Beauty",
    subcategories: ["Skincare", "Makeup", "Pharmacy", "Wellness", "Fitness"],
    icon: "💄"
  },
  {
    id: 6,
    name: "Sports & Recreation",
    subcategories: ["Sporting Goods", "Outdoor", "Fitness Equipment", "Team Sports", "Water Sports"],
    icon: "⚽"
  },
  {
    id: 7,
    name: "Automotive",
    subcategories: ["Auto Parts", "Car Care", "Motorcycles", "RV", "Boats"],
    icon: "🚗"
  },
  {
    id: 8,
    name: "Books & Media",
    subcategories: ["Books", "Music", "Movies", "Games", "Educational"],
    icon: "📚"
  }
];

// Get all business categories
router.get('/business-categories', (req, res) => {
  try {
    res.json({
      success: true,
      categories: businessCategories,
      totalCategories: businessCategories.length,
      message: "Business categories retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving business categories",
      error: error.message
    });
  }
});

// Get category by ID
router.get('/business-categories/:id', (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = businessCategories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    res.json({
      success: true,
      category,
      message: "Category retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving category",
      error: error.message
    });
  }
});

// Get subcategories for a category
router.get('/business-categories/:id/subcategories', (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = businessCategories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    res.json({
      success: true,
      subcategories: category.subcategories,
      categoryName: category.name,
      totalSubcategories: category.subcategories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving subcategories",
      error: error.message
    });
  }
});

export default router;