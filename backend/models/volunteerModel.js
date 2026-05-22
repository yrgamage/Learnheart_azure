const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    volunteerId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: [],
        required: false
    },
    email: {
        type: String,
        required: false
    },
    volunteerProfileImageAvailable: {
        type: Boolean,
        required: false
    },
    volunteerProfileColor: {
        type: String,
        required: false
    },
    orgID: {
        type: Schema.Types.ObjectId,
        ref: 'organizations',
        required: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
