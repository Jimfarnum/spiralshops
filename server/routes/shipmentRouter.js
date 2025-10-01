import express from 'express';
import { createShipment, listShipmentsByOrder, trackShipment } from './shipmentRoutes.js';

const router = express.Router();

// Create a new shipment
router.post('/create', createShipment);

// List shipments for a specific order
router.get('/order/:orderId', listShipmentsByOrder);

// Track a shipment by tracking number
router.post('/track', trackShipment);

export default router;