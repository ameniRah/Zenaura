const mongoose = require('mongoose');

const personalityTraitSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength: [2, 'Trait name must be at least 2 characters long'],
        maxlength: [100, 'Trait name cannot exceed 100 characters'],
        unique: true
    },
    description: { 
        type: String, 
        required: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    category: { 
        type: String, 
        enum: ['Big Five', 'MBTI', 'HEXACO', 'Custom'],
        required: true 
    },
    measurementScale: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    metadata: {
        version: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ['active', 'inactive', 'archived'],
            default: 'active'
        },
        updatedAt: { type: Date, default: Date.now }
    },
    relatedTraits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PersonalityTrait' }],
    assessmentMethods: [{ 
        type: String,
        enum: ['questionnaire', 'observation', 'interview', 'behavioral']
    }]
}, { timestamps: true });

// Validate that max is greater than min
personalityTraitSchema.pre('validate', function(next) {
    if (this.measurementScale.max <= this.measurementScale.min) {
        this.invalidate('measurementScale.max', 'Maximum value must be greater than minimum value');
    }
    next();
});

// Update metadata version on save
personalityTraitSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.metadata.version += 1;
    }
    this.metadata.updatedAt = new Date();
    next();
});

// Method to validate a score
personalityTraitSchema.methods.validateScore = function(score) {
    return score >= this.measurementScale.min && score <= this.measurementScale.max;
};

// Method to add related trait
personalityTraitSchema.methods.addRelatedTrait = async function(traitId) {
    if (!this.relatedTraits.includes(traitId)) {
        this.relatedTraits.push(traitId);
        await this.save();
    }
    return this;
};

// Static method to find by category
personalityTraitSchema.statics.findByCategory = function(category) {
    return this.find({ category, 'metadata.status': 'active' });
};

module.exports = mongoose.model('PersonalityTrait', personalityTraitSchema);
