const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../Config/test.config');

const generateToken = (payload) => {
  return jwt.sign(
    { 
      ...payload,
      _id: new mongoose.Types.ObjectId(),
      email: payload.role === 'admin' ? 'admin@test.com' : 'user@test.com'
    }, 
    config.JWT_SECRET || 'test_jwt_secret',
    { expiresIn: '1h' }
  );
};

const validQuestionData = {
  text: 'Test Question',
  type: 'multiple_choice',
  category: new mongoose.Types.ObjectId(),
  options: [
    { text: 'Option 1', value: 1 },
    { text: 'Option 2', value: 2 },
    { text: 'Option 3', value: 3 }
  ],
  scoring: {
    maxScore: 1
  },
  metadata: {
    createdBy: new mongoose.Types.ObjectId(),
    status: 'active',
    version: 1
  }
};

const validTestData = {
  name: 'Test Name',
  description: 'Test Description that is at least 10 characters long',
  type: 'personality',
  duration: {
    minimum: 15,
    maximum: 45,
    estimated: 30
  },
  configuration: {
    maxScore: 100,
    passingScore: 70,
    allowRetake: true,
    showResults: true
  },
  questions: [new mongoose.Types.ObjectId()], // Will be replaced with actual question IDs in tests
  metadata: {
    createdBy: new mongoose.Types.ObjectId(),
    status: 'active',
    version: 1
  },
  requirements: {
    minimumAge: 18,
    prerequisites: [],
    restrictions: []
  },
  localization: {
    languages: ['en'],
    defaultLanguage: 'en'
  }
};

const validScoringAlgorithmData = {
  name: 'Test Scoring Algorithm',
  description: 'Test Description that is at least 10 characters long',
  type: 'simple', // Changed from 'weighted' to match enum
  configuration: {
    baseScore: 0,
    maxScore: 100,
    weights: {
      correctAnswer: 1,
      timeBonus: {
        enabled: false,
        factor: 0.1
      }
    },
    normalization: {
      method: 'none'
    }
  },
  traitCalculations: [{
    formula: 'sum', // Added default formula
    weight: 1
  }],
  metadata: {
    status: 'testing',
    version: 1
  }
};

const validTraitData = {
  name: 'Test Trait',
  description: 'Test Description that is at least 10 characters long',
  category: 'Big Five',
  measurementScale: {
    min: 0,
    max: 100
  },
  metadata: {
    status: 'active',
    version: 1
  }
};

const validProfileData = {
  anonymousId: 'test-anonymous-id-123',
  traitScores: [],
  metadata: {
    status: 'draft'
  },
  consent: {
    dataUsage: true,
    research: true
  }
};

module.exports = {
  generateToken,
  validTestData,
  validScoringAlgorithmData,
  validTraitData,
  validProfileData,
  validQuestionData
};