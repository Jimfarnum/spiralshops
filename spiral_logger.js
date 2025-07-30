import fs from 'fs';
import path from 'path';

// Comprehensive SPIRAL action logging system
const logs = [];

function logAction(action) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ...action,
    sessionId: process.env.REPL_ID || 'local',
    environment: process.env.NODE_ENV || 'development'
  };
  
  logs.push(logEntry);
  console.log("[SPIRAL LOG]", JSON.stringify(logEntry, null, 2));
  
  // Auto-save every 10 actions to prevent data loss
  if (logs.length % 10 === 0) {
    saveLogsToDisk();
  }
}

function saveLogsToDisk() {
  try {
    const logData = {
      metadata: {
        totalActions: logs.length,
        sessionStart: logs[0]?.timestamp || new Date().toISOString(),
        sessionEnd: new Date().toISOString(),
        platform: 'SPIRAL Local Commerce Platform',
        version: '1.0.0'
      },
      logs: logs
    };
    
    fs.writeFileSync('spiral_test_log.json', JSON.stringify(logData, null, 2));
    console.log(`✅ SPIRAL Log saved to spiral_test_log.json (${logs.length} actions)`);
  } catch (error) {
    console.error('❌ Failed to save SPIRAL log:', error);
  }
}

// Log categories for different SPIRAL operations
const LogCategories = {
  PAYMENT: 'payment',
  AI_ANALYTICS: 'ai_analytics',
  USER_ACTION: 'user_action',
  API_CALL: 'api_call',
  DATABASE: 'database',
  AUTHENTICATION: 'authentication',
  CART: 'cart',
  CHECKOUT: 'checkout',
  SPIRAL_POINTS: 'spiral_points',
  STORE_VERIFICATION: 'store_verification',
  MOBILE_PAYMENT: 'mobile_payment',
  FRAUD_DETECTION: 'fraud_detection',
  SYSTEM_TEST: 'system_test',
  ERROR: 'error'
};

// Predefined action types for consistent logging
function logPaymentAction(method, amount, status, details = {}) {
  logAction({
    category: LogCategories.PAYMENT,
    action: 'payment_processed',
    data: {
      paymentMethod: method,
      amount: amount,
      status: status,
      currency: 'USD',
      ...details
    }
  });
}

function logAIAnalytics(analysisType, confidence, recommendation, data = {}) {
  logAction({
    category: LogCategories.AI_ANALYTICS,
    action: 'ai_analysis_completed',
    data: {
      analysisType: analysisType,
      confidence: confidence,
      recommendation: recommendation,
      ...data
    }
  });
}

function logUserAction(userId, action, details = {}) {
  logAction({
    category: LogCategories.USER_ACTION,
    action: action,
    data: {
      userId: userId,
      ...details
    }
  });
}

function logAPICall(endpoint, method, statusCode, responseTime, data = {}) {
  logAction({
    category: LogCategories.API_CALL,
    action: 'api_request',
    data: {
      endpoint: endpoint,
      method: method,
      statusCode: statusCode,
      responseTime: responseTime,
      ...data
    }
  });
}

function logSpiralPoints(userId, action, points, balance, source = '') {
  logAction({
    category: LogCategories.SPIRAL_POINTS,
    action: action,
    data: {
      userId: userId,
      points: points,
      newBalance: balance,
      source: source,
      type: action.includes('earn') ? 'earned' : 'redeemed'
    }
  });
}

function logStoreVerification(storeId, verificationLevel, status, details = {}) {
  logAction({
    category: LogCategories.STORE_VERIFICATION,
    action: 'store_verification_updated',
    data: {
      storeId: storeId,
      verificationLevel: verificationLevel,
      status: status,
      ...details
    }
  });
}

function logMobilePayment(device, method, amount, status, details = {}) {
  logAction({
    category: LogCategories.MOBILE_PAYMENT,
    action: 'mobile_payment_attempt',
    data: {
      deviceType: device,
      paymentMethod: method,
      amount: amount,
      status: status,
      ...details
    }
  });
}

function logFraudDetection(severity, riskScore, transactionId, details = {}) {
  logAction({
    category: LogCategories.FRAUD_DETECTION,
    action: 'fraud_alert_generated',
    data: {
      severity: severity,
      riskScore: riskScore,
      transactionId: transactionId,
      ...details
    }
  });
}

function logSystemTest(testName, status, results, duration) {
  logAction({
    category: LogCategories.SYSTEM_TEST,
    action: 'system_test_completed',
    data: {
      testName: testName,
      status: status,
      results: results,
      duration: duration,
      timestamp: new Date().toISOString()
    }
  });
}

function logError(error, context = '') {
  logAction({
    category: LogCategories.ERROR,
    action: 'error_occurred',
    data: {
      errorMessage: error.message || error,
      errorStack: error.stack || 'No stack trace',
      context: context,
      severity: 'error'
    }
  });
}

// Initialize logging session
logAction({
  category: 'SYSTEM',
  action: 'logging_session_started',
  data: {
    platform: 'SPIRAL Local Commerce Platform',
    features: [
      'Advanced Payment Processing',
      'AI Business Intelligence',
      'Mobile Payment Infrastructure',
      'Fraud Detection System',
      'Store Verification System',
      'SPIRAL Loyalty Program'
    ]
  }
});

// Export for use in other modules
export {
  logAction,
  saveLogsToDisk,
  logPaymentAction,
  logAIAnalytics,
  logUserAction,
  logAPICall,
  logSpiralPoints,
  logStoreVerification,
  logMobilePayment,
  logFraudDetection,
  logSystemTest,
  logError,
  LogCategories,
  logs
};

// Auto-save on process exit
process.on('exit', saveLogsToDisk);
process.on('SIGINT', () => {
  saveLogsToDisk();
  process.exit(0);
});
process.on('SIGTERM', () => {
  saveLogsToDisk();
  process.exit(0);
});