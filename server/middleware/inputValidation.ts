import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// 🔒 Priority 2: Comprehensive Input Validation for AI Endpoints

// Common validation schemas
const emailSchema = z.string().email('Invalid email format').max(255);
const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format');
const urlSchema = z.string().url('Invalid URL format').optional();
const nonEmptyString = z.string().min(1, 'Field cannot be empty').max(1000);

// Retailer application validation
export const retailerApplicationSchema = z.object({
  storeName: nonEmptyString.max(100, 'Store name too long'),
  email: emailSchema,
  phone: phoneSchema,
  address: nonEmptyString.max(200, 'Address too long'),
  category: z.enum(['grocery', 'clothing', 'electronics', 'restaurant', 'services', 'other']),
  hours: nonEmptyString.max(100, 'Hours format too long'),
  description: nonEmptyString.max(500, 'Description too long'),
  hasLogo: z.boolean().optional(),
  hasStorefrontPhoto: z.boolean().optional(),
  hasBusinessLicense: z.boolean().optional(),
  storePhotoURL: urlSchema,
  licenseDocURL: urlSchema
});

// AI Dashboard agents validation
export const mallManagerSchema = z.object({
  mallId: z.string().uuid('Invalid mall ID format'),
  tasks: z.array(z.string().min(1).max(200)).min(1, 'At least one task required').max(10, 'Too many tasks')
});

export const retailerAISchema = z.object({
  retailerId: z.string().uuid('Invalid retailer ID format'),
  tasks: z.array(z.string().min(1).max(200)).min(1, 'At least one task required').max(10, 'Too many tasks')
});

export const shopperAISchema = z.object({
  shopperId: z.string().uuid('Invalid shopper ID format'),
  services: z.array(z.string().min(1).max(100)).min(1, 'At least one service required').max(5, 'Too many services'),
  location: z.string().min(1).max(100),
  budget: z.number().min(0, 'Budget cannot be negative').max(100000, 'Budget too high')
});

// Image generation validation
export const productImageSchema = z.object({
  Product_ID: z.string().min(1, 'Product ID required'),
  Product_Name: nonEmptyString.max(100, 'Product name too long'),
  Store_Name: nonEmptyString.max(100, 'Store name too long'),
  Store_Category: z.string().min(1).max(50),
  Store_Location: z.string().min(1).max(100),
  SKU_Barcode: z.string().min(1).max(50).optional()
});

export const csvDataSchema = z.array(productImageSchema).min(1, 'At least one product required').max(100, 'Too many products');

// Chat/AI message validation
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  context: z.string().max(1000).optional(),
  sessionId: z.string().uuid('Invalid session ID').optional()
});

// AI Inventory assistant validation
export const inventoryProductSchema = z.object({
  name: nonEmptyString.max(100),
  description: z.string().max(1000).optional(),
  price: z.number().min(0, 'Price cannot be negative').max(1000000, 'Price too high'),
  category: z.string().min(1).max(50)
});

// Generic validation middleware factory
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        console.warn(`🚨 Input validation failed from IP: ${req.ip}`, errors);
        
        return res.status(400).json({
          error: 'Input validation failed',
          message: 'Invalid or missing required fields',
          details: errors,
          timestamp: new Date().toISOString()
        });
      }
      
      // Attach validated data to request
      req.validatedData = result.data;
      console.log(`✅ Input validation passed for ${req.method} ${req.path}`);
      next();
      
    } catch (error) {
      console.error(`❌ Validation error for ${req.method} ${req.path}:`, error);
      return res.status(500).json({
        error: 'Validation system error',
        message: 'Unable to validate input data',
        timestamp: new Date().toISOString()
      });
    }
  };
}

// Sanitization middleware for text inputs
export function sanitizeTextInputs(req: Request, res: Response, next: NextFunction) {
  const sanitizeString = (str: any): string => {
    if (typeof str !== 'string') return str;
    
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[{}]/g, '') // Remove potential code injection
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/data:/gi, '') // Remove data: URLs
      .substring(0, 2000); // Limit length
  };
  
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };
  
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  
  next();
}

// Security headers for AI endpoints
export function setAISecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'none'; object-src 'none';");
  
  next();
}

// Export for TypeScript augmentation
declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
    }
  }
}