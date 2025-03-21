const mongo=require('mongoose')
const Schema=mongo.Schema


const InscriEvenements=new  Schema({
    id_patient:Number,
    id_evenement: { type: Schema.Types.ObjectId, ref: "Evenemnts", required: true },


})

module.exports=mongo.model('inscrievenements',InscriEvenements)