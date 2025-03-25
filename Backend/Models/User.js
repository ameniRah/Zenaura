const mongo = require('mongoose')
//pour definir le schema de cette entiter
const Schema = mongo.Schema
const User = new Schema({
    nom: String,
    prenom: String,
    email: String,
    password: String,
    role: String,
    dateInscription: Date,
    isAnonymous: Boolean,
    dateNaissance: Date,
    otpCode: String,  // Code OTP
    otpExpires: Date, // Expiration du code
    status: {
        type: String,
        enum: ['autorisé', 'non autorisé'],  // Valeurs autorisées
        default: 'autorisé'  // Par défaut, l'utilisateur est autorisé
    }
    
})

module.exports = mongo.model('user', User) 
