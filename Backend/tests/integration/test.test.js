const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const { validTestData, validScoringAlgorithmData, validTraitData, validQuestionData, generateToken } = require('../test-helpers');
const Test = require('../../models/test.model');
const TestCategory = require('../../models/test-category.model');
const Question = require('../../models/question.model');
const TestScoringAlgorithm = require('../../models/test-scoring-algorithm.model');

describe('Test API', () => {
  let adminToken, userToken, testCategory, scoringAlgorithm, question;

  beforeEach(async () => {
    // Clear all test data before each test
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }

    // Generate tokens
    adminToken = generateToken({ role: 'admin' });
    userToken = generateToken({ role: 'user' });

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

    question = await Question.create({
      ...validQuestionData,
      metadata: {
        ...validQuestionData.metadata,
        createdBy: new mongoose.Types.ObjectId()
      }
    });
  });

  describe('POST /api/tests', () => {
    it('should create a new test with admin privileges', async () => {
      const response = await request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...validTestData,
          category: testCategory._id,
          scoringAlgorithm: scoringAlgorithm._id,
          questions: [question._id]
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(validTestData.name);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...validTestData,
          category: testCategory._id,
          scoringAlgorithm: scoringAlgorithm._id,
          questions: [question._id]
        });

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tests', () => {
    it('should get all tests with pagination', async () => {
      await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      const response = await request(app)
        .get('/api/tests')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tests).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter tests by category', async () => {
      await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      const response = await request(app)
        .get('/api/tests')
        .query({ category: testCategory._id })
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tests).toHaveLength(1);
    });
  });

  describe('PUT /api/tests/:id', () => {
    it('should update test with admin privileges', async () => {
      const test = await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      const response = await request(app)
        .put(`/api/tests/${test._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Test Name' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Test Name');
    });

    it('should return 403 for non-admin users', async () => {
      const test = await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      const response = await request(app)
        .put(`/api/tests/${test._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Test Name' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/tests/:id', () => {
    it('should archive test with admin privileges', async () => {
      const test = await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      const response = await request(app)
        .delete(`/api/tests/${test._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const archivedTest = await Test.findById(test._id);
      expect(archivedTest.metadata.status).toBe('archived');
    });

    it('should return 403 for non-admin users', async () => {
      const test = await Test.create({
        ...validTestData,
        category: testCategory._id,
        scoringAlgorithm: scoringAlgorithm._id,
        questions: [question._id]
      });

      const response = await request(app)
        .delete(`/api/tests/${test._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
}); 