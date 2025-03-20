const mongo=require('mongoose')
const Schema=mongo.Schema


const Disponibilities=new Schema({
    id_psychologue:Number,
    date:Date,
    heure_debut:String,
    heure_fin:String,
    statut:String
})

module.exports=mongo.model('disponibilties',Disponibilities)