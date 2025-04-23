const express = require('express');
const router = express.Router();
const psychologicalProfileController = require('../Controller/psychological-profile.controller');
const { verifyToken, checkRole } = require('../Middll/authMiddleware');
const { validateRequest } = require('../Middll/validation.middleware');
const { body, param } = require('express-validator');

// Validation rules
const profileValidation = [
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('traits').isArray().withMessage('Traits must be an array'),
    body('traits.*.traitId').isMongoId().withMessage('Valid trait ID is required'),
    body('traits.*.score').isNumeric().withMessage('Score must be a number')
];

// Base CRUD Routes with authentication and validation
router.post('/profiles', 
    verifyToken, 
    checkRole('psychologist', 'admin'), 
    profileValidation,
    validateRequest,
    psychologicalProfileController.createProfile
);

router.get('/profiles', 
    verifyToken, 
    checkRole('psychologist', 'admin'),
    psychologicalProfileController.getAllProfiles
);

router.get('/profiles/:id', 
    verifyToken,
    param('id').isMongoId().withMessage('Invalid profile ID'),
    validateRequest,
    psychologicalProfileController.getProfileById
);

router.put('/profiles/:id', 
    verifyToken,
    checkRole('psychologist', 'admin'),
    param('id').isMongoId(),
    profileValidation,
    validateRequest,
    psychologicalProfileController.updateProfile
);

router.delete('/profiles/:id', 
    verifyToken,
    checkRole('admin'),
    param('id').isMongoId(),
    validateRequest,
    psychologicalProfileController.deleteProfile
);

// Additional routes with proper middleware
router.get('/users/:userId/profiles',
    verifyToken,
    param('userId').isMongoId(),
    validateRequest,
    psychologicalProfileController.getProfilesByUser
);

router.get('/profiles/:id/history',
    verifyToken,
    param('id').isMongoId(),
    validateRequest,
    psychologicalProfileController.getProfileHistory
);

router.get('/profiles/:id/recommendations',
    verifyToken,
    param('id').isMongoId(),
    validateRequest,
    psychologicalProfileController.getProfileRecommendations
);

router.put('/profiles/:id/privacy',
    verifyToken,
    param('id').isMongoId(),
    body('isPrivate').isBoolean(),
    validateRequest,
    psychologicalProfileController.updatePrivacySettings
);

router.post('/profiles/:id/traits',
    verifyToken,
    checkRole('psychologist', 'admin'),
    param('id').isMongoId(),
    body('traits').isArray(),
    validateRequest,
    psychologicalProfileController.addTraitScore
);

router.get('/profiles/stats/summary',
    verifyToken,
    checkRole('psychologist', 'admin'),
    psychologicalProfileController.getProfilesStats
);

module.exports = router;