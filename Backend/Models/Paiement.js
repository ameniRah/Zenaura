const mongo= require('mongoose');
const Schema = mongoose.Schema; 
const Paiement = new Schema({
    user_id:String,
    cours_id:String,
    cours_session_id:String,
    amount:Number,
    transaction_id:String,
    paymentdate:Date,
    status:String,
    created_at:Date,
    updated_at:Date
});
module.exports = mongo.model('Paiement',Paiement);

