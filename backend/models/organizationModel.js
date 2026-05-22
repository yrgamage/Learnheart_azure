const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    orgID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    userID: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: false
    },
    seminarLocations: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Organization', organizationSchema);