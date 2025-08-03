// SPIRAL Wishlist Alert System API
// Handles price drop and restock notifications for wishlist items

import { v4 as uuidv4 } from 'uuid';

// In-memory storage for development (replace with database in production)
let wishlistItems = [];
let priceAlerts = [];

// Sample product data for price tracking (mock data)
const productPrices = {
  "prod_1": { price: 299.99, inStock: true, name: "Wireless Bluetooth Headphones" },
  "prod_2": { price: 159.99, inStock: false, name: "Smart Fitness Tracker" },
  "prod_3": { price: 89.99, inStock: true, name: "Portable Phone Charger" },
  "prod_4": { price: 199.99, inStock: true, name: "Bluetooth Speaker" },
  "prod_5": { price: 49.99, inStock: true, name: "Phone Case" },
};

export const wishlistAlertRoutes = {
  // Add item to wishlist with alert preferences
  addWishlistItem: (req, res) => {
    try {
      const { shopperId, productId, alertPreferences } = req.body;
      
      if (!shopperId || !productId) {
        return res.status(400).json({ 
          error: 'Missing required fields: shopperId and productId' 
        });
      }

      // Check if item already exists in wishlist
      const existingItem = wishlistItems.find(
        item => item.shopperId === shopperId && item.productId === productId && item.isActive
      );

      if (existingItem) {
        return res.status(409).json({ 
          error: 'Product already in wishlist',
          existingItem 
        });
      }

      const wishlistItem = {
        id: wishlistItems.length + 1,
        shopperId,
        productId,
        addedAt: new Date().toISOString(),
        alertPreferences: alertPreferences || { priceDrop: true, restock: true },
        lastPrice: productPrices[productId]?.price || null,
        isActive: true
      };

      wishlistItems.push(wishlistItem);

      res.status(201).json({
        success: true,
        message: 'Product added to wishlist with alert preferences',
        wishlistItem,
        product: productPrices[productId] || null
      });

    } catch (error) {
      console.error('Add wishlist item error:', error);
      res.status(500).json({ error: 'Failed to add item to wishlist' });
    }
  },

  // Get shopper's wishlist items
  getWishlistItems: (req, res) => {
    try {
      const { shopperId } = req.params;
      
      const shopperWishlist = wishlistItems
        .filter(item => item.shopperId === shopperId && item.isActive)
        .map(item => ({
          ...item,
          product: productPrices[item.productId] || { 
            name: 'Unknown Product', 
            price: 0, 
            inStock: false 
          }
        }));

      res.json({
        success: true,
        wishlistItems: shopperWishlist,
        totalItems: shopperWishlist.length
      });

    } catch (error) {
      console.error('Get wishlist items error:', error);
      res.status(500).json({ error: 'Failed to retrieve wishlist items' });
    }
  },

  // Update alert preferences for wishlist item
  updateAlertPreferences: (req, res) => {
    try {
      const { itemId } = req.params;
      const { alertPreferences } = req.body;

      const itemIndex = wishlistItems.findIndex(item => item.id === parseInt(itemId));
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }

      wishlistItems[itemIndex].alertPreferences = {
        ...wishlistItems[itemIndex].alertPreferences,
        ...alertPreferences
      };

      res.json({
        success: true,
        message: 'Alert preferences updated',
        wishlistItem: wishlistItems[itemIndex]
      });

    } catch (error) {
      console.error('Update alert preferences error:', error);
      res.status(500).json({ error: 'Failed to update alert preferences' });
    }
  },

  // Remove item from wishlist
  removeWishlistItem: (req, res) => {
    try {
      const { itemId } = req.params;
      const { shopperId } = req.body;

      const itemIndex = wishlistItems.findIndex(
        item => item.id === parseInt(itemId) && item.shopperId === shopperId
      );
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }

      // Soft delete by setting isActive to false
      wishlistItems[itemIndex].isActive = false;

      res.json({
        success: true,
        message: 'Item removed from wishlist'
      });

    } catch (error) {
      console.error('Remove wishlist item error:', error);
      res.status(500).json({ error: 'Failed to remove item from wishlist' });
    }
  },

  // Simulate price changes for testing alerts
  simulatePriceChange: (req, res) => {
    try {
      const { productId, newPrice, inStock } = req.body;

      if (!productPrices[productId]) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const oldPrice = productPrices[productId].price;
      const wasInStock = productPrices[productId].inStock;

      // Update product data
      productPrices[productId].price = newPrice || oldPrice;
      productPrices[productId].inStock = inStock !== undefined ? inStock : wasInStock;

      // Check for price drop alerts
      if (newPrice && newPrice < oldPrice) {
        const affectedItems = wishlistItems.filter(
          item => item.productId === productId && 
                 item.isActive && 
                 item.alertPreferences.priceDrop
        );

        affectedItems.forEach(item => {
          const percentageChange = ((oldPrice - newPrice) / oldPrice * 100).toFixed(2);
          
          const alert = {
            id: priceAlerts.length + 1,
            wishlistItemId: item.id,
            shopperId: item.shopperId,
            productId,
            originalPrice: oldPrice,
            currentPrice: newPrice,
            percentageChange,
            alertType: 'price_drop',
            alertSent: false,
            createdAt: new Date().toISOString()
          };

          priceAlerts.push(alert);
        });
      }

      // Check for restock alerts
      if (inStock && !wasInStock) {
        const affectedItems = wishlistItems.filter(
          item => item.productId === productId && 
                 item.isActive && 
                 item.alertPreferences.restock
        );

        affectedItems.forEach(item => {
          const alert = {
            id: priceAlerts.length + 1,
            wishlistItemId: item.id,
            shopperId: item.shopperId,
            productId,
            originalPrice: oldPrice,
            currentPrice: newPrice || oldPrice,
            alertType: 'restock',
            alertSent: false,
            createdAt: new Date().toISOString()
          };

          priceAlerts.push(alert);
        });
      }

      res.json({
        success: true,
        message: 'Price change simulated',
        oldPrice,
        newPrice: newPrice || oldPrice,
        wasInStock,
        nowInStock: inStock !== undefined ? inStock : wasInStock,
        alertsCreated: priceAlerts.filter(alert => 
          alert.productId === productId && !alert.alertSent
        ).length
      });

    } catch (error) {
      console.error('Simulate price change error:', error);
      res.status(500).json({ error: 'Failed to simulate price change' });
    }
  },

  // Get pending alerts for a shopper
  getPendingAlerts: (req, res) => {
    try {
      const { shopperId } = req.params;

      const pendingAlerts = priceAlerts
        .filter(alert => alert.shopperId === shopperId && !alert.alertSent)
        .map(alert => ({
          ...alert,
          product: productPrices[alert.productId] || { name: 'Unknown Product' }
        }));

      res.json({
        success: true,
        pendingAlerts,
        totalAlerts: pendingAlerts.length
      });

    } catch (error) {
      console.error('Get pending alerts error:', error);
      res.status(500).json({ error: 'Failed to retrieve pending alerts' });
    }
  },

  // Mark alerts as sent
  markAlertsSent: (req, res) => {
    try {
      const { alertIds } = req.body;

      alertIds.forEach(alertId => {
        const alertIndex = priceAlerts.findIndex(alert => alert.id === alertId);
        if (alertIndex !== -1) {
          priceAlerts[alertIndex].alertSent = true;
          priceAlerts[alertIndex].sentAt = new Date().toISOString();
        }
      });

      res.json({
        success: true,
        message: `${alertIds.length} alerts marked as sent`
      });

    } catch (error) {
      console.error('Mark alerts sent error:', error);
      res.status(500).json({ error: 'Failed to mark alerts as sent' });
    }
  },

  // Get current product prices (for testing)
  getProductPrices: (req, res) => {
    res.json({
      success: true,
      products: productPrices
    });
  }
};

export default wishlistAlertRoutes;