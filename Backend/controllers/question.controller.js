/* const question = require('../models/question');

exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = new question({
      ...req.body,
      updatedAt: new Date()
    });
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await question.find().populate('traitId', 'name category');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await question.findById(req.params.id).populate('traitId', 'name category');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await question.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('traitId', 'name category');

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Additional controller methods
exports.getQuestionsByTrait = async (req, res) => {
  try {
    const questions = await question.find({ traitId: req.params.traitId })
      .populate('traitId', 'name category');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionsByType = async (req, res) => {
  try {
    const questions = await question.find({ type: req.params.type.toUpperCase() })
      .populate('traitId', 'name category');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */