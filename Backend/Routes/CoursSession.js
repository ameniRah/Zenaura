const express = require('express');
const router = express.Router();

const { 
    createCoursSession, 
    getAllCoursSessions, 
    getCoursSessionById, 
    updateCoursSession, 
    deleteCoursSession 
} = require('../Controller/CoursController');  

// Définir les routes pour les sessions de cours
router.post('/add', createCoursSession);
router.get('/all', getAllCoursSessions);
router.get('/get/:id', getCoursSessionById);
router.put('/update/:id', updateCoursSession);
router.delete('/delete/:id', deleteCoursSession);

// Définir les routes pour les inscriptions
router.post('/inscriptions', inscrireCoursSession);
router.get('/sessions/:session_id/inscriptions', getInscriptionsBySession);
router.delete('/sessions/:session_id/inscriptions/:user_id', annulerInscription);
router.get('/users/:user_id/sessions', getSessionsByUser);

module.exports = router;
