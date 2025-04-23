const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../Middll/auth');
const validate = require('../Middll/validation.middleware');
const {
    getAllTestSessions,
    getTestSessionById,
    createTestSession,
    updateTestSession,
    deleteTestSession,
    getSessionsByUser,
    getSessionsByStatus,
    submitTestSession
} = require('../Controller/test-session.controller');

// Base path: /api/sessions

// Validation middleware
const validateId = param('id').isMongoId().withMessage('Invalid ID format');
const validateCreateUpdate = [
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('testId').isMongoId().withMessage('Valid test ID is required'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
    body('answers').optional().isArray().withMessage('Answers must be an array')
];

// GET /api/sessions
router.get('/', auth, getAllTestSessions);

// GET /api/sessions/:id
router.get('/:id', auth, validateId, validate, getTestSessionById);

// POST /api/sessions
router.post('/', auth, validateCreateUpdate, validate, createTestSession);

// PUT /api/sessions/:id
router.put('/:id', auth, validateId, validateCreateUpdate, validate, updateTestSession);

// DELETE /api/sessions/:id
router.delete('/:id', auth, validateId, validate, deleteTestSession);

// GET /api/sessions/user/:userId
router.get('/user/:userId', auth, param('userId').isMongoId(), validate, getSessionsByUser);

// GET /api/sessions/status/:status
router.get('/status/:status', auth, 
    param('status').isIn(['pending', 'in-progress', 'completed', 'cancelled']), 
    validate, 
    getSessionsByStatus
);

// POST /api/sessions/:id/submit
router.post('/:id/submit', auth,
    [
        validateId,
        body('answers').isArray().withMessage('Answers must be an array'),
        body('completedAt').optional().isISO8601().withMessage('Invalid completion date')
    ],
    validate,
    submitTestSession
);

module.exports = router;