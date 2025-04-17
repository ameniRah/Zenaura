const mongoose = require('mongoose');

const personalityTraitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trait name is required'],
    trim: true,
    minlength: [2, 'Trait name must be at least 2 characters long'],
    maxlength: [100, 'Trait name cannot exceed 100 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Big Five', 'MBTI', 'HEXACO', 'Custom']
  },
  measurementScale: {
    min: {
      type: Number,
      required: [true, 'Minimum scale value is required']
    },
    max: {
      type: Number,
      required: [true, 'Maximum scale value is required']
    },
    unit: {
      type: String,
      default: 'percentage'
    }
  },
  relatedTraits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalityTrait'
  }],
  assessmentMethods: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    reliability: {
      type: Number,
      min: 0,
      max: 1
    }
  }],
  metadata: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active'
    },
    version: {
      type: Number,
      default: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Validate that max is greater than min
personalityTraitSchema.pre('validate', function(next) {
  if (this.measurementScale.max <= this.measurementScale.min) {
    this.invalidate('measurementScale.max', 'Maximum value must be greater than minimum value');
  }
  next();
});

// Update metadata on save
personalityTraitSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.metadata.version += 1;
  }
  this.metadata.updatedAt = new Date();
  next();
});

// Method to validate a score
personalityTraitSchema.methods.validateScore = function(score) {
  return score >= this.measurementScale.min && score <= this.measurementScale.max;
};

// Method to add related trait
personalityTraitSchema.methods.addRelatedTrait = async function(traitId) {
  const exists = this.relatedTraits.includes(traitId);
  if (!exists) {
    this.relatedTraits.push(traitId);
    await this.save();
  }
  return this;
};

// Static method to find by category
personalityTraitSchema.statics.findByCategory = function(category) {
  return this.find({ category, 'metadata.status': 'active' });
};

const PersonalityTrait = mongoose.model('PersonalityTrait', personalityTraitSchema);

module.exports = PersonalityTrait;
