// CoursSessionRoutes.js
const express = require('express');
const router = express.Router();

// Importer les méthodes du CoursController
const { 
    createCoursSession, 
    getAllCoursSessions, 
    getCoursSessionById, 
    updateCoursSession, 
    deleteCoursSession 
} = require('../Controller/CoursController');  // Tu utilises ici le même contrôleur

// Définir les routes
router.post('/add', createCoursSession);
router.get('/all', getAllCoursSessions);
router.get('/get/:id', getCoursSessionById);
router.put('/update/:id', updateCoursSession);
router.delete('/delete/:id', deleteCoursSession);

module.exports = router;
