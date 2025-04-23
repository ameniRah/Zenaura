const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../Middll/auth');
const validation = require('../Middll/validation.middleware');

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

// Routes
router.get('/', auth, getAllReports);
router.get('/:id', auth, validateId, validation.validateRequest, getReportById);
router.post('/', auth, validateCreateUpdate, validation.validateRequest, createReport);
router.put('/:id', auth, validateId, validateCreateUpdate, validation.validateRequest, updateReport);
router.delete('/:id', auth, validateId, validation.validateRequest, deleteReport);

router.get('/user/:userId', 
    auth, 
    param('userId').isMongoId().withMessage('Invalid user ID format'),
    validation.validateRequest,
    getReportsByUser
);

router.get('/psychologist/:psychologistId',
    auth,
    param('psychologistId').isMongoId().withMessage('Invalid psychologist ID format'),
    validation.validateRequest,
    getReportsByPsychologist
);

router.patch('/:id/status',
    auth,
    validateId,
    validateStatus,
    validation.validateRequest,
    updateReportStatus
);

module.exports = router;