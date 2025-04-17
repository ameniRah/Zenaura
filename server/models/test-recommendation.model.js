const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestRecommendationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  recommendedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  priority: { 
    type: String, 
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  status: { 
    type: String, 
    required: true,
    enum: ['PENDING', 'COMPLETED', 'DECLINED'],
    default: 'PENDING'
  },
  expiryDate: { type: Date },
  completedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestRecommendation', TestRecommendationSchema);