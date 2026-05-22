const mongoose = require('mongoose');
const { Schema } = mongoose;

const seminarSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
            default: "Seminar"
        },
        description: {
            type: String,
            required:false,
            default: "This is a seminar"
        },
        rating: {
            type: Number,
            required: false,
            default: 0
        },
        location: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            required: false,
            default: "pending"
        },
        subject: {
            type: String,
            required: false
        },
        grade: {
            type: Number,
            required: false
        },
        medium: {
            type: String,
            required: false
        },
        expStudentCount: {
            type: Number,
            required:false
        },
        expTeacherCount: {
            type: Number,
            required: false
        },
        additionalRequests: {
            type: String,
            required: false,
            default: "No additional requests"
        },
        expDate: {
            type: Date,
            required: false
        },
        volunteers: [
            {
                volunteerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Volunteer', // Reference to the Volunteer model
                },
            },
        ],
        schoolId: {
            type :String,
            //type: mongoose.Schema.Types.ObjectId,
            //ref: 'School', 
            required: false // Reference to the School model
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        },
        organization: {
            type: String,
            required: false
        },
    },
    {
        timestamps: false, // Show timestamps
    }
);

module.exports = mongoose.model('Seminar', seminarSchema);
