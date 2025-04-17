const express = require('express');
const router = express.Router();
const {
  getAllTestScoringAlgorithms,
  getTestScoringAlgorithmById,
  createTestScoringAlgorithm,
  updateTestScoringAlgorithm,
  deleteTestScoringAlgorithm,
  getAlgorithmsByTest
} = require('../controllers/test-scoring-algorithm.controller');

// Base path: /api/scoring-algorithms

// GET /api/scoring-algorithms
router.get('/', getAllTestScoringAlgorithms);

// GET /api/scoring-algorithms/:id
router.get('/:id', getTestScoringAlgorithmById);

// POST /api/scoring-algorithms
router.post('/', createTestScoringAlgorithm);

// PUT /api/scoring-algorithms/:id
router.put('/:id', updateTestScoringAlgorithm);

// DELETE /api/scoring-algorithms/:id
router.delete('/:id', deleteTestScoringAlgorithm);

// GET /api/scoring-algorithms/test/:testId
router.get('/test/:testId', getAlgorithmsByTest);

module.exports = router;