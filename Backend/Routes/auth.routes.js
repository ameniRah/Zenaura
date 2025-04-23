const express = require('express');
const router = express.Router();
const authController = require('../Controller/auth.controller');
const { body } = require('express-validator');
const validationMiddleware = require('../Middll/validation.middleware');

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/login', loginValidation, validationMiddleware.validateRequest, authController.login);

// Test environment routes
if (process.env.NODE_ENV === 'test') {
  router.post('/test-token', (req, res) => {
    const { role } = req.body;
    res.json({ token: `test-${role}-token` });
  });
}

module.exports = router;