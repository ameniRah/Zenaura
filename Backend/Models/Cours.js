const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoursSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'CoursCategory', // Référence à CourseCategory
        required: true
    },

    instructor_id: { type: String, required: true }, // Utilise une chaîne pour l'instant

    /*instructor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Instructor', // Référence à Instructor
        required: true
    },*/
    
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cours', CoursSchema);
