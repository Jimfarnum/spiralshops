import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Admin credentials - in production, these should be environment variables
const ADMIN_CREDENTIALS = {
  email: 'admin@spiral.com',
  password: 'Spiral2025!',
  // Alternative admin credentials for testing
  alternativeEmails: [
    'spiral.admin@gmail.com',
    'administrator@spiral.com',
    'root@spiral.com'
  ]
};

// JWT secret - in production, this should be a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'spiral_admin_secret_key_2025';

// Admin login endpoint
router.post('/admin-login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check credentials
    const isValidEmail = email === ADMIN_CREDENTIALS.email || 
                        ADMIN_CREDENTIALS.alternativeEmails.includes(email);
    const isValidPassword = password === ADMIN_CREDENTIALS.password;

    if (isValidEmail && isValidPassword) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          email: email,
          role: 'admin',
          timestamp: Date.now()
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Log successful admin login
      console.log(`[SPIRAL ADMIN] Successful login: ${email} at ${new Date().toISOString()}`);

      res.json({
        success: true,
        token: token,
        message: 'Admin authentication successful',
        user: {
          email: email,
          role: 'admin'
        }
      });
    } else {
      // Log failed login attempt
      console.log(`[SPIRAL ADMIN] Failed login attempt: ${email} at ${new Date().toISOString()}`);
      
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
});

// Admin token verification endpoint
router.get('/admin-verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    res.json({
      success: true,
      valid: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      valid: false,
      message: 'Invalid or expired token'
    });
  }
});

// Admin logout endpoint
router.post('/admin-logout', (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Admin logout successful'
  });
});

// Middleware to protect admin routes
export const adminAuthMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Access denied - Admin authentication required',
        authenticated: false
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied - Admin role required',
        authenticated: false
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Access denied - Invalid admin token',
      authenticated: false
    });
  }
};

export default router;