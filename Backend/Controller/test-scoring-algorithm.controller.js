const TestScoringAlgorithm = require('../models/test-scoring-algorithm.model');
const Test = require('../models/test.model');
const PersonalityTrait = require('../models/personality-traits.model');
const Question = require('../models/question.model');

// @desc    Get all scoring algorithms
exports.getAllTestScoringAlgorithms = async (req, res) => {
  try {
    const algorithms = await TestScoringAlgorithm.find()
      .populate('testId', 'name description')
      .populate('algorithm.traitCalculations.traitId', 'name dimension')
      .populate('algorithm.traitCalculations.questions.questionId', 'text options')
      .sort({ createdAt: -1 });

    res.status(200).json(algorithms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get scoring algorithm by ID
exports.getTestScoringAlgorithmById = async (req, res) => {
  try {
    const algorithm = await TestScoringAlgorithm.findById(req.params.id)
      .populate('testId')
      .populate('algorithm.traitCalculations.traitId')
      .populate('algorithm.traitCalculations.questions.questionId');

    if (!algorithm) {
      return res.status(404).json({ message: 'Scoring algorithm not found' });
    }

    res.status(200).json(algorithm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new scoring algorithm
exports.createTestScoringAlgorithm = async (req, res) => {
  try {
    const newAlgorithm = new TestScoringAlgorithm({
      ...req.body,
      updatedAt: Date.now()
    });

    const savedAlgorithm = await newAlgorithm.save();
    
    // Populate references after creation
    const populatedAlgorithm = await TestScoringAlgorithm.populate(savedAlgorithm, [
      { path: 'testId' },
      { path: 'algorithm.traitCalculations.traitId' },
      { path: 'algorithm.traitCalculations.questions.questionId' }
    ]);

    res.status(201).json(populatedAlgorithm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update scoring algorithm
exports.updateTestScoringAlgorithm = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };

    const updatedAlgorithm = await TestScoringAlgorithm.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('testId')
      .populate('algorithm.traitCalculations.traitId')
      .populate('algorithm.traitCalculations.questions.questionId');

    if (!updatedAlgorithm) {
      return res.status(404).json({ message: 'Scoring algorithm not found' });
    }

    res.status(200).json(updatedAlgorithm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete scoring algorithm
exports.deleteTestScoringAlgorithm = async (req, res) => {
  try {
    const deletedAlgorithm = await TestScoringAlgorithm.findByIdAndDelete(req.params.id);
    
    if (!deletedAlgorithm) {
      return res.status(404).json({ message: 'Scoring algorithm not found' });
    }

    res.status(200).json({ 
      message: 'Scoring algorithm deleted successfully',
      deletedId: deletedAlgorithm._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get algorithms by test
exports.getAlgorithmsByTest = async (req, res) => {
  try {
    const algorithms = await TestScoringAlgorithm.find({ testId: req.params.testId })
      .populate('algorithm.traitCalculations.traitId', 'name')
      .sort({ version: -1 });

    res.status(200).json(algorithms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};