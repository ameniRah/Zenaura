const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PsychologicalProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  traits: [{
    traitId: { type: Schema.Types.ObjectId, ref: 'PersonalityTrait', required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true },
    interpretation: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
  }],
  summary: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PsychologicalProfile', PsychologicalProfileSchema);