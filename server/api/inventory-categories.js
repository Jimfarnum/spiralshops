// Inventory Categories API for SPIRAL Platform
import express from 'express';

const router = express.Router();

const inventoryCategories = [
  {
    id: 1,
    name: "Electronics",
    subcategories: ["Smartphones", "Laptops", "Tablets", "Audio Equipment", "Gaming Consoles"],
    icon: "📱",
    description: "Electronic devices and accessories"
  },
  {
    id: 2,
    name: "Fashion & Apparel",
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry"],
    icon: "👕",
    description: "Clothing and fashion accessories"
  },
  {
    id: 3,
    name: "Home & Garden",
    subcategories: ["Furniture", "Home Decor", "Kitchen Appliances", "Gardening Tools", "Storage"],
    icon: "🏠",
    description: "Home improvement and garden supplies"
  },
  {
    id: 4,
    name: "Sports & Recreation",
    subcategories: ["Exercise Equipment", "Outdoor Gear", "Sports Apparel", "Team Sports", "Water Sports"],
    icon: "⚽",
    description: "Sports equipment and recreational items"
  },
  {
    id: 5,
    name: "Health & Beauty",
    subcategories: ["Skincare", "Makeup", "Personal Care", "Vitamins", "Medical Supplies"],
    icon: "💄",
    description: "Health and beauty products"
  },
  {
    id: 6,
    name: "Books & Media",
    subcategories: ["Books", "Music", "Movies", "Video Games", "Educational Materials"],
    icon: "📚",
    description: "Books, media, and educational content"
  }
];

// Get inventory categories
router.get('/inventory/categories', (req, res) => {
  try {
    res.json({
      success: true,
      categories: inventoryCategories,
      totalCategories: inventoryCategories.length,
      message: "Inventory categories retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving inventory categories",
      error: error.message
    });
  }
});

// Get category by ID
router.get('/inventory/categories/:id', (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = inventoryCategories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Inventory category not found"
      });
    }
    
    res.json({
      success: true,
      category,
      message: "Inventory category retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving inventory category",
      error: error.message
    });
  }
});

export default router;