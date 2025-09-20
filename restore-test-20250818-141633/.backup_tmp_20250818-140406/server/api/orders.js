// 📁 /api/orders.js — SPIRAL Order Storage & Retrieval
import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Middleware to parse JSON
router.use(express.json());

// TEMP in-memory DB — replace with Cloudant or Firebase
const orderHistory = [];

router.post("/order", (req, res) => {
  const {
    shopperId,
    retailerId,
    mallId,
    items,
    totalAmount,
    spiralsEarned
  } = req.body;

  const order = {
    orderId: uuidv4(),
    shopperId,
    retailerId,
    mallId,
    items,
    totalAmount,
    spiralsEarned,
    timestamp: new Date().toISOString(),
    status: "completed"
  };

  orderHistory.push(order);
  console.log(`📋 SPIRAL Order Created: ${order.orderId} - $${totalAmount} (${spiralsEarned} SPIRALs earned)`);
  
  res.json({ 
    success: true, 
    order,
    message: "Order processed successfully"
  });
});

router.get("/order/shopper/:shopperId", (req, res) => {
  const shopperOrders = orderHistory.filter(o => o.shopperId === req.params.shopperId);
  res.json({ 
    success: true,
    orders: shopperOrders,
    totalOrders: shopperOrders.length
  });
});

router.get("/order/retailer/:retailerId", (req, res) => {
  const retailerOrders = orderHistory.filter(o => o.retailerId === req.params.retailerId);
  const totalRevenue = retailerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  res.json({ 
    success: true,
    orders: retailerOrders,
    totalOrders: retailerOrders.length,
    totalRevenue
  });
});

// Get all orders (admin view)
router.get("/orders", (req, res) => {
  res.json({
    success: true,
    orders: orderHistory,
    totalOrders: orderHistory.length,
    totalRevenue: orderHistory.reduce((sum, order) => sum + order.totalAmount, 0)
  });
});

// Get order by ID
router.get("/order/:orderId", (req, res) => {
  const order = orderHistory.find(o => o.orderId === req.params.orderId);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: "Order not found"
    });
  }
  
  res.json({
    success: true,
    order
  });
});

export default router;