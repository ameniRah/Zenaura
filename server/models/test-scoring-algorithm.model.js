const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestScoringAlgorithmSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  algorithm: {
    type: { 
      type: String, 
      required: true,
      enum: ['SUM', 'WEIGHTED_SUM', 'CUSTOM'],
      default: 'SUM'
    },
    traitCalculations: [{
      traitId: { type: Schema.Types.ObjectId, ref: 'PersonalityTrait', required: true },
      questions: [{
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        weight: { type: Number, default: 1.0 }
      }],
      normalization: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
      }
    }]
  },
  version: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestScoringAlgorithm', TestScoringAlgorithmSchema);