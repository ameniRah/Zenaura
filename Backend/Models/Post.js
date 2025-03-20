const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  idAuteur: { type: mongoose.Schema.Types.ObjectId },
  titre: String,
  contenu: String,
  date_creation:Date,
  likes: [{ type: mongoose.Schema.Types.Number }]
});

module.exports = mongoose.model("Post", PostSchema);
