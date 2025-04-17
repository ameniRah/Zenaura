const express = require('express');
const router = express.Router();
const {
  getAllTestSessions,
  getTestSessionById,
  createTestSession,
  updateTestSession,
  deleteTestSession,
  getSessionsByUser,
  getSessionsByStatus,
  submitTestSession
} = require('../controllers/test-session.controller');

// Base path: /api/sessions

// GET /api/sessions
router.get('/', getAllTestSessions);

// GET /api/sessions/:id
router.get('/:id', getTestSessionById);

// POST /api/sessions
router.post('/', createTestSession);

// PUT /api/sessions/:id
router.put('/:id', updateTestSession);

// DELETE /api/sessions/:id
router.delete('/:id', deleteTestSession);

// GET /api/sessions/user/:userId
router.get('/user/:userId', getSessionsByUser);

// GET /api/sessions/status/:status
router.get('/status/:status', getSessionsByStatus);

// POST /api/sessions/:id/submit
router.post('/:id/submit', submitTestSession);

module.exports = router;