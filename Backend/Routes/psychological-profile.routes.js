const express = require('express');
const router = express.Router();
const psychologicalProfileController = require('../controllers/psychologicalProfileController');

// CRUD Routes
router.post('/profiles', psychologicalProfileController.createProfile);
router.get('/profiles', psychologicalProfileController.getAllProfiles);
router.get('/profiles/:id', psychologicalProfileController.getProfileById);
router.put('/profiles/:id', psychologicalProfileController.updateProfile);
router.delete('/profiles/:id', psychologicalProfileController.deleteProfile);

// Additional useful routes
router.get('/users/:userId/profiles', psychologicalProfileController.getProfilesByUser);

module.exports = router;