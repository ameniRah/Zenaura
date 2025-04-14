// models/Message.js
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  expediteurId: { type: String,required: true,},
  destinataireId: { type: String, required: true, },
  contenu: {type: String,required: true,},
  dateEnvoi: { type: Date,default: Date.now, },
  isGroupMessage: {type: Boolean,default: false},
  // Référence au groupe si c'est un message de groupe
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: function() { return this.isGroupMessage; }
  },
  // Garder le conversationId pour les messages one-to-one
  conversationId: { 
    type: String, 
    required: function() { return !this.isGroupMessage; },
    index: true 
  },
   reactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // L'utilisateur qui a réagi
            required: true
        },
        emoji: {
            type: String,  // L'emoji en chaîne de caractères
            required: true
        }
    }],
  status: { type: String, enum: ['livré', 'non-livré'], default: 'non-livré' }
});




// Index pour accélérer les recherches par conversationId
messageSchema.index({ conversationId: 1, date_creation: 1 });
module.exports = mongoose.model("Message", messageSchema);
