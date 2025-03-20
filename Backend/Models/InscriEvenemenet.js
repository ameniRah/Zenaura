const mongo=require('mongoose')
const Schema=mongo.Schema


const InscriEvenements=new Schema({
    id_psychologue:String,
    date:Date,
    heure_debut:String,
    heure_fin:String,
    statut:String

})

module.exports=mongo.model('inscrievenements',InscriEvenements)