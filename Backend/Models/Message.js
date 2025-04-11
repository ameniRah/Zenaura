// models/Message.js
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  expediteurId: { type: String,required: true,},
  destinataireId: { type: String, required: true, },
  contenu: {type: String,required: true,},
  dateEnvoi: { type: Date,default: Date.now, },
  conversationId: { type: String, required: true, index: true }, // Identifiant unique pour la conversation
  status: { type: String, enum: ['livré', 'non-livré'], default: 'non-livré' }
});


// Index pour accélérer les recherches par conversationId
messageSchema.index({ conversationId: 1, date_creation: 1 });
module.exports = mongoose.model("Message", messageSchema);
