const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// CRUD Routes
router.post('/questions', questionController.createQuestion);
router.get('/questions', questionController.getAllQuestions);
router.get('/questions/:id', questionController.getQuestionById);
router.put('/questions/:id', questionController.updateQuestion);
router.delete('/questions/:id', questionController.deleteQuestion);

// Additional routes
router.get('/traits/:traitId/questions', questionController.getQuestionsByTrait);
router.get('/types/:type/questions', questionController.getQuestionsByType);

module.exports = router;