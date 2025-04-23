const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../Middll/auth');
const validate = require('../Middll/validation.middleware');
const {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
    getReportsByUser,
    getReportsByPsychologist,
    updateReportStatus
} = require('../Controller/psychological-report.controller');

// Base path: /api/reports

// Validation middleware
const validateId = param('id').isMongoId().withMessage('Invalid ID format');
const validateCreateUpdate = [
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('psychologistId').isMongoId().withMessage('Valid psychologist ID is required'),
    body('content').notEmpty().trim().withMessage('Report content is required'),
    body('testResults').optional().isArray(),
    body('diagnosis').optional().trim(),
    body('recommendations').optional().isArray(),
    body('status').optional().isIn(['draft', 'pending', 'completed', 'archived'])
];

const validateStatus = [
    body('status').isIn(['draft', 'pending', 'completed', 'archived'])
        .withMessage('Invalid status value')
];

// GET /api/reports
router.get('/', auth, getAllReports);

// GET /api/reports/:id
router.get('/:id', auth, validateId, validate, getReportById);

// POST /api/reports
router.post('/', auth, validateCreateUpdate, validate, createReport);

// PUT /api/reports/:id
router.put('/:id', auth, validateId, validateCreateUpdate, validate, updateReport);

// DELETE /api/reports/:id
router.delete('/:id', auth, validateId, validate, deleteReport);

// GET /api/reports/user/:userId
router.get('/user/:userId', 
    auth, 
    param('userId').isMongoId().withMessage('Invalid user ID format'),
    validate,
    getReportsByUser
);

// GET /api/reports/psychologist/:psychologistId
router.get('/psychologist/:psychologistId',
    auth,
    param('psychologistId').isMongoId().withMessage('Invalid psychologist ID format'),
    validate,
    getReportsByPsychologist
);

// PATCH /api/reports/:id/status
router.patch('/:id/status',
    auth,
    validateId,
    validateStatus,
    validate,
    updateReportStatus
);

module.exports = router;