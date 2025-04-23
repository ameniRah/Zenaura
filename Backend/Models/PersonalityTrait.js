const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personalityTraitSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    measurementScale: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    metadata: {
        status: {
            type: String,
            default: 'active'
        },
        version: {
            type: Number,
            default: 1
        }
    }
}, {
    timestamps: true
});

personalityTraitSchema.methods.validateScore = function (score) {
    return score >= this.measurementScale.min && score <= this.measurementScale.max;
};

personalityTraitSchema.pre('validate', function (next) {
    if (this.measurementScale.min >= this.measurementScale.max) {
        return next(new Error('Minimum scale value must be less than maximum scale value.'));
    }
    next();







});    next();    this.metadata.version = (this.metadata.version || 0) + 1;    if (!this.metadata) this.metadata = {};personalityTraitSchema.pre('save', function (next) {});
const PersonalityTrait = mongoose.model('PersonalityTrait', personalityTraitSchema);

module.exports = PersonalityTrait;