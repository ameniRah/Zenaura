const express = require("express")
const router = express.Router()
const UserController = require('../Controller/UserController')
const validate = require('../Middll/ValidateUser')
const authMiddleware = require('../Middll/authMiddleware');


router.post('/add', validate, UserController.add);
router.get('/showusers',authMiddleware, UserController.showusers);
router.get('/showusers/:id',authMiddleware, UserController.showusersbyId);
router.get('/shownameuser/:username', authMiddleware,UserController.showByName);
router.delete('/delete/:id', authMiddleware,UserController.deleteusers);
router.put('/update/:id', authMiddleware,UserController.updateuser)
router.post('/register',validate, UserController.register)
router.post('/login',UserController.login)



module.exports = router;
