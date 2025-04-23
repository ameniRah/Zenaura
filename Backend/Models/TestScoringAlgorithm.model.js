const mongoose = require('mongoose');

const testScoringAlgorithmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },    const { validateUser, validateRequest } = require('../Middll/validation.middleware');
    
    // For user validation
    router.post('/users', validateUser, userController.createUser);
    
    // For other validations using express-validator
    router.post('/something', someValidationRules(), validateRequest, someController.someAction);
    type: {
        type: String,
        required: true,
        enum: ['personality', 'aptitude', 'intelligence']
    },
    formula: {
        type: String,
        required: true
    },
    parameters: [{
        name: String,
        type: String,
        weight: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('TestScoringAlgorithm', testScoringAlgorithmSchema);
