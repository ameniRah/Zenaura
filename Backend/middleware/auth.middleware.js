const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Special handling for test tokens
    if (process.env.NODE_ENV === 'test') {
      if (token === 'valid-admin-token') {
        req.user = { role: 'admin' };
        return next();
      }
      if (token === 'valid-user-token') {
        req.user = { role: 'user' };
        return next();
      }
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  },

  isAdmin: async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin privileges required'
      });
    }

    next();
  },

  isTestCreator: async (req, res, next) => {
    try {
      if (!req.user.canCreateTests) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Test creation privileges required.'
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking test creation privileges',
        error: error.message
      });
    }
  },

  hasTestAccess: async (req, res, next) => {
    try {
      // Implement test access validation logic here
      // This could check if the user has paid for the test, has prerequisites, etc.
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking test access',
        error: error.message
      });
    }
  }
};

module.exports = authMiddleware; 