const mongoose = require('mongoose')
const { Schema } = mongoose;

const schoolSchema = new Schema(
    {
        schoolName: {
            type: String,
            required: true
        },
        contact: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: false,
            match: [/.+\@.+\..+/, "Please fill a valid email address"],
        },
        userID: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        website: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('School', schoolSchema);
