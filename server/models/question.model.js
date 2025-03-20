const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['LIKERT_5', 'FREQUENCY', 'MULTIPLE_CHOICE', 'TRUE_FALSE'] 
  },
  options: [{ 
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    label: { type: String, required: true }
  }],
  traitId: { type: Schema.Types.ObjectId, ref: 'PersonalityTrait', required: true },
  scoreMapping: { type: Map, of: Number },
  required: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);