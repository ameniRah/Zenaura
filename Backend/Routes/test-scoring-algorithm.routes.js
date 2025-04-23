const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../Middll/auth');
const validate = require('../Middll/validation.middleware');
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
router.get('/', auth, getAllTestScoringAlgorithms);

// GET /api/scoring-algorithms/:id
router.get('/:id', auth, validateId, validate, getTestScoringAlgorithmById);

// POST /api/scoring-algorithms
router.post('/', auth, validateCreateUpdate, validate, createTestScoringAlgorithm);

// PUT /api/scoring-algorithms/:id
router.put('/:id', auth, validateId, validateCreateUpdate, validate, updateTestScoringAlgorithm);

// DELETE /api/scoring-algorithms/:id
router.delete('/:id', auth, validateId, validate, deleteTestScoringAlgorithm);

// GET /api/scoring-algorithms/test/:testId
router.get('/test/:testId', auth, param('testId').isMongoId(), validate, getAlgorithmsByTest);

// POST /api/scoring-algorithms/calculate
router.post('/calculate', auth, [
    body('algorithmId').isMongoId().withMessage('Valid algorithm ID is required'),
    body('answers').isArray().withMessage('Answers must be an array')
], validate, calculateScore);

// POST /api/scoring-algorithms/validate
router.post('/validate', auth, [
    body('algorithmId').isMongoId().withMessage('Valid algorithm ID is required'),
    body('results').isArray().withMessage('Results must be an array')
], validate, validateResults);

module.exports = router;