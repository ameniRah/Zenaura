const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Evenemnts = new Schema({
  titre: String,
  description: String,
  date: Date,
  heure_debut: String,
  duree: Number,
  capacite: Number,
  participants: [
    {
      id_patient: { type: mongoose.Schema.Types.ObjectId },
      inscrit_le: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Evenemnts", Evenemnts);
