const mongoose = require('mongoose');
const config = require('../config/config');
const TestCategory = require('../models/test-category.model');
const PersonalityTrait = require('../models/personality-trait.model');
const Question = require('../models/question.model');
const Test = require('../models/test.model');
const TestScoringAlgorithm = require('../models/test-scoring-algorithm.model');

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const testCategoriesData = [
  {
    name: 'Personality Assessment',
    description: 'Tests that evaluate various aspects of personality and character traits.',
    iconName: 'personality_icon',
    color: '#4a90e2'
  },
  {
    name: 'Mental Health Screening',
    description: 'Tests for screening common mental health conditions.',
    iconName: 'mental_health_icon',
    color: '#50c878'
  },
  {
    name: 'Cognitive Assessment',
    description: 'Tests that evaluate cognitive abilities and functions.',
    iconName: 'cognitive_icon',
    color: '#9370db'
  }
];

const personalityTraitsData = [
  {
    name: 'Openness',
    description: 'Appreciation for art, emotion, adventure, unusual ideas, curiosity, and variety of experience.',
    category: 'Big Five',
    interpretationRanges: [
      {
        min: -10,
        max: -5,
        label: 'Very Low',
        description: 'Prefers routine, practical, and traditional approaches.'
      },
      {
        min: -5,
        max: 0,
        label: 'Low',
        description: 'Tends to be conventional and traditional.'
      },
      {
        min: 0,
        max: 5,
        label: 'High',
        description: 'Curious and open to new experiences.'
      },
      {
        min: 5,
        max: 10,
        label: 'Very High',
        description: 'Extremely creative, imaginative, and intellectually curious.'
      }
    ]
  },
  {
    name: 'Extraversion',
    description: 'Energy, positive emotions, surgency, assertiveness, sociability and the tendency to seek stimulation in the company of others.',
    category: 'Big Five',
    interpretationRanges: [
      {
        min: -10,
        max: -5,
        label: 'Very Low',
        description: 'Strongly introverted, prefers solitude and quiet environments.'
      },
      {
        min: -5,
        max: 0,
        label: 'Low',
        description: 'Tends to be reserved and thinks before speaking.'
      },
      {
        min: 0,
        max: 5,
        label: 'High',
        description: 'Outgoing and sociable, enjoys being with others.'
      },
      {
        min: 5,
        max: 10,
        label: 'Very High',
        description: 'Extremely extraverted, energized by social interaction.'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await TestCategory.deleteMany({});
    await PersonalityTrait.deleteMany({});
    await Question.deleteMany({});
    await Test.deleteMany({});
    await TestScoringAlgorithm.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert test categories
    const categories = await TestCategory.insertMany(testCategoriesData);
    console.log('Inserted test categories:', categories.map(c => c._id));
    
    // Insert personality traits
    const traits = await PersonalityTrait.insertMany(personalityTraitsData);
    console.log('Inserted personality traits:', traits.map(t => t._id));
    
    // Create sample questions
    const questions = [];
    
    // Question for Openness
    questions.push(new Question({
      text: 'I see myself as someone who is curious about many different things.',
      type: 'LIKERT_5',
      options: [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree' },
        { value: 5, label: 'Strongly Agree' }
      ],
      traitId: traits[0]._id,
      scoreMapping: new Map([
        ['1', -2],
        ['2', -1],
        ['3', 0],
        ['4', 1],
        ['5', 2]
      ]),
      required: true
    }));
    
    // Question for Extraversion
    questions.push(new Question({
      text: 'I see myself as someone who is talkative.',
      type: 'LIKERT_5',
      options: [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree' },
        { value: 5, label: 'Strongly Agree' }
      ],
      traitId: traits[1]._id,
      scoreMapping: new Map([
        ['1', -2],
        ['2', -1],
        ['3', 0],
        ['4', 1],
        ['5', 2]
      ]),
      required: true
    }));
    
    // Save questions
    for (const question of questions) {
      await question.save();
    }
    console.log('Inserted questions:', questions.map(q => q._id));
    
    // Create a test
    const test = new Test({
      title: 'Big Five Personality Assessment',
      description: 'Evaluates five major dimensions of personality: openness, conscientiousness, extraversion, agreeableness, and neuroticism.',
      instructions: 'Please answer each question honestly, rating how much you agree with each statement on a scale from 1 (strongly disagree) to 5 (strongly agree).',
      estimatedTime: 15,
      categoryId: categories[0]._id,
      questions: questions.map(q => q._id),
      targetTraits: traits.map(t => t._id),
      isActive: true
    });
    
    await test.save();
    console.log('Inserted test:', test._id);
    
    // Create scoring algorithm
    const scoringAlgorithm = new TestScoringAlgorithm({
      name: 'Big Five Scoring Algorithm',
      description: 'Algorithm for scoring the Big Five personality traits based on test responses.',
      testId: test._id,
      algorithm: {
        type: 'WEIGHTED_SUM',
        traitCalculations: [
          {
            traitId: traits[0]._id,
            questions: [
              {
                questionId: questions[0]._id,
                weight: 1.0
              }
            ],
            normalization: {
              min: -10,
              max: 10
            }
          },
          {
            traitId: traits[1]._id,
            questions: [
              {
                questionId: questions[1]._id,
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
    console.log('Inserted scoring algorithm:', scoringAlgorithm._id);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedDatabase();