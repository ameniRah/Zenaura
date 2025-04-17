const express = require('express');
const router = express.Router();
const {
  getAllTestRecommendations,
  getTestRecommendationById,
  createTestRecommendation,
  updateTestRecommendation,
  deleteTestRecommendation,
  getRecommendationsByUser,
  getRecommendationsByStatus
} = require('../controllers/testRecommendation.controller');

// Base path: /api/recommendations

// GET /api/recommendations
router.get('/', getAllTestRecommendations);

// GET /api/recommendations/:id
router.get('/:id', getTestRecommendationById);

// POST /api/recommendations
router.post('/', createTestRecommendation);

// PUT /api/recommendations/:id
router.put('/:id', updateTestRecommendation);

// DELETE /api/recommendations/:id
router.delete('/:id', deleteTestRecommendation);

// GET /api/recommendations/user/:userId
router.get('/user/:userId', getRecommendationsByUser);

// GET /api/recommendations/status/:status
router.get('/status/:status', getRecommendationsByStatus);

module.exports = router;
