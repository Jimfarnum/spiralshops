// Global Response Formatter Middleware for SPIRAL Standard API Format
// Automatically applies enterprise-grade response format to all routes

export function globalResponseFormatter() {
  return (req, res, next) => {
    const originalJson = res.json;
    const originalSend = res.send;
    
    // Store original methods
    res._originalJson = originalJson;
    res._originalSend = originalSend;
    
    // Override json method for automatic standardization
    res.json = function(body) {
      // Skip if already in standard format
      if (body && typeof body === 'object' && 
          body.hasOwnProperty('success') && 
          body.hasOwnProperty('data') && 
          body.hasOwnProperty('error') &&
          body.hasOwnProperty('timestamp')) {
        return originalJson.call(this, body);
      }
      
      // Auto-format legacy responses
      const standardResponse = {
        success: res.statusCode < 400,
        data: res.statusCode < 400 ? body : null,
        duration: "0ms", // Will be overridden if startTime was tracked
        timestamp: Date.now(),
        error: res.statusCode >= 400 ? (body.message || body.error || 'Unknown error') : null
      };
      
      return originalJson.call(this, standardResponse);
    };
    
    // Track request start time for duration calculation
    req._startTime = Date.now();
    
    next();
  };
}

// Helper function to create standardized route wrapper
export function standardizeRoute(handler) {
  return async (req, res, next) => {
    const startTime = req._startTime || Date.now();
    
    try {
      const result = await handler(req, res, next);
      
      // If handler didn't send response and returned data
      if (result && !res.headersSent) {
        res.json({
          success: true,
          data: result,
          duration: `${Date.now() - startTime}ms`,
          timestamp: Date.now(),
          error: null
        });
      }
    } catch (error) {
      if (!res.headersSent) {
        const statusCode = error.statusCode || error.status || 500;
        res.status(statusCode).json({
          success: false,
          data: null,
          duration: `${Date.now() - startTime}ms`,
          timestamp: Date.now(),
          error: error.message || 'Internal server error'
        });
      }
    }
  };
}

// Batch standardization utility for multiple endpoints
export function batchStandardizeEndpoints(app, endpoints) {
  endpoints.forEach(({ method, path, handler }) => {
    app[method.toLowerCase()](path, standardizeRoute(handler));
  });
}