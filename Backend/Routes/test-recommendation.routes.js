const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { verifyToken } = require('../Middll/authMiddleware');
const { validateRequest } = require('../Middll/validation.middleware');
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
router.get('/', verifyToken, getAllTestRecommendations);

// GET /api/recommendations/:id
router.get('/:id', verifyToken, validateId, validateRequest, getTestRecommendationById);

// POST /api/recommendations
router.post('/', verifyToken, validateCreateUpdate, validateRequest, createTestRecommendation);

// PUT /api/recommendations/:id
router.put('/:id', verifyToken, validateId, validateCreateUpdate, validateRequest, updateTestRecommendation);

// DELETE /api/recommendations/:id
router.delete('/:id', verifyToken, validateId, validateRequest, deleteTestRecommendation);

// GET /api/recommendations/user/:userId
router.get('/user/:userId', verifyToken, param('userId').isMongoId(), validateRequest, getRecommendationsByUser);

// GET /api/recommendations/status/:status
router.get('/status/:status', verifyToken, param('status').isIn(['pending', 'completed', 'rejected']), validateRequest, getRecommendationsByStatus);

module.exports = router;
