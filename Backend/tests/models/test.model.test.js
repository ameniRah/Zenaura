const mongoose = require('mongoose');
const { validTestData, validScoringAlgorithmData, validTraitData, validQuestionData } = require('../test-helpers');
const Test = require('../../models/test.model');
const TestCategory = require('../../models/test-category.model');
const TestScoringAlgorithm = require('../../models/test-scoring-algorithm.model');
const PersonalityTrait = require('../../models/personality-trait.model');
const Question = require('../../models/question.model');

describe('Test Model', () => {
  let testCategory, scoringAlgorithm, trait, question;

  beforeEach(async () => {
    // Create test dependencies
    testCategory = await TestCategory.create({
      name: 'Test Category',
      description: 'Test Category Description',
      metadata: {
        createdBy: new mongoose.Types.ObjectId(),
        status: 'active'
      }
    });

    scoringAlgorithm = await TestScoringAlgorithm.create({
      ...validScoringAlgorithmData,
      metadata: {
        ...validScoringAlgorithmData.metadata,
        createdBy: new mongoose.Types.ObjectId()
      }
    });

    trait = await PersonalityTrait.create({
      ...validTraitData,
      metadata: {
        ...validTraitData.metadata,
        createdBy: new mongoose.Types.ObjectId()
      }
    });

    question = await Question.create({
      ...validQuestionData,
      metadata: {
        ...validQuestionData.metadata,
        createdBy: new mongoose.Types.ObjectId()
      }
    });
  });

  describe('Validation', () => {
    it('should create a valid test', async () => {
      const test = new Test({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        traits: [trait._id],
        questions: [question._id]
      });

      await expect(test.save()).resolves.toBeDefined();
      expect(test.name).toBe(validTestData.name);
    });

    it('should fail when required fields are missing', async () => {
      const test = new Test({});
      await expect(test.save()).rejects.toThrow();
    });

    it('should fail when duration is less than minimum', async () => {
      const test = new Test({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id],
        duration: {
          minimum: -1,
          maximum: 30,
          estimated: 15
        }
      });

      await expect(test.save()).rejects.toThrow();
    });
  });

  describe('Methods', () => {
    it('should check prerequisites correctly', async () => {
      const test = new Test({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id],
        prerequisites: [testCategory._id]
      });

      await test.save();
      expect(test.prerequisites).toContainEqual(testCategory._id);
    });

    it('should validate test configuration', async () => {
      const test = new Test({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      await test.save();
      await expect(test.validate()).resolves.toBe(true);
    });
  });

  describe('Static Methods', () => {
    it('should find active tests by category', async () => {
      await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id],
        metadata: { ...validTestData.metadata, status: 'active' }
      });

      const tests = await Test.findActiveByCategory(testCategory._id);
      expect(tests).toHaveLength(1);
    });
  });

  describe('Middleware', () => {
    it('should increment version on update', async () => {
      const test = await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      const initialVersion = test.metadata.version;
      test.name = 'Updated Name';
      await test.save();

      expect(test.metadata.version).toBe(initialVersion + 1);
    });
  });
}); 