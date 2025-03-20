const mongo=require('mongoose')
const Schema=mongo.Schema


const Evenemnts=new Schema({
    titre:String,
    description:String,
    date:Date,
    heure_debut:String,    
    heure_debut:String,
    duree:Number,
    capacite:Number

})

module.exports=mongo.model('evenemnts',Evenemnts)