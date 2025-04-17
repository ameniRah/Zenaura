const mongoose = require('mongoose');
const PersonalityTrait = require('../../models/personality-trait.model');
require('../setup');

describe('PersonalityTrait Model Test', () => {
  const validTraitData = {
    name: 'Openness',
    description: 'Openness to experience',
    category: 'Big Five',
    measurementScale: {
      min: 0,
      max: 100
    },
    metadata: {
      version: 1,
      source: 'Research Paper',
      lastModified: new Date()
    }
  };

  it('should create & save trait successfully', async () => {
    const validTrait = new PersonalityTrait(validTraitData);
    const savedTrait = await validTrait.save();
    
    expect(savedTrait._id).toBeDefined();
    expect(savedTrait.name).toBe(validTraitData.name);
    expect(savedTrait.category).toBe(validTraitData.category);
  });

  it('should fail to save trait without required fields', async () => {
    const traitWithoutRequiredField = new PersonalityTrait({ name: 'Test' });
    let err;
    try {
      await traitWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should validate score correctly', async () => {
    const trait = new PersonalityTrait(validTraitData);
    await trait.save();
    
    expect(trait.validateScore(50)).toBe(true);
    expect(trait.validateScore(-1)).toBe(false);
    expect(trait.validateScore(101)).toBe(false);
  });

  it('should update version on modification', async () => {
    const trait = new PersonalityTrait(validTraitData);
    await trait.save();
    
    trait.description = 'Updated description';
    await trait.save();
    
    expect(trait.metadata.version).toBe(2);
  });

  it('should validate measurement scale', async () => {
    const invalidScale = {
      ...validTraitData,
      measurementScale: {
        min: 100,
        max: 0
      }
    };
    
    let err;
    try {
      const trait = new PersonalityTrait(invalidScale);
      await trait.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });

  it('should add related trait successfully', async () => {
    const trait1 = new PersonalityTrait(validTraitData);
    await trait1.save();
    
    const trait2 = new PersonalityTrait({
      ...validTraitData,
      name: 'Conscientiousness'
    });
    await trait2.save();
    
    trait1.relatedTraits = [trait2._id];
    await trait1.save();
    
    const savedTrait = await PersonalityTrait.findById(trait1._id);
    expect(savedTrait.relatedTraits).toHaveLength(1);
    expect(savedTrait.relatedTraits[0].toString()).toBe(trait2._id.toString());
  });
}); 