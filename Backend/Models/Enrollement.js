const mongo=require('mongoose');
const Schema=mongo.Schema;
const Enrollement=new Schema({
    cours_id:String,
    user_id:String,
    cours_session_id:String,
    enrollementdate:Date,
    status:String,
    created_at:Date,
    updated_at:Date
});
module.exports=mongo.model('Enrollement',Enrollement);

