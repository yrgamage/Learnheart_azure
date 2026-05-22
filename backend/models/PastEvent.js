const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const pastEventSchema = new mongoose.Schema({
    organizationId: {
        type: String,
        required: true
    },
    schoolName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    seminarDate: {
        type: Date,
        required: true
    },
    images: [{
        type: String, // Base64 encoded images
        required: true
    }],
    reviews: [reviewSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PastEvent', pastEventSchema); 