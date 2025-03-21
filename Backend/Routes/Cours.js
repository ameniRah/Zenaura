const express = require('express');
const router = express.Router();
const {
    createCours,
    getAllCours,
    getCoursById,
    updateCours,
    deleteCours
} = require('../Controller/CoursController');


router.post('/add', createCours);         
router.get('/all', getAllCours);          
router.get('/get/:id', getCoursById);     
router.put('/update/:id', updateCours);   
router.delete('/delete/:id', deleteCours);

module.exports = router;
