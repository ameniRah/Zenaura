const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../Middll/auth');
const validate = require('../Middll/validation.middleware');
const {
    getAllTestRecommendations,
    getTestRecommendationById,
    createTestRecommendation,
    updateTestRecommendation,
    deleteTestRecommendation,
    getRecommendationsByUser,
    getRecommendationsByStatus
} = require('../Controller/test-recommendation.controller');

// Base path: /api/recommendations

// Validation middleware
const validateId = param('id').isMongoId().withMessage('Invalid ID format');
const validateCreateUpdate = [
    body('testType').notEmpty().withMessage('Test type is required'),
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('status').optional().isIn(['pending', 'completed', 'rejected']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
];

// GET /api/recommendations
router.get('/', auth, getAllTestRecommendations);

// GET /api/recommendations/:id
router.get('/:id', auth, validateId, validate, getTestRecommendationById);

// POST /api/recommendations
router.post('/', auth, validateCreateUpdate, validate, createTestRecommendation);

// PUT /api/recommendations/:id
router.put('/:id', auth, validateId, validateCreateUpdate, validate, updateTestRecommendation);

// DELETE /api/recommendations/:id
router.delete('/:id', auth, validateId, validate, deleteTestRecommendation);

// GET /api/recommendations/user/:userId
router.get('/user/:userId', auth, param('userId').isMongoId(), validate, getRecommendationsByUser);

// GET /api/recommendations/status/:status
router.get('/status/:status', auth, param('status').isIn(['pending', 'completed', 'rejected']), validate, getRecommendationsByStatus);

module.exports = router;
