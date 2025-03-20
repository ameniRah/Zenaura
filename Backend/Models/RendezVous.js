const mongo=require('mongoose')
const Schema=mongo.Schema


const RendezVous=new Schema({
    id_psychologue:Number,
    id_patient:Number,
    date:Date,
    heure:String,
    motif:String,
    statut:String
})

module.exports=mongo.model('rendezvous',RendezVous)