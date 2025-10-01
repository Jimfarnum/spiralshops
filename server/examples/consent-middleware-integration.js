// Example: Protecting API routes with consent middleware
import express from 'express';
import { requireCurrentConsent } from './routes/legal.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();

// Example 1: Protect Orders API - Requires consent for all order operations
app.use("/api/orders", authMiddleware(), requireCurrentConsent(), ordersRouter);

// Example 2: Protect Retailer Dashboard - Mall operators need consent
app.use("/api/retailer", authMiddleware(), requireCurrentConsent(), retailerRouter);

// Example 3: Protect Mall Management - Specific consent for mall operators
app.use("/api/mall", authMiddleware(), requireCurrentConsent(), mallRouter);

// Example 4: Protect Payment Processing - Critical financial operations
app.use("/api/payments", authMiddleware(), requireCurrentConsent(), paymentsRouter);

// Example 5: Protect Admin Functions - Admin consent required
app.use("/api/admin", authMiddleware(), requireCurrentConsent(), adminRouter);

// Example 6: Selective consent protection - Only for specific endpoints
app.get("/api/profile", authMiddleware(), profileController.get);
app.put("/api/profile", authMiddleware(), requireCurrentConsent(), profileController.update);

// Example 7: Role-specific consent middleware
function requireRetailerConsent() {
  return (req, res, next) => {
    if (req.user?.role === 'retailer') {
      return requireCurrentConsent()(req, res, next);
    }
    next();
  };
}

app.use("/api/inventory", authMiddleware(), requireRetailerConsent(), inventoryRouter);

// Example 8: Conditional consent based on operation type
app.post("/api/stores", authMiddleware(), requireCurrentConsent(), storesController.create);
app.get("/api/stores", authMiddleware(), storesController.list); // No consent needed for reading

// Example 9: Consent for data modification operations
app.get("/api/products", authMiddleware(), productsController.list);
app.post("/api/products", authMiddleware(), requireCurrentConsent(), productsController.create);
app.put("/api/products/:id", authMiddleware(), requireCurrentConsent(), productsController.update);
app.delete("/api/products/:id", authMiddleware(), requireCurrentConsent(), productsController.delete);

// Example 10: Multiple middleware stack with consent
app.use("/api/billing", [
  authMiddleware(),
  requireCurrentConsent(),
  rateLimitMiddleware(),
  billingRouter
]);

export default app;