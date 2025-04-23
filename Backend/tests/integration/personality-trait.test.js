const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const { validTraitData, generateToken } = require('../test-helpers');
const PersonalityTrait = require('../../models/personality-trait.model');

// Increase timeout for all tests
jest.setTimeout(30000);

describe('Personality Trait API Endpoints', () => {
  let adminToken, userToken;

  beforeAll(() => {
    // Ensure we're in test environment
    process.env.NODE_ENV = 'test';
  });

  beforeEach(async () => {
    // Generate test tokens
    adminToken = `test-admin-token`;
    userToken = `test-user-token`;

    // Clean up database
    await PersonalityTrait.deleteMany({});
  });

  describe('POST /api/personality-traits', () => {
    it('should create a new trait when admin', async () => {
      const response = await request(app)
        .post('/api/personality-traits')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validTraitData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(validTraitData.name);
    });

    it('should not create trait without admin privileges', async () => {
      const response = await request(app)
        .post('/api/personality-traits')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validTraitData);

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/personality-traits')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/personality-traits', () => {
    it('should get all traits with pagination', async () => {
      await PersonalityTrait.create(validTraitData);

      const response = await request(app)
        .get('/api/personality-traits')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.traits).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter traits by category', async () => {
      await PersonalityTrait.create(validTraitData);

      const response = await request(app)
        .get('/api/personality-traits')
        .query({ category: validTraitData.category })
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.traits).toHaveLength(1);
    });
  });

  describe('PUT /api/personality-traits/:id', () => {
    it('should update trait when admin', async () => {
      const trait = await PersonalityTrait.create(validTraitData);
      const updateData = { description: 'Updated description' };

      const response = await request(app)
        .put(`/api/personality-traits/${trait._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updateData.description);
    });

    it('should not update trait without admin privileges', async () => {
      const trait = await PersonalityTrait.create(validTraitData);
      const updateData = { description: 'Updated description' };

      const response = await request(app)
        .put(`/api/personality-traits/${trait._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/personality-traits/:id', () => {
    it('should archive trait when admin', async () => {
      const trait = await PersonalityTrait.create(validTraitData);

      const response = await request(app)
        .delete(`/api/personality-traits/${trait._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      const archivedTrait = await PersonalityTrait.findById(trait._id);
      expect(archivedTrait.metadata.status).toBe('archived');
    });

    it('should not delete trait without admin privileges', async () => {
      const trait = await PersonalityTrait.create(validTraitData);

      const response = await request(app)
        .delete(`/api/personality-traits/${trait._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/personality-traits/:id/relationships', () => {
    it('should update trait relationships when admin', async () => {
      const trait1 = await PersonalityTrait.create(validTraitData);
      const trait2 = await PersonalityTrait.create({
        ...validTraitData,
        name: 'Related Trait'
      });

      const response = await request(app)
        .put(`/api/personality-traits/${trait1._id}/relationships`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ relatedTraits: [trait2._id] });

      expect(response.status).toBe(200);
      expect(response.body.relatedTraits).toContainEqual(trait2._id.toString());
    });
  });

  describe('POST /api/personality-traits/validate-score', () => {
    it('should validate score within range', async () => {
      const trait = await PersonalityTrait.create(validTraitData);

      const response = await request(app)
        .post('/api/personality-traits/validate-score')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          traitId: trait._id,
          score: 50
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
    });

    it('should invalidate score outside range', async () => {
      const trait = await PersonalityTrait.create(validTraitData);

      const response = await request(app)
        .post('/api/personality-traits/validate-score')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          traitId: trait._id,
          score: 150
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(false);
    });
  });
});