const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestCategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestCategory', TestCategorySchema);