const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  instructions: { 
    type: String, 
    required: true 
  },
  estimatedTime: { 
    type: Number, 
    required: true 
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'TestCategory', 
    required: true 
  },
  questions: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Question' 
  }],
  targetTraits: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'PersonalityTrait' 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Test', TestSchema); // Test model 
