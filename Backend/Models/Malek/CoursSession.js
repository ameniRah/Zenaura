const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoursSessionSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    cours_id: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        required: true
    },
    // Nouveau champ pour les participants
    participants: [{
        user_id: {
            type: String,
            required: true
        },
        inscription_date: {
            type: Date,
            default: Date.now
        }
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CoursSession', CoursSessionSchema);