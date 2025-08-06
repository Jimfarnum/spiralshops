// SPIRAL Standard Response Middleware
// Automatically applies standard response format to all routes

export function standardResponseMiddleware() {
  return (req, res, next) => {
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to enforce standard format
    res.json = function(body) {
      // If response already follows standard format, use as-is
      if (body && typeof body === 'object' && 
          body.hasOwnProperty('success') && 
          body.hasOwnProperty('data') && 
          body.hasOwnProperty('error')) {
        return originalJson.call(this, body);
      }
      
      // Otherwise, wrap in standard format
      const standardResponse = {
        success: res.statusCode < 400,
        data: res.statusCode < 400 ? body : null,
        error: res.statusCode >= 400 ? (body.message || body.error || 'Unknown error') : null
      };
      
      return originalJson.call(this, standardResponse);
    };
    
    next();
  };
}

// Route wrapper for automatic standard responses
export function withStandardResponse(handler) {
  return async (req, res) => {
    try {
      const result = await handler(req, res);
      if (result && !res.headersSent) {
        res.json({ success: true, data: result, error: null });
      }
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ success: false, data: null, error: err.message });
      }
    }
  };
}