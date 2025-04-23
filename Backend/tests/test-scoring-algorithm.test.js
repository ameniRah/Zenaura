const mongoose = require('mongoose');
const TestScoringAlgorithm = require('../Models/test-scoring-algorithm.model');

describe('TestScoringAlgorithm Model', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await TestScoringAlgorithm.deleteMany({});
  });

  describe('Model Validation', () => {
    it('should validate required fields', async () => {
      const invalidAlgorithm = new TestScoringAlgorithm({});
      let error;
      try {
        await invalidAlgorithm.save();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.description).toBeDefined();
      expect(error.errors.type).toBeDefined();
      expect(error.errors['configuration.maxScore']).toBeDefined();
    });

    it('should validate enum values for type field', async () => {
      const validTypes = ['simple', 'weighted', 'adaptive', 'custom', 'standardized'];
      for (const type of validTypes) {
        const algorithm = new TestScoringAlgorithm({
          name: `Test Algorithm ${type}`,
          description: 'Test Description',
          type: type,
          configuration: { maxScore: 100 }
        });
        
        let error;
        try {
          await algorithm.validate();
        } catch (err) {
          error = err;
        }
        expect(error).toBeUndefined();
      }
    });
  });

  describe('Score Calculation Methods', () => {
    let algorithm;

    beforeEach(async () => {
      algorithm = await TestScoringAlgorithm.create({
        name: 'Test Algorithm',
        description: 'Test Description',
        type: 'simple',
        configuration: {
          maxScore: 100,
          weights: {
            correctAnswer: 1
          }
        },
        traitCalculations: [] // Empty array is valid
      });
    });

    it('should calculate simple score correctly', () => {
      const responses = [
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true }
      ];
      const score = algorithm.calculateSimpleScore(responses);
      expect(score).toBe(2); // 2 correct answers * weight of 1
    });

    it('should normalize z-score correctly', () => {
      algorithm.configuration.normalization = {
        method: 'z-score',
        parameters: {
          mean: 50,
          standardDeviation: 10
        }
      };
      const score = algorithm.calculateZScore(70);
      expect(score).toBe(2); // (70 - 50) / 10 = 2
    });

    it('should handle percentile calculation', () => {
      algorithm.statistics = {
        averageScore: 50,
        standardDeviation: 10
      };
      const score = algorithm.calculatePercentile(70);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Middleware and Versioning', () => {
    it('should increment version on modification', async () => {
      const algorithm = await TestScoringAlgorithm.create({
        name: 'Version Test',
        description: 'Test Description',
        type: 'simple',
        configuration: { maxScore: 100 }
      });

      const initialVersion = algorithm.metadata.version;
      algorithm.description = 'Updated Description';
      await algorithm.save();
      
      expect(algorithm.metadata.version).toBe(initialVersion + 1);
    });
  });

  describe('Configuration Validation', () => {
    it('should require maxScore in configuration', async () => {
      const algorithm = new TestScoringAlgorithm({
        name: 'Config Test',
        description: 'Test Description',
        type: 'simple',
        configuration: {}
      });

      let error;
      try {
        await algorithm.save();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors['configuration.maxScore']).toBeDefined();
    });
  });

  describe('Trait Calculations', () => {
    it('should validate trait calculations structure', async () => {
      const algorithm = await TestScoringAlgorithm.create({
        name: 'Trait Test',
        description: 'Test Description',
        type: 'simple',
        configuration: { maxScore: 100 },
        traitCalculations: [{
          trait: new mongoose.Types.ObjectId(),
          formula: 'sum',
          weight: 1.5,
          threshold: { min: 0, max: 100 }
        }]
      });

      expect(algorithm.traitCalculations[0].formula).toBe('sum');
      expect(algorithm.traitCalculations[0].weight).toBe(1.5);
    });
  });
});