// Advanced consent middleware patterns

import { requireCurrentConsent } from './routes/legal.js';

// Pattern 1: Role-specific consent requirements
export function requireConsentByRole(requiredRoles = []) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (requiredRoles.includes(userRole)) {
      return requireCurrentConsent()(req, res, next);
    }
    
    next(); // Skip consent check for other roles
  };
}

// Usage:
// app.use("/api/retailer", authMiddleware(), requireConsentByRole(['retailer']), retailerRouter);
// app.use("/api/mall", authMiddleware(), requireConsentByRole(['mall', 'admin']), mallRouter);

// Pattern 2: Operation-based consent
export function requireConsentForOperations(operations = []) {
  return (req, res, next) => {
    const method = req.method.toLowerCase();
    const needsConsent = operations.includes(method) || 
                        operations.includes(`${method}:${req.route?.path}`);
    
    if (needsConsent) {
      return requireCurrentConsent()(req, res, next);
    }
    
    next();
  };
}

// Usage:
// app.use("/api/products", authMiddleware(), requireConsentForOperations(['post', 'put', 'delete']), productsRouter);

// Pattern 3: Value-based consent (for high-value operations)
export function requireConsentForHighValue(threshold = 1000) {
  return (req, res, next) => {
    const amount = parseFloat(req.body?.amount || req.query?.amount || 0);
    
    if (amount >= threshold) {
      return requireCurrentConsent()(req, res, next);
    }
    
    next();
  };
}

// Usage:
// app.use("/api/payments", authMiddleware(), requireConsentForHighValue(500), paymentsRouter);

// Pattern 4: Time-based consent refresh
export function requireRecentConsent(maxAgeHours = 24) {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id || req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const latest = await LegalConsent.findOne({ userId }).sort({ consentedAt: -1 });
      
      if (!latest) {
        return res.status(428).json({
          error: "ConsentRequired",
          message: "Legal consent required",
          reason: "No consent record found"
        });
      }

      const consentAge = (Date.now() - latest.consentedAt.getTime()) / (1000 * 60 * 60);
      
      if (consentAge > maxAgeHours) {
        return res.status(428).json({
          error: "ConsentRequired", 
          message: "Please reconfirm your legal consent",
          reason: `Consent expired (${Math.round(consentAge)}h old, max ${maxAgeHours}h)`
        });
      }

      return requireCurrentConsent()(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// Usage:
// app.use("/api/admin", authMiddleware(), requireRecentConsent(12), adminRouter);

// Pattern 5: Conditional consent with custom logic
export function requireConsentIf(conditionFn) {
  return (req, res, next) => {
    if (conditionFn(req)) {
      return requireCurrentConsent()(req, res, next);
    }
    next();
  };
}

// Usage:
// app.use("/api/data", authMiddleware(), requireConsentIf(req => req.query.export === 'true'), dataRouter);

// Pattern 6: Granular endpoint protection
export function protectEndpoints(config) {
  return (req, res, next) => {
    const path = req.route?.path || req.path;
    const method = req.method.toLowerCase();
    const key = `${method}:${path}`;
    
    const protection = config[key] || config[path] || config[method];
    
    if (protection) {
      if (protection.consent) {
        return requireCurrentConsent()(req, res, next);
      }
      if (protection.roles && !protection.roles.includes(req.user?.role)) {
        return res.status(403).json({ error: "Insufficient role permissions" });
      }
      if (protection.custom && !protection.custom(req)) {
        return res.status(403).json({ error: "Custom protection failed" });
      }
    }
    
    next();
  };
}

// Usage:
// app.use("/api/complex", authMiddleware(), protectEndpoints({
//   'post:/orders': { consent: true, roles: ['retailer', 'mall'] },
//   'delete:/products/:id': { consent: true, custom: req => req.user.id === req.params.ownerId },
//   '/admin': { consent: true, roles: ['admin'] }
// }), complexRouter);

// Pattern 7: Consent middleware with custom error responses
export function requireConsentWithCustomError(errorHandler) {
  return (req, res, next) => {
    const originalMiddleware = requireCurrentConsent();
    
    // Wrap the original middleware to customize error responses
    return originalMiddleware(req, res, (error) => {
      if (res.headersSent) {
        return next(error);
      }
      
      if (res.statusCode === 428) {
        return errorHandler(req, res, next);
      }
      
      next(error);
    });
  };
}

// Usage:
// app.use("/api/special", authMiddleware(), requireConsentWithCustomError((req, res) => {
//   res.status(428).json({
//     error: "SpecialConsentRequired",
//     message: "This feature requires additional legal agreements",
//     redirectUrl: "/special-consent",
//     userRole: req.user.role
//   });
// }), specialRouter);