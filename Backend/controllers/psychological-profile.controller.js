/* const PsychologicalProfile = require('../models/PsychologicalProfile');

exports.createProfile = async (req, res) => {
  try {
    const newProfile = new PsychologicalProfile({
      ...req.body,
      updatedAt: new Date()
    });
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await PsychologicalProfile.find().populate('userId', 'username email');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await PsychologicalProfile.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('traits.traitId', 'name category');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      updatedAt: new Date(),
      traits: req.body.traits.map(trait => ({
        ...trait,
        lastUpdated: new Date()
      }))
    };

    const updatedProfile = await PsychologicalProfile.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await PsychologicalProfile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Additional controller method
exports.getProfilesByUser = async (req, res) => {
  try {
    const profiles = await PsychologicalProfile.find({ userId: req.params.userId })
      .populate('traits.traitId', 'name category');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */