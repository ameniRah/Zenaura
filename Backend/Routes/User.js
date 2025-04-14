const express = require("express")
const router = express.Router()
const UserController = require('../Controller/UserController')
const validate = require('../Middll/ValidateUser')
const { authMiddleware, checkRole } = require('../Middll/authMiddleware');
const upload = require('../Config/uploadConfig');

router.get('/showusers',authMiddleware,checkRole("admin"), UserController.showusers);
router.get('/showusers/:id',authMiddleware, UserController.showusersbyId);
router.get('/shownameuser/:username', authMiddleware,UserController.showByName);
router.delete('/delete/:id', authMiddleware,checkRole("admin"),UserController.deleteusers);
router.put('/update/:id', authMiddleware,UserController.updateuser)
router.post('/register',validate, UserController.register)
router.post('/login',UserController.login)
// Route pour envoyer un OTP par email
router.post("/forgot-password", UserController.sendOTP);

// Route pour vérifier l'OTP et réinitialiser le mot de passe
router.post("/verify-otp", UserController.verifyOTP)
router.put("/authorizeUser/:id", checkRole("admin"), UserController.authorizeUser)
// Voir tout l'historique des activités (réservé à l'admin)
router.get('/activities', authMiddleware, checkRole("admin"), UserController.showActivities);
// Voir l'historique d’un utilisateur spécifique
router.get('/activities/:userId', authMiddleware, UserController.showActivities);
router.put('/upload-profile-photo/:id', authMiddleware, upload.single('photo'), UserController.uploadProfile);


module.exports = router;
