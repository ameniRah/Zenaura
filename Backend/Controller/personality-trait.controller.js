const PersonalityTrait = require('../Models/personality-trait.model');

const getAll = async (req, res) => {
  try {
    const traits = await PersonalityTrait.find();
    res.status(200).json(traits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findById(req.params.id);
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json(trait);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const trait = await PersonalityTrait.create(req.body);
    res.status(201).json(trait);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json(trait);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrait = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findByIdAndDelete(req.params.id);
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json({ message: 'Trait deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getByCategory = async (req, res) => {
  try {
    const traits = await PersonalityTrait.find({ category: req.params.category });
    res.status(200).json(traits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateScore = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findById(req.body.traitId);
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    // Add score validation logic here
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRelatedTraits = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findById(req.params.id).populate('relatedTraits');
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json(trait.relatedTraits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRelationships = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findByIdAndUpdate(
      req.params.id,
      { relatedTraits: req.body.relatedTraits },
      { new: true }
    );
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json(trait);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssessmentMethods = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findById(req.params.id);
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json(trait.assessmentMethods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAssessmentMethods = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findByIdAndUpdate(
      req.params.id,
      { assessmentMethods: req.body.methods },
      { new: true }
    );
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json(trait);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restore = async (req, res) => {
  try {
    const trait = await PersonalityTrait.findByIdAndUpdate(
      req.params.id,
      { deleted: false },
      { new: true }
    );
    if (!trait) return res.status(404).json({ message: 'Trait not found' });
    res.status(200).json(trait);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  delete: deleteTrait,
  getByCategory,
  validateScore,
  getRelatedTraits,
  updateRelationships,
  getAssessmentMethods,
  updateAssessmentMethods,
  restore
};