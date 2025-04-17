const mongoose = require('mongoose');
const config = require('../config/config');

// Import your models
const Test = require('../models/test.model');
const Question = require('../models/question.model');
const TestCategory = require('../models/test-category.model');
const PersonalityTrait = require('../models/personality-trait.model');
const TestSession = require('../models/test-session.model');
const TestRecommendation = require('../models/test-recommendation.model');
const PsychologicalReport = require('../models/psychological-report.model');
const PsychologicalProfile = require('../models/psychological-profile.model');
const TestScoringAlgorithm = require('../models/test-scoring-algorithm.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/zenaura_test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB for testing'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function testModels() {
  try {
    // Clear existing test data
    await TestCategory.deleteMany({});
    await PersonalityTrait.deleteMany({});
    await Question.deleteMany({});
    await Test.deleteMany({});
    
    console.log('Creating test data...');
    
    // Create a test category
    const category = new TestCategory({
      name: 'Test Category',
      description: 'A category for testing',
      iconName: 'test_icon',
      color: '#FF5733'
    });
    await category.save();
    console.log('Created test category:', category._id);
    
    // Create a personality trait
    const trait = new PersonalityTrait({
      name: 'Test Trait',
      description: 'A trait for testing',
      category: 'Test Category',
      interpretationRanges: [
        {
          min: 0,
          max: 5,
          label: 'Low',
          description: 'Low level of this trait'
        },
        {
          min: 6,
          max: 10,
          label: 'High',
          description: 'High level of this trait'
        }
      ]
    });
    await trait.save();
    console.log('Created personality trait:', trait._id);
    
    // Create a question
    const question = new Question({
      text: 'This is a test question?',
      type: 'LIKERT_5',
      options: [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree' },
        { value: 5, label: 'Strongly Agree' }
      ],
      traitId: trait._id,
      scoreMapping: new Map([
        ['1', -2],
        ['2', -1],
        ['3', 0],
        ['4', 1],
        ['5', 2]
      ]),
      required: true
    });
    await question.save();
    console.log('Created question:', question._id);
    
    // Create a test
    const test = new Test({
      title: 'Test Psychological Assessment',
      description: 'A test for testing purposes',
      instructions: 'Answer all questions honestly',
      estimatedTime: 10,
      categoryId: category._id,
      questions: [question._id],
      targetTraits: [trait._id],
      isActive: true
    });
    await test.save();
    console.log('Created test:', test._id);
    
    // Create a test scoring algorithm
    const scoringAlgorithm = new TestScoringAlgorithm({
      name: 'Test Scoring Algorithm',
      description: 'Algorithm for scoring the test',
      testId: test._id,
      algorithm: {
        type: 'WEIGHTED_SUM',
        traitCalculations: [
          {
            traitId: trait._id,
            questions: [
              {
                questionId: question._id,
                weight: 1.0
              }
            ],
            normalization: {
              min: -10,
              max: 10
            }
          }
        ]
      },
      version: '1.0'
    });
    await scoringAlgorithm.save();
    console.log('Created scoring algorithm:', scoringAlgorithm._id);
    
    // Verify data was saved correctly
    const tests = await Test.find().populate('categoryId').populate('questions').populate('targetTraits');
    console.log('\nVerification:');
    console.log('Found', tests.length, 'tests');
    console.log('Test details:', {
      title: tests[0].title,
      category: tests[0].categoryId.name,
      questionCount: tests[0].questions.length,
      traitCount: tests[0].targetTraits.length
    });
    
    console.log('\nAll models tested successfully!');
  } catch (error) {
    console.error('Error testing models:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testModels();