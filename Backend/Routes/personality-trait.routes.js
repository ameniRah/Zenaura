const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const personalityTraitController = require('../Controller/personality-trait.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../Middll/validation.middleware');

// Validation schemas
const createTraitValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Trait name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Trait name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Big Five', 'MBTI', 'HEXACO', 'Custom'])
    .withMessage('Invalid category'),
  body('measurementScale.min')
    .isNumeric()
    .withMessage('Minimum scale value must be a number'),
  body('measurementScale.max')
    .isNumeric()
    .withMessage('Maximum scale value must be a number')
    .custom((value, { req }) => {
      if (value <= req.body.measurementScale.min) {
        throw new Error('Maximum scale value must be greater than minimum');
      }
      return true;
    })
];

const updateTraitValidation = [
  param('id').isMongoId().withMessage('Invalid trait ID'),
  ...createTraitValidation.map(validation => validation.optional())
];

const relationshipValidation = [
  body('relatedTraits')
    .isArray()
    .withMessage('Related traits must be an array'),
  body('relatedTraits.*')
    .isMongoId()
    .withMessage('Invalid related trait ID')
];

const assessmentMethodValidation = [
  body('methods')
    .isArray()
    .withMessage('Methods must be an array')
    .custom(methods => {
      const validMethods = ['questionnaire', 'observation', 'interview', 'behavioral'];
      return methods.every(method => validMethods.includes(method));
    })
    .withMessage('Invalid assessment method')
];

// Routes
router
  .route('/')
  .get(authMiddleware.verifyToken, personalityTraitController.getAll)
  .post(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    createTraitValidation,
    validationMiddleware.validateRequest,
    personalityTraitController.create
  );

router
  .route('/:id')
  .get(
    authMiddleware.verifyToken,
    param('id').isMongoId().withMessage('Invalid trait ID'),
    validationMiddleware.validateRequest,
    personalityTraitController.getOne
  )
  .put(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    updateTraitValidation,
    validationMiddleware.validateRequest,
    personalityTraitController.update
  )
  .delete(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    param('id').isMongoId().withMessage('Invalid trait ID'),
    validationMiddleware.validateRequest,
    personalityTraitController.delete
  );

router
  .route('/:id/relationships')
  .get(
    authMiddleware.verifyToken,
    param('id').isMongoId().withMessage('Invalid trait ID'),
    validationMiddleware.validateRequest,
    personalityTraitController.getRelatedTraits
  )
  .put(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    param('id').isMongoId().withMessage('Invalid trait ID'),
    relationshipValidation,
    validationMiddleware.validateRequest,
    personalityTraitController.updateRelationships
  );

router
  .route('/:id/assessment-methods')
  .get(
    authMiddleware.verifyToken,
    param('id').isMongoId().withMessage('Invalid trait ID'),
    validationMiddleware.validateRequest,
    personalityTraitController.getAssessmentMethods
  )
  .put(
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    param('id').isMongoId().withMessage('Invalid trait ID'),
    assessmentMethodValidation,
    validationMiddleware.validateRequest,
    personalityTraitController.updateAssessmentMethods
  );

router.post(
  '/:id/restore',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  param('id').isMongoId().withMessage('Invalid trait ID'),
  validationMiddleware.validateRequest,
  personalityTraitController.restore
);

router.get(
  '/category/:category',
  authMiddleware.verifyToken,
  param('category')
    .isIn(['Big Five', 'MBTI', 'HEXACO', 'Custom'])
    .withMessage('Invalid category'),
  validationMiddleware.validateRequest,
  personalityTraitController.getByCategory
);

router.post(
  '/validate-score',
  authMiddleware.verifyToken,
  [
    body('traitId').isMongoId().withMessage('Invalid trait ID'),
    body('score').isNumeric().withMessage('Score must be a number')
  ],
  validationMiddleware.validateRequest,
  personalityTraitController.validateScore
);

module.exports = router;