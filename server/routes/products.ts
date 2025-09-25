import express from "express";
import path from "path";
import fs from "fs";
import { normalizeProduct } from "../../utils/normalize.js";

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
      { id: 1, name: "Wireless Bluetooth Headphones - Premium Sound", price: 79.99, category: "Electronics" },
      { id: 2, name: "Smart Phone Case - Protective & Stylish", price: 24.99, category: "Electronics" },
      { id: 3, name: "Laptop Stand - Ergonomic Aluminum Design", price: 45.00, category: "Electronics" },
      { id: 4, name: "LED String Lights - Outdoor Waterproof", price: 19.99, category: "Home & Garden" },
      { id: 5, name: "Ceramic Plant Pot Set - Modern Design", price: 34.99, category: "Home & Garden" },
      { id: 6, name: "Cotton T-Shirt - Organic Soft Comfort", price: 18.99, category: "Clothing & Accessories" },
      { id: 7, name: "Running Sneakers - Lightweight Athletic", price: 89.99, category: "Clothing & Accessories" },
      { id: 8, name: "Leather Wallet - Minimalist RFID Blocking", price: 32.99, category: "Clothing & Accessories" }
    ];

    // Map product names to actual generated image filenames
    const imageMap = {
      "Wireless Bluetooth Headphones - Premium Sound": "Wireless_Bluetooth_Headphones_b3a5653e.png",
      "Smart Phone Case - Protective & Stylish": "Smart_Phone_Case_7c312bb2.png", 
      "Laptop Stand - Ergonomic Aluminum Design": "Laptop_Stand_Aluminum_f6a508a7.png",
      "LED String Lights - Outdoor Waterproof": "LED_String_Lights_0ee3ac9e.png",
      "Ceramic Plant Pot Set - Modern Design": "Ceramic_Plant_Pot_Set_05a974b5.png",
      "Cotton T-Shirt - Organic Soft Comfort": "Organic_Cotton_T-Shirt_0e3aa578.png",
      "Running Sneakers - Lightweight Athletic": "Running_Sneakers_Athletic_f36bb48b.png",
      "Leather Wallet - Minimalist RFID Blocking": "Leather_Wallet_RFID_7580bf82.png"
    };

    const formatted = products.map((p: any) => {
      // Map product names to actual generated image filenames
      const imageMap: { [key: string]: string } = {
        "Wireless Bluetooth Headphones - Premium Sound": "Wireless_Bluetooth_Headphones_b3a5653e.png",
        "Smart Phone Case - Protective & Stylish": "Smart_Phone_Case_7c312bb2.png", 
        "Laptop Stand - Ergonomic Aluminum Design": "Laptop_Stand_Aluminum_f6a508a7.png",
        "LED String Lights - Outdoor Waterproof": "LED_String_Lights_0ee3ac9e.png",
        "Ceramic Plant Pot Set - Modern Design": "Ceramic_Plant_Pot_Set_05a974b5.png",
        "Cotton T-Shirt - Organic Soft Comfort": "Organic_Cotton_T-Shirt_0e3aa578.png",
        "Running Sneakers - Lightweight Athletic": "Running_Sneakers_Athletic_f36bb48b.png",
        "Leather Wallet - Minimalist RFID Blocking": "Leather_Wallet_RFID_7580bf82.png"
      };
      
      const imageFileName = imageMap[p.name] || "default.png";
      const productWithImage = {
        ...p,
        image: `/images/${imageFileName}`,
        description: `High-quality ${p.name.toLowerCase()} available at local SPIRAL verified stores.`
      };
      
      // ✅ Apply unified normalization for consistent API contract
      return normalizeProduct(productWithImage);
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
      { id: 1, name: "Wireless Bluetooth Headphones - Premium Sound", price: 79.99, category: "Electronics", featured: true },
      { id: 2, name: "Smart Phone Case - Protective & Stylish", price: 24.99, category: "Electronics", featured: true },
      { id: 3, name: "Laptop Stand - Ergonomic Aluminum Design", price: 45.00, category: "Electronics", featured: true },
      { id: 4, name: "LED String Lights - Outdoor Waterproof", price: 19.99, category: "Home & Garden", featured: true },
      { id: 5, name: "Ceramic Plant Pot Set - Modern Design", price: 34.99, category: "Home & Garden", featured: true },
      { id: 6, name: "Cotton T-Shirt - Organic Soft Comfort", price: 18.99, category: "Clothing & Accessories", featured: true }
    ];

    // Map product names to actual generated image filenames
    const imageMap = {
      "Wireless Bluetooth Headphones - Premium Sound": "Wireless_Bluetooth_Headphones_b3a5653e.png",
      "Smart Phone Case - Protective & Stylish": "Smart_Phone_Case_7c312bb2.png",
      "Laptop Stand - Ergonomic Aluminum Design": "Laptop_Stand_Aluminum_f6a508a7.png",
      "LED String Lights - Outdoor Waterproof": "LED_String_Lights_0ee3ac9e.png",
      "Ceramic Plant Pot Set - Modern Design": "Ceramic_Plant_Pot_Set_05a974b5.png",
      "Cotton T-Shirt - Organic Soft Comfort": "Organic_Cotton_T-Shirt_0e3aa578.png"
    };

    const formatted = products.map((p: any) => {
      // Map product names to actual generated image filenames
      const imageMap: { [key: string]: string } = {
        "Wireless Bluetooth Headphones - Premium Sound": "Wireless_Bluetooth_Headphones_b3a5653e.png",
        "Smart Phone Case - Protective & Stylish": "Smart_Phone_Case_7c312bb2.png",
        "Laptop Stand - Ergonomic Aluminum Design": "Laptop_Stand_Aluminum_f6a508a7.png",
        "LED String Lights - Outdoor Waterproof": "LED_String_Lights_0ee3ac9e.png",
        "Ceramic Plant Pot Set - Modern Design": "Ceramic_Plant_Pot_Set_05a974b5.png",
        "Cotton T-Shirt - Organic Soft Comfort": "Organic_Cotton_T-Shirt_0e3aa578.png"
      };
      
      const imageFileName = imageMap[p.name] || "default.png";
      const productWithImage = {
        ...p,
        image: `/images/${imageFileName}`,
        description: `Featured ${p.name.toLowerCase()} - top choice for shoppers`
      };
      
      // ✅ Apply unified normalization for consistent API contract  
      return normalizeProduct(productWithImage);
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching featured products:", err);
    res.status(500).json({ error: "Failed to load featured products" });
  }
});

export default router;