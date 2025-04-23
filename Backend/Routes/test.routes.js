const express = require('express');
const router = express.Router();
const testController = require('../Controller/test.controller');
const authMiddleware = require('../Middll/authMiddleware');
const validationMiddleware = require('../Middll/validation.middleware');
const { body, param } = require('express-validator');

// Validation schemas
const createTestValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Test name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Test name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Test type is required'),
  body('duration')
    .isObject()
    .withMessage('Duration must be an object'),
  body('configuration')
    .isObject()
    .withMessage('Configuration must be an object'),
  body('questions')
    .isArray()
    .withMessage('Questions must be an array')
];

const updateTestValidation = [
  param('id').isMongoId().withMessage('Invalid test ID'),
  ...createTestValidation.map(validation => validation.optional())
];

// Routes
router
  .route('/')
  .get(authMiddleware.verifyToken, testController.getAll)
  .post(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    createTestValidation,
    validationMiddleware.validateRequest,
    testController.create
  );

router
  .route('/:id')
  .get(
    authMiddleware.verifyToken,
    param('id').isMongoId().withMessage('Invalid test ID'),
    validationMiddleware.validateRequest,
    testController.getOne
  )
  .put(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    updateTestValidation,
    validationMiddleware.validateRequest,
    testController.update
  )
  .delete(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    param('id').isMongoId().withMessage('Invalid test ID'),
    validationMiddleware.validateRequest,
    testController.delete
  );

module.exports = router;