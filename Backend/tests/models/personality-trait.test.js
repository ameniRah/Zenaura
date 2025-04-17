const mongoose = require('mongoose');
const { validTraitData } = require('../test-helpers');
const PersonalityTrait = require('../../models/personality-trait.model');

describe('PersonalityTrait Model Test', () => {
  beforeEach(async () => {
    // Clear all test data before each test
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });

  it('should create & save trait successfully', async () => {
    const validTrait = new PersonalityTrait(validTraitData);
    const savedTrait = await validTrait.save();
    
    expect(savedTrait._id).toBeDefined();
    expect(savedTrait.name).toBe(validTraitData.name);
    expect(savedTrait.category).toBe(validTraitData.category);
  });

  it('should fail to save trait without required fields', async () => {
    const traitWithoutRequiredField = new PersonalityTrait({ name: 'Test Trait' });
    await expect(traitWithoutRequiredField.save()).rejects.toThrow();
  });

  it('should validate score correctly', async () => {
    const trait = await PersonalityTrait.create(validTraitData);
    const validScore = 50;
    const invalidScore = 150;

    expect(trait.validateScore(validScore)).toBe(true);
    expect(trait.validateScore(invalidScore)).toBe(false);
  });

  it('should update version on modification', async () => {
    const trait = await PersonalityTrait.create(validTraitData);
    const initialVersion = trait.metadata.version;

    trait.description = 'Updated description';
    await trait.save();

    expect(trait.metadata.version).toBe(initialVersion + 1);
  });

  it('should validate measurement scale', async () => {
    const trait = new PersonalityTrait({
      ...validTraitData,
      measurementScale: {
        min: 10,
        max: 5
      }
    });

    await expect(trait.save()).rejects.toThrow();
  });

  it('should add related trait successfully', async () => {
    const trait1 = await PersonalityTrait.create(validTraitData);
    const trait2 = await PersonalityTrait.create({
      ...validTraitData,
      name: 'Related Trait'
    });

    trait1.relatedTraits = [trait2._id];
    await trait1.save();

    expect(trait1.relatedTraits).toContainEqual(trait2._id);
  });
}); 