const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { verifyToken } = require('../Middll/authMiddleware');
const { validateRequest } = require('../Middll/validation.middleware');
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
router.get('/', verifyToken, getAllTestSessions);

// GET /api/sessions/:id
router.get('/:id', verifyToken, validateId, validateRequest, getTestSessionById);

// POST /api/sessions
router.post('/', verifyToken, validateCreateUpdate, validateRequest, createTestSession);

// PUT /api/sessions/:id
router.put('/:id', verifyToken, validateId, validateCreateUpdate, validateRequest, updateTestSession);

// DELETE /api/sessions/:id
router.delete('/:id', verifyToken, validateId, validateRequest, deleteTestSession);

// GET /api/sessions/user/:userId
router.get('/user/:userId', verifyToken, param('userId').isMongoId(), validateRequest, getSessionsByUser);

// GET /api/sessions/status/:status
router.get('/status/:status', verifyToken, 
    param('status').isIn(['pending', 'in-progress', 'completed', 'cancelled']), 
    validateRequest, 
    getSessionsByStatus
);

// POST /api/sessions/:id/submit
router.post('/:id/submit', verifyToken,
    [
        validateId,
        body('answers').isArray().withMessage('Answers must be an array'),
        body('completedAt').optional().isISO8601().withMessage('Invalid completion date')
    ],
    validateRequest,
    submitTestSession
);

module.exports = router;