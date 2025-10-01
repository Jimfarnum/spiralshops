import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import shippingRoutes from './routes/shipping.js';
import discountsRoutes from './routes/discounts.js';
import onboardingRoutes from './routes/onboarding.js';
import dynamicOnboardingRoutes from './routes/dynamicOnboarding.js';
import agentsRoutes from './routes/agents.js';

// Import services
import { initializeCloudant } from './lib/cloudant.js';
import { initializeRegistry } from './lib/registry.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'SPIRAL Backend Services'
  });
});

// API Routes
app.use('/api/shipping', shippingRoutes);
app.use('/api/discounts', discountsRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/onboarding/dynamic', dynamicOnboardingRoutes);
app.use('/api/agents', agentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SPIRAL Backend Services',
    version: '1.0.0',
    endpoints: {
      shipping: '/api/shipping',
      discounts: '/api/discounts', 
      onboarding: '/api/onboarding',
      agents: '/api/agents'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Initialize external services
    await initializeCloudant();
    await initializeRegistry();
    
    app.listen(PORT, () => {
      console.log(`🚀 SPIRAL Backend Services running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();