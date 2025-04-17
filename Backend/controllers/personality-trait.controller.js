const BaseController = require('./base.controller');
const PersonalityTrait = require('../models/personality-trait.model');

class PersonalityTraitController extends BaseController {
  constructor() {
    super(PersonalityTrait);
  }

  // Override getAll to match expected response format
  getAll = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      
      // Build query
      let query = { 'metadata.status': { $ne: 'archived' } };
      
      // Add filters if provided
      if (req.query.category) {
        query.category = req.query.category;
      }

      // Execute query with pagination
      const [traits, total] = await Promise.all([
        this.model
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        this.model.countDocuments(query)
      ]);

      res.status(200).json({
        traits,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Get traits by category
  getByCategory = async (req, res, next) => {
    try {
      const { category } = req.params;
      const traits = await PersonalityTrait.findByCategory(category);

      res.status(200).json({
        data: traits
      });
    } catch (error) {
      next(error);
    }
  };

  // Validate trait score
  validateScore = async (req, res, next) => {
    try {
      const { traitId, score } = req.body;
      const trait = await PersonalityTrait.findById(traitId);

      if (!trait) {
        return res.status(404).json({
          error: 'Trait not found'
        });
      }

      const isValid = trait.validateScore(score);

      res.status(200).json({
        isValid,
        trait: trait.name,
        score,
        scale: trait.measurementScale
      });
    } catch (error) {
      next(error);
    }
  };

  // Get related traits
  getRelatedTraits = async (req, res, next) => {
    try {
      const trait = await PersonalityTrait.findById(req.params.id)
        .populate('relatedTraits');

      if (!trait) {
        return res.status(404).json({
          error: 'Trait not found'
        });
      }

      res.status(200).json(trait.relatedTraits);
    } catch (error) {
      next(error);
    }
  };

  // Update trait relationships
  updateRelationships = async (req, res, next) => {
    try {
      const { relatedTraits } = req.body;
      const trait = await PersonalityTrait.findById(req.params.id);

      if (!trait) {
        return res.status(404).json({
          error: 'Trait not found'
        });
      }

      // Validate relationships
      for (const relatedId of relatedTraits) {
        const relatedTrait = await PersonalityTrait.findById(relatedId);
        if (!relatedTrait) {
          return res.status(400).json({
            error: `Related trait ${relatedId} not found`
          });
        }
      }

      trait.relatedTraits = relatedTraits;
      await trait.save();

      res.status(200).json(trait);
    } catch (error) {
      next(error);
    }
  };

  // Get assessment methods for a trait
  getAssessmentMethods = async (req, res, next) => {
    try {
      const trait = await PersonalityTrait.findById(req.params.id);

      if (!trait) {
        return res.status(404).json({
          error: 'Trait not found'
        });
      }

      res.status(200).json(trait.assessmentMethods);
    } catch (error) {
      next(error);
    }
  };

  // Update assessment methods
  updateAssessmentMethods = async (req, res, next) => {
    try {
      const { methods } = req.body;
      const trait = await PersonalityTrait.findById(req.params.id);

      if (!trait) {
        return res.status(404).json({
          error: 'Trait not found'
        });
      }

      trait.assessmentMethods = methods;
      await trait.save();

      res.status(200).json(trait);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new PersonalityTraitController(); 