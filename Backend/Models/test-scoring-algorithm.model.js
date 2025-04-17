const mongoose = require('mongoose');

const testScoringAlgorithmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Algorithm name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Algorithm description is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['simple', 'weighted', 'adaptive', 'custom'],
    required: true
  },
  configuration: {
    baseScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      required: true
    },
    weights: {
      correctAnswer: {
        type: Number,
        default: 1
      },
      timeBonus: {
        enabled: {
          type: Boolean,
          default: false
        },
        factor: {
          type: Number,
          default: 0.1
        }
      },
      consistencyPenalty: {
        enabled: {
          type: Boolean,
          default: false
        },
        factor: {
          type: Number,
          default: 0.1
        }
      }
    },
    normalization: {
      method: {
        type: String,
        enum: ['none', 'z-score', 'percentile', 'custom'],
        default: 'none'
      },
      parameters: {
        mean: Number,
        standardDeviation: Number,
        customFormula: String
      }
    }
  },
  traitCalculations: [{
    trait: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PersonalityTrait'
    },
    formula: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      default: 1
    },
    threshold: {
      min: Number,
      max: Number
    }
  }],
  adaptiveRules: [{
    condition: {
      type: String,
      enum: ['score_threshold', 'time_threshold', 'pattern_match', 'custom'],
      required: function() {
        return this.type === 'adaptive';
      }
    },
    threshold: mongoose.Schema.Types.Mixed,
    adjustment: {
      type: {
        type: String,
        enum: ['multiply', 'add', 'set', 'custom'],
        required: true
      },
      value: Number
    }
  }],
  metadata: {
    version: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['active', 'deprecated', 'testing'],
      default: 'testing'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    validationStatus: {
      isValidated: {
        type: Boolean,
        default: false
      },
      validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      validatedAt: Date
    }
  },
  statistics: {
    usageCount: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    standardDeviation: {
      type: Number,
      default: 0
    },
    reliability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  validation: {
    testCases: [{
      input: mongoose.Schema.Types.Mixed,
      expectedOutput: mongoose.Schema.Types.Mixed,
      passed: Boolean,
      error: String
    }],
    lastValidated: Date,
    validationErrors: [String]
  }
}, {
  timestamps: true
});

// Indexes
testScoringAlgorithmSchema.index({ name: 1 }, { unique: true });
testScoringAlgorithmSchema.index({ type: 1 });
testScoringAlgorithmSchema.index({ 'metadata.status': 1 });

// Methods
testScoringAlgorithmSchema.methods.calculateScore = function(responses) {
  let score = this.configuration.baseScore;
  
  switch(this.type) {
    case 'simple':
      score = this.calculateSimpleScore(responses);
      break;
    case 'weighted':
      score = this.calculateWeightedScore(responses);
      break;
    case 'adaptive':
      score = this.calculateAdaptiveScore(responses);
      break;
    case 'custom':
      score = this.calculateCustomScore(responses);
      break;
  }
  
  return this.normalizeScore(score);
};

testScoringAlgorithmSchema.methods.calculateSimpleScore = function(responses) {
  return responses.reduce((total, response) => {
    return total + (response.isCorrect ? this.configuration.weights.correctAnswer : 0);
  }, 0);
};

testScoringAlgorithmSchema.methods.normalizeScore = function(score) {
  switch(this.configuration.normalization.method) {
    case 'z-score':
      return this.calculateZScore(score);
    case 'percentile':
      return this.calculatePercentile(score);
    case 'custom':
      return this.calculateCustomNormalization(score);
    default:
      return score;
  }
};

// Middleware
testScoringAlgorithmSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.metadata.version += 1;
  }
  next();
});

const TestScoringAlgorithm = mongoose.model('TestScoringAlgorithm', testScoringAlgorithmSchema);

module.exports = TestScoringAlgorithm;