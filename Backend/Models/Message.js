// models/Message.js
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  expediteurId: { type: String,required: true,},
  destinataireId: { type: String, required: true, },
  contenu: {type: String,required: true,},
  dateEnvoi: { type: Date,default: Date.now, },
});
module.exports = mongoose.model("Message", messageSchema);
