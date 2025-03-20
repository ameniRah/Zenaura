const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { 
    type: String, 
    required: true,
    enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
    default: 'IN_PROGRESS'
  },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedOption: { type: mongoose.Schema.Types.Mixed, required: true }
  }],
  traitScores: [{
    traitId: { type: Schema.Types.ObjectId, ref: 'PersonalityTrait', required: true },
    score: { type: Number, required: true },
    interpretation: { type: String, required: true }
  }],
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestSession', TestSessionSchema);