import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// Helper function to normalize image paths
function normalizePath(imagePath: string | undefined | null): string {
  if (!imagePath || imagePath.trim() === '') return '/images/default-product.png';
  
  const cleanPath = imagePath.trim();
  
  // If it's already a proper /images/ path, return it
  if (cleanPath.startsWith('/images/')) return cleanPath;
  
  // Convert static/images/ or /static/images/ to /images/
  if (cleanPath.includes('static/images/')) {
    return cleanPath.replace(/.*static\/images\//, '/images/');
  }
  
  // If it's just a filename, prepend /images/
  if (!cleanPath.startsWith('/')) {
    return `/images/${cleanPath}`;
  }
  
  // If it starts with /images but no slash, fix it
  if (cleanPath.startsWith('images/')) {
    return `/${cleanPath}`;
  }
  
  return cleanPath;
}

router.get("/", async (req, res) => {
  try {
    // Simple product data with proper image paths
    const staticImagesDir = path.join(process.cwd(), "static", "images");
    
    const products = [
      { id: 1, name: "Wireless Bluetooth Headphones", price: 79.99, category: "Electronics" },
      { id: 2, name: "Smart Fitness Watch", price: 199.99, category: "Electronics" },
      { id: 3, name: "Organic Coffee Beans", price: 12.99, category: "Food" },
      { id: 4, name: "Designer Handbag", price: 149.99, category: "Fashion" },
      { id: 5, name: "Artisan Chocolate", price: 8.99, category: "Food" },
      { id: 101, name: "Beta Denim Jacket", price: 89.99, category: "Fashion" },
      { id: 102, name: "Beta Hiking Boots", price: 129.99, category: "Footwear" },
      { id: 103, name: "Beta Coffee Mug", price: 14.99, category: "Home" }
    ];

    const formatted = products.map((p: any) => {
      const sanitizedId = String(p.id).replace(/[^A-Za-z0-9_-]/g, '');
      const fileName = `beta-${sanitizedId}.png`;
      
      // 🚀 PRODUCTION FIX: Use object storage URLs for all AI-generated images
      // These images are now uploaded to object storage and accessible via /public-objects/
      return {
        ...p,
        image: `/public-objects/${fileName}` // Use object storage URLs for production compatibility
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// Featured products endpoint
router.get("/featured", async (req, res) => {
  try {
    // Get the main products and return the first 6 as featured
    const staticImagesDir = path.join(process.cwd(), "static", "images");
    
    const products = [
      { id: 1, name: "Wireless Bluetooth Headphones", price: 79.99, category: "Electronics", featured: true },
      { id: 2, name: "Smart Fitness Watch", price: 199.99, category: "Electronics", featured: true },
      { id: 3, name: "Organic Coffee Beans", price: 12.99, category: "Food", featured: true },
      { id: 4, name: "Designer Handbag", price: 149.99, category: "Fashion", featured: true },
      { id: 5, name: "Artisan Chocolate", price: 8.99, category: "Food", featured: true },
      { id: 101, name: "Beta Denim Jacket", price: 89.99, category: "Fashion", featured: true }
    ];

    const formatted = products.map((p: any) => {
      const sanitizedId = String(p.id).replace(/[^A-Za-z0-9_-]/g, '');
      const fileName = `beta-${sanitizedId}.png`;
      
      // 🚀 PRODUCTION FIX: Use object storage URLs for featured products
      // AI images are uploaded to object storage and accessible via /public-objects/
      return {
        ...p,
        image: `/public-objects/${fileName}` // Production-ready object storage URLs
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching featured products:", err);
    res.status(500).json({ error: "Failed to load featured products" });
  }
});

export default router;