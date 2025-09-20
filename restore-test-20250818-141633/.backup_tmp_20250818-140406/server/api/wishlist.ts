import express, { Router } from 'express';
import { wishlistAlertRoutes } from './wishlist-alerts.js';

const router: Router = express.Router();

// Wishlist management endpoints
router.post('/wishlist/add', wishlistAlertRoutes.addWishlistItem);
router.get('/wishlist/:shopperId', wishlistAlertRoutes.getWishlistItems);
router.put('/wishlist/:itemId/alerts', wishlistAlertRoutes.updateAlertPreferences);
router.delete('/wishlist/:itemId', wishlistAlertRoutes.removeWishlistItem);

// Price alert endpoints
router.get('/alerts/:shopperId', wishlistAlertRoutes.getPendingAlerts);
router.post('/alerts/mark-sent', wishlistAlertRoutes.markAlertsSent);

// Testing endpoints
router.post('/products/simulate-price-change', wishlistAlertRoutes.simulatePriceChange);
router.get('/products/prices', wishlistAlertRoutes.getProductPrices);

export default router;