const express = require('express');
const router = express.Router();
const psychologicalReportController = require('../controllers/psychologicalReportController');

// CRUD Routes
router.post('/reports', psychologicalReportController.createReport);
router.get('/reports', psychologicalReportController.getAllReports);
router.get('/reports/:id', psychologicalReportController.getReportById);
router.put('/reports/:id', psychologicalReportController.updateReport);
router.delete('/reports/:id', psychologicalReportController.deleteReport);

// Additional routes
router.get('/users/:userId/reports', psychologicalReportController.getReportsByUser);
router.get('/psychologists/:psychologistId/reports', psychologicalReportController.getReportsByPsychologist);
router.patch('/reports/:id/status', psychologicalReportController.updateReportStatus);

module.exports = router;