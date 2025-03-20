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
    isAnonymous:Boolean
    
})

module.exports = mongo.model('user', User) 
