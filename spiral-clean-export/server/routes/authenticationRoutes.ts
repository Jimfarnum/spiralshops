// server/routes/authenticationRoutes.ts
// Simple admin authentication for testing

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Ashland8!',
  adminCode: 'SP1RAL_S3CUR3'
};

// Generate admin token for testing
router.post('/admin/login', (req, res) => {
  const { username, password, adminCode } = req.body;
  
  if (username === ADMIN_CREDENTIALS.username && 
      (password === ADMIN_CREDENTIALS.password || adminCode === ADMIN_CREDENTIALS.adminCode)) {
    
    const token = jwt.sign(
      { 
        userId: 'admin',
        role: 'admin',
        permissions: ['admin_access', 'system_test']
      },
      'spiral-secret-key',
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: 'admin',
        username: 'admin',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

// Get admin token for testing purposes
router.get('/admin/test-token', (req, res) => {
  const token = jwt.sign(
    { 
      userId: 'admin',
      role: 'admin',
      permissions: ['admin_access', 'system_test']
    },
    'spiral-secret-key',
    { expiresIn: '1h' }
  );
  
  res.json({
    success: true,
    token,
    note: "Use this token in Authorization: Bearer <token> header"
  });
});

export default router;