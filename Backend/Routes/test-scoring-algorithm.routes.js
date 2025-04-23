const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { verifyToken } = require('../Middll/authMiddleware');
const { validateRequest } = require('../Middll/validation.middleware');
const {
    getAllTestScoringAlgorithms,
    getTestScoringAlgorithmById,
    createTestScoringAlgorithm,
    updateTestScoringAlgorithm,
    deleteTestScoringAlgorithm,
    getAlgorithmsByTest,
    calculateScore,
    validateResults
} = require('../Controller/test-scoring-algorithm.controller');

// Base path: /api/scoring-algorithms

// Validation middleware
const validateId = param('id').isMongoId().withMessage('Invalid ID format');
const validateCreateUpdate = [
    body('name').notEmpty().withMessage('Algorithm name is required'),
    body('testId').isMongoId().withMessage('Valid test ID is required'),
    body('formula').notEmpty().withMessage('Scoring formula is required'),
    body('parameters').isArray().withMessage('Parameters must be an array')
];

// GET /api/scoring-algorithms
router.get('/', verifyToken, getAllTestScoringAlgorithms);

// GET /api/scoring-algorithms/:id
router.get('/:id', verifyToken, validateId, validateRequest, getTestScoringAlgorithmById);

// POST /api/scoring-algorithms
router.post('/', verifyToken, validateCreateUpdate, validateRequest, createTestScoringAlgorithm);

// PUT /api/scoring-algorithms/:id
router.put('/:id', verifyToken, validateId, validateCreateUpdate, validateRequest, updateTestScoringAlgorithm);

// DELETE /api/scoring-algorithms/:id
router.delete('/:id', verifyToken, validateId, validateRequest, deleteTestScoringAlgorithm);

// GET /api/scoring-algorithms/test/:testId
router.get('/test/:testId', verifyToken, param('testId').isMongoId(), validateRequest, getAlgorithmsByTest);

// POST /api/scoring-algorithms/calculate
router.post('/calculate', verifyToken, [
    body('algorithmId').isMongoId().withMessage('Valid algorithm ID is required'),
    body('answers').isArray().withMessage('Answers must be an array')
], validateRequest, calculateScore);

// POST /api/scoring-algorithms/validate
router.post('/validate', verifyToken, [
    body('algorithmId').isMongoId().withMessage('Valid algorithm ID is required'),
    body('results').isArray().withMessage('Results must be an array')
], validateRequest, validateResults);

module.exports = router;