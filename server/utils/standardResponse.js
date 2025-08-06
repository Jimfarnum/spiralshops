// SPIRAL Standard API Response Format Utility
// Based on most effective code analysis - implements consistent response structure

export function createSuccessResponse(data, startTime = Date.now()) {
  return {
    success: true,
    data,
    duration: `${Date.now() - startTime}ms`,
    error: null
  };
}

export function createErrorResponse(error, startTime = Date.now()) {
  return {
    success: false,
    data: null,
    duration: `${Date.now() - startTime}ms`,
    error: typeof error === 'string' ? error : error.message
  };
}

// Enhanced response with additional metadata
export function createEnhancedResponse(data, metadata = {}, startTime = Date.now()) {
  return {
    success: true,
    data,
    duration: `${Date.now() - startTime}ms`,
    error: null,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata
    }
  };
}

// Async wrapper for consistent error handling
export async function withStandardResponse(operation, startTime = Date.now()) {
  try {
    const result = await operation();
    return createSuccessResponse(result, startTime);
  } catch (error) {
    return createErrorResponse(error, startTime);
  }
}

// Most effective pattern for API route standardization
export function standardizeApiRoute(routeHandler) {
  return async (req, res) => {
    const startTime = Date.now();
    try {
      const result = await routeHandler(req, res, startTime);
      if (!res.headersSent && result) {
        res.json(createSuccessResponse(result, startTime));
      }
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json(createErrorResponse(error, startTime));
      }
    }
  };
}