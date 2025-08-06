// Global API Response Middleware for SPIRAL Standard Format
// Implements enterprise-grade response standardization

import { createSuccessResponse, createErrorResponse } from '../utils/standardResponse.js';

export function globalResponseMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // Add standard response methods to res object
  res.standard = (data, metadata = {}) => {
    if (!res.headersSent) {
      res.json(createSuccessResponse(data, startTime, metadata));
    }
  };
  
  res.error = (errorMessage, statusCode = 500, metadata = {}) => {
    if (!res.headersSent) {
      const errorResponse = createErrorResponse(errorMessage, startTime, statusCode);
      res.status(statusCode).json({ ...errorResponse, ...metadata });
    }
  };
  
  res.paginated = (items, total, page = 1, limit = 50, metadata = {}) => {
    if (!res.headersSent) {
      res.json(createPaginatedResponse(items, total, page, limit, startTime, metadata));
    }
  };
  
  // Store start time for any manual duration calculations
  req.startTime = startTime;
  
  next();
}

export function createPaginatedResponse(items, total, page = 1, limit = 50, startTime = Date.now(), metadata = {}) {
  return {
    success: true,
    data: {
      items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    },
    duration: `${Date.now() - startTime}ms`,
    timestamp: Date.now(),
    error: null,
    ...metadata
  };
}

// Error handling wrapper for async routes
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('Route error:', error);
      res.error(error.message || 'Internal server error', 500);
    });
  };
}

export default globalResponseMiddleware;