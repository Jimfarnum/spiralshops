// SPIRAL User Authentication System
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Authentication configuration
const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'spiral-auth-secret-2025',
  jwtExpiry: '7d', // 7 days
  saltRounds: 12,
  usernameMinLength: 3,
  usernameMaxLength: 20,
  passwordMinLength: 8
};

// Username validation schema
const usernameSchema = z.string()
  .min(AUTH_CONFIG.usernameMinLength, `Username must be at least ${AUTH_CONFIG.usernameMinLength} characters`)
  .max(AUTH_CONFIG.usernameMaxLength, `Username must be no more than ${AUTH_CONFIG.usernameMaxLength} characters`)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .refine(name => !name.includes('admin'), 'Username cannot contain "admin"')
  .refine(name => !name.includes('spiral'), 'Username cannot contain "spiral"');

// Password validation schema
const passwordSchema = z.string()
  .min(AUTH_CONFIG.passwordMinLength, `Password must be at least ${AUTH_CONFIG.passwordMinLength} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation schema
const emailSchema = z.string().email('Invalid email address');

// Social handle validation schema
const socialHandleSchema = z.string()
  .min(3, 'Social handle must be at least 3 characters')
  .max(15, 'Social handle must be no more than 15 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Social handle can only contain letters, numbers, and underscores')
  .optional();

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userType: z.enum(['shopper', 'retailer'], 'User type must be shopper or retailer'),
  socialHandle: socialHandleSchema
});

// User login schema
export const userLoginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'), // Can be email or username
  password: z.string().min(1, 'Password is required')
});

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, AUTH_CONFIG.saltRounds);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
}

/**
 * Generate JWT token for user
 */
export function generateUserToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    userType: user.userType,
    role: 'user'
  };

  return jwt.sign(payload, AUTH_CONFIG.jwtSecret, {
    expiresIn: AUTH_CONFIG.jwtExpiry
  });
}

/**
 * Verify JWT token
 */
export function verifyUserToken(token) {
  try {
    return jwt.verify(token, AUTH_CONFIG.jwtSecret);
  } catch (error) {
    return null;
  }
}

/**
 * Generate unique invite code
 */
export function generateInviteCode(username) {
  const timestamp = Date.now().toString().slice(-6);
  const userPrefix = username.slice(0, 3).toUpperCase();
  const randomSuffix = Math.random().toString(36).slice(-3).toUpperCase();
  return `${userPrefix}${timestamp}${randomSuffix}`;
}

/**
 * Generate unique social handle suggestion
 */
export function generateSocialHandle(firstName, lastName) {
  const base = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  const timestamp = Date.now().toString().slice(-4);
  return `${base}${timestamp}`;
}

/**
 * Validate username uniqueness (mock implementation)
 */
export async function isUsernameAvailable(username, excludeUserId = null) {
  // This would query the database in a real implementation
  // For now, we'll simulate some taken usernames
  const takenUsernames = ['admin', 'spiral', 'test', 'user', 'shopper', 'retailer'];
  
  if (takenUsernames.includes(username.toLowerCase())) {
    return false;
  }
  
  return true; // Available
}

/**
 * Validate email uniqueness (mock implementation)
 */
export async function isEmailAvailable(email, excludeUserId = null) {
  // This would query the database in a real implementation
  // For now, we'll simulate some taken emails
  const takenEmails = ['admin@spiral.com', 'test@spiral.com'];
  
  if (takenEmails.includes(email.toLowerCase())) {
    return false;
  }
  
  return true; // Available
}

/**
 * Validate social handle uniqueness (mock implementation)
 */
export async function isSocialHandleAvailable(handle, excludeUserId = null) {
  if (!handle) return true; // Optional field
  
  // This would query the database in a real implementation
  const takenHandles = ['spiral', 'admin', 'official'];
  
  if (takenHandles.includes(handle.toLowerCase())) {
    return false;
  }
  
  return true; // Available
}

/**
 * User authentication middleware
 */
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.cookies?.spiralUserToken ||
                req.session?.spiralUserToken;

  if (!token) {
    return res.status(401).json({ 
      error: 'Authentication required. Please log in.',
      requiresAuth: true 
    });
  }

  const decoded = verifyUserToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      error: 'Invalid or expired token. Please log in again.',
      requiresAuth: true 
    });
  }

  req.user = decoded;
  req.isAuthenticated = true;
  next();
};

/**
 * Retailer-only middleware
 */
export const requireRetailer = (req, res, next) => {
  if (!req.user || req.user.userType !== 'retailer') {
    return res.status(403).json({ 
      error: 'Retailer access required. This feature is only available to retailers.' 
    });
  }
  next();
};

/**
 * Shopper-only middleware
 */
export const requireShopper = (req, res, next) => {
  if (!req.user || req.user.userType !== 'shopper') {
    return res.status(403).json({ 
      error: 'Shopper access required. This feature is only available to shoppers.' 
    });
  }
  next();
};

/**
 * Mock user database (replace with actual database queries)
 */
const mockUsers = [
  {
    id: 1,
    email: 'sarah.johnson@email.com',
    username: 'sarah_j',
    passwordHash: '$2b$12$example_hash', // This would be a real bcrypt hash
    userType: 'shopper',
    firstName: 'Sarah',
    lastName: 'Johnson',
    name: 'Sarah Johnson',
    socialHandle: 'sarahj_spiral',
    spiralBalance: 150,
    totalEarned: 500,
    totalRedeemed: 350,
    isEmailVerified: true,
    isActive: true
  },
  {
    id: 2,
    email: 'mike.chen@business.com',
    username: 'mike_chen_store',
    passwordHash: '$2b$12$example_hash2',
    userType: 'retailer',
    firstName: 'Mike',
    lastName: 'Chen',
    name: 'Mike Chen',
    socialHandle: 'mikestore',
    spiralBalance: 25,
    totalEarned: 25,
    totalRedeemed: 0,
    isEmailVerified: true,
    isActive: true
  }
];

/**
 * Find user by email or username
 */
export async function findUserByIdentifier(identifier) {
  // In real implementation, this would query the database
  return mockUsers.find(user => 
    user.email.toLowerCase() === identifier.toLowerCase() ||
    user.username.toLowerCase() === identifier.toLowerCase()
  );
}

/**
 * Create new user (mock implementation)
 */
export async function createUser(userData) {
  // In real implementation, this would insert into database
  const newUser = {
    id: mockUsers.length + 1,
    ...userData,
    spiralBalance: 0,
    totalEarned: 0,
    totalRedeemed: 0,
    inviteCode: generateInviteCode(userData.username),
    isEmailVerified: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  return newUser;
}

export default {
  userRegistrationSchema,
  userLoginSchema,
  hashPassword,
  verifyPassword,
  generateUserToken,
  verifyUserToken,
  generateInviteCode,
  generateSocialHandle,
  isUsernameAvailable,
  isEmailAvailable,
  isSocialHandleAvailable,
  authenticateUser,
  requireRetailer,
  requireShopper,
  findUserByIdentifier,
  createUser
};