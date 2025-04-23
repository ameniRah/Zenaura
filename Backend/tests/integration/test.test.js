const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const { validTestData, validQuestionData, validScoringAlgorithmData } = require('../test-helpers');
const Test = require('../../Models/test.model');
const Question = require('../../Models/question.model');
const TestScoringAlgorithm = require('../../Models/test-scoring-algorithm.model');

jest.setTimeout(30000);

describe('Test API', () => {
  let adminToken, userToken, questionId, algorithmId;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(async () => {
    // Generate test tokens
    adminToken = `test-admin-token`;
    userToken = `test-user-token`;

    // Clean up collections
    await Test.deleteMany({});
    await Question.deleteMany({});
    await TestScoringAlgorithm.deleteMany({});

    // Create dependencies for test data
    const question = await Question.create(validQuestionData);
    questionId = question._id;

    const algorithm = await TestScoringAlgorithm.create({
      ...validScoringAlgorithmData,
      metadata: {
        ...validScoringAlgorithmData.metadata,
        createdBy: new mongoose.Types.ObjectId()
      }
    });
    algorithmId = algorithm._id;
  });

  describe('POST /api/tests', () => {
    it('should create a new test with admin privileges', async () => {
      const testData = {
        ...validTestData,
        questions: [questionId],
        scoringAlgorithm: algorithmId
      };

      const response = await request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(testData.name);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...validTestData,
          questions: [questionId],
          scoringAlgorithm: algorithmId
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
        questions: [questionId],
        scoringAlgorithm: algorithmId
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
        questions: [questionId],
        scoringAlgorithm: algorithmId
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
        questions: [questionId],
        scoringAlgorithm: algorithmId
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
        questions: [questionId],
        scoringAlgorithm: algorithmId
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
        questions: [questionId],
        scoringAlgorithm: algorithmId
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
        questions: [questionId],
        scoringAlgorithm: algorithmId
      });

      const response = await request(app)
        .delete(`/api/tests/${test._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});